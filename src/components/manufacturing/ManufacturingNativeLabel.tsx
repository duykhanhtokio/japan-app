import {Text,View,StyleSheet,type StyleProp,type TextStyle} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import data from '@/data/manufacturing/native-label-readings.json';
type Part={text:string;reading?:string};
const registry=data as {schemaVersion:number;revision:string;studyOnly:boolean;lessonSourceHashes:Record<string,string>;fields:Record<string,{sourceJapanese:string;parts:Part[]}>};
/** Canonical lookup shares existing lesson payloads; no repeated per-field full-body copies. */
export function manufacturingNativeLabelReading(lesson:ManufacturingLesson,field:string,text:string):Part[]|undefined{
 const f=registry.fields[field];
 if(registry.schemaVersion!==1||registry.revision!=='native-labels-20261107-v2'||!registry.studyOnly||registry.lessonSourceHashes[lesson.id]!==lesson.sourceHash||!f||f.sourceJapanese!==text)return;
 const canonical=(lesson.specialty==='mechanical'?require('@/data/manufacturing/mechanical.json'):lesson.specialty==='electrical'?require('@/data/manufacturing/electrical.json'):lesson.specialty==='surface'?require('@/data/manufacturing/surface.json'):null)?.lessons.find((l:ManufacturingLesson)=>l.id===lesson.id) as ManufacturingLesson|undefined;
 if(!canonical||canonical.sourceHash!==lesson.sourceHash||canonical.titleJa!==lesson.titleJa||canonical.summaryJa!==lesson.summaryJa||canonical.objectiveJa!==lesson.objectiveJa||JSON.stringify(canonical.paragraphs)!==JSON.stringify(lesson.paragraphs)||!Array.isArray(f.parts)||!f.parts.length||f.parts.map(p=>p?.text).join('')!==text||f.parts.some(p=>!p||typeof p.text!=='string'||!p.text||(/[一-龯々]/.test(p.text)&&(!p.reading||!/^[ぁ-ゖー]+$/.test(p.reading)))||(p.reading!==undefined&&!/^[ぁ-ゖー]+$/.test(p.reading))))return;
 return f.parts;
}
export function ManufacturingNativeLabel({lesson,field,text,enabled=true,style}:{lesson:ManufacturingLesson;field:string;text:string;enabled?:boolean;style?:StyleProp<TextStyle>}){
 const parts=enabled?manufacturingNativeLabelReading(lesson,field,text):undefined,color=StyleSheet.flatten(style)?.color;
 if(!parts)return <Text style={style}>{text}</Text>;
 return <View accessible accessibilityLabel={text} testID={`manufacturing-native-label-ruby-${lesson.id}-${field}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{parts.map((p,i)=><View key={i} style={{alignItems:'center',maxWidth:'100%',minWidth:0}}><Text style={{fontSize:10,lineHeight:14,color}}>{p.reading??' '}</Text><Text style={style}>{p.text}</Text></View>)}</View>;
}
