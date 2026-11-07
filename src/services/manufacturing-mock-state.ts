import type {ManufacturingQuestion,Specialty} from '@/data/manufacturing';

export const MOCK_SECTION_IDS=['theory','practical'] as const;
export type MockSectionId=typeof MOCK_SECTION_IDS[number];
export type ManufacturingMockSection={id:string;durationMs:number;passMinimumCorrect:number;questions:ManufacturingQuestion[]};
export type ManufacturingMock={id:string;specialty:Specialty;titleJa:string;kind:'mock';officialSimulation:true;revision:string;sections:Record<MockSectionId,ManufacturingMockSection>};
export type MockSectionAttempt={questionIds:string[];answers:(number|null)[];currentQuestion:number;startedAt:number|null;deadlineAt:number|null;lastObservedAt:number|null;submittedAt:number|null;submission:'manual'|'expired'|null};
export type ManufacturingMockAttempt={version:1;examId:string;revision:string;sections:Record<MockSectionId,MockSectionAttempt>};
export const manufacturingMockKey=(learner:string,specialty:Specialty,examId:string)=>`@japan_app_manufacturing:mock:v1:${encodeURIComponent(learner)}:1:${specialty}:${encodeURIComponent(examId)}`;
const validTime=(n:unknown):n is number=>Number.isSafeInteger(n)&&Number(n)>=0;
function freshSection(section:ManufacturingMockSection):MockSectionAttempt{return {questionIds:section.questions.map(q=>q.id),answers:section.questions.map(()=>null),currentQuestion:0,startedAt:null,deadlineAt:null,lastObservedAt:null,submittedAt:null,submission:null};}
export function freshManufacturingMock(exam:ManufacturingMock):ManufacturingMockAttempt{return {version:1,examId:exam.id,revision:exam.revision,sections:{theory:freshSection(exam.sections.theory),practical:freshSection(exam.sections.practical)}};}
export function restoreManufacturingMock(raw:string|null,exam:ManufacturingMock):ManufacturingMockAttempt|null{
 if(raw===null)return freshManufacturingMock(exam);
 try{
  const x=JSON.parse(raw);if(!x||x.version!==1||x.examId!==exam.id||x.revision!==exam.revision||!x.sections)return null;
  for(const id of MOCK_SECTION_IDS){const s=x.sections[id],definition=exam.sections[id];
   if(!s||!Array.isArray(s.questionIds)||s.questionIds.length!==definition.questions.length||!s.questionIds.every((q:unknown,i:number)=>q===definition.questions[i].id)||!Array.isArray(s.answers)||s.answers.length!==definition.questions.length||!s.answers.every((a:unknown,i:number)=>a===null||(Number.isInteger(a)&&Number(a)>=0&&Number(a)<definition.questions[i].optionsJa.length))||!Number.isInteger(s.currentQuestion)||s.currentQuestion<0||s.currentQuestion>=definition.questions.length)return null;
   if(s.startedAt===null){if(s.deadlineAt!==null||s.lastObservedAt!==null||s.submittedAt!==null||s.submission!==null||s.answers.some((a:unknown)=>a!==null)||s.currentQuestion!==0)return null;}
   else{if(!validTime(s.startedAt)||!validTime(s.deadlineAt)||s.deadlineAt!==s.startedAt+definition.durationMs||!validTime(s.lastObservedAt)||s.lastObservedAt<s.startedAt)return null;
    if(s.submittedAt===null){if(s.submission!==null||s.lastObservedAt>=s.deadlineAt)return null;}
    else if(!validTime(s.submittedAt)||s.submittedAt<s.startedAt||!['manual','expired'].includes(s.submission)||(s.submission==='expired'&&s.submittedAt!==s.deadlineAt)||(s.submission==='manual'&&s.submittedAt>=s.deadlineAt)||s.lastObservedAt<s.submittedAt)return null;
   }
  }
  if(x.sections.practical.startedAt!==null&&(x.sections.theory.submittedAt===null||x.sections.practical.startedAt<x.sections.theory.submittedAt))return null;
  return {version:1,examId:exam.id,revision:exam.revision,sections:{theory:{...x.sections.theory,questionIds:[...x.sections.theory.questionIds],answers:[...x.sections.theory.answers]},practical:{...x.sections.practical,questionIds:[...x.sections.practical.questionIds],answers:[...x.sections.practical.answers]}}};
 }catch{return null;}
}
export function mockRemainingMs(section:MockSectionAttempt,definition:ManufacturingMockSection,now:number):number{
 if(section.startedAt===null)return definition.durationMs;if(section.submittedAt!==null)return 0;
 return Math.max(0,Math.min(definition.durationMs,section.deadlineAt!-Math.max(now,section.lastObservedAt??now)));
}
export function normalizeManufacturingMock(attempt:ManufacturingMockAttempt,exam:ManufacturingMock,now:number):ManufacturingMockAttempt{
 let next=attempt;for(const id of MOCK_SECTION_IDS){const s=next.sections[id];if(s.startedAt!==null&&s.submittedAt===null&&mockRemainingMs(s,exam.sections[id],now)===0){next={...next,sections:{...next.sections,[id]:{...s,submittedAt:s.deadlineAt,submission:'expired',lastObservedAt:Math.max(now,s.deadlineAt!,s.lastObservedAt??0)}}};}}return next;
}
export function startManufacturingMockSection(attempt:ManufacturingMockAttempt,exam:ManufacturingMock,id:MockSectionId,now:number):ManufacturingMockAttempt{
 const next=normalizeManufacturingMock(attempt,exam,now),s=next.sections[id];if(!validTime(now)||s.startedAt!==null||(id==='practical'&&next.sections.theory.submittedAt===null))return next;
 const startedAt=Math.max(now,id==='practical'?next.sections.theory.submittedAt!:now);return {...next,sections:{...next.sections,[id]:{...s,startedAt,deadlineAt:startedAt+exam.sections[id].durationMs,lastObservedAt:startedAt}}};
}
export function answerManufacturingMock(attempt:ManufacturingMockAttempt,exam:ManufacturingMock,id:MockSectionId,index:number,answer:number,now:number):ManufacturingMockAttempt{
 const next=normalizeManufacturingMock(attempt,exam,now),s=next.sections[id];if(s.startedAt===null||s.submittedAt!==null||!Number.isInteger(index)||!exam.sections[id].questions[index]||!Number.isInteger(answer)||answer<0||answer>=exam.sections[id].questions[index].optionsJa.length)return next;
 const answers=[...s.answers];answers[index]=answer;return {...next,sections:{...next.sections,[id]:{...s,answers,lastObservedAt:Math.max(now,s.lastObservedAt!)}}};
}
export function navigateManufacturingMock(attempt:ManufacturingMockAttempt,exam:ManufacturingMock,id:MockSectionId,index:number,now:number):ManufacturingMockAttempt{
 const next=normalizeManufacturingMock(attempt,exam,now),s=next.sections[id];if(s.startedAt===null||!Number.isInteger(index)||index<0||index>=s.answers.length)return next;
 return {...next,sections:{...next.sections,[id]:{...s,currentQuestion:index,lastObservedAt:Math.max(now,s.lastObservedAt!)}}};
}
export function submitManufacturingMockSection(attempt:ManufacturingMockAttempt,exam:ManufacturingMock,id:MockSectionId,now:number):ManufacturingMockAttempt{
 const next=normalizeManufacturingMock(attempt,exam,now),s=next.sections[id];if(s.startedAt===null||s.submittedAt!==null)return next;
 const submittedAt=Math.max(now,s.lastObservedAt!);return {...next,sections:{...next.sections,[id]:{...s,submittedAt,submission:'manual',lastObservedAt:submittedAt}}};
}
export const manufacturingMockComplete=(attempt:ManufacturingMockAttempt)=>MOCK_SECTION_IDS.every(id=>attempt.sections[id].submittedAt!==null);
export function gradeManufacturingMock(attempt:ManufacturingMockAttempt,exam:ManufacturingMock){
 if(!manufacturingMockComplete(attempt))return null;
 const result=Object.fromEntries(MOCK_SECTION_IDS.map(id=>{const s=attempt.sections[id],d=exam.sections[id];let correct=0,unanswered=0;d.questions.forEach((q,i)=>{if(s.answers[i]===null)unanswered++;else if(s.answers[i]===q.correctIndex)correct++;});return [id,{correct,total:d.questions.length,unanswered,passed:correct>=d.passMinimumCorrect}];})) as Record<MockSectionId,{correct:number;total:number;unanswered:number;passed:boolean}>;
 return {...result,passed:result.theory.passed&&result.practical.passed};
}
