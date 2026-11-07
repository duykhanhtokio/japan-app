import type {RecognitionPack} from '@/data/manufacturing/recognition38';
import {SupplementalFigure} from './SupplementalManufacturingDiagrams';

type Entry={packSnapshot:string;assetFile:string;width:number;height:number;captionJa:string;captions:Record<string,string>};
const entries=require('@/data/manufacturing/recognition-occupational-overviews.json').entries as Record<string,Entry>;
const own=(value:object,key:string)=>Object.prototype.hasOwnProperty.call(value,key);
function snapshot(pack:RecognitionPack){return JSON.stringify({titleJa:pack.titleJa,captionJa:pack.captionJa,captionSourceHash:pack.captionSourceHash,lessonIds:pack.lessonIds,lessonSourceHashes:pack.lessonSourceHashes,assets:pack.assets});}
function image(file:string):ReturnType<typeof require>|null{
 switch(file){
  case 'assets/manufacturing/recognition-overviews-20261107/instruments.webp':return require('../../../assets/manufacturing/recognition-overviews-20261107/instruments.webp');
  case 'assets/manufacturing/recognition-overviews-20261107/surface-defects.webp':return require('../../../assets/manufacturing/recognition-overviews-20261107/surface-defects.webp');
  case 'assets/manufacturing/recognition-overviews-20261107/buff-surfaces.webp':return require('../../../assets/manufacturing/recognition-overviews-20261107/buff-surfaces.webp');
  default:return null;
 }
}
/** Occupational morphology accompanies the independent exact diagrams only in the study reader. */
export function RecognitionOccupationalOverview({pack,language,showTranslation}:{pack:RecognitionPack;language:string;showTranslation:boolean}){
 const entry=own(entries,pack.id)?entries[pack.id]:null;
 if(!entry||entry.packSnapshot!==snapshot(pack))return null;
 const source=image(entry.assetFile);if(!source)return null;
 const caption=showTranslation&&own(entry.captions,language)?entry.captions[language]:null;
 return <SupplementalFigure item={{id:pack.id+'-occupational-overview',lessonId:pack.lessonIds[0],lessonSourceHash:pack.lessonSourceHashes[pack.lessonIds[0]],assetFile:entry.assetFile,width:entry.width,height:entry.height,captionJa:entry.captionJa,scopeLimits:['recognition_morphology_only','not_operating_instructions','not_scale_or_acceptance_evidence']}} imageSource={source} language={language} showTranslation={showTranslation} imageAlt={caption??entry.captionJa} translatedCaption={caption}/>;
}
