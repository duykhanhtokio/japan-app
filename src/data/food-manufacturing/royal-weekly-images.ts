import type {ImageSourcePropType} from 'react-native';
import type {FoodManufacturingLesson} from './index';
export type FoodRoyalWeeklyImage={lessonId:string;sourceHash:string;captionParagraphId:string;source:ImageSourcePropType;width:number;height:number};
/** Lesson-specific Royal illustrations; preserve shared historical diagram families. */
export const foodRoyalWeeklyImages:FoodRoyalWeeklyImage[]=[
 {lessonId:'food-2-001',sourceHash:'5ce0c3e1f2ec0ba34508afb1f7c27e1563238ffaa4d6a5331cf56106c01a20ce',captionParagraphId:'p2',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/community-rules.webp'),width:1536,height:1024},
];
export function foodRoyalWeeklyImageFor(lesson:FoodManufacturingLesson){return foodRoyalWeeklyImages.find(image=>image.lessonId===lesson.id&&image.sourceHash===lesson.sourceHash&&lesson.paragraphs.some(p=>p.id===image.captionParagraphId));}
