import companionData from './daily-companion-readings.json';
import { japaneseMasterRevision, japaneseMasterSections } from './japanese-master';
import type { CatalogEntry } from './catalog';
import type { JapaneseReadingSection } from './japanese-reading';

type Companion = { sectionIds: string[]; sourceRevisions: Record<string, string>; reasonJa: string };
const companions = companionData.days as Record<string, Companion>;

/** Source paragraphs and translations remain single records. The daily reader
 * adds an explicit related application, never a generated generic filler. */
export function companionSectionsFor(entry: CatalogEntry): JapaneseReadingSection[] {
  const binding = companions[String(entry.day)];
  if (entry.kind === 'mock') return [];
  const relocated = companionData.relocations.filter(r => r.toDay === entry.day);
  const ids = [...(binding?.sectionIds ?? []), ...relocated.flatMap(r => r.sectionIds)];
  const revisions: Record<string, string> = Object.assign({}, binding?.sourceRevisions,
    ...relocated.map(r => r.sourceRevisions));
  return ids.flatMap(id => {
    const source = japaneseMasterSections[id];
    if (!source || japaneseMasterRevision(source) !== revisions[id]) return [];
    return [{ id, heading: '', paragraphs: [], parentDay: entry.parentDay,
      headingJa: source.headingJa, paragraphsJa: source.paragraphsJa,
      japaneseComplete: true, masterStatus: source.editorialStatus,
      figureCaptionsJa: source.figureCaptionsJa }];
  });
}

export function dailyPrimarySections(entry: CatalogEntry, sections: JapaneseReadingSection[]) {
  const moved = new Set(companionData.relocations.filter(r => r.fromDay === entry.day)
    .flatMap(r => r.sectionIds));
  return sections.filter(section => !moved.has(section.id));
}

export function relocatedPracticeDays(day: number): number[] {
  return [...new Set(companionData.relocations.filter(r => r.fromDay === day).map(r => r.toDay))];
}

/** Reference vocabulary stays available at its original section; it is not
 * assigned as thousands of new required daily-reading characters. */
export function isReferenceGlossary(section: JapaneseReadingSection): boolean {
  return section.id.endsWith('-words') && section.headingJa.includes('参照');
}
