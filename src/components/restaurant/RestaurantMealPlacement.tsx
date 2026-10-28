import {Text,View,StyleSheet} from 'react-native';
import placementData from '@/data/restaurant/meal-placement.json';
import {useStudyAppearance,TranslationText} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';

type MealTranslation={title:string;viewpoint:string;back:string;front:string;guest:string;caption:string;labels:Record<string,string>;positions:Record<string,string>};
type MealItem={id:string;labelJa:string;segments:{text:string;reading?:string}[];positionJa:string;kind:string};
const translations=placementData.translations as Record<string,MealTranslation>;
/** Independently drawn teaching marks. Guest perspective; never mirror the tray to the server's view. */
function Dish({kind}:{kind:string}){
 const soup=kind==='soup',rice=kind==='rice',main=kind==='main';
 return <View accessible={false} importantForAccessibility="no-hide-descendants" style={[s.dish,{width:main?62:48,height:main?31:36,borderRadius:main?5:24,backgroundColor:soup?'#703d2c':rice?'#fff8df':'#b9d3c5',borderColor:soup?'#4a251d':'#708d7c'}]}><View style={{width:main?42:29,height:main?12:19,borderRadius:main?5:14,backgroundColor:soup?'#be8b4e':rice?'#fffdf4':kind==='pickles'?'#799b4a':main?'#d9ac69':'#658744'}}/></View>;
}
export function RestaurantMealPlacement({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance();
 if(!placementData.lessonIds.includes(lessonId))return null;
 const t=showTranslation&&language!=='ja'?translations[language]:undefined;
 function cell(item:MealItem){
  const translation=t?.labels[item.id];
  return <View key={item.id} testID={`restaurant-meal-${item.id}`} accessible accessibilityLabel={`${item.positionJa}：${item.labelJa}${translation?`。${t?.positions[item.id]}: ${translation}`:''}`} style={[s.cell,item.kind==='middle'&&s.middle]}><Dish kind={item.kind}/><RestaurantReading text={item.labelJa} segments={item.segments}/>{translation&&<Text style={[s.translation,{color:colors.text}]}>{translation}</Text>}</View>;
 }
 return <View testID="restaurant-meal-placement" style={[s.box,{borderColor:colors.border}]}>
  <RestaurantReading heading text={placementData.titleJa} segments={[{text:'一汁三菜',reading:'いちじゅうさんさい'},{text:'の'},{text:'配置例',reading:'はいちれい'}]}/>
  {t&&<TranslationText>{t.title}</TranslationText>}
  <Text style={[s.orientation,{color:colors.text}]}>{placementData.viewpointJa}</Text>{t&&<TranslationText>{t.viewpoint}</TranslationText>}
  <View style={[s.tray,{borderColor:colors.border}]}>
   <Text style={[s.direction,{color:colors.muted}]}>{placementData.backJa}{t?` / ${t.back}`:''}</Text>
   <View testID="restaurant-meal-back-row" style={s.row}>{placementData.back.map(cell)}</View>
   <View testID="restaurant-meal-front-row" style={s.row}>{placementData.front.map(cell)}</View>
   <Text style={[s.direction,{color:colors.muted}]}>{placementData.frontJa}{t?` / ${t.front}`:''}</Text>
  </View>
  <Text style={[s.orientation,{color:colors.text}]}>{placementData.guestJa}{t?` / ${t.guest}`:''}</Text>
  <Text style={[s.caption,{color:colors.muted}]}>{placementData.captionJa}</Text>{t&&<TranslationText>{t.caption}</TranslationText>}
 </View>;
}
const s=StyleSheet.create({box:{borderWidth:1,borderRadius:10,padding:12,gap:10},orientation:{fontSize:16,lineHeight:26,textAlign:'center'},tray:{borderWidth:1,borderRadius:10,padding:8,gap:18,backgroundColor:'rgba(160,130,75,0.08)'},direction:{fontSize:14,lineHeight:23,textAlign:'center'},row:{flexDirection:'row',alignItems:'flex-start',gap:6},cell:{flex:1,minWidth:0,alignItems:'center',gap:6},middle:{paddingTop:26},dish:{borderWidth:2,alignItems:'center',justifyContent:'center'},translation:{fontSize:15,lineHeight:25,textAlign:'center',alignSelf:'stretch',flexShrink:1},caption:{fontSize:15,lineHeight:25}});
