import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const root='docs/ssw-workspace/kaigo/';
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const norm=s=>s.normalize('NFKC').replace(/\s+/gu,'');
const cp=s=>[...norm(s)].length;
const targets=['kaigo-gap-infection-01','kaigo-gap-care-process-01'];
function frozenProjection(bundle){
 const b=structuredClone(bundle);delete b.editorialAppliedRepair;
 for(const m of b.modules)if(targets.includes(m.id)){
  delete m.transferPractice;delete m.replacementPlan.appliedRepairRef;
  m.questions=m.questions.slice(0,4);
 }
 return JSON.stringify(b);
}
export function validateRepairs(bundles,evidence){
 assert.equal(evidence.status,'APPLIED_DRAFT_REPAIR_NOT_REPLACEMENT_APPROVAL');
 const modules=bundles.flatMap(b=>b.modules);
 assert.equal(modules.length,4);
 assert.equal(modules.flatMap(m=>m.dialogue).length,36);
 assert.equal(modules.flatMap(m=>m.questions).length,20);
 assert.equal(bundles.flatMap(b=>b.responseRubrics).length,16);
 const ids=new Set();
 function visit(v){
  if(Array.isArray(v))return v.forEach(visit);
  if(!v||typeof v!=='object')return;
  if(v.id){assert(!ids.has(v.id),'duplicate id');ids.add(v.id);}
  if(v.review)for(const x of Object.values(v.review))assert.equal(x,false,'review gate');
  Object.values(v).forEach(visit);
 }
 for(const b of bundles){ids.clear();visit(b);}
 assert.equal(new Set(modules.map(m=>m.id)).size,modules.length);
 assert.equal(new Set(modules.flatMap(m=>m.questions.map(q=>q.id))).size,20);
 visit(evidence.review);
 for(const m of modules){
  assert.equal(m.replacementPlan.selectedInCurriculum,false,'selection gate');
  assert.equal(m.replacementPlan.replacementReady,false);
  assert.equal(m.replacementPlan.originalMandatoryBlocksAlsoAssigned,false);
  assert.equal(m.replacementPlan.durationMeasured,false);
  assert.equal(m.replacementPlan.blocks.reduce((s,b)=>s+b.minutes,0),30);
 }
 bundles.forEach((b,n)=>assert.equal(sha(frozenProjection(b)),evidence.files[n].frozenProjectionSha256,'unchanged content projection'));
 for(const [n,id]of targets.entries()){
  const m=modules.find(x=>x.id===id),t=m.transferPractice,r=t.rubric;
  const file=evidence.files.find(x=>x.moduleId===id);
  assert.deepEqual(m.questions.map(q=>q.correctIndex),file.correctIndices);
  assert.equal(t.expectedMeaningVi.length,3);
  assert.equal(r.requiredMeanings.length,n===0?6:7,'required meaning count');
  assert.equal(r.acceptableJa.length,2);assert(r.acceptableJa.includes(t.modelJa));
  assert(r.acceptableJa.every(s=>s.trim()&&!/[À-ỹ]/u.test(s)));
  assert.equal(r.assessmentCases.length,3);
  assert.deepEqual(r.assessmentCases.map(c=>c.expected),['accept_meaning','clarify_missing_information','correct_before_advance']);
  assert(r.assessmentCases.every(c=>c.specOnly===true && c.inputJa.trim()));
  assert.equal(r.evaluationPolicy.runtimeImplemented,false);
  assert.equal(r.evaluationPolicy.exactStringMatchRequired,false);
  assert.equal(r.evaluationPolicy.asrUncertain,'repeat_or_edit_no_knowledge_penalty');
  assert.equal(t.feedbackAfterAttempt,true);
  assert.equal(t.sameDaySlot.mode,'replace_existing_transfer_rehearsal_not_append');
  assert.equal(t.sameDaySlot.additionalMandatoryMinutes,0);
  assert.equal(t.sameDaySlot.durationMeasured,false);
  assert.equal(m.replacementPlan.appliedRepairRef,'reviews/priority-gap-applied-repair-04.json');
  if(n===1){
   assert(t.residentConfirmation?.modelJa,'resident confirmation');
   assert.deepEqual(r.responseTargets,['resident_confirmation','care_lead_report']);
   assert(r.acceptableResidentJa.includes(t.residentConfirmation.modelJa));
   assert(r.assessmentCases.every(c=>c.inputResidentJa?.trim()),'two response fields');
   assert.equal(r.requiredMeanings[0].responseTarget,'resident_confirmation');
   assert(r.requiredMeanings.slice(1).every(x=>x.responseTarget==='care_lead_report'));
  }
  const q=m.questions[4];
  assert.equal(q.optionsJa.length,4);assert.equal(q.optionsVi.length,4);assert.equal(q.rationalesVi.length,4);
  q.rationalesVi.forEach((s,k)=>assert(s.startsWith(k===q.correctIndex?'Đúng:':'Sai:')));
  const lengths=q.optionsJa.map(cp);
  assert.equal(lengths[q.correctIndex]===Math.max(...lengths)&&lengths.filter(x=>x===lengths[q.correctIndex]).length===1,false,'new longest-only answer cue');
  assert.deepEqual(lengths,file.q05OptionLengths);
 }
 assert.equal(evidence.load.durationMeasured,false);
 assert.equal(evidence.validation.semanticEvaluatorExecuted,false);
 assert.equal(evidence.validation.appTestsExecuted,false);
 return {status:'PASS',scope:'applied_repair_integrity_not_semantic_or_quality_approval',modules:4,transferRubrics:2,unexecutedTransferSpecs:6};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const read=p=>JSON.parse(fs.readFileSync(root+p,'utf8'));
 const bundles=['01','02'].map(n=>read('drafts/priority-gap-supplements-'+n+'.json'));
 const e=read('reviews/priority-gap-applied-repair-04.json');
 const result=validateRepairs(bundles,e);
 e.files.forEach(f=>assert.equal(sha(fs.readFileSync(f.path)),f.afterSha256,f.path));
 for(const f of e.immutableInputs){
  const bytes=fs.readFileSync(f.path);
  const blob=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
  assert.equal(blob,f.gitBlobSha,'immutable input '+f.path);
 }
 const lessons=['foundation','week2','movement','eating','excretion','hygiene','housework','review'].flatMap(n=>read('drafts/'+n+'-lessons.json').lessons);
 const mocks=['skills','japanese'].flatMap(n=>read('drafts/kaigo-'+n+'-mock-01.json').questions);
 assert.equal(lessons.length,54);assert.equal(lessons.flatMap(l=>l.questions).length,270);assert.equal(mocks.length,60);
 const seen=new Set([...lessons.flatMap(l=>l.questions),...mocks].map(q=>norm(q.promptJa)));
 for(const q of bundles.flatMap(b=>b.modules.flatMap(m=>m.questions))){assert(!seen.has(norm(q.promptJa)),'duplicate question');seen.add(norm(q.promptJa));}
 const selected=structuredClone(bundles);selected[0].modules[1].replacementPlan.selectedInCurriculum=true;
 assert.throws(()=>validateRepairs(selected,e),/selection gate/);
 const missing=structuredClone(bundles);delete missing[1].modules[0].transferPractice.residentConfirmation;
 assert.throws(()=>validateRepairs(missing,e),/resident confirmation/);
 const changed=structuredClone(bundles);changed[0].modules[1].knowledgeModule.sections[0].explanationVi+=' changed';
 assert.throws(()=>validateRepairs(changed,e),/unchanged content projection/);
 console.log(JSON.stringify({...result,immutableInputs:e.immutableInputs.length,negativeControls:3,learnerTimingExecuted:false,appTestsExecuted:false},null,2));
}
