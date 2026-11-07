import {Text,View,StyleSheet,type TextStyle,type ViewStyle,type StyleProp} from 'react-native';
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
export function HotelJapaneseText({text,lessonId,revision,enabled,color,heading=false,readingOverride,fontSizeOverride,lineHeightOverride,fontWeightOverride,nativeStyle,testID}:{text:string;lessonId:string;revision:string;enabled:boolean;color:string;heading?:boolean;readingOverride?:Segment[];fontSizeOverride?:number;lineHeightOverride?:number;fontWeightOverride?:TextStyle['fontWeight'];nativeStyle?:StyleProp<TextStyle>;testID?:string}){
 const override=readingOverride?.map(p=>p.text).join('')===text?readingOverride:undefined;
 const parts=enabled?(hotelReading(text,lessonId,revision)??override):undefined;
 const fontSize=fontSizeOverride??(heading?19:17),fontWeight=fontWeightOverride??(heading?'700':'400');
 if(!parts)return <Text testID={testID} selectable style={[nativeStyle,{color,fontSize,lineHeight:lineHeightOverride??(heading?30:29),fontWeight}]}>{text}</Text>;
 const pieces=parts.flatMap(p=>p.reading?[p]:Array.from(p.text,c=>({text:c,reading:undefined}))),textAlign=StyleSheet.flatten(nativeStyle)?.textAlign;
 return <View testID={testID} accessible accessibilityLabel={text} style={[nativeStyle as StyleProp<ViewStyle>,styles.line,textAlign==='center'?{justifyContent:'center'}:textAlign==='right'?{justifyContent:'flex-end'}:undefined]}>{pieces.map((p,i)=>p.text==='\n'?<View key={i} style={styles.newline}/>:<View key={i} style={styles.word}><Text style={{color,fontSize:10,lineHeight:15}}>{p.reading||' '}</Text><Text style={{color,fontSize,lineHeight:lineHeightOverride??(heading?30:26),fontWeight}}>{p.text}</Text></View>)}</View>;
}
const styles=StyleSheet.create({line:{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',justifyContent:'flex-start'},word:{alignItems:'center',paddingHorizontal:1},newline:{width:'100%',height:0}});
