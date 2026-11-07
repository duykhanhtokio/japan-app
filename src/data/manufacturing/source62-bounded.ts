import type {ManufacturingExam,ManufacturingLesson,ManufacturingQuestion,Specialty} from './index';
import type {QuestionTranslation} from './translations';
import type {Source49Segment} from './source49-readings';
type Wording={before:string;after:string;effectiveJapaneseSha256?:string;ruby?:Source49Segment[]};
type Row={teachingReference?:'source47'|'source62-white';teachingMode:'existing'|'extension';specialty:Specialty;key:string;lessonId:string;paragraphId:string;sourceHash:string;canonicalTaughtAfter:string;effectiveJapaneseSha256:string;wording:Record<string,Wording>;revision:string;titleJa:string;question:ManufacturingQuestion;locales:Record<string,QuestionTranslation>;image?:{path:string;sha256:string;width:number;height:number}};
let payload:{rows:Row[]}|undefined;
const rows=():Row[]=>(payload??(payload=require('./source62-bounded.json') as {rows:Row[]})).rows;
function current(row:Row,lesson?:ManufacturingLesson):boolean{
 const l=lesson??(require(row.specialty==='electrical'?'./electrical.json':row.specialty==='mechanical'?'./mechanical.json':'./surface.json').lessons as ManufacturingLesson[]).find(l=>l.id===row.lessonId);
 let canonical=row.teachingMode==='existing'?require('./source49-thermal-clarification.json').wording.ja.after:row.wording.ja.after;
 if(row.teachingReference==='source47')canonical=require('./source47-clarification.json').wording.ja.after;
 if(row.teachingReference==='source62-white'){const base=rows().find(r=>r.key==='white');if(!base||!current(base,l))return false;canonical=base.canonicalTaughtAfter;}
 return !!l&&l.id===row.lessonId&&l.sourceHash===row.sourceHash&&l.paragraphs.find(p=>p.id===row.paragraphId)?.textJa===row.wording.ja.before&&canonical===row.canonicalTaughtAfter&&row.wording.ja.after===canonical&&canonical.startsWith(row.wording.ja.before+'\n');
}
export function manufacturingSource62Exams(specialty:Specialty):ManufacturingExam[]{
 return rows().filter(r=>r.specialty===specialty&&current(r)).map(r=>({id:'mfg1-'+specialty+'-source62-'+r.key+'-check',revision:r.revision,titleJa:r.titleJa,kind:'weekly',officialSimulation:false,weekId:'source62-'+r.key,questions:[{...r.question,optionsJa:[...r.question.optionsJa],optionReasonsJa:[...r.question.optionReasonsJa],sources:r.question.sources.map(s=>({...s}))}]}));
}
export function manufacturingSource62Translation(q:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 if(!q.id.startsWith('mfg1-source62-')||locale==='ja')return null;
 const r=rows().find(r=>r.question.id===q.id);
 if(!r||!current(r)||JSON.stringify(q)!==JSON.stringify(r.question)||!Object.prototype.hasOwnProperty.call(r.locales,locale))return null;
 const t=r.locales[locale];return t?.sourceHash===q.sourceHash&&t.stem.trim()&&t.options.length===4&&t.reasons.length===4&&[...t.options,...t.reasons].every(x=>x.trim())?{...t,options:[...t.options],reasons:[...t.reasons]}:null;
}
export function manufacturingSource62Paragraph(lesson:ManufacturingLesson,id:string,locale:string,text:string|undefined):string|undefined{
 if(lesson.id!=='mfg1-surface-lesson-013'||id!=='section-2')return text;
 const r=rows().find(r=>r.key==='white');if(!r||!current(r,lesson)||!Object.prototype.hasOwnProperty.call(r.wording,locale))return text;
 const w=r.wording[locale];return text===w.before&&w.after.startsWith(w.before+'\n')&&(locale==='ja'||w.effectiveJapaneseSha256===r.effectiveJapaneseSha256)?w.after:text;
}
export function manufacturingSource62Reading(lesson:ManufacturingLesson,id:string,text:string|undefined):Source49Segment[]|undefined{
 if(lesson.id!=='mfg1-surface-lesson-013'||id!=='section-2')return;
 const r=rows().find(r=>r.key==='white'),ruby=r?.wording.ja.ruby;
 if(!r||!current(r,lesson)||text!==r.canonicalTaughtAfter||!ruby||ruby.map(s=>s.text).join('')!==text||ruby.some(s=>/[一-龯々]/.test(s.text)&&(!s.reading||!/^[ぁ-ゖー]+$/.test(s.reading))))return;
 return ruby.map(s=>({...s}));
}

/** Literal caller asset identity; metadata cannot silently retarget a different raster. */
const acceptedFigure={"path":"assets/manufacturing/source62/switch-roles.png","sha256":"a31c71c215dece7c5d51f35054dbba736388f7fe101af5481c140be82b17813b","width":1200,"height":680};
export function manufacturingSource62Figure(lesson:ManufacturingLesson,locale:string):{image:NonNullable<Row['image']>;captionJa:string;caption:string|null;captionRuby?:Source49Segment[]}|null{
 if(lesson.id!=='mfg1-electrical-l094')return null;
 const r=rows().find(r=>r.key==='reset');if(!r||!r.image||!current(r,lesson))return null;
 if(r.image.path!==acceptedFigure.path||r.image.sha256!==acceptedFigure.sha256||r.image.width!==acceptedFigure.width||r.image.height!==acceptedFigure.height)return null;
 const target=Object.prototype.hasOwnProperty.call(r.wording,locale)?r.wording[locale]:undefined;
 const captionRuby=require('./source49-readings').manufacturingSource49Reading(lesson,r.paragraphId,r.wording.ja.after) as Source49Segment[]|undefined;
 const caption=locale!=='ja'&&target?.effectiveJapaneseSha256===r.effectiveJapaneseSha256&&typeof target.before==='string'&&typeof target.after==='string'&&target.after.startsWith(target.before+'\n')&&target.after.slice(target.before.length+1).trim()?target.after:null;
 return {image:{...r.image},captionJa:r.wording.ja.after,caption,captionRuby};
}
