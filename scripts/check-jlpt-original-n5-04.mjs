import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=p=>readFileSync(new URL('../'+p,import.meta.url));
const hash=b=>createHash('sha256').update(b).digest('hex');
const bytes=read('src/data/jlpt-original/n5/04/master.ja.json');
const master=JSON.parse(bytes), blueprint=JSON.parse(read('src/data/jlpt-original/authoring-blueprints.json')).levels.n5;
const images=JSON.parse(read('src/data/jlpt-original/n5/04/images.manifest.json'));
const organization=JSON.parse(read('src/data/jlpt-original/n5/04/listening-organization.ja.json'));
const roles=JSON.parse(read('src/data/jlpt-original/voice-casting.json')).roles;
assert.equal(master.examId,'jpapp-n5-original-04-v1');
assert.equal(master.questions.length,91);assert.equal(new Set(master.questions.map(q=>q.id)).size,91);
assert.equal(master.releaseReady,false);assert.equal(master.publisherReviewed,false);assert.equal(master.reviewedByNativeSpeaker,false);
for(const group of blueprint.groups){
 const questions=master.questions.filter(q=>q.section===group.section&&q.group===group.problem);
 assert.equal(questions.length,group.responses);
 for(const [index,q] of questions.entries()){
  assert.equal(q.number,index+1);assert.ok(q.id.startsWith(master.examId+'-'));
  assert.equal(q.options.length,group.choiceCount);
  assert.equal(new Set(q.options.map(o=>o.text)).size,group.choiceCount);
  assert.deepEqual(q.options.map(o=>o.id),Array.from({length:group.choiceCount},(_,i)=>String(i+1)));
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.prompt.trim()&&q.learningObjective.trim());
  for(const o of q.options)assert.ok(o.text.trim()&&o.rationale.trim());
  if(q.passageId)assert.ok(master.passages[q.passageId]?.trim());
  if(q.solutionOrder){
   assert.deepEqual([...q.solutionOrder].sort(),[1,2,3,4]);
   assert.equal(String(q.solutionOrder[q.starSlot-1]),q.correctOptionId);
   assert.equal(q.completedSentence,q.prefix+q.solutionOrder.map(i=>q.options[i-1].text).join('')+q.suffix);
  }
  if(q.section==='listening'){
   assert.ok(q.script.length);for(const [actor,text] of q.script)assert.ok((actor==='narrator'||roles[actor])&&text.trim());
   if(q.group>=3)assert.equal(q.spokenOptions,true);
   if(q.group===3)assert.ok(images.items.some(i=>i.questionId===q.id&&i.path===q.illustrationPath));
  }
 }
}
const seq=master.questions.map(q=>q.correctOptionId);
for(let i=2;i<seq.length;i++)assert.ok(!(seq[i]===seq[i-1]&&seq[i]===seq[i-2]),'triple repeat');
for(let p=2;p<=4;p++)for(let i=0;i+p*3<=seq.length;i++)assert.notEqual(seq.slice(i,i+p*3).join(''),seq.slice(i,i+p).join('').repeat(3),'repeated cycle');
const pools={};for(const cardinality of [3,4]){
 pools[cardinality]=Array.from({length:cardinality},(_,i)=>master.questions.filter(q=>q.options.length===cardinality&&q.correctOptionId===String(i+1)).length);
 assert.ok(Math.max(...pools[cardinality])-Math.min(...pools[cardinality])<=1);
}
assert.deepEqual(pools[3],[4,4,3]);assert.deepEqual(pools[4],[20,20,20,20]);
assert.equal(images.items.length,5);for(const item of images.items)assert.equal(hash(read(item.path)),item.sha256);
assert.equal(organization.examId,master.examId);assert.equal(organization.groups.length,4);
for(const group of organization.groups){assert.equal(group.example.scored,false);assert.ok(group.example.id.startsWith('jpapp-n5-original-04-practice-'));}
console.log(JSON.stringify({status:'PASS',scope:'Original N5 04 content structure, keys, ordering, answer distribution, voice-role compatibility and five image hashes; not audio/runtime/native approval',masterSha256:hash(bytes),questions:91,pools}));
