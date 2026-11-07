import {HotelGuideText as Text} from './HotelGuideText';
import React from 'react';
import {View,StyleSheet} from 'react-native';
import type {HotelLesson} from '../../data/hospitality/types';
import {loadHotelTranslation} from '../../data/hospitality/translation-loaders';
import {hotelMealGuideLabels,HOTEL_MEAL_GUIDE_REVISIONS} from '../../data/hospitality/meal-visual-guide-labels';
export function hotelMealLayout(id:string){
 if(id==='hotel-restaurant-03')return [{key:'rice',x:.25,y:.70},{key:'soup',x:.75,y:.70},{key:'side',x:.25,y:.25},{key:'main',x:.75,y:.25}];
 if(id==='hotel-restaurant-04')return [{key:'fork',x:.18,y:.52},{key:'knife',x:.72,y:.52},{key:'spoon',x:.87,y:.52},{key:'bread',x:.20,y:.15},{key:'dessert',x:.50,y:.15}];
 return [{key:'food',x:.23,y:.45},{key:'drink',x:.77,y:.45}];
}
export function HotelMealLayoutGuide({lesson,language}:{lesson:HotelLesson;language:string}){
 if(HOTEL_MEAL_GUIDE_REVISIONS[lesson.id]!==lesson.revision)return null;
 const material=language==='ja'?lesson:loadHotelTranslation(lesson.id,language,lesson.revision);if(!material)return null;
 const t=hotelMealGuideLabels(language),nodes=hotelMealLayout(lesson.id),ids=lesson.id==='hotel-restaurant-02'?['hotel-restaurant-02-s1','hotel-restaurant-02-s2']:lesson.id==='hotel-restaurant-03'?['hotel-restaurant-03-s1','hotel-restaurant-03-s2']:['hotel-restaurant-04-s1','hotel-restaurant-04-s2'];
 return <View testID={`${lesson.id}-native-meal-layout`} style={s.root}><Text style={s.title}>{material.illustration.caption}</Text><View accessibilityRole="image" accessibilityLabel={`${t.guest}: ${nodes.map((node,index)=>`${index+1} ${t[node.key]}`).join('; ')}`} style={s.diagram}>
 {lesson.id==='hotel-restaurant-04'&&<View style={s.plate}/>}
 {nodes.map((node,index)=><View key={node.key} style={[s.marker,{left:`${node.x*100}%`,top:`${node.y*100}%`}]}><Text style={s.markerText}>{index+1}</Text></View>)}
 <View style={s.guest}><Text style={s.text}>↑ {t.guest}</Text></View></View>
 {nodes.map((node,index)=><Text key={node.key} style={s.text}>{index+1} · {t[node.key]}</Text>)}
 {lesson.id==='hotel-restaurant-04'&&<><View style={s.signalRow}>{[{key:'eating',pair:false},{key:'finished',pair:true}].map(item=><View key={item.key} style={s.signalCard}><Text style={s.text}>{t[item.key]}</Text><View style={s.signalPlate}><View style={[s.utensil,{left:item.pair?'48%':'30%',transform:[{rotate:item.pair?'-40deg':'32deg'}]}]}/><View style={[s.utensil,{left:item.pair?'60%':'60%',transform:[{rotate:item.pair?'-40deg':'-32deg'}]}]}/></View></View>)}</View></>}
 {ids.map(id=>material.sections.find(section=>section.id===id)).filter(Boolean).map(section=><View key={section!.id} style={s.source}><Text style={s.title}>{section!.title}</Text><Text style={s.text}>{section!.body}</Text></View>)}</View>;
}
const s=StyleSheet.create({root:{width:'100%',gap:10,padding:12,marginVertical:16,backgroundColor:'#faf8f1',borderRadius:8},title:{fontSize:18,lineHeight:28,fontWeight:'700',color:'#243c50'},text:{fontSize:14,lineHeight:23,color:'#243c50',flexShrink:1},diagram:{width:'100%',height:280,borderWidth:1,borderColor:'#a9bcc2',borderRadius:6,position:'relative',marginBottom:18},marker:{position:'absolute',width:34,height:34,marginLeft:-17,marginTop:-17,borderRadius:17,borderWidth:2,borderColor:'#31546d',backgroundColor:'#efe4cf',alignItems:'center',justifyContent:'center'},markerText:{fontSize:18,lineHeight:26,color:'#243c50'},guest:{position:'absolute',bottom:-21,left:0,width:'100%',alignItems:'center',backgroundColor:'#faf8f1'},plate:{position:'absolute',left:'33%',top:'32%',width:'32%',aspectRatio:1,borderWidth:2,borderColor:'#8199a3',borderRadius:100},source:{gap:6,paddingTop:10,borderTopWidth:1,borderTopColor:'#d5dce0'},signalRow:{gap:12},signalCard:{width:'100%',gap:8,padding:10,borderWidth:1,borderColor:'#a9bcc2',borderRadius:6},signalPlate:{width:160,height:160,alignSelf:'center',borderRadius:80,borderWidth:2,borderColor:'#8199a3',position:'relative'},utensil:{position:'absolute',top:'42%',width:6,height:68,borderRadius:3,backgroundColor:'#31546d'}});
