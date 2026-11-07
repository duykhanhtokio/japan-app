import React from 'react';
import {View,Text,StyleSheet} from 'react-native';
import type {HotelLesson} from '../../data/hospitality/types';
import {loadHotelTranslation} from '../../data/hospitality/translation-loaders';
import {hotelMarketExampleLabel} from '../../data/hospitality/market-guide-labels';
export const HOTEL_MARKET_GUIDE_REVISION='3dbc6b276e33f9cb49ac809131655c9698ba5c6c77bc99e62baf0658e99c453f';
export const hotelMarketExampleGroups=[{id:'A',selected:false},{id:'B',selected:true},{id:'C',selected:false}];
export function HotelMarketSelectionGuide({lesson,language}:{lesson:HotelLesson;language:string}){
 if(lesson.id!=='hotel-planning-07'||lesson.revision!==HOTEL_MARKET_GUIDE_REVISION)return null;
 const material=language==='ja'?lesson:loadHotelTranslation(lesson.id,language,lesson.revision);if(!material)return null;
 return <View testID="hotel-planning-07-native-market-guide" style={s.root}><Text style={s.title}>{material.illustration.caption}</Text><Text style={s.text}>{hotelMarketExampleLabel(language)}</Text>{['hotel-planning-07-segmentation','hotel-planning-07-targeting'].map((id,index)=>{const section=material.sections.find(x=>x.id===id);return section?<View key={id} style={s.card}><Text style={s.title}>{index+1} · {section.title}</Text><View style={s.groups}>{hotelMarketExampleGroups.map(group=><View key={group.id} style={[s.group,index===1&&group.selected?s.selected:null]}><Text style={s.groupLabel}>{group.id}</Text><Text style={s.people}>● ● ●</Text></View>)}</View><Text style={s.text}>{section.body}</Text></View>:null;})}</View>;
}
const s=StyleSheet.create({root:{width:'100%',gap:12,padding:12,marginVertical:16,backgroundColor:'#faf8f1',borderRadius:8},title:{fontSize:18,lineHeight:28,fontWeight:'700',color:'#243c50'},text:{fontSize:14,lineHeight:23,color:'#243c50'},card:{width:'100%',gap:10,padding:10,borderWidth:1,borderColor:'#a9bcc2',borderRadius:6},groups:{flexDirection:'row',flexWrap:'wrap',gap:10},group:{minWidth:72,padding:8,borderWidth:1,borderColor:'#8199a3',borderRadius:6,alignItems:'center'},selected:{borderWidth:4,borderColor:'#31546d',backgroundColor:'#efe4cf'},groupLabel:{fontSize:18,lineHeight:28,color:'#243c50',fontWeight:'700'},people:{fontSize:14,lineHeight:24,color:'#31546d'}});
