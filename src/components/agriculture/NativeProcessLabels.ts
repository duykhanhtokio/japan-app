import data from '@/data/agriculture/native-process-diagrams.json';
import support from '@/data/agriculture/daily-learning-support.json';
import content from '@/data/agriculture/lessons.ja.json';
export type NativeProcessLabels={title:string;alt:string;caption:string;labels:string[]};
type Entry={kind:string;sourceHash:string;revision:string;scopeLevels:string[];assetSha256:string;sourceJapanese:{title:string;alt:string;caption:string};locales:Record<string,NativeProcessLabels>;sources:{documentId:string;printedPage:number}[]};
type Diagram={kind:string;lessonSourceHash:string;assetSha256:string;titleJa:string;altJa:string;captionJa:string};
const entries=data.entries as Record<string,Entry>,diagrams=support.controlledDiagrams as Record<string,Diagram>;
export const isNativeProcessContext=(lessonId:string)=>Object.prototype.hasOwnProperty.call(entries,lessonId);
export const nativeProcessEntry=(lessonId:string)=>isNativeProcessContext(lessonId)?entries[lessonId]:undefined;
export function nativeProcessLabels(lessonId:string,sourceHash:string,revision:string|undefined,level:string|undefined,language:string){
 const e=nativeProcessEntry(lessonId),d=Object.prototype.hasOwnProperty.call(diagrams,lessonId)?diagrams[lessonId]:undefined,l=content.lessons.find(l=>l.id===lessonId);
 if(data.schemaVersion!==1||!e||!d||!l||!revision||!level||!l.levels.includes(level)||l.sourceHash!==sourceHash||l.revision!==revision||!e.scopeLevels.includes(level)||e.sourceHash!==sourceHash||e.revision!==revision||d.lessonSourceHash!==sourceHash||d.kind!==e.kind||!['plant-flow','photoperiod'].includes(e.kind)||d.assetSha256!==e.assetSha256||(['title','alt','caption'] as const).some(k=>(e.sourceJapanese[k]!==d[`${k}Ja`]||e.locales.ja[k]!==e.sourceJapanese[k])))return null;
 const t=e.locales[language],count=e.kind==='plant-flow'?17:5;
 return t&&['title','alt','caption'].every(k=>typeof t[k as keyof NativeProcessLabels]==='string'&&(t[k as 'title'|'alt'|'caption']).trim())&&Array.isArray(t.labels)&&t.labels.length===count&&t.labels.every(x=>typeof x==='string'&&!!x.trim())?t:null;
}
// The unchanged directed qualitative relationships used by the actual figure.
export const NATIVE_PLANT_FLOWS=[[7,[0,11]],[7,[13,1,11]],[7,[11,2,13]],[8,[13,2,11]],[8,[11,1,13]],[10,[14,3,12]],[10,[14,5,12]],[3,[12,15,11]],[6,[11,15,16]],[6,[11,15,12]],[9,[11,4,13]]] as const;
export const nativeProcessFlow=(v:NativeProcessLabels,i:number)=>`${v.labels[NATIVE_PLANT_FLOWS[i][0]]}: ${NATIVE_PLANT_FLOWS[i][1].map(j=>v.labels[j]).join(' → ')}`;
