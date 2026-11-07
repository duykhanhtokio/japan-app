import {HotelGuideText as Text} from './HotelGuideText';
import React,{useState} from 'react';
import {View,StyleSheet,useWindowDimensions} from 'react-native';
import type {HotelLesson} from '../../data/hospitality/types';
import {loadHotelTranslation} from '../../data/hospitality/translation-loaders';
import {hotelRoleGuideLabels,HOTEL_ROLE_GUIDE_REVISIONS} from '../../data/hospitality/role-visual-guide-labels';
export function hotelSeatingGeometry(width:number,scale=1){return {A:{x:width*.25,y:185*scale},B:{x:width*.72,y:70*scale},door:{x:width*.22,y:280*scale},height:280*scale,radius:18*scale};}
export function HotelHospitalityRoleGuide({lesson,language}:{lesson:HotelLesson;language:string}){
 const t=hotelRoleGuideLabels(language),material=language==='ja'?lesson:loadHotelTranslation(lesson.id,language,lesson.revision),[width,setWidth]=useState(280),{fontScale}=useWindowDimensions(),scale=Math.max(1,fontScale||1);
 if(!material||HOTEL_ROLE_GUIDE_REVISIONS[lesson.id]!==lesson.revision)return null;
 if(lesson.id==='hotel-service-04'){
  const g=hotelSeatingGeometry(width,scale);
  return <View testID="hotel-service-04-native-seat-guide" style={s.root}><Text style={s.title}>{material.illustration.caption}</Text><View accessible accessibilityRole="image" accessibilityLabel={`${t.nearSeat}; ${t.farSeat}. ${t.seatingCaveat}`} onLayout={e=>setWidth(e.nativeEvent.layout.width)} style={[s.room,{height:g.height}]}>
  {(['A','B'] as const).map(label=><View key={label} style={[s.seat,{left:g[label].x-g.radius,top:g[label].y-g.radius,width:g.radius*2,height:g.radius*2,borderRadius:g.radius}]}><Text style={s.seatText}>{label}</Text></View>)}
  <View style={{position:'absolute',bottom:-4,left:width*.12,width:width*.20,height:8,backgroundColor:'#faf8f1'}}/>
  </View><Text style={s.text}>↑ {t.entrance}</Text><Text style={s.text}>{t.nearSeat}</Text><Text style={s.text}>{t.farSeat}</Text><Text style={s.text}>{t.seatingCaveat}</Text></View>;
 }
 if(lesson.id==='hotel-planning-05'){
  const term=(index:number)=><View style={s.card}><Text style={s.title}>{lesson.terms[index].ja}</Text><Text style={s.text}>{material.terms[index].meaning}</Text></View>;
  const arrows=<View style={s.row}><Text style={[s.arrow,s.grow]}>↓</Text><Text style={[s.arrow,s.grow]}>↓</Text></View>;
  return <View testID="hotel-planning-05-native-system-guide" style={s.root}><Text style={s.title}>{material.illustration.caption}</Text><View style={s.card}><Text style={s.text}>{t.guest}</Text></View>{arrows}<View style={s.row}><View style={s.grow}>{term(1)}</View><View style={s.grow}>{term(2)}</View></View>{arrows}{term(0)}{arrows}<View style={s.row}><View style={[s.card,s.grow]}><Text style={s.text}>{t.roomStatus}</Text></View><View style={[s.card,s.grow]}><Text style={s.text}>{t.accounting}</Text></View></View><Text style={s.text}>{t.systemsCaveat}</Text><View style={s.card}><Text style={s.title}>{t.commissionExample}</Text><Text selectable style={s.formula}>20,000 JPY × 0.10 = 2,000 JPY</Text><Text selectable style={s.formula}>10% = 0.10</Text><Text style={s.text}>{t.commissionCaveat}</Text></View></View>;
 }
 return null;
}
const s=StyleSheet.create({root:{width:'100%',gap:12,padding:12,marginVertical:16,backgroundColor:'#faf8f1',borderRadius:8},title:{fontSize:18,lineHeight:28,fontWeight:'700',color:'#243c50'},text:{fontSize:14,lineHeight:23,color:'#243c50'},room:{width:'100%',position:'relative',borderWidth:2,borderColor:'#465761',borderRadius:5},seat:{position:'absolute',borderWidth:2,borderColor:'#9b6e2a',backgroundColor:'#efe4cf',alignItems:'center',justifyContent:'center'},seatText:{fontSize:20,lineHeight:28,color:'#243c50'},card:{width:'100%',gap:8,padding:10,borderWidth:1,borderColor:'#a9bcc2',borderRadius:6},row:{width:'100%',flexDirection:'row',gap:10,alignItems:'stretch'},grow:{flex:1,minWidth:0},arrow:{fontSize:24,lineHeight:32,color:'#31546d',textAlign:'center'},formula:{fontSize:16,lineHeight:27,color:'#204f70',flexShrink:1}});
