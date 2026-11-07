import {Text,View} from 'react-native';
import data from '@/data/agriculture/flower-legend-native.json';
type Colors={text:string;translation:string;translationText:string;border:string};
type Labels={categories:string[];period:string;limit:string};
export function FlowerLegendFigure({lessonId,lessonSourceHash,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;language?:string;showTranslation?:boolean;colors:Colors}){
 if((data.sourceHashes as Record<string,string>)[lessonId]!==lessonSourceHash)return null;
 const localized=showTranslation?(data.labels as Record<string,Labels>)[language]:undefined;
 const labels=localized||data.labels.ja;
 const alt=[labels.period,...labels.categories,labels.limit].join('。');
 return <View testID="agri-native-flower-legend" style={{gap:12}}>
  <Text style={{color:colors.translationText,fontSize:17,lineHeight:28,fontWeight:'700'}}>{data.labels.ja.period}</Text>
  {!!localized&&language!=='ja'&&<Text testID="agri-flower-legend-localized-period" style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{localized.period}</Text>}
  <View accessible accessibilityRole="image" accessibilityLabel={alt} testID="agri-flower-legend-mapping" style={{gap:12}}>
   {data.labels.ja.categories.map((category,i)=><View key={category} testID={`agri-flower-legend-row-${i}`} style={{flexDirection:'row',alignItems:'center',gap:12,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:8}}>
    <View importantForAccessibility="no" style={{width:32,height:32,backgroundColor:data.colors[i],borderWidth:1,borderColor:'#555'}}/>
    <Text style={{flex:1,color:colors.translationText,fontSize:17,lineHeight:28}}>{category}{!!localized&&language!=='ja'?`\n${localized.categories[i]}`:''}</Text>
   </View>)}
  </View>
  <Text testID="agri-flower-legend-not-statistical-width" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{data.labels.ja.limit}</Text>
  {!!localized&&language!=='ja'&&<Text testID="agri-flower-legend-localized-limit" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{localized.limit}</Text>}
  <Text style={{color:colors.translationText,fontSize:14,lineHeight:23}}>AGR-S2 · p.5 · 平成2年〜平成29年</Text>
 </View>;
}
