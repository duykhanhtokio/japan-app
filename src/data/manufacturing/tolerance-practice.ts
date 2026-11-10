import type {ManufacturingExam,ManufacturingLesson,ManufacturingQuestion,Specialty} from './index';
import type {QuestionTranslation} from './translations';
import {manufacturingLessonParagraph} from './lesson-editorial';
type Draft={id:string;revision:string;titleJa:string;lessonPatch:{lessonId:string;paragraphId:string;sourceHash:string;wording:Record<string,{before:string;after:string}>};questions:ManufacturingQuestion[];locales:Record<string,Record<string,QuestionTranslation>>};
let cached:Draft|null=null;
function draft():Draft{return cached??(cached=require('./tolerance-practice.json') as Draft);}
const own=(o:object,k:string)=>Object.prototype.hasOwnProperty.call(o,k);
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
function currentLesson():ManufacturingLesson|null{
 const p=draft().lessonPatch,lesson=(require('./mechanical.json').lessons as ManufacturingLesson[]).find(l=>l.id===p.lessonId&&l.sourceHash===p.sourceHash);
 if(!lesson)return null;
 const before=lesson.paragraphs.find(x=>x.id===p.paragraphId)?.textJa;
 return before===p.wording.ja.before&&manufacturingLessonParagraph(lesson,p.paragraphId,'ja',before)===p.wording.ja.after?lesson:null;
}
function currentQuestion(q:ManufacturingQuestion):boolean{
 const original=draft().questions.find(x=>x.id===q.id);
 return !!currentLesson()&&!!original&&original.sourceHash===q.sourceHash&&original.lessonId===q.lessonId
  &&original.stemJa===q.stemJa&&original.correctIndex===q.correctIndex&&same(original.optionsJa,q.optionsJa)
  &&same(original.optionReasonsJa,q.optionReasonsJa)&&same(original.sources,q.sources);
}
/** Additive source-bound practice; no existing exam revision or learner identity is replaced. */
export function manufacturingToleranceExams(specialty:Specialty):ManufacturingExam[]{
 if(specialty!=='mechanical'||!currentLesson())return [];
 const d=draft();return [{id:d.id,revision:d.revision,titleJa:d.titleJa,kind:'weekly',officialSimulation:false,weekId:'supplement-tolerance-class',questions:d.questions.map(q=>({...q,optionsJa:[...q.optionsJa],optionReasonsJa:[...q.optionReasonsJa],sources:q.sources.map(s=>({...s}))}))}];
}
/** Reject altered teaching, questions and wrong-locale data rather than using another language. */
export function manufacturingToleranceTranslation(q:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 if(locale==='ja'||!currentQuestion(q))return null;
 const d=draft(),bank=own(d.locales,locale)?d.locales[locale]:undefined,t=bank&&own(bank,q.id)?bank[q.id]:undefined;
 return t&&t.sourceHash===q.sourceHash&&typeof t.stem==='string'&&!!t.stem.trim()
  &&Array.isArray(t.options)&&t.options.length===q.optionsJa.length&&t.options.every(x=>typeof x==='string'&&!!x.trim())
  &&Array.isArray(t.reasons)&&t.reasons.length===q.optionReasonsJa.length&&t.reasons.every(x=>typeof x==='string'&&!!x.trim())
  ? {...t,options:[...t.options],reasons:[...t.reasons]}:null;
}
