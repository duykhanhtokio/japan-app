import {Text,View,type StyleProp,type TextStyle} from 'react-native';
import content from '@/data/agriculture/lessons.ja.json';
import readings from '@/data/agriculture/native-support-headings-readings.json';
type Token={text:string;readingKana?:string};
type Entry={sourceHash:string;revision:string;levels:string[];fields:Record<string,{sourceJapanese:string;tokens:Token[]}>};
const data=readings as {schemaVersion:number;studyOnly:boolean;entries:Record<string,Entry>};
type Context={lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;field:string;text:string};
export function agricultureNativeSupportReading({lessonId,lessonSourceHash,lessonRevision,level,field,text}:Context){
 const l=content.lessons.find(l=>l.id===lessonId),e=data.entries[lessonId],f=e?.fields[field];
 const canonical=field==='title'?l?.titleJa:field.startsWith('paragraphTitle:')?l?.paragraphs.find(p=>p.id===field.slice('paragraphTitle:'.length))?.titleJa:undefined;
 if(data.schemaVersion!==1||!data.studyOnly||!l||!e||!f||!level||!lessonRevision||!l.levels.includes(level)||!e.levels.includes(level)||l.sourceHash!==lessonSourceHash||e.sourceHash!==lessonSourceHash||l.revision!==lessonRevision||e.revision!==lessonRevision||canonical!==text||f.sourceJapanese!==text||!Array.isArray(f.tokens)||!f.tokens.length||f.tokens.map(t=>t.text).join('')!==text||!f.tokens.every(t=>!!t.text&&(!/[\p{Script=Han}々]/u.test(t.text)||typeof t.readingKana==='string'&&!!t.readingKana&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s]+$/u.test(t.readingKana))))return null;
 return f.tokens;
}
/** Native image-support headings only; unavailable/stale readings keep canonical text. */
export function AgricultureNativeSupportRuby(props:Context&{style?:StyleProp<TextStyle>;color:string}){
 const tokens=agricultureNativeSupportReading(props);if(!tokens)return <Text style={props.style}>{props.text}</Text>;
 const parts=tokens.flatMap(t=>t.readingKana?[t]:Array.from(t.text,text=>({text,readingKana:undefined})));
 return <View accessible accessibilityLabel={props.text} testID={`agri-native-support-ruby-${props.lessonId}-${props.field}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{parts.map((t,i)=><View key={i} style={{alignItems:'center',minWidth:0,maxWidth:'100%'}}><Text style={{fontSize:10,lineHeight:14,color:props.color}}>{t.readingKana||' '}</Text><Text style={props.style}>{t.text}</Text></View>)}</View>;
}
