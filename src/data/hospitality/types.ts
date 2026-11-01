export type HotelQuestion = {id:string;prompt:string;choices:string[];answerIndex:number;explanation:string;knowledgeIds:string[]};
export type HotelLesson = {
 id:string;level:1|2;title:string;reading:string;revision:string;
 objectives:{id:string;text:string}[];
 sections:{id:string;title:string;body:string}[];
 terms:{ja:string;reading:string;meaning:string}[];
 example:{situation:string;steps:string[]};practice:{prompt:string;expectedPoints:string[]};
 questions:HotelQuestion[];knowledgeIds:string[];
 illustration:{id:string;kind:string;caption:string;alt:string;keyObjectiveId:string};
 estimatedMinutes:number;review:{domainReviewed:boolean;nativeReviewed:boolean};
};
export type HotelCatalogEntry = {id:string;level:1|2;title:string;reading:string;group:string;revision:string;estimatedMinutes:number};
export type HotelTranslation = Omit<HotelLesson,'level'|'revision'|'knowledgeIds'|'estimatedMinutes'|'review'> & {sourceRevision:string;status:'translated_ai_unreviewed'};
