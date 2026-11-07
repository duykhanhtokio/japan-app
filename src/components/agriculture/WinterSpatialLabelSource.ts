import content from '@/data/agriculture/lessons.ja.json';
import spatial from '@/data/agriculture/winter-spatial-reference-locales.json';
import support from '@/data/agriculture/daily-learning-support.json';
import data from '@/data/agriculture/winter-spatial-label-companion.json';
// Literal strings verified in the retained PNG and its immutable SVG source.
export const WINTER_SPATIAL_BAKED_LABELS_JA=['冬の地域差の模式断面','日本海側：雪','太平洋側：晴天・乾燥'];
const assetPath='assets/agriculture/daily-learning-20261031/winter-climate.png';
const svgSha256='334f226609a6d9a52a7ab3bd7277b5927b1f5688ae34e7f6d44471f0e74d0803';
export function winterSpatialBakedSource(lessonId:string,sourceHash:string,revision:string|undefined,level:string|undefined){
 const l=content.lessons.find(l=>l.id===lessonId),d=support.controlledDiagrams['agr-climate'];
 if(data.schemaVersion!==1||!data.studyOnly||lessonId!==data.lessonId||!l||!level||!revision||!l.levels.includes(level)||!data.levels.includes(level)||l.sourceHash!==sourceHash||data.lessonSourceHash!==sourceHash||spatial.lessonSourceHash!==sourceHash||d.lessonSourceHash!==sourceHash||l.revision!==revision||data.lessonRevision!==revision||spatial.lessonRevision!==revision||d.kind!=='winter-climate'||data.assetPath!==assetPath||data.assetSha256!==spatial.assetSha256||data.assetSha256!==d.assetSha256||data.sourceSvgSha256!==svgSha256||JSON.stringify(data.sourceJapanese)!==JSON.stringify(WINTER_SPATIAL_BAKED_LABELS_JA))return null;
 return {labels:WINTER_SPATIAL_BAKED_LABELS_JA,assetSha256:data.assetSha256,sourceSvgSha256:data.sourceSvgSha256};
}
export function winterSpatialBakedTranslation(lessonId:string,sourceHash:string,revision:string|undefined,level:string|undefined,language:string){
 if(!winterSpatialBakedSource(lessonId,sourceHash,revision,level))return null;
 const labels=(data.locales as Record<string,string[]>)[language];
 return Array.isArray(labels)&&labels.length===WINTER_SPATIAL_BAKED_LABELS_JA.length&&labels.every(s=>typeof s==='string'&&!!s.trim())?labels:null;
}
