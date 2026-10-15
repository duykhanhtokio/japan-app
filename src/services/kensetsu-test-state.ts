/** State helpers intentionally have no storage or content side effects. */
export type TestDefinition={id:string;revision?:string;questions:readonly {id:string;correctIndex:number}[]};
export type TestAttempt={version:1;examId:string;contentRevision:string;questionIds:string[];answers:(number|null)[];currentQuestion:number;submitted:boolean};
export function testStorageKey(learner:string,level:string,field:string,examId:string){return `@japan_app_kensetsu_review:v2:${encodeURIComponent(learner)}:${encodeURIComponent(level)}:${encodeURIComponent(field)}:${encodeURIComponent(examId)}`;}
export function freshTestAttempt(exam:TestDefinition):TestAttempt{return {version:1,examId:exam.id,contentRevision:exam.revision??exam.id,questionIds:exam.questions.map(q=>q.id),answers:exam.questions.map(()=>null),currentQuestion:0,submitted:false};}
/** Null storage means no attempt. Any incompatible/malformed saved attempt returns null and must be shown to the learner, never overwritten silently. */
export function restoreTestAttempt(raw:string|null,exam:TestDefinition):TestAttempt|null{
 if(raw===null)return freshTestAttempt(exam);
 try{const x=JSON.parse(raw);const ids=exam.questions.map(q=>q.id);
 if(!x||x.version!==1||x.examId!==exam.id||x.contentRevision!==(exam.revision??exam.id)||!Array.isArray(x.questionIds)||x.questionIds.length!==ids.length||!x.questionIds.every((id:unknown,i:number)=>id===ids[i])||!Array.isArray(x.answers)||x.answers.length!==ids.length||!x.answers.every((a:unknown)=>a===null||(Number.isInteger(a)&&Number(a)>=0&&Number(a)<4))||!Number.isInteger(x.currentQuestion)||x.currentQuestion<0||x.currentQuestion>=ids.length||typeof x.submitted!=='boolean')return null;
 return {version:1,examId:exam.id,contentRevision:exam.revision??exam.id,questionIds:ids,answers:[...x.answers],currentQuestion:x.currentQuestion,submitted:x.submitted};
 }catch{return null;}
}
export function gradeTest(exam:TestDefinition,answers:readonly (number|null)[]){
 let correct=0,wrong=0,unanswered=0;
 exam.questions.forEach((q,i)=>{const a=answers[i];if(a===null||a===undefined)unanswered++;else if(a===q.correctIndex)correct++;else wrong++;});
 return {correct,wrong,unanswered,total:exam.questions.length};
}
