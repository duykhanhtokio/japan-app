const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
let downloads=0,players=0,complete,failNext=false;
const waits=new Map();
const mocks={
 'expo-asset':{Asset:{fromURI:uri=>({localUri:'file:///cached.mp3',downloadAsync:()=>{downloads++;if(failNext){failNext=false;return Promise.reject(Error('offline'));}return new Promise(resolve=>{complete=resolve;waits.set(uri,resolve);});}})}},
 'expo-audio':{setAudioModeAsync:async()=>{},createAudioPlayer:()=>{players++;throw Error('Unexpected playback after cancellation');}},
 'expo-constants':{__esModule:true,default:{}},'react-native':{Platform:{OS:'ios'},AppState:{}},
 './dialogue-audio-packs':{npcAudioRelease:{complete:true},packedRecordingFor:()=>({source:{uri:'https://example.test/pack.mp3'},startMs:1000,durationMs:1000})},
 '../data/dialogue-content/npc-audio.generated':{npcAudioClips:{},npcAudioEntries:{}},
 '../data/dialogue-content/npc-voice-casting.json':{categories:{},fallbackRole:'a'},
 '../data/jlpt-original/voice-casting.json':{roles:{a:{speakerId:1}}},
};
const moduleObject={exports:{}},source=fs.readFileSync('src/services/dialogue-npc-audio.ts','utf8');
vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,{module:moduleObject,exports:moduleObject.exports,require:name=>{assert(name in mocks,name);return mocks[name];},setTimeout,clearTimeout,setInterval,clearInterval,AbortController,process:{env:{}}});
(async()=>{const audio=moduleObject.exports,options={scenarioId:'test',turnId:'t1'};const a=audio.prefetch('a',options),b=audio.prefetch('b',options);assert.equal(downloads,1,'Concurrent lines from one pack share the download');audio.speak('a',options);await Promise.resolve();await audio.stop();complete();await Promise.all([a,b]);await new Promise(resolve=>setImmediate(resolve));assert.equal(players,0,'Stopped turn cannot start after download');await audio.prefetch('a',options);assert.equal(downloads,1,'Downloaded pack is reused');console.log('PASS dialogue shared prefetch, cache reuse, cancellation before decode');})().catch(e=>{console.error(e);process.exitCode=1;});
