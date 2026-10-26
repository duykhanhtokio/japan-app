import type {ManufacturingLesson,ManufacturingQuestion} from './index';
export type LessonTranslation={sourceHash:string;title:string;objective:string;paragraphs:{id:string;title:string;text:string}[];terms:{ja:string;reading:string;meaning:string}[];activity:string;safety:string[];summary:string};
export type QuestionTranslation={sourceHash:string;stem:string;options:string[];reasons:string[]};
export function manufacturingTranslation(lesson:ManufacturingLesson,locale:string):LessonTranslation|null {
 let entries:Record<string,LessonTranslation>|null=null;
 switch(locale){case 'id':entries=require('./translations/id.json').lessons;break;case 'vi':entries=require('./translations/vi.json').lessons;break;case 'en':entries=require('./translations/en.json').lessons;break;}
 const item=entries?.[lesson.id];return item?.sourceHash===lesson.sourceHash?item:null;
}
export function manufacturingQuestionTranslation(question:ManufacturingQuestion,locale:string):QuestionTranslation|null {
 let entries:Record<string,QuestionTranslation>|null=null;
 switch(locale){case 'id':entries=require('./translations/questions.id.json').questions;break;case 'vi':entries=require('./translations/questions.vi.json').questions;break;case 'en':entries=require('./translations/questions.en.json').questions;break;}
 const item=entries?.[question.id];return item?.sourceHash===question.sourceHash?item:null;
}
