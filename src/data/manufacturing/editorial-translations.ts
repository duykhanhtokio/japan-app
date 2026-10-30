import type {ManufacturingQuestion,ManufacturingLesson} from './index';
import type {LessonTranslation,QuestionTranslation} from './translations';

type Patch={kind:'weekly'|'mock'|'lesson'|'guide';locale:string;entryId:string;sourceHash:string;fieldPath:(string|number)[];before:string;after:string};
let patches:Patch[]|null=null;
/** Apply a reviewed translation revision only to its exact source and prior wording.
 * Original banks, answer order, grading and stored attempts remain unchanged.
 */
function revised<T extends {sourceHash:string}>(kind:Patch['kind'],source:{id:string;sourceHash:string},locale:string,entry:T):T{
 const revisions=patches??(patches=[...require('./editorial-translations.json').patches,...require('./safety-editorial-translations.json').patches] as Patch[]);
 const selected=revisions.filter(p=>p&&p.kind===kind&&p.locale===locale&&p.entryId===source.id&&p.sourceHash===source.sourceHash);
 if(!selected.length||entry.sourceHash!==source.sourceHash)return entry;
 const words=new Set(['stem','options','reasons','title','objective','paragraphs','terms','meaning','text','activity','safety','summary']);
 const validPath=(p:Patch)=>Array.isArray(p.fieldPath)&&p.fieldPath.length>0&&p.fieldPath.every(k=>typeof k==='number'?Number.isInteger(k)&&k>=0:words.has(k));
 const value=(p:Patch)=>{
  let current:unknown=entry;
  for(const key of p.fieldPath){if(!current||typeof current!=='object')return undefined;current=(current as Record<string|number,unknown>)[key];}
  return current;
 };
 // Fail closed for the entire entry when any expected prior field has changed.
 if(selected.some(p=>!validPath(p)||typeof p.before!=='string'||typeof p.after!=='string'||value(p)!==p.before||!p.after.trim()))return entry;
 const copy=JSON.parse(JSON.stringify(entry)) as T;
 for(const p of selected){
  let parent=copy as Record<string|number,unknown>;
  for(const key of p.fieldPath.slice(0,-1))parent=parent[key] as Record<string|number,unknown>;
  parent[p.fieldPath[p.fieldPath.length-1]]=p.after;
 }
 return copy;
}
export function revisedManufacturingQuestionTranslation(kind:'weekly'|'mock',question:ManufacturingQuestion,locale:string,entry:QuestionTranslation):QuestionTranslation{return revised(kind,question,locale,entry);}
export function revisedManufacturingLessonTranslation(lesson:ManufacturingLesson,locale:string,entry:LessonTranslation,kind:'lesson'|'guide'='lesson'):LessonTranslation{return revised(kind,lesson,locale,entry);}
