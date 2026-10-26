import {Text,View,StyleSheet} from 'react-native';
import data from '@/data/food-manufacturing/diagrams.json';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
type DiagramTranslation={title:string;description:string;nodeLabels:Record<string,string>;edgeLabels:string[];note:string};
export function FoodConceptDiagrams({lessonId,textColor,language,showTranslation}:{lessonId:string;textColor:string;language:string;showTranslation:boolean}){
 return <>{data.diagrams.filter(d=>d.lessonIds.includes(lessonId as never)).map(d=>{
 const translated=(d.translations as Record<string,DiagramTranslation>)[language];
 const t=showTranslation&&language!=='ja'?translated:undefined;
 return <View key={d.id} testID={d.id} style={s.diagram} accessible accessibilityLabel={`${d.titleJa}。${d.descriptionJa}。${d.noteJa}${t?`。${t.title}。${t.description}。${t.note}`:''}`}>
 <Text style={[s.title,{color:textColor}]}>{d.titleJa}</Text>{t&&<TranslationText>{t.title}</TranslationText>}
 <Text style={[s.body,{color:textColor}]}>{d.descriptionJa}</Text>{t&&<TranslationText>{t.description}</TranslationText>}
 <View style={s.nodes}>{d.nodes.map(n=><View key={n.id} style={[s.node,{backgroundColor:n.color}]}><Text style={s.label}>{n.labelJa}</Text>{t?.nodeLabels[n.id]&&<Text style={s.nodeTranslation}>{t.nodeLabels[n.id]}</Text>}</View>)}</View>
 {d.edges.map((e,i)=><View key={i}><Text style={[s.body,{color:textColor}]}>{d.nodes.find(n=>n.id===e.from)?.labelJa} → {d.nodes.find(n=>n.id===e.to)?.labelJa}{e.labelJa?`：${e.labelJa}`:''}</Text>{t?.edgeLabels[i]&&<TranslationText>{t.edgeLabels[i]}</TranslationText>}</View>)}
 <Text style={[s.note,{color:textColor}]}>{d.noteJa}</Text>{t&&<TranslationText>{t.note}</TranslationText>}
 </View>;
 })}</>;
}
const s=StyleSheet.create({diagram:{paddingVertical:16,gap:12},title:{fontSize:18,lineHeight:28,fontWeight:'700'},body:{fontSize:16,lineHeight:26},nodes:{flexDirection:'row',flexWrap:'wrap',gap:12},node:{padding:16,borderRadius:10,minWidth:130,flexGrow:1},label:{fontSize:17,lineHeight:28,color:'#29251f'},nodeTranslation:{fontSize:16,lineHeight:26,color:'#3e382f',marginTop:8},note:{fontSize:14,lineHeight:24}});
