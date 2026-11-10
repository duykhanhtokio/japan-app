/** Historical four-card alternative; active cook03 uses RestaurantVegetableClassificationFigure. */
import {useState} from 'react';
import {Image,View,useWindowDimensions} from 'react-native';
import type {RestaurantLesson} from '@/data/restaurant';
import data from '@/data/restaurant/royal-vegetable-groups.json';
import {useStudyAppearance,TranslationText} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';

const artwork=require('../../../assets/restaurant/royal-weekly-20261107/week04/rst-1-cook-03-vegetable-groups.webp');
export function restaurantHasVegetableGroupsFigure(lesson:Pick<RestaurantLesson,'id'|'sourceHash'>){return lesson.id===data.lessonId&&lesson.sourceHash===data.lessonSourceHash;}
/** Each ingredient occupies one verified quadrant; classification text stays native and localizable. */
function IngredientCard({group,index,language,showTranslation}:{group:typeof data.groups[number];index:number;language:string;showTranslation:boolean}){
 const [measured,setMeasured]=useState(0),window=useWindowDimensions(),{colors}=useStudyAppearance();
 const width=measured||Math.max(1,(Math.min(900,window.width-56)-12)/2),height=width*data.artwork.height/data.artwork.width;
 const translated=(data.labels as Record<string,string[]>)[language]?.[index];
 return <View testID={`restaurant-vegetable-group-${group.id}`} style={{width:'100%',gap:8,padding:8,borderWidth:1,borderColor:colors.border,borderRadius:8}}>
  <RestaurantReading heading text={group.ja} segments={group.segments}/>{showTranslation&&language!=='ja'&&translated&&<TranslationText>{translated}</TranslationText>}
  <View accessible accessibilityRole="image" accessibilityLabel={`${group.ja}${showTranslation&&language!=='ja'&&translated?` / ${translated}`:''}`} onLayout={event=>{const next=event.nativeEvent.layout.width;if(Number.isFinite(next)&&next>0)setMeasured(next);}} style={{width:'100%',height,overflow:'hidden',position:'relative',backgroundColor:'#fffaf0'}}>
   <Image source={artwork} accessible={false} resizeMode="cover" style={{position:'absolute',left:-group.column*width,top:-group.row*height,width:width*2,height:height*2}}/>
  </View>
 </View>;
}
export function RestaurantVegetableGroupsFigure({language,showTranslation}:{language:string;showTranslation:boolean}){
 const target=(data.caption.translations as Record<string,{sourceHash:string;text:string}>)[language];
 return <View testID="restaurant-native-vegetable-groups" style={{width:'100%',gap:12}}>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>{data.groups.map((group,index)=><View key={group.id} style={{width:'47%'}}><IngredientCard group={group} index={index} language={language} showTranslation={showTranslation}/></View>)}</View>
  <RestaurantReading text={data.caption.textJa} segments={data.caption.furigana}/>{showTranslation&&language!=='ja'&&target?.sourceHash===data.caption.sourceHash&&<TranslationText>{target.text}</TranslationText>}
 </View>;
}
