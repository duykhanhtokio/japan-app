import sources from './reader-communication-translation-sources.json';

type Japanese = { promptJa: string; modelAnswerJa: string; teachingJa?: string };
type Translation = { prompt: string; modelAnswer: string; teaching?: string };
type Check = Japanese & { id: string; translations: Record<string, Translation> };

/** Exact source binding prevents showing an old translation after Japanese edits.
 * This is a revision check, not semantic or native-language certification. */
export function getCommunicationReaderTranslation(check: Check, language: string): Translation | undefined {
  const source = (sources.checks as Record<string, Japanese>)[check.id];
  if (!source || source.promptJa !== check.promptJa || source.modelAnswerJa !== check.modelAnswerJa ||
      source.teachingJa !== check.teachingJa) return undefined;
  const translation = check.translations[language];
  if (!translation?.prompt?.trim() || !translation.modelAnswer?.trim() ||
      (check.teachingJa !== undefined && !translation.teaching?.trim())) return undefined;
  return translation;
}
