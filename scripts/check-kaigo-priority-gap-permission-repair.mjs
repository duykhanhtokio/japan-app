import {historicalBytes09,restoreMerge09Bundles} from './kaigo-transfer-merge-09-lineage.mjs';
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const dir='docs/ssw-workspace/kaigo/';
const blob=s=>{const b=Buffer.from(s);return crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');};
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const serial=x=>JSON.stringify(x,null,2)+'\n';
export function restorePermissionBaseline(bundles,e){
 bundles=restoreMerge09Bundles(bundles);
 const r=structuredClone(bundles);
 assert.equal(bundles.length,2);
 const b=r[0],m=b.modules.find(x=>x.id==='kaigo-gap-infection-01');
 assert(b.editorialPermissionRepair,'repair06 marker');
 m.transferPractice=structuredClone(e.file.beforeTransferPractice);
 delete m.replacementPlan.permissionRepairRef;
 delete b.editorialPermissionRepair;
 assert.equal(blob(serial(b)),e.file.beforeGitBlobSha,'exact predecessor Gitblob');
 assert.equal(blob(serial(r[1])),e.unchangedBundle.gitBlobSha,'other bundle unchanged');
 return r;
}
export function verifyHistoricalInput(path,bytes,expected,e){
 bytes=historicalBytes09(path,bytes);
 if(blob(bytes)===expected)return;
 assert.equal(path,e.file.path,'unsupported historical input');
 assert.equal(sha(bytes),e.file.afterSha256,'repair06 current bundle identity');
 const b=JSON.parse(bytes),m=b.modules.find(x=>x.id==='kaigo-gap-infection-01');
 assert(b.editorialPermissionRepair,'repair06 marker');
 m.transferPractice=structuredClone(e.file.beforeTransferPractice);
 delete m.replacementPlan.permissionRepairRef;delete b.editorialPermissionRepair;
 assert.equal(blob(serial(b)),e.file.beforeGitBlobSha,'repair06 reconstructed baseline');
 assert.equal(blob(serial(b)),expected,'requested historical Gitblob');
}
export function validatePermissionRepair(bundles,e){
 bundles=restoreMerge09Bundles(bundles);
 assert.equal(e.status,'PARTIAL_MAPPING_DRAFT_REPAIR_NOT_REPLACEMENT_APPROVAL');
 const m=bundles[0].modules.find(x=>x.id==='kaigo-gap-infection-01'),t=m.transferPractice,r=t.rubric,c=t.residentConfirmation;
 for(const b of bundles)for(const x of b.modules){
  assert.equal(x.replacementPlan.selectedInCurriculum,false,'selection gate');
  assert.equal(x.replacementPlan.replacementReady,false);
  assert.equal(x.replacementPlan.originalMandatoryBlocksAlsoAssigned,false);
  assert.equal(x.replacementPlan.durationMeasured,false);
 }
 const gates=v=>{if(Array.isArray(v))return v.forEach(gates);if(!v||typeof v!=='object')return;
 for(const [k,x] of Object.entries(v)){if(['domainHumanReviewed','nativeLanguageReviewed','publisherReviewed','rightsReviewed','runtimeIntegrated','appIntegrationReady','releaseReady'].includes(k))assert.equal(x,false,'review gate');gates(x)}};
 gates(bundles);gates(e);
 assert(c,'resident confirmation required');
 assert.equal(c.npcId,'kaigo-npc-resident-b','resident role');
 assert.equal(c.reportNpcId,'kaigo-npc-care-lead','report role');
 assert.equal(m.npcId,'kaigo-npc-care-peer','main role unchanged');
 assert.equal(c.steps.length,2);
 assert(c.steps[0].modelJa.includes('どのくし'),'preference question required');
 assert(c.steps[1].modelJa.includes('この箱の中'),'bounded permission required');
 assert(c.steps[1].modelJa.includes('よろしいですか'),'permission question');
 assert(c.steps[1].afterAttemptCard.ja.includes('他の引き出しは開けない'),'fixed permission scope');
 assert.equal(c.stagingPolicy,'attempt_then_reveal_fixed_reply_then_next_prompt_not_runtime_implemented');
 assert.equal(c.runtimeImplemented,false);
 assert.equal(t.sameDaySlot.additionalMandatoryMinutes,0);
 assert.equal(t.sameDaySlot.durationMeasured,false);
 assert.equal(t.expectedMeaningVi.length,3);
 assert.deepEqual(r.responseTargets,['resident_confirmation','care_lead_report']);
 assert.equal(r.requiredMeanings.length,9);
 assert(r.requiredMeanings.slice(0,2).every(x=>x.responseTarget==='resident_confirmation'));
 assert(r.requiredMeanings.slice(2).every(x=>x.responseTarget==='care_lead_report'));
 assert(r.acceptableResidentJa.includes(c.modelJa));
 assert(r.acceptableJa.includes(t.modelJa));
 assert.equal(r.evaluationPolicy.runtimeImplemented,false);
 assert.equal(r.evaluationPolicy.exactStringMatchRequired,false);
 assert.equal(r.assessmentCases.length,3);
 assert.deepEqual(r.assessmentCases.map(x=>x.expected),['accept_meaning','clarify_missing_information','correct_before_advance']);
 assert(r.assessmentCases.every(x=>x.inputResidentJa?.trim()&&x.inputJa?.trim()&&x.specOnly===true),'two recipient case fields');
 const ids=new Set();function visit(v){if(Array.isArray(v))return v.forEach(visit);if(v&&typeof v==='object'){if(v.id){assert(!ids.has(v.id),'duplicate ID');ids.add(v.id)}Object.values(v).forEach(visit)}}
 visit(bundles[0]);
 restorePermissionBaseline(bundles,e);
 assert.equal(sha(serial(bundles[0])),e.file.afterSha256,'current hash');
 assert.equal(e.load.durationMeasured,false);assert.equal(e.load.observedLearnerData,null);
 assert.equal(e.validation.semanticEvaluatorExecuted,false);
 assert.equal(e.similarity.matchedFields,0);assert.equal(e.similarity.rightsCertified,false);
 return {status:'PASS_structural_and_lineage_not_quality_approval',changedTransferRubrics:1,requiredMeanings:9,fixedResidentReplies:2,unexecutedAssessmentSpecs:3,idsChecked:ids.size};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const read=p=>JSON.parse(fs.readFileSync(dir+p,'utf8'));
 const b=restoreMerge09Bundles(['01','02'].map(n=>read('drafts/priority-gap-supplements-'+n+'.json')));
 const e=read('reviews/priority-gap-partial-repair-06.json');
 const result=validatePermissionRepair(b,e);
 for(const f of e.immutableInputs)assert.equal(blob(historicalBytes09(f.path,fs.readFileSync(f.path))),f.gitBlobSha,'immutable '+f.path);
 const names=['foundation','week2','movement','eating','excretion','hygiene','housework','review'];
 const core=names.flatMap(n=>read('drafts/'+n+'-lessons.json').lessons);
 assert.equal(core.length,54);assert.equal(core.flatMap(x=>x.questions).length,270);
 assert.equal(['skills','japanese'].flatMap(n=>read('drafts/kaigo-'+n+'-mock-01.json').questions).length,60);
 const curriculum=read('drafts/curriculum-56-days.json');assert.equal(curriculum.days.find(d=>d.day===42).lessonId,'kaigo-hygiene-07');
 const cases=[
  [x=>delete x[0].modules[1].transferPractice.residentConfirmation,/resident confirmation required/],
  [x=>x[0].modules[1].transferPractice.residentConfirmation.steps[0].modelJa='このくしを使います。',/preference question required/],
  [x=>x[0].modules[1].transferPractice.residentConfirmation.steps[1].afterAttemptCard.ja='すべての引き出しを開けてください。',/fixed permission scope/],
  [x=>x[0].modules[1].replacementPlan.selectedInCurriculum=true,/selection gate/],
  [x=>x[0].modules[0].knowledgeModule.sections[0].explanationVi+=' changed',/exact predecessor Gitblob/]
 ];
 for(const [mutate,reason]of cases){const x=structuredClone(b);mutate(x);assert.throws(()=>validatePermissionRepair(x,e),reason);}
 console.log(JSON.stringify({...result,historicalSnapshotValidation:true,immutableInputBlobs:e.immutableInputs.length,negativeControlsRejected:cases.length,coreLessons:54,coreQuestions:270,mockQuestions:60,learnerTimingExecuted:false,semanticEvaluatorExecuted:false}));
}
