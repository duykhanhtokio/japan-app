import { contentRevision } from './japanese-master';
import { japaneseMockTranslationBatches } from './japanese-mock-translation-batches';
import type { JapaneseReviewedMockForm } from './japanese-mock-reviews';
import type { MockQuestion } from './types';

export type JapaneseMockQuestionSource = Pick<MockQuestion,
  'promptJa' | 'optionsJa' | 'correctIndex' | 'rationalesJa' | 'passageJa' | 'figureDescriptionJa' | 'figureKey'>;
export type JapaneseMockQuestionTranslation = {
  sourceRevision: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  rationales: string[];
  passage: string;
  figureDescription: string;
  status: 'translated_ai_unreviewed' | 'human_reviewed';
};
export type JapaneseMockFormTranslation = {
  sourceRevision: string;
  title: string;
  status: JapaneseMockQuestionTranslation['status'];
  questions: Record<string, JapaneseMockQuestionTranslation>;
};
export function japaneseMockQuestionSource(q: MockQuestion): JapaneseMockQuestionSource {
  return { promptJa: q.promptJa, optionsJa: q.optionsJa, correctIndex: q.correctIndex,
    rationalesJa: q.rationalesJa, passageJa: q.passageJa,
    figureDescriptionJa: q.figureDescriptionJa, figureKey: q.figureKey };
}
export function japaneseMockQuestionRevision(q: JapaneseMockQuestionSource): string {
  return contentRevision([q.promptJa, q.optionsJa, q.correctIndex, q.rationalesJa,
    q.passageJa, q.figureDescriptionJa, q.figureKey]);
}
export function japaneseMockTitleRevision(form: JapaneseReviewedMockForm): string {
  return contentRevision([form.titleJa]);
}
export const japaneseMockTranslations: Record<string, Record<string, JapaneseMockFormTranslation>> = {};
for (const batch of japaneseMockTranslationBatches) for (const [id, translation] of Object.entries(batch.forms)) {
  japaneseMockTranslations[id] = { ...japaneseMockTranslations[id], [batch.language]: translation as JapaneseMockFormTranslation };
}
export function translationForMockTitle(form: JapaneseReviewedMockForm, language: string,
  translations = japaneseMockTranslations): JapaneseMockFormTranslation | undefined {
  const translation = translations[form.id]?.[language];
  return form.titleJa?.trim() && translation?.sourceRevision === japaneseMockTitleRevision(form)
    && typeof translation.title === 'string' && translation.title.trim() ? translation : undefined;
}
/** Uses the effective corrected Japanese question; never reads legacy translations. */
export function translationForMockQuestion(form: JapaneseReviewedMockForm, id: string, language: string,
  translations = japaneseMockTranslations): JapaneseMockQuestionTranslation | undefined {
  const q = form.questions.find(q => q.id === id), t = translations[form.id]?.[language]?.questions?.[id];
  if (!form.japaneseReviewApplied || !q || !t || t.sourceRevision !== japaneseMockQuestionRevision(q)
    || typeof t.prompt !== 'string' || !t.prompt.trim() || t.correctIndex !== q.correctIndex
    || !Array.isArray(t.options) || t.options.length !== q.optionsJa.length
    || !Array.isArray(t.rationales) || t.rationales.length !== q.rationalesJa.length
    || ![...t.options, ...t.rationales].every(s => typeof s === 'string' && s.trim())
    || typeof t.passage !== 'string' || (q.passageJa.trim() ? !t.passage.trim() : t.passage !== '')
    || typeof t.figureDescription !== 'string'
    || (q.figureDescriptionJa.trim() ? !t.figureDescription.trim() : t.figureDescription !== '')) return undefined;
  return t;
}
