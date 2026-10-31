import {clarifiedTerm40} from './term-editorial40';
import type {ManufacturingLesson} from './index';

type TermClarification={lessonId:string;termIndex:number;termJa:string;sourceHash:string;wording:Record<string,{before:string;after:string}>};
let clarification:TermClarification|null=null;

/** Clarify one source-bound term without changing frozen banks or progress identities.
 * Exact Japanese, term identity, source revision and prior target wording must match.
 * Unsupported or stale targets retain their own wording; no language fallback.
 */
function legacyManufacturingTermMeaning(lesson:ManufacturingLesson,termIndex:number,locale:string,text:string|undefined):string|undefined {
 if(lesson.id!=='mfg1-surface-lesson-062'||termIndex!==3)return text;
 const patch=clarification??(clarification=require('./term-editorial.json') as TermClarification);
 const term=lesson.terms[termIndex];
 const target=Object.prototype.hasOwnProperty.call(patch.wording,locale)?patch.wording[locale]:undefined;
 if(patch.lessonId!==lesson.id||patch.termIndex!==termIndex||patch.termJa!==term?.ja
   ||patch.sourceHash!==lesson.sourceHash||term.meaningJa!==patch.wording.ja?.before
   ||!target||text!==target.before||typeof target.after!=='string'||!target.after.trim())return text;
 return target.after;
}

export function manufacturingTermMeaning(lesson:ManufacturingLesson,termIndex:number,locale:string,text:string|undefined):string|undefined {
 return clarifiedTerm40(lesson,termIndex,locale,legacyManufacturingTermMeaning(lesson,termIndex,locale,text));
}
