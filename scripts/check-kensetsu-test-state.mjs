import fs from 'node:fs';
import assert from 'node:assert/strict';
import {freshTestAttempt,restoreTestAttempt,gradeTest,testStorageKey} from '../src/services/kensetsu-test-state.ts';
const bank=JSON.parse(fs.readFileSync('src/data/kensetsu/review-tests.ja.json','utf8'));
let cases=0;
for(const exam of bank.exams){
 const fresh=freshTestAttempt(exam);assert.equal(fresh.answers.length,40);assert(fresh.answers.every(x=>x===null));assert.equal(fresh.currentQuestion,0);
 const correct=exam.questions.map(q=>q.correctIndex);
 assert.deepEqual(gradeTest(exam,correct),{correct:40,wrong:0,unanswered:0,total:40});
 assert.deepEqual(gradeTest(exam,correct.map(n=>(n+1)%4)),{correct:0,wrong:40,unanswered:0,total:40});
 assert.deepEqual(gradeTest(exam,fresh.answers),{correct:0,wrong:0,unanswered:40,total:40});
 const mixed=correct.map((n,i)=>i<10?n:i<20?(n+1)%4:null);
 assert.deepEqual(gradeTest(exam,mixed),{correct:10,wrong:10,unanswered:20,total:40});
 const saved={...fresh,answers:mixed,currentQuestion:39,submitted:true};
 assert.deepEqual(restoreTestAttempt(JSON.stringify(saved),exam),saved);
 assert.deepEqual(restoreTestAttempt(null,exam),fresh);
 for(const raw of ['', '{', 'null', '[]','{}', JSON.stringify({...saved,version:2}),JSON.stringify({...saved,examId:'other'}),JSON.stringify({...saved,contentRevision:'old'}),JSON.stringify({...saved,questionIds:[...saved.questionIds].reverse()}),JSON.stringify({...saved,answers:[-1,...mixed.slice(1)]}),JSON.stringify({...saved,answers:[4,...mixed.slice(1)]}),JSON.stringify({...saved,answers:['1',...mixed.slice(1)]}),JSON.stringify({...saved,answers:mixed.slice(1)}),JSON.stringify({...saved,currentQuestion:-1}),JSON.stringify({...saved,currentQuestion:40}),JSON.stringify({...saved,currentQuestion:1.5}),JSON.stringify({...saved,submitted:'true'})]){
  assert.equal(restoreTestAttempt(raw,exam),null);cases++;
 }
}
const keys=[];
for(const l of ['learner-a','learner-b','a:b','a%3Ab'])for(const level of ['1','2'])for(const field of ['building','civil','lifeline'])for(const exam of bank.exams)keys.push(testStorageKey(l,level,field,exam.id));
assert.equal(new Set(keys).size,keys.length);
assert(!keys.some(k=>k.startsWith('@japan_app_kensetsu_test:')));
const report={status:'PASS_STATE_GRADING_AND_INVALID_RESTORE_CASES',exams:10,correctWrongBlankMixedGrading:true,resumeLastQuestionAndSubmitted:true,invalidRestoreCases:cases,uniqueScopedKeys:keys.length,studyProgressKeySeparated:true};
fs.writeFileSync('docs/ssw-workspace/kensetsu/exams/ten-by-forty/state-qa.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
