import lessonData from './ruby/lessons.ja.json';
import questionData from './ruby/questions.ja.json';
import type {FoodManufacturingLesson,FoodManufacturingQuestion} from './index';

export type FoodRubySegment={text:string;reading?:string};
export type FoodLessonRubyFields={
 titleJa:FoodRubySegment[];objectiveJa:FoodRubySegment[];activityJa:FoodRubySegment[];summaryJa:FoodRubySegment[];
 paragraphs:Record<string,{titleJa:FoodRubySegment[];textJa:FoodRubySegment[]}>;
};
export type FoodQuestionRubyFields={promptJa:FoodRubySegment[];optionsJa:FoodRubySegment[][];explanationJa:FoodRubySegment[];optionExplanationsJa:FoodRubySegment[][]};
type Pack<T>={sourceHash:string;fields:T};
const lessons=lessonData as unknown as Record<string,Pack<FoodLessonRubyFields>>;
const questions=questionData as unknown as Record<string,Pack<FoodQuestionRubyFields>>;

/** Offline readings are usable only when their complete base text is source aligned. */
export function hasAlignedFoodRuby(text:string,segments:unknown):segments is FoodRubySegment[]{
 return Array.isArray(segments)&&segments.length>0&&segments.every(part=>
  part&&typeof part.text==='string'&&part.text.length>0&&
  (part.reading===undefined||(typeof part.reading==='string'&&/^[ぁ-ゖー]+$/.test(part.reading)))&&
  (!/[一-鿿々〆ヵヶ]/.test(part.text)||typeof part.reading==='string')
 )&&segments.map(part=>part.text).join('')===text;
}
export function foodManufacturingLessonRuby(lesson:FoodManufacturingLesson):FoodLessonRubyFields|undefined{
 const pack=lessons[lesson.id],fields=pack?.fields;
 if(pack?.sourceHash!==lesson.sourceHash||!fields)return undefined;
 if(!(['titleJa','objectiveJa','activityJa','summaryJa'] as const).every(key=>hasAlignedFoodRuby(lesson[key],fields[key])))return undefined;
 if(!lesson.paragraphs.every(p=>hasAlignedFoodRuby(p.titleJa,fields.paragraphs?.[p.id]?.titleJa)&&hasAlignedFoodRuby(p.textJa,fields.paragraphs?.[p.id]?.textJa)))return undefined;
 return fields;
}
export function foodManufacturingQuestionRuby(question:FoodManufacturingQuestion):FoodQuestionRubyFields|undefined{
 const pack=questions[question.id],fields=pack?.fields;
 if(pack?.sourceHash!==question.sourceHash||!fields)return undefined;
 if(!hasAlignedFoodRuby(question.stemJa,fields.promptJa)||!hasAlignedFoodRuby(question.explanationJa,fields.explanationJa))return undefined;
 if(!Array.isArray(fields.optionsJa)||fields.optionsJa.length!==question.optionsJa.length||!question.optionsJa.every((text,i)=>hasAlignedFoodRuby(text,fields.optionsJa[i])))return undefined;
 if(!Array.isArray(fields.optionExplanationsJa)||fields.optionExplanationsJa.length!==question.optionReasonsJa.length||!question.optionReasonsJa.every((text,i)=>hasAlignedFoodRuby(text,fields.optionExplanationsJa[i])))return undefined;
 return fields;
}
