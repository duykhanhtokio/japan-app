import React,{useState} from 'react';
import {View,Text,StyleSheet,useWindowDimensions} from 'react-native';
import {hotelPracticeMapLabels} from '../../data/hospitality/practice-floorplan-labels';
type Point=[number,number];
const BLUE='#346b9b',GREEN='#21704f',PAPER='#faf8f1';
function Path({points,color,arrow}:{points:Point[];color:string;arrow:'right'|'up'|'down'}){
 return <>{points.slice(1).map(([x,y],i)=>{const [px,py]=points[i];return <View key={i} style={{position:'absolute',left:Math.min(x,px)-2.5,top:Math.min(y,py)-2.5,width:Math.max(5,Math.abs(x-px)),height:Math.max(5,Math.abs(y-py)),backgroundColor:color}}/>;})}<View style={[{position:'absolute',left:points[points.length-1][0]-7,top:points[points.length-1][1]-7,width:0,height:0,borderStyle:'solid'},arrow==='right'?{borderTopWidth:7,borderBottomWidth:7,borderLeftWidth:13,borderTopColor:'transparent',borderBottomColor:'transparent',borderLeftColor:color}:arrow==='up'?{borderLeftWidth:7,borderRightWidth:7,borderBottomWidth:13,borderLeftColor:'transparent',borderRightColor:'transparent',borderBottomColor:color}:{borderLeftWidth:7,borderRightWidth:7,borderTopWidth:13,borderLeftColor:'transparent',borderRightColor:'transparent',borderTopColor:color}]}/></>;
}
/** Explanation exercise only. No real hotel's floor plan or accessible route is asserted. */
export function HotelPracticeFloorplan({language}:{language:string}){
 const t=hotelPracticeMapLabels(language),[width,setWidth]=useState(300),{fontScale}=useWindowDimensions();
 const scale=Math.max(1,fontScale||1),y=(v:number)=>v*scale,w=width;
 const room=(left:number,top:number,label:string,door:'top'|'bottom')=><View style={[s.room,{left:left*w,top:y(top),width:.34*w,height:y(105)}]}><Text style={s.label}>{label}</Text><View style={{position:'absolute',left:.125*w,width:.10*w,height:7,backgroundColor:PAPER,...(door==='top'?{top:-4}:{bottom:-4})}}/></View>;
 return <View testID="hotel-front-03-practice-map" style={s.root}>
 <Text style={s.title}>{t.title}</Text>
 <View accessible accessibilityRole="image" accessibilityLabel={t.description} onLayout={e=>setWidth(e.nativeEvent.layout.width)} style={[s.map,{height:y(390)}]}>
 {room(.04,25,t.breakfast,'bottom')}{room(.04,255,t.reception,'top')}{room(.62,255,t.guestRoom,'top')}
 <Text style={[s.exit,{left:.58*w,top:y(40),width:.36*w}]}>{t.exit}</Text>
 <View style={{position:'absolute',right:-4,top:y(180)-12,height:24,width:8,backgroundColor:PAPER}}/>
 <Path color={BLUE} arrow="down" points={[[.215*w,y(275)],[.215*w,y(220)],[.765*w,y(220)],[.765*w,y(275)]]}/>
 <Path color={BLUE} arrow="up" points={[[.25*w,y(220)],[.25*w,y(115)]]}/>
 <Path color={GREEN} arrow="right" points={[[.83*w,y(275)],[.83*w,y(180)],[.98*w,y(180)]]}/>
 </View>
 <View style={s.legend}><View style={[s.swatch,{backgroundColor:BLUE}]}/><Text style={s.legendText}>{t.normal}</Text></View>
 <View style={s.legend}><View style={[s.swatch,{backgroundColor:GREEN}]}/><Text style={s.legendText}>{t.escape}</Text></View>
 <Text style={s.caveat}>{t.caveat}</Text>
 </View>;
}
const s=StyleSheet.create({root:{width:'100%',gap:12,marginVertical:16,backgroundColor:PAPER,padding:12,borderRadius:8},title:{fontSize:18,lineHeight:27,fontWeight:'700',color:'#243c50'},map:{width:'100%',position:'relative',borderWidth:2,borderColor:'#465761',borderRadius:8,backgroundColor:PAPER},room:{position:'absolute',borderWidth:2,borderColor:'#465761',backgroundColor:'#f5f1e5',justifyContent:'center',padding:8},label:{fontSize:14,lineHeight:21,color:'#243c50',textAlign:'center'},exit:{position:'absolute',fontSize:14,lineHeight:21,color:GREEN,textAlign:'center'},legend:{flexDirection:'row',alignItems:'center',gap:10},swatch:{width:32,height:5},legendText:{fontSize:14,lineHeight:22,color:'#243c50',flex:1},caveat:{fontSize:14,lineHeight:22,color:'#243c50'}});
