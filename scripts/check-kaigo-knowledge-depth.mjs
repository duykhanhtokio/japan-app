import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const base='docs/ssw-workspace/kaigo/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const depth=read(base+'drafts/knowledge-depth-2026-10-08.json');
const previous=read(base+'reviews/chapter-coverage-2026-10-08.json');
const audit=read(base+'reviews/knowledge-depth-coverage-2026-10-08.json');
const content=read('src/data/kaigo/content.json');
const manifest=read(base+'reviews/app-test-content-manifest.json');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
function validate(bundle){
 assert.equal(bundle.units.length,41);assert.equal(new Set(bundle.units.map(u=>u.id)).size,41);
 assert.deepEqual(bundle.units.map(u=>u.coverageItemId).sort(),previous.knowledgeItems.filter(x=>x.after==='nông').map(x=>x.id).sort());
 const ids=new Set(),days=new Map();
 for(const u of bundle.units){
  const l=content.lessons.find(l=>l.id===u.lessonId);assert(l&&l.day===u.day,'lesson/day');
  days.set(u.day,(days.get(u.day)??0)+1);assert(days.get(u.day)<=2,'daily unit maximum');
  assert(u.titleVi&&u.knowledgeVi&&u.methodVi&&u.mistakesVi&&u.limitsVi,'complete teaching fields');
  assert(u.knowledgeVi!==u.methodVi&&u.methodVi!==u.mistakesVi,'distinct teaching purposes');
  assert(u.probe.id&&!ids.has(u.probe.id)&&u.probe.promptVi&&u.probe.expectedVi&&u.probe.visibleAfterAttempt===true,'case/answer');ids.add(u.probe.id);
  assert.equal(u.humanReviewed,false);assert.equal(u.domainReviewed,false);assert.equal(u.practicalCompetenceVerified,false);
  assert(u.sourcePdfPages.length&&u.sourcePdfPages.every(n=>Number.isInteger(n)&&n>=12&&n<=204));
 }
 assert.equal(days.size,31);assert.equal(bundle.schedule.measuredWithLearners,false);assert.equal(bundle.humanReviewed,false);assert.equal(bundle.releaseReady,false);
}
validate(depth);
for(const u of depth.units){
 const actual=content.lessons.find(l=>l.id===u.lessonId).knowledgeDepthUnits.find(x=>x.id===u.id);
 assert.deepEqual(actual,{id:u.id,titleVi:u.titleVi,knowledgeVi:u.knowledgeVi,methodVi:u.methodVi,mistakesVi:u.mistakesVi,probe:{id:u.probe.id,promptVi:u.probe.promptVi,expectedVi:u.probe.expectedVi,stateRevision:hash(JSON.stringify(u,null,2)+'\n')},figures:u.figures,limitsVi:u.limitsVi});
 const row=audit.knowledgeItems.find(x=>x.id===u.coverageItemId);assert.equal(row.after,'đủ');assert(row.afterEvidence.some(e=>e.unitId===u.id&&e.day===u.day&&e.lessonId===u.lessonId));
}
assert.equal(audit.knowledgeItems.length,159);assert(audit.knowledgeItems.every(x=>x.after==='đủ'&&x.humanReviewed===false&&x.domainReviewed===false));
assert.equal(audit.counts.canonicalBasicKnowledgeDraftComplete,true);assert.equal(audit.counts.allSourceKnowledgeFullyCovered,false);assert.equal(audit.nationalSource.full713QuestionsAudited,false);
assert.equal(content.lessons.flatMap(l=>l.knowledgeDepthUnits).length,41);assert.equal(content.lessons.flatMap(l=>l.knowledgeProbes).length,121);
assert.equal(content.lessons.flatMap(l=>l.languageTasks).length,52);assert.equal(content.lessons.flatMap(l=>l.questions).length,270);assert.equal(content.mocks.flatMap(m=>m.questions).length,60);
assert.equal(manifest.counts.knowledgeDepthFigures,3);
for(const f of depth.figures){assert(depth.units.some(u=>u.figures.some(x=>x.key===f.key)));for(const ext of ['svg','png']){const p=ext==='svg'?base+'drafts/depth-figures/'+f.key+'.svg':'assets/kaigo/depth/'+f.key+'.png';assert.equal(hash(fs.readFileSync(p)),manifest.inputs.find(x=>x.path===p)?.sha256);}}
for(const l of content.lessons){assert(/^[a-f0-9]{64}$/.test(l.practiceRevision));assert(/^[a-f0-9]{64}$/.test(l.knowledgeRevision));assert(l.knowledgeDepthUnits.length<=2);}
assert.equal(content.days.reduce((s,d)=>s+d.plannedMinutes,0),1710);for(const d of content.days)assert.equal(Object.values(d.timeBlocks).reduce((a,b)=>a+b,0),d.day===54?60:30);
const serialized=JSON.stringify(content);for(const forbidden of ['sourcePrintedPage','sourcePdfPage','libfile_','997bf386','mhlw.go.jp','knowledge-depth-2026'])assert(!serialized.includes(forbidden),'private source metadata in runtime '+forbidden);
const clones=[x=>{x.units[0].probe.expectedVi='';},x=>{x.units[1].probe.id=x.units[0].probe.id;},x=>{x.units[0].lessonId='missing';},x=>{x.units[0].humanReviewed=true;}];
for(const mutate of clones){const x=structuredClone(depth);mutate(x);assert.throws(()=>validate(x));}
const originality=read(base+'reviews/knowledge-depth-originality-2026-10-08.json');assert.equal(originality.fields,287);assert.equal(originality.hits.length,0);assert.equal(originality.rightsCertification,false);
console.log(JSON.stringify({status:'PASS_KNOWLEDGE_DEPTH_DATA_NOT_PROFESSIONAL_APPROVAL',units:41,cases:41,assignedDays:31,diagrams:3,basicKnowledgeRows:159,newKnowledgeCasesPlusPriorProbes:162,totalMinutes:1710,negativeControls:4,sourceBytesInRuntime:false,professionalReviewed:false,learnerTimeMeasured:false}));
