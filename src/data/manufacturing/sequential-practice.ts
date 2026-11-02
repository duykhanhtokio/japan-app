import type {ManufacturingExam,ManufacturingLesson,ManufacturingQuestion,Specialty} from './index';
import type {QuestionTranslation} from './translations';
type Patch={lessonId:string;paragraphId:string;sourceHash:string;wording:Record<string,{before:string;after:string}>};
type Draft={id:string;revision:string;titleJa:string;lessonPatch:Patch;questions:ManufacturingQuestion[];locales:Record<string,Record<string,QuestionTranslation>>};
const own=(o:object,k:string)=>Object.prototype.hasOwnProperty.call(o,k);
const cache:Record<string,Draft>={};
function draft(key:'kirchhoff'|'binary'|'signal'):Draft{
 switch(key){
  case 'kirchhoff':return cache.kirchhoff??(cache.kirchhoff=require('./practice46/kirchhoff.json') as Draft);
  case 'binary':return cache.binary??(cache.binary=require('./practice46/binary.json') as Draft);
  case 'signal':return cache.signal??(cache.signal=require('./practice46/signal.json') as Draft);
 }
}
function drafts():Draft[]{return [draft('kirchhoff'),draft('binary'),draft('signal')];}
function patchParagraph(p:Patch,lesson:ManufacturingLesson,id:string,locale:string,text:string|undefined){
 const target=own(p.wording,locale)?p.wording[locale]:undefined;
 return p.lessonId===lesson.id&&p.paragraphId===id&&p.sourceHash===lesson.sourceHash
  &&lesson.paragraphs.find(x=>x.id===id)?.textJa===p.wording.ja?.before
  &&target&&text===target.before&&typeof target.after==='string'&&!!target.after.trim()?target.after:text;
}
export function manufacturingSequentialParagraph(lesson:ManufacturingLesson,id:string,locale:string,text:string|undefined):string|undefined{
 const key=lesson.id==='mfg1-electrical-l070'?'kirchhoff':lesson.id==='mfg1-electrical-l025'?'binary':lesson.id==='mfg1-electrical-l024'?'signal':null;
 const d=key?draft(key):null;
 return d?patchParagraph(d.lessonPatch,lesson,id,locale,text):text;
}
function current(d:Draft):boolean{
 const p=d.lessonPatch,lesson=(require('./electrical.json').lessons as ManufacturingLesson[]).find(l=>l.id===p.lessonId&&l.sourceHash===p.sourceHash);
 if(!lesson)return false;
 const before=lesson.paragraphs.find(x=>x.id===p.paragraphId)?.textJa;
 return before===p.wording.ja.before&&patchParagraph(p,lesson,p.paragraphId,'ja',before)===p.wording.ja.after;
}
/** Each new exam is additive and bound to its exact taught Japanese revision. */
export function manufacturingSequentialExams(specialty:Specialty):ManufacturingExam[]{
 if(specialty!=='electrical')return [];
 return drafts().filter(current).map(d=>({id:d.id,revision:d.revision,titleJa:d.titleJa,kind:'weekly',officialSimulation:false,weekId:d.id,questions:d.questions.map(q=>({...q,optionsJa:[...q.optionsJa],optionReasonsJa:[...q.optionReasonsJa],sources:q.sources.map(s=>({...s}))}))}));
}
export function manufacturingSequentialTranslation(q:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 if(locale==='ja')return null;
 const d=drafts().find(d=>d.questions.some(x=>x.id===q.id));if(!d||!current(d))return null;
 const original=d.questions.find(x=>x.id===q.id);
 if(!original||JSON.stringify(original)!==JSON.stringify(q))return null;
 const bank=own(d.locales,locale)?d.locales[locale]:undefined,t=bank&&own(bank,q.id)?bank[q.id]:undefined;
 return t&&t.sourceHash===q.sourceHash&&typeof t.stem==='string'&&!!t.stem.trim()
  &&Array.isArray(t.options)&&t.options.length===q.optionsJa.length&&t.options.every(s=>typeof s==='string'&&!!s.trim())
  &&Array.isArray(t.reasons)&&t.reasons.length===q.optionsJa.length&&t.reasons.every(s=>typeof s==='string'&&!!s.trim())
  ? {...t,options:[...t.options],reasons:[...t.reasons]}:null;
}
