import type {ManufacturingExam,ManufacturingQuestion,ManufacturingLesson,Specialty} from './index';
import type {QuestionTranslation} from './translations';
type Binding={lessonId:string;paragraphId:string;lessonSourceHash:string;rawJapanese:string;effectiveJapanese:string;effectiveJapaneseSha256:string};
type Row={specialty:Specialty;id:string;revision:string;titleJa:string;teachingBinding:Binding;question:ManufacturingQuestion;locales:Record<string,QuestionTranslation>};
let payload:{rows:Row[]}|undefined;
const rows=()=> (payload??(payload=require('./source61-assessments.json') as {rows:Row[]})).rows;
function current(row:Row):boolean{
 const b=row.teachingBinding,lesson=(require('./index').loadManufacturingCourse(row.specialty).lessons as ManufacturingLesson[]).find(l=>l.id===b.lessonId);
 return !!lesson&&lesson.sourceHash===b.lessonSourceHash&&lesson.paragraphs.find(p=>p.id===b.paragraphId)?.textJa===b.rawJapanese
  &&require('./lesson-editorial').manufacturingLessonParagraph(lesson,b.paragraphId,'ja',b.rawJapanese)===b.effectiveJapanese;
}
/** Additive, source-bound checks; original weekly IDs and progress remain unchanged. */
export function manufacturingSource61Exams(specialty:Specialty):ManufacturingExam[]{
 return rows().filter(r=>r.specialty===specialty&&current(r)).map(r=>({id:r.id,revision:r.revision,titleJa:r.titleJa,kind:'weekly',officialSimulation:false,weekId:r.id,questions:[{...r.question,optionsJa:[...r.question.optionsJa],optionReasonsJa:[...r.question.optionReasonsJa],sources:r.question.sources.map(s=>({...s}))}]}));
}
/** A stale question or source paragraph suppresses targets; no locale fallback. */
export function manufacturingSource61Translation(q:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 if(!q.id.startsWith('mfg1-source61-')||locale==='ja')return null;
 const row=rows().find(r=>r.question.id===q.id);
 if(!row||!current(row)||JSON.stringify(q)!==JSON.stringify(row.question)||!Object.prototype.hasOwnProperty.call(row.locales,locale))return null;
 const t=row.locales[locale];return t?.sourceHash===q.sourceHash&&typeof t.stem==='string'&&!!t.stem.trim()&&t.options?.length===4&&t.reasons?.length===4&&[...t.options,...t.reasons].every(s=>typeof s==='string'&&!!s.trim())?{...t,options:[...t.options],reasons:[...t.reasons]}:null;
}
