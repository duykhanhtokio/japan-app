import entryMetadata from './entry-lesson-metadata.json';
import {lazyRecord} from '@/services/lazy-record';
import type { RubyToken } from './types';

export type JapaneseMasterSection = {
  headingJa: string;
  paragraphsJa: string[];
  paragraphsRuby?: RubyToken[][];
  editorialStatus: string;
  humanReviewed: boolean;
  domainReviewed: boolean;
  nativeReviewed: boolean;
  figureCaptionsJa?: Record<string, string>;
};
export type JapaneseLessonMetadata = {
  day: number;
  titleJa: string;
  objectivesJa: string[];
  contextJa: string;
  artCaptionJa: string;
  artReviewStatus: string;
};
export const japaneseMasterSections=lazyRecord<Record<string,JapaneseMasterSection>>(()=>Object.assign({}, ...(require('./japanese-master-batches') as typeof import('./japanese-master-batches')).japaneseMasterBatches.map(batch=>batch.sections)));
export const japaneseLessonMetadata:Record<string,JapaneseLessonMetadata>=entryMetadata.lessons;
export function japaneseLessonKey(entry: { id: string; day: number }): string {
  const dayKey = `study-day-${entry.day}`;
  return japaneseLessonMetadata[dayKey] ? dayKey : entry.id;
}

/** Content-dependent binding. Any Japanese edit invalidates a previous translation. */
export function japaneseMasterRevision(master: Pick<JapaneseMasterSection, 'headingJa' | 'paragraphsJa' | 'figureCaptionsJa'>): string {
  return contentRevision(master.figureCaptionsJa && Object.keys(master.figureCaptionsJa).length
    ? [master.headingJa, master.paragraphsJa, master.figureCaptionsJa]
    : [master.headingJa, master.paragraphsJa]);
}
export function contentRevision(value: unknown): string {
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
  figureCaptions?: Record<string, string>;
  status: 'translated_ai_unreviewed' | 'human_reviewed';
};
// Only translations authored directly from the Japanese master belong here.
// Existing Vietnamese paragraphs remain in the original data as legacy references.
export const japaneseMasterTranslations=lazyRecord<Record<string,Record<string,MasterTranslation>>>(()=>{
const translations: Record<string, Record<string, MasterTranslation>> = {
  ...(require('./japanese-master/translations/pilot-01.json') as Record<string, Record<string, MasterTranslation>>),
};
for (const batch of (require('./japanese-translation-batches') as typeof import('./japanese-translation-batches')).japaneseTranslationBatches) {
  for (const [id, translation] of Object.entries(batch.sections)) {
    translations[id] = {
      ...translations[id],
      [batch.language]: translation as MasterTranslation,
    };
  }
}

return translations;
});

export type LessonTranslation = {
  sourceRevision: string;
  title: string;
  artCaption: string;
  objectives: string[];
  context: string;
  status: MasterTranslation['status'];
};
export function japaneseLessonRevision(lesson: JapaneseLessonMetadata): string {
  return contentRevision([lesson.titleJa, lesson.objectivesJa, lesson.contextJa, lesson.artCaptionJa]);
}
export const japaneseLessonTranslations = lazyRecord<Record<string, Record<string, LessonTranslation>>>(() => {
const translations: Record<string, Record<string, LessonTranslation>> = {};
for (const batch of (require('./japanese-translation-batches') as typeof import('./japanese-translation-batches')).japaneseTranslationBatches) {
  for (const [id, translation] of Object.entries(batch.lessons)) {
    translations[id] = {
      ...translations[id],
      [batch.language]: translation as LessonTranslation,
    };
  }
}
return translations;
});
export function translationForLesson(
  id: string,
  language: string,
  translations = japaneseLessonTranslations,
  lessons = japaneseLessonMetadata,
): LessonTranslation | undefined {
  const lesson = lessons[id], translation = translations[id]?.[language];
  if (!lesson || !translation || translation.sourceRevision !== japaneseLessonRevision(lesson)
    || ![translation.title, translation.artCaption, translation.context].every(s => typeof s === 'string' && s.trim())
    || !Array.isArray(translation.objectives) || translation.objectives.length !== lesson.objectivesJa.length
    || !translation.objectives.every(s => typeof s === 'string' && s.trim())) return undefined;
  return translation;
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
    || !translation.paragraphs.every(p => typeof p === 'string' && p.trim())
    || Object.keys(master.figureCaptionsJa ?? {}).some(key => !translation.figureCaptions?.[key]?.trim())) return undefined;
  return translation;
}
