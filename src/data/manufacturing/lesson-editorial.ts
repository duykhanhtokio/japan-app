import type {ManufacturingLesson} from './index';
import {manufacturingBooleanParagraph} from './boolean-editorial';

type Clarification={lessonId:string;paragraphId:string;sourceHash:string;wording:Record<string,{before:string;after:string}>};
let clarification:Clarification|null=null;

/** Source-bound wording correction; frozen banks and learner/session IDs stay intact.
 * Both Japanese source and exact prior target wording must match. No locale fallback.
 * This clarifies an existing inspection principle, without adding an operating procedure.
 */
export function manufacturingLessonParagraph(lesson:ManufacturingLesson,paragraphId:string,locale:string,text:string|undefined):string|undefined {
 if(lesson.id==='mfg1-electrical-l075')return manufacturingBooleanParagraph(lesson,paragraphId,locale,text);
 if(lesson.id!=='mfg1-mechanical-lesson-076'||paragraphId!=='section-3')return text;
 const patch=clarification??(clarification=require('./lesson-editorial.json') as Clarification);
 const original=lesson.paragraphs.find(p=>p.id===paragraphId);
 const target=Object.prototype.hasOwnProperty.call(patch.wording,locale)?patch.wording[locale]:undefined;
 if(patch.lessonId!==lesson.id||patch.paragraphId!==paragraphId||patch.sourceHash!==lesson.sourceHash
   ||original?.textJa!==patch.wording.ja?.before||!target||text!==target.before
   ||typeof target.after!=='string'||!target.after.trim())return text;
 return target.after;
}
