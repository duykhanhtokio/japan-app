import {manufacturingReviewedNativeFieldReading,hasManufacturingReviewedNativeField} from '@/data/manufacturing/native-reviewed-fields';
import {ManufacturingNativeLabel,manufacturingNativeLabelReading} from './ManufacturingNativeLabel';
import {manufacturingNativeFieldCurrent,manufacturingNativeBodyReading,hasManufacturingNativeBodyReading} from '@/data/manufacturing/native-body-readings';
import {ManufacturingIllustrationText as WholeFieldText} from './ManufacturingIllustrationText';
import {Text,View,type StyleProp,type TextStyle,StyleSheet} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import data from '@/data/manufacturing/native-heading-readings.json';
type Part={text:string;reading?:string};
type Entry={sourceHash:string;canonicalParagraphs:unknown;canonicalTitleJa:string;canonicalSummaryJa:string;fields:Record<string,{sourceJapanese:string;parts:Part[]}>};
const registry=data as {schemaVersion:number;revision:string;studyOnly:boolean;entries:Record<string,Entry>};
export function manufacturingIllustrationReading(lesson:ManufacturingLesson,field:string,text:string|undefined):Part[]|undefined{
 if(!manufacturingNativeFieldCurrent(lesson,field,text))return;
 const reviewed=manufacturingReviewedNativeFieldReading(lesson,field,text);if(reviewed)return reviewed;
 const body=manufacturingNativeBodyReading(lesson,field,text);if(body)return body;
 const entry=registry.entries[lesson.id],row=entry?.fields[field];
 if(registry.schemaVersion!==1||registry.revision!=='native-headings-20261107-v1'||!registry.studyOnly||!entry||entry.sourceHash!==lesson.sourceHash||entry.canonicalTitleJa!==lesson.titleJa||entry.canonicalSummaryJa!==lesson.summaryJa||JSON.stringify(entry.canonicalParagraphs)!==JSON.stringify(lesson.paragraphs)||!row||typeof text!=='string'||row.sourceJapanese!==text||!Array.isArray(row.parts)||!row.parts.length||row.parts.map(p=>p?.text).join('')!==text||row.parts.some(p=>!p||typeof p.text!=='string'||!p.text||(/[一-龯々]/.test(p.text)&&(!p.reading||!/^[ぁ-ゖー]+$/.test(p.reading)))||(p.reading!==undefined&&!/^[ぁ-ゖー]+$/.test(p.reading))))return;
 return row.parts;
}
/** Study-only, complete exact-field readings; unknown or stale fields retain canonical plain text. */
export function ManufacturingSourceFieldText({lesson,field,text,enabled=true,style}:{lesson:ManufacturingLesson;field:string;text:string|undefined;enabled?:boolean;style?:StyleProp<TextStyle>}){
 const parts=enabled?manufacturingIllustrationReading(lesson,field,text):undefined;
 if(!parts){
  // A known stale source-bound field cannot bypass its guard through the generic lookup.
  if(enabled&&!registry.entries[lesson.id]?.fields[field]&&!hasManufacturingNativeBodyReading(lesson.id,field)&&!hasManufacturingReviewedNativeField(lesson.id,field)&&manufacturingNativeFieldCurrent(lesson,field,text))return <WholeFieldText readingLanguage="ja" style={style}>{text}</WholeFieldText>;
  return <Text style={style}>{text}</Text>;
 }
 return renderNativeParts(text,parts,style,`manufacturing-illustration-ruby-${lesson.id}-${field}`);
}
function renderNativeParts(text:string|undefined,parts:Part[],style:StyleProp<TextStyle>|undefined,testID:string){
 const color=StyleSheet.flatten(style)?.color;
 const pieces:Part[]=parts.flatMap(p=>p.reading?[p]:p.text.split(/(\n)/).filter(Boolean).map(text=>({text})));
 return <View accessible accessibilityLabel={text} testID={testID} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{pieces.map((p,i)=>p.text==='\n'?<View key={i} accessible={false} style={{width:'100%',height:6}}/>:<View key={i} style={{alignItems:'center',maxWidth:'100%',minWidth:0}}><Text style={{fontSize:10,lineHeight:14,color}}>{p.reading??' '}</Text><Text style={style}>{p.text}</Text></View>)}</View>;
}

/** Compose only complete current practice-label/title arrays in a single wrapping heading. */
export function ManufacturingNativePracticeHeading({lesson,text,practice,enabled=true,style}:{lesson:ManufacturingLesson;text:string;practice:string;enabled?:boolean;style?:StyleProp<TextStyle>}){
 const title=enabled?manufacturingIllustrationReading(lesson,'title',text):undefined,label=enabled?manufacturingNativeLabelReading(lesson,'practice',practice):undefined;
 if(title&&label)return renderNativeParts(practice+' · '+text,[...label,{text:' · '},...title],style,`manufacturing-illustration-ruby-${lesson.id}-title`);
 return <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={practice} enabled={enabled} style={style}/><Text style={style}> · {text}</Text></View>;
}
