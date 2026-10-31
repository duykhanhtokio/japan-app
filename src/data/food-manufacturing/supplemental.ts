import part1 from './authoring-20261029/part1.json';
import part2 from './authoring-20261029/part2.json';
import part3 from './authoring-20261029/part3.json';
import part4 from './authoring-20261029/part4.json';
import part5 from './authoring-20261029/part5.json';
import part6 from './authoring-20261029/part6.json';
import type {FoodManufacturingLesson} from './index';
import type {RubySegment} from '@/types/japanese-ruby';

type LessonTranslation={sourceHash:string;title:string;objective:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>;activity:string;summary:string;terms:Record<string,string>};
type RawQuestion={id:string;level:string;knowledgeId:string;promptJa:string;optionsJa:string[];answerIndex:number;explanationJa:string;optionExplanationsJa:string[]};
type RawExam={id:string;level:string;kind:string;week:number;titleJa:string;revision?:string;questions:RawQuestion[]};
type QuestionTranslation={sourceHash:string;prompt:string;options:string[];explanation:string;optionExplanations:string[]};
type RubyEntry={sourceHash:string;fields:Record<string,RubySegment[]>};
type Part={lessons:FoodManufacturingLesson[];translations:Record<string,Record<string,LessonTranslation>>;ruby:{lessons:Record<string,RubyEntry>};exams?:RawExam[];testTranslations?:Record<string,{questions:Record<string,QuestionTranslation>;examTitles:Record<string,{sourceHash:string;title:string}>}>;questionRuby?:{questions:Record<string,RubyEntry>}};
const parts=[part1,part2,part3,part4,part5,part6] as unknown as Part[];
/** Source-audit additions are additive; existing lesson/question identities remain stable. */
export const supplementalLessons=parts.flatMap(part=>part.lessons);
export const supplementalExams=parts.flatMap(part=>part.exams??[]);
export const supplementalLessonRuby:Record<string,RubyEntry>=Object.assign({},...parts.map(part=>part.ruby.lessons));
export const supplementalQuestionRuby:Record<string,RubyEntry>=Object.assign({},...parts.map(part=>part.questionRuby?.questions??{}));
export const supplementalTranslations:Record<string,Record<string,LessonTranslation>>={};
export const supplementalTestTranslations:Record<string,{questions:Record<string,QuestionTranslation>;examTitles:Record<string,{sourceHash:string;title:string}>}>={};
for(const part of parts){
 for(const [locale,entries]of Object.entries(part.translations))supplementalTranslations[locale]={...supplementalTranslations[locale],...entries};
 for(const [locale,entries]of Object.entries(part.testTranslations??{})){
  const prior=supplementalTestTranslations[locale];
  supplementalTestTranslations[locale]={questions:{...prior?.questions,...entries.questions},examTitles:{...prior?.examTitles,...entries.examTitles}};
 }
}
