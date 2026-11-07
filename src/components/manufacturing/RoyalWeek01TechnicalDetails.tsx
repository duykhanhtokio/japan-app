import {Text,View} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';

type Labels={practice:string;sleeve:string;thimble:string;position:string;inRange:string;outOfRange:string;mean:string;practiceRange:string};
type LocalizedLesson={sourceHash:string;title:string;exampleTitle:string;exampleText:string};
const locales=require('@/data/manufacturing/royal-week01-technical-locales.json').locales as Record<string,{labels:Labels;lessons:Record<string,LocalizedLesson>}>;
const revisions:Record<string,string>={
 'mfg1-electrical-l004':'ed8991b0b74fd0ee53acaefe01df73626d5bd64d6cac7aada260b37598f11bd9',
 'mfg1-surface-lesson-003':'732f5babc3b1116021edc5fe629199f15ea34e6e46dae7d7c13a92fd59d99cd7',
};

/** Exact native numbers accompany the artwork; generated scale marks are never a reading exercise. */
export function RoyalWeek01TechnicalDetails({lesson,language='ja'}:{lesson:ManufacturingLesson;language?:string}){
 const {colors}=useStudyAppearance();
 if(revisions[lesson.id]!==lesson.sourceHash)return null;
 const selected=Object.prototype.hasOwnProperty.call(locales,language)?locales[language]:locales.ja;
 const target=selected.lessons[lesson.id],labels=selected.labels;
 if(!target||target.sourceHash!==lesson.sourceHash)return null;
 const body={color:colors.text,fontSize:17,lineHeight:29};
 const heading={...body,fontWeight:'700' as const};
 const border={borderWidth:1,borderColor:colors.border,borderRadius:10,padding:14,gap:10};
 if(lesson.id==='mfg1-electrical-l004')return <View testID="manufacturing-native-micrometer-example" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={body}>{labels.sleeve}：6 mm ＋ 0.5 mm ＝ 6.5 mm</Text>
  <View accessibilityLabel={`${labels.sleeve}: 6 mm + 0.5 mm = 6.5 mm`} style={{height:110,marginHorizontal:12}}>
   <View style={{position:'absolute',left:0,right:0,top:42,height:2,backgroundColor:colors.text}}/>
   {Array.from({length:14},(_,i)=><View key={i} style={{position:'absolute',left:`${i/14*100}%`,top:i%2===0?21:42,width:i===13?3:1,height:i%2===0?23:18,backgroundColor:i===13?colors.translationText:colors.text}}>
    {i%2===0&&<Text style={{position:'absolute',left:-10,top:-23,width:24,fontSize:15,color:colors.text,textAlign:'center'}}>{i/2}</Text>}
   </View>)}
   <Text style={{position:'absolute',right:0,top:67,fontSize:16,lineHeight:26,fontWeight:'700',color:colors.translationText}}>＋ 0.5 mm</Text>
  </View>
  <Text style={body}>{labels.thimble}：24 × 0.01 mm ＝ 0.24 mm</Text>
  <Text style={heading}>6.5 mm ＋ 0.24 mm ＝ 6.74 mm</Text>
  <Text style={body}>{target.exampleText}</Text>
 </View>;
 return <View testID="manufacturing-native-coating-example" style={border}>
  <Text style={heading}>{labels.practice} · {labels.practiceRange} 8〜12 μm</Text>
  {[{position:1,value:7},{position:2,value:10},{position:3,value:13}].map(row=><View key={row.position} style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:8,borderBottomWidth:1,borderBottomColor:colors.border,paddingVertical:8}}>
   <Text style={body}>{labels.position} {row.position}</Text><Text style={heading}>{row.value} μm</Text><Text style={body}>{row.value>=8&&row.value<=12?labels.inRange:labels.outOfRange}</Text>
  </View>)}
  <Text style={heading}>{labels.mean}：(7 ＋ 10 ＋ 13) ÷ 3 ＝ 10 μm</Text>
  <Text style={body}>{target.exampleText}</Text>
 </View>;
}
