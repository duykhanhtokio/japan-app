// Lifecycle regressions: real recording selection, stale-source protection, cancellation and load failure.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
(async()=>{
 const esbuild=require(require.resolve('esbuild',{paths:[process.env.TOKUTEI_QA_MODULES||root]}));
 const b=await esbuild.build({entryPoints:[path.join(root,'src/services/dialogue-npc-audio.ts')],bundle:true,write:false,platform:'node',format:'cjs',external:['expo-audio','expo-speech'],plugins:[{name:'asset',setup(b){b.onResolve({filter:/\.mp3$/},a=>({path:a.path,external:true}));}}]});
 let device=0,finished=0,players=[];
 const mock=name=>name==='expo-speech'?{stop:async()=>{},speak:()=>device++}:name==='expo-audio'?{createAudioPlayer:()=>{const player={pause(){},remove(){this.removed=true},play(){},addListener(_,cb){this.emit=cb;return {remove(){}}}};players.push(player);return player}}:0;
 const m={exports:{}};new Function('module','exports','require',b.outputFiles[0].text)(m,m.exports,mock);
 const api=m.exports;
 const source=fs.readFileSync(path.join(root,'src/data/dialogue-content/npc-audio.generated.ts'),'utf8');
 const entry=JSON.parse(source.split('>> = ')[1].split(';\n')[0]);
 const plan=JSON.parse(fs.readFileSync(process.argv[2]||'/tmp/npc-voice-plan.json','utf8'));
 let lines=0;const roles=new Set();
 for(const [scenarioId,turns] of Object.entries(entry))for(const [turnId,recording]of Object.entries(turns)){
  const row=plan.rows.find(x=>x.scenarioId===scenarioId&&x.turnId===turnId);assert(row);
  const opts={scenarioId,turnId,category:row.category,onDone(){finished++}};
  assert(api.recordingFor(row.sourceJa,opts));assert.equal(api.recordingFor(row.sourceJa+'変更',opts),null);
  assert.equal(api.recordingFor(row.sourceJa,{...opts,turnId:'other'}),null);
  assert.equal(api.recordingFor(row.sourceJa,{...opts,scenarioId:'other'}),null);
  api.speak(row.sourceJa,opts);const p=players.at(-1);const before=finished;
  await api.stop();p.emit({didJustFinish:true});assert.equal(finished,before,'Cancelled audio cannot advance the next turn');assert(p.removed);
  api.speak(row.sourceJa,opts);players.at(-1).emit({didJustFinish:true});assert.equal(finished,before+1);
  api.speak(row.sourceJa,opts);const prior=device;players.at(-1).emit({playbackState:'error'});assert.equal(device,prior+1,'Decode failure preserves speech');
  lines++;roles.add(recording.role);
 }
 await api.stop();
 assert(lines>0);
 console.log(JSON.stringify({status:'PASS',recordedTurns:lines,roles:[...roles],staleSourceAndIdGuards:true,cancelledCallbackIgnored:true,completionFromDecoder:true,decodeErrorFallback:true,nativePlaybackReviewed:false}));
})().catch(e=>{console.error(e);process.exit(1)});
