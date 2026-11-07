import {Text,View} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';

type Labels={practice:string;sleeve:string;thimble:string;position:string;inRange:string;outOfRange:string;mean:string;practiceRange:string;anode:string;cathode:string;workpiece:string;electroplating:string;anodizing:string;current:string;area:string;currentDensity:string};
type LocalizedLesson={sourceHash:string;title:string;exampleTitle:string;exampleText:string;structureTitle?:string;structureText?:string};
const locales=require('@/data/manufacturing/royal-week01-technical-locales.json').locales as Record<string,{labels:Labels;lessons:Record<string,LocalizedLesson>}>;
const revisions:Record<string,string>={
 "mfg1-mechanical-lesson-012":"a5d4b0e59956b0f039f65bff4cbbd18ff5226fabf1b779acf75d49a72e8a20d8",
 "mfg1-mechanical-lesson-013":"08cbdd5a897752800177bb3bacbb13be2643f58b7aa40aa6d646b189c37e8608",
 "mfg1-mechanical-lesson-014":"85a6746f35d720c9df6341d0dc10f9885ddf0109d44a8376a0b1e4f8e6de95c7",
 "mfg1-electrical-l012":"6bf38e20c1e07bb94c4132c8f23e67fb1bad3d4b9455e430e4fb7af1655dc041",
 "mfg1-electrical-l013":"61e3e1aa396f6864baab347c846ccec451c6669338ca2240ed4341bcaa9d7ade",
 "mfg1-electrical-l014":"9990d5682d40bc83845c192ee91e3a53bb1b9d047c76418e2b218339e7733571",
 "mfg1-surface-lesson-012":"e5a9a9cbab9721de9b90fd516becdfda25b41dadfe600ec6f9a09c7bd334687c",
 "mfg1-surface-lesson-013":"dfe9d92dafdcd046ed51e8fd2b47ad4f4f63c475a8816f82836bbc03713166b8",
 "mfg1-surface-lesson-014":"91d2a2ac2c673a2dd9f791f9bb7f25c50306bb783fdab8a3b4993356e09a1884",

 'mfg1-mechanical-lesson-011':'7c03413b76ee4823f4b9ac8ec818aa9003f657910af6dff216db2eb51c4ac24d',
 'mfg1-electrical-l011':'7ac97182b7515dae74e6937e1e9cfd82d179c70e14b1d1eec949ea5ab80d3c89',
 'mfg1-surface-lesson-011':'04877240b0ed95efd66acf3164467afea7b036133b3f3ae477d7a24d5804f2a2',

 'mfg1-surface-lesson-010':'5af27b4e06505d5542bfe0003988ef628d1e222886b305c43eed0938cc51007e',
 'mfg1-electrical-l004':'ed8991b0b74fd0ee53acaefe01df73626d5bd64d6cac7aada260b37598f11bd9',
 'mfg1-surface-lesson-003':'732f5babc3b1116021edc5fe629199f15ea34e6e46dae7d7c13a92fd59d99cd7',
 'mfg1-surface-lesson-005':'ffa9eee69706855dfb3c0470e0985aba9aa88393ef85ec227786a474e38834d7',
 'mfg1-surface-lesson-006':'10d403ac5e6bd4cb3e079539984a41cb22aaedd6182600405f4ba79b81b9a4f7',
 'mfg1-surface-lesson-007':'747e26aa25b045c129c6f554c21feb702594ea5efeb44b14745a27c2d970e7ee',
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
 if(["mfg1-mechanical-lesson-012", "mfg1-mechanical-lesson-013", "mfg1-mechanical-lesson-014", "mfg1-electrical-l012", "mfg1-electrical-l013", "mfg1-electrical-l014", "mfg1-surface-lesson-012", "mfg1-surface-lesson-013", "mfg1-surface-lesson-014"].includes(lesson.id))return <View testID="manufacturing-native-week02-final-technical" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={heading}>{target.structureTitle}</Text><Text style={body}>{target.structureText}</Text>
  <Text style={heading}>{target.exampleTitle}</Text><Text style={body}>{target.exampleText}</Text>
 </View>;
 if(lesson.id==='mfg1-mechanical-lesson-011')return <View testID="manufacturing-native-qc-control-example" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={heading}>{target.structureTitle}</Text><Text style={body}>{target.structureText}</Text>
  <Text style={heading}>{target.exampleTitle}</Text><Text style={body}>{target.exampleText}</Text>
 </View>;
 if(lesson.id==='mfg1-electrical-l011')return <View testID="manufacturing-native-variation-example" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={heading}>9.90 mm ≤ x ≤ 10.10 mm</Text>
  {[9.80,10.00,10.20].map(value=><Text key={value} style={body}>{value.toFixed(2)} mm · {value>=9.90&&value<=10.10?labels.inRange:labels.outOfRange}</Text>)}
  <Text style={heading}>{labels.mean}：(9.80 ＋ 10.00 ＋ 10.20) ÷ 3 ＝ 10.00 mm</Text>
  <Text style={body}>{target.exampleText}</Text>
  <Text style={heading}>{target.structureTitle}</Text><Text style={body}>{target.structureText}</Text>
 </View>;
 if(lesson.id==='mfg1-surface-lesson-011')return <View testID="manufacturing-native-concentration-example" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={body}>4.00 g ÷ 0.500 L ＝ 8.00 g/L</Text>
  <Text style={body}>4.00 g ÷ 40.0 g/mol ＝ 0.100 mol</Text>
  <Text style={heading}>0.100 mol ÷ 0.500 L ＝ 0.200 mol/L</Text>
  <Text style={body}>{target.exampleText}</Text>
  <Text style={heading}>{target.structureTitle}</Text><Text style={body}>{target.structureText}</Text>
 </View>;
 if(lesson.id==='mfg1-surface-lesson-010')return <View testID="manufacturing-native-titration-example" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={heading}>13.2 mL − 1.2 mL ＝ 12.0 mL</Text>
  <Text style={body}>HCl ＋ NaOH → NaCl ＋ H₂O · 1：1</Text>
  <Text style={body}>0.100 mol/L × 0.0120 L ＝ 0.00120 mol</Text>
  <Text style={heading}>0.00120 mol ÷ 0.0100 L ＝ 0.120 mol/L</Text>
  <Text style={body}>{target.exampleText}</Text>
 </View>;
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
 if(lesson.id==='mfg1-surface-lesson-005')return <View testID="manufacturing-native-electroplating-example" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={heading}>＋ {labels.anode} · Cu</Text><Text style={body}>Cu → Cu²⁺ ＋ 2e⁻</Text>
  <Text style={heading}>− {labels.cathode} · {labels.workpiece}</Text><Text style={body}>Cu²⁺ ＋ 2e⁻ → Cu</Text>
  <Text style={body}>{target.exampleText}</Text>
 </View>;
 if(lesson.id==='mfg1-surface-lesson-006')return <View testID="manufacturing-native-current-density-example" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={body}>{labels.current}：7.2 A</Text>
  <Text style={body}>{labels.area}：2.4 dm²</Text>
  <Text style={heading}>{labels.currentDensity}：7.2 A ÷ 2.4 dm² ＝ 3.0 A/dm²</Text>
  <Text style={body}>{labels.area}：4.8 dm²</Text>
  <Text style={heading}>{labels.currentDensity}：7.2 A ÷ 4.8 dm² ＝ 1.5 A/dm²</Text>
  <Text style={body}>{target.exampleText}</Text>
 </View>;
 if(lesson.id==='mfg1-surface-lesson-007')return <View testID="manufacturing-native-anodizing-example" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={heading}>{labels.electroplating}：{labels.workpiece} − ({labels.cathode})</Text>
  <Text style={heading}>{labels.anodizing}：{labels.workpiece} ＋ ({labels.anode})</Text>
  <Text style={body}>{target.exampleText}</Text>
  <Text style={heading}>{target.structureTitle}</Text><Text style={body}>{target.structureText}</Text>
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
