import {Text,View,type StyleProp,type TextStyle} from 'react-native';
import canonical from '@/data/agriculture/lessons.ja.json';
import fertilizer from '@/data/agriculture/fertilizer-native-figures.json';
import drainage from '@/data/agriculture/drainage-method-comparison.json';
import readings from '@/data/agriculture/nutrient-drainage-native-readings.json';
type Token={text:string;readingKana?:string};
type Entry={lessonId:string;sourceHash:string;revision:string;levels:string[];canonicalJapanese:unknown;sourceSnapshot:unknown;fields:Record<string,{sourceJapanese:string;tokens:Token[]}>};
type Context={provider:string;lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language:string;field:string;text:string};
const registry=readings as unknown as {schemaVersion:number;studyOnly:boolean;providers:Record<string,Entry>};
const fertilizerEntries=fertilizer.entries as Record<string,unknown>;
const snapshot=(value:unknown)=>{if(!value||typeof value!=='object')return null;const d=value as Record<string,unknown>,locales=d.locales as Record<string,unknown>;return {...Object.fromEntries(Object.entries(d).filter(([k])=>k!=='locales')),labelsJa:locales?.ja};};
export function agricultureNutrientDrainageReading(p:Context){
 const e=registry.providers[p.provider],l=canonical.lessons.find(l=>l.id===p.lessonId),f=e?.fields[p.field],source=p.provider===`fertilizer:${p.lessonId}`?fertilizerEntries[p.lessonId]:p.provider===`drainage:${p.lessonId}`?drainage:null;
 if(p.language!=='ja'||registry.schemaVersion!==1||!registry.studyOnly||!e||!l||!f||!p.level||e.lessonId!==p.lessonId||e.sourceHash!==p.lessonSourceHash||l.sourceHash!==p.lessonSourceHash||e.revision!==p.lessonRevision||l.revision!==p.lessonRevision||!e.levels.includes(p.level)||!l.levels.includes(p.level)||JSON.stringify(snapshot(source))!==JSON.stringify(e.sourceSnapshot)||JSON.stringify({titleJa:l.titleJa,paragraphs:l.paragraphs.map(p=>({id:p.id,titleJa:p.titleJa,textJa:p.textJa}))})!==JSON.stringify(e.canonicalJapanese)||f.sourceJapanese!==p.text||!Array.isArray(f.tokens)||!f.tokens.length||f.tokens.map(t=>t.text).join('')!==p.text||!f.tokens.every(t=>!!t.text&&(!/[\p{Script=Han}々]/u.test(t.text)||typeof t.readingKana==='string'&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s]+$/u.test(t.readingKana))))return null;
 return f.tokens;
}
/** Offline Japanese illustration fields only; stale and foreign text stay plain. */
export function AgricultureNutrientDrainageRuby(p:Context&{style?:StyleProp<TextStyle>;color:string}){
 const tokens=agricultureNutrientDrainageReading(p);if(!tokens)return <Text style={p.style}>{p.text}</Text>;
 const parts=tokens.flatMap(t=>t.readingKana?[t]:Array.from(t.text,text=>({text,readingKana:undefined})));
 return <View accessible accessibilityLabel={p.text} testID={`agri-native-nutrient-drainage-ruby-${p.provider}-${p.field}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{parts.map((t,i)=><View key={i} style={{alignItems:'center',minWidth:0,maxWidth:'100%'}}><Text style={{fontSize:10,lineHeight:14,color:p.color}}>{t.readingKana||' '}</Text><Text style={p.style}>{t.text}</Text></View>)}</View>;
}
