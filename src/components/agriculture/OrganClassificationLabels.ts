import data from '@/data/agriculture/organ-classification-locales.json';
import bindings from '@/data/agriculture/inline-diagram-source-bindings.json';
type Labels={alt:string;rows:string[][]};
export const ORGAN_CLASSIFICATION_JA:Labels={alt:'栄養器官は葉・茎・根、生殖器官は花・果実です。',rows:[['栄養器官','葉 · 茎 · 根'],['生殖器官','花 · 果実']]};
export function organClassificationLabels(lessonId:string,sourceHash:string,revision:string|undefined,level:string|undefined,language:string,original:Labels){
 const b=bindings.organs;
 if(data.schemaVersion!==1||lessonId!==data.lessonId||lessonId!==b.lessonId||sourceHash!==data.sourceHash||sourceHash!==b.lessonSourceHash||revision!==data.revision||!level||!data.levels.includes(level)||!b.levels.includes(level)||JSON.stringify(data.sourceJapanese)!==JSON.stringify(original)||JSON.stringify(data.locales.ja)!==JSON.stringify(original))return null;
 const t=(data.locales as Record<string,Labels>)[language];
 return t&&typeof t.alt==='string'&&!!t.alt.trim()&&Array.isArray(t.rows)&&t.rows.length===2&&t.rows.every(row=>Array.isArray(row)&&row.length===2&&row.every(s=>typeof s==='string'&&!!s.trim()))?t:null;
}
