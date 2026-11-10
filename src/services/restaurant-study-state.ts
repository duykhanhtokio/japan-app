import type {RestaurantLesson,RestaurantLevel,RestaurantExam} from '@/data/restaurant/types';
import {RESTAURANT_CONTENT_VERSION} from '@/data/restaurant/types';
import {freshTestAttempt,restoreTestAttempt,gradeTest,type TestAttempt} from './kensetsu-test-state';
export {gradeTest,type TestAttempt};
const namespace=(learner:string,level:RestaurantLevel)=>`@japan_app:restaurant:v${RESTAURANT_CONTENT_VERSION}:${encodeURIComponent(learner)}:${level}`;
export const restaurantProgressKey=(learner:string,level:RestaurantLevel)=>`${namespace(learner,level)}:progress`;
export const restaurantExamKey=(learner:string,level:RestaurantLevel,exam:RestaurantExam)=>`${namespace(learner,level)}:exam:${encodeURIComponent(exam.id)}:${exam.sourceHash}`;
export type RestaurantPosition={week:number|null;lessonId:string|null;sourceHash:string|null;scrollY:number};
export type RestaurantProgress={version:1;entries:Record<string,string>;position:RestaurantPosition};
const isHash=(x:unknown):x is string=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
const isId=(x:unknown):x is string=>typeof x==='string'&&/^rst-[12]-[a-z0-9-]+$/.test(x);
export function freshRestaurantProgress():RestaurantProgress{return {version:1,entries:{},position:{week:null,lessonId:null,sourceHash:null,scrollY:0}};}
export function restoreRestaurantProgress(raw:string|null):RestaurantProgress|null{
 if(raw===null)return freshRestaurantProgress();
 try{const p=JSON.parse(raw),n=p?.position;if(p?.version!==1||!p.entries||typeof p.entries!=='object'||Array.isArray(p.entries)||!Object.entries(p.entries).every(([id,hash])=>isId(id)&&isHash(hash))||!n||(n.week!==null&&(!Number.isInteger(n.week)||n.week<1))||(n.lessonId!==null&&!isId(n.lessonId))||(n.sourceHash!==null&&!isHash(n.sourceHash))||!Number.isFinite(n.scrollY)||n.scrollY<0||((n.lessonId===null)!==(n.sourceHash===null)))return null;
 return {version:1,entries:{...p.entries},position:{week:n.week,lessonId:n.lessonId,sourceHash:n.sourceHash,scrollY:n.scrollY}};
 }catch{return null;}
}
export const restaurantLessonDone=(progress:RestaurantProgress,lesson:RestaurantLesson)=>!!lesson.sourceHash&&progress.entries[lesson.id]===lesson.sourceHash;
const definition=(exam:RestaurantExam)=>({id:exam.id,revision:exam.sourceHash,questions:exam.questions});
export const freshRestaurantAttempt=(exam:RestaurantExam):TestAttempt=>freshTestAttempt(definition(exam));
export const restoreRestaurantAttempt=(raw:string|null,exam:RestaurantExam):TestAttempt|null=>restoreTestAttempt(raw,definition(exam));
