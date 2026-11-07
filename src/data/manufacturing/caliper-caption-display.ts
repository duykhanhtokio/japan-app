import type {ManufacturingLesson} from './index';
import {dailyBodyCurrent40,dailyFigure40,type DailyFigure40} from './daily40';
import data from './caliper-caption-display.json';
type Part={text:string;reading?:string};
export function isCaliperCaptionDisplayRegistered(id:string):boolean{return id==='mfg1-mechanical-lesson-018';}
/** Exact source-before/asset tuple only; a registered stale caption remains plain. */
export function caliperCaptionDisplay(lesson:ManufacturingLesson,item:DailyFigure40,enabled=true):{text:string;parts:Part[]}|undefined{
 if(!enabled||!isCaliperCaptionDisplayRegistered(lesson.id)||data.schemaVersion!==1||data.revision!=='caliper-caption-display-20261107-v1'||!data.studyOnly||data.lessonId!==lesson.id||data.sourceHash!==lesson.sourceHash||lesson.specialty!=='mechanical'||data.canonicalTitleJa!==lesson.titleJa||data.canonicalObjectiveJa!==lesson.objectiveJa||lesson.summaryJa!==data.beforeJapanese||!dailyBodyCurrent40(lesson))return;
 const canonical=(require('./mechanical.json').lessons as ManufacturingLesson[]).find(l=>l.id===lesson.id),current=dailyFigure40(lesson);
 if(!canonical||canonical.sourceHash!==lesson.sourceHash||canonical.titleJa!==lesson.titleJa||canonical.summaryJa!==lesson.summaryJa||canonical.objectiveJa!==lesson.objectiveJa||JSON.stringify(canonical.paragraphs)!==JSON.stringify(lesson.paragraphs)||!current)return;
 for(const row of [current,item])if(row.lessonId!==lesson.id||row.lessonSourceHash!==lesson.sourceHash||row.assetId!==data.asset.assetId||row.assetFile!==data.asset.assetFile||row.width!==data.asset.width||row.height!==data.asset.height||row.sha256!==data.asset.sha256||row.captionSourceHash!==data.asset.captionSourceHash||row.captionJa!==data.beforeJapanese)return;
 const parts=data.parts as Part[];
 if(data.beforeJapanese.replace('主尺','本尺')!==data.afterJapanese||!Array.isArray(parts)||!parts.length||parts.map(p=>p?.text).join('')!==data.afterJapanese||parts.some(p=>!p||typeof p.text!=='string'||!p.text||(/[一-龯々]/.test(p.text)&&(!p.reading||!/^[ぁ-ゖー]+$/.test(p.reading)))||(p.reading!==undefined&&!/^[ぁ-ゖー]+$/.test(p.reading))))return;
 return {text:data.afterJapanese,parts};
}
