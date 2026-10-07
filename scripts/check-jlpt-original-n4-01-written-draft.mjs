import fs from 'node:fs';
import assert from 'node:assert/strict';
const m=JSON.parse(fs.readFileSync('docs/jlpt-workspace/original/n4-01/alternative-written-draft/master.ja.json','utf8'));
assert.equal(m.level,'N4'); assert.equal(m.questions.length,70);
assert.equal(m.authoringComplete,false); assert.equal(m.runtimeIntegrated,false); assert.equal(m.releaseReady,false);
assert.equal(m.audio.status,'not_generated'); assert.equal(m.audio.levelPacingConfirmed,false);
assert.equal(m.publisherReviewed,false); assert.equal(m.reviewedByNativeSpeaker,false);
const ids=new Set();
for(const [section,counts] of [['vocabulary',[9,6,10,5,5]],['grammar_reading',[15,5,5,4,4,2]]]){
 for(let g=1;g<=counts.length;g++){
  const qs=m.questions.filter(q=>q.section===section&&q.group===g);
  assert.equal(qs.length,counts[g-1],`${section}/${g}`);
  assert.deepEqual(qs.map(q=>q.number),Array.from({length:qs.length},(_,i)=>i+1));
 }
}
assert.equal(Object.keys(m.passages).length,8);
for(const q of m.questions){
 assert.ok(!ids.has(q.id)); ids.add(q.id);
 assert.ok(q.prompt&&q.learningObjective); assert.equal(q.options.length,4);
 assert.equal(new Set(q.options.map(o=>o.id)).size,4);
 assert.equal(new Set(q.options.map(o=>o.text)).size,4);
 assert.ok(q.options.some(o=>o.id===q.correctOptionId));
 for(const o of q.options) assert.ok(o.text&&o.rationale.startsWith(o.id===q.correctOptionId?'Đúng:':'Sai:'));
 if(q.passageId)assert.ok(m.passages[q.passageId]);
 if(q.section==='grammar_reading'&&q.group===2){
  assert.deepEqual([...q.solutionOrder].sort(),[1,2,3,4]);
  assert.equal(String(q.solutionOrder[q.starSlot-1]),q.correctOptionId);
  assert.equal(q.prefix+q.solutionOrder.map(i=>q.options[i-1].text).join('')+q.suffix,q.completedSentence);
 }
}
assert.equal(m.answerOrderStatus,'semantic_authoring_order_not_yet_shuffled');
console.log('PASS N4 01 written-draft schema/counts/rationales/order references. NOT a complete-exam, balance, audio or runtime approval.');
