import type {FoodManufacturingLesson} from '@/data/food-manufacturing';
import {foodRoyalNativeLabelHasContext} from '@/data/food-manufacturing/royal-native-context-readings';
import {FoodRoyalNativeLabel} from './FoodRoyalNativeLabel';
import {FoodLessonRuby} from './FoodLessonRuby';
/** Exact source-bound visual caption reading overrides; canonical lesson prose is untouched. */
export function FoodRoyalCaptionRuby({lesson,field,text,color,readingColor}:{lesson:FoodManufacturingLesson;field:string;text:string;color:string;readingColor:string}){
 return foodRoyalNativeLabelHasContext(lesson,text)?<FoodRoyalNativeLabel lesson={lesson} text={text} color={color}/>:<FoodLessonRuby lesson={lesson} field={field} text={text} color={color} readingColor={readingColor}/>;
}
