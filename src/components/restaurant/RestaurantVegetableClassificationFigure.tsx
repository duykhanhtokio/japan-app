import {useState} from 'react';
import {Image,View,useWindowDimensions} from 'react-native';
import type {RestaurantLesson} from '@/data/restaurant';
import data from '@/data/restaurant/royal-vegetable-classification.json';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {RoyalContentPanel} from '@/components/ui/RoyalPanels';
import {RestaurantReading} from './RestaurantReading';
const assets:Record<string,number>={
 carrot:require('../../../assets/agriculture/royal-weekly-20261107/week01/carrot.webp'),
 daikon:require('../../../assets/agriculture/royal-weekly-20261107/week01/daikon.webp'),
 potato:require('../../../assets/agriculture/royal-weekly-20261107/week01/potato.webp'),
 'chinese-cabbage':require('../../../assets/agriculture/royal-weekly-20261107/week01/chinese-cabbage.webp'),
 cabbage:require('../../../assets/agriculture/royal-weekly-20261107/week01/cabbage.webp'),
 onion:require('../../../assets/agriculture/royal-weekly-20261107/week01/onion.webp'),
 spinach:require('../../../assets/agriculture/royal-weekly-20261107/week01/spinach.webp'),
 eggplant:require('../../../assets/agriculture/royal-weekly-20261107/week01/eggplant.webp'),
 tomato:require('../../../assets/agriculture/royal-weekly-20261107/week01/tomato.webp'),
 cucumber:require('../../../assets/agriculture/royal-weekly-20261107/week01/cucumber.webp'),
};
export function restaurantHasVegetableClassification(lesson:Pick<RestaurantLesson,'id'|'sourceHash'>){return lesson.id===data.lessonId&&lesson.sourceHash===data.lessonSourceHash;}
/** Reuse reviewed whole-specimen art; preserve the cooking source's own culinary groups. */
export function RestaurantVegetableClassificationFigure({language,showTranslation}:{language:string;showTranslation:boolean}){
 const [measured,setMeasured]=useState(0),window=useWindowDimensions(),width=measured||Math.max(1,window.width-56),columns=width>=540?3:width>=320?2:1,cardWidth=(width-8*(columns-1))/columns;
 const names=(data.labels as Record<string,string[]>)[language],categories=(data.categoryLabels as Record<string,string[]>)[language],caption=(data.caption.translations as Record<string,{sourceHash:string;text:string}>)[language];
 return <View testID="restaurant-native-vegetable-classification" style={{gap:16,width:'100%'}} onLayout={event=>{const next=event.nativeEvent.layout.width;if(Number.isFinite(next)&&next>0)setMeasured(next);}}>
  {data.groups.map((group,groupIndex)=><View key={group.id} testID={`restaurant-vegetable-group-${group.id}`} style={{gap:10}}>
   <RestaurantReading heading text={group.ja} segments={[{text:group.ja,reading:group.reading}]}/>{showTranslation&&language!=='ja'&&categories?.[groupIndex]&&<TranslationText>{categories[groupIndex]}</TranslationText>}
   <View style={{gap:8,flexDirection:'row',flexWrap:'wrap'}}>{group.itemIds.map(id=>{const itemIndex=data.items.findIndex(item=>item.id===id),item=data.items[itemIndex];if(!item)return null;return <RoyalContentPanel key={id} style={{width:cardWidth,gap:8}}>
    <Image testID={`restaurant-vegetable-${id}`} source={assets[id]} accessibilityLabel={`${item.ja}${showTranslation&&language!=='ja'&&names?.[itemIndex]?` / ${names[itemIndex]}`:''}`} resizeMode="cover" style={{width:'100%',aspectRatio:item.width/item.height}}/>
    <RestaurantReading text={item.ja}/>{showTranslation&&language!=='ja'&&names?.[itemIndex]&&<TranslationText>{names[itemIndex]}</TranslationText>}
   </RoyalContentPanel>;})}</View>
  </View>)}
  <RestaurantReading text={data.caption.textJa} segments={data.caption.furigana}/>{showTranslation&&language!=='ja'&&caption?.sourceHash===data.caption.sourceHash&&<TranslationText>{caption.text}</TranslationText>}
 </View>;
}
