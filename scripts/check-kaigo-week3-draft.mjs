import fs from 'node:fs';
import assert from 'node:assert/strict';
const root='docs/ssw-workspace/kaigo/drafts/';
const read=n=>JSON.parse(fs.readFileSync(root+n,'utf8'));
const lessons=read('movement-lessons.json').lessons.sort((a,b)=>a.curriculumDay-b.curriculumDay);
const vocab=[...read('movement-vocabulary.json').vocabulary,...read('foundation-vocabulary.json').entries];
const rubrics=read('movement-response-rubrics.json');
const days=read('curriculum-56-days.json').days;
const manifest=read('week-03-manifest.json');
const npcIds=new Set(read('npc-roster.json').npcs.map(n=>n.id));
const ids=new Set(), lines=new Set(), vocabIds=new Set(vocab.map(x=>x.id));
let turns=0,checks=0,responses=0,expressions=0;
assert.equal(lessons.length,7);assert.equal(vocabIds.size,45);assert.equal(rubrics.lessons.length,7);
for(const [index,l] of lessons.entries()){
 assert(npcIds.has(l.npcId));assert(l.recognitionVocabularyIds.every(id=>vocabIds.has(id)));assert(l.recognitionVocabularyIds.length<=3);assert.equal(l.curriculumDay,index+15);assert(!ids.has(l.id));ids.add(l.id);
 assert(l.dialogue.length>=6&&l.dialogue.length<=12);
 assert(l.vocabularyIds.every(id=>vocabIds.has(id)));
 const day=days.find(d=>d.day===l.curriculumDay);assert.equal(day.lessonId,l.id);assert(day.npcIds.includes(l.npcId));
 assert.equal(l.dailyPractice.blocks.reduce((n,b)=>n+b.minutes,0),30);assert.equal(l.dailyPractice.durationMeasured,false);
 assert.equal(l.review.releaseReady,false);assert.equal(l.review.domainHumanReviewed,false);assert.equal(l.review.nativeLanguageReviewed,false);
 for(const file of ['foundation-lessons.json','week2-lessons.json'])assert(!read(file).lessons.flatMap(x=>x.dialogue.filter(t=>t.speaker==='player').map(t=>t.textJa)).some(text=>l.dialogue.some(t=>t.speaker==='player'&&t.textJa===text)));
 const rubric=rubrics.lessons.find(x=>x.lessonId===l.id);assert(rubric);
 assert.equal(rubric.turns.length,l.dialogue.filter(t=>t.speaker==='player').length);
 for(const [i,t] of l.dialogue.entries()){
  assert.equal(t.turn,i+1);assert.equal(t.speaker,i%2===0?'npc':'player');assert(t.textJa&&t.meaningVi);
  if(t.speaker==='player'){assert(!lines.has(t.textJa));lines.add(t.textJa);}
 }
 for(const q of l.questions){assert(!ids.has(q.id));ids.add(q.id);assert.equal(new Set(q.optionsJa).size,4);assert.equal(q.rationalesVi.length,4);assert(q.correctIndex>=0&&q.correctIndex<4);q.rationalesVi.forEach((r,i)=>assert(r.startsWith(i===q.correctIndex?'Đúng:':'Sai:')));}
 for(const x of rubric.turns){assert(!ids.has(x.id));ids.add(x.id);assert.equal(l.dialogue[x.playerTurn-1].speaker,'player');assert.equal(l.dialogue[x.promptTurn-1].speaker,'npc');assert.equal(x.acceptedExamplesJa[0],l.dialogue[x.playerTurn-1].textJa);assert.equal(new Set(x.acceptedExamplesJa).size,2);assert(x.criteriaVi&&x.missingFeedbackVi&&x.repairHintJa);if(x.nextNpcTurn!==null)assert.equal(l.dialogue[x.nextNpcTurn-1].speaker,'npc');}
 assert(l.reading.textJa&&l.reading.meaningVi);assert.equal(l.expressions.length,2);
 turns+=l.dialogue.length;checks+=l.questions.length;responses+=rubric.turns.length;expressions+=l.expressions.length;
}
assert.equal(turns,62);assert.equal(checks,27);assert.equal(responses,31);assert.equal(expressions,14);
assert.equal(manifest.playerTurnRubrics,responses);assert.equal(manifest.movementVocabularyRecords,24);assert.equal(manifest.releaseReady,false);assert.equal(rubrics.runtimeIntegrated,false);
const result={status:'PASS structural only',lessons:7,dialogueTurns:turns,readings:7,questions:checks,vocabularyDrafted:vocab.length,playerTurnRubrics:responses,expressions,daysCovered:[15,16,17,18,19,20,21],humanReviewed:false,runtimeIntegrated:false,durationMeasured:false,checks:['IDs and foreign keys','seven day links','alternating 6–12 turns','no duplicate player lines','options and rationale consistency','per-turn rubric coverage and variants','planned 30-minute blocks','truthful review flags'],limits:['Native reading and domain review pending','Rights/similarity review not certified','No executable semantic evaluator','No assets/runtime','Duration not measured']};
if(process.argv.includes('--write-report'))fs.writeFileSync(root+'week3-validation.json',JSON.stringify(result,null,2)+'\n');
console.log(`PASS week3 draft: ${lessons.length} lessons, ${turns} turns, ${responses} response rubrics, ${checks} checks. Human/runtime approval remains false.`);
