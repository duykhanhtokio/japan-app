import type {ManufacturingExam,ManufacturingQuestion,ManufacturingLesson,Specialty} from './index';
import type {QuestionTranslation} from './translations';
type Binding={lessonId:string;paragraphId:string;lessonSourceHash:string;rawJapanese:string;effectiveJapanese:string};
type Row={id:string;revision:string;titleJa:string;teachingBinding:Binding;additionalTeachingBindings?:Binding[];question:ManufacturingQuestion;locales:Record<string,QuestionTranslation>};
let payload:{rows:Row[]}|undefined;
const rows=()=> (payload??(payload=require('./source63-drawing.json') as {rows:Row[]})).rows;
function current(row:Row):boolean{
 return [row.teachingBinding,...(row.additionalTeachingBindings??[])].every(b=>{
  const lesson=(require('./index').loadManufacturingCourse('mechanical').lessons as ManufacturingLesson[]).find(l=>l.id===b.lessonId);
  return !!lesson&&lesson.sourceHash===b.lessonSourceHash&&lesson.paragraphs.find(p=>p.id===b.paragraphId)?.textJa===b.rawJapanese
   &&require('./lesson-editorial').manufacturingLessonParagraph(lesson,b.paragraphId,'ja',b.rawJapanese)===b.effectiveJapanese;
 });
}
/** Source-backed assessment repairs; existing lessons, questions and attempt IDs stay intact. */
export function manufacturingSource63Exams(specialty:Specialty):ManufacturingExam[]{
 if(specialty!=='mechanical')return [];
 return rows().filter(current).map(r=>({id:r.id,revision:r.revision,titleJa:r.titleJa,kind:'weekly',officialSimulation:false,weekId:r.id,questions:[{...r.question,optionsJa:[...r.question.optionsJa],optionReasonsJa:[...r.question.optionReasonsJa],sources:r.question.sources.map(s=>({...s}))}]}));
}
/** Reject stale source, changed question or unknown locale instead of returning a fallback. */
export function manufacturingSource63Translation(q:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 if(!q.id.startsWith('mfg1-source63-')||locale==='ja')return null;
 const row=rows().find(r=>r.question.id===q.id);
 if(!row||!current(row)||JSON.stringify(q)!==JSON.stringify(row.question)||!Object.prototype.hasOwnProperty.call(row.locales,locale))return null;
 const t=row.locales[locale];return t?.sourceHash===q.sourceHash&&typeof t.stem==='string'&&!!t.stem.trim()&&t.options?.length===4&&t.reasons?.length===4&&[...t.options,...t.reasons].every(s=>typeof s==='string'&&!!s.trim())?{...t,options:[...t.options],reasons:[...t.reasons]}:null;
}
