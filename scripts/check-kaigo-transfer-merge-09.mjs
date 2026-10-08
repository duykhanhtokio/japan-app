import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {restoreMerge09Bundles} from './kaigo-transfer-merge-09-lineage.mjs';
import {restoreFollowup10Bundles} from './kaigo-followup-10-lineage.mjs';
const dir='docs/ssw-workspace/kaigo/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const blob=s=>{const b=Buffer.from(s);return crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');};
const gate=(ok,label)=>assert(ok,label);
const gates=v=>{if(Array.isArray(v))return v.forEach(gates);if(v&&typeof v==='object')for(const[k,x]of Object.entries(v)){if(['domainHumanReviewed','nativeLanguageReviewed','publisherReviewed','rightsReviewed','runtimeIntegrated','appIntegrationReady','releaseReady'].includes(k))assert.equal(x,false,'approval gate');gates(x);}};
const doc=read(dir+'drafts/priority-gap-transfer-proposals-08.json');
const evidence=read(dir+'reviews/priority-gap-transfer-merge-09.json');
export function validateMerge09(bundles){
 gates(bundles);
 const infection=bundles[0].modules.find(m=>m.id==='kaigo-gap-infection-01');
 const care=bundles[1].modules.find(m=>m.id==='kaigo-gap-care-process-01');
 for(const m of [infection,care]){
  gate(m.replacementPlan.selectedInCurriculum===false&&m.replacementPlan.replacementReady===false,'selection gate');
  const p=m.transferPractice.rehearsalPlan09;
  gate(p&&p.mode==='choose_one_variant_per_rehearsal_not_append_required_practice','variant mode');
  const g=p.selectionGate;
  gate(g.maximumRequiredVariantsPerRehearsal===1&&g.additionalMandatoryMinutes===0&&g.durationMeasured===false&&g.observedLearnerData===null,'load gate');
  gate(g.candidateSelected===false&&g.runtimeImplemented===false,'selection gate');
  gate(g.plannedDailyMinutes===30,'planned daily time');
  gate(p.retainedVariant.kind==='legacy_transfer_fields_of_this_object'&&p.retainedVariant.coversQuestionId===m.id+'-q05','question legacy coverage');
 }
 const old=infection.transferPractice;
 gate(old.residentConfirmation.steps.length===2&&old.residentConfirmation.steps[0].modelJa.includes('どのくし')&&old.residentConfirmation.steps[1].afterAttemptCard.ja.includes('他の引き出しは開けない'),'legacy preference_permission');
 gate(old.modelJa.includes('画面')&&old.rubric.requiredMeanings.length===9,'legacy screen report');
 const ref=old.rehearsalPlan09.defaultVariant.ref;
 gate(old.rehearsalPlan09.defaultVariantId===ref.id,'default variant link');
 gate(ref.pointer==='/proposals/0'&&ref.dialoguePointer==='/proposals/0/dialogue'&&ref.rubricsPointer==='/proposals/0/responseRubrics'&&ref.path===evidence.proposalRef.path&&ref.gitBlobSha===evidence.proposalRef.gitBlobSha,'cloth reference');
 const cloth=doc.proposals[0];gate(cloth.targetModuleId===infection.id&&cloth.facts.supportRequested==='face_only'&&cloth.facts.careStarted===false&&cloth.facts.plainClothOwnerKnown===false,'cloth facts');
 const flow=care.transferPractice.rehearsalPlan09.defaultVariant.flow;
 gate(care.transferPractice.rehearsalPlan09.defaultVariantId===flow.id,'default variant link');
 gate(flow.steps.length===4,'care staged steps');
 const targets=['resident_confirmation','care_lead_before_start','resident_result_and_choice','care_lead_resident_decision'];
 assert.deepEqual(flow.steps.map(s=>s.responseTarget),targets,'care sequence');
 assert.deepEqual(flow.steps.map(s=>s.npcId),['kaigo-npc-resident-a','kaigo-npc-care-lead','kaigo-npc-resident-a','kaigo-npc-care-lead'],'care recipients');
 gate(flow.factsBefore.supportConfirmed===false&&flow.factsBefore.requestedRoomArrival==='14:25'&&flow.factsBefore.activityStarted===false&&flow.factsBefore.participationDecided===false,'before result facts');
 gate(flow.factsAfterStep2.supportConfirmed===true&&flow.factsAfterStep2.confirmedRoomArrival==='14:25'&&flow.factsAfterStep2.supportNpcId==='kaigo-npc-care-peer'&&flow.factsAfterStep2.returnCompleted===false&&flow.factsAfterStep2.participationDecided===false,'checked result facts');
 gate(flow.outcome.residentChoice==='decline_today'&&flow.outcome.leadInformed===true&&flow.outcome.activityStarted===false&&flow.outcome.returnCompleted===false&&flow.outcome.goalAchievementConfirmed===false&&flow.outcome.planApprovedByLearner===false,'choice outcome');
 const ids=new Set();const add=id=>{gate(!ids.has(id),'duplicate ID');ids.add(id);};
 for(const b of bundles){const visit=v=>{if(Array.isArray(v))return v.forEach(visit);if(v&&typeof v==='object'){if(v.id&&v.id!=='kaigo-textbook-2025-03')add(v.id);Object.values(v).forEach(visit);}};visit(b);}
 for(const s of flow.steps){
  gate(s.modelJa&&s.modelVi&&s.afterAttemptCard.ja&&s.afterAttemptCard.vi&&s.afterAttemptCard.revealAfterAttempt===true,'staged language cards');
  const r=s.rubric;gate(r.requiredMeanings.length>=2,'missing new meaning');
  gate(r.acceptableJa.includes(s.modelJa)&&r.acceptableJa.length>=2,'new rubric model');
  gate(r.evaluationPolicy.exactStringMatchRequired===false&&r.evaluationPolicy.runtimeImplemented===false,'evaluator gate');
  assert.deepEqual(r.assessmentCases.map(c=>c.expected),['accept_meaning','clarify_missing_information','correct_before_advance']);
  gate(r.assessmentCases.every(c=>c.specOnly===true&&c.inputJa),'case specs');
 }
 restoreMerge09Bundles(bundles);
 return {newVariantTurns:cloth.dialogue.length+flow.steps.length*2,newVariantRubrics:cloth.responseRubrics.length+flow.steps.length,newVariantCaseSpecs:cloth.responseRubrics.reduce((n,r)=>n+r.assessmentCases.length,0)+flow.steps.reduce((n,s)=>n+s.rubric.assessmentCases.length,0),legacyTransferFieldsPreserved:true,IDsChecked:ids.size};
}
const rawBundles=['01','02'].map(n=>read(dir+'drafts/priority-gap-supplements-'+n+'.json'));
const historicalSnapshotValidation=rawBundles.some(b=>b.editorialFollowup10);
const bundles=restoreFollowup10Bundles(rawBundles);
const result=validateMerge09(bundles);
 assert.equal(evidence.timingSheets.length,2,'current timing sheets');
 for(const sheet of evidence.timingSheets){
  const change=evidence.changes.find(c=>c.targetModuleId===sheet.candidateLessonId);
  assert.equal(sheet.candidateGitBlobSha,change.afterGitBlobSha,'current timing pin');
  assert.equal(sheet.status,'unexecuted');
  for(const key of ['variantChosenForMeasurement','participantCode','sessionDate','facilitator','totalObservedSeconds','completedRequiredMeanings','unfinishedMeaningIds','selectionDecision'])assert.equal(sheet[key],null,'timing unobserved');
  assert.equal(sheet.phases.reduce((n,p)=>n+p.plannedMinutes,0),30);
  for(const phase of sheet.phases)for(const key of ['observedSeconds','retrySeconds','feedbackSeconds','completed'])assert.equal(phase[key],null,'timing unobserved');
 }
for(const f of evidence.immutableInputs)assert.equal(blob(fs.readFileSync(f.path)),f.gitBlobSha,'immutable '+f.path);
assert.equal(blob(fs.readFileSync(evidence.proposalRef.path)),evidence.proposalRef.gitBlobSha);
const original=restoreMerge09Bundles(bundles);
for(let i=0;i<2;i++)assert.equal(blob(JSON.stringify(original[i],null,2)+'\n'),evidence.changes[i].beforeGitBlobSha,'frozen projection');
const names=['foundation','week2','movement','eating','excretion','hygiene','housework','review'];
const core=names.flatMap(n=>read(dir+'drafts/'+n+'-lessons.json').lessons);
assert.equal(core.length,54);assert.equal(core.flatMap(l=>l.questions).length,270);
assert.equal(['skills','japanese'].flatMap(n=>read(dir+'drafts/kaigo-'+n+'-mock-01.json').questions).length,60);
for(const m of bundles.flatMap(b=>b.modules))assert.equal(read(dir+'drafts/curriculum-56-days.json').days.find(d=>d.day===m.curriculumDay).lessonId,m.baseLessonId);
const cp=s=>[...s.normalize('NFKC').replace(/\s/gu,'')].length;
const flow=bundles[1].modules[0].transferPractice.rehearsalPlan09.defaultVariant.flow;
const metrics={clothDefault:{shownDialogueJa:doc.proposals[0].dialogue.reduce((n,t)=>n+cp(t.ja),0),playerModelJa:doc.proposals[0].dialogue.filter(t=>t.speaker==='player').reduce((n,t)=>n+cp(t.ja),0)},careMergedDefault:{shownDialogueJa:flow.steps.reduce((n,s)=>n+cp(s.modelJa)+cp(s.afterAttemptCard.ja),0),playerModelJa:flow.steps.reduce((n,s)=>n+cp(s.modelJa),0)},meaningCount:doc.proposals[0].responseRubrics.reduce((n,r)=>n+r.requiredMeanings.length,0)+flow.steps.reduce((n,s)=>n+s.rubric.requiredMeanings.length,0),unit:'NFKC_non_whitespace_Unicode_codepoints_not_minutes'};
if(evidence.loadMetrics)assert.deepEqual(evidence.loadMetrics,metrics,'computed metrics');
const controls=[
 [x=>x[0].modules[1].transferPractice.rehearsalPlan09.defaultVariantId='missing-variant',/default variant link/],
 [x=>x[0].modules[1].replacementPlan.selectedInCurriculum=true,/selection gate/],
 [x=>x[0].review.releaseReady=true,/approval gate/],
 [x=>x[0].modules[1].transferPractice.rehearsalPlan09.selectionGate.maximumRequiredVariantsPerRehearsal=2,/load gate/],
 [x=>x[0].modules[1].transferPractice.rehearsalPlan09.defaultVariant.ref.pointer='/proposals/1',/cloth reference/],
 [x=>x[1].modules[0].transferPractice.rehearsalPlan09.defaultVariant.flow.factsAfterStep2.confirmedRoomArrival='14:35',/checked result facts/],
 [x=>x[1].modules[0].transferPractice.rehearsalPlan09.defaultVariant.flow.steps[2].npcId='kaigo-npc-care-lead',/care recipients/],
 [x=>x[1].modules[0].transferPractice.rehearsalPlan09.defaultVariant.flow.steps[0].rubric.requiredMeanings=[],/missing new meaning/],
 [x=>x[0].modules[1].transferPractice.residentConfirmation.steps[1].afterAttemptCard.ja='他の引き出しも開けてください。',/legacy preference_permission/],
 [x=>x[0].modules[0].knowledgeModule.sections[0].explanationVi+=' changed',/merge09 current bundle identity/]
];
for(const [mutate,reason] of controls){const x=structuredClone(bundles);mutate(x);assert.throws(()=>validateMerge09(x),reason);}
console.log(JSON.stringify({status:'PASS_DRAFT_VARIANT_LINKS_FROZEN_PROJECTION_NOT_QUALITY_APPROVAL',...result,historicalSnapshotValidation,immutableInputs:evidence.immutableInputs.length,negativeControlsRejected:controls.length,loadMetrics:metrics,semanticEvaluatorExecuted:false,learnerTimingExecuted:false,coreLessons:54,coreQuestions:270,mockQuestions:60}));
