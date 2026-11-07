import {AgricultureCoreAppearanceRuby} from './AgricultureCoreAppearanceRuby';
import {Text,View} from 'react-native';
import {ZoomableFigure} from './ZoomableFigure';
import data from '@/data/agriculture/rice-process-labels.json';
import type {AgricultureLesson} from '@/data/agriculture';
import type {AgricultureTranslation} from '@/data/agriculture/translations';

type Colors={text:string;translation:string;translationText:string;border:string};
const source=require('../../../assets/agriculture/royal-weekly-20261107/week01/rice-husking-polishing.webp');

type Labels={states:string[];alt:string;caption:string};
export function RiceProcessFigure({lesson,level,language='ja',showTranslation=false,translation,colors}:{lesson:AgricultureLesson;level:string;language?:string;showTranslation?:boolean;translation:AgricultureTranslation|null;colors:Colors}) {
 if(lesson.id!==data.lessonId||lesson.sourceHash!==data.sourceHash||!['1','2'].includes(level))return null;
 const ruby=(field:string,text:string,style:import('react-native').StyleProp<import('react-native').TextStyle>)=><AgricultureCoreAppearanceRuby provider="rice-process" lesson={lesson} level={level} language="ja" field={field} text={text} style={style} color={colors.translationText}/>;
 const localized=showTranslation&&translation?.sourceHash===data.sourceHash?(data.labels as Record<string,Labels>)[language]:undefined;
 const labels=localized||data.labels.ja;
 return <View testID="agri-royal-rice-process" style={{gap:10,marginVertical:16}}>
  {ruby('title','もみ・玄米・白米',{color:colors.text,fontSize:19,lineHeight:29,fontWeight:'700'})}{!!localized&&language!=='ja'&&<Text testID="agri-rice-process-localized-title" style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{localized.states.join(' · ')}</Text>}
  <ZoomableFigure uiLanguage={language} source={source} width={1754} height={897} altJa={labels.alt} testID="agri-royal-rice-process" colors={colors} allowExpandedView/>
  {ruby('states','左：もみ　中央：玄米　右：白米',{color:colors.translationText,fontSize:17,lineHeight:28})}
  {!!localized&&language!=='ja'&&<View testID="agri-rice-process-localized-states" style={{flexDirection:'row',gap:8}}>{localized.states.map((state,i)=><Text key={i} testID={`agri-rice-process-localized-state-${i}`} style={{flex:1,color:colors.translationText,fontSize:17,lineHeight:28,textAlign:'center'}}>{state}</Text>)}</View>}
  {ruby('caption','もみ殻を除くと玄米になり、玄米を精米すると白米になります。図は外観を比べるための例で、実際の粒の大きさを示すものではありません。',{color:colors.translationText,fontSize:16,lineHeight:27})}
  {!!localized&&language!=='ja'&&<Text testID="agri-rice-process-localized-caption" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{localized.caption}</Text>}
  <Text style={{color:colors.translationText,fontSize:14,lineHeight:23}}>AGR-S1 · p.1 / AGR-S2 · p.2</Text>
 </View>;
}
