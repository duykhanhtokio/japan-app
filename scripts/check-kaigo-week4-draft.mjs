import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const root='docs/ssw-workspace/kaigo/';
const read=n=>JSON.parse(fs.readFileSync(root+'drafts/'+n,'utf8'));
const lessons=read('eating-lessons.json').lessons;
const rubric=read('eating-response-rubrics.json').lessons;
const vocab=read('eating-vocabulary.json');
const glossary=read('knowledge-glossary.json').entries;
const allVocabulary=[...vocab.vocabulary,...glossary,...read('foundation-vocabulary.json').entries,...read('week2-vocabulary.json').entries,...read('movement-vocabulary.json').vocabulary];
const vocabIds=new Set(allVocabulary.map(x=>x.id));
assert.equal(vocabIds.size,allVocabulary.length,'duplicate vocabulary IDs');
assert.equal(new Set(allVocabulary.map(x=>x.termJa)).size,allVocabulary.length,'duplicate term records');
const npcIds=new Set(read('npc-roster.json').npcs.map(x=>x.id));
const days=read('curriculum-56-days.json').days;
const manifest=read('week-04-manifest.json');
const baseline=['foundation','week2','movement'].flatMap(n=>read(n+'-lessons.json').lessons);
const playerLines=new Set(baseline.flatMap(l=>l.dialogue.filter(t=>t.speaker==='player').map(t=>t.textJa)));
const ids=new Set(baseline.flatMap(l=>[l.id,...l.questions.map(q=>q.id)]));
const add=id=>{assert(id&&!ids.has(id),'duplicate or empty ID: '+id);ids.add(id);};
let turns=0,checks=0,responses=0,cases=0;
assert.equal(lessons.length,7);assert.equal(rubric.length,7);assert.equal(vocab.vocabulary.length,20);
const allocations=[5,5,5,10,5];
for(const [i,l] of lessons.entries()){
 add(l.id);assert.equal(l.curriculumDay,22+i);assert(npcIds.has(l.npcId));
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
 if(l.curriculumDay>=26)assert.deepEqual(day.newVocabularyTarget,[0,0]);
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
assert.equal(turns,56);assert.equal(responses,28);assert.equal(checks,35);assert.equal(cases,28);
assert.equal(new Set(lessons.map(l=>JSON.stringify(l.knowledgeVi))).size,7);
assert.equal(vocab.vocabulary.filter(v=>v.readingCheck==='visual_source_page').length,11);
assert.equal(vocab.vocabulary.filter(v=>v.readingCheck==='ai_editorial_only_not_source_visual_check').length,9);
assert(vocab.vocabulary.every(v=>v.readingKana&&v.meaningVi&&v.exampleJa&&v.exampleVi));
const d=n=>lessons.find(l=>l.curriculumDay===n);
assert(d(25).dialogue[1].textJa.includes('小野寺さんから見て'));assert(d(25).dialogue[3].textJa.includes('小野寺さんの右側'));
assert(d(25).reading.textJa.includes('本人の右側'));assert(d(26).contextVi.includes('miệng không còn thức ăn'));
assert(d(27).dialogue[1].textJa.includes('食べた量'));assert(d(27).dialogue[5].textJa.includes('未確認'));
assert(d(28).dialogue[5].textJa.includes('川瀬さんが計画を確認'));assert.equal(d(23).npcId,'kaigo-npc-kitchen');
assert.equal(manifest.dialogueTurns,turns);assert.equal(manifest.lessonChecks,checks);assert.equal(manifest.playerTurnRubrics,responses);assert.equal(manifest.scenarioAssessmentCases,cases);assert.equal(manifest.durationMeasured,false);assert.equal(manifest.releaseReady,false);
const plan=JSON.parse(fs.readFileSync(root+'approved-plan.json','utf8'));
assert.equal(plan.production.lessonsAuthored,baseline.length+lessons.length);assert.equal(plan.production.lessonQuestionsAuthored,baseline.reduce((n,l)=>n+l.questions.length,0)+checks);
const names=['eating-lessons.json','eating-vocabulary.json','eating-response-rubrics.json','week-04-manifest.json','curriculum-56-days.json'];
const hashes=Object.fromEntries(names.map(n=>[n,crypto.createHash('sha256').update(fs.readFileSync(root+'drafts/'+n)).digest('hex')]));
const report={status:'PASS bounded structural/content invariants, not human or semantic-runtime certification',week:4,lessons:7,dialogueTurns:turns,questions:checks,playerTurnRubrics:responses,scenarioAssessmentCases:cases,knowledgeModules:7,transferCases:7,vocabulary:20,visuallyCheckedSourceReadings:11,aiOnlyReadings:9,plannedMinutes:210,durationMeasured:false,humanReviewed:false,runtimeIntegrated:false,releaseReady:false,checks:['IDs and links across all four weeks','No duplicate selected term records','Stable NPC IDs','Japanese/VI separated','Turn and rubric/model/variant alignment','Question-choice/rationale structure','Day25 resident viewpoint','Day26 conversation after chewing','Day27 eaten versus remaining/unknown drink amount','Day28 actor continuity','Original week4 minute allocation retained','Review gates remain false'],hashes,limits:['Meaning, answer uniqueness and originality require editorial reading beyond these checks','Scenario cases are specifications; no evaluator was executed','Human domain/native/rights review pending','Duration/assets/app/audio/device behavior not tested']};
if(process.argv.includes('--write-report'))fs.writeFileSync(root+'drafts/week4-validation.json',JSON.stringify(report,null,2)+'\n');
console.log(`PASS week4 draft:7 lessons,${turns} turns,${checks} questions,${responses} rubrics,${cases} editorial cases. Human/runtime/time gates remain pending.`);
