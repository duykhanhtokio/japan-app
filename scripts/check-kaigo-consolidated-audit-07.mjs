import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const dir='docs/ssw-workspace/kaigo/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const cp=s=>[...s.normalize('NFKC').replace(/\s+/gu,'')].length;
const qc=m=>m.questions.reduce((n,q)=>n+cp(q.promptJa??q.textJa??'')+q.optionsJa.reduce((s,x)=>s+cp(x),0),0);
const git=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const names=['foundation','week2','movement','eating','excretion','hygiene','housework','review'];
const core=names.flatMap(n=>read(dir+'drafts/'+n+'-lessons.json').lessons);
const bundles=['01','02','03','04'].map(n=>read(dir+'drafts/priority-gap-supplements-'+n+'.json'));
const mods=bundles.flatMap(b=>b.modules);
const curriculum=read(dir+'drafts/curriculum-56-days.json');
const audit=read(dir+'reviews/priority-gap-consolidated-audit-07.json');
const timing=read(dir+'reviews/priority-gap-timing-sheets-07.json');
const metrics=m=>{
 const b=core.find(l=>l.id===m.baseLessonId),t=m.transferPractice;
 return {candidateLessonId:m.id,baseLessonId:b.id,day:m.curriculumDay,baseReadingJa:cp(b.reading.ja??b.reading.textJa),candidateReadingJa:cp(m.reading.ja),baseCheckJa:qc(b),candidateCheckJa:qc(m),candidateMainJa:m.dialogue.reduce((s,x)=>s+cp(x.ja),0),baseMainJa:b.dialogue.reduce((s,x)=>s+cp(x.ja??x.textJa),0),candidateTransferModelJa:cp(t.modelJa),candidateOtherResponseModelJa:cp(t.residentConfirmation?.modelJa??t.familyExplanation?.modelJa??''),candidateFixedReplyJa:(t.residentConfirmation?.steps??[]).reduce((s,x)=>s+cp(x.afterAttemptCard.ja),0),candidateTransferMeaningCount:t.rubric.requiredMeanings.length};
};
function validate(a,t){
 assert.equal(a.status,'NOT_READY_FOR_REPLACEMENT');
 assert.equal(a.retentionRows.length,core.filter(l=>mods.some(m=>m.baseLessonId===l.id)).reduce((s,l)=>s+l.objectivesVi.length,0),'all original objectives');
 assert.equal(a.candidateDecisions.length,8);
 assert.equal(new Set(a.candidateDecisions.map(x=>x.day)).size,8,'distinct proposed days');
 assert.equal(new Set(a.retentionRows.map(x=>x.id)).size,a.retentionRows.length);
 const seen=new Set();
 for(const row of a.retentionRows){
  const m=mods.find(m=>m.id===row.candidateLessonId),b=core.find(l=>l.id===row.baseLessonId);
  assert(m&&b&&m.baseLessonId===b.id);
  assert.equal(row.originalObjectiveVi,b.objectivesVi[row.baseObjectiveIndex],'original objective');
  const k=b.id+':'+row.baseObjectiveIndex;assert(!seen.has(k));seen.add(k);
  assert.equal(row.status,'partial_editorial_mapping_not_equivalence');
  assert.equal(row.ready,false);assert.equal(row.humanReviewed,false);
  assert(row.directPracticeVi&&row.limitationVi);
  for(const ref of row.evidence){
   const doc=read(ref.path);const parts=ref.pointer.split('/').slice(1);
   assert.equal(parts[0],'modules');assert.equal(doc.modules[Number(parts[1])].id,m.id,'same candidate evidence');
   let value=doc;for(const p of parts)value=value?.[p];
   assert(value!==undefined,'existing evidence pointer');
  }
 }
 for(const m of mods){
  const d=a.candidateDecisions.find(x=>x.candidateLessonId===m.id);assert(d);
  assert.equal(d.selectedInCurriculum,false,'selection gate');assert.equal(d.replacementReady,false);
  assert.equal(d.status,'NOT_READY_FOR_REPLACEMENT');
  for(const f of ['depthDecision','timingDecision','publisherDecision'])assert.equal(d[f],null);
  assert.deepEqual(d.retentionRowIds,a.retentionRows.filter(r=>r.candidateLessonId===m.id).map(r=>r.id));
  assert.equal(curriculum.days.find(x=>x.day===d.day).lessonId,m.baseLessonId,'original schedule');
  assert.equal(m.replacementPlan.selectedInCurriculum,false);
  assert.equal(m.replacementPlan.originalMandatoryBlocksAlsoAssigned,false);
  assert.equal(m.replacementPlan.durationMeasured,false);
 }
 assert.deepEqual(a.loadMetrics.rows,mods.map(metrics),'computed text metrics');
 const gates=v=>{if(Array.isArray(v))return v.forEach(gates);if(v&&typeof v==='object')for(const [k,x]of Object.entries(v)){if(['domainHumanReviewed','nativeLanguageReviewed','publisherReviewed','rightsReviewed','runtimeIntegrated','appIntegrationReady','releaseReady'].includes(k))assert.equal(x,false,'review gate');gates(x)}};
 gates(a);gates(t);
 assert.equal(a.timing.executed,false);assert.equal(a.timing.observedLearnerData,null);assert.equal(a.timing.minutesInferredFromText,false);
 assert.equal(t.durationMeasured,false);assert.equal(t.observedLearnerData,null);assert.equal(t.sheets.length,8);
 assert.equal(new Set(t.sheets.map(s=>s.candidateLessonId)).size,8);
 for(const s of t.sheets){
  const m=mods.find(x=>x.id===s.candidateLessonId);assert(m);assert.equal(s.status,'unexecuted');
  assert.deepEqual(s.blocks,m.replacementPlan.blocks);
  assert.deepEqual(s.phases.map(p=>p.activity),s.blocks.map(p=>p.activity));
  assert.equal(s.blocks.reduce((n,b)=>n+b.minutes,0),30);
  assert(a.inputSnapshot.some(f=>f.gitBlobSha===s.candidateGitBlobSha),'pinned timing version');
  for(const k of ['participantCode','sessionDate','facilitator','totalObservedSeconds','unfinishedMeanings','observedComprehension','contentChangeRequired','selectionDecision'])assert.equal(s[k],null,'unobserved timing');
  for(const p of s.phases)for(const k of ['observedSeconds','retrySeconds','feedbackSeconds','completed'])assert.equal(p[k],null,'unobserved timing');
 }
 const counts={candidates:8,retentionObjectiveRows:a.retentionRows.length,mainTurns:mods.reduce((s,m)=>s+m.dialogue.length,0),readings:8,candidateQuestions:mods.reduce((s,m)=>s+m.questions.length,0),mainRubrics:bundles.reduce((s,b)=>s+b.responseRubrics.length,0),mainCaseSpecs:bundles.reduce((s,b)=>s+b.responseRubrics.reduce((n,r)=>n+r.assessmentCases.length,0),0),transferRubrics:8,transferCaseSpecs:mods.reduce((s,m)=>s+m.transferPractice.rubric.assessmentCases.length,0),executedAssessmentCases:0};
 assert.deepEqual(a.counts,counts);
 assert.equal(core.length,54);assert.equal(core.reduce((s,l)=>s+l.questions.length,0),270);
 assert.equal(['skills','japanese'].reduce((s,n)=>s+read(dir+'drafts/kaigo-'+n+'-mock-01.json').questions.length,0),60);
 return counts;
}
for(const f of audit.inputSnapshot)assert.equal(git(fs.readFileSync(f.path)),f.gitBlobSha,'immutable '+f.path);
const result=validate(audit,timing);
const controls=[
 [a=>a.retentionRows.pop(),null,/all original objectives/],
 [a=>a.candidateDecisions[0].selectedInCurriculum=true,null,/selection gate/],
 [a=>a.loadMetrics.rows[0].candidateReadingJa++,null,/computed text metrics/],
 [a=>a.retentionRows[0].evidence[0].pointer='/modules/1/dialogue',null,/same candidate evidence/],
 [a=>a.review.releaseReady=true,null,/review gate/],
 [null,t=>t.sheets[0].totalObservedSeconds=1800,/unobserved timing/]
];
for(const [ma,mt,reason]of controls){const a=structuredClone(audit),t=structuredClone(timing);ma?.(a);mt?.(t);assert.throws(()=>validate(a,t),reason);}
console.log(JSON.stringify({status:'PASS_integrity_links_metrics_not_quality_approval',...result,immutableInputBlobs:audit.inputSnapshot.length,negativeControlsRejected:controls.length,timingSessionsExecuted:0,semanticEvaluatorExecuted:false}));
