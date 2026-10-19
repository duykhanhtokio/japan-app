// Keep translation authorship in the worker; assemble IDs/source/markers mechanically.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {root,locales,read,validateBatch}=require('./lib/dialogue-translation-validation.cjs');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function units(source){
 const rows=[];
 for(const [sid,scenario] of Object.entries(source.scenarios))for(const [tid,t] of Object.entries(scenario.turns)){
  rows.push({sid,tid,kind:t.speaker==='NPC'?'N':'P',ja:t.sourceJa});
  if(t.hintJa)rows.push({sid,tid,kind:'H',ja:t.hintJa});
 }
 return rows;
}
function compactSource(source){
 return {batch:source.batch,scenarios:Object.entries(source.scenarios).map(([id,s])=>({id,lines:Object.values(s.turns).flatMap(t=>[[t.speaker==='NPC'?'N':'P',t.sourceJa],...(t.hintJa?[['H',t.hintJa]]:[])])}))};
}
function buildPack(source,language,values){
 assert(locales.includes(language),'Unsupported locale');
 const rows=units(source);assert(Array.isArray(values),'Input must be a flat JSON array of translations');assert.equal(values.length,rows.length,'Exactly one full translation per ordered N/P/H source line is required');
 for(const v of values){assert(typeof v==='string'&&v.trim(),'Every translation must be nonempty');assert(!/^(TODO|TBD|pending|translation unavailable)$/i.test(v.trim()),'Placeholder rejected');}
 let at=0;const scenarios={};
 for(const [sid,s] of Object.entries(source.scenarios)){
  const turns={};for(const [tid,t] of Object.entries(s.turns)){
   turns[tid]={...t,translation:values[at++]};if(t.hintJa)turns[tid].hintTranslation=values[at++];
  }scenarios[sid]={turns};
 }
 return {language,status:'translated_ai_unreviewed',nativeReviewed:false,scenarios};
}
function atomicImmutable(file,bytes){
 fs.mkdirSync(path.dirname(file),{recursive:true});
 if(fs.existsSync(file)){assert(fs.readFileSync(file).equals(Buffer.from(bytes)),'Preserve existing immutable file: '+file);return false;}
 const temp=file+'.'+process.pid+'.'+crypto.randomBytes(6).toString('hex')+'.tmp';fs.writeFileSync(temp,bytes,{flag:'wx'});
 try{fs.linkSync(temp,file);}finally{fs.unlinkSync(temp);}return true;
}
function ownerFor(batch,language,ownership){
 const relative=`src/data/dialogue-content/locale-batches/${language}/${batch}.json`;
 const transfer=ownership.explicitLocaleTransfers?.find(x=>x.path===relative);if(transfer)return transfer.owner;
 if(Number(batch)<=ownership.phase1.lastBatch)return ownership.phase1.workers.find(x=>x.exclusiveLocales.includes(language))?.owner;
 return ownership.phase2.workers.find(x=>x.slot===(Number(batch)-ownership.phase2.firstBatch)%ownership.phase2.stride)?.owner;
}
function publish(batch,language,input,readyDirectory,fidelityChecked){
 assert(fidelityChecked,'Author must first finish full own-language source fidelity QA and explicitly pass --fidelity-checked');
 assert(/^\d{3,}$/.test(batch),'Invalid batch');assert(locales.includes(language),'Unsupported locale');assert(path.isAbsolute(readyDirectory),'Ready directory must be absolute');
 validateBatch(batch,{requireAll:false});
 const sourcePath=`docs/localization-workspace/sources/dialogue-batch-${batch}.ja.json`,source=read(sourcePath),pack=buildPack(source,language,JSON.parse(fs.readFileSync(input,'utf8')));
 const relative=`src/data/dialogue-content/locale-batches/${language}/${batch}.json`,bytes=Buffer.from(JSON.stringify(pack,null,2)+'\n');
 const owner=ownerFor(batch,language,read('docs/localization-workspace/DIALOGUE_TRANSLATION_OWNERSHIP.json'));assert(owner,'No exclusive owner');
 const marker={owner,language,batch,path:relative,sha256:sha(bytes),sourceSha256:sha(fs.readFileSync(path.join(root,sourcePath))),fullUtteranceFidelityChecked:true};
 const markerPath=path.join(readyDirectory,language,batch+'.json');
 if(fs.existsSync(markerPath)){const old=JSON.parse(fs.readFileSync(markerPath,'utf8'));for(const k of ['owner','language','batch','path','sha256','fullUtteranceFidelityChecked'])assert.deepEqual(old[k],marker[k],'Preserve existing readiness handshake');}
 atomicImmutable(path.join(root,relative),bytes);validateBatch(batch,{requireAll:false});
 if(!fs.existsSync(markerPath))atomicImmutable(markerPath,JSON.stringify(marker,null,2)+'\n');
 return {status:'AUTHOR_READY',...marker,units:units(source).length,nativeReviewed:false};
}
if(require.main===module){
 try{
  const [command,batch,language,input,...flags]=process.argv.slice(2);assert(/^\d{3,}$/.test(batch??''),'Specify a batch');
  if(command==='extract')console.log(JSON.stringify(compactSource(read(`docs/localization-workspace/sources/dialogue-batch-${batch}.ja.json`))));
  else if(command==='publish'){const ix=flags.indexOf('--ready-dir');assert(ix>=0&&flags[ix+1],'Specify --ready-dir');console.log(JSON.stringify(publish(batch,language,input,flags[ix+1],flags.includes('--fidelity-checked'))));}
  else throw Error('Usage: extract BATCH | publish BATCH LOCALE STRINGS.json --fidelity-checked --ready-dir ABSOLUTE_DIRECTORY');
 }catch(e){console.error(e.message);process.exitCode=1;}
}
module.exports={units,compactSource,buildPack,atomicImmutable,ownerFor,publish};
