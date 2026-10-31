import type {ManufacturingLesson} from '@/data/manufacturing';
import {dailyFigure40,dailyAsset40,dailyCaption40} from '@/data/manufacturing/daily40';
import {SupplementalFigure} from './SupplementalManufacturingDiagrams';
import {ManufacturingDailyFigure} from './ManufacturingDailyFigure';

/** A key-objective illustration inside the actual scheduled day's reader. */
export function DailyManufacturingFigure({lesson,language,showTranslation}:{lesson:ManufacturingLesson;language:string;showTranslation:boolean}){
 const row=dailyFigure40(lesson);if(!row)return <ManufacturingDailyFigure lesson={lesson} language={language} showTranslation={showTranslation}/>;if(row.renderedByExistingComponent)return null;
 const image=dailyAsset40(lesson);if(!image)return null;
 const target=showTranslation?dailyCaption40(lesson,language):null;
 return <SupplementalFigure item={{id:row.assetId,lessonId:lesson.id,lessonSourceHash:lesson.sourceHash,assetFile:row.assetFile,width:row.width,height:row.height,captionJa:row.captionJa,scopeLimits:[]}} imageSource={image} imageAlt={target?.alt??row.altJa} language={language} showTranslation={showTranslation} translatedCaption={target?.caption??null}/>;
}
