import type {ManufacturingLesson} from './index';
type Patch={lessonId:string;termIndex:number;termJa:string;meaningJa:string;sourceHash:string;locale:string;before:string;after:string};
let patches:Patch[]|null=null;
/** Apply current-context term revisions only after existing editorial getters. */
export function clarifiedTerm40(lesson:ManufacturingLesson,index:number,locale:string,text:string|undefined):string|undefined{
 if(typeof text!=='string')return text;
 const all=patches??(patches=require('./implementation40/term-corrections.json').patches as Patch[]),term=lesson.terms[index];
 const selected=all.filter(p=>p.lessonId===lesson.id&&p.termIndex===index&&p.locale===locale);
 if(selected.length!==1)return text;
 const p=selected[0];
 return p.sourceHash===lesson.sourceHash&&p.termJa===term?.ja&&p.meaningJa===term.meaningJa&&p.before===text&&p.after.trim()?p.after:text;
}
