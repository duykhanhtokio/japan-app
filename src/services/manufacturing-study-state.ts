import type { ManufacturingLesson, Specialty } from '@/data/manufacturing';
export {freshTestAttempt,restoreTestAttempt,gradeTest,type TestAttempt} from './kensetsu-test-state';
export const manufacturingCompletionKey=(learner:string,specialty:Specialty)=>`@japan_app_manufacturing:completion:v1:${encodeURIComponent(learner)}:1:${specialty}`;
export const manufacturingExamKey=(learner:string,specialty:Specialty,exam:string)=>`@japan_app_manufacturing:exam:v1:${encodeURIComponent(learner)}:1:${specialty}:${encodeURIComponent(exam)}`;
export type ManufacturingProgress={version:1;entries:Record<string,string>};
export function restoreManufacturingProgress(raw:string|null):ManufacturingProgress|null {
 if(raw===null)return {version:1,entries:{}};
 try {const p=JSON.parse(raw);if(!p||p.version!==1||!p.entries||typeof p.entries!=='object'||Array.isArray(p.entries)||!Object.entries(p.entries).every(([id,h])=>/^mfg1-(mechanical|electrical|surface)-[a-z0-9-]+$/.test(id)&&typeof h==='string'&&/^[a-f0-9]{64}$/.test(h)))return null;return {version:1,entries:{...p.entries}};}catch{return null;}
}
export const manufacturingLessonDone=(p:ManufacturingProgress,l:ManufacturingLesson)=>p.entries[l.id]===l.sourceHash;
