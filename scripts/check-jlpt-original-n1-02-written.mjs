import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const path='src/data/jlpt-original/n1/02/master.ja.json';
const bytes=fs.readFileSync(path),m=JSON.parse(bytes);
const blueprint=JSON.parse(fs.readFileSync('src/data/jlpt-original/authoring-blueprints.json')).levels.n1;
assert.equal(m.examId,'jpapp-n1-original-02-v1');
assert.equal(m.questions.filter(q=>q.section!=='listening').length,70);
assert.equal(Object.keys(m.passages).length,12);
assert.equal(new Set(m.questions.filter(q=>q.section!=='listening').map(q=>q.id)).size,70);
for(const flag of ['publisherReviewed','reviewedByNativeSpeaker','releaseReady'])assert.equal(m[flag],false);

assert.deepEqual(m.sectionTimeMinutes,blueprint.sectionTimeMinutes);
for(const g of blueprint.groups.filter(g=>g.section==='written')){
 const qs=m.questions.filter(q=>q.section!=='listening'&&q.group===g.problem);
 assert.equal(qs.length,g.responses);
 assert.deepEqual(qs.map(q=>q.number),Array.from({length:g.responses},(_,i)=>i+1));
 for(const q of qs){
  assert.equal(q.section,g.problem<=4?'vocabulary':'grammar_reading');
  assert.ok(q.prompt&&q.learningObjective);
  assert.equal(q.options.length,4);
  assert.deepEqual(q.options.map(o=>o.id),['1','2','3','4']);
  assert.equal(new Set(q.options.map(o=>o.text)).size,4);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  q.options.forEach(o=>assert.ok(o.text&&o.rationale));
  if(q.passageId)assert.ok(m.passages[q.passageId]);
  if(q.ordering){
   const a=q.ordering;assert.equal(new Set(a.solutionOptionIds).size,4);
   assert.equal(a.solutionOptionIds[a.starSlot-1],q.correctOptionId);
   assert.equal(a.prefix+a.solutionOptionIds.map(id=>q.options.find(o=>o.id===id).text).join('')+a.suffix,a.completedSentence);
   assert.equal(q.prompt.split(' ').filter(t=>t==='★'||t==='＿＿').indexOf('★')+1,a.starSlot);
  }
 }
}
const seq=m.questions.filter(q=>q.section!=='listening').map(q=>q.correctOptionId),counts={};
for(const section of ['vocabulary','grammar_reading']){
 const qs=m.questions.filter(q=>q.section===section);
 counts[section]=[1,2,3,4].map(i=>qs.filter(q=>q.correctOptionId===String(i)).length);
 assert.ok(Math.max(...counts[section])-Math.min(...counts[section])<=1);
}
for(let i=0;i+2<seq.length;i++)assert.ok(!(seq[i]===seq[i+1]&&seq[i]===seq[i+2]));
for(const k of [2,3,4])for(let i=0;i+3*k<=seq.length;i++)assert.ok(!(seq.slice(i,i+k).join()===seq.slice(i+k,i+2*k).join()&&seq.slice(i,i+k).join()===seq.slice(i+2*k,i+3*k).join()));
const report={status:'PASS_written_structure',examId:m.examId,masterSha256:crypto.createHash('sha256').update(bytes).digest('hex'),written:70,targetTotal:106,remainingListening:36-m.questions.filter(q=>q.section==='listening').length,passages:12,orderingSolutions:5,answerBySection:counts,noWrittenTriples:true,noWrittenShortCycles:true,listeningNotAuthored:m.questions.filter(q=>q.section==='listening').length===0,runtimeIntegrated:m.runtimeIntegrated,authoringComplete:m.authoringComplete,publisherReviewed:false,reviewedByNativeSpeaker:false,releaseReady:false};
if(process.argv.includes('--write-report'))fs.writeFileSync('docs/jlpt-workspace/original/n1-02/written-validation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
