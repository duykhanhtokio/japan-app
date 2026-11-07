import {Text,View,type StyleProp,type TextStyle} from 'react-native';
import data from '@/data/agriculture/flower-legend-native.json';
import figures from '@/data/agriculture/recognition-images.json';
import lessons from '@/data/agriculture/lessons.ja.json';
import {AgricultureImageRuby} from './AgricultureImageRuby';
type Colors={text:string;translation:string;translationText:string;border:string};
type Labels={categories:string[];period:string;limit:string};
export function FlowerLegendFigure({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const figure=figures.images.find(f=>f.id===data.figureId);
 if((data.sourceHashes as Record<string,string>)[lessonId]!==lessonSourceHash||!figure||figure.assetSha256!==data.referenceAssetSha256)return null;
 if(level!==undefined&&!figure.scopeLevels.includes(level))return null;
 const lesson=lessons.lessons.find(l=>l.id===lessonId&&l.sourceHash===lessonSourceHash&&l.revision===lessonRevision&&l.levels.includes(level||''));
 const currentContext=!!(lesson&&figure.scopeLevels.includes(level||'')&&(data.lessonRevisions as Record<string,string>)[lessonId]===lessonRevision&&figure.lessonIds.includes(lessonId)&&figure.lessonSourceHashes[lessonId as keyof typeof figure.lessonSourceHashes]===lessonSourceHash);
 const ruby=(field:string,text:string,style:StyleProp<TextStyle>)=>currentContext&&lesson?<AgricultureImageRuby imageId={figure.id} assetSha256={figure.assetSha256} lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} lessonRevision={lesson.revision} field={field} text={text} style={style} color={colors.translationText}/>:<Text style={style}>{text}</Text>;
 const sourceJa=data.translationSourceJapanese;
 const japaneseMatches=sourceJa.period===data.labels.ja.period&&sourceJa.limit===data.labels.ja.limit&&sourceJa.categories.length===data.labels.ja.categories.length&&sourceJa.categories.every((text,i)=>text===data.labels.ja.categories[i]);
 const candidate=(data.labels as Record<string,Labels>)[language];
 const localized=showTranslation&&currentContext&&japaneseMatches&&candidate&&Array.isArray(candidate.categories)&&candidate.categories.length===data.labels.ja.categories.length&&candidate.categories.every(text=>typeof text==='string'&&!!text.trim())&&!!candidate.period?.trim()&&!!candidate.limit?.trim()?candidate:undefined;
 const labels=localized||data.labels.ja;
 const alt=[labels.period,...labels.categories,labels.limit].join('。');
 return <View testID="agri-native-flower-legend" style={{gap:12}}>
  {ruby('legend:period',data.labels.ja.period,{color:colors.translationText,fontSize:17,lineHeight:28,fontWeight:'700'})}
  {!!localized&&language!=='ja'&&<Text testID="agri-flower-legend-localized-period" style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{localized.period}</Text>}
  <View accessible accessibilityRole="image" accessibilityLabel={alt} testID="agri-flower-legend-mapping" style={{gap:12}}>
   {data.labels.ja.categories.map((category,i)=><View key={category} testID={`agri-flower-legend-row-${i}`} style={{flexDirection:'row',alignItems:'center',gap:12,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:8}}>
    <View importantForAccessibility="no" style={{width:32,height:32,backgroundColor:data.colors[i],borderWidth:1,borderColor:'#555'}}/>
    <View style={{flex:1,gap:4}}>{ruby(`legend:category:${i}`,category,{color:colors.translationText,fontSize:17,lineHeight:28})}{!!localized&&language!=='ja'&&<Text style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{localized.categories[i]}</Text>}</View>
   </View>)}
  </View>
  <View testID="agri-flower-legend-not-statistical-width">{ruby('legend:limit',data.labels.ja.limit,{color:colors.translationText,fontSize:16,lineHeight:27})}</View>
  {!!localized&&language!=='ja'&&<Text testID="agri-flower-legend-localized-limit" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{localized.limit}</Text>}
  {ruby('legend:source-reference','AGR-S2 · p.5 · 平成2年〜平成29年',{color:colors.translationText,fontSize:14,lineHeight:23})}
 </View>;
}
