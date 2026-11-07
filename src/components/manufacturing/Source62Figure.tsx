import type {ManufacturingLesson} from '@/data/manufacturing';
import {manufacturingSource62Figure} from '@/data/manufacturing/source62-bounded';
import {SupplementalFigure} from './SupplementalManufacturingDiagrams';
/** Functional concept diagram; deliberately not a photograph or wiring guide. */
export function Source62Figure({lesson,language,showTranslation}:{lesson:ManufacturingLesson;language:string;showTranslation:boolean}){
 const f=manufacturingSource62Figure(lesson,language);if(!f)return null;
 return <SupplementalFigure item={{id:'source62-switch-roles',lessonId:lesson.id,lessonSourceHash:lesson.sourceHash,assetFile:f.image.path,width:f.image.width,height:f.image.height,captionJa:f.captionJa,scopeLimits:[]}} language={language} showTranslation={showTranslation} translatedCaption={f.caption} japaneseCaptionRuby={f.captionRuby} imageSource={require('../../../assets/manufacturing/source62/switch-roles.png')}/>;
}
