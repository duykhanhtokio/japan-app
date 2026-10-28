import raw from './supplements.json';
import type {FoodManufacturingLesson} from './index';
import type {FoodRubySegment} from './ruby';

export type FoodSupplement={id:string;lessonId:string;parentSourceHash:string;contentHash:string;titleJa:string;textJa:string;answerJa?:string;exerciseData?:Record<string,any>;ruby?:Record<string,FoodRubySegment[]>;translations:Record<string,{sourceHash:string;title:string;text:string;answer?:string}>};
const extensions=(raw as unknown as {extensions:FoodSupplement[]}).extensions;
export function foodManufacturingSupplements(lesson:FoodManufacturingLesson){return extensions.filter(x=>x.lessonId===lesson.id&&x.parentSourceHash===lesson.sourceHash);}
/** Adding substantive learning material invalidates only that lesson's old completion mark. */
export function foodManufacturingLessonRevision(lesson:FoodManufacturingLesson){
 const items=foodManufacturingSupplements(lesson);if(!items.length)return lesson.sourceHash;
 const text=JSON.stringify({sourceHash:lesson.sourceHash,extensions:items.map(x=>[x.id,x.contentHash])});let hash=2166136261;
 for(let i=0;i<text.length;i++)hash=Math.imul(hash^text.charCodeAt(i),16777619);
 return `food-extended-${(hash>>>0).toString(16)}`;
}
