import data from './royal-week8-native.json';
import type {FoodManufacturingLesson} from './index';
/** Preserve exact original diagram IDs/pixels and source-specific native quantities. */
export function foodRoyalWeek8NativeFor(lesson:FoodManufacturingLesson){const binding=data.bindings.find(b=>b.lessonId===lesson.id&&b.sourceHash===lesson.sourceHash);return binding&&binding.requiredParagraphIds.every(id=>lesson.paragraphs.some(p=>p.id===id&&p.titleJa.trim()&&p.textJa.trim()))?binding:null;}
