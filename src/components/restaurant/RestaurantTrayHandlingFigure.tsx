import {View,Text} from 'react-native';
import type {RestaurantLesson} from '@/data/restaurant';
import {RoyalContentPanel} from '@/components/ui/RoyalPanels';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';
import data from '@/data/restaurant/royal-tray-handling.json';

export function restaurantHasTrayHandling(lesson:Pick<RestaurantLesson,'id'|'sourceHash'>){return lesson.id===data.lessonId&&lesson.sourceHash===data.lessonSourceHash;}
/** Source-p12 technical plan, not a photo, a measured load limit or an anatomical grip model. */
export function RestaurantTrayHandlingFigure({language,showTranslation}:{language:string;showTranslation:boolean}){
 const translated=(data.caption.translations as Record<string,{sourceHash:string;text:string}>)[language];
 return <View testID="restaurant-native-tray-handling" style={{width:'100%',gap:12}}>
  <RoyalContentPanel style={{gap:8}}>
   <RestaurantReading text="トレイを真上から見る" segments={[{text:'トレイを'},{text:'真上',reading:'まうえ'},{text:'から'},{text:'見る',reading:'みる'}]}/>
   <View accessible accessibilityRole="image" accessibilityLabel={data.caption.textJa} style={{width:'100%',aspectRatio:1,backgroundColor:'#f4ecd9',borderRadius:24,borderWidth:4,borderColor:'#7b694b',position:'relative'}}>
    <View testID="tray-far-low" style={{position:'absolute',left:'34%',top:'13%',width:'32%',height:'24%',borderRadius:999,borderWidth:3,borderColor:'#58646a',backgroundColor:'#fffaf0',alignItems:'center',justifyContent:'center'}}><Text>②</Text></View>
    <View testID="tray-near-heavy" style={{position:'absolute',left:'11%',top:'53%',width:'46%',height:'34%',borderRadius:999,borderWidth:4,borderColor:'#58646a',backgroundColor:'#fffaf0',alignItems:'center',justifyContent:'center'}}><Text>①</Text></View>
    <View testID="tray-near-tall" style={{position:'absolute',left:'67%',top:'61%',width:'20%',height:'20%',borderRadius:999,borderWidth:3,borderColor:'#528b9c',backgroundColor:'#d4e6e9',alignItems:'center',justifyContent:'center'}}><Text>①</Text></View>
   </View>
   <RestaurantReading text="持つ人側" segments={[{text:'持つ',reading:'もつ'},{text:'人側',reading:'ひとがわ'}]}/>
  </RoyalContentPanel>
  <RoyalContentPanel style={{gap:8}}>
   <RestaurantReading text="グラスの下半分を持つ" segments={[{text:'グラスの'},{text:'下半分',reading:'したはんぶん'},{text:'を'},{text:'持つ',reading:'もつ'}]}/>
   <View accessible accessibilityRole="image" accessibilityLabel="グラスの口を避け、下半分に接触する位置を示す模式図" style={{width:'100%',aspectRatio:1.5,alignItems:'center',justifyContent:'center'}}>
    <View style={{width:'38%',height:'84%',borderWidth:3,borderColor:'#528b9c',borderBottomLeftRadius:16,borderBottomRightRadius:16,overflow:'hidden'}}><View testID="glass-lower-contact" style={{position:'absolute',bottom:0,width:'100%',height:'50%',backgroundColor:'#cee2d2',borderTopWidth:2,borderStyle:'dashed',borderColor:'#52816a'}}/></View>
   </View>
  </RoyalContentPanel>
  <RestaurantReading text={data.caption.textJa} segments={data.caption.furigana}/>{showTranslation&&language!=='ja'&&translated?.sourceHash===data.caption.sourceHash&&<TranslationText>{translated.text}</TranslationText>}
 </View>;
}
