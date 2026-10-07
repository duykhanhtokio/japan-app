import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const root='docs/ssw-workspace/kaigo/';
const read=n=>JSON.parse(fs.readFileSync(root+'drafts/'+n,'utf8'));
const names=['foundation','week2','movement'];
const lessons=names.flatMap(n=>read(n+'-lessons.json').lessons).sort((a,b)=>a.curriculumDay-b.curriculumDay);
const rubrics=names.flatMap(n=>read(n+'-response-rubrics.json').lessons);
const glossary=read('knowledge-glossary.json');
const conceptIds=new Set(glossary.entries.map(x=>x.id));
const curriculum=read('curriculum-56-days.json').days;
assert.equal(lessons.length,21);assert.equal(conceptIds.size,14);
let checks=0,turns=0,cases=0;
const allIds=new Set();const knowledgeSets=new Set();
for (const [i,l] of lessons.entries()) {
 assert.equal(l.curriculumDay,i+1);assert.equal(l.revision,2);
 assert.equal(l.knowledgeVi.length,4);assert.equal(l.knowledgeModule.sections.length,4);
 const key=JSON.stringify(l.knowledgeVi);assert(!knowledgeSets.has(key),'Duplicated whole knowledge module');knowledgeSets.add(key);
 for(const s of l.knowledgeModule.sections){assert(s.explanationVi.length>100);assert(s.sourcePages.length>0);assert(s.sourcePages.every(p=>p.printed>0&&p.pdf>0));}
 assert(l.knowledgeModule.retrievalCheck.promptVi&&l.knowledgeModule.retrievalCheck.expectedVi);
 assert(l.knowledgeModule.conceptTermIds.every(id=>conceptIds.has(id)));
 assert(l.transferPractice.contextVi&&l.transferPractice.taskVi&&l.transferPractice.boundaryVi);
 assert.equal(l.questions.length,5);
 const day=curriculum.find(d=>d.day===l.curriculumDay);
 assert.deepEqual(day.dailyBlocks,l.dailyPractice.blocks);
 assert.deepEqual(l.dailyPractice.blocks.map(b=>b.minutes),[3,8,5,9,5]);
 assert.equal(l.dailyPractice.activities.reduce((sum,a)=>sum+a.minutes,0),30);
 assert.equal(l.dailyPractice.durationMeasured,false);
 assert(l.sourceMetadata.sha256==='997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54');
 for(const t of l.dialogue){assert(!/\\u[0-9a-fA-F]{4}/.test(t.textJa));}
 assert(!/\\u[0-9a-fA-F]{4}/.test(l.reading.textJa),'Literal Unicode escape in displayed reading');
 for(const q of l.questions){
  assert(!allIds.has(q.id));allIds.add(q.id);
  assert.equal(new Set(q.optionsJa).size,4);assert.equal(q.rationalesVi.length,4);
  q.rationalesVi.forEach((r,j)=>assert(r.startsWith(j===q.correctIndex?'Đúng:':'Sai:')));
  assert.equal(q.practiceScope,'lesson_check_not_full_mock');checks++;
 }
 const r=rubrics.find(r=>r.lessonId===l.id);
 for(const t of r.turns){
  assert(t.requiredMeaningVi.length>0);assert(t.assessmentVi.partial&&t.assessmentVi.asrUncertain&&t.assessmentVi.clarification);
  assert.equal(t.acceptedExamplesJa[0],l.dialogue[t.playerTurn-1].textJa);
  assert.equal(new Set(t.acceptedExamplesJa).size,2);turns++;
 }
 assert.equal(r.scenarioAssessmentCases.length,4);
 for(const c of r.scenarioAssessmentCases){assert(c.inputJa&&c.feedbackVi!=='' );if(c.expected==='bounded_clarification'){assert.equal(c.inputSpeaker,'npc');assert(c.expectedPlayerReplyJa&&c.branchOutcome);}else{assert.equal(c.inputSpeaker,'player');assert.equal(c.advance,c.expected==='complete_semantic_variant');}cases++;}
 for(const flag of ['domainHumanReviewed','nativeLanguageReviewed','rightsReviewed','runtimeIntegrated','releaseReady'])assert.equal(l.review[flag],false);
}
const byDay=d=>lessons.find(l=>l.curriculumDay===d);
const actor=byDay(16);assert(actor.playerRoleVi.includes('Tanaka'));assert(actor.reading.textJa.includes('田中職員が右側の通路を確認した'));
const who=actor.questions.find(q=>q.id==='move-q09');assert.equal(who.optionsJa[who.correctIndex],'田中職員。');assert(!actor.reading.meaningVi.includes('Kishimoto'));
const now=byDay(19);assert(now.dialogue[1].textJa.startsWith('今は'));assert(!now.expressions.some(e=>e.textJa.includes('今日は参加')));
assert(!rubrics.find(r=>r.lessonId===now.id).turns[0].acceptedExamplesJa.some(s=>s.includes('今日は参加')));
assert(!byDay(13).contextVi.startsWith('Chưa ai té'));
assert(byDay(11).dialogue[3].textJa.includes('向かって立つ'));assert(byDay(11).reading.textJa.includes('向かって立った'));
assert.equal(byDay(12).npcId,'kaigo-npc-resident-a');assert(byDay(12).dialogue[0].textJa.includes('約束'));assert(byDay(12).dialogue[5].textJa.includes('まだ予定を確認していません'));
assert.equal(checks,105);assert.equal(turns,88);assert.equal(cases,84);
const hashes=Object.fromEntries(names.flatMap(n=>[n+'-lessons.json',n+'-response-rubrics.json']).concat(['knowledge-glossary.json','curriculum-56-days.json']).map(n=>[n,crypto.createHash('sha256').update(fs.readFileSync(root+'drafts/'+n)).digest('hex')]));
const report={version:2,status:'PASS bounded content integrity; not human or runtime certification',lessons:21,knowledgeModules:21,uniqueKnowledgeModules:knowledgeSets.size,questions:checks,playerTurnRubrics:turns,scenarioAssessmentCases:cases,conceptTerms:14,minutesPerDay:30,durationMeasured:false,regressionChecks:['actor continuity day16','now versus today day19','parsed Unicode text days18/20','day13 limited observation perspective','day11 orientation reference','direct resident role day12','distinct knowledge goals','answer/rationale alignment','rubric/model alignment','separate NPC clarification branches','curriculum/activity minute alignment','review flags remain false'],hashes,limitations:['Meaning and distractor quality require editorial reading, not proved by this script','Scenario cases are specifications, not tests of a working semantic evaluator','Human domain/native/rights review pending','Duration and app/audio/device behavior not measured']};
if(process.argv.includes('--write-report'))fs.writeFileSync(root+'reviews/weeks-01-03-revision-integrity.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS content revision integrity:21 lessons,105 questions,88 rubrics,84 scenario cases; human/runtime/measured-time gates remain pending.');
