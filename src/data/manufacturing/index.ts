import manifest from './course-manifest.json';
export type Specialty='mechanical'|'electrical'|'surface';
export type SourceRef={documentId:string;pdfPage:number;printedPage:number|null};
export type ManufacturingLesson={id:string;specialty:Specialty;titleJa:string;objectiveJa:string;paragraphs:{id:string;titleJa:string;textJa:string}[];terms:{ja:string;reading:string;meaningJa:string}[];activityJa:string;safetyJa:string[];summaryJa:string;sourceHash:string;sources:SourceRef[];estimatedMinutes:number;reviewStatus:string};
export type ManufacturingQuestion={id:string;sourceHash:string;lessonId:string;stemJa:string;optionsJa:string[];correctIndex:number;optionReasonsJa:string[];sources:SourceRef[]};
export type ManufacturingExam={id:string;revision:string;titleJa:string;kind:'weekly';officialSimulation:false;weekId:string;questions:ManufacturingQuestion[]};
export type ManufacturingCourse={specialty:Specialty;lessons:ManufacturingLesson[];checks:ManufacturingExam[]};
export const manufacturingSpecialties=manifest.specialties;
export const manufacturingManifest=manifest;
/** Specialty data is loaded only when the learner enters that specialty. */
export function loadManufacturingCourse(s:Specialty):ManufacturingCourse {
 switch(s){case 'mechanical':return require('./mechanical.json') as ManufacturingCourse;case 'electrical':return require('./electrical.json') as ManufacturingCourse;case 'surface':return require('./surface.json') as ManufacturingCourse;}
}
