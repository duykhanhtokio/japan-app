import content from './lessons.ja.json';
import manifest from './course-manifest.json';
import translated from './translations.json';
import checks from './weekly-checks.ja.json';
export type AgricultureLevel = '1' | '2';
export type AgricultureLesson = (typeof content.lessons)[number];
export type AgricultureExam = (typeof checks.exams)[number];
type Translation = {sourceHash:string;title:string;objective:string;paragraphs:Record<string,string>;paragraphTitles:Record<string,string>;activity:string};
export const agricultureLessons = content.lessons;
export function agricultureWeeks(level:AgricultureLevel) { return manifest.levels[level].weeks; }
export function agricultureLesson(id:string,level:AgricultureLevel) { return agricultureLessons.find(l=>l.id===id && l.levels.includes(level)); }
export function agricultureChecks(level:AgricultureLevel) { return checks.exams.filter(e=>e.level===level); }
export function agricultureTranslation(lesson:AgricultureLesson,locale:string) {
 const data = (translated.locales as Record<string,Record<string,Translation>>)[locale]?.[lesson.id];
 return data?.sourceHash===lesson.sourceHash ? data : null;
}
