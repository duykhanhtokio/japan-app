import {RoyalWeek03MechanicalDetails} from './RoyalWeek03MechanicalDetails';
import {RoyalWeek01TechnicalDetails} from './RoyalWeek01TechnicalDetails';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {dailyFigure40,dailyAsset40,dailyCaption40,dailyBodyCurrent40,hasDailyFigure40Registration} from '@/data/manufacturing/daily40';
import {SupplementalFigure} from './SupplementalManufacturingDiagrams';
import {ManufacturingDailyFigure} from './ManufacturingDailyFigure';

/** A key-objective illustration inside the actual scheduled day's reader. */
export function DailyManufacturingFigure({lesson,language,showTranslation}:{lesson:ManufacturingLesson;language:string;showTranslation:boolean}){
 if(!dailyBodyCurrent40(lesson))return null;
 const row=dailyFigure40(lesson);if(!row)return hasDailyFigure40Registration(lesson)?null:<ManufacturingDailyFigure lesson={lesson} language={language} showTranslation={showTranslation}/>;if(row.renderedByExistingComponent)return <RoyalWeek01TechnicalDetails lesson={lesson} language={showTranslation?language:'ja'}/>;
 const image=dailyAsset40(lesson);if(!image)return null;
 const target=showTranslation?dailyCaption40(lesson,language):null;
 return <><SupplementalFigure item={{id:row.assetId,lessonId:lesson.id,lessonSourceHash:lesson.sourceHash,assetFile:row.assetFile,width:row.width,height:row.height,captionJa:row.captionJa,scopeLimits:[]}} imageSource={image} imageAlt={target?.alt??row.altJa} language={language} showTranslation={showTranslation} translatedCaption={target?.caption??null}/><RoyalWeek01TechnicalDetails lesson={lesson} language={showTranslation?language:'ja'}/><RoyalWeek03MechanicalDetails lesson={lesson} language={showTranslation?language:'ja'}/></>;
}
