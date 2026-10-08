import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const base='src/data/jlpt-original/n3/06/';
const bytes=fs.readFileSync(base+'master.ja.json');const m=JSON.parse(bytes);
const blueprint=JSON.parse(fs.readFileSync('src/data/jlpt-original/authoring-blueprints.json')).levels.n3;
const casting=JSON.parse(fs.readFileSync('src/data/jlpt-original/voice-casting.json'));
const org=JSON.parse(fs.readFileSync(base+'listening-organization.ja.json'));
assert.equal(m.questions.length,102);assert.equal(m.level,'N3');
assert.equal(new Set(m.questions.map(q=>q.id)).size,102);
assert.deepEqual(m.sectionTimeMinutes,blueprint.sectionTimeMinutes);
assert.deepEqual(casting.levelPacing.n3,blueprint.listeningPacing);
assert.equal(m.publisherReviewed,false);assert.equal(m.reviewedByNativeSpeaker,false);assert.equal(m.releaseReady,false);
for(const g of blueprint.groups){
 const section=g.section==='written'?(g.problem<=5?'vocabulary':'grammar_reading'):'listening';
 const qs=m.questions.filter(q=>q.section===section&&q.group===g.problem);assert.equal(qs.length,g.responses);
 assert.deepEqual(qs.map(q=>q.number),Array.from({length:g.responses},(_,i)=>i+1));
 qs.forEach(q=>{
  assert.ok(q.prompt&&q.learningObjective);assert.equal(q.options.length,g.choiceCount);
  assert.deepEqual(q.options.map(o=>o.id),Array.from({length:g.choiceCount},(_,i)=>String(i+1)));
  assert.equal(new Set(q.options.map(o=>o.text)).size,g.choiceCount);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));q.options.forEach(o=>assert.ok(o.text&&o.rationale));
  if(q.passageId)assert.ok(m.passages[q.passageId]);
  if(q.ordering){const a=q.ordering;assert.equal(new Set(a.solutionOptionIds).size,4);assert.equal(a.solutionOptionIds[a.starSlot-1],q.correctOptionId);assert.equal(a.prefix+a.solutionOptionIds.map(id=>q.options.find(o=>o.id===id).text).join('')+a.suffix,a.completedSentence);}
  if(section==='listening'){
   assert.ok(q.script.length>0);q.script.forEach(([role,text])=>assert.ok(casting.roles[role]&&text));
   assert.deepEqual(q.listening.turns,q.script.map(([role,text])=>({role,text})));
   if(q.group<=2)assert.equal(q.script[0][1],q.prompt);
   if(q.group===3)assert.notEqual(q.script[0][1],q.prompt,'No advance gist question');
   if(q.group===4)assert.ok(q.visualBrief);
   if(q.group===5)assert.equal(q.script.length,1);
  }
 });
}
assert.equal(Object.keys(m.passages).length,10);
assert.equal(org.groups.length,5);assert.equal(new Set(org.groups.map(g=>g.example.id)).size,5);
org.groups.forEach(g=>{assert.equal(g.example.scored,false);assert.equal(g.example.options.length,g.problem<=3?4:3);assert.ok(g.example.options.some(o=>o.id===g.example.correctOptionId));assert.equal(g.choicesDisplay,g.problem<=2?'printed':'audio_only');assert.equal(g.readQuestionAfterDialogue,g.problem<=3);assert.equal(g.readChoices,g.problem>=3);assert.equal(g.replayWholeDialogue,false);});
const illustrations=JSON.parse(fs.readFileSync(base+'images.manifest.json'));
assert.equal(illustrations.items.length,4);
for(const item of illustrations.items){assert.ok(m.questions.some(q=>q.id===item.questionId&&q.section==='listening'&&q.group===4));assert.equal(crypto.createHash('sha256').update(fs.readFileSync(item.path)).digest('hex'),item.sha256);assert.equal(item.publisherReviewed,false);}
const pools={},sections={};
for(const k of [3,4]){
 const qs=m.questions.filter(q=>q.options.length===k);const counts=Array.from({length:k},(_,i)=>qs.filter(q=>q.correctOptionId===String(i+1)).length);assert.ok(Math.max(...counts)-Math.min(...counts)<=1);pools[k]=counts;
 for(const section of ['vocabulary','grammar_reading','listening']){const part=qs.filter(q=>q.section===section);if(!part.length)continue;const c=Array.from({length:k},(_,i)=>part.filter(q=>q.correctOptionId===String(i+1)).length);assert.ok(Math.max(...c)-Math.min(...c)<=1);sections[section+'_'+k]=c;}
}
const keys=m.questions.map(q=>q.correctOptionId);
for(let i=0;i<keys.length-2;i++)assert.ok(!(keys[i]===keys[i+1]&&keys[i]===keys[i+2]),'Three equal positions');
for(const p of [2,3,4])for(let i=0;i+3*p<=keys.length;i++)assert.ok(!(keys.slice(i,i+p).join()===keys.slice(i+p,i+2*p).join()&&keys.slice(i,i+p).join()===keys.slice(i+2*p,i+3*p).join()),'Repeated short cycle');
const independentPatterns=[];
for(const level of ['n5','n4','n3'])for(let n=1;n<=6;n++){
 const p=`src/data/jlpt-original/${level}/${String(n).padStart(2,'0')}/master.ja.json`;
 if(!fs.existsSync(p)||p===base+'master.ja.json')continue;
 const previous=JSON.parse(fs.readFileSync(p)).questions.map(q=>q.correctOptionId).join('');
 assert.notEqual(keys.join(''),previous,'Independent answer sequence must differ');independentPatterns.push(`${level}-${n}`);
}
const report={status:'PASS_content_structure_only',examId:m.examId,masterSha256:crypto.createHash('sha256').update(bytes).digest('hex'),written:74,listeningScripts:28,passages:10,unscoredExamples:5,requiredImages:4,answerPools:pools,answerBySection:sections,noTriples:true,noRepeatedShortCycles:true,distinctFromIndependentPatterns:independentPatterns,ordering:'Stored solution and star alignment checked; uniqueness subject to AI editorial and later human review.',audioMeasured:!!m.audio.actualDurationVerified,runtimeIntegrated:m.runtimeIntegrated,publisherReviewed:false,reviewedByNativeSpeaker:false,releaseReady:false};
if(process.argv.includes('--write-report'))fs.writeFileSync('docs/jlpt-workspace/original/n3-06/content-validation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
