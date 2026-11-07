import data from './royal-week2-native.json';
import type {FoodManufacturingLesson} from './index';
/** Exact lesson revision/caption guard; native diagrams never override later revisions. */
export function foodRoyalWeek2NativeFor(lesson:FoodManufacturingLesson){return data.bindings.find(binding=>binding.lessonId===lesson.id&&binding.sourceHash===lesson.sourceHash&&lesson.paragraphs.some(p=>p.id===binding.captionParagraphId));}
