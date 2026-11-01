import {supplementalLessons,supplementalExams,supplementalTranslations,supplementalTestTranslations} from './supplemental';
import level1 from './lessons.1.ja.json';
import level2 from './lessons.2.ja.json';
import glossary from './translations/glossary.json';
export type FoodManufacturingLevel='1'|'2';
export type FoodManufacturingLesson={id:string;level:FoodManufacturingLevel;week:number;day:number;titleJa:string;objectiveJa:string;paragraphs:{id:string;titleJa:string;textJa:string}[];terms:{ja:string;reading:string}[];activityJa:string;summaryJa:string;sourceHash:string};
export type FoodManufacturingQuestion={id:string;sourceHash:string;stemJa:string;optionsJa:string[];correctIndex:number;optionReasonsJa:string[];explanationJa:string};
export type FoodManufacturingExam={id:string;level:FoodManufacturingLevel;kind:string;week?:number;titleJa:string;revision:string;questions:FoodManufacturingQuestion[]};
type Translation={sourceHash:string;title:string;objective:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>;activity:string;summary:string;terms?:Record<string,string>};
/** Deterministic revision fallback; full SHA-256 sourceHash is preferred at authoring freeze. */
function revision(value:unknown){const text=JSON.stringify(value);let h=2166136261;for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619);return `fnv1a-${(h>>>0).toString(16)}`;}
const rawLessons=[...level1.lessons,...level2.lessons,...supplementalLessons];
export const foodManufacturingLessons:FoodManufacturingLesson[]=rawLessons.map(raw=>({...raw,level:raw.level as FoodManufacturingLevel,sourceHash:('sourceHash' in raw&&typeof raw.sourceHash==='string')?raw.sourceHash:revision(raw)}));
export function foodManufacturingWeeks(level:FoodManufacturingLevel){
 const weeks=[...new Set(foodManufacturingLessons.filter(l=>l.level===level).map(l=>l.week))].sort((a,b)=>a-b);
 return weeks.map(number=>{const lessons=foodManufacturingLessons.filter(l=>l.level===level&&l.week===number).sort((a,b)=>a.day-b.day);return {id:`food-${level}-week-${number}`,number,titleJa:lessons[0]?.titleJa??'',lessonIds:lessons.map(l=>l.id)};});
}
export function foodManufacturingLesson(id:string,level:FoodManufacturingLevel){return foodManufacturingLessons.find(l=>l.id===id&&l.level===level);}
let cachedExams:FoodManufacturingExam[]|undefined;
function loadExams():FoodManufacturingExam[]{return cachedExams??(cachedExams=([...require('./exams.ja.json').exams,...supplementalExams]).map((e: {id:string;level:string;kind:string;week?:number;titleJa:string;revision?:string;questions:any[]})=>({...e,level:e.level as FoodManufacturingLevel,revision:('revision' in e&&typeof e.revision==='string')?e.revision:revision(e),questions:e.questions.map((q: {id:string;promptJa:string;optionsJa:string[];explanationJa:string;optionExplanationsJa:string[];answerIndex:number})=>({id:q.id,sourceHash:revision({promptJa:q.promptJa,optionsJa:q.optionsJa,explanationJa:q.explanationJa,optionExplanationsJa:q.optionExplanationsJa}),stemJa:q.promptJa,optionsJa:q.optionsJa,correctIndex:q.answerIndex,optionReasonsJa:q.optionExplanationsJa,explanationJa:q.explanationJa}))})));}
export function foodManufacturingChecks(level:FoodManufacturingLevel){return loadExams().filter(e=>e.level===level);}
const packs:Record<string,Record<string,Translation>>={};
function lessonPack(locale:string){
 if(packs[locale])return packs[locale];
 let base:Record<string,Translation>|undefined;
 switch(locale){
 case 'en':base=require('./translations/en.json');break;
 case 'vi':base=require('./translations/vi.json');break;
 case 'id':base=require('./translations/id.json');break;
 case 'zh-CN':base=require('./translations/zh-CN.json');break;
 case 'zh-TW':base=require('./translations/zh-TW.json');break;
 case 'hi':base=require('./translations/hi.json');break;
 case 'bn':base=require('./translations/bn.json');break;
 case 'ne':base=require('./translations/ne.json');break;
 case 'my':base=require('./translations/my.json');break;
 case 'th':base=require('./translations/th.json');break;
 case 'km':base=require('./translations/km.json');break;
 case 'tl':base=require('./translations/tl.json');break;
 default:return undefined;
 }
 return packs[locale]={...base,...supplementalTranslations[locale]};
}
export function foodManufacturingTranslation(lesson:FoodManufacturingLesson,locale:string):Translation|null{
 const t=lessonPack(locale)?.[lesson.id];
 if(!t||t.sourceHash!==lesson.sourceHash||!t.title||!t.objective||!t.activity||!t.summary||!lesson.paragraphs.every(p=>t.paragraphs?.[p.id]&&t.paragraphTitles?.[p.id]))return null;
 return t;
}

export function foodManufacturingTermTranslation(ja:string,locale:string){const term=glossary.terms.find(t=>t.ja===ja);return term?(term.translations as Record<string,string>)[locale]??null:null;}

export type FoodQuestionTranslation={sourceHash:string;prompt:string;options:string[];explanation:string;optionExplanations:string[]};
type TestPack={questions:Record<string,FoodQuestionTranslation>;examTitles:Record<string,{sourceHash:string;title:string}>};
const testPacks:Record<string,TestPack>={};
function testPack(locale:string):TestPack|undefined{
 if(testPacks[locale])return testPacks[locale];
 let base:TestPack;
 switch(locale){
 case 'en':base=require('./test-translations/en.json');break;
 case 'vi':base=require('./test-translations/vi.json');break;
 case 'id':base=require('./test-translations/id.json');break;
 case 'zh-CN':base=require('./test-translations/zh-CN.json');break;
 case 'zh-TW':base=require('./test-translations/zh-TW.json');break;
 case 'hi':base=require('./test-translations/hi.json');break;
 case 'bn':base=require('./test-translations/bn.json');break;
 case 'ne':base=require('./test-translations/ne.json');break;
 case 'my':base=require('./test-translations/my.json');break;
 case 'th':base=require('./test-translations/th.json');break;
 case 'km':base=require('./test-translations/km.json');break;
 case 'tl':base=require('./test-translations/tl.json');break;
 default:return undefined;
 }
 const extra=supplementalTestTranslations[locale];
 return testPacks[locale]={questions:{...base.questions,...extra?.questions},examTitles:{...base.examTitles,...extra?.examTitles}};
}
export function foodManufacturingQuestionTranslation(question:FoodManufacturingQuestion,locale:string):FoodQuestionTranslation|null{
 const t=testPack(locale)?.questions[question.id];
 if(!t||t.sourceHash!==question.sourceHash||typeof t.prompt!=='string'||!t.prompt.trim()||typeof t.explanation!=='string'||!t.explanation.trim()||!Array.isArray(t.options)||t.options.length!==4||!Array.isArray(t.optionExplanations)||t.optionExplanations.length!==4||!t.options.every(v=>typeof v==='string'&&v.trim())||!t.optionExplanations.every(v=>typeof v==='string'&&v.trim()))return null;
 return t;
}
export function foodManufacturingExamTitleTranslation(exam:FoodManufacturingExam,locale:string){const t=testPack(locale)?.examTitles[exam.id];return t?.sourceHash===revision({titleJa:exam.titleJa})&&typeof t.title==='string'&&t.title.trim()?t.title:null;}
