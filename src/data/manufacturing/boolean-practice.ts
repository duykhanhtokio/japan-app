import type {ManufacturingExam,ManufacturingLesson,ManufacturingQuestion,Specialty} from './index';
import type {QuestionTranslation} from './translations';
import {manufacturingLessonParagraph} from './lesson-editorial';
type Ruby={text:string;reading?:string};
type Draft={id:string;revision:string;titleJa:string;lessonId:string;lessonSourceHash:string;paragraphId:string;taughtBefore:string;taughtAfter:string;questions:ManufacturingQuestion[];ruby:Record<string,{sourceHash:string;stem:Ruby[];options:Ruby[][]}>;locales:Record<string,Record<string,QuestionTranslation>>};
let cached:Draft|null=null;
function draft():Draft{return cached??(cached=require('./boolean-practice.json') as Draft);}
function currentLesson():ManufacturingLesson|null{
 const d=draft(),lesson=(require('./electrical.json').lessons as ManufacturingLesson[]).find(l=>l.id===d.lessonId&&l.sourceHash===d.lessonSourceHash);
 if(!lesson)return null;
 const before=lesson.paragraphs.find(p=>p.id===d.paragraphId)?.textJa;
 return before===d.taughtBefore&&manufacturingLessonParagraph(lesson,d.paragraphId,'ja',before)===d.taughtAfter?lesson:null;
}
function currentQuestion(question:ManufacturingQuestion):ManufacturingQuestion|null{
 if(!currentLesson())return null;
 const original=draft().questions.find(q=>q.id===question.id&&q.sourceHash===question.sourceHash);
 return original&&original.lessonId===question.lessonId&&original.stemJa===question.stemJa&&original.correctIndex===question.correctIndex
   &&JSON.stringify(original.optionsJa)===JSON.stringify(question.optionsJa)&&JSON.stringify(original.optionReasonsJa)===JSON.stringify(question.optionReasonsJa)?original:null;
}
/** Additive formative practice is available only while its exact teaching extension is active. */
export function manufacturingBooleanPracticeExams(specialty:Specialty):ManufacturingExam[]{
 if(specialty!=='electrical'||!currentLesson())return [];
 const d=draft();return [{id:d.id,revision:d.revision,titleJa:d.titleJa,kind:'weekly',officialSimulation:false,weekId:'supplement-boolean-distributivity',questions:d.questions.map(q=>({...q,optionsJa:[...q.optionsJa],optionReasonsJa:[...q.optionReasonsJa],sources:q.sources.map(s=>({...s}))}))}];
}
/** No locale fallback and no translation for changed question or teaching snapshots. */
export function manufacturingBooleanPracticeTranslation(question:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 if(locale==='ja'||!currentQuestion(question))return null;
 const d=draft(),items=Object.prototype.hasOwnProperty.call(d.locales,locale)?d.locales[locale]:undefined;
 const t=items&&Object.prototype.hasOwnProperty.call(items,question.id)?items[question.id]:undefined;
 return t&&t.sourceHash===question.sourceHash&&typeof t.stem==='string'&&t.stem.trim()
   &&Array.isArray(t.options)&&t.options.length===4&&t.options.every(text=>typeof text==='string'&&text.trim())
   &&Array.isArray(t.reasons)&&t.reasons.length===4&&t.reasons.every(text=>typeof text==='string'&&text.trim())?{...t,options:[...t.options],reasons:[...t.reasons]}:null;
}
export function manufacturingBooleanPracticeRuby(question:ManufacturingQuestion,field:'stem'|number):Ruby[]|null{
 if(!currentQuestion(question))return null;
 const r=draft().ruby[question.id];if(r?.sourceHash!==question.sourceHash)return null;
 const parts=field==='stem'?r.stem:r.options[field],text=field==='stem'?question.stemJa:question.optionsJa[field];
 return Array.isArray(parts)&&parts.every(p=>p&&typeof p.text==='string'&&(!p.reading||typeof p.reading==='string'))&&parts.map(p=>p.text).join('')===text?parts.map(p=>({...p})):null;
}
