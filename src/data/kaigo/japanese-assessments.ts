import { contentRevision } from './japanese-master';
import { japaneseTranslationBatches } from './japanese-translation-batches';
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

// A translation is usable only for the exact current Japanese question, in the selected locale.
export type JapaneseQuestionTranslation = {
  sourceRevision: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  rationales: string[];
  reading?: string;
  status: 'translated_ai_unreviewed' | 'human_reviewed';
};
/** Include the existing project-authored Japanese reading actually shown by the assessment. */
export function japaneseQuestionTranslationSource(id: string, masters = japaneseQuestionMasters): JapaneseQuestionMaster | undefined {
  const master = masters[id];
  if (!master) return undefined;
  const readingJa = master.readingJa ?? weeklyQuestions.find(q => q.id === id)?.reading;
  return { ...master, ...(readingJa === undefined ? {} : { readingJa }) };
}
export function japaneseQuestionRevision(q: JapaneseQuestionMaster): string {
  return contentRevision([q.promptJa, q.optionsJa, q.correctIndex, q.rationalesJa, q.readingJa ?? null]);
}
export const japaneseQuestionTranslations: Record<string, Record<string, JapaneseQuestionTranslation>> = {};
for (const batch of japaneseTranslationBatches) {
  const questions = (batch as unknown as { questions?: Record<string, JapaneseQuestionTranslation> }).questions ?? {};
  for (const [id, translation] of Object.entries(questions)) {
    japaneseQuestionTranslations[id] = { ...japaneseQuestionTranslations[id], [batch.language]: translation };
  }
}
export function translationForQuestion(id: string, language: string,
  translations = japaneseQuestionTranslations, masters = japaneseQuestionMasters): JapaneseQuestionTranslation | undefined {
  const q = japaneseQuestionTranslationSource(id, masters), t = translations[id]?.[language];
  if (!q || !t || t.sourceRevision !== japaneseQuestionRevision(q) || !t.prompt?.trim()
    || t.correctIndex !== q.correctIndex || t.options?.length !== 4 || t.rationales?.length !== 4
    || ![...t.options, ...t.rationales].every(s => typeof s === 'string' && s.trim())
    || (q.readingJa?.trim() && !t.reading?.trim())
    || (q.readingJa === '' && t.reading !== '')) return undefined;
  return t;
}
