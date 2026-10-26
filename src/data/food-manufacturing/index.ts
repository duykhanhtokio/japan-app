import test0 from "./test-translations/vi.json";
import test1 from "./test-translations/en.json";
import test2 from "./test-translations/id.json";
import test3 from "./test-translations/zh-CN.json";
import test4 from "./test-translations/zh-TW.json";
import test5 from "./test-translations/hi.json";
import test6 from "./test-translations/bn.json";
import test7 from "./test-translations/ne.json";
import test8 from "./test-translations/my.json";
import test9 from "./test-translations/th.json";
import test10 from "./test-translations/km.json";
import test11 from "./test-translations/tl.json";
import level1 from './lessons.1.ja.json';
import level2 from './lessons.2.ja.json';
import tests from './exams.ja.json';
import glossary from './translations/glossary.json';
import en from './translations/en.json';
import vi from './translations/vi.json';
import my from './translations/my.json';
import km from './translations/km.json';
import ne from './translations/ne.json';
import id from './translations/id.json';
import th from './translations/th.json';
import zhCN from './translations/zh-CN.json';
import hi from './translations/hi.json';
import zhTW from './translations/zh-TW.json';
import tl from './translations/tl.json';
import bn from './translations/bn.json';
export type FoodManufacturingLevel='1'|'2';
export type FoodManufacturingLesson={id:string;level:FoodManufacturingLevel;week:number;day:number;titleJa:string;objectiveJa:string;paragraphs:{id:string;titleJa:string;textJa:string}[];terms:{ja:string;reading:string}[];activityJa:string;summaryJa:string;sourceHash:string};
export type FoodManufacturingQuestion={id:string;sourceHash:string;stemJa:string;optionsJa:string[];correctIndex:number;optionReasonsJa:string[];explanationJa:string};
export type FoodManufacturingExam={id:string;level:FoodManufacturingLevel;kind:string;week?:number;titleJa:string;revision:string;questions:FoodManufacturingQuestion[]};
type Translation={sourceHash:string;title:string;objective:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>;activity:string;summary:string;terms?:Record<string,string>};
/** Deterministic revision fallback; full SHA-256 sourceHash is preferred at authoring freeze. */
function revision(value:unknown){const text=JSON.stringify(value);let h=2166136261;for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619);return `fnv1a-${(h>>>0).toString(16)}`;}
const rawLessons=[...level1.lessons,...level2.lessons];
export const foodManufacturingLessons:FoodManufacturingLesson[]=rawLessons.map(raw=>({...raw,level:raw.level as FoodManufacturingLevel,sourceHash:('sourceHash' in raw&&typeof raw.sourceHash==='string')?raw.sourceHash:revision(raw)}));
export function foodManufacturingWeeks(level:FoodManufacturingLevel){
 const weeks=[...new Set(foodManufacturingLessons.filter(l=>l.level===level).map(l=>l.week))].sort((a,b)=>a-b);
 return weeks.map(number=>{const lessons=foodManufacturingLessons.filter(l=>l.level===level&&l.week===number).sort((a,b)=>a.day-b.day);return {id:`food-${level}-week-${number}`,number,titleJa:lessons[0]?.titleJa??'',lessonIds:lessons.map(l=>l.id)};});
}
export function foodManufacturingLesson(id:string,level:FoodManufacturingLevel){return foodManufacturingLessons.find(l=>l.id===id&&l.level===level);}
const exams:FoodManufacturingExam[]=tests.exams.map(e=>({...e,level:e.level as FoodManufacturingLevel,revision:('revision' in e&&typeof e.revision==='string')?e.revision:revision(e),questions:e.questions.map(q=>({id:q.id,sourceHash:revision({promptJa:q.promptJa,optionsJa:q.optionsJa,explanationJa:q.explanationJa,optionExplanationsJa:q.optionExplanationsJa}),stemJa:q.promptJa,optionsJa:q.optionsJa,correctIndex:q.answerIndex,optionReasonsJa:q.optionExplanationsJa,explanationJa:q.explanationJa}))}));
export function foodManufacturingChecks(level:FoodManufacturingLevel){return exams.filter(e=>e.level===level);}
const packs:Record<string,unknown>={en,vi,my,km,ne,id,th,'zh-CN':zhCN,hi,'zh-TW':zhTW,tl,bn};
export function foodManufacturingTranslation(lesson:FoodManufacturingLesson,locale:string):Translation|null{
 const t=(packs[locale] as Record<string,Translation>|undefined)?.[lesson.id];
 if(!t||t.sourceHash!==lesson.sourceHash||!t.title||!t.objective||!t.activity||!t.summary||!lesson.paragraphs.every(p=>t.paragraphs?.[p.id]&&t.paragraphTitles?.[p.id]))return null;
 return t;
}

export function foodManufacturingTermTranslation(ja:string,locale:string){const term=glossary.terms.find(t=>t.ja===ja);return term?(term.translations as Record<string,string>)[locale]??null:null;}

export type FoodQuestionTranslation={sourceHash:string;prompt:string;options:string[];explanation:string;optionExplanations:string[]};
const testPacks:Record<string,{questions:Record<string,FoodQuestionTranslation>;examTitles:Record<string,{sourceHash:string;title:string}>}>=Object.fromEntries([
["vi",test0],
["en",test1],
["id",test2],
["zh-CN",test3],
["zh-TW",test4],
["hi",test5],
["bn",test6],
["ne",test7],
["my",test8],
["th",test9],
["km",test10],
["tl",test11]
]) as Record<string,{questions:Record<string,FoodQuestionTranslation>;examTitles:Record<string,{sourceHash:string;title:string}>}>;
export function foodManufacturingQuestionTranslation(question:FoodManufacturingQuestion,locale:string):FoodQuestionTranslation|null{
 const t=testPacks[locale]?.questions[question.id];
 if(!t||t.sourceHash!==question.sourceHash||typeof t.prompt!=='string'||!t.prompt.trim()||typeof t.explanation!=='string'||!t.explanation.trim()||!Array.isArray(t.options)||t.options.length!==4||!Array.isArray(t.optionExplanations)||t.optionExplanations.length!==4||!t.options.every(v=>typeof v==='string'&&v.trim())||!t.optionExplanations.every(v=>typeof v==='string'&&v.trim()))return null;
 return t;
}
export function foodManufacturingExamTitleTranslation(exam:FoodManufacturingExam,locale:string){const t=testPacks[locale]?.examTitles[exam.id];return t?.sourceHash===revision({titleJa:exam.titleJa})&&typeof t.title==='string'&&t.title.trim()?t.title:null;}
