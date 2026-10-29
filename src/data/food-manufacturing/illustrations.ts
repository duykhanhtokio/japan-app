import type {ImageSourcePropType} from 'react-native';
import type {FoodManufacturingLesson} from './index';

export type FoodIllustration={
 id:string;
 lessonId:string;
 sourceHash:string;
 captionParagraphId:string;
 source:ImageSourcePropType;
 width:number;
 height:number;
 /** The pictured arrangement is intentionally unsafe and must be labelled as such. */
 incorrectExample?:boolean;
};

/** Context illustrations, not complete procedures or substitutes for the lesson text. */
export const foodIllustrations:FoodIllustration[]=[
 {id:'food-illustration-center-temperature',lessonId:'food-1-021',sourceHash:'30c66404249e414249446aa0afea543906d1903d668ba92a6c90c3a9b2108797',captionParagraphId:'p2',source:require('../../../assets/food-manufacturing/illustrations/center-temperature.webp'),width:1536,height:1024},
 {id:'food-illustration-locked-conveyor',lessonId:'food-1-031',sourceHash:'1b4d4389a7f66b669e5d37746778acec077acf0478e4d211bb7bf30583263c2f',captionParagraphId:'p3',source:require('../../../assets/food-manufacturing/illustrations/locked-conveyor.webp'),width:1536,height:1024},
 {id:'food-illustration-raw-cooked-separation',lessonId:'food-1-010',sourceHash:'4c6436bc257eb6c1f3895de0f2252bda7592fc282dd7c3a052f8834e4fcbc11c',captionParagraphId:'p1',source:require('../../../assets/food-manufacturing/illustrations/raw-cooked-separation.webp'),width:1536,height:1024},
 {id:'food-illustration-storage-hazards-example',lessonId:'food-1-012',sourceHash:'dd569aad6e43b731f4b6ed55cafd91acc4711f9da13251e116f42c6e6c50a32b',captionParagraphId:'p1',incorrectExample:true,source:require('../../../assets/food-manufacturing/illustrations/storage-hazards-example.webp'),width:1536,height:1024},
 {id:'food-illustration-protective-clothing',lessonId:'food-1-014',sourceHash:'a39b5b10fa307a5ff17f1e540774902c984c58e7209d37b37b70104218586360',captionParagraphId:'p1',source:require('../../../assets/food-manufacturing/illustrations/protective-clothing.webp'),width:1536,height:1024},
 {id:'food-illustration-handwashing',lessonId:'food-1-015',sourceHash:'2a54fbc04bc7715f3200c15f7eeebd305c47ecafb414cad1c2f66ab660a3995a',captionParagraphId:'p2',source:require('../../../assets/food-manufacturing/illustrations/handwashing.webp'),width:1536,height:1024},
];

export function foodIllustrationsFor(lesson:FoodManufacturingLesson){
 return foodIllustrations.filter(figure=>figure.lessonId===lesson.id&&figure.sourceHash===lesson.sourceHash&&lesson.paragraphs.some(p=>p.id===figure.captionParagraphId));
}
