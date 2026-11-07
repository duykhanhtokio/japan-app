import type {ManufacturingLesson} from './index';

type Clarification={lessonId:string;paragraphId:string;sourceHash:string;wording:Record<string,{before:string;after:string}>};
let clarification:Clarification|null=null;

/** Source-bound wording correction; frozen banks and learner/session IDs stay intact.
 * Both Japanese source and exact prior target wording must match. No locale fallback.
 * This clarifies an existing inspection principle, without adding an operating procedure.
 */
export function manufacturingLessonParagraph(lesson:ManufacturingLesson,paragraphId:string,locale:string,text:string|undefined):string|undefined {
 if(lesson.id!=='mfg1-mechanical-lesson-076'||paragraphId!=='section-3')return manufacturingOrientationParagraph(lesson,paragraphId,locale,text);
 const patch=clarification??(clarification=require('./lesson-editorial.json') as Clarification);
 const original=lesson.paragraphs.find(p=>p.id===paragraphId);
 const target=Object.prototype.hasOwnProperty.call(patch.wording,locale)?patch.wording[locale]:undefined;
 if(patch.lessonId!==lesson.id||patch.paragraphId!==paragraphId||patch.sourceHash!==lesson.sourceHash
   ||original?.textJa!==patch.wording.ja?.before||!target||text!==target.before
   ||typeof target.after!=='string'||!target.after.trim())return text;
 return target.after;
}

type Wording={before:string;after:string};
type Supplement={lessonId:string;sourceHash:string;patches:{paragraphId:string;wording:Record<string,Wording>}[]};
let supplement:Supplement|null=null;
/** Dated source guidance, guarded by canonical and translated prior text.
 * Keeps bank hashes and learner progress identities stable. No locale fallback.
 */
function manufacturingOrientationParagraph(lesson:ManufacturingLesson,id:string,locale:string,text:string|undefined):string|undefined {
 if(lesson.id!=='mfg1-electrical-l043')return text;
 const data=supplement??(supplement=require('./orientation-editorial.json') as Supplement);
 const patch=data.patches.find(p=>p.paragraphId===id);
 const target=patch&&Object.prototype.hasOwnProperty.call(patch.wording,locale)?patch.wording[locale]:undefined;
 const canonical=lesson.paragraphs.find(p=>p.id===id);
 if(data.lessonId!==lesson.id||data.sourceHash!==lesson.sourceHash||!patch||!target
   ||canonical?.textJa!==patch.wording.ja?.before||text!==target.before
   ||typeof target.after!=='string'||!target.after.startsWith(target.before+'\n\n')
   ||target.after.length<=target.before.length+2)return text;
 return target.after;
}
