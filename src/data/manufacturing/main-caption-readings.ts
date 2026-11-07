import type {ManufacturingLesson} from './index';
import {dailyBodyCurrent40,dailyFigure40,type DailyFigure40} from './daily40';
type Part={text:string;reading?:string};
type Binding={sourceHash:string;canonicalTitleJa:string;canonicalObjectiveJa:string;asset:{assetId:string;assetFile:string;width:number;height:number;sha256:string;captionSourceHash:string};readingKey:string};
type Registry={schemaVersion:number;revision:string;sourceWeek:number;studyOnly:boolean;lessons:Record<string,Binding>;readings:Record<string,{sourceJapanese:string;parts:Part[]}>};
function registryForLesson(id:string):Registry|null{
 const match=/^mfg1-(?:mechanical-lesson-|electrical-l|surface-lesson-)(\d{3})$/.exec(id);if(!match)return null;
 switch(Math.ceil(Number(match[1])/7)){case 1:return require('./main-caption-week01-readings.json') as Registry;case 2:return require('./main-caption-week02-readings.json') as Registry;case 3:return require('./main-caption-week03-readings.json') as Registry;case 4:return require('./main-caption-week04-readings.json') as Registry;case 5:return require('./main-caption-week05-readings.json') as Registry;case 6:return require('./main-caption-week06-readings.json') as Registry;default:return null;}
}
export function hasManufacturingMainCaptionReading(id:string):boolean{return !!registryForLesson(id)?.lessons?.[id];}
/** Current source-body/full-caption/asset tuple; no unreviewed draft lookup. */
export function manufacturingMainCaptionReading(lesson:ManufacturingLesson,item:DailyFigure40):Part[]|undefined{
 const data=registryForLesson(lesson.id),binding=data?.lessons?.[lesson.id],row=binding?data?.readings?.[binding.readingKey]:undefined;
 if(!data||data.schemaVersion!==1||data.revision!=='main-caption-source-readings-20261107-v1'||!data.studyOnly||data.sourceWeek!==Math.ceil(Number(lesson.id.match(/(\d+)$/)?.[1])/7)||!binding||!row||binding.sourceHash!==lesson.sourceHash||binding.canonicalTitleJa!==lesson.titleJa||binding.canonicalObjectiveJa!==lesson.objectiveJa||row.sourceJapanese!==lesson.summaryJa||!dailyBodyCurrent40(lesson))return;
 const pool=lesson.specialty==='mechanical'?require('./mechanical.json'):lesson.specialty==='electrical'?require('./electrical.json'):lesson.specialty==='surface'?require('./surface.json'):null,canonical=(pool?.lessons as ManufacturingLesson[]|undefined)?.find(l=>l.id===lesson.id),current=dailyFigure40(lesson);
 if(!canonical||canonical.sourceHash!==lesson.sourceHash||canonical.titleJa!==lesson.titleJa||canonical.summaryJa!==lesson.summaryJa||canonical.objectiveJa!==lesson.objectiveJa||JSON.stringify(canonical.paragraphs)!==JSON.stringify(lesson.paragraphs)||!current)return;
 for(const candidate of [current,item])if(candidate.lessonId!==lesson.id||candidate.lessonSourceHash!==lesson.sourceHash||candidate.assetId!==binding.asset.assetId||candidate.assetFile!==binding.asset.assetFile||candidate.width!==binding.asset.width||candidate.height!==binding.asset.height||candidate.sha256!==binding.asset.sha256||candidate.captionSourceHash!==binding.asset.captionSourceHash||candidate.captionJa!==row.sourceJapanese||candidate.renderedByExistingComponent)return;
 const parts=row.parts;if(!Array.isArray(parts)||!parts.length||parts.map(p=>p?.text).join('')!==row.sourceJapanese||parts.some(p=>!p||typeof p.text!=='string'||!p.text||(/[一-龯々]/.test(p.text)&&(!p.reading||!/^[ぁ-ゖー]+$/.test(p.reading)))||(p.reading!==undefined&&!/^[ぁ-ゖー]+$/.test(p.reading))))return;
 return parts;
}
