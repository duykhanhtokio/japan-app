import diagrams from './diagrams.json';
import type {RestaurantLesson,RestaurantLevel,RestaurantExam,RestaurantLocale,RestaurantQuestion,RestaurantDiagram} from './types';
export type * from './types';
export {RESTAURANT_CONTENT_VERSION} from './types';
// Keep module evaluation small on the industry/level selector. Load only the chosen level.
const lessonLoaders:Record<RestaurantLevel,()=>{lessons:RestaurantLesson[]}>={
 '1':()=>require('./lessons.1.ja.json'),'2':()=>require('./lessons.2.ja.json'),
};
const examLoaders:Record<RestaurantLevel,()=>{exams:RestaurantExam[]}>={
 '1':()=>require('./exams.1.ja.json'),'2':()=>require('./exams.2.ja.json'),
};
const lessonCache:Partial<Record<RestaurantLevel,RestaurantLesson[]>>={};
const examCache:Partial<Record<RestaurantLevel,RestaurantExam[]>>={};
export const restaurantLevelLessons=(level:RestaurantLevel)=>lessonCache[level]??(lessonCache[level]=lessonLoaders[level]().lessons);
const levelExams=(level:RestaurantLevel)=>examCache[level]??(examCache[level]=examLoaders[level]().exams);
// Metro keeps literal require targets; evaluate only the learner's chosen locale.
const loaders:Record<string,()=>RestaurantLocale>={
 en:()=>require('./translations/en.json'),vi:()=>require('./translations/vi.json'),id:()=>require('./translations/id.json'),
 'zh-CN':()=>require('./translations/zh-CN.json'),'zh-TW':()=>require('./translations/zh-TW.json'),
 hi:()=>require('./translations/hi.json'),bn:()=>require('./translations/bn.json'),ne:()=>require('./translations/ne.json'),
 my:()=>require('./translations/my.json'),th:()=>require('./translations/th.json'),km:()=>require('./translations/km.json'),tl:()=>require('./translations/tl.json'),
};
const loaded:Record<string,RestaurantLocale>={};
const localeData=(locale:string)=>loaded[locale]??(loaders[locale]?(loaded[locale]=loaders[locale]()):undefined);
export const restaurantDiagrams = diagrams.diagrams as unknown as RestaurantDiagram[];
export const restaurantLesson=(id:string,level:RestaurantLevel)=>restaurantLevelLessons(level).find(l=>l.id===id&&l.level===level);
export const restaurantWeeks=(level:RestaurantLevel)=>[...new Set(restaurantLevelLessons(level).map(l=>l.week))].sort((a,b)=>a-b).map(number=>({number,lessons:restaurantLevelLessons(level).filter(l=>l.week===number).sort((a,b)=>a.day-b.day)}));
export const restaurantExams=(level:RestaurantLevel,kind?:RestaurantExam['kind'])=>levelExams(level).filter(e=>(!kind||e.kind===kind)&&e.questions.length>0);
export function restaurantLessonTranslation(lesson:RestaurantLesson,locale:string){
 const t=localeData(locale)?.lessons?.[lesson.id];
 return t&&!!lesson.sourceHash&&t.sourceHash===lesson.sourceHash&&t.title&&t.objective&&t.summary&&t.activity&&lesson.paragraphs.every(p=>t.paragraphs?.[p.id]&&t.paragraphTitles?.[p.id])&&lesson.terms.every(term=>t.terms?.[term.ja])?t:null;
}
export function restaurantQuestionTranslation(q:RestaurantQuestion,locale:string){
 const t=localeData(locale)?.questions?.[q.id];
 return t&&!!q.sourceHash&&t.sourceHash===q.sourceHash&&t.stem&&t.explanation&&Array.isArray(t.options)&&t.options.length===q.optionsJa.length&&t.options.every(Boolean)?t:null;
}
export function restaurantUi(text:string,locale:string){return localeData(locale)?.ui?.[text]||text;}
