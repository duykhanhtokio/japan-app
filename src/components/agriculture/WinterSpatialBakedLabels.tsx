import {Text,View} from 'react-native';
import type {AgricultureLesson} from '@/data/agriculture';
import {AgricultureNativeFigureRuby} from './AgricultureNativeFigureRuby';
import {winterSpatialBakedSource,winterSpatialBakedTranslation} from './WinterSpatialLabelSource';
type Colors={text:string;translation:string;translationText:string;border:string};
export function WinterSpatialBakedLabels({lesson,level,language,showTranslation,colors}:{lesson:AgricultureLesson;level:string;language:string;showTranslation:boolean;colors:Colors}){
 const source=winterSpatialBakedSource(lesson.id,lesson.sourceHash,lesson.revision,level);
 if(!source)return null;
 const translated=showTranslation&&language!=='ja'?winterSpatialBakedTranslation(lesson.id,lesson.sourceHash,lesson.revision,level,language):null;
 return <View testID="agri-winter-spatial-baked-labels" style={{gap:8}}>{source.labels.map((text,i)=><View key={i} style={{gap:3}}><AgricultureNativeFigureRuby lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} lessonRevision={lesson.revision} level={level} field={`baked-label:${i}`} text={text} color={colors.translationText} style={{color:colors.translationText,fontSize:16,lineHeight:27}}/>{!!translated&&<Text testID={`agri-winter-spatial-baked-label-${i}-localized`} style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translated[i]}</Text>}</View>)}</View>;
}
