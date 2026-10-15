import week01 from './japanese-master/week-01.json';
import pilotTranslations from './japanese-master/translations/pilot-01.json';

export type JapaneseMasterSection = {
  headingJa: string;
  paragraphsJa: string[];
  editorialStatus: string;
  humanReviewed: boolean;
  domainReviewed: boolean;
  nativeReviewed: boolean;
};
export type JapaneseLessonMetadata = {
  day: number;
  titleJa: string;
  objectivesJa: string[];
  contextJa: string;
  artCaptionJa: string;
  artReviewStatus: string;
};
export const japaneseMasterSections: Record<string, JapaneseMasterSection> = week01.sections;
export const japaneseLessonMetadata: Record<string, JapaneseLessonMetadata> = week01.lessons;

/** Content-dependent binding. Any Japanese edit invalidates a previous translation. */
export function japaneseMasterRevision(master: Pick<JapaneseMasterSection, 'headingJa' | 'paragraphsJa'>): string {
  let hash = 2166136261;
  for (const char of JSON.stringify([master.headingJa, master.paragraphsJa])) {
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  }
  return 'ja-master-v1-' + (hash >>> 0).toString(16);
}
export type MasterTranslation = {
  sourceRevision: string;
  heading: string;
  paragraphs: string[];
  status: 'translated_ai_unreviewed' | 'human_reviewed';
};
// Only translations authored directly from the Japanese master belong here.
// Existing Vietnamese paragraphs remain in the original data as legacy references.
export const japaneseMasterTranslations = pilotTranslations as Record<string, Record<string, MasterTranslation>>;
export function translationForMaster(
  id: string,
  language: string,
  translations = japaneseMasterTranslations,
  masters = japaneseMasterSections,
): MasterTranslation | undefined {
  const master = masters[id], translation = translations[id]?.[language];
  if (!master || !translation || translation.sourceRevision !== japaneseMasterRevision(master)) return undefined;
  return translation;
}
