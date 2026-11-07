import {Text,View,type StyleProp,type ViewStyle} from 'react-native';
import type {AgricultureLesson} from '@/data/agriculture';
import bindings from '@/data/agriculture/inline-diagram-source-bindings.json';
import {organClassificationLabels,ORGAN_CLASSIFICATION_JA} from './OrganClassificationLabels';
import {AgricultureNativeFigureRuby} from './AgricultureNativeFigureRuby';
export function OrganClassificationDiagram({lesson,level,language='ja',showTranslation=false,diagramStyle,stageStyle}:{lesson:AgricultureLesson;level:string;language?:string;showTranslation?:boolean;diagramStyle?:StyleProp<ViewStyle>;stageStyle?:StyleProp<ViewStyle>}){
 if(!lesson.levels.includes(level))return null;
 const b=bindings.organs;
 if(lesson.id!==b.lessonId||lesson.sourceHash!==b.lessonSourceHash||!b.levels.includes(level))return null;
 const ja=organClassificationLabels(lesson.id,lesson.sourceHash,lesson.revision,level,'ja',ORGAN_CLASSIFICATION_JA);
 if(!ja)return null;
 const t=showTranslation&&language!=='ja'?organClassificationLabels(lesson.id,lesson.sourceHash,lesson.revision,level,language,ORGAN_CLASSIFICATION_JA):null;
 const context={lessonId:lesson.id,lessonSourceHash:lesson.sourceHash,lessonRevision:lesson.revision,level,color:'#302c26'};
 return <View testID="agri-organ-classification" style={diagramStyle} accessibilityLabel={t?.alt||ORGAN_CLASSIFICATION_JA.alt}>{ORGAN_CLASSIFICATION_JA.rows.map(([title,items],i)=><View key={title} style={[stageStyle,{backgroundColor:title==='栄養器官'?'#d6e6ba':'#f1cfbb',minWidth:130}]}><AgricultureNativeFigureRuby {...context} field={`rowTitle:${i}`} text={title} style={{color:'#302c26',fontSize:17,fontWeight:'700'}}/><AgricultureNativeFigureRuby {...context} field={`rowItems:${i}`} text={items} style={{color:'#302c26',fontSize:17,lineHeight:30}}/>{!!t&&<><Text testID={`agri-organ-classification-title-${i}`} style={{color:'#302c26',fontSize:17,fontWeight:'700'}}>{t.rows[i][0]}</Text><Text testID={`agri-organ-classification-items-${i}`} style={{color:'#302c26',fontSize:17,lineHeight:30}}>{t.rows[i][1]}</Text></>}</View>)}</View>;
}
