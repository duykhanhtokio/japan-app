import {Text,View} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';

type Labels={practice:string;sleeve:string;thimble:string;position:string;inRange:string;outOfRange:string;mean:string;practiceRange:string;anode:string;cathode:string;workpiece:string;electroplating:string;anodizing:string;current:string;area:string;currentDensity:string};
type LocalizedLesson={sourceHash:string;title:string;exampleTitle:string;exampleText:string;structureTitle?:string;structureText?:string};
const locales=require('@/data/manufacturing/royal-week01-technical-locales.json').locales as Record<string,{labels:Labels;lessons:Record<string,LocalizedLesson>}>;
const revisions:Record<string,string>={
 "mfg1-mechanical-lesson-022":"d5c1735efb0bac01ec4ed99cb4529f082707eb13ad4dc0add75e763cb670917f",
 "mfg1-mechanical-lesson-023":"4c3d36c42bfa45684851a2285be9340525b828f38d1be4d92a98ef6b84596548",
 "mfg1-mechanical-lesson-024":"227583377d3c80d522fdf31e94e8cf33b250ef28d8bf9442a6b897df6d7b8f9a",
 "mfg1-mechanical-lesson-025":"f10a6e71572a00b6e42ac2d3c205687180b5190360b3475806766833afecbad4",
 "mfg1-mechanical-lesson-026":"1467a3b735cf59c9b4d697a8017363c4d846e3981531a08f1fb42229be0871c7",
 "mfg1-mechanical-lesson-027":"329329bc14af273612560ce204f783fd62c969ba3874eb130403ffec2b60b0a2",
 "mfg1-mechanical-lesson-028":"0c4e295a731282369bb81571b25700d537e14949308916bcd75e03914565555c",
 "mfg1-electrical-l022":"a680c5bfcdaace4358439016b5305ee47889bdadc534f139ef7639c53c75b82f",
 "mfg1-electrical-l023":"5e8b9ca9ce437a0ab453ee1b4b1263f1a78f85c1db93b37c2209f6c198919973",
 "mfg1-electrical-l024":"ec282035552d7ae1be1486a6287e4710f738254307794e9da64218526aa33f91",
 "mfg1-electrical-l025":"f6c61e108c840e7b1ccf9794a4da7c366703a38c3368945803d9310c31a1aa37",
 "mfg1-electrical-l026":"1d7fdf6cc82278ade4f9b755e5fbdc449f5b46931a1aea345db76d9fe9e3b2a5",
 "mfg1-electrical-l027":"e33b8ccae4da46a52b6bb775596d119b418562198357bc8a06af0d0defd157f1",
 "mfg1-electrical-l028":"cedf3f5b13b0d74026ab57d69794392e8b571766d3af97be396225cd7d8ee33a",
 "mfg1-surface-lesson-022":"c54958c37a7ae8be011c85bb08214e734b09daf668e56b6cb175cc8ec52a46be",
 "mfg1-surface-lesson-023":"c68c6b0c18d9e9705e4dd62e62597e1cb2f16d0c146d7bdb7adf61ca696b7967",
 "mfg1-surface-lesson-024":"bf4e0da0d0fa1e1a6a10577bb0b289b98209af70e116732b2efd36601c7d2a98",
 "mfg1-surface-lesson-025":"0c8d9fdcaeeb19f96f6abb07643cad182c3a1a88dc5534380b3882d7aa04aa0e",
 "mfg1-surface-lesson-026":"a77fcbeb8fdf745f1f0349170adb6f017c699a694e154e8a86836a089f9b0dc5",
 "mfg1-surface-lesson-027":"8494cfcd8849b3f8887ee2c43e00d91bd0d3c1612d2ba0196e50dc898394beeb",
 "mfg1-surface-lesson-028":"c34ffc0a11292702342aef819eca87403854c5057221855741e162f8ff7eb874",

 "mfg1-mechanical-lesson-015":"92d89fedabc628cafb74ccd7016933d216455d72cfbcf37ad49e2e96d26ff1fc",
 "mfg1-mechanical-lesson-016":"7a5f9b7be83e4d562c947fb6a42327f8d6e423a195e91ed74c0d0fb738841ae6",
 "mfg1-mechanical-lesson-017":"4b551fd599fce7d837a851436feb5d27be33ed01e7df1bfdc733532a82218348",
 "mfg1-mechanical-lesson-018":"ef7d6a94982c25a984c9480e920b2af82a1a00fa9bf3844e86e9877681db9cdb",
 "mfg1-mechanical-lesson-019":"d9e8a5bb0d6a2da7895edccb6b78c93e52896b444c1386efcbd415b456e83cc1",
 "mfg1-mechanical-lesson-020":"d093d570d5b0a9a12428523e25be3ba8375577f612c2c85f1810397662eca666",
 "mfg1-mechanical-lesson-021":"7f588a7c67b86e7ad773e48af595bd25d8ce8d0f9a4b1feb6b0107d4bdd930a1",
 "mfg1-electrical-l015":"25d7da40236abfd57e0e62fafda205a46a321d258e83fad5905f178fb6ce31bb",
 "mfg1-electrical-l016":"51f6e5bb168cd2a249b1464289b25b0250ee9ca98d0da790de78b2a55cc21dc0",
 "mfg1-electrical-l017":"42bdff3e0759e2d01d348391465d41b9dea1edc600922d8541b54e4833420065",
 "mfg1-electrical-l018":"e31e735cd6be75ceadc82390e397911487373abb684564fe38ea8925180e562b",
 "mfg1-electrical-l019":"1f1e498d2079634e54fcc72973deeaab17f02e59ebb46b3f54e25fda1f7c8d67",
 "mfg1-electrical-l020":"c05ab4a434bc985022ac055dab7f2aed0c5f10a452be0ebe5f8faa925d1fa571",
 "mfg1-electrical-l021":"08d8e5394649ca2538ce30436be9d2c3bf52533e39038c791c6b598cc4f3ca13",
 "mfg1-surface-lesson-015":"fd31fbe0802e41410b6a406e38ff5c8e0c33d9dd9fcc3f459b7da4f7d699f606",
 "mfg1-surface-lesson-016":"0b3e38703af71909630f6026c9fd8913913e0512d423614412c2f91fadaf0109",
 "mfg1-surface-lesson-017":"35499ac8a309fe7dc4519aedb61d9f861b200351d52a202441d510864bdf9f67",
 "mfg1-surface-lesson-018":"7fa1081fc992c4c9bf535ebc3dc3f8bc04a044280f642ce806feeae76bb030d5",
 "mfg1-surface-lesson-019":"a71b6d182a8d4c4dae7201ea2fef28f8295634c58c6626a656a971c9119fc7e9",
 "mfg1-surface-lesson-020":"23e6277b01cc5f4ed700e36c05b3d2591b985496e97d1be1b59622e852e44da7",
 "mfg1-surface-lesson-021":"b32a9734e0806ab2a5c171d3d8213ab48c45a40ffe05e244aa691a5d5b5a6a7e",

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
 if(["mfg1-mechanical-lesson-022", "mfg1-mechanical-lesson-023", "mfg1-mechanical-lesson-024", "mfg1-mechanical-lesson-025", "mfg1-mechanical-lesson-026", "mfg1-mechanical-lesson-027", "mfg1-mechanical-lesson-028", "mfg1-electrical-l022", "mfg1-electrical-l023", "mfg1-electrical-l024", "mfg1-electrical-l025", "mfg1-electrical-l026", "mfg1-electrical-l027", "mfg1-electrical-l028", "mfg1-surface-lesson-022", "mfg1-surface-lesson-023", "mfg1-surface-lesson-024", "mfg1-surface-lesson-025", "mfg1-surface-lesson-026", "mfg1-surface-lesson-027", "mfg1-surface-lesson-028"].includes(lesson.id))return <View testID="manufacturing-native-week04-technical" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={heading}>{target.structureTitle}</Text><Text style={body}>{target.structureText}</Text>
  <Text style={heading}>{target.exampleTitle}</Text><Text style={body}>{target.exampleText}</Text>
 </View>;
 if(["mfg1-mechanical-lesson-015", "mfg1-mechanical-lesson-016", "mfg1-mechanical-lesson-017", "mfg1-mechanical-lesson-018", "mfg1-mechanical-lesson-019", "mfg1-mechanical-lesson-020", "mfg1-mechanical-lesson-021", "mfg1-electrical-l015", "mfg1-electrical-l016", "mfg1-electrical-l017", "mfg1-electrical-l018", "mfg1-electrical-l019", "mfg1-electrical-l020", "mfg1-electrical-l021", "mfg1-surface-lesson-015", "mfg1-surface-lesson-016", "mfg1-surface-lesson-017", "mfg1-surface-lesson-018", "mfg1-surface-lesson-019", "mfg1-surface-lesson-020", "mfg1-surface-lesson-021"].includes(lesson.id))return <View testID="manufacturing-native-week03-technical" style={border}>
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
