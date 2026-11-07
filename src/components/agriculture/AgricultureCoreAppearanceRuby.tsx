import {Text,View,type StyleProp,type TextStyle} from 'react-native';
import canonical from '@/data/agriculture/lessons.ja.json';
import rice from '@/data/agriculture/rice-process-labels.json';
import fruit from '@/data/agriculture/fruit-tree-comparison-alt.json';
import flower from '@/data/agriculture/flower-appearance-figure.json';
import readings from '@/data/agriculture/core-appearance-native-readings.json';
import type {AgricultureLesson} from '@/data/agriculture';
type Token={text:string;readingKana?:string};
type Provider='rice-process'|'fruit-tree'|'flower-appearance';
type Context={provider:Provider;lesson:AgricultureLesson;level?:string;language:string;field:string;text:string};
type Entry={titleLocales?:Record<string,string>;lessonId:string;sourceHash:string;revision:string;scopeLevels:string[];sourceSnapshot:unknown;canonicalJapanese:unknown;fields:Record<string,{sourceJapanese:string;tokens:Token[]}>};
const registry=readings as unknown as {schemaVersion:number;studyOnly:boolean;providers:Record<Provider,Entry>};
const snapshot=(d:object,key:string,ja:unknown)=>({...Object.fromEntries(Object.entries(d).filter(([k])=>k!==key)),[key==='alt'?'altJa':'labelsJa']:ja});
const snapshots={'rice-process':()=>snapshot(rice,'labels',rice.labels.ja),'fruit-tree':()=>snapshot(fruit,'alt',fruit.alt.ja),'flower-appearance':()=>snapshot(flower,'labels',flower.labels.ja)};
const japanese=(l:AgricultureLesson)=>({titleJa:l.titleJa,paragraphs:l.paragraphs.map(p=>({id:p.id,titleJa:p.titleJa,textJa:p.textJa}))});
export function agricultureCoreAppearanceReading(p:Context){
 const e=registry.providers[p.provider],l=canonical.lessons.find(l=>l.id===p.lesson.id),f=e?.fields[p.field];
 if(p.language!=='ja'||registry.schemaVersion!==1||!registry.studyOnly||!e||!f||!l||!p.level||p.lesson.id!==e.lessonId||p.lesson.sourceHash!==e.sourceHash||l.sourceHash!==e.sourceHash||p.lesson.revision!==e.revision||l.revision!==e.revision||!e.scopeLevels.includes(p.level)||!l.levels.includes(p.level)||JSON.stringify(snapshots[p.provider]())!==JSON.stringify(e.sourceSnapshot)||JSON.stringify(japanese(l))!==JSON.stringify(e.canonicalJapanese)||JSON.stringify(japanese(p.lesson))!==JSON.stringify(e.canonicalJapanese)||f.sourceJapanese!==p.text||!Array.isArray(f.tokens)||!f.tokens.length||f.tokens.map(t=>t.text).join('')!==p.text||!f.tokens.every(t=>!!t.text&&(!/[\p{Script=Han}々]/u.test(t.text)||typeof t.readingKana==='string'&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s]+$/u.test(t.readingKana))))return null;
 return f.tokens;
}
/** Exact offline Japanese figure fields. Translations and unknown/stale fields stay plain. */
export function AgricultureCoreAppearanceRuby(p:Context&{style?:StyleProp<TextStyle>;color:string}){
 const tokens=agricultureCoreAppearanceReading(p);if(!tokens)return <Text style={p.style}>{p.text}</Text>;
 const parts=tokens.flatMap(t=>t.readingKana?[t]:Array.from(t.text,text=>({text,readingKana:undefined})));
 return <View accessible accessibilityLabel={p.text} testID={`agri-native-figure-ruby-${p.provider}-${p.field}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{parts.map((t,i)=><View key={i} style={{alignItems:'center',minWidth:0,maxWidth:'100%'}}><Text style={{fontSize:10,lineHeight:14,color:p.color}}>{t.readingKana||' '}</Text><Text style={p.style}>{t.text}</Text></View>)}</View>;
}

export function coreAppearanceLocalizedTitle(p:{provider:Provider;lesson:AgricultureLesson;level?:string;language:string}){const e=registry.providers[p.provider];if(!e?.titleLocales||e.titleLocales.ja!==e.fields.title.sourceJapanese||!agricultureCoreAppearanceReading({...p,language:'ja',field:'title',text:e.fields.title.sourceJapanese}))return null;return e.titleLocales[p.language]?.trim()||null;}
