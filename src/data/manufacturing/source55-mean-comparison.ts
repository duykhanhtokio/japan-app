import type {ManufacturingExam,ManufacturingQuestion,ManufacturingLesson,Specialty} from './index';
import type {QuestionTranslation} from './translations';
type Draft={id:string;revision:string;titleJa:string;teachingBinding:{packId:string;captionSourceHash:string;canonicalCaptionJa:string;lessonSourceHash:string};questions:ManufacturingQuestion[];locales:Record<string,Record<string,QuestionTranslation>>};
let payload:Draft|undefined;
const data=():Draft=>payload??(payload=require('./source55-mean-comparison.json') as Draft);
function current(d:Draft):boolean{
 const b=d.teachingBinding,pack=require('./recognition38').manufacturingRecognitionPacks().find((p:{id:string})=>p.id===b.packId);
 const lesson=(require('./surface.json').lessons as ManufacturingLesson[]).find(l=>l.id==='mfg1-surface-lesson-063');
 return !!lesson&&lesson.sourceHash===b.lessonSourceHash&&!!pack&&pack.captionSourceHash===b.captionSourceHash&&pack.captionJa===b.canonicalCaptionJa;
}
export function manufacturingSource55Exams(specialty:Specialty):ManufacturingExam[]{
 if(specialty!=='surface')return [];
 const d=data();if(!current(d))return [];
 return [{id:d.id,revision:d.revision,titleJa:d.titleJa,kind:'weekly',officialSimulation:false,weekId:d.id,questions:d.questions.map(q=>({...q,optionsJa:[...q.optionsJa],optionReasonsJa:[...q.optionReasonsJa],sources:q.sources.map(s=>({...s}))}))}];
}
export function manufacturingSource55Translation(q:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 if(!q.id.startsWith('mfg1-source55-mean-')||locale==='ja')return null;
 const d=data(),original=d.questions.find(x=>x.id===q.id);
 if(!current(d)||!original||JSON.stringify(q)!==JSON.stringify(original)||!Object.prototype.hasOwnProperty.call(d.locales,locale))return null;
 const bank=d.locales[locale];if(!Object.prototype.hasOwnProperty.call(bank,q.id))return null;
 const t=bank[q.id];return t?.sourceHash===q.sourceHash&&typeof t.stem==='string'&&!!t.stem.trim()&&t.options?.length===4&&t.reasons?.length===4&&[...t.options,...t.reasons].every(s=>typeof s==='string'&&!!s.trim())?{...t,options:[...t.options],reasons:[...t.reasons]}:null;
}
