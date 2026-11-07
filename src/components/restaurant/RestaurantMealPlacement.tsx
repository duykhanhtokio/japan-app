import {restaurantLesson,type RestaurantLesson} from '@/data/restaurant';
import {Image,Text,View,StyleSheet} from 'react-native';
import placementData from '@/data/restaurant/meal-placement.json';
import {useStudyAppearance,TranslationText} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';

type MealTranslation={sourceHash:string;title:string;viewpoint:string;back:string;front:string;guest:string;caption:string;labels:Record<string,string>;positions:Record<string,string>};
type MealItem={id:string;labelJa:string;segments:{text:string;reading?:string}[];positionJa:string;kind:string};
const mealFood=require('../../../assets/restaurant/royal-weekly-20261107/week08/meal-food-objects.webp');
const foodCells:Record<string,number>={rice:0,soup:1,main:2,side:3,middle:4};
const translations=placementData.translations as Record<string,MealTranslation>;
const lessonHashes=placementData.lessonSourceHashes as Record<string,string>;
export function restaurantHasMealPlacement(lesson:Pick<RestaurantLesson,'id'|'sourceHash'>){return placementData.lessonIds.includes(lesson.id)&&lessonHashes[lesson.id]===lesson.sourceHash;}
const sourceSignature=()=>JSON.stringify({titleJa:placementData.titleJa,viewpointJa:placementData.viewpointJa,backJa:placementData.backJa,frontJa:placementData.frontJa,guestJa:placementData.guestJa,captionJa:placementData.captionJa,back:placementData.back,front:placementData.front});
/** Independently drawn teaching marks. Guest perspective; never mirror the tray to the server's view. */
function Dish({kind}:{kind:string}){
 const soup=kind==='soup',rice=kind==='rice',main=kind==='main';
 const cell=foodCells[kind];if(cell!==undefined)return <View testID={`restaurant-meal-object-${kind}`} accessible={false} style={{width:'100%',maxWidth:84,aspectRatio:1,overflow:'hidden',position:'relative'}}><Image source={mealFood} accessible={false} resizeMode="contain" style={{position:'absolute',width:'300%',height:'200%',left:`${-(cell%3)*100}%`,top:`${-Math.floor(cell/3)*100}%`}}/></View>;
 return <View accessible={false} importantForAccessibility="no-hide-descendants" style={[s.dish,{width:main?62:48,height:main?31:36,borderRadius:main?5:24,backgroundColor:soup?'#703d2c':rice?'#fff8df':'#b9d3c5',borderColor:soup?'#4a251d':'#708d7c'}]}><View style={{width:main?42:29,height:main?12:19,borderRadius:main?5:14,backgroundColor:soup?'#be8b4e':rice?'#fffdf4':kind==='pickles'?'#799b4a':main?'#d9ac69':'#658744'}}/></View>;
}
export function RestaurantMealPlacement({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance();
 const lesson=restaurantLesson(lessonId,'1');if(!lesson||!restaurantHasMealPlacement(lesson))return null;
 const candidate=translations[language],t=showTranslation&&language!=='ja'&&sourceSignature()===placementData.sourceSignature&&candidate?.sourceHash===placementData.sourceRevision?candidate:undefined;
 function cell(item:MealItem){
  const translation=t?.labels[item.id];
  return <View key={item.id} testID={`restaurant-meal-${item.id}`} accessible accessibilityLabel={`${item.positionJa}：${item.labelJa}${translation?`。${t?.positions[item.id]}: ${translation}`:''}`} style={[s.cell,item.kind==='middle'&&s.middle]}><Dish kind={item.kind}/><RestaurantReading text={item.labelJa} segments={item.segments}/>{translation&&<Text style={[s.translation,{color:colors.text}]}>{translation}</Text>}</View>;
 }
 return <View testID="restaurant-meal-placement" style={[s.box,{borderColor:colors.border}]}>
  <RestaurantReading heading text={placementData.titleJa} segments={[{text:'一汁三菜',reading:'いちじゅうさんさい'},{text:'の'},{text:'配置例',reading:'はいちれい'}]}/>
  {t&&<TranslationText>{t.title}</TranslationText>}
  <RestaurantReading text={placementData.viewpointJa} segments={[{text:'お客様',reading:'おきゃくさま'},{text:'から'},{text:'見',reading:'み'},{text:'た'},{text:'向',reading:'む'},{text:'き'}]}/>{t&&<TranslationText>{t.viewpoint}</TranslationText>}
  <View style={[s.tray,{borderColor:colors.border}]}>
   <View style={{alignItems:'center',gap:4}}><RestaurantReading text={placementData.backJa} segments={[{text:'奥',reading:'おく'}]}/>{t&&<TranslationText>{t.back}</TranslationText>}</View>
   <View testID="restaurant-meal-back-row" style={s.row}>{placementData.back.map(cell)}</View>
   <View testID="restaurant-meal-front-row" style={s.row}>{placementData.front.map(cell)}</View>
   <View style={{alignItems:'center',gap:4}}><RestaurantReading text={placementData.frontJa} segments={[{text:'手前',reading:'てまえ'}]}/>{t&&<TranslationText>{t.front}</TranslationText>}</View>
  </View>
  <View style={{alignItems:'center',gap:4}}><RestaurantReading text={placementData.guestJa} segments={[{text:'お客様',reading:'おきゃくさま'},{text:'はこちら'}]}/>{t&&<TranslationText>{t.guest}</TranslationText>}</View>
  <RestaurantReading text={placementData.captionJa} segments={[{text:'基本的',reading:'きほんてき'},{text:'な'},{text:'一例',reading:'いちれい'},{text:'です。'},{text:'器',reading:'うつわ'},{text:'の'},{text:'形',reading:'かたち'},{text:'・'},{text:'料理',reading:'りょうり'},{text:'の'},{text:'内容',reading:'ないよう'},{text:'・'},{text:'配膳順',reading:'はいぜんじゅん'},{text:'は、'},{text:'店',reading:'みせ'},{text:'の'},{text:'見本',reading:'みほん'},{text:'と'},{text:'献立',reading:'こんだて'},{text:'で'},{text:'確認',reading:'かくにん'},{text:'します。'}]}/>{t&&<TranslationText>{t.caption}</TranslationText>}
 </View>;
}
const s=StyleSheet.create({box:{borderWidth:1,borderRadius:10,padding:12,gap:10},orientation:{fontSize:16,lineHeight:26,textAlign:'center'},tray:{borderWidth:1,borderRadius:10,padding:8,gap:18,backgroundColor:'rgba(160,130,75,0.08)'},direction:{fontSize:14,lineHeight:23,textAlign:'center'},row:{flexDirection:'row',alignItems:'flex-start',gap:6},cell:{flex:1,minWidth:0,alignItems:'center',gap:6},middle:{paddingTop:26},dish:{borderWidth:2,alignItems:'center',justifyContent:'center'},translation:{fontSize:15,lineHeight:25,textAlign:'center',alignSelf:'stretch',flexShrink:1},caption:{fontSize:15,lineHeight:25}});
