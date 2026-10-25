import type { AgricultureLesson, AgricultureLevel } from '@/data/agriculture';
export {freshTestAttempt,restoreTestAttempt,gradeTest,type TestAttempt} from './kensetsu-test-state';
export const agricultureCompletionKey = (learner:string,level:AgricultureLevel) => `@japan_app_agriculture:completion:v1:${encodeURIComponent(learner)}:${level}`;
export const agricultureExamKey = (learner:string,level:AgricultureLevel,examId:string) => `@japan_app_agriculture:exam:v1:${encodeURIComponent(learner)}:${level}:${encodeURIComponent(examId)}`;
export type AgricultureProgress = {version:1;entries:Record<string,string>};
export function restoreAgricultureProgress(raw:string|null):AgricultureProgress|null {
 if(raw===null)return {version:1,entries:{}};
 try {
  const p=JSON.parse(raw);
  if(!p || p.version!==1 || !p.entries || typeof p.entries!=='object' || Array.isArray(p.entries) || !Object.entries(p.entries).every(([id,hash])=>/^agr-[a-z0-9-]+$/.test(id)&&typeof hash==='string'&&/^[a-f0-9]{64}$/.test(hash)))return null;
  return {version:1,entries:{...p.entries}};
 }catch{return null;}
}
export function agricultureLessonDone(progress:AgricultureProgress,lesson:AgricultureLesson) {return progress.entries[lesson.id]===lesson.sourceHash;}
