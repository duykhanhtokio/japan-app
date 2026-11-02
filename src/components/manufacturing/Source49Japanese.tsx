import {Text,View,StyleSheet,type StyleProp,type TextStyle} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {manufacturingSource49Reading} from '@/data/manufacturing/source49-readings';
/** Preserve all other paragraphs; keep each new word and its reading together. */
export function Source49Japanese({lesson,paragraphId,text,style}:{lesson:ManufacturingLesson;paragraphId:string;text:string|undefined;style?:StyleProp<TextStyle>}) {
 const parts=manufacturingSource49Reading(lesson,paragraphId,text);
 if(!parts)return <Text selectable style={style}>{text}</Text>;
 const color=StyleSheet.flatten(style)?.color;
 return <View testID="manufacturing-source49-ruby" accessible accessibilityLabel={text} style={s.line}>{parts.map((p,i)=>p.text==='\n'?<View key={i} style={s.newline}/>:<View key={i} style={s.word}><Text style={[s.reading,{color}]}>{p.reading??' '}</Text><Text selectable style={style}>{p.text}</Text></View>)}</View>;
}
const s=StyleSheet.create({line:{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'},word:{alignItems:'center',maxWidth:'100%'},reading:{fontSize:10,lineHeight:14},newline:{width:'100%',height:0}});
