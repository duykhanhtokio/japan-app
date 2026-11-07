import {FoodRoyalNativeLabel} from './FoodRoyalNativeLabel';
import {useState} from 'react';
import ui from '@/data/food-manufacturing/daily-ui-translations.json';
import {foodManufacturingTranslation} from '@/data/food-manufacturing';
import {foodRoyalWeek4NativeFor} from '@/data/food-manufacturing/royal-week4-native';
import type {FoodManufacturingLesson} from '@/data/food-manufacturing';
import {foodConceptDiagramsFor} from '@/data/food-manufacturing/concept-source-bindings';
import {Image,Modal,Pressable,ScrollView,Text,View,StyleSheet,type ImageSourcePropType} from 'react-native';
import data from '@/data/food-manufacturing/diagrams.json';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
/** Exact classifications remain native/localized; art supplies contextual examples only. */
const royalWeek1Hazards:Record<string,ImageSourcePropType>={
 '1':require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/hard-foreign-material.webp'),
 '2':require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/chemical-required-rinse.webp'),
 '3':require('../../../assets/food-manufacturing/royal-weekly-20261107/week01/invisible-microbiological-risk.webp'),
};
const royalHazardLessons=new Set(['food-1-003','food-1-004','food-1-005','food-1-006','food-1-008','food-2-007']);
const royalHazardRevisions:Record<string,string>={"food-1-003":"9bd216b9c3c11e32803f28f3f6740c34b8c96e35e6e56c0fd482054def3c7029","food-1-004":"6911628f4a2d61b097b0f80bf1e32061bc485ac2b5813ab7cef692949a4aa2a8","food-1-005":"298acfaa70a42605cf77973fb655a3e1cae8c1114a4ab3590310330e0e161d11","food-1-006":"5d2fd13ee866967e7835db2fa5b5a8e0601319f031f8d94eda10d24a071c0a7e","food-1-008":"fcf88fc7f6cb2365c4938fc81838062ed3d72f005a6f9da543d23d5bc439d28a","food-2-007":"2c629338cf4134af24042aa8117f076098f72b14aa556c9ceabb9723393d1f00"};
const royalHazardNodeLabels:Record<string,string>={
 "1": "物理的危害要因\n硬い異物など",
 "2": "化学的危害要因\n有害な化学物質など",
 "3": "生物的危害要因\n有害な微生物など"
};
type DiagramTranslation={title:string;description:string;nodeLabels:Record<string,string>;edgeLabels:string[];note:string};
export function FoodConceptDiagrams({lesson,textColor,language,showTranslation,dailyPlacement=false}:{lesson:FoodManufacturingLesson;textColor:string;language:string;showTranslation:boolean;dailyPlacement?:boolean}){
 const [expanded,setExpanded]=useState<string|null>(null),[failedImageKeys,setFailedImageKeys]=useState<string[]>([]);
 const lessonId=lesson.id,current=lesson;
 if(lessonId==='food-2-007'&&!dailyPlacement)return null;
 if(!dailyPlacement&&current&&['traceability','productivity'].includes(foodRoyalWeek4NativeFor(current)?.kind??''))return null;
 const currentTranslation=current&&showTranslation&&language!=='ja'?foodManufacturingTranslation(current,language):null;
 const close=showTranslation&&language!=='ja'?(ui.locales as Record<string,{close:string}>)[language]?.close:undefined;
 const selectionKey=(diagramId:string,nodeId:string)=>`${lessonId}:${current?.sourceHash}:${diagramId}:${nodeId}`;
 const canShowRoyal=!!current&&royalHazardRevisions[lessonId]===current.sourceHash&&['p1','p2','p3'].every(id=>current.paragraphs.some(p=>p.id===id&&p.titleJa.trim()&&p.textJa.trim()))&&current.paragraphs.every(p=>p.titleJa.trim()&&p.textJa.trim());
 const canShowNode=(node:{id:string;labelJa:string})=>!!royalWeek1Hazards[node.id]&&royalHazardNodeLabels[node.id]===node.labelJa&&!failedImageKeys.includes(selectionKey('food-hazards',node.id));
 const imageFailed=(nodeId:string)=>{const key=selectionKey('food-hazards',nodeId);setFailedImageKeys(keys=>keys.includes(key)?keys:[...keys,key]);setExpanded(null);};
 const sourceDescription=current?current.paragraphs.map(p=>`${p.titleJa}。${p.textJa}${currentTranslation?`。${currentTranslation.paragraphTitles[p.id]}。${currentTranslation.paragraphs[p.id]}`:''}`).join('。'):'';
 const hazard=foodConceptDiagramsFor(lesson).find(d=>d.id==='food-hazards');
 const hazardT=showTranslation&&language!=='ja'?(hazard?.translations as Record<string,DiagramTranslation>|undefined)?.[language]:undefined;
 const description=(d:typeof data.diagrams[number],n:typeof d.nodes[number],t?:DiagramTranslation)=>`${n.labelJa}。${d.titleJa}。${d.descriptionJa}。${d.noteJa}${t?`。${t.nodeLabels[n.id]}。${t.title}。${t.description}。${t.note}`:''}。${sourceDescription}`;
 const selected=canShowRoyal?hazard?.nodes.find(n=>selectionKey(hazard.id,n.id)===expanded&&canShowNode(n)):undefined;
 return <>{foodConceptDiagramsFor(lesson).map(d=>{
 const translated=(d.translations as Record<string,DiagramTranslation>)[language];
 const t=showTranslation&&language!=='ja'?translated:undefined;
 const royalHazards=d.id==='food-hazards'&&royalHazardLessons.has(lessonId)&&canShowRoyal;
 return <View key={d.id} testID={d.id} style={s.diagram} accessible={!royalHazards} accessibilityLabel={`${d.titleJa}。${d.descriptionJa}。${d.noteJa}${t?`。${t.title}。${t.description}。${t.note}`:''}`}>
 {current?<FoodRoyalNativeLabel lesson={current} text={d.titleJa} color={textColor} size={18} strong/>:<Text style={[s.title,{color:textColor}]}>{d.titleJa}</Text>}{t&&<TranslationText>{t.title}</TranslationText>}
 {current?<FoodRoyalNativeLabel lesson={current} text={d.descriptionJa} color={textColor} size={16}/>:<Text style={[s.body,{color:textColor}]}>{d.descriptionJa}</Text>}{t&&<TranslationText>{t.description}</TranslationText>}
 <View style={s.nodes}>{d.nodes.map(n=><View key={n.id} style={[s.node,{backgroundColor:n.color},royalHazards?s.royalNode:null]}>{royalHazards&&canShowNode(n)&&<Pressable accessibilityRole="button" accessibilityLabel={description(d,n,t)} onPress={()=>setExpanded(selectionKey(d.id,n.id))}><Image testID={`food-hazard-node-${n.id}`} source={royalWeek1Hazards[n.id]} accessibilityLabel={description(d,n,t)} onError={()=>imageFailed(n.id)} resizeMode="contain" style={s.royalImage}/></Pressable>}{current?<FoodRoyalNativeLabel lesson={current} text={n.labelJa} color="#29251f"/>:<Text style={s.label}>{n.labelJa}</Text>}{t?.nodeLabels[n.id]&&<Text style={s.nodeTranslation}>{t.nodeLabels[n.id]}</Text>}</View>)}</View>
 {d.edges.map((e,i)=><View key={i}>{current?<FoodRoyalNativeLabel lesson={current} text={`${d.nodes.find(n=>n.id===e.from)?.labelJa} → ${d.nodes.find(n=>n.id===e.to)?.labelJa}${e.labelJa?`：${e.labelJa}`:''}`} color={textColor} size={16}/>:<Text style={[s.body,{color:textColor}]}>{d.nodes.find(n=>n.id===e.from)?.labelJa} → {d.nodes.find(n=>n.id===e.to)?.labelJa}{e.labelJa?`：${e.labelJa}`:''}</Text>}{t?.edgeLabels[i]&&<TranslationText>{t.edgeLabels[i]}</TranslationText>}</View>)}
 {current?<FoodRoyalNativeLabel lesson={current} text={d.noteJa} color={textColor} size={14}/>:<Text style={[s.note,{color:textColor}]}>{d.noteJa}</Text>}{t&&<TranslationText>{t.note}</TranslationText>}
 </View>;
 })}<Modal visible={!!selected} animationType="none" onRequestClose={()=>setExpanded(null)}><View style={s.modal}><Pressable accessibilityRole="button" accessibilityLabel={`図を閉じる${close?` · ${close}`:''}`} onPress={()=>setExpanded(null)}><Text style={s.modalText}>図を閉じる{close?` · ${close}`:''}</Text></Pressable><ScrollView>{selected&&hazard&&<View testID={`food-hazard-node-${selected.id}-zoom`}><Image source={royalWeek1Hazards[selected.id]} accessibilityLabel={description(hazard,selected,hazardT)} onError={()=>imageFailed(selected.id)} resizeMode="contain" style={s.royalImage}/>{current&&<FoodRoyalNativeLabel lesson={current} text={selected.labelJa} color="#183044"/>}<Text style={s.modalText}>{description(hazard,selected,hazardT)}</Text></View>}</ScrollView></View></Modal></>;
}
const s=StyleSheet.create({modal:{flex:1,backgroundColor:'#fffaf0',padding:20,paddingTop:36},modalText:{color:'#183044',fontSize:17,lineHeight:28,paddingVertical:12},royalImage:{width:'100%',height:undefined,aspectRatio:1.5,borderRadius:8,marginBottom:12},royalNode:{width:'100%',flexBasis:'100%',minWidth:0,borderWidth:1,borderColor:'#b49b62',borderRadius:12,backgroundColor:'#fffaf0',shadowColor:'#183044',shadowOpacity:0.12,shadowOffset:{width:0,height:3},shadowRadius:5,elevation:2},diagram:{paddingVertical:16,gap:12},title:{fontSize:18,lineHeight:28,fontWeight:'700'},body:{fontSize:16,lineHeight:26},nodes:{flexDirection:'row',flexWrap:'wrap',gap:12},node:{padding:16,borderRadius:10,minWidth:130,flexGrow:1},label:{fontSize:17,lineHeight:28,color:'#29251f'},nodeTranslation:{fontSize:16,lineHeight:26,color:'#3e382f',marginTop:8},note:{fontSize:14,lineHeight:24}});
