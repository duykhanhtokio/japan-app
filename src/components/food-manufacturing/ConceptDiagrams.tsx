import {foodRoyalWeek4NativeFor} from '@/data/food-manufacturing/royal-week4-native';
import {foodManufacturingLesson} from '@/data/food-manufacturing';
import {Image,Text,View,StyleSheet,type ImageSourcePropType} from 'react-native';
import data from '@/data/food-manufacturing/diagrams.json';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
/** Exact classifications remain native/localized; art supplies contextual examples only. */
const royalWeek1Hazards:Record<string,ImageSourcePropType>={
 '1':require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/hard-foreign-material.webp'),
 '2':require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/chemical-required-rinse.webp'),
 '3':require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/invisible-microbiological-risk.webp'),
};
const royalHazardLessons=new Set(['food-1-003','food-1-004','food-1-005','food-1-006','food-1-008','food-2-007']);
type DiagramTranslation={title:string;description:string;nodeLabels:Record<string,string>;edgeLabels:string[];note:string};
export function FoodConceptDiagrams({lessonId,textColor,language,showTranslation,dailyPlacement=false}:{lessonId:string;textColor:string;language:string;showTranslation:boolean;dailyPlacement?:boolean}){
 if(lessonId==='food-2-007'&&!dailyPlacement)return null;
 const current=foodManufacturingLesson(lessonId,lessonId.startsWith('food-1-')?'1':'2');
 if(!dailyPlacement&&current&&['traceability','productivity'].includes(foodRoyalWeek4NativeFor(current)?.kind??''))return null;
 return <>{data.diagrams.filter(d=>d.lessonIds.includes(lessonId as never)).map(d=>{
 const translated=(d.translations as Record<string,DiagramTranslation>)[language];
 const t=showTranslation&&language!=='ja'?translated:undefined;
 const royalHazards=d.id==='food-hazards'&&royalHazardLessons.has(lessonId);
 return <View key={d.id} testID={d.id} style={s.diagram} accessible accessibilityLabel={`${d.titleJa}。${d.descriptionJa}。${d.noteJa}${t?`。${t.title}。${t.description}。${t.note}`:''}`}>
 <Text style={[s.title,{color:textColor}]}>{d.titleJa}</Text>{t&&<TranslationText>{t.title}</TranslationText>}
 <Text style={[s.body,{color:textColor}]}>{d.descriptionJa}</Text>{t&&<TranslationText>{t.description}</TranslationText>}
 <View style={s.nodes}>{d.nodes.map(n=><View key={n.id} style={[s.node,{backgroundColor:n.color},royalHazards?s.royalNode:null]}>{royalHazards&&<Image source={royalWeek1Hazards[n.id]} accessibilityLabel={n.labelJa} resizeMode="contain" style={s.royalImage}/>}<Text style={s.label}>{n.labelJa}</Text>{t?.nodeLabels[n.id]&&<Text style={s.nodeTranslation}>{t.nodeLabels[n.id]}</Text>}</View>)}</View>
 {d.edges.map((e,i)=><View key={i}><Text style={[s.body,{color:textColor}]}>{d.nodes.find(n=>n.id===e.from)?.labelJa} → {d.nodes.find(n=>n.id===e.to)?.labelJa}{e.labelJa?`：${e.labelJa}`:''}</Text>{t?.edgeLabels[i]&&<TranslationText>{t.edgeLabels[i]}</TranslationText>}</View>)}
 <Text style={[s.note,{color:textColor}]}>{d.noteJa}</Text>{t&&<TranslationText>{t.note}</TranslationText>}
 </View>;
 })}</>;
}
const s=StyleSheet.create({royalImage:{width:'100%',height:undefined,aspectRatio:1.5,borderRadius:8,marginBottom:12},royalNode:{width:'100%',flexBasis:'100%',minWidth:0,borderWidth:1,borderColor:'#b49b62',borderRadius:12,backgroundColor:'#fffaf0',shadowColor:'#183044',shadowOpacity:0.12,shadowOffset:{width:0,height:3},shadowRadius:5,elevation:2},diagram:{paddingVertical:16,gap:12},title:{fontSize:18,lineHeight:28,fontWeight:'700'},body:{fontSize:16,lineHeight:26},nodes:{flexDirection:'row',flexWrap:'wrap',gap:12},node:{padding:16,borderRadius:10,minWidth:130,flexGrow:1},label:{fontSize:17,lineHeight:28,color:'#29251f'},nodeTranslation:{fontSize:16,lineHeight:26,color:'#3e382f',marginTop:8},note:{fontSize:14,lineHeight:24}});
