import {Text,View,type StyleProp,type TextStyle} from 'react-native';
import lessons from '@/data/agriculture/lessons.ja.json';
import figures from '@/data/agriculture/recognition-images.json';
import crop from '@/data/agriculture/crop-calendar-native.json';
import flower from '@/data/agriculture/flower-legend-native.json';
import readings from '@/data/agriculture/native-figure-field-readings.json';
type Token={text:string;readingKana?:string};
type Provider='crop-calendar'|'flower-legend';
type Binding={sourceHash:string;revision:string;scopeLevels:string[]};
type Entry={figureId:string;assetSha256:string;imageBindings:unknown;sourceJapanese:Record<string,string>;sourceSnapshot:unknown;lessonBindings:Record<string,Binding>;canonicalJapanese:Record<string,unknown>;fields:Record<string,{sourceJapanese:string;tokens:Token[]}>};
const registry=readings as unknown as {schemaVersion:number;studyOnly:boolean;providers:Record<Provider,Entry>};
const snapshots={
 'crop-calendar':()=>({schemaVersion:crop.schemaVersion,figureId:crop.figureId,sourceJapanese:crop.sourceJapanese,referenceAssetSha256:crop.referenceAssetSha256,lessonBindings:crop.lessonBindings,rows:crop.rows,labelsJa:crop.labels.ja}),
 'flower-legend':()=>({schemaVersion:flower.schemaVersion,figureId:flower.figureId,sourceHashes:flower.sourceHashes,colors:flower.colors,labelsJa:flower.labels.ja}),
};
type Context={provider:Provider;lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language:string;field:string;text:string};
export function agricultureNativeFigureReading(p:Context){
 const e=registry.providers[p.provider],l=lessons.lessons.find(l=>l.id===p.lessonId),b=e?.lessonBindings[p.lessonId],f=e?.fields[p.field],image=figures.images.find(f=>f.id===e?.figureId);
 if(p.language!=='ja'||registry.schemaVersion!==1||!registry.studyOnly||!e||!l||!b||!f||!image||!p.level||!p.lessonRevision||!b.scopeLevels.includes(p.level)||!l.levels.includes(p.level)||b.sourceHash!==p.lessonSourceHash||l.sourceHash!==p.lessonSourceHash||b.revision!==p.lessonRevision||l.revision!==p.lessonRevision||image.assetSha256!==e.assetSha256||JSON.stringify(e.imageBindings)!==JSON.stringify({lessonIds:image.lessonIds,lessonSourceHashes:image.lessonSourceHashes,scopeLevels:image.scopeLevels})||Object.entries(e.sourceJapanese).some(([k,v])=>(image as unknown as Record<string,unknown>)[`${k}Ja`]!==v)||JSON.stringify(e.sourceSnapshot)!==JSON.stringify(snapshots[p.provider]())||JSON.stringify(e.canonicalJapanese[p.lessonId])!==JSON.stringify({titleJa:l.titleJa,paragraphs:l.paragraphs.map(x=>({id:x.id,titleJa:x.titleJa,textJa:x.textJa}))})||f.sourceJapanese!==p.text||!Array.isArray(f.tokens)||!f.tokens.length||f.tokens.map(t=>t.text).join('')!==p.text||!f.tokens.every(t=>!!t.text&&(!/[\p{Script=Han}々]/u.test(t.text)||typeof t.readingKana==='string'&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s]+$/u.test(t.readingKana))))return null;
 return f.tokens;
}
/** Exact offline Japanese figure fields. Translations and unknown/stale fields stay plain. */
export function AgricultureNativeFigureRuby(p:Context&{style?:StyleProp<TextStyle>;color:string}){
 const tokens=agricultureNativeFigureReading(p);if(!tokens)return <Text style={p.style}>{p.text}</Text>;
 const parts=tokens.flatMap(t=>t.readingKana?[t]:Array.from(t.text,text=>({text,readingKana:undefined})));
 return <View accessible accessibilityLabel={p.text} testID={`agri-native-figure-ruby-${p.provider}-${p.field}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{parts.map((t,i)=><View key={i} style={{alignItems:'center',minWidth:0,maxWidth:'100%'}}><Text style={{fontSize:10,lineHeight:14,color:p.color}}>{t.readingKana||' '}</Text><Text style={p.style}>{t.text}</Text></View>)}</View>;
}
