import differentialBank from './differential-review-tests.ja.json';
import utilitiesBank from './utilities-review-tests.ja.json';
import theoryBank from './theory-review-tests.ja.json';
import fieldBank from './field-review-tests.ja.json';
import { sessionById, type Field, type Level } from './index';
import { isSessionInScope, paragraphIdsForScope, type Subject } from './scope';
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
 if (subject === 'foreman') return [];
 // Publisher decision 2026-10-17: both levels share corresponding lesson/question content.
 const questionsInScope = (question: ReviewQuestion) => {
  if (!question.sourceReferences.length) return false;
  if (question.sourceReferences.some(ref => {
   const ids = new Set([...paragraphIdsForScope(ref.sessionId, level, field, subject),
    ...(subject === 'practical' ? paragraphIdsForScope(ref.sessionId, level, field, 'theory') : [])]);
   return !ref.paragraphIds.length || ref.paragraphIds.some(id => !ids.has(id));
  })) return false;
  const lessons = question.sourceReferences.map(ref => sessionById.get(ref.sessionId));
  if (lessons.some(lesson => !lesson)) return false;
  if (subject === 'theory') return lessons.every(lesson => isSessionInScope(lesson!, level, field, 'theory'));
  return lessons.every(lesson => isSessionInScope(lesson!, level, field, 'theory') || isSessionInScope(lesson!, level, field, 'practical')) &&
   lessons.some(lesson => isSessionInScope(lesson!, level, field, 'practical'));
 };
 // Prior field-specific questions repeated shared reporting objectives; archived without deleting attempts.
 const availableTests: ReviewTest[] = [...reviewTests, ...differentialBank.exams, ...utilitiesBank.exams, ...theoryBank.exams];
 let scopedTests = availableTests.flatMap(exam => {
  const questions = exam.questions.filter(questionsInScope);
  if (!questions.length) return [];
  const unchanged = questions.length === exam.questions.length;
  return [{ ...exam,
   // Only the split fifth form gets new attempt identities. Original full forms resume unchanged.
   id: unchanged ? exam.id : `${exam.id}:${subject}:scope-v1`,
   revision: unchanged ? exam.revision : `${exam.revision}:${subject}:scope-v1`,
   questions: questions.map((question, index) => ({ ...question, number: index + 1 })),
   questionCount: questions.length, maxPoints: questions.reduce((total, question) => total + question.points, 0),
   sessionRange: [Math.min(...questions.flatMap(q => q.sourceReferences.map(ref => Number(ref.sessionId.split('-').pop())))),
                  Math.max(...questions.flatMap(q => q.sourceReferences.map(ref => Number(ref.sessionId.split('-').pop()))))],
  }];
 });
 if (field === 'utilities' && subject === 'practical') {
  const completion = scopedTests.find(exam => exam.id === 'kensetsu-utilities-completion-test-01');
  const partial = scopedTests.find(exam => exam.id === 'kensetsu-review-v2-05:practical:scope-v1');
  if (completion && partial && partial.questionCount === 35 && completion.questionCount === 5) {
   const questions = [...partial.questions, ...completion.questions].map((question, index) => ({ ...question, number: index + 1 }));
   scopedTests = scopedTests.flatMap(exam => exam.id === completion.id ? [] : exam.id === partial.id ? [{
    ...partial,
    // A new identity preserves stored 35-question attempts without treating them as a submitted 40-question form.
    id: 'kensetsu-utilities-complete-test-01',
    revision: '1go-utilities-original35-plus5-v1',
    questions,
    questionCount: questions.length,
    maxPoints: questions.reduce((total, question) => total + question.points, 0),
    sessionRange: [partial.sessionRange[0], completion.sessionRange[1]],
   }] : [exam]);
  }
 }
 if (subject === 'theory') {
  const completion = scopedTests.find(exam => exam.id === 'kensetsu-theory-completion-test-01');
  const partial = scopedTests.find(exam => exam.id === 'kensetsu-review-v2-05:theory:scope-v1');
  if (completion && partial && partial.questionCount === 5 && completion.questionCount === 35) {
   const questions = [...partial.questions, ...completion.questions].map((question, index) => ({ ...question, number: index + 1 }));
   scopedTests = scopedTests.flatMap(exam => exam.id === completion.id ? [] : exam.id === partial.id ? [{
    ...partial, id: 'kensetsu-theory-complete-test-01', revision: '1go-theory-original5-plus35-v1',
    questions, questionCount: questions.length, maxPoints: questions.length,
    sessionRange: [Math.min(partial.sessionRange[0], completion.sessionRange[0]), Math.max(partial.sessionRange[1], completion.sessionRange[1])],
   }] : [exam]);
  }
 }
 if (subject === 'practical' && field !== 'utilities') {
  const additions: ReviewQuestion[] = [...fieldBank.sharedQuestions, ...(field === 'civil' ? fieldBank.civilQuestions : [])];
  const questionsById = new Map([...scopedTests.flatMap(exam => exam.questions), ...additions.filter(questionsInScope)].map(question => [question.id, question]));
  // Membership changes get new attempt identities; all prior bank definitions and stored attempts remain intact.
  scopedTests = fieldBank.formsByField[field].flatMap(form => {
   const selected = form.questionIds.map(id => questionsById.get(id));
   if (selected.some(question => !question)) return [];
   const questions = (selected as ReviewQuestion[]).map((question, index) => ({ ...question, number: index + 1 }));
   const sessionNumbers = questions.flatMap(question => question.sourceReferences.map(ref => Number(ref.sessionId.split('-').pop())));
   return [{ id: form.id, revision: fieldBank.revision, titleJa: '', language: 'ja',
    questionCount: questions.length, maxPoints: questions.reduce((total, question) => total + question.points, 0),
    timeLimitSeconds: null, passThreshold: null, isOfficialExam: false,
    sessionRange: [Math.min(...sessionNumbers), Math.max(...sessionNumbers)], questions }];
  });
 }
 return scopedTests.map((exam, index) => ({
  ...exam,
  id: level === '2' ? `${exam.id}:2go:v1` : exam.id,
  // Display order belongs to this scope; stable exam/attempt IDs retain their original identity.
  titleJa: `建設${level}号 ${subject === 'theory' ? '学科' : '実技'} 確認テスト 第${index + 1}回`,
 }));
}
