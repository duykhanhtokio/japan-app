export const RESTAURANT_CONTENT_VERSION='1';
/** Restaurant-only content. Japanese remains canonical; generated review flags are not certification. */
export type RestaurantLevel = '1' | '2';
export type RestaurantTopic = 'hygiene' | 'cooking' | 'service' | 'operations';
export type ReadingSegment = {text:string;reading?:string};
export type RestaurantSource = {documentId:string;pdfPages:number[];section:string};
export interface RestaurantLesson {
 id:string;level:RestaurantLevel;week:number;day:number;topic:RestaurantTopic;titleJa:string;objectiveJa:string;minutes:number;
 paragraphs:{id:string;titleJa:string;textJa:string;furigana?:ReadingSegment[]}[];
 terms:{ja:string;reading:string}[];summaryJa:string;activityJa:string;sourceRefs:RestaurantSource[];knowledgeIds:string[];sourceHash:string;
 furigana?:{title?:ReadingSegment[];objective?:ReadingSegment[];summary?:ReadingSegment[];activity?:ReadingSegment[]};
}
export interface RestaurantQuestion {
 id:string;topic:RestaurantTopic;objectiveJa:string;stemJa:string;optionsJa:string[];correctIndex:number;explanationJa:string;
 sourceRefs:RestaurantSource[];knowledgeIds:string[];sourceHash:string;
 furigana?:{stem?:ReadingSegment[];options?:ReadingSegment[][];explanation?:ReadingSegment[]};
}
export interface RestaurantExam {id:string;level:RestaurantLevel;kind:'practice'|'weekly';week?:number;titleJa:string;questions:RestaurantQuestion[];sourceHash:string}
export interface RestaurantLessonTranslation {
 sourceHash:string;title:string;objective:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>;terms:Record<string,string>;summary:string;activity:string;
}
export interface RestaurantQuestionTranslation {sourceHash:string;stem:string;options:string[];explanation:string;objective:string}
export interface RestaurantLocale {schemaVersion:number;locale:string;lessons:Record<string,RestaurantLessonTranslation>;questions:Record<string,RestaurantQuestionTranslation>;ui:Record<string,string>}
export interface RestaurantDiagram {
 id:string;lessonIds:string[];titleJa:string;captionJa:string;kind:'flow'|'comparison';nodes:{id:string;labelJa:string;color:string}[];links:{from:string;to:string}[];
 translations:Record<string,{title:string;caption:string;labels:Record<string,string>}>;
}
