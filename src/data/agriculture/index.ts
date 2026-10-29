import content from './lessons.ja.json';
import manifest from './course-manifest.json';
import {agricultureLocaleTranslations} from './translations';
import checks from './weekly-checks.ja.json';
import mocks from './mock-exams.ja.json';
export type AgricultureLevel = '1' | '2';
export type AgricultureLesson = (typeof content.lessons)[number];
type WeeklyExam = (typeof checks.exams)[number];
export type AgricultureQuestion = WeeklyExam['questions'][number] & {illustrationId?:string;illustrationRevision?:string};
export type AgricultureExam = Pick<WeeklyExam,'id'|'revision'|'titleJa'|'officialSimulation'|'timeLimitMinutes'|'passThreshold'> & {
 questions:AgricultureQuestion[];
 kind:'weekly'|'mock';
 levels:string[];
};
const agricultureExams:AgricultureExam[]=[
 ...checks.exams.map(e=>({...e,kind:'weekly' as const})),
 ...mocks.exams.map(e=>({...e,kind:'mock' as const})),
];
export const agricultureLessons = content.lessons;
export function agricultureWeeks(level:AgricultureLevel) { return manifest.levels[level].weeks; }
export function agricultureLesson(id:string,level:AgricultureLevel) { return agricultureLessons.find(l=>l.id===id && l.levels.includes(level)); }
export function agricultureChecks(level:AgricultureLevel,kind?:AgricultureExam['kind']):AgricultureExam[] {
 return agricultureExams.filter(e=>e.levels.includes(level)&&(!kind||e.kind===kind));
}
export function agricultureTranslation(lesson:AgricultureLesson,locale:string) {
 const data = agricultureLocaleTranslations(locale)?.[lesson.id];
 return data?.sourceHash===lesson.sourceHash ? data : null;
}
