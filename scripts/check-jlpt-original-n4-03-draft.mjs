import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const path='src/data/jlpt-original/n4/03/master.ja.json';
const bytes=fs.readFileSync(path),m=JSON.parse(bytes);
const blueprint=JSON.parse(fs.readFileSync('src/data/jlpt-original/authoring-blueprints.json')).levels.n4;
assert.equal(m.questions.length,98);
const complete=process.argv.includes('--complete');
assert.equal(m.runtimeIntegrated,complete);
assert.equal(m.authoringComplete,complete);
for(const field of ['publisherReviewed','reviewedByNativeSpeaker','releaseReady'])assert.equal(m[field],false);
assert.equal(new Set(m.questions.map(q=>q.id)).size,98);
for(const g of blueprint.groups){
 const section=g.section.replace('grammar-reading','grammar_reading');
 const qs=m.questions.filter(q=>q.section===section&&q.group===g.problem);
 assert.equal(qs.length,g.responses,`${section}/${g.problem}`);
 qs.forEach((q,i)=>{
  assert.equal(q.number,i+1);assert.equal(q.options.length,g.choiceCount);
  assert.equal(new Set(q.options.map(o=>o.text)).size,g.choiceCount);
  assert.deepEqual(q.options.map(o=>o.id),Array.from({length:g.choiceCount},(_,j)=>String(j+1)));
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));
  assert.ok(q.learningObjective&&q.prompt);
  q.options.forEach(o=>assert.ok(o.rationale));
  if(q.passageId)assert.ok(m.passages[q.passageId]);
  if(q.ordering){
   const a=q.ordering;assert.equal(new Set(a.solutionOptionIds).size,4);
   assert.equal(a.solutionOptionIds[a.starSlot-1],q.correctOptionId);
   const sentence=a.prefix+a.solutionOptionIds.map(id=>q.options.find(o=>o.id===id).text).join('')+a.suffix;
   assert.equal(sentence,a.completedSentence);
  }
  if(section==='listening'){
   assert.ok(q.listening&&Array.isArray(q.listening.turns));
   const roles=['femaleStudent','adultFemale','youngMale','adultMale'];
   q.listening.turns.forEach(t=>assert.ok(roles.includes(t.role)&&t.text));
   if(g.problem===3)assert.ok(q.visualBrief&&['not_generated','generated_ai_unreviewed'].includes(q.illustrationStatus));
  }
 });
}
const pools={};
for(const n of [3,4]){
 const qs=m.questions.filter(q=>q.options.length===n);
 const counts=Array.from({length:n},(_,i)=>qs.filter(q=>q.correctOptionId===String(i+1)).length);
 assert.ok(Math.max(...counts)-Math.min(...counts)<=1);
 pools[n]=counts;
 for(const section of ['vocabulary','grammar_reading','listening']){
  const part=qs.filter(q=>q.section===section);if(!part.length)continue;
  const c=Array.from({length:n},(_,i)=>part.filter(q=>q.correctOptionId===String(i+1)).length);
  assert.ok(Math.max(...c)-Math.min(...c)<=1);
 }
}
const keys=m.questions.map(q=>Number(q.correctOptionId));
for(let i=0;i<keys.length-2;i++)assert.ok(!(keys[i]===keys[i+1]&&keys[i]===keys[i+2]),`triple ${i}`);
for(const period of [2,3,4])for(let i=0;i<=keys.length-3*period;i++){
 const a=keys.slice(i,i+period).join(',');
 assert.ok(!(a===keys.slice(i+period,i+2*period).join(',')&&a===keys.slice(i+2*period,i+3*period).join(',')),`cycle ${i}/${period}`);
}
assert.equal(m.audio.actualDurationVerified,complete);assert.equal(m.audio.pacingStatus,'publisher_approved_n4');
const images=JSON.parse(fs.readFileSync('src/data/jlpt-original/n4/03/images.manifest.json'));assert.equal(images.items.length,5);
for(const image of images.items)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(image.path)).digest('hex'),image.sha256);
const report={status:complete?'PASS_integrated_content_structure':'PASS_draft_structure_only',examId:m.examId,masterSha256:crypto.createHash('sha256').update(bytes).digest('hex'),writtenResponses:70,listeningScriptResponses:28,passages:Object.keys(m.passages).length,answerPositionPools:pools,ordering:'Stored solution reconstruction and star alignment checked; grammatical uniqueness needs editorial review, not certified by this validator.',audioGenerated:complete,illustrationsGenerated:true,runtimeIntegrated:complete,publisherReviewed:false,reviewedByNativeSpeaker:false,releaseReady:false};
if(process.argv.includes('--write-report'))fs.writeFileSync('docs/jlpt-workspace/original/n4-03/draft-validation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
