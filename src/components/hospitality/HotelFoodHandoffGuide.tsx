import React from 'react';
import {View,Text,StyleSheet} from 'react-native';
import type {HotelLesson} from '../../data/hospitality/types';
import {loadHotelTranslation} from '../../data/hospitality/translation-loaders';
import {hotelFoodHandoffLabels} from '../../data/hospitality/food-handoff-labels';
export const HOTEL_FOOD_HANDOFF_REVISION='5df3daf1a74e68979b8c622124187cf374d0ac0389e277fcdb4c16aa5595bb6c';
export function HotelFoodHandoffGuide({lesson,language}:{lesson:HotelLesson;language:string}){
 if(lesson.id!=='hotel-restaurant-05'||lesson.revision!==HOTEL_FOOD_HANDOFF_REVISION)return null;
 const material=language==='ja'?lesson:loadHotelTranslation(lesson.id,language,lesson.revision);if(!material)return null;
 const t=hotelFoodHandoffLabels(language);
 return <View testID="hotel-restaurant-05-native-handoff" style={s.root}><Text style={s.title}>{material.illustration.caption}</Text><View style={s.stages}>{t.slice(0,3).map((stage,index)=><View key={stage} style={s.card}><Text style={s.number}>{index+1} · {stage}</Text>{t.slice(3).map(label=><Text key={label} style={s.text}>□ {label}</Text>)}</View>)}</View>{['hotel-restaurant-05-s1','hotel-restaurant-05-s2','hotel-restaurant-05-s4'].map((id,index)=>{const section=material.sections.find(x=>x.id===id);return section?<View key={id} style={s.card}><Text style={s.number}>{index+1}</Text><Text style={s.title}>{section.title}</Text><Text style={s.text}>{section.body}</Text></View>:null;})}</View>;
}
const s=StyleSheet.create({stages:{gap:10},root:{width:'100%',gap:12,marginVertical:16,padding:12,backgroundColor:'#faf8f1',borderRadius:8},card:{gap:8,borderWidth:1,borderColor:'#a9bcc2',borderRadius:6,padding:12},title:{fontSize:18,lineHeight:28,fontWeight:'700',color:'#243c50'},text:{fontSize:14,lineHeight:23,color:'#243c50',flexShrink:1},number:{fontSize:20,lineHeight:28,fontWeight:'700',color:'#31546d'}});
