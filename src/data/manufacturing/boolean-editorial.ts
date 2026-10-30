import type {ManufacturingLesson} from './index';

type BooleanClarification={lessonId:string;paragraphId:string;sourceHash:string;wording:Record<string,{before:string;after:string}>};
let clarification:BooleanClarification|null=null;

/** Source-bound dual distributivity explanation. Keeps frozen banks/session IDs.
 * Exact source Japanese and prior target wording are required, with no fallback.
 */
export function manufacturingBooleanParagraph(lesson:ManufacturingLesson,paragraphId:string,locale:string,text:string|undefined):string|undefined {
 if(lesson.id!=='mfg1-electrical-l075'||paragraphId!=='section-2')return text;
 const patch=clarification??(clarification=require('./boolean-editorial.json') as BooleanClarification);
 const original=lesson.paragraphs.find(p=>p.id===paragraphId);
 const target=Object.prototype.hasOwnProperty.call(patch.wording,locale)?patch.wording[locale]:undefined;
 if(patch.lessonId!==lesson.id||patch.paragraphId!==paragraphId||patch.sourceHash!==lesson.sourceHash
   ||original?.textJa!==patch.wording.ja?.before||!target||text!==target.before
   ||typeof target.after!=='string'||!target.after.trim())return text;
 return target.after;
}
