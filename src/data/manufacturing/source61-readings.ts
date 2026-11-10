import type {ManufacturingLesson,ManufacturingQuestion} from './index';
import type {Source49Segment} from './source49-readings';
type Data={questions:{question:ManufacturingQuestion;reading:{stem:string;options:string[];reasons:string[]}}[];paragraph:{lessonId:string;paragraphId:string;sourceHash:string;text:string;ruby:Source49Segment[]}};
let cached:Data|undefined;
const ids=['mfg1-mechanical-completion37-q0504','mfg1-electrical-weekly-14-q03','mfg1-surface-weekly-02-q06','mfg1-surface-completion37-check-002-q01'];
const data=():Data=>cached??(cached=require('./source61-readings.json') as Data);
/** Display-only readings; canonical graded questions and saved attempts are unchanged. */
export function manufacturingSource61QuestionText(q:ManufacturingQuestion,field:'stem'|'option'|'reason',index?:number):string|null{
 if(!ids.includes(q.id))return null;
 const row=data().questions.find(r=>r.question.id===q.id);
 if(!row||JSON.stringify(q)!==JSON.stringify(row.question))return null;
 if(field==='stem')return row.reading.stem;
 if(!Number.isInteger(index)||index===undefined||index<0||index>=q.optionsJa.length)return null;
 return (field==='option'?row.reading.options:row.reading.reasons)[index]??null;
}
export function manufacturingSource61Reading(lesson:ManufacturingLesson,id:string,text:string|undefined):Source49Segment[]|undefined{
 if(lesson.id!=='mfg1-mechanical-lesson-080'||id!=='section-2')return;
 const p=data().paragraph;
 if(p.lessonId!==lesson.id||p.paragraphId!==id||p.sourceHash!==lesson.sourceHash||text!==p.text||require('./source47-clarification.json').wording.ja.after!==text)return;
 if(p.ruby.map(s=>s.text).join('')!==text||p.ruby.some(s=>/[一-龯々]/.test(s.text)&&(!s.reading||!/^[ぁ-ゖー]+$/.test(s.reading))))return;
 return p.ruby.map(s=>({...s}));
}
