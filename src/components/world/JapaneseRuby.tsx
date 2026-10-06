import { StyleSheet, Text, View } from 'react-native';
import { ROYAL_FONT } from '@/components/ui/RoyalSurface';
export type RubySegment={text:string;reading?:string};
export default function JapaneseRuby({text,segments,fontSize=17}:{text:string;segments?:RubySegment[];fontSize?:number}){
 // Only aligned authored readings are displayed; never guess readings from kanji.
 const readingSize=Math.max(9,fontSize*.56);
 if(!segments?.length||segments.map(part=>part.text).join('')!==text)return <Text maxFontSizeMultiplier={1} style={[s.answer,{fontSize,lineHeight:fontSize*1.25}]}>{text}</Text>;
 const pieces=segments.flatMap(part=>part.reading?[part]:Array.from(part.text,char=>({text:char,reading:undefined})));
 return <View testID="japanese-ruby" style={s.line}>{pieces.map((part,index)=><View key={index} style={s.part}><Text maxFontSizeMultiplier={1} style={[s.reading,{fontSize:readingSize,lineHeight:readingSize*1.25}]}>{part.reading??' '}</Text><Text maxFontSizeMultiplier={1} style={[s.base,{fontSize,lineHeight:fontSize*1.25}]}>{part.text}</Text></View>)}</View>;
}
const s=StyleSheet.create({line:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',alignItems:'flex-end'},part:{alignItems:'center'},reading:{fontFamily:ROYAL_FONT.body,fontSize:9,lineHeight:11,color:'#586c7e'},base:{fontFamily:ROYAL_FONT.heading,fontSize:17,lineHeight:21,color:'#1d3549'},answer:{fontFamily:ROYAL_FONT.heading,fontSize:17,lineHeight:21,textAlign:'center',color:'#1d3549'}});
