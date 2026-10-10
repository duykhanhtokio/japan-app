import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const base='src/data/jlpt-original/n1/04/';
const bytes=fs.readFileSync(base+'master.ja.json'),m=JSON.parse(bytes);
const blueprint=JSON.parse(fs.readFileSync('src/data/jlpt-original/authoring-blueprints.json')).levels.n1;
const casting=JSON.parse(fs.readFileSync('src/data/jlpt-original/voice-casting.json'));
const org=JSON.parse(fs.readFileSync(base+'listening-organization.ja.json'));
assert.equal(m.questions.length,106);assert.equal(m.level,'N1');
assert.equal(new Set(m.questions.map(q=>q.id)).size,106);
assert.deepEqual(m.sectionTimeMinutes,blueprint.sectionTimeMinutes);
assert.deepEqual(casting.levelPacing.n1,blueprint.listeningPacing);
for(const flag of ['publisherReviewed','reviewedByNativeSpeaker','releaseReady'])assert.equal(m[flag],false);
for(const g of blueprint.groups){
 const section=g.section==='written'?(g.problem<=4?'vocabulary':'grammar_reading'):'listening';
 const qs=m.questions.filter(q=>q.section===section&&q.group===g.problem);assert.equal(qs.length,g.responses);
 assert.deepEqual(qs.map(q=>q.number),Array.from({length:g.responses},(_,i)=>i+1));
 for(const q of qs){
  assert.ok(q.prompt&&q.learningObjective);assert.equal(q.options.length,g.choiceCount);
  assert.deepEqual(q.options.map(o=>o.id),Array.from({length:g.choiceCount},(_,i)=>String(i+1)));
  assert.equal(new Set(q.options.map(o=>o.text)).size,g.choiceCount);
  assert.ok(q.options.some(o=>o.id===q.correctOptionId));q.options.forEach(o=>assert.ok(o.text&&o.rationale));
  if(q.passageId)assert.ok(m.passages[q.passageId]);
  if(q.ordering){const a=q.ordering;assert.equal(new Set(a.solutionOptionIds).size,4);assert.equal(a.solutionOptionIds[a.starSlot-1],q.correctOptionId);assert.equal(a.prefix+a.solutionOptionIds.map(id=>q.options.find(o=>o.id===id).text).join('')+a.suffix,a.completedSentence);}
  if(section==='listening'){
   assert.ok(q.script.length>0);q.script.forEach(([role,text])=>assert.ok(casting.roles[role]&&text));
   assert.deepEqual(q.listening.turns,q.script.map(([role,text])=>({role,text})));
   if(q.group<=2)assert.ok(q.script[0][1].endsWith(q.prompt));
   if(q.group===3||q.group===5)assert.notEqual(q.script[0][1],q.prompt,'No advance question');
   if(q.group===4)assert.equal(q.script.length,1);
  }
 }
}
assert.equal(Object.keys(m.passages).length,12);
assert.equal(org.groups.length,5);assert.equal(new Set(org.groups.map(g=>g.example.id)).size,5);
for(const g of org.groups){assert.equal(g.example.scored,false);assert.equal(g.example.options.length,g.problem===4?3:4);assert.ok(g.example.options.some(o=>o.id===g.example.correctOptionId));assert.equal(g.choicesDisplay,[3,4].includes(g.problem)?'audio_only':'printed');assert.equal(g.readQuestionAfterDialogue,g.problem!==4);assert.equal(g.readChoices,[3,4].includes(g.problem));assert.equal(g.replayWholeDialogue,false);}
const shared=m.questions.filter(q=>q.section==='listening'&&q.sharedDialogueId==='jpapp-n1-original-04-v1-integrated-stargazing');assert.equal(shared.length,2);assert.deepEqual(shared[0].script,shared[1].script);assert.notEqual(shared[0].id,shared[1].id);assert.notEqual(shared[0].prompt,shared[1].prompt);
const pools={},sections={};
for(const k of [3,4]){
 const qs=m.questions.filter(q=>q.options.length===k),counts=Array.from({length:k},(_,i)=>qs.filter(q=>q.correctOptionId===String(i+1)).length);assert.ok(Math.max(...counts)-Math.min(...counts)<=1);pools[k]=counts;
 for(const section of ['vocabulary','grammar_reading','listening']){const part=qs.filter(q=>q.section===section);if(!part.length)continue;const c=Array.from({length:k},(_,i)=>part.filter(q=>q.correctOptionId===String(i+1)).length);assert.ok(Math.max(...c)-Math.min(...c)<=1);sections[section+'_'+k]=c;}
}
const keys=m.questions.map(q=>q.correctOptionId);
for(let i=0;i<keys.length-2;i++)assert.ok(!(keys[i]===keys[i+1]&&keys[i]===keys[i+2]),'Three equal positions');
for(const p of [2,3,4])for(let i=0;i+3*p<=keys.length;i++)assert.ok(!(keys.slice(i,i+p).join()===keys.slice(i+p,i+2*p).join()&&keys.slice(i,i+p).join()===keys.slice(i+2*p,i+3*p).join()),'Repeated short cycle');
let patterns=0;
for(const level of ['n5','n4','n3','n2'])for(let n=1;n<=6;n++){const p=`src/data/jlpt-original/${level}/${String(n).padStart(2,'0')}/master.ja.json`;const previous=JSON.parse(fs.readFileSync(p)).questions.map(q=>q.correctOptionId).join('');assert.notEqual(keys.join(''),previous);patterns++;}
const priorN1=JSON.parse(fs.readFileSync('src/data/jlpt-original/n1/01/master.ja.json')).questions.map(q=>q.correctOptionId).join('');assert.notEqual(keys.join(''),priorN1);patterns++;
const priorN102=JSON.parse(fs.readFileSync('src/data/jlpt-original/n1/02/master.ja.json')).questions.map(q=>q.correctOptionId).join('');assert.notEqual(keys.join(''),priorN102);patterns++;
const priorN103=JSON.parse(fs.readFileSync('src/data/jlpt-original/n1/03/master.ja.json')).questions.map(q=>q.correctOptionId).join('');assert.notEqual(keys.join(''),priorN103);patterns++;
const report={status:'PASS_content_structure',examId:m.examId,masterSha256:crypto.createHash('sha256').update(bytes).digest('hex'),written:70,listeningResponses:36,independentDialogueRecordings:35,sharedDialogueScoredUnits:2,passages:12,unscoredExamples:5,requiredImages:0,answerPools:pools,answerBySection:sections,noTriples:true,noRepeatedShortCycles:true,distinctFromPriorPatterns:patterns,ordering:'Stored solution and star alignment checked; individual AI editorial review recorded separately, not native certification.',runtimeIntegrated:m.runtimeIntegrated,publisherReviewed:false,reviewedByNativeSpeaker:false,releaseReady:false};
if(process.argv.includes('--write-report'))fs.writeFileSync('docs/jlpt-workspace/original/n1-04/content-validation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));

