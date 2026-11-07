import {AgricultureNativeFigureRuby} from './AgricultureNativeFigureRuby';
import {STATISTICS_REMAINDER_JA} from './NativeFigureReadingSource';
import {Text,View} from 'react-native';
import data from '@/data/agriculture/statistics-2019-figure.json';
import type {AgricultureLesson} from '@/data/agriculture';
import type {AgricultureTranslation} from '@/data/agriculture/translations';

const sourceHash='7d5c5d91423f924f6035d3f3f4d2014b381e480d9f8737f3b7fcf654d3fbf2f7';
type Colors={text:string;translation:string;translationText:string;border:string};
type Labels={title:string;categories:string[]};
const validLabels=(value:Labels|undefined):value is Labels=>typeof value?.title==='string'&&!!value.title.trim()&&Array.isArray(value.categories)&&value.categories.length===data.slices.length&&value.categories.every(x=>typeof x==='string'&&!!x.trim());
type Props={lesson:AgricultureLesson;level:string;language:string;showTranslation:boolean;translation:AgricultureTranslation|null;colors:Colors};

export function Statistics2019Figure({lesson,level,language,showTranslation,translation,colors}:Props) {
 if(level!=='2'||lesson.id!=='agr-statistics'||lesson.sourceHash!==sourceHash||data.sourceHash!==sourceHash||!data.lessonRevision||lesson.revision!==data.lessonRevision||!validLabels(data.labels.ja))return null;
 const readingContext={lessonId:lesson.id,lessonSourceHash:lesson.sourceHash,lessonRevision:lesson.revision,level,color:colors.translationText};
 const translated=showTranslation&&translation?.sourceHash===sourceHash?translation:null;
 const candidate=translated?(data.labels as Record<string,Labels>)[language]:undefined;
 const localized=validLabels(candidate)?candidate:undefined;
 const labels=localized||data.labels.ja;
 const explanation=lesson.paragraphs.find(p=>p.id==='agr-statistics-p2');
 const historical=lesson.paragraphs.find(p=>p.id==='agr-statistics-p1');
 if(!explanation||!historical)return null;
 const alt=labels.title+'。'+data.slices.map((slice,i)=>`${labels.categories[i]} ${slice.value}%`).join('、');
 return <View testID="agri-native-statistics-2019" style={{gap:12,marginVertical:12}}>
  <AgricultureNativeFigureRuby {...readingContext} field="title" text={data.labels.ja.title} style={{color:colors.translationText,fontWeight:'700',fontSize:19,lineHeight:29}}/>
  {!!localized&&<Text testID="agri-statistics-localized-title" style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{localized.title}</Text>}
  <View accessible accessibilityRole="image" accessibilityLabel={alt} testID="agri-statistics-proportional-bar" style={{width:'100%',height:64,flexDirection:'row',overflow:'hidden',borderRadius:6}}>
   {data.slices.map(slice=><View key={slice.key} testID={`agri-statistics-segment-${slice.key}`} importantForAccessibility="no" style={{width:`${slice.value}%`,height:64,backgroundColor:slice.color}}/>)}
  </View>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>
   {data.slices.map((slice,i)=><View key={slice.key} testID={`agri-statistics-legend-${slice.key}`} style={{flexDirection:'row',alignItems:'flex-start',gap:8,flexGrow:1,flexBasis:180}}>
    <View importantForAccessibility="no" style={{width:18,height:18,marginTop:5,backgroundColor:slice.color,borderWidth:1,borderColor:colors.border}}/>
    <View style={{flex:1,gap:3}}><AgricultureNativeFigureRuby {...readingContext} field={`legend:${i}`} text={`${data.labels.ja.categories[i]} ${slice.value}%`} style={{color:colors.translationText,fontSize:17,lineHeight:28}}/>{!!localized&&<Text style={{color:colors.translationText,fontSize:17,lineHeight:28}}>{localized.categories[i]}</Text>}</View>
   </View>)}
  </View>
  <View testID="agri-statistics-derived-remainder"><AgricultureNativeFigureRuby {...readingContext} field="remainder" text={STATISTICS_REMAINDER_JA} style={{color:colors.translationText,fontSize:16,lineHeight:27}}/></View>
  <AgricultureNativeFigureRuby {...readingContext} field={`paragraph:${explanation.id}`} text={explanation.textJa} style={{color:colors.translationText,fontSize:16,lineHeight:27}}/>
  {!!translated&&<Text testID="agri-statistics-localized-explanation" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translated.paragraphs[explanation.id]}</Text>}
  <View testID="agri-statistics-historical-condition"><AgricultureNativeFigureRuby {...readingContext} field={`paragraph:${historical.id}`} text={historical.textJa} style={{color:colors.translationText,fontSize:16,lineHeight:27}}/></View>
  {!!translated&&<Text testID="agri-statistics-localized-history" style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translated.paragraphs[historical.id]}</Text>}
  <Text style={{color:colors.translationText,fontSize:14,lineHeight:23}}>AGR-S2 · p.1 · 2019</Text>
 </View>;
}
