import type {ManufacturingExam,ManufacturingLesson,ManufacturingQuestion,Specialty} from './index';
import type {QuestionTranslation} from './translations';
type Key='density'|'resistivity'|'faraday';
type Patch={lessonId:string;paragraphId:string;sourceHash:string;wording:Record<string,{before:string;after:string}>};
type Draft={id:string;revision:string;titleJa:string;specialty:Specialty;lessonPatch:Patch;canonicalTaughtAfter:string;questions:ManufacturingQuestion[];locales:Record<string,Record<string,QuestionTranslation>>};
const cache:Partial<Record<Key,Draft>>={};
const own=(o:object,k:string)=>Object.prototype.hasOwnProperty.call(o,k);
function draft(key:Key):Draft{
 switch(key){
  case 'density':return cache.density??(cache.density=require('./calculation48/density.json') as Draft);
  case 'resistivity':return cache.resistivity??(cache.resistivity=require('./calculation48/resistivity.json') as Draft);
  case 'faraday':return cache.faraday??(cache.faraday=require('./calculation48/faraday.json') as Draft);
 }
}
function current(d:Draft):boolean{
 const p=d.lessonPatch;
 const lessons=(d.specialty==='mechanical'?require('./mechanical.json'):d.specialty==='electrical'?require('./electrical.json'):require('./surface.json')).lessons as ManufacturingLesson[];
 const lesson=lessons.find(l=>l.id===p.lessonId&&l.sourceHash===p.sourceHash);
 return !!lesson&&lesson.paragraphs.find(x=>x.id===p.paragraphId)?.textJa===p.wording.ja?.before
  &&typeof p.wording.ja?.after==='string'&&!!p.wording.ja.after.trim()&&p.wording.ja.after===d.canonicalTaughtAfter;
}
/** Exact source/wording guards, one on-demand JSON per matching lesson. */
export function manufacturingCalculation48Paragraph(lesson:ManufacturingLesson,id:string,locale:string,text:string|undefined):string|undefined{
 const key=lesson.id==='mfg1-mechanical-lesson-023'&&id==='example'?'density':lesson.id==='mfg1-electrical-l068'&&id==='section-1'?'resistivity':lesson.id==='mfg1-surface-lesson-028'&&id==='example'?'faraday':null;
 if(!key)return text;
 const d=draft(key),p=d.lessonPatch,target=own(p.wording,locale)?p.wording[locale]:undefined;
 return p.lessonId===lesson.id&&p.paragraphId===id&&p.sourceHash===lesson.sourceHash
  &&lesson.paragraphs.find(x=>x.id===id)?.textJa===p.wording.ja?.before&&p.wording.ja?.after===d.canonicalTaughtAfter
  &&target&&text===target.before&&typeof target.after==='string'&&!!target.after.trim()?target.after:text;
}
export function manufacturingCalculation48Exams(specialty:Specialty):ManufacturingExam[]{
 const d=draft(specialty==='mechanical'?'density':specialty==='electrical'?'resistivity':'faraday');
 if(!current(d))return [];
 return [{id:d.id,revision:d.revision,titleJa:d.titleJa,kind:'weekly',officialSimulation:false,weekId:d.id,
  questions:d.questions.map(q=>({...q,optionsJa:[...q.optionsJa],optionReasonsJa:[...q.optionReasonsJa],sources:q.sources.map(s=>({...s}))}))}];
}
export function manufacturingCalculation48Translation(q:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 if(locale==='ja')return null;
 const key=q.id.startsWith('mfg1-calc48-density-')?'density':q.id.startsWith('mfg1-calc48-resistivity-')?'resistivity':q.id.startsWith('mfg1-calc48-faraday-')?'faraday':null;
 if(!key)return null;
 const d=draft(key),original=d.questions.find(x=>x.id===q.id);
 if(!current(d)||!original||JSON.stringify(original)!==JSON.stringify(q))return null;
 const bank=own(d.locales,locale)?d.locales[locale]:undefined,t=bank&&own(bank,q.id)?bank[q.id]:undefined;
 return t&&t.sourceHash===q.sourceHash&&typeof t.stem==='string'&&!!t.stem.trim()
  &&Array.isArray(t.options)&&t.options.length===q.optionsJa.length&&t.options.every(s=>typeof s==='string'&&!!s.trim())
  &&Array.isArray(t.reasons)&&t.reasons.length===q.optionsJa.length&&t.reasons.every(s=>typeof s==='string'&&!!s.trim())
  ? {...t,options:[...t.options],reasons:[...t.reasons]}:null;
}
