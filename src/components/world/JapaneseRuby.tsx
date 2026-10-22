import { StyleSheet, Text, View } from 'react-native';
import { hasAlignedRuby } from './japanese-ruby-data';
import { ROYAL_FONT } from '@/components/ui/RoyalSurface';
export type RubySegment={text:string;reading?:string};
export default function JapaneseRuby({text,segments,fontSize=17,color='#1d3549',readingColor='#586c7e',testID='japanese-ruby'}:{text:string;segments?:RubySegment[];fontSize?:number;color?:string;readingColor?:string;testID?:string}){
 // Only complete source-aligned offline readings are displayed.
 const readingSize=Math.max(9,fontSize*.56);
 if(!hasAlignedRuby(text,segments))return <Text maxFontSizeMultiplier={1} style={[s.answer,{fontSize,lineHeight:fontSize*1.25,color}]}>{text}</Text>;
 const pieces=segments.flatMap(part=>part.reading?[part]:Array.from(part.text,char=>({text:char,reading:undefined})));
 return <View testID={testID} accessible accessibilityLabel={text} style={s.line}>{pieces.map((part,index)=><View key={index} style={s.part}><Text maxFontSizeMultiplier={1} style={[s.reading,{fontSize:readingSize,lineHeight:readingSize*1.25,color:readingColor}]}>{part.reading??' '}</Text><Text maxFontSizeMultiplier={1} style={[s.base,{fontSize,lineHeight:fontSize*1.25,color}]}>{part.text}</Text></View>)}</View>;
}
const s=StyleSheet.create({line:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',alignItems:'flex-end'},part:{alignItems:'center'},reading:{fontFamily:ROYAL_FONT.body,fontSize:9,lineHeight:11,color:'#586c7e'},base:{fontFamily:ROYAL_FONT.heading,fontSize:17,lineHeight:21,color:'#1d3549'},answer:{fontFamily:ROYAL_FONT.heading,fontSize:17,lineHeight:21,textAlign:'center',color:'#1d3549'}});
