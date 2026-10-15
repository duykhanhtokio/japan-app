import bank from './review-tests.ja.json';
export type ReviewSourceReference={
 sessionId:string;clusterId:string;paragraphIds:string[];
 lessonFile:string;lessonSha256:string;weekId:string;sessionRevision:string|number;contentRevision:string|number;
};
export type ReviewQuestion={
 id:string;number:number;points:number;promptJa:string;choicesJa:string[];correctIndex:number;explanationJa:string;
 objectiveKey:string;claimJa:string;sourceReferences:ReviewSourceReference[];distractorRationalesJa:string[];
};
export type ReviewTest={
 id:string;revision:string;titleJa:string;language:string;questionCount:number;maxPoints:number;
 timeLimitSeconds:null;passThreshold:null;isOfficialExam:boolean;sessionRange:number[];questions:ReviewQuestion[];
};
export const bankRevision=bank.revision;
export const reviewTests:ReviewTest[]=bank.exams;
