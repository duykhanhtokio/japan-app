import {ManufacturingIllustrationText} from './ManufacturingIllustrationText';
import {StyleSheet,Text,View,type StyleProp,type TextStyle} from 'react-native';
import {hasAlignedRuby} from '@/components/world/japanese-ruby-data';
import data from '@/data/manufacturing/illustration-readings.json';
/** Exact offline illustration readings; existing prose and native captions stay unchanged. */
export function IllustrationJapanese({text,style}:{text:string;style?:StyleProp<TextStyle>}){
 const row=data.entries.find(row=>row.sourceJa===text);
 if(!row)return <ManufacturingIllustrationText readingLanguage="ja" selectable style={style}>{text}</ManufacturingIllustrationText>;
 const segments=row.segments;
 if(!hasAlignedRuby(text,segments)||segments.some(p=>/[一-龯々]/.test(p.text)&&!p.reading))return <Text selectable style={style}>{text}</Text>;
 const color=StyleSheet.flatten(style)?.color;
 return <View testID="manufacturing-illustration-ruby" accessible accessibilityLabel={text} style={s.line}>{segments.map((p,i)=>p.text==='\n'?<View key={i} style={s.newline}/>:<View key={i} style={s.word}><Text style={[s.reading,{color}]}>{p.reading??' '}</Text><Text selectable style={style}>{p.text}</Text></View>)}</View>;
}
const s=StyleSheet.create({line:{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'},word:{alignItems:'center',maxWidth:'100%'},reading:{fontSize:10,lineHeight:14},newline:{width:'100%',height:0}});
