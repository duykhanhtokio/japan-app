const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {createVoiceServer}=require('./local-server.cjs');
const listen=server=>new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve('http://127.0.0.1:'+server.address().port)));
const close=server=>new Promise(resolve=>server.close(resolve));
(async()=>{
 const seen=[],wav=Buffer.alloc(46);wav.write('RIFF');wav.writeUInt32LE(38,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(24000,24);wav.writeUInt32LE(48000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(2,40);
 const engine=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://fixture');if(url.pathname==='/speakers'){res.end(JSON.stringify([8,118,11,21].map(id=>({styles:[{id}]}))));return;}
  if(url.pathname==='/audio_query'){seen.push(Number(url.searchParams.get('speaker')));res.end('{}');return;}
  if(url.pathname==='/synthesis'){let body='';for await(const c of req)body+=c;assert.deepEqual(JSON.parse(body),{speedScale:.9,outputSamplingRate:24000,outputStereo:false});res.end(wav);return;}
  res.writeHead(404);res.end();
 });
 const cache=await fs.mkdtemp(path.join(os.tmpdir(),'npc-voice-test-')),bridge=createVoiceServer({engine:await listen(engine),cache});
 try{
  const base=await listen(bridge);assert.deepEqual((await(await fetch(base+'/health')).json()).speakerIds,[8,118,11,21]);
  for(const speakerId of [8,118,11,21]){
   const response=await fetch(base+'/speech',{method:'POST',body:JSON.stringify({text:'こんにちは。',speakerId})});assert.equal(response.status,200);
   const {url}=await response.json();const audio=Buffer.from(await(await fetch(base+url)).arrayBuffer());assert.deepEqual(audio,wav);
   const cached=await fetch(base+'/speech',{method:'POST',body:JSON.stringify({text:'こんにちは。',speakerId})});assert.equal(cached.status,200);
  }
  assert.deepEqual(seen,[8,118,11,21],'Cache must isolate approved speakers and reuse exact-source audio');
  const rejected=await fetch(base+'/speech',{method:'POST',body:JSON.stringify({text:'こんにちは。',speakerId:20})});assert.equal(rejected.status,400);
  console.log('LOCAL VOICE BRIDGE PASS: four approved IDs, settings, cache isolation, WAV delivery, excluded voice rejected. Synthetic engine fixture only.');
 }finally{await close(bridge);await close(engine);await fs.rm(cache,{recursive:true,force:true});}
})().catch(error=>{console.error(error);process.exitCode=1});
