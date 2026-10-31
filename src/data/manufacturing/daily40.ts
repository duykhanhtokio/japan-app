import type {ManufacturingLesson} from './index';
import {dailyAssetByFile40} from './daily40-assets';

export type DailyFigure40={lessonId:string;lessonSourceHash:string;assetId:string;assetFile:string;width:number;height:number;sha256:string;captionJa:string;altJa:string;keyObjectiveJa:string;relevanceReasonJa:string;captionSourceHash:string;altSourceHash:string;renderedByExistingComponent?:boolean};
type Target={sourceHash:string;caption:string;alt:string;captionSourceHash:string;altSourceHash:string};
const own=(o:object,k:string)=>Object.prototype.hasOwnProperty.call(o,k);
function figures(lesson:ManufacturingLesson):Record<string,DailyFigure40>{
 switch(lesson.specialty){case 'mechanical':return require('./daily40/mechanical.json').lessons;case 'electrical':return require('./daily40/electrical.json').lessons;case 'surface':return require('./daily40/surface.json').lessons;default:return {};}
}
/** Exact current lesson revision; metadata never substitutes for an image asset. */
export function dailyFigure40(lesson:ManufacturingLesson):DailyFigure40|null{
 const rows=figures(lesson),row=own(rows,lesson.id)?rows[lesson.id]:null;
 return row&&row.lessonId===lesson.id&&row.lessonSourceHash===lesson.sourceHash&&row.captionJa===lesson.summaryJa&&row.altJa===lesson.titleJa&&row.width>0&&row.height>0?row:null;
}
export function dailyAsset40(lesson:ManufacturingLesson){const row=dailyFigure40(lesson);return row?dailyAssetByFile40(row.assetFile):null;}
export function dailyCaption40(lesson:ManufacturingLesson,locale:string):Target|null{
 const row=dailyFigure40(lesson);if(!row)return null;
 let data:Record<string,Target>|null=null;
 switch(locale){case 'vi':data=require('./daily40/vi.json').lessons;break;case 'en':data=require('./daily40/en.json').lessons;break;case 'id':data=require('./daily40/id.json').lessons;break;case 'zh-CN':data=require('./daily40/zh-CN.json').lessons;break;case 'zh-TW':data=require('./daily40/zh-TW.json').lessons;break;case 'hi':data=require('./daily40/hi.json').lessons;break;case 'bn':data=require('./daily40/bn.json').lessons;break;case 'ne':data=require('./daily40/ne.json').lessons;break;case 'my':data=require('./daily40/my.json').lessons;break;case 'th':data=require('./daily40/th.json').lessons;break;case 'km':data=require('./daily40/km.json').lessons;break;case 'tl':data=require('./daily40/tl.json').lessons;break;}
 const target=data&&own(data,lesson.id)?data[lesson.id]:null;
 return target&&target.sourceHash===lesson.sourceHash&&target.captionSourceHash===row.captionSourceHash&&target.altSourceHash===row.altSourceHash&&target.caption.trim()&&target.alt.trim()?target:null;
}
