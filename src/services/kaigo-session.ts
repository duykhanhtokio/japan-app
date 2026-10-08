import type {MockForm,MockQuestion,Question} from '../data/kaigo/types';
export type Answers = Record<string,number>;
export type ExamSession = {schema:1;formId:string;formVersion:number;contentRevision:string;currentQuestion:number;answers:Answers;remainingMs:number;status:'active'|'submitted';submittedAt:number|null};
export function examStorageKey(form:MockForm){return `@japan_app_kaigo_exam:${form.id}:${form.version}:${form.contentRevision}`;}
export function createExamSession(form:MockForm):ExamSession{return {schema:1,formId:form.id,formVersion:form.version,contentRevision:form.contentRevision,currentQuestion:0,answers:{},remainingMs:form.durationMs,status:'active',submittedAt:null};}
export function restoreExamSession(raw:string|null,form:MockForm):ExamSession{
 if(!raw)return createExamSession(form);
 try{const s:ExamSession=JSON.parse(raw);if(s.schema!==1||s.formId!==form.id||s.formVersion!==form.version||s.contentRevision!==form.contentRevision||!Number.isInteger(s.currentQuestion)||s.currentQuestion<0||s.currentQuestion>=form.questions.length||!Number.isFinite(s.remainingMs)||s.remainingMs<0||s.remainingMs>form.durationMs||!['active','submitted'].includes(s.status)||!s.answers||typeof s.answers!=='object'||Array.isArray(s.answers))return createExamSession(form);
  for(const[id,a]of Object.entries(s.answers)){const q=form.questions.find(q=>q.id===id);if(!q||!Number.isInteger(a)||a<0||a>=q.optionsJa.length)return createExamSession(form);}
  if(s.status==='submitted'&&(!Number.isFinite(s.submittedAt)||s.submittedAt===null))return createExamSession(form);
  return s.status==='active'&&s.remainingMs===0?submitExam(s):s;
 }catch{return createExamSession(form);}
}
export function answerExam(s:ExamSession,q:Question,answer:number):ExamSession{if(s.status!=='active'||!Number.isInteger(answer)||answer<0||answer>=q.optionsJa.length)return s;return {...s,answers:{...s.answers,[q.id]:answer}};}
export function submitExam(s:ExamSession,now=Date.now()):ExamSession{return s.status==='submitted'?s:{...s,status:'submitted',submittedAt:now};}
export function tickExam(s:ExamSession,elapsedMs:number,now=Date.now()):ExamSession{if(s.status!=='active'||!Number.isFinite(elapsedMs)||elapsedMs<=0)return s;const next={...s,remainingMs:Math.max(0,s.remainingMs-elapsedMs)};return next.remainingMs===0?submitExam(next,now):next;}
export function scoreQuestions(questions:Question[],answers:Answers){return questions.reduce((n,q)=>n+(answers[q.id]===q.correctIndex?1:0),0);}
export function publicQuestion(q:MockQuestion){return {id:q.id,promptJa:q.promptJa,optionsJa:q.optionsJa,passageJa:q.passageJa,figureKey:q.figureKey,figureDescriptionJa:q.figureDescriptionJa,furigana:q.furigana};}
export function examReview(s:ExamSession,form:MockForm){if(s.status!=='submitted')return null;return {score:scoreQuestions(form.questions,s.answers),total:form.questions.length,questions:form.questions};}
export function canRevealPractice(attempt:string){return attempt.trim().length>0;}
export function canAdvancePractice(attempt:string,revealed:boolean,checked:boolean[],requiredCount:number){return canRevealPractice(attempt)&&revealed&&requiredCount>0&&checked.length===requiredCount&&checked.every(Boolean);}
