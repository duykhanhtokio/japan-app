import content from './lessons.ja.json';
import manifest from './course-manifest.json';
import {agricultureLocaleTranslations} from './translations';
export type AgricultureLevel = '1' | '2';
export type AgricultureLesson = (typeof content.lessons)[number];
type WeeklyExam = (typeof import('./weekly-checks.ja.json'))['exams'][number];
export type AgricultureQuestion = WeeklyExam['questions'][number] & {illustrationId?:string;illustrationRevision?:string};
export type AgricultureExam = Pick<WeeklyExam,'id'|'revision'|'titleJa'|'officialSimulation'|'timeLimitMinutes'|'passThreshold'> & {
 questions:AgricultureQuestion[];
 kind:'weekly'|'mock';
 levels:string[];
};
export const agricultureLessons = content.lessons;
export function agricultureWeeks(level:AgricultureLevel) { return manifest.levels[level].weeks; }
export function agricultureLesson(id:string,level:AgricultureLevel) { return agricultureLessons.find(l=>l.id===id && l.levels.includes(level)); }
export function agricultureChecks(level:AgricultureLevel,kind?:AgricultureExam['kind']):AgricultureExam[] {
 const exams:AgricultureExam[]=[];
 if(!kind||kind==='weekly')exams.push(...require('./weekly-checks.ja.json').exams.map((e:WeeklyExam)=>({...e,kind:'weekly' as const})));
 if(!kind||kind==='mock')exams.push(...require('./mock-exams.ja.json').exams.map((e:WeeklyExam)=>({...e,kind:'mock' as const})));
 return exams.filter(e=>e.levels.includes(level));
}
export function agricultureTranslation(lesson:AgricultureLesson,locale:string) {
 const data = agricultureLocaleTranslations(locale)?.[lesson.id];
 return data?.sourceHash===lesson.sourceHash ? data : null;
}
