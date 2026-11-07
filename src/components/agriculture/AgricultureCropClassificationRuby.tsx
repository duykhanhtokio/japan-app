import {Text,View,type StyleProp,type TextStyle} from 'react-native';
import canonical from '@/data/agriculture/lessons.ja.json';
import source from '@/data/agriculture/crop-classification-native.json';
import readings from '@/data/agriculture/crop-classification-readings.json';
import type {AgricultureLesson} from '@/data/agriculture';
type Token={text:string;readingKana?:string};
type Context={lesson:AgricultureLesson;level:string;language:string;field:string;text:string};
const registry=readings as unknown as {schemaVersion:number;studyOnly:boolean;lessonId:string;sourceHash:string;revision:string;scopeLevels:string[];sourceSnapshot:unknown;canonicalJapanese:unknown;fields:Record<string,{sourceJapanese:string;tokens:Token[]}>};
const japanese=(l:AgricultureLesson)=>({titleJa:l.titleJa,paragraphs:l.paragraphs.map(p=>({id:p.id,titleJa:p.titleJa,textJa:p.textJa}))});
export function agricultureCropClassificationReading(p:Context){
 const e=registry,l=canonical.lessons.find(l=>l.id===p.lesson.id),f=e.fields[p.field];
 if(p.language!=='ja'||e.schemaVersion!==1||!e.studyOnly||!f||!l||p.lesson.id!==e.lessonId||p.lesson.sourceHash!==e.sourceHash||l.sourceHash!==e.sourceHash||p.lesson.revision!==e.revision||l.revision!==e.revision||!e.scopeLevels.includes(p.level)||!l.levels.includes(p.level)||JSON.stringify({...Object.fromEntries(Object.entries(source).filter(([k])=>k!=='locales')),localesJa:source.locales.ja})!==JSON.stringify(e.sourceSnapshot)||JSON.stringify(japanese(l))!==JSON.stringify(e.canonicalJapanese)||JSON.stringify(japanese(p.lesson))!==JSON.stringify(e.canonicalJapanese)||f.sourceJapanese!==p.text||!Array.isArray(f.tokens)||!f.tokens.length||f.tokens.map(t=>t.text).join('')!==p.text||!f.tokens.every(t=>typeof t.text==='string'&&!!t.text&&(t.readingKana===undefined||typeof t.readingKana==='string'&&!!t.readingKana.trim()&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s]+$/u.test(t.readingKana))&&(!/[\p{Script=Han}々]/u.test(t.text)||typeof t.readingKana==='string'&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s]+$/u.test(t.readingKana))))return null;
 return f.tokens;
}
/** Exact offline Japanese figure fields. Translations and unknown/stale fields stay plain. */
export function AgricultureCropClassificationRuby(p:Context&{style?:StyleProp<TextStyle>;color:string}){
 const tokens=agricultureCropClassificationReading(p);if(!tokens)return <Text style={p.style}>{p.text}</Text>;
 const parts=tokens.flatMap(t=>t.readingKana?[t]:Array.from(t.text,text=>({text,readingKana:undefined})));
 return <View accessible accessibilityLabel={p.text} testID={`agri-native-figure-ruby-crop-classification-${p.field}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{parts.map((t,i)=><View key={i} style={{alignItems:'center',minWidth:0,maxWidth:'100%'}}><Text style={{fontSize:10,lineHeight:14,color:p.color}}>{t.readingKana||' '}</Text><Text style={p.style}>{t.text}</Text></View>)}</View>;
}
