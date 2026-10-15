import week01 from './japanese-master/week-01.json';
import pilotTranslations from './japanese-master/translations/pilot-01.json';
import vietnameseWeek01 from './japanese-master/translations/week-01.vi.json';
import englishWeek01 from './japanese-master/translations/week-01.en.json';

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
  return contentRevision([master.headingJa, master.paragraphsJa]);
}
function contentRevision(value: unknown): string {
  let hash = 2166136261;
  for (const char of JSON.stringify(value)) {
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
export const japaneseMasterTranslations: Record<string, Record<string, MasterTranslation>> = {
  ...(pilotTranslations as Record<string, Record<string, MasterTranslation>>),
};
for (const batch of [vietnameseWeek01, englishWeek01]) {
  for (const [id, translation] of Object.entries(batch.sections)) {
    japaneseMasterTranslations[id] = {
      ...japaneseMasterTranslations[id],
      [batch.language]: translation as MasterTranslation,
    };
  }
}

export type LessonTranslation = {
  sourceRevision: string;
  title: string;
  artCaption: string;
  status: MasterTranslation['status'];
};
export function japaneseLessonRevision(lesson: JapaneseLessonMetadata): string {
  return contentRevision([lesson.titleJa, lesson.objectivesJa, lesson.contextJa, lesson.artCaptionJa]);
}
export const japaneseLessonTranslations: Record<string, Record<string, LessonTranslation>> = {};
for (const batch of [vietnameseWeek01, englishWeek01]) {
  for (const [id, translation] of Object.entries(batch.lessons)) {
    japaneseLessonTranslations[id] = {
      ...japaneseLessonTranslations[id],
      [batch.language]: translation as LessonTranslation,
    };
  }
}
export function translationForLesson(
  id: string,
  language: string,
  translations = japaneseLessonTranslations,
  lessons = japaneseLessonMetadata,
): LessonTranslation | undefined {
  const lesson = lessons[id], translation = translations[id]?.[language];
  return lesson && translation?.sourceRevision === japaneseLessonRevision(lesson) ? translation : undefined;
}
export function translationForMaster(
  id: string,
  language: string,
  translations = japaneseMasterTranslations,
  masters = japaneseMasterSections,
): MasterTranslation | undefined {
  const master = masters[id], translation = translations[id]?.[language];
  if (!master || !translation || translation.sourceRevision !== japaneseMasterRevision(master)
    || !translation.heading?.trim()
    || translation.paragraphs.length !== master.paragraphsJa.length
    || !translation.paragraphs.every(p => typeof p === 'string' && p.trim())) return undefined;
  return translation;
}
