import React from 'react';
import {Image,View,Text,StyleSheet} from 'react-native';
import type {HotelLesson} from '../../data/hospitality/types';
import {loadHotelTranslation} from '../../data/hospitality/translation-loaders';
import {hotelSafetyGuideLabels,HOTEL_SAFETY_GUIDE_REVISION} from '../../data/hospitality/safety-visual-guide-labels';
export const HOTEL_FIRE_BOUNDARY_GEOMETRY={width:720,height:360,ceilingY:32,belowFireTop:210,ceilingFireTop:32};
const diagrams={below:()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week04/safety02-fire-below-controlled.webp'),ceiling:()=>require('../../../assets/app/hospitality/royal-weekly-20261107/week04/safety02-fire-ceiling-controlled.webp')};
/** Qualitative comparison only. A lower flame is never a guarantee of safe firefighting. */
export function HotelSafetyDecisionGuide({lesson,language}:{lesson:HotelLesson;language:string}){
 if(lesson.id!=='hotel-safety-02'||lesson.revision!==HOTEL_SAFETY_GUIDE_REVISION)return null;
 const material=language==='ja'?lesson:loadHotelTranslation(lesson.id,language,lesson.revision);if(!material)return null;
 const t=hotelSafetyGuideLabels(language);
 return <View testID="hotel-safety-02-native-decision-guide" style={s.root}>
 {(['below','ceiling'] as const).map(key=><View key={key} testID={`hotel-fire-${key}-comparison`} style={s.card}>
  <Text style={s.title}>{key==='below'?t.conditional:t.evacuate}</Text>
  <View style={s.diagram}><Text style={s.ceiling}>{t.ceiling}</Text><Image source={diagrams[key]()} resizeMode="contain" accessibilityLabel={`${t.ceiling}. ${key==='below'?t.trainedScope:t.stopConditions}`} style={s.image}/></View>
  <Text style={s.text}>{key==='below'?t.trainedScope:t.stopConditions}</Text>
 </View>)}
 <Text style={s.text}>{t.caveat}</Text>
 </View>;
}
const s=StyleSheet.create({root:{width:'100%',gap:12,padding:12,marginVertical:16,backgroundColor:'#faf8f1',borderRadius:8},card:{width:'100%',gap:8,padding:10,borderWidth:1,borderColor:'#a9bcc2',borderRadius:6},title:{fontSize:18,lineHeight:28,fontWeight:'700',color:'#243c50'},text:{fontSize:14,lineHeight:23,color:'#243c50',flexShrink:1},diagram:{width:'100%',gap:4},image:{width:'100%',aspectRatio:2},ceiling:{fontSize:14,lineHeight:23,color:'#243c50',flexShrink:1}});
