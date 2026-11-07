import {RestaurantServingObjectArtwork} from './RestaurantServingObjectArtwork';
import {View,Text} from 'react-native';
import type {RestaurantLesson} from '@/data/restaurant';
import {RoyalContentPanel} from '@/components/ui/RoyalPanels';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';
import data from '@/data/restaurant/royal-cutlery-setting.json';
export function restaurantHasCutlerySetting(lesson:Pick<RestaurantLesson,'id'|'sourceHash'>){return lesson.id===data.lessonId&&lesson.sourceHash===data.lessonSourceHash;}
/** Technical guest-view place setting. Shapes carry no scale or meal-completion claim. */
export function RestaurantCutleryFigure({language,showTranslation}:{language:string;showTranslation:boolean}){
 const names=(data.labels as Record<string,string[]>)[language],caption=(data.caption.translations as Record<string,{sourceHash:string;text:string}>)[language],translated=showTranslation&&language!=='ja'&&caption?.sourceHash===data.caption.sourceHash&&JSON.stringify({namesJa:data.namesJa,textJa:data.caption.textJa})===data.sourceSignature;
 return <RoyalContentPanel style={{width:'100%',gap:10}}>
  <View testID="restaurant-native-cutlery-setting" accessible accessibilityRole="image" accessibilityLabel={translated?caption.text:data.caption.textJa} style={{width:'100%',aspectRatio:1.25,position:'relative',backgroundColor:'#f6edda',borderRadius:10}}>
   <View testID="cutlery-plate" style={{position:'absolute',left:'26%',top:'23%',width:'38%',height:'48%'}}><RestaurantServingObjectArtwork kind="plate" scope="cutlery"/></View>
   <View testID="cutlery-fork-left" style={{position:'absolute',left:'12%',top:'18%',width:'9%',height:'62%'}}><RestaurantServingObjectArtwork kind="fork" scope="cutlery"/></View>
   <View testID="cutlery-knife-right-edge-inward" style={{position:'absolute',left:'69%',top:'18%',width:'6%',height:'62%'}}><RestaurantServingObjectArtwork kind="knife" scope="cutlery"/></View>
   <View testID="cutlery-spoon-right-of-knife" style={{position:'absolute',left:'82%',top:'18%',width:'9%',height:'62%'}}><RestaurantServingObjectArtwork kind="spoon" scope="cutlery"/></View>
   {[['①','12%'],['②','68%'],['③','82%']].map(([text,left])=><Text key={text} style={{position:'absolute',left:left as `${number}%`,top:'84%'}}>{text}</Text>)}
  </View>
  {data.namesJa.map((name,i)=><View key={name}><RestaurantReading text={`${i+1} ${name}`}/>{translated&&names?.[i]&&<TranslationText>{names[i]}</TranslationText>}</View>)}
  <RestaurantReading text={data.caption.textJa} segments={data.caption.furigana}/>{translated&&<TranslationText>{caption.text}</TranslationText>}
 </RoyalContentPanel>;
}
