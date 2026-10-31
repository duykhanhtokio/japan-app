import {View,Text,StyleSheet} from 'react-native';
import {restaurantUi} from '@/data/restaurant';
import {useStudyAppearance,TranslationText} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';

const cuts=[['小口切り','こぐちぎり'],['斜め切り','ななめぎり'],['乱切り','らんぎり'],['ささがき','ささがき'],['輪切り','わぎり'],['半月切り','はんげつぎり'],['いちょう切り','いちょうぎり'],['色紙切り','しきしぎり'],['短冊切り','たんざくぎり'],['拍子木切り','ひょうしぎぎり'],['千切り','せんぎり'],['しらが','しらが'],['かつらむき','かつらむき'],['みじん切り','みじんぎり'],['サイの目切り','さいのめぎり'],['あられ切り','あられぎり']] as const;
const heading='野菜の切り方を形で比べる';
const caption='形を比べる模式図です。寸法はレシピと店の見本で確認します。';
/** Original geometric teaching marks. No source drawings or knife-handling demonstration. */
function Pieces({kind}:{kind:number}){
 const orange='#e98735',light='#fff3cb',edge='#a94e1f';
 if(kind===0||kind===1||kind===4)return <View style={s.drawing}>{[0,1,2].map(i=><View key={i} style={{position:'absolute',left:12+i*34,top:22+(i%2)*12,width:30,height:kind===1?18:30,borderRadius:30,backgroundColor:kind===0?'#cde89a':orange,borderWidth:kind===0?5:2,borderColor:kind===0?'#538e43':edge,transform:[{rotate:kind===1?'-30deg':'0deg'}]}}/>)}</View>;
 if(kind===5||kind===6)return <View style={s.drawing}>{[0,1,2].map(i=><View key={i} style={{position:'absolute',left:12+i*36,top:28,width:kind===5?32:22,height:kind===5?16:22,overflow:'hidden'}}><View style={{width:kind===5?32:44,height:kind===5?32:44,borderRadius:30,backgroundColor:orange,borderWidth:2,borderColor:edge}}/></View>)}</View>;
 if(kind===2||kind===3)return <View style={s.drawing}>{Array.from({length:kind===2?4:7},(_,i)=><View key={i} style={{position:'absolute',left:8+(i%4)*30,top:16+Math.floor(i/4)*30,width:0,height:0,borderLeftWidth:kind===2?13:4,borderRightWidth:kind===2?17:5,borderBottomWidth:kind===2?29:34,borderLeftColor:'transparent',borderRightColor:'transparent',borderBottomColor:kind===2?orange:'#bd975f',transform:[{rotate:`${i*23-30}deg`}]}}/>)}</View>;
 if(kind===7||kind>=13){const count=kind===13?36:kind===15?16:9,size=kind===13?4:kind===15?9:kind===7?22:17,cols=kind===13?9:kind===15?4:3;return <View style={s.drawing}>{Array.from({length:count},(_,i)=><View key={i} style={{position:'absolute',left:12+(i%cols)*(size+5),top:12+Math.floor(i/cols)*(size+5),width:size,height:kind===7?14:size,backgroundColor:orange,borderWidth:kind===13?0:1,borderColor:edge,borderRadius:kind===13?1:0}}/>)}</View>;}
 const count=kind===11?17:kind===10?10:kind===12?3:5,thickness=kind===11?1.5:kind===10?3:kind===12?18:kind===9?10:6;
 return <View style={s.drawing}>{Array.from({length:count},(_,i)=><View key={i} style={{position:'absolute',left:20+(i%2)*8,top:8+i*(kind===11?4:kind===10?6:kind===12?23:13),width:78,height:thickness,backgroundColor:kind===11||kind===12?light:orange,borderWidth:kind===11?0:1,borderColor:kind===12?'#ad9f79':edge,borderRadius:kind===12?7:1,transform:[{rotate:kind===12?'-7deg':'-12deg'}]}}/>)}</View>;
}
export function RestaurantCuttingGuide({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance();if(lessonId!=='rst-1-cook-05')return null;
 const translated=showTranslation&&language!=='ja';
 return <View testID="restaurant-cutting-guide" style={[s.box,{borderColor:colors.border}]}><RestaurantReading heading text={heading}/>{translated&&<TranslationText>{restaurantUi(heading,language)}</TranslationText>}<View style={s.grid}>{cuts.map(([name,reading],kind)=><View key={name} testID={`restaurant-cut-${kind}`} style={[s.card,{borderColor:colors.border}]}><View accessible accessibilityLabel={name}><Pieces kind={kind}/></View><RestaurantReading text={name} segments={[{text:name,reading}]}/>{translated&&<Text style={[s.label,{color:colors.text}]}>{restaurantUi(name,language)}</Text>}</View>)}</View><Text style={[s.label,{color:colors.muted}]}>{caption}</Text>{translated&&<TranslationText>{restaurantUi(caption,language)}</TranslationText>}</View>;
}
const s=StyleSheet.create({box:{borderWidth:1,borderRadius:10,padding:12,gap:10},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},card:{flexGrow:1,flexBasis:140,minWidth:130,borderWidth:1,borderRadius:8,padding:8,gap:5},drawing:{width:136,height:92,alignSelf:'center',backgroundColor:'#52605a',borderRadius:6,overflow:'hidden'},label:{fontSize:15,lineHeight:25}});
