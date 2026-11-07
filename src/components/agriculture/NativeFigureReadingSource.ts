import content from '@/data/agriculture/lessons.ja.json';
import climate from '@/data/agriculture/winter-climate-figure.json';
import spatial from '@/data/agriculture/winter-spatial-reference-locales.json';
import statistics from '@/data/agriculture/statistics-2019-figure.json';
import support from '@/data/agriculture/daily-learning-support.json';
import {winterSpatialBakedSource} from './WinterSpatialLabelSource';
import rice from '@/data/agriculture/rice-process-labels.json';
import fruit from '@/data/agriculture/fruit-tree-comparison-alt.json';
import flowers from '@/data/agriculture/flower-appearance-figure.json';
import organs from '@/data/agriculture/organ-classification-locales.json';
import inlineBindings from '@/data/agriculture/inline-diagram-source-bindings.json';
import {organClassificationLabels,ORGAN_CLASSIFICATION_JA} from './OrganClassificationLabels';

export const STATISTICS_REMAINDER_JA='その他：100 − (24 + 20 + 9 + 4) = 43%';
export const RICE_NATIVE_TITLE_JA='もみ・玄米・白米';
export const RICE_NATIVE_POSITIONS_JA='左：もみ　中央：玄米　右：白米';
export const RICE_NATIVE_CAPTION_JA='もみ殻を除くと玄米になり、玄米を精米すると白米になります。図は外観を比べるための例で、実際の粒の大きさを示すものではありません。';
export const RICE_NATIVE_ASSET={path:'assets/agriculture/royal-weekly-20261107/week01/rice-husking-polishing.webp',sha256:'362cfc865b4ee6e7690c65b0fbd3bebacd8d9b803f4b2dc512d3c707a531c6f3'};
export const FRUIT_TREE_EXAMPLES=[{id:'agr-fruit-p2',treeJa:'ウンシュウミカン'},{id:'agr-fruit-p3',treeJa:'リンゴ'}];
export const FLOWER_APPEARANCE_TITLE_JA='切り花類と鉢もの類の外観例';
/** Current native source fields, excluding accessibility-only strings and controls. */
export function nativeFigureReadingSource(lessonId:string){
 const l=content.lessons.find(l=>l.id===lessonId);
 if(!l)return null;
 const paragraph=(id:string)=>l.paragraphs.find(p=>p.id===id);
 if(lessonId==='agr-climate'){
  const d=support.controlledDiagrams['agr-climate'],winter=paragraph('agr-climate-p3'),limit=paragraph('agr-climate-p6');
  const baked=winterSpatialBakedSource(l.id,l.sourceHash,l.revision,'2');
  if(climate.schemaVersion!==1||climate.sourceHash!==l.sourceHash||spatial.lessonSourceHash!==l.sourceHash||spatial.lessonRevision!==l.revision||d.kind!=='winter-climate'||d.lessonSourceHash!==l.sourceHash||d.assetSha256!==spatial.assetSha256||d.titleJa!==spatial.sourceJapanese.title||d.captionJa!==spatial.sourceJapanese.caption||d.altJa!==spatial.sourceJapanese.alt||!winter||!limit||!baked)return null;
  const fields:Record<string,string>={
   'spatial:title':d.titleJa,'spatial:caption':d.captionJa,
   [`paragraphTitle:${winter.id}`]:winter.titleJa,
   ...Object.fromEntries(climate.labels.ja.regions.map((s,i)=>['region:'+i,s])),
   ...Object.fromEntries(climate.labels.ja.tendencies.map((s,i)=>['tendency:'+i,s])),
   [`paragraph:${winter.id}`]:winter.textJa,[`paragraph:${limit.id}`]:limit.textJa,
   ...Object.fromEntries(baked.labels.map((s,i)=>['baked-label:'+i,s])),
  };
  return {fields,signature:JSON.stringify({lessonId,sourceHash:l.sourceHash,revision:l.revision,fields,appearanceAsset:climate.appearanceAsset,spatialAssetSha256:spatial.assetSha256,bakedSourceSvgSha256:baked.sourceSvgSha256})};
 }
 if(lessonId==='agr-statistics'){
  const explanation=paragraph('agr-statistics-p2'),historical=paragraph('agr-statistics-p1');
  if(statistics.schemaVersion!==1||statistics.sourceHash!==l.sourceHash||statistics.lessonRevision!==l.revision||!explanation||!historical||statistics.labels.ja.categories.length!==statistics.slices.length)return null;
  const fields:Record<string,string>={
   title:statistics.labels.ja.title,
   ...Object.fromEntries(statistics.slices.map((s,i)=>['legend:'+i,`${statistics.labels.ja.categories[i]} ${s.value}%`])),
   remainder:STATISTICS_REMAINDER_JA,
   [`paragraph:${explanation.id}`]:explanation.textJa,[`paragraph:${historical.id}`]:historical.textJa,
  };
  return {fields,signature:JSON.stringify({lessonId,sourceHash:l.sourceHash,revision:l.revision,fields,year:statistics.year,slices:statistics.slices})};
 }
 if(lessonId==='agr-rice'){
  if(rice.schemaVersion!==1||rice.lessonId!==lessonId||rice.sourceHash!==l.sourceHash||rice.labels.ja.states.join('・')!==RICE_NATIVE_TITLE_JA||rice.labels.ja.caption!==RICE_NATIVE_CAPTION_JA)return null;
  const fields:Record<string,string>={title:RICE_NATIVE_TITLE_JA,positions:RICE_NATIVE_POSITIONS_JA,caption:RICE_NATIVE_CAPTION_JA};
  return {fields,signature:JSON.stringify({lessonId,sourceHash:l.sourceHash,revision:l.revision,fields,labelsJa:rice.labels.ja,asset:RICE_NATIVE_ASSET})};
 }
 if(lessonId==='agr-fruit'){
  const introduction=paragraph('agr-fruit-p1'),examples=FRUIT_TREE_EXAMPLES.map(x=>({...x,paragraph:paragraph(x.id)}));
  if(fruit.schemaVersion!==1||fruit.lessonId!==lessonId||fruit.sourceHash!==l.sourceHash||!introduction||examples.some(x=>!x.paragraph))return null;
  const fields:Record<string,string>={title:introduction.titleJa,...Object.fromEntries(examples.flatMap((x,i)=>[[`exampleTitle:${i}`,`${x.paragraph!.titleJa}（${x.treeJa}）`],[`exampleBody:${i}`,x.paragraph!.textJa]])),introduction:introduction.textJa};
  return {fields,signature:JSON.stringify({lessonId,sourceHash:l.sourceHash,revision:l.revision,fields,assetPath:fruit.assetPath,assetSha256:fruit.assetSha256,altJa:fruit.alt.ja})};
 }
 if(lessonId==='agr-flowers'){
  const paragraphs=['agr-flowers-p2','agr-flowers-p3'].map(paragraph);
  if(flowers.schemaVersion!==1||flowers.lessonId!==lessonId||flowers.sourceHash!==l.sourceHash||paragraphs.some(p=>!p))return null;
  const fields:Record<string,string>={title:FLOWER_APPEARANCE_TITLE_JA,...Object.fromEntries(flowers.labels.ja.groups.map((s,i)=>['group:'+i,s])),...Object.fromEntries(paragraphs.map(p=>['paragraph:'+p!.id,p!.textJa])),limit:flowers.labels.ja.limit};
  return {fields,signature:JSON.stringify({lessonId,sourceHash:l.sourceHash,revision:l.revision,fields,asset:flowers.asset,labelsJa:flowers.labels.ja})};
 }
 if(lessonId==='agr-organs'){
  if(!l.levels.some(level=>organClassificationLabels(l.id,l.sourceHash,l.revision,level,'ja',ORGAN_CLASSIFICATION_JA)))return null;
  const fields:Record<string,string>=Object.fromEntries(ORGAN_CLASSIFICATION_JA.rows.flatMap(([title,items],i)=>[[`rowTitle:${i}`,title],[`rowItems:${i}`,items]]));
  return {fields,signature:JSON.stringify({lessonId,sourceHash:l.sourceHash,revision:l.revision,fields,binding:inlineBindings.organs,sourceJapanese:organs.sourceJapanese,levels:organs.levels})};
 }
 return null;
}
