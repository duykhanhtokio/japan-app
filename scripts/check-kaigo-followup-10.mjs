import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {restoreFollowup10Bundles} from './kaigo-followup-10-lineage.mjs';
const dir='docs/ssw-workspace/kaigo/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const blob=s=>{const b=Buffer.from(s);return crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');};
const evidence=read(dir+'reviews/priority-gap-followup-10.json');
const bundles=['01','02'].map(n=>read(dir+'drafts/priority-gap-supplements-'+n+'.json'));
const targets=['kaigo-gap-worker-health-01','kaigo-gap-services-01'];
const modules=b=>b.map((x,i)=>x.modules.find(m=>m.id===targets[i]));
const flows=b=>modules(b).map(m=>m.transferPractice.rehearsalPlan10.defaultVariant.flow);
const gate=(v,s)=>assert(v,s);
const cp=s=>[...s.normalize('NFKC').replace(/\s/gu,'')].length;
function approval(v){if(Array.isArray(v))return v.forEach(approval);if(v&&typeof v==='object')for(const[k,x]of Object.entries(v)){if(['domainHumanReviewed','nativeLanguageReviewed','publisherReviewed','rightsReviewed','runtimeIntegrated','appIntegrationReady','releaseReady'].includes(k))assert.equal(x,false,'approval gate');approval(x);}}
export function validateFollowup10(b){
 approval(b);const ms=modules(b),[w,s]=flows(b);
 for(const m of ms){
  gate(m.replacementPlan.selectedInCurriculum===false&&m.replacementPlan.replacementReady===false,'selection gate');
  const p=m.transferPractice.rehearsalPlan10,g=p.selectionGate;
  gate(p.mode==='choose_one_variant_per_rehearsal_not_append_required_practice','variant mode');
  gate(p.defaultVariant.kind==='embedded_staged_flow'&&p.defaultVariantId===p.defaultVariant.flow.id,'default link');
  gate(g.maximumRequiredVariantsPerRehearsal===1&&g.additionalMandatoryMinutes===0&&g.durationMeasured===false&&g.observedLearnerData===null&&g.plannedDailyMinutes===30&&g.candidateSelected===false&&g.runtimeImplemented===false,'load gate');
  gate(p.retainedVariant.kind==='legacy_transfer_fields_of_this_object','legacy selector');
  assert.deepEqual(p.retainedVariant.contentFields,Object.keys(m.transferPractice).filter(k=>k!=='rehearsalPlan10'),'legacy fields');
  assert.deepEqual(p.retainedVariant.coversQuestionIds,[m.id+'-q04',m.id+'-q05'],'question links');
 }
 assert.deepEqual(w.steps.map(t=>t.responseTarget),['care_lead_initial_report','resident_followup_question','care_lead_followup_report','care_lead_readback_pending'],'worker sequence');
 assert.deepEqual(w.steps.map(t=>t.npcId),['kaigo-npc-care-lead','kaigo-npc-resident-c','kaigo-npc-care-lead','kaigo-npc-care-lead'],'worker recipients');
 gate(w.factsBefore.residentReportTime==='09:15'&&w.factsBefore.painAsked===false&&w.factsBefore.careStarted===false&&w.factsBefore.assignedColleaguePresent===true,'worker before facts');
 gate(w.factsAfterStep2.residentReplyTime==='09:20'&&w.factsAfterStep2.painAsked===true&&w.factsAfterStep2.residentSaysPain===false&&w.factsAfterStep2.residentSaysFatigueUnchanged===true&&w.factsAfterStep2.residentWantsRest===true,'worker reply facts');
 gate(w.outcome.followupReported===true&&w.outcome.leadAcknowledged===true&&w.outcome.nurseContacted===true&&w.outcome.nurseArrived===false&&w.outcome.careStarted===false&&w.outcome.staffRoleConfirmed===false,'worker outcome');
 for(const facts of [w.factsBefore,w.factsAfterStep2,w.outcome])gate(facts.measurementsKnown===false&&facts.causeKnown===false,'worker unknowns');
 gate(w.steps[2].modelJa.includes('九時二十分')&&w.steps[2].modelJa.includes('九時十五分には痛みをまだ尋ねていません')&&w.steps[2].modelJa.includes('ご本人は')&&w.steps[2].modelJa.includes('測定値と原因は引き続き未確認'),'worker source and time');
 gate(w.steps[3].modelJa.includes('まだ到着していない')&&w.steps[3].modelJa.includes('担当変更は未確認'),'worker contact pending');
 assert.deepEqual(s.steps.map(t=>t.responseTarget),['resident_appointment_proposal','care_lead_changed_request','resident_confirm_available_result','care_lead_appointment_result'],'services sequence');
 assert.deepEqual(s.steps.map(t=>t.npcId),['kaigo-npc-resident-a','kaigo-npc-care-lead','kaigo-npc-resident-a','kaigo-npc-care-lead'],'services recipients');
 gate(s.factsBefore.proposedDate==='10-18'&&s.factsBefore.proposedTime==='10:30'&&s.factsBefore.residentConsent===false,'services proposed');
 gate(s.factsAfterStep2.confirmedAvailableDate==='10-19'&&s.factsAfterStep2.confirmedAvailableTime==='10:30'&&s.factsAfterStep2.residentConsent===false,'services available not accepted');
 gate(s.outcome.appointmentDate==='10-19'&&s.outcome.appointmentTime==='10:30'&&s.outcome.residentAcceptedAppointmentOnly===true&&s.outcome.residentRequestedFamilyAbsent===true&&s.outcome.leadInformed===true,'services decision');
 for(const f of [s.factsBefore,s.outcome])gate(f.itemsSelected===false&&f.goodsTransferred===false&&f.serviceApplicationMade===false&&f.serviceStartDateConfirmed===false,'services not goods or enrollment');
 gate(s.steps[1].afterAttemptCard.ja.includes('十九日の十時三十分')&&s.steps[2].modelJa.includes('十月十九日十時三十分')&&s.steps[2].modelJa.includes('よろしいですか'),'services result then question');
 gate(s.steps[3].modelJa.includes('同意しました')&&s.steps[3].modelJa.includes('希望と条件、開始日は未確認')&&s.steps[3].modelJa.includes('申込みはしていません'),'services reported limits');
 const ids=new Set();function visit(v){if(Array.isArray(v))return v.forEach(visit);if(v&&typeof v==='object'){if(v.id&&v.id!=='kaigo-textbook-2025-03'){gate(!ids.has(v.id),'duplicate ID');ids.add(v.id);}Object.values(v).forEach(visit);}}b.forEach(visit);
 for(const f of [w,s]){gate(f.steps.length===4,'four stages');for(const t of f.steps){
  const r=t.rubric;gate(t.modelJa&&t.modelVi&&t.afterAttemptCard.ja&&t.afterAttemptCard.vi&&t.afterAttemptCard.revealAfterAttempt===true,'reply reveal');
  gate(r.requiredMeanings.length>=2,'required meanings');
  gate(r.acceptableJa.length===2&&r.acceptableJa[0]===t.modelJa&&r.unsafeJa.length===1,'rubric alternatives');
  gate(r.evaluationPolicy.exactStringMatchRequired===false&&r.evaluationPolicy.runtimeImplemented===false,'evaluator gate');
  assert.deepEqual(r.assessmentCases.map(c=>c.expected),['accept_meaning','clarify_missing_information','correct_before_advance'],'case order');
  gate(r.assessmentCases.every(c=>c.specOnly===true&&c.inputJa),'case specs');
 }}
 const restored=restoreFollowup10Bundles(b);
 for(let i=0;i<2;i++)assert.equal(blob(JSON.stringify(restored[i],null,2)+'\n'),evidence.changes[i].beforeGitBlobSha,'frozen projection');
 return {IDsChecked:ids.size,newVariantTurns:16,newVariantRubrics:8,newVariantCaseSpecs:24,legacyFieldsAndMerge09Preserved:true};
}
const result=validateFollowup10(bundles);
for(const f of evidence.immutableInputs)assert.equal(blob(fs.readFileSync(f.path)),f.gitBlobSha,'immutable '+f.path);
const metrics={};for(const f of flows(bundles)){const mid=f.id.startsWith(targets[0])?targets[0]:targets[1];metrics[mid]={shownDialogueJa:f.steps.reduce((n,t)=>n+cp(t.modelJa)+cp(t.afterAttemptCard.ja),0),playerModelJa:f.steps.reduce((n,t)=>n+cp(t.modelJa),0),meaningCount:f.steps.reduce((n,t)=>n+t.rubric.requiredMeanings.length,0)};}metrics.unit='NFKC_non_whitespace_Unicode_codepoints_not_minutes';assert.deepEqual(evidence.loadMetrics,metrics,'computed load metrics');
assert.equal(evidence.timingSheets.length,2);for(const t of evidence.timingSheets){const c=evidence.changes.find(x=>x.targetModuleId===t.candidateLessonId);assert.equal(t.candidateGitBlobSha,c.afterGitBlobSha);assert.equal(t.defaultVariantId,flows(bundles)[targets.indexOf(t.candidateLessonId)].id);assert.equal(t.status,'unexecuted');for(const k of ['variantChosenForMeasurement','participantCode','sessionDate','facilitator','totalObservedSeconds','completedRequiredMeanings','unfinishedMeaningIds','selectionDecision'])assert.equal(t[k],null,'unobserved timing');assert.equal(t.phases.reduce((n,p)=>n+p.plannedMinutes,0),30);assert.deepEqual(t.phases.map(p=>p.plannedMinutes),t.day===14?[3,8,5,9,5]:[5,5,5,10,5]);for(const p of t.phases)for(const k of ['observedSeconds','retrySeconds','feedbackSeconds','completed'])assert.equal(p[k],null,'unobserved timing');}
const core=['foundation','week2','movement','eating','excretion','hygiene','housework','review'].flatMap(n=>read(dir+'drafts/'+n+'-lessons.json').lessons);assert.equal(core.length,54);assert.equal(core.flatMap(l=>l.questions).length,270);assert.equal(['skills','japanese'].flatMap(n=>read(dir+'drafts/kaigo-'+n+'-mock-01.json').questions).length,60);for(const m of bundles.flatMap(b=>b.modules))assert.equal(read(dir+'drafts/curriculum-56-days.json').days.find(d=>d.day===m.curriculumDay).lessonId,m.baseLessonId);
const controls=[
 [x=>modules(x)[0].replacementPlan.selectedInCurriculum=true,/selection gate/],
 [x=>x[0].review.releaseReady=true,/approval gate/],
 [x=>modules(x)[0].transferPractice.rehearsalPlan10.selectionGate.maximumRequiredVariantsPerRehearsal=2,/load gate/],
 [x=>modules(x)[0].transferPractice.rehearsalPlan10.defaultVariantId='missing',/default link/],
 [x=>flows(x)[0].factsAfterStep2.residentReplyTime='09:15',/worker reply facts/],
 [x=>flows(x)[0].steps[2].modelJa='痛みはありません。原因は年齢です。',/worker source and time/],
 [x=>flows(x)[0].outcome.nurseArrived=true,/worker outcome/],
 [x=>flows(x)[1].factsAfterStep2.residentConsent=true,/services available not accepted/],
 [x=>flows(x)[1].outcome.serviceApplicationMade=true,/services not goods or enrollment/],
 [x=>flows(x)[1].steps[2].npcId='kaigo-npc-family',/services recipients/],
 [x=>flows(x)[1].steps[0].rubric.requiredMeanings=[],/required meanings/],
 [x=>modules(x)[0].knowledgeModule.sections[0].explanationVi+=' changed',/followup10 current bundle identity/],
 [x=>x[1].modules[0].transferPractice.rehearsalPlan09.defaultVariant.flow.outcome.residentChoice='join',/followup10 current bundle identity/]
];for(const[mutate,reason]of controls){const x=structuredClone(bundles);mutate(x);assert.throws(()=>validateFollowup10(x),reason);}
console.log(JSON.stringify({status:'PASS_DRAFT_FOLLOWUP_LINKS_FROZEN_PROJECTION_NOT_QUALITY_APPROVAL',...result,immutableInputs:evidence.immutableInputs.length,negativeControlsRejected:controls.length,loadMetrics:metrics,semanticEvaluatorExecuted:false,learnerTimingExecuted:false,coreLessons:54,coreQuestions:270,mockQuestions:60}));
