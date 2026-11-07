import {Text,View,type StyleProp,type TextStyle} from 'react-native';
import {AgricultureNativeFigureRuby} from './AgricultureNativeFigureRuby';
import data from '@/data/agriculture/flower-legend-native.json';
type Colors={text:string;translation:string;translationText:string;border:string};
type Labels={categories:string[];period:string;limit:string};
export function FlowerLegendFigure({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 if((data.sourceHashes as Record<string,string>)[lessonId]!==lessonSourceHash)return null;
 const ruby=(field:string,text:string,style:StyleProp<TextStyle>)=><AgricultureNativeFigureRuby provider="flower-legend" lessonId={lessonId} lessonSourceHash={lessonSourceHash} lessonRevision={lessonRevision} level={level} language="ja" field={field} text={text} style={style} color={colors.translationText}/>;
 const localized=showTranslation?(data.labels as Record<string,Labels>)[language]:undefined;
 const labels=localized||data.labels.ja;
 const alt=[labels.period,...labels.categories,labels.limit].join('。');
 return <View testID="agri-native-flower-legend" style={{gap:12}}>
  {ruby('period',data.labels.ja.period,{color:colors.translationText,fontSize:17,lineHeight:28,fontWeight:'700'})}
  {!!localized&&language!=='ja'&&<Text testID="agri-flower-legend-localized-period" style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{localized.period}</Text>}
  <View accessible accessibilityRole="image" accessibilityLabel={alt} testID="agri-flower-legend-mapping" style={{gap:12}}>
   {data.labels.ja.categories.map((category,i)=><View key={category} testID={`agri-flower-legend-row-${i}`} style={{flexDirection:'row',alignItems:'center',gap:12,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:8}}>
    <View importantForAccessibility="no" style={{width:32,height:32,backgroundColor:data.colors[i],borderWidth:1,borderColor:'#555'}}/>
    <View style={{flex:1,gap:4}}>{ruby(`category:${i}`,category,{color:colors.translationText,fontSize:17,lineHeight:28})}{!!localized&&language!=='ja'&&<Text testID={`agri-flower-legend-localized-category-${i}`} style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{localized.categories[i]}</Text>}</View>
   </View>)}
  </View>
  <View testID="agri-flower-legend-not-statistical-width">{ruby('limit',data.labels.ja.limit,{color:colors.translationText,fontSize:16,lineHeight:27})}</View>
  {!!localized&&language!=='ja'&&<Text testID="agri-flower-legend-localized-limit" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{localized.limit}</Text>}
  {ruby('source','AGR-S2 · p.5 · 平成2年〜平成29年',{color:colors.translationText,fontSize:14,lineHeight:23})}
 </View>;
}
