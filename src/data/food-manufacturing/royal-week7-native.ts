import data from './royal-week7-native.json';
import type {FoodManufacturingLesson} from './index';
/** Source-specific example quantities and retained exact statistical pixels. */
export function foodRoyalWeek7NativeFor(lesson:FoodManufacturingLesson){
 const binding=data.bindings.find(b=>b.lessonId===lesson.id&&b.sourceHash===lesson.sourceHash);
 return binding&&binding.requiredParagraphIds.every(id=>lesson.paragraphs.some(p=>p.id===id&&p.titleJa.trim()&&p.textJa.trim()))?binding:null;
}
