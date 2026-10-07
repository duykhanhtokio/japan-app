import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const root='docs/ssw-workspace/kaigo/';
const read=n=>JSON.parse(fs.readFileSync(root+'drafts/'+n,'utf8'));
const lessons=read('housework-lessons.json').lessons;
const rubric=read('housework-response-rubrics.json').lessons;
const vocab=read('housework-vocabulary.json');
const glossary=read('knowledge-glossary.json').entries;
const allVocabulary=[...vocab.vocabulary,...read('hygiene-vocabulary.json').vocabulary,...read('eating-vocabulary.json').vocabulary,...read('excretion-vocabulary.json').vocabulary,...glossary,...read('foundation-vocabulary.json').entries,...read('week2-vocabulary.json').entries,...read('movement-vocabulary.json').vocabulary];
const vocabIds=new Set(allVocabulary.map(x=>x.id));
assert.equal(vocabIds.size,allVocabulary.length,'duplicate vocabulary IDs');
assert.equal(new Set(allVocabulary.map(x=>x.termJa)).size,allVocabulary.length,'duplicate term records');
const npcIds=new Set(read('npc-roster.json').npcs.map(x=>x.id));
const days=read('curriculum-56-days.json').days;
const manifest=read('week-07-manifest.json');
const baseline=['foundation','week2','movement','eating','excretion','hygiene'].flatMap(n=>read(n+'-lessons.json').lessons);
const playerLines=new Set(baseline.flatMap(l=>l.dialogue.filter(t=>t.speaker==='player').map(t=>t.textJa)));
const ids=new Set(baseline.flatMap(l=>[l.id,...l.questions.map(q=>q.id)]));
const add=id=>{assert(id&&!ids.has(id),'duplicate or empty ID: '+id);ids.add(id);};
let turns=0,checks=0,responses=0,cases=0;
assert.equal(lessons.length,7);assert.equal(rubric.length,7);assert.equal(vocab.vocabulary.length,18);
const allocations=[5,5,5,10,5];
for(const [i,l] of lessons.entries()){
 add(l.id);assert.equal(l.curriculumDay,43+i);assert(npcIds.has(l.npcId));
 assert.equal(l.knowledgeVi.length,4);assert.equal(l.knowledgeModule.sections.length,4);
 assert(l.knowledgeModule.sections.every(s=>s.explanationVi.length>100&&s.sourcePages.length>0));
 assert(l.knowledgeModule.retrievalCheck.promptVi&&l.knowledgeModule.retrievalCheck.expectedVi);
 assert(l.knowledgeModule.conceptTermIds.every(id=>vocabIds.has(id)));
 assert(l.vocabularyIds.every(id=>vocabIds.has(id)));assert(l.recognitionVocabularyIds.every(id=>l.vocabularyIds.includes(id)));
 assert(l.transferPractice.contextVi&&l.transferPractice.taskVi&&l.transferPractice.boundaryVi);
 assert(l.sourceRefs.every(p=>Number.isInteger(p.printedPage)&&p.pdfPage===p.printedPage+2));
 assert.equal(l.sourceMetadata.sha256,'997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54');assert.equal(l.sourceMetadata.publishSourceBytes,false);
 const day=days.find(x=>x.day===l.curriculumDay);assert.equal(day.lessonId,l.id);assert.deepEqual(day.npcIds,[l.npcId]);
 assert.deepEqual(l.dailyPractice.blocks.map(x=>x.minutes),allocations);assert.deepEqual(l.dailyPractice.blocks,day.dailyBlocks);
 assert.equal(l.dailyPractice.activities.reduce((n,x)=>n+x.minutes,0),30);assert.equal(l.dailyPractice.durationMeasured,false);
 assert(l.dailyPractice.activities.every((a,j)=>a.minutes===l.dailyPractice.blocks[j].minutes));
 if(l.curriculumDay>=47)assert.deepEqual(day.newVocabularyTarget,[0,0]);
 assert(l.dialogue.length>=6&&l.dialogue.length<=12);assert.equal(l.expressions.length,2);
 const r=rubric.find(x=>x.lessonId===l.id);assert(r);assert.equal(r.turns.length,l.dialogue.filter(t=>t.speaker==='player').length);
 for(const [j,t] of l.dialogue.entries()){
  assert.equal(t.turn,j+1);assert.equal(t.speaker,j%2===0?'npc':'player');assert(t.textJa&&t.meaningVi);
  assert(!/\\u[0-9a-fA-F]{4}/.test(t.textJa));assert(!/[\u00C0-\u1EF9]/u.test(t.textJa),'Vietnamese accidentally mixed into JA');
  if(t.speaker==='player'){assert(!playerLines.has(t.textJa),'duplicate player line');playerLines.add(t.textJa);}
 }
 for(const t of r.turns){
  add(t.id);assert.equal(t.promptTurn,t.playerTurn-1);assert.equal(l.dialogue[t.playerTurn-1].speaker,'player');
  assert.equal(t.acceptedExamplesJa[0],l.dialogue[t.playerTurn-1].textJa);assert.equal(new Set(t.acceptedExamplesJa).size,2);
  assert(t.requiredMeaningVi.length>=2);assert(t.assessmentVi.partial&&t.assessmentVi.asrUncertain&&t.assessmentVi.clarification);
  if(t.nextNpcTurn!==null)assert.equal(t.nextNpcTurn,t.playerTurn+1);responses++;
 }
 assert.equal(r.scenarioAssessmentCases.length,4);
 const expected=new Set();
 for(const c of r.scenarioAssessmentCases){
  add(c.id);assert(c.inputJa);assert(r.turns.some(t=>t.playerTurn===c.playerTurn));expected.add(c.expected);
  if(c.expected==='bounded_clarification'){assert.equal(c.inputSpeaker,'npc');assert(c.expectedPlayerReplyJa&&c.branchOutcome);assert.equal(c.advance,false);}
  else{assert.equal(c.inputSpeaker,'player');assert(c.feedbackVi);assert.equal(c.advance,c.expected==='complete_semantic_variant');}
  cases++;
 }
 assert.equal(expected.size,4);assert.equal(l.questions.length,5);
 for(const q of l.questions){
  add(q.id);assert(q.promptJa);assert.equal(new Set(q.optionsJa).size,4);assert(q.optionsJa.every(x=>x));assert.equal(q.rationalesVi.length,4);
  assert(Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4);
  q.rationalesVi.forEach((r,j)=>assert(r.startsWith(j===q.correctIndex?'Đúng:':'Sai:')));
  assert.equal(q.practiceScope,'lesson_check_not_full_mock');checks++;
 }
 assert(l.reading.textJa&&l.reading.meaningVi);assert(!/\\u[0-9a-fA-F]{4}/.test(l.reading.textJa));
 for(const flag of ['domainHumanReviewed','nativeLanguageReviewed','publisherReviewed','rightsReviewed','runtimeIntegrated','releaseReady'])assert.equal(l.review[flag],false);
 for(const e of l.expressions){add(e.id);assert(l.dialogue.some(t=>t.speaker==='player'&&t.textJa===e.textJa&&t.meaningVi===e.meaningVi));}
 turns+=l.dialogue.length;
}
for(const l of lessons){
 assert.equal(l.review.aiEditorialReviewed,true);
 assert(l.knowledgeModule.sections.every(s=>s.sourcePages.every(p=>l.sourceRefs.some(r=>r.printedPage===p.printedPage&&r.pdfPage===p.pdfPage))));
 assert(l.knowledgeModule.conceptTermIds.every(id=>l.vocabularyIds.includes(id)));
 if(l.curriculumDay>=47)assert.equal(l.dailyPractice.introducedVocabularyIds.length,0);
}
assert.deepEqual(lessons.slice(0,4).map(l=>l.dailyPractice.introducedVocabularyIds.length),[4,4,4,6]);
assert.equal(new Set(lessons.flatMap(l=>l.dailyPractice.introducedVocabularyIds)).size,18);
const chosen=lessons.flatMap(l=>l.questions.map(q=>q.correctIndex));
assert.deepEqual([0,1,2,3].map(i=>chosen.filter(x=>x===i).length),[9,9,9,8]);
assert(chosen.every((x,i)=>i<2||!(x===chosen[i-1]&&x===chosen[i-2])),'editorial lesson choices contain three repeats');
assert.equal(turns,56);assert.equal(responses,28);assert.equal(checks,35);assert.equal(cases,28);
assert.equal(new Set(lessons.map(l=>JSON.stringify(l.knowledgeVi))).size,7);
assert.equal(vocab.vocabulary.filter(v=>v.readingCheck==='visual_source_page').length,18);
assert.equal(vocab.vocabulary.filter(v=>v.readingCheck==='ai_editorial_only_not_source_visual_check').length,0);
assert(vocab.vocabulary.every(v=>v.readingKana&&v.meaningVi&&v.exampleJa&&v.exampleVi));
// Critical distinctions anchored to finalized content, not medical certification.
const d=n=>lessons.find(l=>l.curriculumDay===n);
assert(d(43).dialogue[5].textJa.includes('途中でやめたい'));
assert(d(44).dialogue[5].textJa.includes('どちらの組にも入れず'));
assert(d(45).dialogue[5].textJa.includes('参加そのものは申込み不要'));
assert(d(46).dialogue[3].textJa.includes('他のタオルはまだ確認していません'));
assert(d(47).dialogue[5].textJa.includes('それ以前の状況は確認していません'));
assert(d(48).dialogue[7].textJa.includes('連絡を引き受けたことだけで完了にはしません'));
assert(d(49).dialogue[5].textJa.includes('同意があるとは扱いません'));
assert.equal(manifest.dialogueTurns,turns);assert.equal(manifest.lessonChecks,checks);assert.equal(manifest.playerTurnRubrics,responses);assert.equal(manifest.scenarioAssessmentCases,cases);assert.equal(manifest.durationMeasured,false);assert.equal(manifest.releaseReady,false);
const plan=JSON.parse(fs.readFileSync(root+'approved-plan.json','utf8'));
const authored=fs.readdirSync(root+'drafts/').filter(n=>n.endsWith('-lessons.json')).flatMap(n=>read(n).lessons);
assert.equal(plan.production.lessonsAuthored,authored.length);
assert.equal(plan.production.lessonQuestionsAuthored,authored.reduce((n,l)=>n+l.questions.length,0));
const names=['housework-lessons.json','housework-vocabulary.json','housework-response-rubrics.json','week-07-manifest.json','curriculum-56-days.json'];
const hashes=Object.fromEntries(names.map(n=>[n,crypto.createHash('sha256').update(fs.readFileSync(root+'drafts/'+n)).digest('hex')]));
const report={status:'PASS bounded structural/content invariants, not human or semantic-runtime certification',week:7,lessons:7,dialogueTurns:turns,questions:checks,playerTurnRubrics:responses,scenarioAssessmentCases:cases,knowledgeModules:7,transferCases:7,vocabulary:18,visuallyCheckedSourceReadings:18,aiOnlyReadings:0,plannedMinutes:210,durationMeasured:false,humanReviewed:false,runtimeIntegrated:false,releaseReady:false,checks:['IDs and links across seven weeks','No duplicate selected term records','JA and VI separated','Rubric models and variants aligned','Four option rationale and key alignment','Participation scope and right to stop','Personal sorting not disposal','Version update and condition object','Observed subset not all items','Incident cause and earlier presence unknown','Call attempt versus receipt and completion','Family request not resident consent','Original allocation retained','Human gates false'],hashes,limits:['Meaning, answer uniqueness and originality require editorial reading beyond these checks','Scenario cases are specifications; no evaluator was executed','Human domain/native/rights review pending','Duration/assets/app/audio/device behavior not tested']};
if(process.argv.includes('--write-report'))fs.writeFileSync(root+'drafts/week7-validation.json',JSON.stringify(report,null,2)+'\n');
console.log(`PASS week7 draft:7 lessons,${turns} turns,${checks} questions,${responses} rubrics,${cases} editorial cases. Human/runtime/time gates remain pending.`);
