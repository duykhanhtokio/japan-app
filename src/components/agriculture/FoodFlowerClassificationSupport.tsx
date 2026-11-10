import React from 'react';
import {Text, View} from 'react-native';
import content from '@/data/agriculture/lessons.ja.json';
import data from '@/data/agriculture/food-flower-classification-native.json';
import {agricultureLocaleTranslations} from '@/data/agriculture/translations';

type Colors = {text: string; translation: string; translationText: string; border: string};
type Paragraph = {id: string; titleJa: string; textJa: string; knowledgeIds: string[]};
type Lesson = {id: string; revision: string; levels: string[]; titleJa: string; objectiveJa: string; sourceHash: string; paragraphs: Paragraph[]};
type Labels = Record<string, string>;
type Translation = {sourceHash: string; title: string; objective: string; paragraphs: Record<string, string>; paragraphTitles: Record<string, string>; activity: string};
type Row = {id: string; paragraphId: string; categoryKey: string; subclassKey: string | null; examplesJa: string[]};
type Entry = {kind: string; sourceHash: string; revision: string; scopeLevels: string[]; lessonSnapshot: Lesson; rows: Row[]; canonicalTranslations: Record<string, Translation>; sources: {documentId: string; pdfPage: number; printedPage: number}[]};
type Registry = {schemaVersion: number; studyOnly: boolean; kind: string; labelsJa: Labels; readingsKana: Labels; exampleReadingsKana: Labels; localeSourceJapanese: Record<string, Labels>; locales: Record<string, Labels>; entries: Record<string, Entry>};
const registry = data as unknown as Registry;
const lessons = content.lessons as Lesson[];
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const labelKeys = ['nonHardy', 'hardy', 'biennial', 'perennial', 'western', 'eastern', 'foliage', 'woody', 'herbaceous', 'flowerTree', 'orchid', 'succulent', 'herb', 'category', 'subclass', 'examples', 'title', 'limit'];

export const isFoodFlowerClassificationContext = (lessonId: string) => Object.prototype.hasOwnProperty.call(registry.entries, lessonId);

/** Current, complete source context only. A companion excerpt cannot inherit full-table credit. */
export function foodFlowerClassificationEntry(lessonId: string, sourceHash: string, revision?: string, level?: string, paragraphIds?: string[]) {
  const entry = registry.entries[lessonId];
  const current = lessons.find(lesson => lesson.id === lessonId);
  if (registry.schemaVersion !== 1 || !registry.studyOnly || registry.kind !== 'food-flower-classification' || !entry || entry.kind !== registry.kind || !current || !revision || !level || !entry.scopeLevels.includes(level) || !current.levels.includes(level) || entry.sourceHash !== sourceHash || entry.revision !== revision || !same(current, entry.lessonSnapshot) || current.sourceHash !== sourceHash || current.revision !== revision) return null;
  if (paragraphIds && current.paragraphs.some(paragraph => !paragraphIds.includes(paragraph.id))) return null;
  if (!same(registry.locales.ja, registry.labelsJa) || !labelKeys.every(key => registry.labelsJa[key]?.trim() && registry.readingsKana[key]?.trim() && /^[\p{Script=Hiragana}\p{Script=Katakana}ー・。、\s]+$/u.test(registry.readingsKana[key]))) return null;
  if (entry.rows.length !== 8 || new Set(entry.rows.map(row => row.id)).size !== 8 || !entry.rows.every(row => {
    const paragraph = current.paragraphs.find(p => p.id === row.paragraphId);
    return paragraph && registry.labelsJa[row.categoryKey] && current.paragraphs.some(p => p.textJa.includes(registry.labelsJa[row.categoryKey])) && (!row.subclassKey || (registry.labelsJa[row.subclassKey] && paragraph.textJa.includes(registry.labelsJa[row.subclassKey]))) && row.examplesJa.length > 0 && row.examplesJa.every(example => example.trim() && paragraph.textJa.includes(example) && (!/[\p{Script=Han}々]/u.test(example) || !!registry.exampleReadingsKana[example]));
  }) || current.paragraphs.some(paragraph => !entry.rows.some(row => row.paragraphId === paragraph.id))) return null;
  return entry;
}

/** UI labels are direct drafts; plant-name support uses exact current canonical translations. */
export function foodFlowerClassificationLabels(lessonId: string, sourceHash: string, revision: string | undefined, level: string | undefined, language: string, paragraphIds?: string[]) {
  const entry = foodFlowerClassificationEntry(lessonId, sourceHash, revision, level, paragraphIds);
  const labels = registry.locales[language];
  if (!entry || !labels || !labelKeys.every(key => labels[key]?.trim())) return null;
  if (language === 'ja') return {labels, translation: null};
  if (!same(registry.localeSourceJapanese[language], registry.labelsJa)) return null;
  const current = agricultureLocaleTranslations(language)?.[lessonId];
  const snapshot = entry.canonicalTranslations[language];
  if (!current || !snapshot || current.sourceHash !== sourceHash || !same(current, snapshot)) return null;
  return {labels, translation: current};
}

type Props = {lessonId: string; lessonSourceHash: string; lessonRevision?: string; level?: string; language?: string; showTranslation?: boolean; colors: Colors; paragraphIds?: string[]};
export function FoodFlowerClassificationSupport({lessonId, lessonSourceHash, lessonRevision, level, language = 'ja', showTranslation = false, colors, paragraphIds}: Props) {
  const entry = foodFlowerClassificationEntry(lessonId, lessonSourceHash, lessonRevision, level, paragraphIds);
  const ja = foodFlowerClassificationLabels(lessonId, lessonSourceHash, lessonRevision, level, 'ja', paragraphIds);
  if (!entry || !ja) return null;
  const localized = showTranslation && language !== 'ja' ? foodFlowerClassificationLabels(lessonId, lessonSourceHash, lessonRevision, level, language, paragraphIds) : null;
  const text = {color: colors.translationText, fontSize: 16, lineHeight: 27};
  const label = (key: string) => <View style={{minWidth: 0, maxWidth: '100%', gap: 2}}>
    <View accessible accessibilityLabel={ja.labels[key]} testID={`agri-food-flower-ruby-${key}`} style={{minWidth: 0, maxWidth: '100%'}}>
      <Text style={{color: colors.translationText, fontSize: 11, lineHeight: 16}}>{registry.readingsKana[key]}</Text>
      <Text style={{...text, fontWeight: '700'}}>{ja.labels[key]}</Text>
    </View>
    {!!localized && <Text testID={`agri-food-flower-label-${key}-${language}`} style={text}>{localized.labels[key]}</Text>}
  </View>;
  const activeLabels = localized?.labels || ja.labels;
  const alt = [entry.rows.map(row => [activeLabels[row.categoryKey], row.subclassKey ? activeLabels[row.subclassKey] : '', row.examplesJa.join('・')].filter(Boolean).join(' → ')).join('\n'), ...(localized?.translation ? entry.lessonSnapshot.paragraphs.map(paragraph => localized.translation!.paragraphs[paragraph.id]) : [])].join('\n');
  return <View testID={`agri-food-flower-classification-${lessonId}`} style={{minWidth: 0, maxWidth: '100%', flexShrink: 1, gap: 12, padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 10, marginVertical: 12}}>
    {label('title')}
    <View accessible accessibilityRole="image" accessibilityLabel={alt} testID="agri-food-flower-category-table" style={{minWidth: 0, maxWidth: '100%', gap: 12}}>
      {entry.lessonSnapshot.paragraphs.map(paragraph => <View key={paragraph.id} testID={`agri-food-flower-group-${paragraph.id}`} style={{minWidth: 0, maxWidth: '100%', gap: 10, borderBottomWidth: 1, borderColor: colors.border, paddingBottom: 12}}>
        {entry.rows.filter(row => row.paragraphId === paragraph.id).map(row => <View key={row.id} testID={`agri-food-flower-${row.id}`} style={{minWidth: 0, maxWidth: '100%', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch', gap: 10}}>
          <View style={{minWidth: 0, maxWidth: '100%', flexBasis: 160, flexGrow: 1, flexShrink: 1, padding: 10, backgroundColor: colors.translation, gap: 8}}>{label('category')}{label(row.categoryKey)}</View>
          {!!row.subclassKey && <View style={{minWidth: 0, maxWidth: '100%', flexBasis: 160, flexGrow: 1, flexShrink: 1, padding: 10, backgroundColor: colors.translation, gap: 8}}>{label('subclass')}{label(row.subclassKey)}</View>}
          <View style={{minWidth: 0, maxWidth: '100%', flexBasis: 220, flexGrow: 2, flexShrink: 1, padding: 10, gap: 8}}>{label('examples')}{row.examplesJa.map(example => <View key={example} accessible accessibilityLabel={example} style={{minWidth: 0, maxWidth: '100%'}}>{!!registry.exampleReadingsKana[example] && <Text style={{color: colors.translationText, fontSize: 11, lineHeight: 16}}>{registry.exampleReadingsKana[example]}</Text>}<Text testID="agri-food-flower-example" style={text}>{example}</Text></View>)}</View>
        </View>)}
        {!!localized?.translation && <Text testID={`agri-food-flower-canonical-${paragraph.id}-${language}`} style={text}>{localized.translation.paragraphs[paragraph.id]}</Text>}
      </View>)}
    </View>
    {label('limit')}
    <Text style={{...text, fontSize: 14}}>{entry.sources.map(source => `${source.documentId} · PDF p.${source.pdfPage} / p.${source.printedPage}`).join(' / ')}</Text>
  </View>;
}
