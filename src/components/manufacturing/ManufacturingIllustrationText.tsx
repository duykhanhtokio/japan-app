import {Text,View,type StyleProp,type TextStyle,StyleSheet} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import data from '@/data/manufacturing/illustration-readings.json';
type Part={text:string;reading?:string};
type Entry={sourceHash:string;canonicalParagraphs:unknown;canonicalTitleJa:string;canonicalSummaryJa:string;fields:Record<string,{sourceJapanese:string;parts:Part[]}>};
const registry=data as {schemaVersion:number;revision:string;studyOnly:boolean;entries:Record<string,Entry>};
export function manufacturingIllustrationReading(lesson:ManufacturingLesson,field:string,text:string|undefined):Part[]|undefined{
 const entry=registry.entries[lesson.id],row=entry?.fields[field];
 if(registry.schemaVersion!==1||registry.revision!=='native-headings-20261107-v1'||!registry.studyOnly||!entry||entry.sourceHash!==lesson.sourceHash||entry.canonicalTitleJa!==lesson.titleJa||entry.canonicalSummaryJa!==lesson.summaryJa||JSON.stringify(entry.canonicalParagraphs)!==JSON.stringify(lesson.paragraphs)||!row||typeof text!=='string'||row.sourceJapanese!==text||!Array.isArray(row.parts)||!row.parts.length||row.parts.map(p=>p?.text).join('')!==text||row.parts.some(p=>!p||typeof p.text!=='string'||!p.text||(/[一-龯々]/.test(p.text)&&(!p.reading||!/^[ぁ-ゖー]+$/.test(p.reading)))||(p.reading!==undefined&&!/^[ぁ-ゖー]+$/.test(p.reading))))return;
 return row.parts;
}
/** Study-only, complete exact-field readings; unknown or stale fields retain canonical plain text. */
export function ManufacturingIllustrationText({lesson,field,text,enabled=true,style}:{lesson:ManufacturingLesson;field:string;text:string|undefined;enabled?:boolean;style?:StyleProp<TextStyle>}){
 const parts=enabled?manufacturingIllustrationReading(lesson,field,text):undefined;
 if(!parts)return <Text style={style}>{text}</Text>;
 const color=StyleSheet.flatten(style)?.color;
 return <View accessible accessibilityLabel={text} testID={`manufacturing-illustration-ruby-${lesson.id}-${field}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{parts.map((p,i)=><View key={i} style={{alignItems:'center',maxWidth:'100%',minWidth:0}}><Text style={{fontSize:10,lineHeight:14,color}}>{p.reading??' '}</Text><Text style={style}>{p.text}</Text></View>)}</View>;
}
