import { japaneseQuestionBatches } from './japanese-question-batches';
import { weeklyQuestions, type WeeklyQuestion } from './weekly-learning';
export type JapaneseWeeklyQuestion = WeeklyQuestion & { japaneseMaster?: boolean };

export type JapaneseQuestionMaster = {
  promptJa: string;
  optionsJa: string[];
  correctIndex: number;
  rationalesJa: string[];
  readingJa?: string;
};
// Internal learning preview. AI editorial review is not human/domain approval.
export const japaneseQuestionMasters: Record<string, JapaneseQuestionMaster> = Object.assign({}, ...japaneseQuestionBatches.map(batch => batch.questions));

export function withJapaneseAssessment(question: WeeklyQuestion): JapaneseWeeklyQuestion {
  const master = japaneseQuestionMasters[question.id];
  if (!master) return question;
  return {
    ...question,
    prompt: master.promptJa,
    japanese: master.promptJa,
    options: master.optionsJa,
    correctIndex: master.correctIndex,
    rationales: master.rationalesJa,
    reading: master.readingJa ?? question.reading,
    readingRuby: master.readingJa === undefined ? question.readingRuby : undefined,
    language: 'ja',
    japaneseMaster: true,
  };
}

// Existing recognition questions and their old storage revisions stay intact.
export const japaneseWeeklyQuestions: JapaneseWeeklyQuestion[] = weeklyQuestions.map(withJapaneseAssessment);
export const japaneseQuestionsForWeek = (week: number) =>
  japaneseWeeklyQuestions.filter(q => Math.ceil(q.day / 7) === week);
export function japaneseAssessmentRevisionForWeek(week: number): string {
  let hash = 2166136261;
  for (const char of JSON.stringify(japaneseQuestionsForWeek(week)))
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return 'weekly-recognition-v1-' + (hash >>> 0).toString(16);
}
