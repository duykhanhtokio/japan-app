import type {ManufacturingExam,ManufacturingQuestion,ManufacturingLesson,Specialty} from './index';
import type {QuestionTranslation} from './translations';
type Draft={id:string;revision:string;titleJa:string;teachingBinding:{lessonId:string;paragraphId:string;sourceHash:string;effectiveJapaneseSha256:string;canonicalTaughtAfter:string};questions:ManufacturingQuestion[];locales:Record<string,Record<string,QuestionTranslation>>};
let payload:Draft|undefined;
function data():Draft{return payload??(payload=require('./source52-thermal.json') as Draft);}
function current(d:Draft):boolean{
 const b=d.teachingBinding,lesson=(require('./electrical.json').lessons as ManufacturingLesson[]).find(l=>l.id===b.lessonId&&l.sourceHash===b.sourceHash);
 const p=require('./source49-thermal-clarification.json');
 return !!lesson&&p.lessonId===b.lessonId&&p.paragraphId===b.paragraphId&&p.sourceHash===b.sourceHash&&p.effectiveJapaneseSha256===b.effectiveJapaneseSha256&&p.wording.ja.after===b.canonicalTaughtAfter&&lesson.paragraphs.find(x=>x.id===b.paragraphId)?.textJa===p.wording.ja.before;
}
export function manufacturingSource52Exams(specialty:Specialty):ManufacturingExam[]{
 if(specialty!=='electrical')return [];
 const d=data();if(!current(d))return [];
 return [{id:d.id,revision:d.revision,titleJa:d.titleJa,kind:'weekly',officialSimulation:false,weekId:d.id,questions:d.questions.map(q=>({...q,optionsJa:[...q.optionsJa],optionReasonsJa:[...q.optionReasonsJa],sources:q.sources.map(s=>({...s}))}))}];
}
export function manufacturingSource52Translation(q:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 if(!q.id.startsWith('mfg1-source52-thermal-')||locale==='ja')return null;
 const d=data(),original=d.questions.find(x=>x.id===q.id);
 if(!current(d)||!original||JSON.stringify(q)!==JSON.stringify(original)||!Object.prototype.hasOwnProperty.call(d.locales,locale))return null;
 const bank=d.locales[locale];if(!Object.prototype.hasOwnProperty.call(bank,q.id))return null;
 const t=bank[q.id];return t?.sourceHash===q.sourceHash&&typeof t.stem==='string'&&!!t.stem.trim()&&t.options?.length===4&&t.reasons?.length===4&&[...t.options,...t.reasons].every(s=>typeof s==='string'&&!!s.trim())?{...t,options:[...t.options],reasons:[...t.reasons]}:null;
}
