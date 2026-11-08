export type StudyLessonRef = {id:string;title:string;revision?:string};
export type StudyDay<T> = {day:number;kind:'lesson'|'review';lessons:T[]};
export type StudyWeek<T> = {number:number;id:string;lessons:T[];days:StudyDay<T>[]};
/** Calendar changes never rewrite canonical lesson IDs, hashes or completion records. */
export function buildStudyWeeks<T extends StudyLessonRef>(lessons:readonly T[]):StudyWeek<T>[] {
 const unique=[...new Map(lessons.map(l=>[l.id,l])).values()],weeks:StudyWeek<T>[]=[];
 for(let i=0;i<unique.length;i+=7){
  const group=unique.slice(i,i+7),number=weeks.length+1;
  weeks.push({number,id:group.map(l=>`${l.id}:${l.revision??''}`).join('|'),lessons:group,
   days:Array.from({length:7},(_,day)=>day<group.length?{day:day+1,kind:'lesson',lessons:[group[day]]}:{day:day+1,kind:'review',lessons:group})});
 }
 return weeks;
}
export type StudyQuestion = {id:string;prompt:string;options:string[];correctIndex:number;explanation:string;lessonIds:string[];match?:'any'|'all'};
export function questionsForStudyWeek<T extends StudyLessonRef>(week:StudyWeek<T>,questions:readonly StudyQuestion[]){
 const ids=new Set(week.lessons.map(l=>l.id));
 return [...new Map(questions.filter(q=>q.lessonIds.length>0&&(q.match==='any'?q.lessonIds.some(id=>ids.has(id)):q.lessonIds.every(id=>ids.has(id)))).map(q=>[q.id,q])).values()];
}
