import type {FoodManufacturingLesson} from './index';
import data from './royal-week5-native.json';
export function foodRoyalWeek5NativeFor(lesson:FoodManufacturingLesson){
 return data.bindings.find(binding=>binding.lessonId===lesson.id&&binding.sourceHash===lesson.sourceHash&&binding.requiredParagraphIds.every(id=>lesson.paragraphs.some(p=>p.id===id&&p.titleJa.trim().length>0&&p.textJa.trim().length>0)));
}
