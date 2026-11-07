import {Text,View,type StyleProp,type TextStyle} from 'react-native';
import content from '@/data/agriculture/lessons.ja.json';
import readings from '@/data/agriculture/native-figure-readings.json';
import {nativeFigureReadingSource} from './NativeFigureReadingSource';
import {agricultureNativeProviderReading,type NativeFigureProviderContext} from './NativeFigureProviderReadings';
export {nativeFigureReadingSource} from './NativeFigureReadingSource';
type Token={text:string;readingKana?:string};
type Entry={sourceHash:string;revision:string;levels:string[];sourceSignature:string;fields:Record<string,{sourceJapanese:string;tokens:Token[]}>};
const data=readings as {schemaVersion:number;studyOnly:boolean;entries:Record<string,Entry>};
type GenericContext={lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;field:string;text:string};
type Context=GenericContext|NativeFigureProviderContext;
export function agricultureNativeFigureReading(p:Context){
 if('provider' in p)return agricultureNativeProviderReading(p);
 const {lessonId,lessonSourceHash,lessonRevision,level,field,text}=p;
 const l=content.lessons.find(l=>l.id===lessonId),e=data.entries[lessonId],f=e?.fields[field],source=nativeFigureReadingSource(lessonId);
 if(data.schemaVersion!==1||!data.studyOnly||!l||!e||!f||!source||!level||!lessonRevision||!l.levels.includes(level)||!e.levels.includes(level)||l.sourceHash!==lessonSourceHash||e.sourceHash!==lessonSourceHash||l.revision!==lessonRevision||e.revision!==lessonRevision||source.signature!==e.sourceSignature||source.fields[field]!==text||f.sourceJapanese!==text||!Array.isArray(f.tokens)||!f.tokens.length||f.tokens.map(t=>t.text).join('')!==text||!f.tokens.every(t=>typeof t.text==='string'&&!!t.text&&(t.readingKana===undefined||typeof t.readingKana==='string'&&!!t.readingKana.trim()&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s]+$/u.test(t.readingKana))&&(!/[\p{Script=Han}々]/u.test(t.text)||!!t.readingKana)))return null;
 return f.tokens;
}
/** Exact current native content only; stale/unreviewed fields keep source Japanese. */
export function AgricultureNativeFigureRuby(props:Context&{style?:StyleProp<TextStyle>;color:string}){
 const tokens=agricultureNativeFigureReading(props);if(!tokens)return <Text style={props.style}>{props.text}</Text>;
 const parts=tokens.flatMap(t=>t.readingKana?[t]:Array.from(t.text,text=>({text,readingKana:undefined})));
 return <View accessible accessibilityLabel={props.text} testID={`agri-native-figure-ruby-${'provider' in props?props.provider:props.lessonId}-${props.field}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{parts.map((t,i)=><View key={i} style={{alignItems:'center',minWidth:0,maxWidth:'100%'}}><Text style={{fontSize:10,lineHeight:14,color:props.color}}>{t.readingKana||' '}</Text><Text style={props.style}>{t.text}</Text></View>)}</View>;
}
