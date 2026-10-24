// Owner-scoped editorial repair with source leases, complete archives, and resume.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {root,locales,read,validateBatch,originalTurns}=require('./lib/dialogue-translation-validation.cjs');
const {ownerFor,units}=require('./dialogue-translation-worker.cjs');
const base='docs/localization-workspace/',policy=read(base+'DIALOGUE_TRANSLATION_OWNERSHIP.json');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=v=>Buffer.from(JSON.stringify(v,null,2)+'\n');
const bytes=p=>fs.existsSync(path.join(root,p))?fs.readFileSync(path.join(root,p)):null;
const stamp='2026-10-24';
function writeAtomic(file,data){fs.mkdirSync(path.dirname(file),{recursive:true});const temp=file+'.'+process.pid+'.tmp';fs.writeFileSync(temp,data);fs.renameSync(temp,file);}
function lock(){const file=path.join(root,'.git/dialogue-quality-repair.lock');for(let i=0;i<600;i++){try{const fd=fs.openSync(file,'wx');fs.writeFileSync(fd,String(process.pid));return ()=>{fs.closeSync(fd);fs.unlinkSync(file);};}catch(e){if(e.code!=='EEXIST')throw e;const pid=Number(fs.readFileSync(file,'utf8'));try{process.kill(pid,0);}catch(err){if(err.code==='ESRCH'){fs.unlinkSync(file);continue;}throw err;}Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,100);}}throw Error('Quality repair lock busy; preserve draft and retry after coordinator checkpoint');}
function validateProposal(p){
 assert(/^[a-z0-9_-]+$/.test(p.packetId),'Safe unique packetId required');assert(/^dialogue_[a-z_]+$/.test(p.owner),'Owner required');assert(/^\d{3}$/.test(p.batch));
 for(const k of ['sourceFidelity','scenarioContext','naturalness'])assert.equal(p.review?.[k],true,'Explicit own author review required: '+k);
 assert(typeof p.reason==='string'&&p.reason.trim());assert(['translations','source-hints'].includes(p.kind));
}
function prepare(p){
 validateProposal(p);validateBatch(p.batch);const sourcePath=base+'sources/dialogue-batch-'+p.batch+'.ja.json',source=read(sourcePath);
 assert.equal(sha(bytes(sourcePath)),p.expectedSourceSha256,'Source revision changed; do not reuse stale proposal');
 const changes=new Map(),changedUnits=[];
 const put=(file,value)=>{const before=bytes(file);changes.set(file,{before,after:json(value)});};
 const packPath=l=>'src/data/dialogue-content/locale-batches/'+l+'/'+p.batch+'.json';
 const own=l=>assert.equal(ownerFor(p.batch,l,policy),p.owner,'Exclusive ownership violated: '+packPath(l));
 if(p.kind==='translations'){
  assert(locales.includes(p.language));own(p.language);assert.notEqual(p.batch,'000','Batch000 repairs require serialized legacy mirror workflow');
  const file=packPath(p.language),before=bytes(file),pack=JSON.parse(before);assert.equal(sha(before),p.expectedPackSha256,'Pack revision changed; do not overwrite another revision');
  const rows=units(source);assert.equal(p.values.length,rows.length,'Exactly one full value per source N/P/H unit');
  rows.forEach((r,i)=>{const v=p.values[i];assert(typeof v==='string'&&v.trim(),'Nonempty full translation required');assert(!/^(TODO|TBD|pending)$/i.test(v));const field=r.kind==='H'?'hintTranslation':'translation',t=pack.scenarios[r.sid].turns[r.tid];if(t[field]!==v){changedUnits.push({scenarioId:r.sid,turnId:r.tid,field,beforeSha256:sha(Buffer.from(t[field])),afterSha256:sha(Buffer.from(v))});t[field]=v;}});
  put(file,pack);
 }else{
  assert(p.changes?.length,'Source-hint changes required');for(const l of locales)own(l);
  const packs=Object.fromEntries(locales.map(l=>[l,read(packPath(l))])),canonical=new Map(),seen=new Set();
  for(const c of p.changes){
   const key=c.scenarioId+':'+c.turnId;assert(!seen.has(key),'Duplicate hint');seen.add(key);
   const t=source.scenarios[c.scenarioId]?.turns[c.turnId];assert.equal(t?.speaker,'PLAYER');assert.equal(t.hintJa,c.expectedHintJa,'Hint revision mismatch');
   assert(typeof c.hintJa==='string'&&c.hintJa.trim()&&c.hintJa.includes('日本語'),'Complete Japanese task including Japanese-speaking instruction required');
   assert.deepEqual(Object.keys(c.translations).sort(),locales.slice().sort());
   const file='src/data/generated/dialogues/'+c.scenarioId+'.json';assert(fs.existsSync(path.join(root,file)),'Shared generic source requires coordinator-approved scenario override: '+file);
   if(!canonical.has(file))canonical.set(file,read(file));const d=canonical.get(file),rows=Array.isArray(d)?d:d.shared??d.N5,row=rows.find(x=>x.id===c.turnId);assert.equal(row?.speaker,'PLAYER');assert.equal(row.player.hint,c.expectedHintJa);
   row.player.hint=c.hintJa;t.hintJa=c.hintJa;
   for(const l of locales){const v=c.translations[l];assert(typeof v==='string'&&v.trim());const e=packs[l].scenarios[c.scenarioId].turns[c.turnId];assert.equal(e.hintJa,c.expectedHintJa);e.hintJa=c.hintJa;e.hintTranslation=v;}
   changedUnits.push({scenarioId:c.scenarioId,turnId:c.turnId,field:'canonicalHintAnd12Translations',beforeSha256:sha(Buffer.from(c.expectedHintJa)),afterSha256:sha(Buffer.from(c.hintJa))});
  }
  for(const [file,value]of canonical)put(file,value);put(sourcePath,source);for(const l of locales)put(packPath(l),packs[l]);
 }
 for(const [file,x]of [...changes])if(x.before?.equals(x.after))changes.delete(file);
 assert(changes.size,'No actual repair in proposal');
 return {changes,changedUnits,sourcePath};
}
function apply(p,readyDir,dry=false){
 assert(path.isAbsolute(readyDir),'Absolute ready directory required');validateProposal(p);
 const archive=base+'quality-revisions/'+stamp+'/'+p.owner+'/'+p.packetId,receiptFile=path.join(root,archive,'receipt.json'),markerFile=path.join(readyDir,p.owner,p.packetId+'.json');
 let receipt;
 if(fs.existsSync(receiptFile)){
  receipt=JSON.parse(fs.readFileSync(receiptFile));assert.equal(receipt.proposalSha256,sha(json(p)),'Immutable packetId already used for another proposal');
  for(const e of receipt.files){const now=bytes(e.path),hash=now?sha(now):null;assert(hash===e.beforeSha256||hash===e.afterSha256,'Concurrent later revision; do not roll back: '+e.path);}
 }else{
  const {changes,changedUnits,sourcePath}=prepare(p);
  receipt={status:'STAGED_QUALITY_REPAIR',packetId:p.packetId,owner:p.owner,batch:p.batch,kind:p.kind,language:p.language??null,reason:p.reason,review:p.review,proposalSha256:sha(json(p)),sourcePath,changedUnits,files:[...changes].map(([file,x])=>({path:file,beforeSha256:x.before?sha(x.before):null,afterSha256:sha(x.after)})),nativeReviewed:false,semanticCrossReview:false};
  if(dry)return {...receipt,status:'VALID_PROPOSAL_NOT_APPLIED'};
  assert(!fs.existsSync(path.join(root,archive)),'Preserve unexpected archive');
  for(const [file,x]of changes){if(x.before)writeAtomic(path.join(root,archive,'before',file),x.before);writeAtomic(path.join(root,archive,'after',file),x.after);}
  writeAtomic(path.join(root,archive,'proposal.json'),json(p));writeAtomic(receiptFile,json(receipt));
 }
 if(dry)return {...receipt,status:'VALID_RESUMABLE_PROPOSAL_NOT_APPLIED'};
 for(const e of receipt.files){if(sha(bytes(e.path)??Buffer.alloc(0))!==e.afterSha256)writeAtomic(path.join(root,e.path),fs.readFileSync(path.join(root,archive,'after',e.path)));}
 validateBatch(p.batch);receipt.status='AUTHOR_REPAIRED_AND_STRUCTURALLY_VALIDATED';receipt.currentSourceSha256=sha(bytes(receipt.sourcePath));
 writeAtomic(receiptFile,json(receipt));writeAtomic(markerFile,json({...receipt,archive}));
 return {status:receipt.status,packetId:p.packetId,owner:p.owner,batch:p.batch,kind:p.kind,changedUnits:receipt.changedUnits.length,files:receipt.files.length,archive,readyMarker:markerFile,nativeReviewed:false};
}
if(require.main===module){let unlock;try{const [command,input,...args]=process.argv.slice(2),at=args.indexOf('--ready-dir');assert(['check','apply'].includes(command)&&input&&at>=0,'Usage: check|apply PROPOSAL.json --ready-dir ABSOLUTE_PATH');const p=JSON.parse(fs.readFileSync(input));unlock=lock();console.log(JSON.stringify(apply(p,args[at+1],command==='check')));}catch(e){console.error(e.stack);process.exitCode=1;}finally{unlock?.();}}
module.exports={lock,prepare,apply};
