const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
 const root = path.resolve(__dirname, '../../..');
 const build = await require('esbuild').build({entryPoints:[path.join(root,'src/services/dialogue-npc-audio.ts')],bundle:true,write:false,platform:'node',format:'cjs',external:['expo-audio','expo-asset','expo-constants','react-native'],plugins:[{name:'packed-fixture',setup(b){
 b.onLoad({filter:/dialogue-audio-packs\.ts$/},()=>({contents:`export const npcAudioRelease={complete:false}; export function packedRecordingFor(text,id,turn,role,speakerId){return text==='録音です。'&&id==='fixture'&&turn==='t1'?{sourceJa:text,role,speakerId,source:{uri:'https://example.test/voice.mp3'},startMs:12000,durationMs:2400}:null;}`,loader:'ts'}));
 b.onResolve({filter:/\.mp3$/},a=>({path:a.path,external:true}));
 }}]});
 const players=[];let done=0,errors=0,requests=0,interruption,downloadGate=null,downloadFails=false;const modes=[];
 const originalFetch=global.fetch;global.fetch=async()=>{requests++;throw Error('Unexpected learner engine request');};
 const m={exports:{}};new Function('module','exports','require',build.outputFiles[0].text)(m,m.exports,name=>{
 if(name==='expo-constants')return {expoConfig:{}};
 if(name==='react-native')return {Platform:{OS:'ios'},AppState:{addEventListener(_,fn){interruption=fn;return {remove(){}}}}};
 if(name==='expo-asset')return {Asset:{fromURI(){return {localUri:null,async downloadAsync(){if(downloadGate)await downloadGate;if(downloadFails)throw Error('download failed');this.localUri='file:///cache/voice.mp3';}}}}};
 if(name==='expo-audio')return {async setAudioModeAsync(mode){modes.push(mode)},createAudioPlayer(source){const player={source,played:false,pause(){},remove(){this.removed=true},play(){this.played=true},async seekTo(seconds){this.seek=seconds},addListener(_,fn){this.emit=fn;return {remove(){}}}};players.push(player);return player;}};
 return 1;
 });
 const api=m.exports,opts={scenarioId:'fixture',turnId:'t1',category:'shopping',onDone(){done++},onError(){errors++}},tick=()=>new Promise(setImmediate);
 try {
 api.speak('録音です。',opts);await tick();const p=players.at(-1);assert.equal(p.source.uri,'file:///cache/voice.mp3');assert.equal(modes[0].playsInSilentMode,true);assert.equal(modes[0].allowsRecording,false);assert.equal(p.played,false);p.emit({isLoaded:true});await tick();assert.equal(p.seek,12);assert(p.played);
 p.emit({playing:true,currentTime:13,duration:600});assert.equal(done,0);
 p.emit({playing:true,currentTime:14.4,duration:600});assert.equal(done,1);assert(p.removed);assert.equal(requests,0);
 api.speak('録音です。',opts);await tick();const stale=players.at(-1);stale.emit({isLoaded:true});await api.stop();await tick();assert.equal(stale.played,false);stale.emit({didJustFinish:true});assert.equal(done,1);
 api.speak('録音です。',opts);await tick();interruption('background');assert.equal(errors,1);assert(players.at(-1).removed);
 let resolveDownload;downloadGate=new Promise(resolve=>{resolveDownload=resolve});const count=players.length;api.speak('録音です。',opts);await tick();assert.equal(players.length,count,'Must not stream before download completes');await api.stop();resolveDownload();await tick();assert.equal(players.length,count,'Cancelled download must not create a player');downloadGate=null;
 downloadFails=true;api.speak('録音です。',opts);await tick();assert.equal(errors,2);assert.equal(players.length,count,'Download failure must not stream remote pack');downloadFails=false;
 assert.equal(api.recordingFor('変更',{...opts}),null);assert.equal(requests,0);
 console.log('PASS: native local download before playback, download cancellation/failure, silent-mode configuration, packed seek, millisecond conversion, sentence boundary, cancellation, interruption, exact-source binding, no engine request for packed audio');
 }finally{await api.stop();global.fetch=originalFetch;}
})().catch(e=>{console.error(e);process.exitCode=1});
