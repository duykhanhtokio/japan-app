import {useState} from 'react';
import {Image,Pressable,View,useWindowDimensions} from 'react-native';
import type {RestaurantLesson} from '@/data/restaurant';
import data from '@/data/restaurant/royal-fish-parts.json';
import {useStudyAppearance,TranslationText} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';
const artwork=require('../../../assets/restaurant/royal-weekly-20261107/week03/fish-body-objects.webp');
export function restaurantHasFishPartsFigure(lesson:Pick<RestaurantLesson,'id'|'sourceHash'>){return lesson.id===data.lessonId&&lesson.sourceHash===data.lessonSourceHash;}
/** Only the existing whole-fish pixel window is used; code controls marker location and labels. */
export function RestaurantFishPartsFigure({language,showTranslation}:{language:string;showTranslation:boolean}){
 const [selected,setSelected]=useState(0),[measured,setMeasured]=useState(0),window=useWindowDimensions(),{colors}=useStudyAppearance();
 const width=Math.min(900,measured||Math.max(1,window.width-56)),height=width*data.artwork.wholeFishCrop.height/data.artwork.width,part=data.parts[selected]??data.parts[0];
 const targetLabels=(data.labels as Record<string,string[]>)[language],targetCaption=(data.caption.translations as Record<string,{sourceHash:string;text:string}>)[language];
 const partSegments=[{text:`${part.id}. `},{text:part.ja,...(part.reading?{reading:part.reading}:{})}];
 return <View testID="restaurant-native-fish-parts" style={{gap:12,width:'100%'}} onLayout={event=>{const next=event.nativeEvent.layout.width;if(Number.isFinite(next)&&next>0)setMeasured(next);}}>
  <RestaurantReading heading text={`${part.id}. ${part.ja}`} segments={partSegments}/>{showTranslation&&language!=='ja'&&targetLabels?.[selected]&&<TranslationText>{targetLabels[selected]}</TranslationText>}
  <View testID={`restaurant-fish-part-selected-${part.id}`} accessible accessibilityRole="image" accessibilityLabel={`${part.id}. ${part.ja}${showTranslation&&language!=='ja'&&targetLabels?.[selected]?` / ${targetLabels[selected]}`:''}`} style={{width,height,overflow:'hidden',position:'relative',alignSelf:'center',backgroundColor:'#fffaf0'}}>
   <Image source={artwork} resizeMode="contain" accessible={false} style={{position:'absolute',left:0,top:0,width,height:width*data.artwork.height/data.artwork.width}}/>
   <View pointerEvents="none" style={{position:'absolute',left:part.point[0]*width/data.artwork.width-7,top:part.point[1]*width/data.artwork.width-7,width:14,height:14,borderRadius:7,borderWidth:2,borderColor:'#a53532',backgroundColor:'transparent'}}/>
  </View>
  <View style={{gap:8,flexDirection:'row',flexWrap:'wrap'}}>{data.parts.map((item,index)=><Pressable key={item.id} testID={`restaurant-fish-part-choice-${item.id}`} accessibilityRole="button" accessibilityLabel={`${item.id}. ${item.ja}${showTranslation&&language!=='ja'&&targetLabels?.[index]?` / ${targetLabels[index]}`:''}`} accessibilityState={{selected:selected===index}} onPress={()=>setSelected(index)} style={{width:'47%',minHeight:48,padding:10,borderWidth:1,borderRadius:8,borderColor:colors.border,backgroundColor:selected===index?colors.translation:colors.background}}>
   <RestaurantReading text={`${item.id}. ${item.ja}`} segments={[{text:`${item.id}. `},{text:item.ja,...(item.reading?{reading:item.reading}:{})}]}/>{showTranslation&&language!=='ja'&&targetLabels?.[index]&&<TranslationText>{targetLabels[index]}</TranslationText>}
  </Pressable>)}</View>
  <RestaurantReading text={data.caption.textJa} segments={data.caption.furigana}/>{showTranslation&&language!=='ja'&&targetCaption?.sourceHash===data.caption.sourceHash&&<TranslationText>{targetCaption.text}</TranslationText>}
 </View>;
}
