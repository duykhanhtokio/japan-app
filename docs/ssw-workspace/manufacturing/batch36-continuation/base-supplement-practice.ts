import type {ManufacturingExam,ManufacturingQuestion,Specialty} from './index';
import type {QuestionTranslation} from './translations';
import {manufacturingSourceGuides} from './source-guides';

type DraftQuestion={id:string;guideParagraphId:string;correctIndex:number;stemJa:string;optionsJa:string[];explanationJa:string;sourceHash:string};
type Draft={id:string;revision:string;guideId:string;guideSourceHash:string;titleJa:string;questions:DraftQuestion[];locales:Record<string,[string,string[],string][]>;localeSourceHashes:Record<string,string[]>;reasonPrefixes:Record<string,[string,string]>};
let cached:Draft|null=null;
function draft():Draft{return cached??(cached=require('./supplement-practice.json') as Draft);}
function currentGuide(){const d=draft();return manufacturingSourceGuides('mechanical').find(g=>g.id===d.guideId&&g.sourceHash===d.guideSourceHash);}
/** An additive formative check. Existing weekly checks and saved attempts retain their identities. */
export function manufacturingSupplementExams(specialty:Specialty):ManufacturingExam[]{
 if(specialty!=='mechanical')return [];
 const d=draft(),guide=currentGuide();if(!guide)return [];
 return [{id:d.id,revision:d.revision,titleJa:d.titleJa,kind:'weekly',officialSimulation:false,weekId:'supplement-caliper',questions:d.questions.map(q=>({id:q.id,sourceHash:q.sourceHash,lessonId:guide.id,stemJa:q.stemJa,optionsJa:q.optionsJa,correctIndex:q.correctIndex,optionReasonsJa:q.optionsJa.map((_,i)=>(i===q.correctIndex?'正解です。':'この選択肢は適切ではありません。')+q.explanationJa),sources:guide.sources}))}];
}
/** No fallback to another target language; suppress entries when the source guide or question is stale. */
export function manufacturingSupplementTranslation(question:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 if(!question.id.startsWith('mfg1-caliper-supplement-check-')||locale==='ja')return null;
 const d=draft();if(!currentGuide())return null;
 const index=d.questions.findIndex(q=>q.id===question.id&&q.sourceHash===question.sourceHash),entry=d.locales[locale]?.[index];
 const prefixes=d.reasonPrefixes[locale];
 return entry&&prefixes&&d.localeSourceHashes[locale]?.[index]===question.sourceHash?{sourceHash:question.sourceHash,stem:entry[0],options:entry[1],reasons:entry[1].map((_,i)=>prefixes[i===question.correctIndex?0:1]+entry[2])}:null;
}
