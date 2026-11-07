import {foodManufacturingLesson,type FoodManufacturingLesson} from './index';
import {foodSafetySignData as data} from './safety-signs';
/** Exact existing recognition drawings, moved into their daily source placement. */
export function foodRoyalSafetySignsFor(lesson:FoodManufacturingLesson){
 const canonical=foodManufacturingLesson(data.lessonId,'1');
 if(!canonical||canonical.sourceHash!==data.sourceHash||!['p1','p2','p3'].every(id=>canonical.paragraphs.some(p=>p.id===id&&p.titleJa.trim()&&p.textJa.trim())))return null;
 const hash=lesson.id===data.lessonId?data.sourceHash:lesson.id==='food-1-037'?'8341aa90802588cb58df5de769c0ffe42ea9db61dac20c282c4fbdd222c5beee':null;
 const required=lesson.id===data.lessonId?['p1','p2','p3']:['p1'];
 return hash&&lesson.sourceHash===hash&&required.every(id=>lesson.paragraphs.some(p=>p.id===id&&p.titleJa.trim()&&p.textJa.trim()))?{lessonId:lesson.id}:null;
}
