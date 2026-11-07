import type {ManufacturingLesson} from './index';
import {dailyBodyCurrent40,dailyFigure40,type DailyFigure40} from './daily40';
import registry from './main-caption-literal-display.json';
type Part={text:string;reading?:string};
export function isMainCaptionLiteralDisplayRegistered(id:string):boolean{return id==='mfg1-electrical-l016'||id==='mfg1-surface-lesson-015';}
/** Exact source-before/asset tuple only; a registered stale caption remains plain. */
export function mainCaptionLiteralDisplay(lesson:ManufacturingLesson,item:DailyFigure40,enabled=true):{text:string;parts:Part[]}|undefined{
 const data=(registry.lessons as Record<string,typeof registry.lessons['mfg1-electrical-l016']>)[lesson.id];
 if(!data||!enabled||!isMainCaptionLiteralDisplayRegistered(lesson.id)||registry.schemaVersion!==1||registry.revision!=='main-caption-literal-display-20261107-v1'||!registry.studyOnly||data.sourceHash!==lesson.sourceHash||!['electrical','surface'].includes(lesson.specialty)||data.canonicalTitleJa!==lesson.titleJa||data.canonicalObjectiveJa!==lesson.objectiveJa||lesson.summaryJa!==data.beforeJapanese||!dailyBodyCurrent40(lesson))return;
 const pool=lesson.specialty==='electrical'?require('./electrical.json'):lesson.specialty==='surface'?require('./surface.json'):null,canonical=(pool?.lessons as ManufacturingLesson[]|undefined)?.find(l=>l.id===lesson.id),current=dailyFigure40(lesson);
 if(!canonical||canonical.sourceHash!==lesson.sourceHash||canonical.titleJa!==lesson.titleJa||canonical.summaryJa!==lesson.summaryJa||canonical.objectiveJa!==lesson.objectiveJa||JSON.stringify(canonical.paragraphs)!==JSON.stringify(lesson.paragraphs)||!current)return;
 for(const row of [current,item])if(row.lessonId!==lesson.id||row.lessonSourceHash!==lesson.sourceHash||row.assetId!==data.asset.assetId||row.assetFile!==data.asset.assetFile||row.width!==data.asset.width||row.height!==data.asset.height||row.sha256!==data.asset.sha256||row.captionSourceHash!==data.asset.captionSourceHash||row.captionJa!==data.beforeJapanese)return;
 const change=lesson.id==='mfg1-electrical-l016'?['四帯','4本の色帯']:['実品','実際の品物'];if(data.oldLiteral!==change[0]||data.newLiteral!==change[1])return;
 const parts=data.parts as Part[];
 if(data.beforeJapanese.replace(data.oldLiteral,data.newLiteral)!==data.afterJapanese||!Array.isArray(parts)||!parts.length||parts.map(p=>p?.text).join('')!==data.afterJapanese||parts.some(p=>!p||typeof p.text!=='string'||!p.text||(/[一-龯々]/.test(p.text)&&(!p.reading||!/^[ぁ-ゖー]+$/.test(p.reading)))||(p.reading!==undefined&&!/^[ぁ-ゖー]+$/.test(p.reading))))return;
 return {text:data.afterJapanese,parts};
}
