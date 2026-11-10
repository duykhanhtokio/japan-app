import data from './royal-week4-native.json';
import type {FoodManufacturingLesson} from './index';
/** Current revision and caption only; preserve all original technical figure identities/data. */
export function foodRoyalWeek4NativeFor(lesson:FoodManufacturingLesson){return data.bindings.find(b=>b.lessonId===lesson.id&&b.sourceHash===lesson.sourceHash&&lesson.paragraphs.some(p=>p.id===b.captionParagraphId));}
