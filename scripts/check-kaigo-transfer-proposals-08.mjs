import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const base='docs/ssw-workspace/kaigo/';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const blob=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
const gate=(ok,label)=>{if(!ok)throw new Error(label);};
const flags=['domainHumanReviewed','nativeLanguageReviewed','publisherReviewed','rightsReviewed','runtimeIntegrated','appIntegrationReady','releaseReady'];
export function validateProposal(d){
 gate(d.appliedToCandidateBundles===false && d.selectedInCurriculum===false && d.replacementReady===false,'selection_or_application');
 gate(Object.values(d.quotaAddition).every(n=>n===0),'quota');
 for(const f of flags)gate(d.review[f]===false,'approval');
 gate(d.proposals.length===2,'proposal_count');
 const ids=new Set(), add=id=>{gate(typeof id==='string'&&!ids.has(id),'duplicate_id');ids.add(id);};
 for(const p of d.proposals){
  add(p.id);
  for(const f of flags)gate(p.review[f]===false,'approval');
  gate(p.integrationDecision.selected===false&&p.integrationDecision.ready===false&&p.integrationDecision.decision===null,'selection_or_application');
  gate(p.sameDaySlot.additionalMandatoryMinutes===0&&p.sameDaySlot.durationMeasured===false&&p.sameDaySlot.measuredSeconds===null,'invented_timing');
  gate(p.sameDaySlot.plannedBlocks.reduce((a,b)=>a+b,0)===30,'planned_blocks');
  gate(p.dialogue.length>=6&&p.dialogue.length<=12,'turn_range');
  const players=p.dialogue.filter(t=>t.speaker==='player');
  gate(players.length===p.responseRubrics.length,'rubric_count');
  const seenTurns=new Set();
  p.dialogue.forEach((t,i)=>{add(t.id);gate(t.speaker===(i%2?'player':'npc'),'speaker_order');gate(t.ja.length>0&&t.vi.length>0&&!/[À-ỹ]/u.test(t.ja),'language_fields');gate(['kaigo-npc-resident-a','kaigo-npc-resident-b','kaigo-npc-care-lead'].includes(t.npcId),'npc_id');});
  for(const r of p.responseRubrics){
   add(r.id);const t=players.find(t=>t.id===r.playerTurnId);
   gate(t&&t.npcId===r.responseNpcId&&!seenTurns.has(t.id),'rubric_link');seenTurns.add(t.id);
   gate(r.requiredMeanings.length>=2,'missing_meanings');
   r.requiredMeanings.forEach(m=>{add(m.id);gate(m.vi.length>0,'missing_meanings');});
   gate(r.acceptableJa.length>=2&&r.acceptableJa.includes(t.ja),'model_link');
   gate(r.evaluationPolicy.runtimeImplemented===false&&r.evaluationPolicy.exactStringMatchRequired===false,'evaluator_claim');
   gate(r.assessmentCases.length===3,'case_count');
   assert.deepEqual(r.assessmentCases.map(c=>c.expected),['accept_meaning','clarify_missing_information','correct_before_advance']);
   r.assessmentCases.forEach(c=>{add(c.id);gate(c.specOnly===true&&c.inputJa.length>0,'case_execution_claim');});
   for(const f of flags)gate(r.review[f]===false,'approval');
  }
 }
 const [cloth,care]=d.proposals;
 gate(cloth.day===42&&cloth.targetModuleId==='kaigo-gap-infection-01'&&care.day===50&&care.targetModuleId==='kaigo-gap-care-process-01','target_mapping');
 gate(cloth.facts.supportRequested==='face_only'&&cloth.facts.hands==='resident_wants_to_do_self'&&cloth.facts.careStarted===false&&cloth.facts.plainClothOwnerKnown===false&&cloth.facts.preferredClothFound===false&&cloth.facts.clothLostConfirmed===false,'cloth_scope_or_fact');
 gate(cloth.outcome.careCompleted===false&&cloth.outcome.alternativeClothAuthorized===false&&cloth.outcome.resultOfLeadCheck===null,'cloth_scope_or_fact');
 const c=care.resultCard;
 gate(c.requestedRoomArrival==='14:25'&&c.confirmedRoomArrival==='14:25'&&c.supportConfirmed===true&&c.activityStarted===false&&c.returnCompleted===false&&c.participationDecided===false,'return_result_fact');
 gate(care.outcome.residentChoice==='decline_today'&&care.outcome.activityStarted===false&&care.outcome.goalAchievementConfirmed===false&&care.outcome.planApprovedByLearner===false,'choice_or_completion');
 gate(care.alternateResultPractice.requestedRoomArrival==='14:25'&&care.alternateResultPractice.confirmedRoomArrival==='14:35'&&care.alternateResultPractice.supportConfirmed===true,'alternate_result_fact');
 gate(d.integrationWorklist.length===2&&d.integrationWorklist.every(w=>w.status==='pending_merge_and_load_review'&&w.mustRetainVi.length>=3),'merge_prerequisites');
 return {turns:d.proposals.reduce((n,p)=>n+p.dialogue.length,0),rubrics:d.proposals.reduce((n,p)=>n+p.responseRubrics.length,0),caseSpecs:d.proposals.reduce((n,p)=>n+p.responseRubrics.reduce((n,r)=>n+r.assessmentCases.length,0),0)};
}
const d=read(base+'drafts/priority-gap-transfer-proposals-08.json');
const e=read(base+'reviews/priority-gap-transfer-proposals-08-evidence.json');
const counts=validateProposal(d);
for(const f of e.inputSnapshot){const b=fs.readFileSync(path.join(root,f.path));gate(blob(b)===f.gitBlobSha,'immutable_input:'+f.path);}
for(const p of d.proposals){
 const b=fs.readFileSync(path.join(root,p.targetBundlePath));gate(blob(b)===p.targetBundleGitBlob,'target_bundle_pin');
 const module=JSON.parse(b).modules.find(m=>m.id===p.targetModuleId);
 gate(module.replacementPlan.baseLessonId===p.baseLessonId&&module.replacementPlan.day===p.day&&module.replacementPlan.selectedInCurriculum===false,'base_target_link');
}
for(const m of e.mapping){const value=m.pointer.split('/').slice(1).reduce((x,k)=>x?.[k],d);gate(Array.isArray(value)&&value.length===8,'mapping_pointer');}
const ncp=s=>Array.from(s.normalize('NFKC').replace(/\s/gu,'')).length;
const metrics=d.proposals.map(p=>({proposalId:p.id,shownDialogueJaCodePoints:p.dialogue.reduce((n,t)=>n+ncp(t.ja),0),playerModelJaCodePoints:p.dialogue.filter(t=>t.speaker==='player').reduce((n,t)=>n+ncp(t.ja),0),alternateResidentReportJaCodePoints:p.alternateResultPractice?ncp(p.alternateResultPractice.modelToResidentJa):0,alternateLeadReportJaCodePoints:p.alternateResultPractice?ncp(p.alternateResultPractice.modelToLeadJa):0}));
if(e.loadMetrics)assert.deepEqual(e.loadMetrics,metrics);
const controls=[
 ['selection_or_application',x=>x.appliedToCandidateBundles=true],
 ['approval',x=>x.review.releaseReady=true],
 ['invented_timing',x=>x.proposals[0].sameDaySlot.measuredSeconds=1800],
 ['cloth_scope_or_fact',x=>x.proposals[0].facts.supportRequested='whole_body'],
 ['return_result_fact',x=>x.proposals[1].resultCard.confirmedRoomArrival='14:35'],
 ['missing_meanings',x=>x.proposals[0].responseRubrics[0].requiredMeanings=[]],
 ['rubric_link',x=>x.proposals[1].responseRubrics[0].responseNpcId='kaigo-npc-care-lead']
];
for(const [label,mutate] of controls){const x=structuredClone(d);mutate(x);let reason;try{validateProposal(x);}catch(error){reason=error.message;}gate(reason===label,'negative_control:'+label);}
console.log(JSON.stringify({status:'PASS_STRUCTURE_LINKS_FACT_CONSISTENCY_NOT_SEMANTIC_APPROVAL',immutableInputs:e.inputSnapshot.length,counts,negativeControlsRejected:controls.length,loadMetrics:metrics,semanticEvaluatorExecuted:false,learnerTimingExecuted:false}));
