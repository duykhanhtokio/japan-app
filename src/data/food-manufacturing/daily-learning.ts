import data from './daily-learning.json';
import {foodManufacturingLesson,type FoodManufacturingLesson} from './index';
export function foodDailyBinding(lesson:FoodManufacturingLesson){
 const binding=data.bindings.find(b=>b.lessonId===lesson.id&&b.level===lesson.level&&b.sourceHash===lesson.sourceHash);
 return binding&&lesson.paragraphs.some(p=>p.id===binding.captionParagraphId)?binding:null;
}
/** Existing revision-bound content. Never grant completion for a companion lesson. */
export function foodDailyCompanions(lesson:FoodManufacturingLesson){
 return (foodDailyBinding(lesson)?.companions??[]).flatMap(binding=>{
  const peer=foodManufacturingLesson(binding.lessonId,lesson.level);
  if(!peer||peer.id===lesson.id||peer.sourceHash!==binding.sourceHash||!binding.paragraphIds.every(id=>peer.paragraphs.some(p=>p.id===id)))return [];
  return [{lesson:peer,paragraphs:peer.paragraphs.filter(p=>binding.paragraphIds.includes(p.id)),includeActivity:binding.includeActivity}];
 });
}
