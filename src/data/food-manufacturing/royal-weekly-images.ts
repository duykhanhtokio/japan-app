import type {ImageSourcePropType} from 'react-native';
import type {FoodManufacturingLesson} from './index';
export type FoodRoyalWeeklyImage={lessonId:string;sourceHash:string;captionParagraphId:string;source:ImageSourcePropType;width:number;height:number};
/** Lesson-specific Royal illustrations; preserve shared historical diagram families. */
export const foodRoyalWeeklyImages:FoodRoyalWeeklyImage[]=[
 {lessonId:'food-1-004',sourceHash:'6911628f4a2d61b097b0f80bf1e32061bc485ac2b5813ab7cef692949a4aa2a8',captionParagraphId:'p2',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/allergen-utensil-separation.webp'),width:1536,height:1024},
 {lessonId:'food-1-005',sourceHash:'298acfaa70a42605cf77973fb655a3e1cae8c1114a4ab3590310330e0e161d11',captionParagraphId:'p1',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/chemical-required-rinse.webp'),width:1536,height:1024},
 {lessonId:'food-1-006',sourceHash:'5d2fd13ee866967e7835db2fa5b5a8e0601319f031f8d94eda10d24a071c0a7e',captionParagraphId:'p1',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/invisible-microbiological-risk.webp'),width:1536,height:1024},
 {lessonId:'food-1-001',sourceHash:'284c6c7a65f3beb574969d905952457a741488f04cb44b876b113e680780b5a0',captionParagraphId:'p2',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/worker-and-consumer-safety.webp'),width:1536,height:1024},
 {lessonId:'food-1-003',sourceHash:'9bd216b9c3c11e32803f28f3f6740c34b8c96e35e6e56c0fd482054def3c7029',captionParagraphId:'p1',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/hard-foreign-material.webp'),width:1536,height:1024},
 {lessonId:'food-2-004',sourceHash:'2ed9be5fafb15925e54cf1c17f76098f28507111ee25cbc03e9b0835bbd313d3',captionParagraphId:'p1',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/tailored-training-support.webp'),width:1536,height:1024},
 {lessonId:'food-2-002',sourceHash:'cdba03abdf3b389684e415833c42625e9baad8319785d3e59c0323b0c3679a79',captionParagraphId:'p1',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/role-model-hygiene.webp'),width:1536,height:1024},
 {lessonId:'food-2-003',sourceHash:'b9a508519dd611e4911cc7641ea95671f300e3bf914fbafe1226af64e66e87f2',captionParagraphId:'p1',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/people-equipment-work.webp'),width:1536,height:1024},
 {lessonId:'food-1-002',sourceHash:'eb9a6f16be41cb1260016eba2a0fa758d6ea1956a4af14c3b9429fb456cfe1ce',captionParagraphId:'p3',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/hygiene-and-process-controls.webp'),width:1536,height:1024},
 {lessonId:'food-2-001',sourceHash:'5ce0c3e1f2ec0ba34508afb1f7c27e1563238ffaa4d6a5331cf56106c01a20ce',captionParagraphId:'p2',source:require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/community-rules.webp'),width:1536,height:1024},
];
export function foodRoyalWeeklyImageFor(lesson:FoodManufacturingLesson){return foodRoyalWeeklyImages.find(image=>image.lessonId===lesson.id&&image.sourceHash===lesson.sourceHash&&lesson.paragraphs.some(p=>p.id===image.captionParagraphId));}
