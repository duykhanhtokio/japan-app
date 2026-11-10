import type {FoodManufacturingLesson,FoodManufacturingLevel} from '@/data/food-manufacturing';
export {freshTestAttempt,restoreTestAttempt,gradeTest,type TestAttempt} from './kensetsu-test-state';
export const foodManufacturingCompletionKey=(learner:string,level:FoodManufacturingLevel)=>`@japan_app_food_manufacturing:completion:v1:${encodeURIComponent(learner)}:${level}`;
export const foodManufacturingExamKey=(learner:string,level:FoodManufacturingLevel,examId:string)=>`@japan_app_food_manufacturing:exam:v1:${encodeURIComponent(learner)}:${level}:${encodeURIComponent(examId)}`;
export type FoodManufacturingProgress={version:1;entries:Record<string,string>};
export function restoreFoodManufacturingProgress(raw:string|null):FoodManufacturingProgress|null{
 if(raw===null)return {version:1,entries:{}};
 try{const p=JSON.parse(raw);if(!p||p.version!==1||!p.entries||typeof p.entries!=='object'||Array.isArray(p.entries)||!Object.entries(p.entries).every(([id,hash])=>/^food-[12]-[a-z0-9-]+$/.test(id)&&typeof hash==='string'&&hash.length>0))return null;return {version:1,entries:{...p.entries}};}catch{return null;}
}
export function foodManufacturingLessonDone(progress:FoodManufacturingProgress,lesson:FoodManufacturingLesson){return progress.entries[lesson.id]===lesson.sourceHash;}
