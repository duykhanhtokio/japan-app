import type {ManufacturingQuestion,ManufacturingExam} from './index';
import type {ManufacturingMock} from '@/services/manufacturing-mock-state';
import type {QuestionTranslation} from './translations';
type Revision={before:ManufacturingQuestion;after:ManufacturingQuestion;ruby?:{stem:{text:string;reading?:string}[];options:{text:string;reading?:string}[][]}};
let revisions:Record<string,Revision>|null=null;
const own=(o:object,k:string)=>Object.prototype.hasOwnProperty.call(o,k);
function rows():Record<string,Revision>{return revisions??(revisions=require('./implementation40/questions.ja.json').questions);}
const ordered=(v:unknown):unknown=>Array.isArray(v)?v.map(ordered):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,ordered((v as Record<string,unknown>)[k])])):v;
const stable=(v:unknown):string=>JSON.stringify(ordered(v))??'null';
function entry(q:ManufacturingQuestion):Revision|null{const all=rows();return own(all,q.id)?all[q.id]:null;}
export function revisedQuestion40(q:ManufacturingQuestion):ManufacturingQuestion{const r=entry(q);return r&&stable(q)===stable(r.before)?r.after:q;}
export function originalQuestion40(q:ManufacturingQuestion):ManufacturingQuestion{const r=entry(q);return r&&stable(q)===stable(r.after)?r.before:q;}
const graded=(q:ManufacturingQuestion)=>stable({id:q.id,stemJa:q.stemJa,optionsJa:q.optionsJa,correctIndex:q.correctIndex});
/** Reason-only edits preserve valid answers; changed tasks invalidate only affected exams. */
export function revisedExam40<T extends ManufacturingExam>(exam:T):T{
 const questions=exam.questions.map(revisedQuestion40);if(questions.every((q,i)=>q===exam.questions[i]))return exam;
 const changed=questions.filter((q,i)=>graded(q)!==graded(exam.questions[i]));
 return {...exam,questions,revision:changed.length?exam.revision+'-mfg40-'+changed.map(q=>q.sourceHash).join('.'):exam.revision};
}
export function revisedMock40(exam:ManufacturingMock):ManufacturingMock{
 const theory=exam.sections.theory.questions.map(revisedQuestion40),practical=exam.sections.practical.questions.map(revisedQuestion40);
 const changed=[...theory.filter((q,i)=>graded(q)!==graded(exam.sections.theory.questions[i])),...practical.filter((q,i)=>graded(q)!==graded(exam.sections.practical.questions[i]))];
 if(theory.every((q,i)=>q===exam.sections.theory.questions[i])&&practical.every((q,i)=>q===exam.sections.practical.questions[i]))return exam;
 return {...exam,revision:changed.length?exam.revision+'-mfg40-'+changed.map(q=>q.sourceHash).join('.'):exam.revision,sections:{...exam.sections,theory:{...exam.sections.theory,questions:theory},practical:{...exam.sections.practical,questions:practical}}};
}
export function questionTranslation40(q:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 const r=entry(q);if(!r||stable(q)!==stable(r.after))return null;
 let file:{questions:Record<string,QuestionTranslation>}|null=null;
 switch(locale){case 'vi':file=require('./implementation40/vi.json');break;case 'en':file=require('./implementation40/en.json');break;case 'id':file=require('./implementation40/id.json');break;case 'zh-CN':file=require('./implementation40/zh-CN.json');break;case 'zh-TW':file=require('./implementation40/zh-TW.json');break;case 'hi':file=require('./implementation40/hi.json');break;case 'bn':file=require('./implementation40/bn.json');break;case 'ne':file=require('./implementation40/ne.json');break;case 'my':file=require('./implementation40/my.json');break;case 'th':file=require('./implementation40/th.json');break;case 'km':file=require('./implementation40/km.json');break;case 'tl':file=require('./implementation40/tl.json');break;}
 const t=file&&own(file.questions,q.id)?file.questions[q.id]:null;
 return t&&t.sourceHash===q.sourceHash&&t.stem.trim()&&t.options.length===q.optionsJa.length&&t.reasons.length===q.optionsJa.length&&t.options.every(x=>x.trim())&&t.reasons.every(x=>x.trim())?t:null;
}
export function questionRuby40(q:ManufacturingQuestion,field:'stem'|number){const r=entry(q);if(!r||stable(q)!==stable(r.after)||!r.ruby)return null;const parts=field==='stem'?r.ruby.stem:r.ruby.options[field],text=field==='stem'?q.stemJa:q.optionsJa[field];return parts&&parts.map(p=>p.text).join('')===text?parts:null;}
