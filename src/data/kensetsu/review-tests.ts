import differentialBank from './differential-review-tests.ja.json';
import { sessionById, type Field, type Level } from './index';
import { isSessionInScope, type Subject } from './scope';
import bank from './review-tests.ja.json';
export type ReviewSourceReference={
 sessionId:string;clusterId:string;paragraphIds:string[];
 lessonFile:string;lessonSha256:string;weekId:string;sessionRevision:string|number;contentRevision:string|number;
};
export type ReviewQuestion={
 id:string;number:number;points:number;promptJa:string;choicesJa:string[];correctIndex:number;explanationJa:string;
 objectiveKey:string;claimJa:string;sourceReferences:ReviewSourceReference[];distractorRationalesJa:string[];
};
export type ReviewTest={
 id:string;revision:string;titleJa:string;language:string;questionCount:number;maxPoints:number;
 timeLimitSeconds:null;passThreshold:null;isOfficialExam:boolean;sessionRange:number[];questions:ReviewQuestion[];
};
export const bankRevision=bank.revision;
export const reviewTests:ReviewTest[]=bank.exams;

/** Keep the original bank/attempts intact; derive subject views from every cited lesson. */
export function reviewTestsForScope(level: Level, field: Field, subject: Subject): ReviewTest[] {
 if (level !== '1') return [];
 const questionsInScope = (question: ReviewQuestion) => {
  if (!question.sourceReferences.length) return false;
  const lessons = question.sourceReferences.map(ref => sessionById.get(ref.sessionId));
  if (lessons.some(lesson => !lesson)) return false;
  if (subject === 'theory') return lessons.every(lesson => isSessionInScope(lesson!, level, field, 'theory'));
  return lessons.every(lesson => isSessionInScope(lesson!, level, field, 'theory') || isSessionInScope(lesson!, level, field, 'practical')) &&
   lessons.some(lesson => isSessionInScope(lesson!, level, field, 'practical'));
 };
 // Prior field-specific questions repeated shared reporting objectives; archived without deleting attempts.
 const availableTests: ReviewTest[] = [...reviewTests, ...differentialBank.exams];
 return availableTests.flatMap(exam => {
  const questions = exam.questions.filter(questionsInScope);
  if (!questions.length) return [];
  const unchanged = questions.length === exam.questions.length;
  return [{ ...exam,
   // Only the split fifth form gets new attempt identities. Original full forms resume unchanged.
   id: unchanged ? exam.id : `${exam.id}:${subject}:scope-v1`,
   revision: unchanged ? exam.revision : `${exam.revision}:${subject}:scope-v1`,
   titleJa: `建設1号 ${subject === 'theory' ? '学科' : '実技'} 確認テスト 第${Number(exam.id.split('-').pop())}回`,
   questions: questions.map((question, index) => ({ ...question, number: index + 1 })),
   questionCount: questions.length, maxPoints: questions.reduce((total, question) => total + question.points, 0),
   sessionRange: [Math.min(...questions.flatMap(q => q.sourceReferences.map(ref => Number(ref.sessionId.split('-').pop())))),
                  Math.max(...questions.flatMap(q => q.sourceReferences.map(ref => Number(ref.sessionId.split('-').pop()))))],
  }];
 });
}
