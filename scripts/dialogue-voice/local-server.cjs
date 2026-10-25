/** Local development bridge: approved VOICEVOX voices, cached per source and settings. */
const http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const voices=require('../../src/data/jlpt-original/voice-casting.json');
const allowed=new Set(Object.values(voices.roles).map(v=>v.speakerId));
function createVoiceServer({engine='http://127.0.0.1:50021',cache=path.join(os.tmpdir(),'japan-app-approved-npc-voice')}={}) {
 const jobs=new Map();let queue=Promise.resolve();
 return http.createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
  try {
   await fs.mkdir(cache,{recursive:true});
   if(req.method==='GET'&&req.url==='/health'){
    const upstream=await fetch(engine+'/speakers',{signal:AbortSignal.timeout(5000)});
    if(!upstream.ok)throw Error('VOICEVOX is not ready');
    const ids=new Set((await upstream.json()).flatMap(s=>s.styles.map(style=>style.id)));
    if([...allowed].some(id=>!ids.has(id)))throw Error('Approved voices missing from engine');
    res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ready:true,speakerIds:[...allowed]}));return;
   }
   if(req.method==='GET'&&/^\/clip\/[a-f0-9]{64}\.wav$/.test(req.url)){
    const data=await fs.readFile(path.join(cache,req.url.slice(6)));res.setHeader('Content-Type','audio/wav');res.setHeader('Cache-Control','public,max-age=31536000,immutable');res.end(data);return;
   }
   if(req.method!=='POST'||req.url!=='/speech'){res.writeHead(404);res.end();return;}
   let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>16000){res.writeHead(413);res.end();return;}}
   const {text,speakerId}=JSON.parse(body);
   if(typeof text!=='string'||!text.trim()||text.length>2000||!allowed.has(speakerId)){res.writeHead(400);res.end('Invalid approved voice request');return;}
   const settings={speedScale:voices.settings.speedScale,outputSamplingRate:24000,outputStereo:false};
   const key=crypto.createHash('sha256').update(JSON.stringify({text,speakerId,settings,engineVersion:voices.engine.version})).digest('hex');
   const target=path.join(cache,key+'.wav');
   try{await fs.access(target);}catch{
    if(!jobs.has(key)){
     if(jobs.size>=16){res.writeHead(429);res.end('Voice queue busy');return;}
     const job=queue.catch(()=>{}).then(async()=>{
      const query=await fetch(engine+'/audio_query?'+new URLSearchParams({speaker:String(speakerId),text}),{method:'POST',signal:AbortSignal.timeout(60000)});
      if(!query.ok)throw Error('VOICEVOX audio query failed');
      const synthesis=await fetch(engine+'/synthesis?speaker='+speakerId,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...await query.json(),...settings}),signal:AbortSignal.timeout(60000)});
      if(!synthesis.ok)throw Error('VOICEVOX synthesis failed');
      const audio=Buffer.from(await synthesis.arrayBuffer());
      if(audio.subarray(0,4).toString()!=='RIFF'||audio.subarray(8,12).toString()!=='WAVE')throw Error('Invalid WAV response');
      await fs.writeFile(target+'.tmp',audio);await fs.rename(target+'.tmp',target);
     });
     queue=job;jobs.set(key,job);void job.finally(()=>jobs.delete(key)).catch(()=>{});
    }
    await jobs.get(key);
   }
   res.setHeader('Content-Type','application/json');res.end(JSON.stringify({url:'/clip/'+key+'.wav'}));
  }catch(error){console.warn('NPC voice:',error.message);res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'VOICEVOX unavailable. Open VOICEVOX on the development Mac.'}));}
 });
}
module.exports={createVoiceServer};
if(require.main===module){const server=createVoiceServer({engine:process.env.VOICEVOX_URL||'http://127.0.0.1:50021'});server.listen(50130,'0.0.0.0',()=>console.log('Approved NPC voice bridge on port 50130. Open VOICEVOX on this Mac, then run Expo.'));}
