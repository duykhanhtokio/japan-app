// Coordinator: guarded source-owner patches and reciprocal links, no semantic cross-review.
const fs=require('fs'),z=require('zlib'),cp=require('child_process'),crypto=require('crypto'),assert=require('assert/strict');
const base='873e5c9919498a42aef60939abd2af9207ab4558';
const dir='docs/ssw-workspace/agriculture/continuation-20261103d/';
const ld='docs/ssw-workspace/source-coverage-v2/',lp=ld+'agriculture.json',checksPath='src/data/agriculture/reader-moisture-checks.json';
const read=p=>JSON.parse(fs.readFileSync(p)),hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex'),byteHash=v=>crypto.createHash('sha256').update(v).digest('hex');
const original=p=>cp.execFileSync('git',['show',base+':'+p],{maxBuffer:30000000});
const write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
const ledger=JSON.parse(original(lp)),before=structuredClone(ledger),checks=JSON.parse(original(checksPath)),oldChecks=structuredClone(checks);
const manifest=read(dir+'manifest.json'),changes=[],added=[];
for(const {lane,path,key}of manifest.packets){
 const packet=read(path);
 for(const row of packet.readerAdditions||[]){
  assert(!checks.checks.some(c=>c.id===row.id),'Duplicate reader check '+row.id);
  assert.deepEqual(Object.keys(row.translations).sort(),['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'].sort());
  for(const field of ['prompt','modelAnswer','teaching'])if(row[field+'Ja']){
   assert.equal(row[field+'Ruby'].map(t=>t.text).join(''),row[field+'Ja']);
   for(const token of row[field+'Ruby'])if(/[\p{Script=Han}々]/u.test(token.text))assert(token.readingKana);
  }
  checks.checks.push(row);added.push(row.id);
 }
 for(const p of packet[key]){
  const i=ledger.knowledgeUnits.findIndex(u=>u.knowledgeId===p.knowledgeId);assert(i>=0);
  const old=ledger.knowledgeUnits[i];assert.equal(hash(old),p.beforeSha256||hash(p.before));
  assert(!['covered_ai','duplicate','excluded'].includes(old.status),'Protected accepted unit '+p.knowledgeId);
  const after=p.after?structuredClone(p.after):{...structuredClone(old),...p.patch,previousSourceRefs:p.previousSourceRefs||old.sourceRefs};
  for(const e of [...after.assessmentEvidence,...after.teachingEvidence]){
   if(e.checkId){e.checkField=e.checkField||e.field;const index=checks.checks.findIndex(c=>c.id===e.checkId);assert(index>=0);e.path=checksPath;e.jsonPointer='/checks/'+index+(e.checkField?'/'+e.checkField:'');e.sha256=hash(e.checkField?checks.checks[index][e.checkField]:checks.checks[index]);e.sha256Mode='json-value';delete e.checkId;delete e.checkField;delete e.field;}
  }
  ledger.knowledgeUnits[i]=after;changes.push({lane,knowledgeId:p.knowledgeId,beforeStatus:old.status,afterStatus:after.status,beforeSha256:hash(old),afterSha256:hash(after)});
 }
}
const changedIds=new Set(changes.map(c=>c.knowledgeId));
for(const s of ledger.sources){
 const path=ld+`agriculture-${s.sourceId}-regions.json.gz`,artifact=JSON.parse(z.gunzipSync(original(path)));
 for(const page of artifact.pages)for(const e of page.elements)e.knowledgeIds=e.knowledgeIds.filter(id=>!changedIds.has(id));
 for(const c of changes){const u=ledger.knowledgeUnits.find(u=>u.knowledgeId===c.knowledgeId);
  for(const r of u.sourceRefs.filter(r=>r.sourceId===s.sourceId)){
   const p=artifact.pages.find(p=>p.pdfPage===r.pdfPage);assert(p);
   for(const id of r.elementIds){const e=p.elements.find(e=>e.elementId===id);assert(e);e.classification='knowledge';e.knowledgeIds=[...new Set([...e.knowledgeIds,u.knowledgeId])];e.reason=null;}
   const page=ledger.pages.find(p=>p.sourceId===s.sourceId&&p.pdfPage===r.pdfPage);
   page.regionCensus.status='visually_reviewed';page.regionCensus.visualReviewRef=u.sourceReview.reviewRef;
   if(page.semanticInventory.status==='pending')page.semanticInventory={status:'partial',reviewRef:u.sourceReview.reviewRef};
   if(page.disposition==='unclassified')page.disposition='mixed';
  }
 }
 const bytes=z.gzipSync(JSON.stringify(artifact),{mtime:0});fs.writeFileSync(path,bytes);
 for(const page of ledger.pages.filter(p=>p.sourceId===s.sourceId))page.regionCensus.sha256=byteHash(bytes);
}
for(const page of ledger.pages)page.knowledgeIds=ledger.knowledgeUnits.filter(u=>u.sourceRefs.some(r=>r.sourceId===page.sourceId&&r.pdfPage===page.pdfPage)).map(u=>u.knowledgeId);
for(const u of before.knowledgeUnits.filter(u=>['covered_ai','duplicate','excluded'].includes(u.status)))assert.deepEqual(ledger.knowledgeUnits.find(v=>v.knowledgeId===u.knowledgeId),u);
for(const c of oldChecks.checks)assert.deepEqual(checks.checks.find(v=>v.id===c.id),c);
write(lp,ledger);write(checksPath,checks);
const covered=ledger.knowledgeUnits.filter(u=>u.status==='covered_ai').length;
write(dir+'integration.json',{schemaVersion:1,status:'integrated_pending_validation',baselineCommit:base,changes,newChecks:added,coveredBefore:323,coveredAfter:covered,openKnownUnits:ledger.knowledgeUnits.filter(u=>!['covered_ai','duplicate','excluded'].includes(u.status)).length,priorAcceptedUnitsPreserved:true,priorChecksPreserved:true,sourceCoveragePercent:null,wholeSourceKnowledgeCovered:false,crossWorkerSemanticReview:false,domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false});
console.log(JSON.stringify({changed:changes.length,covered,checks:checks.checks.length}));
