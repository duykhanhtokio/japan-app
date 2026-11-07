import type {ManufacturingExam,ManufacturingQuestion,ManufacturingLesson,Specialty} from './index';
import type {QuestionTranslation} from './translations';
import type {Source49Segment} from './source49-readings';
type Wording={before:string;after:string;effectiveJapaneseSha256?:string;ruby?:Source49Segment[]};
type Row={image?:{path:string;sha256:string;width:number;height:number};teachingMode?:string;key:string;revision:string;lessonId:string;paragraphId:string;sourceHash:string;canonicalTaughtAfter:string;effectiveJapaneseSha256:string;wording:Record<string,Wording>;titleJa:string;question:ManufacturingQuestion;locales:Record<string,QuestionTranslation>};
let payload:{rows:Row[]}|undefined;
const ids=['mfg1-surface-lesson-008','mfg1-surface-lesson-061'];
function rows():Row[]{return (payload??(payload=require('./source60-buff.json') as {rows:Row[]})).rows;}
function current(row:Row,lesson?:ManufacturingLesson):boolean{
 const source=lesson??(require('./surface.json').lessons as ManufacturingLesson[]).find(l=>l.id===row.lessonId);
 return !!source&&source.id===row.lessonId&&source.sourceHash===row.sourceHash&&source.paragraphs.find(p=>p.id===row.paragraphId)?.textJa===row.wording.ja.before
  &&row.wording.ja.after===row.canonicalTaughtAfter&&(row.teachingMode==='existing'?row.canonicalTaughtAfter===row.wording.ja.before:row.canonicalTaughtAfter.startsWith(row.wording.ja.before+'\n'));
}
export function manufacturingSource60Paragraph(lesson:ManufacturingLesson,id:string,locale:string,text:string|undefined):string|undefined{
 if(!ids.includes(lesson.id))return text;
 const row=rows().find(r=>r.lessonId===lesson.id&&r.paragraphId===id);
 if(!row||row.teachingMode==='existing'||!current(row,lesson)||!Object.prototype.hasOwnProperty.call(row.wording,locale))return text;
 const w=row.wording[locale];
 return text===w.before&&w.after.startsWith(w.before+'\n')&&(locale==='ja'||w.effectiveJapaneseSha256===row.effectiveJapaneseSha256)?w.after:text;
}
export function manufacturingSource60Reading(lesson:ManufacturingLesson,id:string,text:string|undefined):Source49Segment[]|undefined{
 if(!ids.includes(lesson.id))return;
 const row=rows().find(r=>r.lessonId===lesson.id&&r.paragraphId===id);
 if(!row||row.teachingMode==='existing'||!current(row,lesson)||text!==row.canonicalTaughtAfter)return;
 const ruby=row.wording.ja.ruby;
 if(!ruby||ruby[0]?.text!==row.wording.ja.before||ruby.map(s=>s.text).join('')!==text||ruby.slice(1).some(s=>/[一-龯々]/.test(s.text)&&(!s.reading||!/^[ぁ-ゖー]+$/.test(s.reading))))return;
 return ruby.map(s=>({...s}));
}
export function manufacturingSource60Exams(specialty:Specialty):ManufacturingExam[]{
 if(specialty!=='surface')return [];
 return rows().filter(r=>current(r)).map(r=>({id:'mfg1-surface-source60-'+r.key+'-check',revision:r.revision,titleJa:r.titleJa,kind:'weekly',officialSimulation:false,weekId:'source60-'+r.key,questions:[{...r.question,optionsJa:[...r.question.optionsJa],optionReasonsJa:[...r.question.optionReasonsJa],sources:r.question.sources.map(s=>({...s}))}]}));
}
export function manufacturingSource60Translation(q:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 if(!q.id.startsWith('mfg1-source60-')||locale==='ja')return null;
 const row=rows().find(r=>r.question.id===q.id);
 if(!row||!current(row)||JSON.stringify(q)!==JSON.stringify(row.question)||!Object.prototype.hasOwnProperty.call(row.locales,locale))return null;
 const t=row.locales[locale];return t?.sourceHash===q.sourceHash&&typeof t.stem==='string'&&!!t.stem.trim()&&t.options?.length===4&&t.reasons?.length===4&&[...t.options,...t.reasons].every(s=>typeof s==='string'&&!!s.trim())?{...t,options:[...t.options],reasons:[...t.reasons]}:null;
}


/** Literal caller asset identity; metadata cannot silently retarget a different raster. */
const acceptedFigure={"path":"assets/manufacturing/source60/buff-roles.png","sha256":"977c9a16741ba8df84f65f8632ac2d914c57ff1add7e03f819a787138ac0991e","width":1200,"height":680};
/** No target-language fallback; figure captions use the checked paragraph extension. */
export function manufacturingSource60Figure(lesson:ManufacturingLesson,locale:string):{image:NonNullable<Row['image']>;captionJa:string;caption:string|null;captionRuby?:Source49Segment[]}|null{
 if(lesson.id!=='mfg1-surface-lesson-008')return null;
 const row=rows().find(r=>r.key==='definition');
 if(!row||!row.image||!current(row,lesson))return null;
 if(row.image.path!==acceptedFigure.path||row.image.sha256!==acceptedFigure.sha256||row.image.width!==acceptedFigure.width||row.image.height!==acceptedFigure.height)return null;
 const ja=row.wording.ja,target=Object.prototype.hasOwnProperty.call(row.wording,locale)?row.wording[locale]:undefined;
 const captionJa=ja.after.slice(ja.before.length+1),fullRuby=manufacturingSource60Reading(lesson,row.paragraphId,row.canonicalTaughtAfter);
 const captionRuby=fullRuby?.[1]?.text==='\n'&&fullRuby.slice(2).map(p=>p.text).join('')===captionJa?fullRuby.slice(2):undefined;
 const translated=locale!=='ja'&&target?.effectiveJapaneseSha256===row.effectiveJapaneseSha256&&typeof target.before==='string'&&typeof target.after==='string'&&target.after.startsWith(target.before+'\n')?target.after.slice(target.before.length+1):null;
 return {image:{...row.image},captionJa,caption:translated?.trim()?translated:null,captionRuby};
}
