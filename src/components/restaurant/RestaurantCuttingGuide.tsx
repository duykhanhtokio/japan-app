import {Image,View,Text,StyleSheet} from 'react-native';
import {restaurantLesson,restaurantUi} from '@/data/restaurant';
import {useStudyAppearance,TranslationText} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';

import cuttingArtwork from '@/data/restaurant/royal-cutting-artwork.json';
const atlas=require('../../../assets/restaurant/royal-weekly-20261107/week05/cut-vegetable-objects-royal-v2.webp');

const cuts=[['小口切り','こぐちぎり'],['斜め切り','ななめぎり'],['乱切り','らんぎり'],['ささがき','ささがき'],['輪切り','わぎり'],['半月切り','はんげつぎり'],['いちょう切り','いちょうぎり'],['色紙切り','しきしぎり'],['短冊切り','たんざくぎり'],['拍子木切り','ひょうしぎぎり'],['千切り','せんぎり'],['しらが','しらが'],['かつらむき','かつらむき'],['みじん切り','みじんぎり'],['サイの目切り','さいのめぎり'],['あられ切り','あられぎり']] as const;
const heading='野菜の切り方を形で比べる';
const caption='形を比べる模式図です。寸法はレシピと店の見本で確認します。';
/** Keep the reviewed16 object crops bound to their named examples and current lesson. */
export function restaurantHasCuttingArtwork(){
 return restaurantLesson(cuttingArtwork.lessonId,'1')?.sourceHash===cuttingArtwork.lessonSourceHash&&heading===cuttingArtwork.titleJa&&caption===cuttingArtwork.captionJa&&JSON.stringify(cuts)===JSON.stringify(cuttingArtwork.cuts.map(c=>[c.nameJa,c.reading]));
}
/** Ingredient cut-shape examples, never a knife-handling or measured-dimension demonstration. */
function Pieces({kind}:{kind:number}){
 const item=cuttingArtwork.cuts[kind];if(!item||!restaurantHasCuttingArtwork())return null;
 const crop=item.crop;
 return <View testID={`restaurant-cut-object-${kind}`} accessible={false} style={s.drawing}><Image source={atlas} accessible={false} resizeMode="contain" style={{position:'absolute',width:`${cuttingArtwork.width/crop.width*100}%`,height:`${cuttingArtwork.height/crop.height*100}%`,left:`${-crop.x/crop.width*100}%`,top:`${-crop.y/crop.height*100}%`}}/></View>;
}
export function RestaurantCuttingGuide({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance();if(lessonId!=='rst-1-cook-05')return null;
 const translated=showTranslation&&language!=='ja';
 return <View testID="restaurant-cutting-guide" style={[s.box,{borderColor:colors.border}]}><RestaurantReading heading text={heading} segments={[{text:'野菜',reading:'やさい'},{text:'の'},{text:'切',reading:'き'},{text:'り'},{text:'方',reading:'かた'},{text:'を'},{text:'形',reading:'かたち'},{text:'で'},{text:'比',reading:'くら'},{text:'べる'}]}/>{translated&&<TranslationText>{restaurantUi(heading,language)}</TranslationText>}<View style={s.grid}>{cuts.map(([name,reading],kind)=><View key={name} testID={`restaurant-cut-${kind}`} style={[s.card,{borderColor:colors.border}]}><View accessible accessibilityLabel={name}><Pieces kind={kind}/></View><RestaurantReading text={name} segments={[{text:name,reading}]}/>{translated&&<Text style={[s.label,{color:colors.text}]}>{restaurantUi(name,language)}</Text>}</View>)}</View><RestaurantReading text={caption} segments={[{text:'形',reading:'かたち'},{text:'を'},{text:'比',reading:'くら'},{text:'べる'},{text:'模式図',reading:'もしきず'},{text:'です。'},{text:'寸法',reading:'すんぽう'},{text:'はレシピと'},{text:'店',reading:'みせ'},{text:'の'},{text:'見本',reading:'みほん'},{text:'で'},{text:'確認',reading:'かくにん'},{text:'します。'}]}/>{translated&&<TranslationText>{restaurantUi(caption,language)}</TranslationText>}</View>;
}
const s=StyleSheet.create({box:{borderWidth:1,borderRadius:10,padding:12,gap:10},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},card:{flexGrow:1,flexBasis:140,minWidth:130,borderWidth:1,borderRadius:8,padding:8,gap:5},drawing:{width:136,height:136,alignSelf:'center',backgroundColor:'#fffaf0',borderRadius:6,overflow:'hidden',position:'relative'},label:{fontSize:15,lineHeight:25}});
