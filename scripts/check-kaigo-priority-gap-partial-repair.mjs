import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const root='docs/ssw-workspace/kaigo/';
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const blob=s=>{const b=Buffer.from(s);return crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');};
const norm=s=>s.normalize('NFKC').replace(/\s+/gu,'');
const cp=s=>[...norm(s)].length;
const targets=['kaigo-gap-worker-health-01','kaigo-gap-services-01'];
export function restoreBaseline(bundles,evidence){
 const restored=structuredClone(bundles);
 assert.equal(evidence.changes.length,2);
 assert.deepEqual(evidence.changes.map(c=>c.moduleId),targets);
 for(const b of restored)delete b.editorialPartialRepair;
 for(const c of evidence.changes){
  assert.deepEqual(Object.keys(c.before).sort(),['q04','reading','transferPractice']);
  const m=restored.flatMap(b=>b.modules).find(m=>m.id===c.moduleId);
  assert(m);m.reading=structuredClone(c.before.reading);
  m.questions[3]=structuredClone(c.before.q04);
  m.transferPractice=structuredClone(c.before.transferPractice);
  delete m.replacementPlan.partialRepairRef;
 }
 restored.forEach((b,n)=>{
  const bytes=JSON.stringify(b,null,2)+'\n';
  assert.equal(sha(bytes),evidence.files[n].beforeSha256,'predecessor snapshot hash');
  assert.equal(blob(bytes),evidence.files[n].beforeGitBlobSha,'predecessor Git blob');
 });
 return restored;
}
export function validatePartialRepair(bundles,e){
 assert.equal(e.status,'PARTIAL_MAPPING_DRAFT_REPAIR_NOT_REPLACEMENT_APPROVAL');
 assert.equal(e.previousAuditRef,'reviews/priority-gap-applied-repair-04.json');
 assert.equal(bundles.length,2);
 const modules=bundles.flatMap(b=>b.modules);
 assert.equal(modules.length,4);assert.equal(modules.flatMap(m=>m.dialogue).length,36);
 assert.equal(modules.flatMap(m=>m.questions).length,20);
 assert.equal(bundles.flatMap(b=>b.responseRubrics).length,16);
 const flags=v=>{if(Array.isArray(v))return v.forEach(flags);if(v&&typeof v==='object'){if(v.review)Object.values(v.review).forEach(x=>assert.equal(x,false,'review gate'));Object.values(v).forEach(flags);}};
 flags(bundles);flags(e.review);
 for(const m of modules){
  assert.equal(m.replacementPlan.selectedInCurriculum,false,'selection gate');
  assert.equal(m.replacementPlan.replacementReady,false);
  assert.equal(m.replacementPlan.originalMandatoryBlocksAlsoAssigned,false);
  assert.equal(m.replacementPlan.durationMeasured,false);
  assert.equal(m.replacementPlan.newMandatoryVocabularyCount,0);
  assert.equal(m.replacementPlan.blocks.reduce((s,b)=>s+b.minutes,0),30);
 }
 for(const [n,id]of targets.entries()){
  const m=modules.find(m=>m.id===id),f=e.files[n],t=m.transferPractice,r=t.rubric;
  assert.equal(f.moduleId,id);
  assert.deepEqual(m.questions.map(q=>q.correctIndex),f.correctIndices,'unchanged answer indices');
  assert.equal(t.expectedMeaningVi.length,3);
  assert.equal(r.requiredMeanings.length,n===0?9:8,'meaning count');
  assert.equal(r.acceptableJa.length,2);assert(r.acceptableJa.includes(t.modelJa));
  assert.equal(r.evaluationPolicy.exactStringMatchRequired,false);
  assert.equal(r.evaluationPolicy.runtimeImplemented,false);
  assert.equal(r.evaluationPolicy.asrUncertain,'repeat_or_edit_no_knowledge_penalty');
  assert.equal(r.assessmentCases.length,3);
  assert.deepEqual(r.assessmentCases.map(c=>c.expected),['accept_meaning','clarify_missing_information','correct_before_advance']);
  assert(r.assessmentCases.every(c=>c.specOnly===true));
  assert.equal(t.sameDaySlot.mode,'replace_existing_transfer_rehearsal_not_append');
  assert.equal(t.sameDaySlot.additionalMandatoryMinutes,0);
  assert.equal(t.sameDaySlot.durationMeasured,false);
  assert.equal(t.feedbackAfterAttempt,true);
  assert.equal(m.replacementPlan.partialRepairRef,'reviews/priority-gap-partial-repair-05.json');
  assert(m.reading.ja.trim()&&m.reading.vi.trim());
  const q=m.questions[3];assert.equal(q.kind,'reading');
  assert.equal(q.optionsJa.length,4);assert.equal(q.optionsVi.length,4);
  assert.equal(q.rationalesVi.length,4);
  q.rationalesVi.forEach((x,k)=>assert(x.startsWith(k===q.correctIndex?'Đúng:':'Sai:')));
  const lengths=q.optionsJa.map(cp);
  assert.deepEqual(lengths,f.q04OptionLengths);
  assert(!(lengths[q.correctIndex]===Math.max(...lengths)&&lengths.filter(x=>x===lengths[q.correctIndex]).length===1),'longest-only correct answer');
  if(n===1){
   assert(t.familyExplanation?.modelJa,'family explanation required');
   assert.deepEqual(r.responseTargets,['family_explanation','care_lead_report']);
   assert(r.acceptableFamilyJa.includes(t.familyExplanation.modelJa));
   assert(r.assessmentCases.every(c=>c.inputFamilyJa?.trim()),'two recipient fields');
   assert(r.requiredMeanings.slice(0,3).every(x=>x.responseTarget==='family_explanation'));
   assert(r.requiredMeanings.slice(3).every(x=>x.responseTarget==='care_lead_report'));
  }
  const protectedModule=modules.find(m=>m.id===f.previousAppliedModuleId);
  assert.equal(sha(JSON.stringify(protectedModule)),f.previousAppliedModuleSha256,'repair04 module unchanged');
 }
 restoreBaseline(bundles,e);
 bundles.forEach((b,n)=>assert.equal(sha(JSON.stringify(b,null,2)+'\n'),e.files[n].afterSha256,'current bundle hash'));
 assert.equal(e.load.durationMeasured,false);
 assert.equal(e.validation.semanticEvaluatorExecuted,false);
 assert.equal(e.validation.appTestsExecuted,false);
 assert.equal(e.similarity.sourcePages,276);
 assert.equal(e.similarity.matchedFields,e.similarity.matches.length);
 assert.equal(e.similarity.rightsCertified,false);
 return {status:'PASS',scope:'partial_mapping_repair_integrity_not_quality_approval',newTransferRubrics:2,newUnexecutedSpecCases:6,protectedRepair04Modules:2};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const read=p=>JSON.parse(fs.readFileSync(root+p,'utf8'));
 let bundles=['01','02'].map(n=>read('drafts/priority-gap-supplements-'+n+'.json'));
 let permissionReplay=false;
 if(bundles[0].editorialPermissionRepair){
  const permission=read('reviews/priority-gap-partial-repair-06.json');
  const {validatePermissionRepair,restorePermissionBaseline}=await import('./check-kaigo-priority-gap-permission-repair.mjs');
  validatePermissionRepair(bundles,permission);
  bundles=restorePermissionBaseline(bundles,permission);permissionReplay=true;
 }
 const e=read('reviews/priority-gap-partial-repair-05.json');
 const result=validatePartialRepair(bundles,e);
 for(const [i,f]of e.files.entries())assert.equal(sha(permissionReplay?JSON.stringify(bundles[i],null,2)+'\n':fs.readFileSync(f.path)),f.afterSha256);
 for(const f of e.immutableInputs){
  const bytes=fs.readFileSync(f.path);
  const git=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
  assert.equal(git,f.gitBlobSha,'immutable '+f.path);
 }
 const lessons=['foundation','week2','movement','eating','excretion','hygiene','housework','review'].flatMap(n=>read('drafts/'+n+'-lessons.json').lessons);
 const mocks=['skills','japanese'].flatMap(n=>read('drafts/kaigo-'+n+'-mock-01.json').questions);
 assert.equal(lessons.length,54);assert.equal(lessons.flatMap(l=>l.questions).length,270);assert.equal(mocks.length,60);
 const seen=new Set([...lessons.flatMap(l=>l.questions),...mocks].map(q=>norm(q.promptJa)));
 for(const q of bundles.flatMap(b=>b.modules.flatMap(m=>m.questions))){assert(!seen.has(norm(q.promptJa)),'duplicate question');seen.add(norm(q.promptJa));}
 const changed=structuredClone(bundles);changed[0].modules[0].knowledgeModule.sections[0].explanationVi+=' changed';
 assert.throws(()=>validatePartialRepair(changed,e),/predecessor snapshot hash/);
 const missing=structuredClone(bundles);delete missing[1].modules[1].transferPractice.familyExplanation;
 assert.throws(()=>validatePartialRepair(missing,e),/family explanation required/);
 const key=structuredClone(bundles);key[0].modules[0].questions[3].correctIndex=0;
 assert.throws(()=>validatePartialRepair(key,e),/unchanged answer indices/);
 const selected=structuredClone(bundles);selected[0].modules[0].replacementPlan.selectedInCurriculum=true;
 assert.throws(()=>validatePartialRepair(selected,e),/selection gate/);
 console.log(JSON.stringify({...result,immutableInputs:e.immutableInputs.length,negativeControls:4,learnerTimingExecuted:false,appTestsExecuted:false},null,2));
}
