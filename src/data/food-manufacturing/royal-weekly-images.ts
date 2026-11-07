import type {ImageSourcePropType} from 'react-native';
import type {FoodManufacturingLesson} from './index';
export type FoodRoyalWeeklyImage={lessonId:string;sourceHash:string;captionParagraphId:string;source:ImageSourcePropType;width:number;height:number};
/** Lesson-specific Royal illustrations; preserve shared historical diagram families. */
export const foodRoyalWeeklyImages:FoodRoyalWeeklyImage[]=[
 {lessonId:'food-2-002',sourceHash:'cdba03abdf3b389684e415833c42625e9baad8319785d3e59c0323b0c3679a79',captionParagraphId:'p1',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/role-model-hygiene.webp'),width:1536,height:1024},
 {lessonId:'food-2-003',sourceHash:'b9a508519dd611e4911cc7641ea95671f300e3bf914fbafe1226af64e66e87f2',captionParagraphId:'p1',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/people-equipment-work.webp'),width:1536,height:1024},
 {lessonId:'food-1-002',sourceHash:'eb9a6f16be41cb1260016eba2a0fa758d6ea1956a4af14c3b9429fb456cfe1ce',captionParagraphId:'p3',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/hygiene-and-process-controls.webp'),width:1536,height:1024},
 {lessonId:'food-2-001',sourceHash:'5ce0c3e1f2ec0ba34508afb1f7c27e1563238ffaa4d6a5331cf56106c01a20ce',captionParagraphId:'p2',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/community-rules.webp'),width:1536,height:1024},
];
export function foodRoyalWeeklyImageFor(lesson:FoodManufacturingLesson){return foodRoyalWeeklyImages.find(image=>image.lessonId===lesson.id&&image.sourceHash===lesson.sourceHash&&lesson.paragraphs.some(p=>p.id===image.captionParagraphId));}
