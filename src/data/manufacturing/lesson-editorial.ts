import type {ManufacturingLesson} from './index';
import {manufacturingBooleanParagraph} from './boolean-editorial';

type Clarification={lessonId:string;paragraphId:string;sourceHash:string;wording:Record<string,{before:string;after:string}>};
let clarification:Clarification|null=null;
let dimensionClarification:Clarification|null=null;
let toleranceClarification:Clarification|null=null;
let qcPlanClarification:Clarification|null=null;
let energyClarification:Clarification|null=null;
let source47Clarification:Clarification|null=null;
let source49Clarification:Clarification|null=null;

/** Source-bound wording correction; frozen banks and learner/session IDs stay intact.
 * Both Japanese source and exact prior target wording must match. No locale fallback.
 * This clarifies an existing inspection principle, without adding an operating procedure.
 */
export function manufacturingLessonParagraph(lesson:ManufacturingLesson,paragraphId:string,locale:string,text:string|undefined):string|undefined {
 if(['mfg1-surface-lesson-008','mfg1-surface-lesson-061'].includes(lesson.id))return require('./source60-buff').manufacturingSource60Paragraph(lesson,paragraphId,locale,text);
 if(['mfg1-mechanical-lesson-072','mfg1-mechanical-lesson-041','mfg1-mechanical-lesson-049'].includes(lesson.id))return require('./source57-mechanical').manufacturingSource57Paragraph(lesson,paragraphId,locale,text);
 if(lesson.id==='mfg1-electrical-l043')return require('./source50-overview').manufacturingSource50Paragraph(lesson,paragraphId,locale,text);
 if((lesson.id==='mfg1-mechanical-lesson-023'&&paragraphId==='example')||(lesson.id==='mfg1-electrical-l068'&&paragraphId==='section-1')||(lesson.id==='mfg1-surface-lesson-028'&&paragraphId==='example')){
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Defer the helper for unrelated study days.
  return require('./calculation48').manufacturingCalculation48Paragraph(lesson,paragraphId,locale,text);
 }
 if(['mfg1-electrical-l070','mfg1-electrical-l025','mfg1-electrical-l024'].includes(lesson.id)){
  const revised=require('./sequential-practice').manufacturingSequentialParagraph(lesson,paragraphId,locale,text);
  if(revised!==text)return revised;
 }
 if(lesson.id==='mfg1-electrical-l075')return manufacturingBooleanParagraph(lesson,paragraphId,locale,text);
 const dimension=lesson.id==='mfg1-mechanical-lesson-046'&&paragraphId==='section-2';
 const tolerance=lesson.id==='mfg1-mechanical-lesson-021'&&paragraphId==='decision';
 const qcPlan=lesson.id==='mfg1-mechanical-lesson-011'&&paragraphId==='example';
 const energy=lesson.id==='mfg1-electrical-l068'&&paragraphId==='section-2';
 const source47=lesson.id==='mfg1-mechanical-lesson-080'&&paragraphId==='section-2';
 const source49=lesson.id==='mfg1-electrical-l094'&&paragraphId==='section-2';
 if(!dimension&&!tolerance&&!qcPlan&&!energy&&!source47&&!source49&&(lesson.id!=='mfg1-mechanical-lesson-076'||paragraphId!=='section-3'))return text;
 const patch=source49
  ? source49Clarification??(source49Clarification=require('./source49-thermal-clarification.json') as Clarification)
  : source47
  ? source47Clarification??(source47Clarification=require('./source47-clarification.json') as Clarification)
  : energy
  ? energyClarification??(energyClarification=require('./energy-practice.json').lessonPatch as Clarification)
  : qcPlan
  ? qcPlanClarification??(qcPlanClarification=require('./qc-plan-practice.json').lessonPatch as Clarification)
  : tolerance
  ? toleranceClarification??(toleranceClarification=require('./tolerance-practice.json').lessonPatch as Clarification)
  : dimension
  ? dimensionClarification??(dimensionClarification=require('./dimension-editorial.json') as Clarification)
  : clarification??(clarification=require('./lesson-editorial.json') as Clarification);
 const original=lesson.paragraphs.find(p=>p.id===paragraphId);
 const target=Object.prototype.hasOwnProperty.call(patch.wording,locale)?patch.wording[locale]:undefined;
 if(patch.lessonId!==lesson.id||patch.paragraphId!==paragraphId||patch.sourceHash!==lesson.sourceHash
   ||original?.textJa!==patch.wording.ja?.before||!target||text!==target.before
   ||typeof target.after!=='string'||!target.after.trim())return text;
 return target.after;
}
