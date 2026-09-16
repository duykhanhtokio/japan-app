import type { AppLanguageCode } from '@/i18n/languages';

type Entry = { localeCode: AppLanguageCode; text: string };
type ExplanationData = { records: { questionId: string; localizedExplanations: Entry[] }[] };

const data = require('./n1-2013-12/explanations.13-locales.json') as ExplanationData;
const byQuestion = new Map(data.records.map((record) => [record.questionId, record.localizedExplanations]));

// The approved controller calls this only inside post-submission review.
export function n1December2013Explanation(questionId: string, language: AppLanguageCode): string | undefined {
  const entries = byQuestion.get(questionId);
  return entries?.find((entry) => entry.localeCode === language)?.text
    || entries?.find((entry) => entry.localeCode === 'en')?.text
    || entries?.find((entry) => entry.localeCode === 'zh-CN')?.text
    || undefined;
}
