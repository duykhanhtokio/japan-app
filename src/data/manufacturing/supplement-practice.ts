import {manufacturingSource61Exams,manufacturingSource61Translation} from './source61-assessments';
import {manufacturingSource63Exams,manufacturingSource63Translation} from './source63-drawing';
import {manufacturingSource62Exams,manufacturingSource62Translation} from './source62-bounded';
import type {ManufacturingExam,ManufacturingQuestion,Specialty} from './index';
import type {QuestionTranslation} from './translations';
import {manufacturingSourceGuides} from './source-guides';
import {manufacturingBooleanPracticeExams,manufacturingBooleanPracticeTranslation} from './boolean-practice';
import {manufacturingToleranceExams,manufacturingToleranceTranslation} from './tolerance-practice';
import {manufacturingQcPlanExams,manufacturingQcPlanTranslation} from './qc-plan-practice';
import {manufacturingEnergyExams,manufacturingEnergyTranslation} from './energy-practice';
import {manufacturingSequentialExams,manufacturingSequentialTranslation} from './sequential-practice';
import {manufacturingSource60Exams,manufacturingSource60Translation} from './source60-buff';
import {manufacturingSource57Exams,manufacturingSource57Translation} from './source57-mechanical';
import {manufacturingSource55Exams,manufacturingSource55Translation} from './source55-mean-comparison';
import {manufacturingSource52Exams,manufacturingSource52Translation} from './source52-thermal';
import {manufacturingCalculation48Exams,manufacturingCalculation48Translation} from './calculation48';

type DraftQuestion={id:string;guideParagraphId:string;correctIndex:number;stemJa:string;optionsJa:string[];explanationJa:string;sourceHash:string};
type Draft={id:string;revision:string;guideId:string;guideSourceHash:string;titleJa:string;questions:DraftQuestion[];locales:Record<string,[string,string[],string][]>;localeSourceHashes:Record<string,string[]>;reasonPrefixes:Record<string,[string,string]>};
let cached:Draft|null=null;
function draft():Draft{return cached??(cached=require('./supplement-practice.json') as Draft);}
function currentGuide(){const d=draft();return manufacturingSourceGuides('mechanical').find(g=>g.id===d.guideId&&g.sourceHash===d.guideSourceHash);}
/** An additive formative check. Existing weekly checks and saved attempts retain their identities. */
export function manufacturingSupplementExams(specialty:Specialty):ManufacturingExam[]{
 if(specialty==='electrical')return [...manufacturingSource61Exams(specialty),...manufacturingSource62Exams(specialty),...manufacturingBooleanPracticeExams(specialty),...manufacturingEnergyExams(specialty),...manufacturingSequentialExams(specialty),...manufacturingCalculation48Exams(specialty),...manufacturingSource52Exams(specialty)];
 if(specialty!=='mechanical')return [...manufacturingSource61Exams(specialty),...manufacturingSource62Exams(specialty),...manufacturingSource60Exams(specialty),...manufacturingCalculation48Exams(specialty),...manufacturingSource55Exams(specialty)];
 const tolerance=[...manufacturingSource63Exams(specialty),...manufacturingSource61Exams(specialty),...manufacturingSource62Exams(specialty),...manufacturingSource57Exams(specialty),...manufacturingToleranceExams(specialty),...manufacturingQcPlanExams(specialty),...manufacturingCalculation48Exams(specialty)],d=draft(),guide=currentGuide();if(!guide)return tolerance;
 return [{id:d.id,revision:d.revision,titleJa:d.titleJa,kind:'weekly',officialSimulation:false,weekId:'supplement-caliper',questions:d.questions.map(q=>({id:q.id,sourceHash:q.sourceHash,lessonId:guide.id,stemJa:q.stemJa,optionsJa:q.optionsJa,correctIndex:q.correctIndex,optionReasonsJa:q.optionsJa.map((_,i)=>(i===q.correctIndex?'正解です。':'この選択肢は適切ではありません。')+q.explanationJa),sources:guide.sources}))},...tolerance];
}
/** No fallback to another target language; suppress entries when the source guide or question is stale. */
export function manufacturingSupplementTranslation(question:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 if(question.id.startsWith('mfg1-source63-'))return manufacturingSource63Translation(question,locale);
 if(question.id.startsWith('mfg1-source61-'))return manufacturingSource61Translation(question,locale);
 if(question.id.startsWith('mfg1-source62-'))return manufacturingSource62Translation(question,locale);
 if(question.id.startsWith('mfg1-source60-'))return manufacturingSource60Translation(question,locale);
 if(question.id.startsWith('mfg1-source57-'))return manufacturingSource57Translation(question,locale);
 if(question.id.startsWith('mfg1-source55-mean-'))return manufacturingSource55Translation(question,locale);
 if(question.id.startsWith('mfg1-source52-thermal-'))return manufacturingSource52Translation(question,locale);
 if(question.id.startsWith('mfg1-calc48-'))return manufacturingCalculation48Translation(question,locale);
 if(question.id.startsWith('mfg1-sequential-'))return manufacturingSequentialTranslation(question,locale);
 if(question.id.startsWith('mfg1-energy-check-'))return manufacturingEnergyTranslation(question,locale);
 if(question.id.startsWith('mfg1-qc-plan-check-'))return manufacturingQcPlanTranslation(question,locale);
 if(question.id.startsWith('mfg1-tolerance-class-check-'))return manufacturingToleranceTranslation(question,locale);
 if(question.id.startsWith('mfg1-boolean-distributivity-check-'))return manufacturingBooleanPracticeTranslation(question,locale);
 if(!question.id.startsWith('mfg1-caliper-supplement-check-')||locale==='ja')return null;
 const d=draft();if(!currentGuide())return null;
 const index=d.questions.findIndex(q=>q.id===question.id&&q.sourceHash===question.sourceHash),entry=d.locales[locale]?.[index];
 const prefixes=d.reasonPrefixes[locale];
 return entry&&prefixes&&d.localeSourceHashes[locale]?.[index]===question.sourceHash?{sourceHash:question.sourceHash,stem:entry[0],options:entry[1],reasons:entry[1].map((_,i)=>prefixes[i===question.correctIndex?0:1]+entry[2])}:null;
}
