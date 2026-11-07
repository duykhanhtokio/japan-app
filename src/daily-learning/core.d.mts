import type { Challenge, Match, DailyWord, LearningState } from './types';
export const LEVELS: readonly string[];
export const WEEK_MS: number;
export function originalExam(id:string):boolean;
export function dayAt(now:number):string;
export function shuffle<T extends {id:string}>(items:T[],seed:string):T[];
export function checkMatch(challenge:Challenge,tuple:Match):boolean;
export function selectWords(words:DailyWord[],state:Pick<LearningState,'level'|'learned'|'mistakes'>,day:string,locale:string):DailyWord[];
