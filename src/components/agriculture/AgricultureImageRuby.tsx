import {Text,View,type StyleProp,type TextStyle} from 'react-native';
import data from '@/data/agriculture/image-readings.json';
type Token={text:string;readingKana?:string};
type Entry={assetSha256:string;lessonSourceHashes:Record<string,string>;lessonRevisions:Record<string,string>;fields:Record<string,{sourceJapanese:string;tokens:Token[]}>};
const registry=data as {schemaVersion:number;studyOnly:boolean;entries:Record<string,Entry>};
const han=(s:string)=>/[\p{Script=Han}々]/u.test(s);
export function agricultureImageReading({imageId,assetSha256,lessonId,lessonSourceHash,lessonRevision,field,text}:{imageId:string;assetSha256:string;lessonId:string;lessonSourceHash:string;lessonRevision?:string;field:string;text:string}){
 const e=registry.entries[imageId],f=e?.fields[field];
 if(registry.schemaVersion!==1||!registry.studyOnly||!lessonRevision||!e||e.assetSha256!==assetSha256||e.lessonSourceHashes[lessonId]!==lessonSourceHash||e.lessonRevisions[lessonId]!==lessonRevision||!f||f.sourceJapanese!==text||!Array.isArray(f.tokens)||!f.tokens.length||f.tokens.map(t=>t.text).join('')!==text||!f.tokens.every(t=>typeof t.text==='string'&&!!t.text&&(!han(t.text)||(typeof t.readingKana==='string'&&!!t.readingKana&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s]+$/u.test(t.readingKana)))))return null;
 return f.tokens;
}
/** Offline image-caption readings only. Unknown/stale fields keep canonical Japanese. */
export function AgricultureImageRuby(props:Parameters<typeof agricultureImageReading>[0]&{style?:StyleProp<TextStyle>;color:string}){
 const tokens=agricultureImageReading(props);
 if(!tokens)return <Text style={props.style}>{props.text}</Text>;
 const parts=tokens.flatMap(t=>t.readingKana?[t]:Array.from(t.text,text=>({text,readingKana:undefined})));
 return <View accessible accessibilityLabel={props.text} testID={`agri-image-ruby-${props.imageId}-${props.field}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{parts.map((t,i)=><View key={i} style={{alignItems:'center',maxWidth:'100%',minWidth:0}}><Text style={{fontSize:10,lineHeight:14,color:props.color}}>{t.readingKana||' '}</Text><Text style={props.style}>{t.text}</Text></View>)}</View>;
}
