import { StyleSheet, Text, View } from 'react-native';
import { ROYAL_FONT } from '@/components/ui/RoyalSurface';
export type RubySegment={text:string;reading?:string};
export default function JapaneseRuby({text,segments}:{text:string;segments?:RubySegment[]}){
 // Only aligned authored readings are displayed; never guess readings from kanji.
 if(!segments?.length||segments.map(part=>part.text).join('')!==text)return <Text style={s.answer}>{text}</Text>;
 return <View style={s.line}>{segments.map((part,index)=><View key={index} style={s.part}><Text style={s.reading}>{part.reading??' '}</Text><Text style={s.base}>{part.text}</Text></View>)}</View>;
}
const s=StyleSheet.create({line:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',alignItems:'flex-end'},part:{alignItems:'center'},reading:{fontFamily:ROYAL_FONT.body,fontSize:9,lineHeight:11,color:'#586c7e'},base:{fontFamily:ROYAL_FONT.heading,fontSize:17,lineHeight:21,color:'#1d3549'},answer:{fontFamily:ROYAL_FONT.heading,fontSize:17,lineHeight:21,textAlign:'center',color:'#1d3549'}});
