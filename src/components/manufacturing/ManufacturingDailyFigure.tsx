import {Text,View} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {manufacturingDailyFigure} from '@/data/manufacturing/daily-support';
import {manufacturingTranslation} from '@/data/manufacturing/translations';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {manufacturingDailyFigureSources} from './manufacturing-daily-figure-sources';
import {SupplementalFigure} from './SupplementalManufacturingDiagrams';
/** Every mapping is curated and version-bound; an unknown or changed lesson gets no fallback. */
export function ManufacturingDailyFigure({lesson,language,showTranslation}:{lesson:ManufacturingLesson;language:string;showTranslation:boolean}){
 const found=manufacturingDailyFigure(lesson),{colors}=useStudyAppearance();if(!found)return null;
 const target=showTranslation?manufacturingTranslation(lesson,language):null;
 const {asset,binding}=found,source=manufacturingDailyFigureSources[binding.assetId];if(!source)return null;
 return <View testID={`manufacturing-daily-objective-figure-${lesson.id}`} style={{gap:8}}>
  <Text style={{fontSize:18,lineHeight:29,fontWeight:'700',color:colors.text}}>{lesson.titleJa}</Text>
  <SupplementalFigure item={{id:'daily-'+lesson.id,lessonId:lesson.id,lessonSourceHash:lesson.sourceHash,assetFile:asset.assetFile,width:asset.width,height:asset.height,captionJa:lesson.objectiveJa,scopeLimits:[]}} language={language} showTranslation={showTranslation} translatedCaption={target?.objective??null} imageSource={source}/>
 </View>;
}
