import {Text,View} from 'react-native';
import data from '@/data/agriculture/winter-climate-figure.json';
import type {AgricultureLesson} from '@/data/agriculture';
import type {AgricultureTranslation} from '@/data/agriculture/translations';
type Colors={text:string;translation:string;translationText:string;border:string};
type Labels={regions:string[];tendencies:string[]};
export function WinterClimateFigure({lesson,level,language,showTranslation,translation,colors}:{lesson:AgricultureLesson;level:string;language:string;showTranslation:boolean;translation:AgricultureTranslation|null;colors:Colors}){
 if(level!=='2'||lesson.id!==data.lessonId||lesson.sourceHash!==data.sourceHash)return null;
 const winter=lesson.paragraphs.find(p=>p.id==='agr-climate-p3'),limit=lesson.paragraphs.find(p=>p.id==='agr-climate-p6');
 if(!winter||!limit)return null;
 const t=showTranslation&&translation?.sourceHash===data.sourceHash?translation:null;
 const localized=t?(data.labels as Record<string,Labels>)[language]:undefined;
 const alt=localized&&t?.paragraphs[winter.id]?t.paragraphs[winter.id]:winter.textJa;
 return <View testID="agri-native-winter-climate" style={{gap:12,marginVertical:12}}>
  <Text style={{color:colors.translationText,fontSize:19,lineHeight:29,fontWeight:'700'}}>{winter.titleJa}</Text>
  {!!localized&&<Text testID="agri-climate-localized-title" style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{t?.paragraphTitles[winter.id]}</Text>}
  <View accessible accessibilityRole="image" accessibilityLabel={alt} testID="agri-climate-regional-comparison" style={{flexDirection:'row',flexWrap:'wrap',gap:14}}>
   {data.labels.ja.regions.map((region,i)=><View key={region} testID={`agri-climate-region-${i}`} style={{flexBasis:230,flexGrow:1,padding:16,borderWidth:1,borderColor:colors.border,borderRadius:12,gap:10}}>
    <View importantForAccessibility="no" style={{height:8,borderRadius:4,backgroundColor:i===0?'#688a9b':'#c4a354'}}/>
    <Text style={{color:colors.translationText,fontWeight:'700',fontSize:19,lineHeight:29}}>{region}</Text>
    <Text style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{data.labels.ja.tendencies[i]}</Text>
    {!!localized&&<Text testID={`agri-climate-localized-region-${i}`} style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{localized.regions[i]}{'\n'}{localized.tendencies[i]}</Text>}
   </View>)}
  </View>
  <Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{winter.textJa}</Text>
  {!!t&&<Text testID="agri-climate-localized-explanation" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{t.paragraphs[winter.id]}</Text>}
  <Text testID="agri-climate-regional-limit" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{limit.textJa}</Text>
  {!!t&&<Text testID="agri-climate-localized-limit" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{t.paragraphs[limit.id]}</Text>}
  <Text style={{color:colors.translationText,fontSize:14,lineHeight:23}}>AGR-S2 · p.1</Text>
 </View>;
}
