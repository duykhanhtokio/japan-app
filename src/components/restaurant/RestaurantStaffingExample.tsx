import {useState} from 'react';
import {Text,View,useWindowDimensions} from 'react-native';
import type {RestaurantLesson} from '@/data/restaurant';
import data from '@/data/restaurant/royal-staffing-example.json';
import daily from '@/data/restaurant/daily-learning.json';
import {TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {RoyalContentPanel} from '@/components/ui/RoyalPanels';
import {RestaurantReading} from './RestaurantReading';

export function restaurantHasStaffingExample(lesson:Pick<RestaurantLesson,'id'|'sourceHash'>){
 return lesson.id===data.lessonId&&lesson.sourceHash===data.lessonSourceHash&&daily.royalNativeCompanions.some(b=>b.lessonId===lesson.id&&b.sourceHash===lesson.sourceHash&&b.figureId==='rst-native-worked-staffing');
}
export function restaurantCombinedStaffHours(){return data.plannedSalesYen/data.targetSalesPerStaffHourYen;}
export function restaurantStaffingGeometry(width:number){const horizontal=width>=680;return {horizontal,cardWidth:horizontal?(width-72)/3:width};}
const headings=[
 [{text:'総実働時間',reading:'そうじつどうじかん'},{text:'を'},{text:'見積もる',reading:'みつもる'},{text:'：'},{text:'独自練習',reading:'どくじれんしゅう'}],
 [{text:'計画売上',reading:'けいかくうりあげ'}],
 [{text:'目標人時売上高',reading:'もくひょうにんじうりあげだか'}],
 [{text:'総実働時間',reading:'そうじつどうじかん'},{text:'（'},{text:'全員分',reading:'ぜんいんぶん'},{text:'の'},{text:'合計',reading:'ごうけい'},{text:'）'}],
];
const number=(value:number)=>String(value).replace(/\B(?=(\d{3})+(?!\d))/g,',');
export function RestaurantStaffingExample({lesson,language,showTranslation}:{lesson:RestaurantLesson;language:string;showTranslation:boolean}){
 const [measured,setMeasured]=useState(0),window=useWindowDimensions(),{colors}=useStudyAppearance();if(!restaurantHasStaffingExample(lesson))return null;
 const width=measured||Math.max(1,Math.min(900,window.width-72)),geometry=restaurantStaffingGeometry(width),hours=restaurantCombinedStaffHours();
 const ja=data.labels.ja,target=(data.labels as Record<string,string[]>)[language],caption=(data.caption.translations as Record<string,{sourceHash:string;text:string}>)[language];
 const values=[{index:1,value:data.plannedSalesYen,unit:4},{index:2,value:data.targetSalesPerStaffHourYen,unit:5},{index:3,value:hours,unit:6}];
 const heading=(index:number)=><View style={{gap:4}}><RestaurantReading heading text={ja[index]} segments={headings[index]}/>{showTranslation&&language!=='ja'&&target?.[index]&&<TranslationText>{target[index]}</TranslationText>}</View>;
 return <View testID="restaurant-worked-staffing" style={{width:'100%'}}><RoyalContentPanel style={{width:'100%',gap:16}}>
  {heading(0)}
  <View testID="restaurant-staffing-equation" onLayout={event=>{const next=event.nativeEvent.layout.width;if(Number.isFinite(next)&&next>0)setMeasured(next);}} style={{width:'100%',gap:8,flexDirection:geometry.horizontal?'row':'column',alignItems:'center'}}>
   {values.map((item,index)=><View key={item.index} style={{gap:8,flexDirection:geometry.horizontal?'row':'column',alignItems:'center'}}>
    {index>0&&<Text accessible accessibilityLabel={index===1?'÷':'='} style={{fontSize:28,width:20,textAlign:'center',color:colors.text}}>{index===1?'÷':'='}</Text>}
    <View testID={`restaurant-staffing-value-${item.index}`} style={{width:geometry.cardWidth,borderWidth:1,borderColor:colors.border,borderRadius:8,padding:12,gap:10}}>
     {heading(item.index)}<RestaurantReading text={`${number(item.value)} ${ja[item.unit]}`}/>{showTranslation&&language!=='ja'&&target?.[item.unit]&&<TranslationText>{number(item.value)} {target[item.unit]}</TranslationText>}
    </View>
   </View>)}
  </View>
  <RestaurantReading text={data.caption.textJa} segments={data.caption.furigana}/>{showTranslation&&language!=='ja'&&caption?.sourceHash===data.caption.sourceHash&&<TranslationText>{caption.text}</TranslationText>}
 </RoyalContentPanel></View>;
}
