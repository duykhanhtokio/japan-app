import { japaneseMockReviewBatches } from './japanese-mock-review-batches';
import correctionData from './japanese-master/mock-core-corrections.json';
import figureLanguageReview from './japanese-master/mock-figure-language-review.json';
import type { MockForm, MockQuestion } from './types';

type ReviewQuestion = Pick<MockQuestion,
  'promptJa' | 'optionsJa' | 'correctIndex' | 'passageJa' | 'figureDescriptionJa' | 'figureKey'> & {
  rationalesJa: string[];
};
export type JapaneseMockReview = { titleJa: string; questions: Record<string, ReviewQuestion> };
export type JapaneseReviewedMockForm = MockForm & { japaneseReviewApplied?: boolean; japaneseCoreCorrected?: boolean; titleJa?: string };
type Correction = { expected: Partial<MockQuestion>; replacement: Partial<MockQuestion> };
export const japaneseMockCoreCorrections: Record<string, { questions: Record<string, Correction> }> = correctionData.forms;
export const japaneseMockFigureLabelsPending = new Set(figureLanguageReview.pendingJapaneseLabels);
export const japaneseMockReviews: Record<string, JapaneseMockReview> = Object.assign(
  {}, ...japaneseMockReviewBatches.map(batch => batch.forms),
);
const coreKeys = ['promptJa', 'optionsJa', 'correctIndex', 'passageJa', 'figureDescriptionJa', 'figureKey'] as const;

/** Explanations can share the saved attempt only when every answer-bearing field is unchanged. */
export function withJapaneseMockReview(
  form: MockForm,
  reviews = japaneseMockReviews,
): JapaneseReviewedMockForm {
  const review = reviews[form.id];
  if (!review || !review.titleJa?.trim()
    || Object.keys(review.questions).length !== form.questions.length) return form;
  for (const question of form.questions) {
    const item = review.questions[question.id];
    if (!item || coreKeys.some(key => JSON.stringify(question[key]) !== JSON.stringify(item[key]))
      || !Array.isArray(item.rationalesJa)
      || item.rationalesJa.length !== question.optionsJa.length
      || item.rationalesJa.some(text => !text?.trim())
      || new Set(item.rationalesJa).size !== item.rationalesJa.length) return form;
  }
  const corrections = japaneseMockCoreCorrections[form.id];
  if (corrections) for (const [id, change] of Object.entries(corrections.questions)) {
    const question = form.questions.find(item => item.id === id);
    if (!question || Object.keys(change.expected).some(key =>
      JSON.stringify(question[key as keyof MockQuestion]) !== JSON.stringify(change.expected[key as keyof MockQuestion]))) return form;
  }
  const next: JapaneseReviewedMockForm = {
    ...form,
    titleJa: review.titleJa,
    japaneseReviewApplied: true,
    questions: form.questions.map(question => ({
      ...question,
      rationalesJa: review.questions[question.id].rationalesJa,
      ...corrections?.questions[question.id]?.replacement,
    })),
  };
  if (corrections) {
    let hash = 2166136261;
    for (const char of JSON.stringify(corrections)) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    next.contentRevision = form.contentRevision + '-ja-editorial-v1-' + (hash >>> 0).toString(16);
    next.japaneseCoreCorrected = true;
  }
  return next;
}
