import {Text,View,StyleSheet} from 'react-native';
import {restaurantDiagrams} from '@/data/restaurant';
import {useStudyAppearance,TranslationText} from '@/components/tokutei/StudyAppearance';
export function RestaurantDiagrams({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance();
 return <>{restaurantDiagrams.filter(d=>d.lessonIds.includes(lessonId)).map(d=>{const t=showTranslation&&language!=='ja'?d.translations[language]:null;return <View key={d.id} testID={`restaurant-diagram-${d.id}`} style={[s.box,{borderColor:colors.border}]}>
 <Text style={[s.heading,{color:colors.text}]}>{d.titleJa}</Text>{t&&<TranslationText>{t.title}</TranslationText>}
 <View style={s.nodes}>{d.nodes.map((node,index)=><View key={node.id} style={[s.node,{backgroundColor:node.color}]}><Text style={s.label}>{d.kind==='flow'?`${index+1}. `:''}{node.labelJa}</Text>{t?.labels[node.id]&&<Text style={s.translation}>{t.labels[node.id]}</Text>}</View>)}</View>
 {d.links.length>0&&<View style={s.links}>{d.links.map((link,i)=>{const from=d.nodes.find(n=>n.id===link.from),to=d.nodes.find(n=>n.id===link.to);return from&&to?<Text key={i} style={[s.relation,{color:colors.text}]}>{from.labelJa} → {to.labelJa}</Text>:null;})}</View>}
 <Text style={[s.caption,{color:colors.muted}]}>{d.captionJa}</Text>{t&&<TranslationText>{t.caption}</TranslationText>}
 </View>;})}</>;
}
const s=StyleSheet.create({box:{padding:14,borderWidth:1,borderRadius:10,gap:12},heading:{fontSize:18,fontWeight:'700',lineHeight:28},nodes:{flexDirection:'row',flexWrap:'wrap',gap:10},node:{padding:14,borderRadius:8,flexGrow:1,flexBasis:140,minWidth:100},label:{fontSize:17,color:'#29251e',lineHeight:27,fontWeight:'600'},translation:{fontSize:15,color:'#3e382f',lineHeight:25,marginTop:8},links:{gap:7},relation:{fontSize:15,lineHeight:24},caption:{fontSize:15,lineHeight:25}});
