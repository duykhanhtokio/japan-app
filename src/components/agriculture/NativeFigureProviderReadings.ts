import lessons from '@/data/agriculture/lessons.ja.json';
import figures from '@/data/agriculture/recognition-images.json';
import crop from '@/data/agriculture/crop-calendar-native.json';
import flower from '@/data/agriculture/flower-legend-native.json';
import readings from '@/data/agriculture/native-figure-field-readings.json';
type Token={text:string;readingKana?:string};
type Provider='crop-calendar'|'flower-legend';
type Binding={sourceHash:string;revision:string;scopeLevels:string[]};
type Entry={figureId:string;assetSha256:string;imageBindings:unknown;sourceJapanese:Record<string,string>;sourceSnapshot:unknown;lessonBindings:Record<string,Binding>;canonicalJapanese:Record<string,unknown>;fields:Record<string,{sourceJapanese:string;tokens:Token[]}>};
const registry=readings as unknown as {schemaVersion:number;studyOnly:boolean;providers:Partial<Record<Provider,Entry>>};
const snapshots={
 'crop-calendar':()=>({schemaVersion:crop.schemaVersion,figureId:crop.figureId,sourceJapanese:crop.sourceJapanese,referenceAssetSha256:crop.referenceAssetSha256,lessonBindings:crop.lessonBindings,rows:crop.rows,labelsJa:crop.labels.ja}),
 'flower-legend':()=>({schemaVersion:flower.schemaVersion,figureId:flower.figureId,sourceHashes:flower.sourceHashes,colors:flower.colors,labelsJa:flower.labels.ja}),
};
export type NativeFigureProviderContext={provider:Provider;lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language:string;field:string;text:string};
/** Compatible with the accepted upstream provider schema; generic native records stay separate. */
export function agricultureNativeProviderReading(p:NativeFigureProviderContext){
 if(!Object.prototype.hasOwnProperty.call(snapshots,p.provider))return null;
 const e=registry.providers[p.provider],l=lessons.lessons.find(l=>l.id===p.lessonId),b=e?.lessonBindings[p.lessonId],f=e?.fields[p.field],image=figures.images.find(f=>f.id===e?.figureId);
 if(p.language!=='ja'||registry.schemaVersion!==1||!registry.studyOnly||!e||!l||!b||!f||!image||!p.level||!p.lessonRevision||!b.scopeLevels.includes(p.level)||!l.levels.includes(p.level)||b.sourceHash!==p.lessonSourceHash||l.sourceHash!==p.lessonSourceHash||b.revision!==p.lessonRevision||l.revision!==p.lessonRevision||image.assetSha256!==e.assetSha256||JSON.stringify(e.imageBindings)!==JSON.stringify({lessonIds:image.lessonIds,lessonSourceHashes:image.lessonSourceHashes,scopeLevels:image.scopeLevels})||Object.entries(e.sourceJapanese).some(([k,v])=>(image as unknown as Record<string,unknown>)[`${k}Ja`]!==v)||JSON.stringify(e.sourceSnapshot)!==JSON.stringify(snapshots[p.provider]())||JSON.stringify(e.canonicalJapanese[p.lessonId])!==JSON.stringify({titleJa:l.titleJa,paragraphs:l.paragraphs.map(x=>({id:x.id,titleJa:x.titleJa,textJa:x.textJa}))})||f.sourceJapanese!==p.text||!Array.isArray(f.tokens)||!f.tokens.length||f.tokens.map(t=>t.text).join('')!==p.text||!f.tokens.every(t=>typeof t.text==='string'&&!!t.text&&(t.readingKana===undefined||typeof t.readingKana==='string'&&!!t.readingKana.trim()&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s]+$/u.test(t.readingKana))&&(!/[\p{Script=Han}々]/u.test(t.text)||!!t.readingKana)))return null;
 return f.tokens;
}
