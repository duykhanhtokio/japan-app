import allocation from './weekly-art-allocation.json';
import {paragraphIllustrations} from './paragraph-illustrations';

const byDay=new Map(allocation.assignments.map(row=>[row.day,row.artId]));
/** One contextual illustration per calendar day; original technical figures stay in the text. */
export function illustrationForStudyDay(day:number){
 const artId=byDay.get(day);
 if(!artId || !paragraphIllustrations[artId])throw new Error(`Missing Kaigo artwork allocation for day ${day}`);
 return paragraphIllustrations[artId];
}
