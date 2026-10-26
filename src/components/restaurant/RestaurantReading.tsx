import {Text,View,StyleSheet} from 'react-native';
import type {ReadingSegment,RestaurantLesson} from '@/data/restaurant/types';
import {hasAlignedRuby} from '@/components/world/japanese-ruby-data';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
/** Only supplied aligned readings or exact, authored glossary words receive ruby. */
export function RestaurantReading({text,segments,terms=[],heading=false}:{text:string;segments?:ReadingSegment[];terms?:RestaurantLesson['terms'];heading?:boolean}){
 const {colors}=useStudyAppearance();
 let tokens=segments;
 if(!hasAlignedRuby(text,tokens)&&terms.length){
  const sorted=[...terms].filter(t=>t.ja&&/^[\p{Script=Hiragana}ー\s]+$/u.test(t.reading)).sort((a,b)=>b.ja.length-a.ja.length);
  const result:ReadingSegment[]=[];let offset=0,plain='';
  while(offset<text.length){const term=sorted.find(t=>t.ja.length>=2&&text.startsWith(t.ja,offset)&&!/[\p{Script=Han}]/u.test(text[offset-1]||'')&&!/[\p{Script=Han}]/u.test(text[offset+t.ja.length]||''));if(term){if(plain){result.push({text:plain});plain='';}result.push({text:term.ja,reading:term.reading});offset+=term.ja.length;}else plain+=text[offset++];}
  if(plain)result.push({text:plain});tokens=result;
 }
 if(!hasAlignedRuby(text,tokens)||!tokens.some(t=>t.reading))return <Text selectable style={[s.body,{color:colors.text},heading&&s.heading]}>{text}</Text>;
 return <View accessible accessibilityLabel={text} style={s.rubyLine}>{tokens.flatMap(p=>p.reading?[p]:Array.from(p.text,ch=>({text:ch,reading:undefined}))).map((p,i)=>p.text==='\n'?<View key={i} style={{width:'100%'}}/>:<View key={i} style={s.word}><Text style={[s.reading,{color:colors.muted}]}>{p.reading||' '}</Text><Text selectable style={[s.body,{color:colors.text},heading&&s.heading]}>{p.text}</Text></View>)}</View>;
}
const s=StyleSheet.create({body:{fontSize:17,lineHeight:29},heading:{fontSize:19,lineHeight:31,fontWeight:'700'},rubyLine:{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',paddingVertical:2},word:{alignItems:'center'},reading:{fontSize:10,lineHeight:14}});
