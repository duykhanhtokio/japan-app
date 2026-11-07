import type {ManufacturingLesson} from '@/data/manufacturing';
import {manufacturingSource60Figure} from '@/data/manufacturing/source60-buff';
import {SupplementalFigure} from './SupplementalManufacturingDiagrams';

/** One original concept diagram bound to the exact current teaching paragraph. */
export function Source60BuffFigure({lesson,language,showTranslation}:{lesson:ManufacturingLesson;language:string;showTranslation:boolean}){
 const figure=manufacturingSource60Figure(lesson,language);
 if(!figure)return null;
 return <SupplementalFigure item={{id:'source60-buff-roles',lessonId:lesson.id,lessonSourceHash:lesson.sourceHash,assetFile:figure.image.path,width:figure.image.width,height:figure.image.height,captionJa:figure.captionJa,scopeLimits:[]}} language={language} showTranslation={showTranslation} translatedCaption={figure.caption} japaneseCaptionRuby={figure.captionRuby} imageSource={require('../../../assets/manufacturing/source60/buff-roles.png')}/>;
}
