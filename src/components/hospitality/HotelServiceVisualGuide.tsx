import React,{useState} from 'react';
import {View,Text,StyleSheet,useWindowDimensions} from 'react-native';
import type {HotelLesson} from '../../data/hospitality/types';
import {loadHotelTranslation} from '../../data/hospitality/translation-loaders';
import {hotelServiceGuideLabels} from '../../data/hospitality/service-visual-guide-labels';
export const HOTEL_SERVICE_GUIDE_REVISIONS:Record<string,string>={
  "hotel-service-01": "578941e86462eb4a73b4b1134b5f9bc35adbf7839e02802d35ab05e1fe57e9ef",
  "hotel-service-02": "00dcc624507593ecc0ebfa4c7929a7e64431e3b92e25028b0efe4aa3a8b64761",
  "hotel-service-03": "eb942d9ca15482ba6a25f88e5efd13a2a1994b1b2632df3a2ae1d61b28947e5c"
};
type Point=[number,number];
function Line({a,b,color='#31546d',width=5}:{a:Point;b:Point;color?:string;width?:number}){
 const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy),angle=Math.atan2(dy,dx)*180/Math.PI;
 return <View style={{position:'absolute',left:(a[0]+b[0])/2-length/2,top:(a[1]+b[1])/2-width/2,width:length,height:width,backgroundColor:color,transform:[{rotate:`${angle}deg`}],borderRadius:width/2}}/>;
}
export function hotelBowGeometry(degrees:number,width:number){
 const angle=degrees*Math.PI/180,hip:Point=[width*.36,150],shoulder:Point=[hip[0]+80*Math.sin(angle),hip[1]-80*Math.cos(angle)],head:Point=[hip[0]+101*Math.sin(angle),hip[1]-101*Math.cos(angle)];
 return {hip,shoulder,head,arc:Array.from({length:17},(_,i):Point=>[hip[0]+32*Math.sin(angle*i/16),hip[1]-32*Math.cos(angle*i/16)])};
}
function Bow({degrees,description}:{degrees:number;description:string}){
 const [width,setWidth]=useState(280),g=hotelBowGeometry(degrees,width);
 return <View accessible accessibilityRole="image" accessibilityLabel={`≈${degrees}° — ${description}`} onLayout={e=>setWidth(e.nativeEvent.layout.width)} style={s.bow}>
 <View style={{position:'absolute',left:g.hip[0],top:28,height:135,borderLeftWidth:1,borderStyle:'dashed',borderColor:'#8a989f'}}/>
 <Line a={g.hip} b={g.shoulder} width={10}/><Line a={g.hip} b={[g.hip[0]-10,205]} width={8}/><Line a={g.hip} b={[g.hip[0]+11,205]} width={8}/>
 <Line a={[g.shoulder[0],g.shoulder[1]+12]} b={[g.hip[0]+12,g.hip[1]+14]} width={5}/>
 <View style={{position:'absolute',left:g.head[0]-12,top:g.head[1]-12,width:24,height:24,borderRadius:12,backgroundColor:'#31546d'}}/>
 {g.arc.slice(1).map((point,i)=><Line key={i} a={g.arc[i]} b={point} color="#9b6e2a" width={3}/>)}
 </View>;
}
export function HotelServiceVisualGuide({lesson,language}:{lesson:HotelLesson;language:string}){
 const l=hotelServiceGuideLabels(language),material=language==='ja'?lesson:loadHotelTranslation(lesson.id,language,lesson.revision),[width,setWidth]=useState(280),{fontScale}=useWindowDimensions(),scale=Math.max(1,fontScale||1);
 if(!material||HOTEL_SERVICE_GUIDE_REVISIONS[lesson.id]!==lesson.revision)return null;
 const heading=<Text style={s.title}>{material.illustration.caption}</Text>;
 if(lesson.id==='hotel-service-01')return <View testID="hotel-service-01-native-guide" style={s.root}>{heading}<Text style={s.text}>{l.upright}</Text>{[15,30,45].map((degrees,i)=><View key={degrees} style={s.card}><Text style={s.title}>{lesson.terms[i].ja} · ≈{degrees}°</Text><Bow degrees={degrees} description={material.terms[i].meaning}/><Text style={s.text}>{material.terms[i].meaning}</Text></View>)}<Text style={s.text}>{l.bowCaveat}</Text></View>;
 if(lesson.id==='hotel-service-02')return <View testID="hotel-service-02-native-guide" style={s.root}>{heading}{['お客様がいらっしゃいます','係の者が伺います','です・ます・ございます'].map((example,i)=><View key={example} style={s.card}><Text style={s.title}>{lesson.terms[i].ja}</Text><Text style={s.text}>{material.terms[i].meaning}</Text><Text selectable style={s.example}>{example}</Text></View>)}</View>;
 if(lesson.id==='hotel-service-03')return <View testID="hotel-service-03-native-guide" style={s.root}>{heading}<Text style={s.text}>{l.guiding}</Text><Text style={s.text}>↑ {l.direction}</Text><View accessible accessibilityRole="image" accessibilityLabel={l.guiding} onLayout={e=>setWidth(e.nativeEvent.layout.width)} style={[s.position,{minHeight:300*scale}]}>
 <View style={[s.marker,{left:width*.22,top:25*scale}]}><Text style={s.markerArrow}>↑</Text><Text style={s.markerText}>{l.staff}</Text></View>
 <View style={[s.marker,{left:width*.60,top:140*scale}]}><Text style={s.markerArrow}>↑</Text><Text style={s.markerText}>{l.guest}</Text></View>
 </View></View>;
 return null;
}
const s=StyleSheet.create({root:{width:'100%',gap:12,padding:12,marginVertical:16,backgroundColor:'#faf8f1',borderRadius:8},title:{fontSize:18,lineHeight:28,fontWeight:'700',color:'#243c50'},text:{fontSize:14,lineHeight:23,color:'#243c50'},example:{fontSize:17,lineHeight:29,color:'#204f70'},card:{width:'100%',gap:8,padding:10,borderWidth:1,borderColor:'#a9bcc2',borderRadius:6},bow:{width:'100%',height:220,position:'relative'},position:{width:'100%',minHeight:300,position:'relative',backgroundColor:'#f0ece3',borderRadius:6},marker:{position:'absolute',width:'36%',marginLeft:-24,alignItems:'center',gap:4},markerArrow:{fontSize:34,lineHeight:42,color:'#31546d'},markerText:{fontSize:14,lineHeight:23,color:'#243c50',textAlign:'center'}});
