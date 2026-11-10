import type {ManufacturingQuestion} from './index';
import type {QuestionTranslation} from './translations';

type Ruby={text:string;reading?:string};
type Patch={questionId:string;sourceHash:string;before:string;after:string;ruby:Ruby[];translations:Record<string,{before:string;after:string}>};
let patch:Patch|null=null;
const revision=()=>patch??(patch=require('./question-editorial.json') as Patch);
function matching(question:ManufacturingQuestion):boolean{
 const p=revision();
 return question.id===p.questionId&&question.sourceHash===p.sourceHash&&question.correctIndex===0
   &&question.optionsJa.length===2&&question.optionsJa[0]==='正しい'&&question.optionsJa[1]==='誤り'
   &&typeof p.after==='string'&&p.after.trim().length>0;
}
/** Clarify segregation of suspect goods, preserving the frozen source and grading identities. */
export function revisedManufacturingMockQuestion(question:ManufacturingQuestion):ManufacturingQuestion{
 if(!matching(question)||question.stemJa!==revision().before)return question;
 return {...question,stemJa:revision().after};
}
export function revisedManufacturingMockStemTranslation(question:ManufacturingQuestion,locale:string,entry:QuestionTranslation):QuestionTranslation{
 const p=revision(),wording=Object.prototype.hasOwnProperty.call(p.translations,locale)?p.translations[locale]:undefined;
 if(!matching(question)||question.stemJa!==p.after||entry.sourceHash!==p.sourceHash||!wording
   ||entry.stem!==wording.before||typeof wording.after!=='string'||!wording.after.trim())return entry;
 return {...entry,stem:wording.after};
}
export function revisedManufacturingMockStemRuby(question:ManufacturingQuestion,parts:Ruby[]|undefined):Ruby[]|undefined{
 const p=revision();
 if(!matching(question)||question.stemJa!==p.after||!Array.isArray(parts)||parts.map(x=>x.text).join('')!==p.before
   ||!Array.isArray(p.ruby)||!p.ruby.every(x=>typeof x.text==='string'&&(!x.reading||typeof x.reading==='string'))
   ||p.ruby.map(x=>x.text).join('')!==p.after)return parts;
 return p.ruby.map(x=>({...x}));
}
