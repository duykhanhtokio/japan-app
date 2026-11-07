export type Level = 'N5'|'N4'|'N3'|'N2'|'N1';
export type DailyWord = {id:string; word:string; reading:string; meaning:string; level:Level; status?:string};
export type Match = [string,string,string];
export type Challenge = {day:string;locale:string;level:Level;words:DailyWord[];matched:string[];attempts:Match[]};
export type LearningState = {initialLevel:Level;level:Level;freeExamId:string;completedDays:string[];learned:string[];mistakes:Record<string,number>;keys:number;tickets:number;grants:Record<string,number>;challenge:Challenge|null; runs:Record<string,{examId:string;source:string;startedAt:number;submitted:boolean}>};
export type Access = {allowed:boolean;source:string;expiresAt:number|null};
export type LearningSnapshot = {serverNow:number;premiumUntil:number;state:LearningState;result:Partial<Access>&{keyAwarded?:boolean;ticketAwarded?:boolean;replayed?:boolean;kind?:string}};
