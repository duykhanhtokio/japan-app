import type {ManufacturingExam,ManufacturingQuestion,ManufacturingLesson,Specialty} from './index';
import type {QuestionTranslation} from './translations';
type Binding={lessonId:string;paragraphId:string;lessonSourceHash:string;rawJapanese:string;effectiveJapanese:string};
type Row={id:string;revision:string;titleJa:string;teachingBinding:Binding;questions:ManufacturingQuestion[];locales:Record<string,Record<string,QuestionTranslation>>};
let payload:{rows:Row[]}|undefined;
const rows=()=> (payload??(payload=require('./source64-line-roles.json') as {rows:Row[]})).rows;
function current(row:Row):boolean{
 const b=row.teachingBinding,lesson=(require('./index').loadManufacturingCourse('mechanical').lessons as ManufacturingLesson[]).find(l=>l.id===b.lessonId);
 return !!lesson&&lesson.sourceHash===b.lessonSourceHash&&lesson.paragraphs.find(p=>p.id===b.paragraphId)?.textJa===b.rawJapanese
  &&require('./lesson-editorial').manufacturingLessonParagraph(lesson,b.paragraphId,'ja',b.rawJapanese)===b.effectiveJapanese;
}
/** Three bounded drawing-role repairs, independent of existing progress identities. */
export function manufacturingSource64Exams(specialty:Specialty):ManufacturingExam[]{
 if(specialty!=='mechanical')return [];
 return rows().filter(current).map(r=>({id:r.id,revision:r.revision,titleJa:r.titleJa,kind:'weekly',officialSimulation:false,weekId:r.id,questions:r.questions.map(q=>({...q,optionsJa:[...q.optionsJa],optionReasonsJa:[...q.optionReasonsJa],sources:q.sources.map(s=>({...s}))}))}));
}
/** Changed source/question or missing target suppresses translation; no fallback. */
export function manufacturingSource64Translation(q:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 if(!q.id.startsWith('mfg1-source64-')||locale==='ja')return null;
 const row=rows().find(r=>r.questions.some(v=>v.id===q.id));
 const original=row?.questions.find(v=>v.id===q.id);
 if(!row||!original||!current(row)||JSON.stringify(q)!==JSON.stringify(original)||!Object.prototype.hasOwnProperty.call(row.locales,locale))return null;
 const t=row.locales[locale][q.id];return t?.sourceHash===q.sourceHash&&typeof t.stem==='string'&&!!t.stem.trim()&&t.options?.length===4&&t.reasons?.length===4&&[...t.options,...t.reasons].every(s=>typeof s==='string'&&!!s.trim())?{...t,options:[...t.options],reasons:[...t.reasons]}:null;
}
