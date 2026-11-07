import content from '@/data/agriculture/lessons.ja.json';
import climate from '@/data/agriculture/winter-climate-figure.json';
import spatial from '@/data/agriculture/winter-spatial-reference-locales.json';
import statistics from '@/data/agriculture/statistics-2019-figure.json';
import support from '@/data/agriculture/daily-learning-support.json';

export const STATISTICS_REMAINDER_JA='その他：100 − (24 + 20 + 9 + 4) = 43%';
/** Current native source fields, excluding accessibility-only strings and controls. */
export function nativeFigureReadingSource(lessonId:string){
 const l=content.lessons.find(l=>l.id===lessonId);
 if(!l)return null;
 const paragraph=(id:string)=>l.paragraphs.find(p=>p.id===id);
 if(lessonId==='agr-climate'){
  const d=support.controlledDiagrams['agr-climate'],winter=paragraph('agr-climate-p3'),limit=paragraph('agr-climate-p6');
  if(climate.schemaVersion!==1||climate.sourceHash!==l.sourceHash||spatial.lessonSourceHash!==l.sourceHash||spatial.lessonRevision!==l.revision||d.kind!=='winter-climate'||d.lessonSourceHash!==l.sourceHash||d.assetSha256!==spatial.assetSha256||d.titleJa!==spatial.sourceJapanese.title||d.captionJa!==spatial.sourceJapanese.caption||d.altJa!==spatial.sourceJapanese.alt||!winter||!limit)return null;
  const fields:Record<string,string>={
   'spatial:title':d.titleJa,'spatial:caption':d.captionJa,
   [`paragraphTitle:${winter.id}`]:winter.titleJa,
   ...Object.fromEntries(climate.labels.ja.regions.map((s,i)=>['region:'+i,s])),
   ...Object.fromEntries(climate.labels.ja.tendencies.map((s,i)=>['tendency:'+i,s])),
   [`paragraph:${winter.id}`]:winter.textJa,[`paragraph:${limit.id}`]:limit.textJa,
  };
  return {fields,signature:JSON.stringify({lessonId,sourceHash:l.sourceHash,revision:l.revision,fields,appearanceAsset:climate.appearanceAsset,spatialAssetSha256:spatial.assetSha256})};
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
 return null;
}
