import {View,Text} from 'react-native';
import type {RestaurantLesson} from '@/data/restaurant';
import {RoyalContentPanel} from '@/components/ui/RoyalPanels';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';
import data from '@/data/restaurant/royal-week08-controls.json';
export function restaurantWeek08Control(lesson:Pick<RestaurantLesson,'id'|'sourceHash'>){return data.figures.find(x=>x.lessonId===lesson.id&&x.lessonSourceHash===lesson.sourceHash);}
export function RestaurantWeek08ControlFigures({lesson,language,showTranslation}:{lesson:Pick<RestaurantLesson,'id'|'sourceHash'>;language:string;showTranslation:boolean}){
 const figure=restaurantWeek08Control(lesson);if(!figure)return null;
 const target=(figure.caption.translations as Record<string,{sourceHash:string;text:string}>)[language],valid=showTranslation&&language!=='ja'&&target?.sourceHash===figure.caption.sourceHash&&JSON.stringify({labelsJa:data.labelsJa,captionJa:figure.caption.textJa,statistics:data.statistics})===figure.sourceSignature;
 const labels=valid?(data.labels as Record<string,string[]>)[language]:undefined;
 const label=(index:number)=><View><RestaurantReading text={data.labelsJa[index].text} segments={[data.labelsJa[index]]}/>{labels?.[index]&&<TranslationText>{labels[index]}</TranslationText>}</View>;
 return <View testID={`restaurant-native-week08-${figure.kind}`} style={{width:'100%',gap:12}}>
  {figure.kind==='samples'?<>
   {[0,1].map(index=><RoyalContentPanel key={index} testID={`sample-separated-${index}`} style={{gap:8}}>
    {label(index)}<View accessible accessibilityRole="image" accessibilityLabel={data.labelsJa[index].text} style={{height:120,alignItems:'center',justifyContent:'center'}}>
     <View style={{width:'65%',height:80,borderWidth:3,borderColor:'#64828a',borderRadius:10,backgroundColor:index?'#f1d9a9':'#dce6d3',alignItems:'center',justifyContent:'center'}}><View style={{position:'absolute',top:-8,left:-5,right:-5,height:12,borderRadius:4,backgroundColor:'#718f97'}}/><Text>{index+1}</Text></View>
    </View>
    <View style={{borderTopWidth:1,borderColor:'#b7a16b',gap:6,paddingTop:6}}>{[2,3,4].map(i=><View key={i}>{label(i)}</View>)}</View>
   </RoyalContentPanel>)}
   {label(5)}
  </>:data.statistics.map((series,index)=><RoyalContentPanel key={series.id} testID={`history-${series.id}`} style={{gap:10}}>
   <Text>2022</Text>{label(index+6)}<View style={{flexDirection:'row',gap:8}}>{label(8)}<Text>{series.total.toLocaleString('en-US')} {labels?.[index+9]??data.labelsJa[index+9].text}</Text></View>
   {series.rows.map(row=><View key={row.id} testID={`history-${series.id}-${row.id}`} style={{gap:5}}>
    <RestaurantReading text={row.ja} segments={row.segments}/>{valid&&<TranslationText>{row.scientific}</TranslationText>}
    <Text>{row.value.toLocaleString('en-US')} {labels?.[index+9]??data.labelsJa[index+9].text}</Text>
    <View style={{height:14,width:'100%',backgroundColor:'#e7e0ce',borderRadius:3}}><View testID={`history-bar-${series.id}-${row.id}`} style={{height:'100%',width:`${row.value/series.total*100}%`,backgroundColor:index?'#517f9a':'#9a6357',borderRadius:3}}/></View>
   </View>)}
  </RoyalContentPanel>)}
  <RestaurantReading text={figure.caption.textJa} segments={figure.caption.furigana}/>{valid&&<TranslationText>{target.text}</TranslationText>}
 </View>;
}
