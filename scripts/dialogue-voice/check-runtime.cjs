const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const root=path.resolve(__dirname,'../..'),esbuild=require('esbuild');
 const build=await esbuild.build({entryPoints:[path.join(root,'src/services/dialogue-npc-audio.ts')],bundle:true,write:false,platform:'node',format:'cjs',external:['expo-audio','expo-constants','react-native'],plugins:[{name:'assets',setup(b){b.onResolve({filter:/\.mp3$/},a=>({path:a.path,external:true}));}}]});
 const players=[],requests=[];let done=0,errors=0;
 const previousFetch=global.fetch;
 global.fetch=async(url,init)=>{requests.push(JSON.parse(init.body));return{ok:true,json:async()=>({url:'/clip/'+'a'.repeat(64)+'.wav'})}};
 const m={exports:{}};new Function('module','exports','require',build.outputFiles[0].text)(m,m.exports,name=>{
  if(name==='expo-constants')return {expoConfig:{hostUri:'192.168.1.10:8081'}};
  if(name==='react-native')return {Platform:{OS:'ios'}};
  if(name==='expo-audio')return{createAudioPlayer:source=>{const player={source,pause(){},remove(){this.removed=true},play(){},addListener(_,emit){this.emit=emit;return{remove(){}}}};players.push(player);return player}};
  if(name==='expo-speech')throw Error('Default device TTS must not be loaded');
  return 0;
 });
 const api=m.exports,tick=()=>new Promise(setImmediate),options={scenarioId:'unrecorded',turnId:'t1',onDone(){done++},onError(){errors++}};
 try{
  for(const [category,id] of [['shopping',8],['park',118],['station',11],['construction site',21]]){
   api.speak('新しい会話です。',{...options,category});await tick();assert.equal(requests.at(-1).speakerId,id);const player=players.at(-1);player.emit({didJustFinish:true});assert(player.removed);
  }
  assert.equal(done,4);assert.equal(errors,0);
  api.speak('中止します。',options);await tick();const player=players.at(-1);await api.stop();player.emit({didJustFinish:true});assert.equal(done,4,'Stale callbacks must not advance a later turn');
  const source=fs.readFileSync(path.join(root,'src/data/dialogue-content/npc-audio.generated.ts'),'utf8');
  const entries=JSON.parse(source.split('>> = ')[1].split(';\n')[0]),casting=require('../../src/data/dialogue-content/npc-voice-casting.json');let rows=0;
  for(const [scenarioId,turns]of Object.entries(entries))for(const [turnId,row]of Object.entries(turns)){
   const category=Object.keys(casting.categories).find(key=>casting.categories[key]===row.role);const opts={...options,scenarioId,turnId,category};
   assert(api.recordingFor(row.sourceJa,opts));assert.equal(api.recordingFor(row.sourceJa+'変更',opts),null);assert.equal(api.recordingFor(row.sourceJa,{...opts,turnId:'wrong'}),null);
   api.speak(row.sourceJa,opts);const count=requests.length;const failedPlayer=players.at(-1),doneBefore=done;failedPlayer.emit({playbackState:'error'});failedPlayer.emit({didJustFinish:true});assert.equal(done,doneBefore,'Failed decoder cannot complete replacement audio');await tick();assert.equal(requests.length,count+1,'Broken recording must recover with the same approved voice');await api.stop();rows++;
  }
  global.fetch=async()=>{throw Error('Offline')};api.speak('接続がありません。',options);await tick();assert.equal(errors,1,'Offline must report unavailability, never use default TTS');
  console.log(JSON.stringify({status:'PASS',exactSourceRecordedBindings:rows,approvedVoices:[8,118,11,21],defaultTtsDisabled:true,recordingRecovery:true,cancellation:true,nativeListeningReviewed:false}));
 }finally{await api.stop();global.fetch=previousFetch;}
})().catch(error=>{console.error(error);process.exitCode=1});
