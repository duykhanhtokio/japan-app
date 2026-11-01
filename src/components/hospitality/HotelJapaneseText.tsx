import {Text,View,StyleSheet} from 'react-native';
type Segment={text:string;reading?:string};
type Readings={lessons:Record<string,{sourceRevision:string}>;entries:Record<string,[number,number,string][]>};
const loaders:Record<string,()=>Readings>={
 front:()=>require('@/data/hospitality/readings/front.json'),
 planning:()=>require('@/data/hospitality/readings/planning.json'),
 service:()=>require('@/data/hospitality/readings/service.json'),
 restaurant:()=>require('@/data/hospitality/readings/restaurant.json'),
 safety:()=>require('@/data/hospitality/readings/safety.json'),
 mock:()=>require('@/data/hospitality/readings/mock.json'),
};
export function hotelReading(text:string,lessonId:string,revision:string):Segment[]|undefined {
 const data=loaders[lessonId.split('-')[1]]?.();
 if(data?.lessons[lessonId]?.sourceRevision!==revision)return undefined;
 const spans=data.entries[text];if(!spans)return undefined;
 const parts:Segment[]=[];let cursor=0;
 for(const [start,length,reading] of spans){
  if(start<cursor||length<1||start+length>text.length||!reading)return undefined;
  if(start>cursor)parts.push({text:text.slice(cursor,start)});
  parts.push({text:text.slice(start,start+length),reading});cursor=start+length;
 }
 if(cursor<text.length)parts.push({text:text.slice(cursor)});
 return parts.map(p=>p.text).join('')===text?parts:undefined;
}
// The line wrapper keeps a whole word and its reading together. Native Text
// remains available when readings are hidden; translations never receive ruby.
export function HotelJapaneseText({text,lessonId,revision,enabled,color,heading=false}:{text:string;lessonId:string;revision:string;enabled:boolean;color:string;heading?:boolean}){
 const parts=enabled?hotelReading(text,lessonId,revision):undefined;
 const fontSize=heading?19:17;
 if(!parts)return <Text selectable style={{color,fontSize,lineHeight:heading?30:29,fontWeight:heading?'700':'400'}}>{text}</Text>;
 const pieces=parts.flatMap(p=>p.reading?[p]:Array.from(p.text,c=>({text:c,reading:undefined})));
 return <View accessible accessibilityLabel={text} style={styles.line}>{pieces.map((p,i)=>p.text==='\n'?<View key={i} style={styles.newline}/>:<View key={i} style={styles.word}><Text style={{color,fontSize:10,lineHeight:15}}>{p.reading||' '}</Text><Text style={{color,fontSize,lineHeight:heading?30:26,fontWeight:heading?'700':'400'}}>{p.text}</Text></View>)}</View>;
}
const styles=StyleSheet.create({line:{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',justifyContent:'flex-start'},word:{alignItems:'center',paddingHorizontal:1},newline:{width:'100%',height:0}});
