import type {ManufacturingLesson} from './index';
export type Source49Segment={text:string;reading?:string};
type Payload={lessonId:string;paragraphId:string;sourceHash:string;wording:{ja:{before:string;after:string;ruby:Source49Segment[]}}};
let payload:Payload|undefined;
/** New source49 text only; unrelated readers never initialize its payload. */
export function manufacturingSource49Reading(lesson:ManufacturingLesson,paragraphId:string,text:string|undefined):Source49Segment[]|undefined {
 if(['mfg1-surface-lesson-008','mfg1-surface-lesson-061'].includes(lesson.id))return require('./source60-buff').manufacturingSource60Reading(lesson,paragraphId,text);
 if(['mfg1-mechanical-lesson-072','mfg1-mechanical-lesson-041','mfg1-mechanical-lesson-049'].includes(lesson.id))return require('./source57-mechanical').manufacturingSource57Reading(lesson,paragraphId,text);
 if(lesson.id==='mfg1-electrical-l043')return require('./source50-overview').manufacturingSource50Reading(lesson,paragraphId,text);
 if(lesson.id!=='mfg1-electrical-l094'||paragraphId!=='section-2'||typeof text!=='string')return undefined;
 // eslint-disable-next-line @typescript-eslint/no-require-imports -- Scope to one source-bound paragraph.
 const p=payload??(payload=require('./source49-thermal-clarification.json') as Payload);
 const ja=p.wording.ja;
 if(p.sourceHash!==lesson.sourceHash||p.lessonId!==lesson.id||p.paragraphId!==paragraphId||text!==ja.after||lesson.paragraphs.find(x=>x.id===paragraphId)?.textJa!==ja.before)return undefined;
 if(!Array.isArray(ja.ruby)||ja.ruby.map(s=>s.text).join('')!==text)return undefined;
 if(ja.ruby.some(s=>/[一-龯々]/.test(s.text)&&(!s.reading||!/^[ぁ-ゖー]+$/.test(s.reading))))return undefined;
 return ja.ruby;
}
