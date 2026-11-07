import {Text,View} from 'react-native';
import data from '@/data/agriculture/fertilizer-native-figures.json';
import content from '@/data/agriculture/lessons.ja.json';
import support from '@/data/agriculture/daily-learning-support.json';
type Labels={title:string;alt:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>};
type Entry={kind:string;sourceHash:string;revision:string;levels:string[];sourceJapanese:Labels;paragraphIds:string[];locales:Record<string,Labels>;controlledSnapshot:unknown;fraction?:{totalKg:number;componentPercent:number;componentKg:number};sources:{documentId:string;pdfPage:number;printedPage:number}[]};
type Colors={text:string;translation:string;translationText:string;border:string};
const entries=data.entries as Record<string,Entry>;
export const isFertilizerNativeContext=(id:string)=>Object.prototype.hasOwnProperty.call(entries,id);
export function fertilizerNativeLabels(lessonId:string,sourceHash:string,revision:string|undefined,level:string|undefined,language:string){
 const e=entries[lessonId],lesson=content.lessons.find(l=>l.id===lessonId),controlled=(support.controlledDiagrams as Record<string,unknown>)[lessonId]||null;
 if(data.schemaVersion!==1||!e||e.kind!==lessonId.replace('agr-fertilizer-','')||!level||!e.levels.includes(level)||e.sourceHash!==sourceHash||e.revision!==revision||!lesson||!lesson.levels.includes(level)||lesson.sourceHash!==sourceHash||lesson.revision!==revision||lesson.titleJa!==e.sourceJapanese.title||lesson.objectiveJa!==e.sourceJapanese.alt||JSON.stringify(lesson.paragraphs.map(p=>p.id))!==JSON.stringify(e.paragraphIds)||lesson.paragraphs.some(p=>e.sourceJapanese.paragraphTitles[p.id]!==p.titleJa||e.sourceJapanese.paragraphs[p.id]!==p.textJa)||JSON.stringify(e.sourceJapanese)!==JSON.stringify(e.locales.ja)||JSON.stringify(controlled)!==JSON.stringify(e.controlledSnapshot))return null;
 if((e.kind==='label'||e.kind==='quantity')&&JSON.stringify(e.fraction)!==JSON.stringify({totalKg:25,componentPercent:e.kind==='label'?12:16,componentKg:e.kind==='label'?3:4}))return null;
 const t=e.locales[language];
 return t&&t.title.trim()&&t.alt.trim()&&e.paragraphIds.every(id=>t.paragraphTitles[id]?.trim()&&t.paragraphs[id]?.trim())?t:null;
}
// Exact source comparisons and hypothetical mass fractions; no application instructions.
export function FertilizerNativeFigure({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=fertilizerNativeLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');
 if(!ja)return null;
 const e=entries[lessonId],t=showTranslation&&language!=='ja'?fertilizerNativeLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null,active=t||ja,f=e.fraction;
 const text={color:colors.translationText,fontSize:16,lineHeight:27},pair=(id:string)=><View key={id} style={{gap:5}}><Text style={{...text,fontWeight:'700'}}>{ja.paragraphTitles[id]}</Text><Text style={text}>{ja.paragraphs[id]}</Text>{!!t&&<><Text style={{...text,fontWeight:'700'}}>{t.paragraphTitles[id]}</Text><Text style={text}>{t.paragraphs[id]}</Text></>}</View>;
 return <View testID={`agri-native-fertilizer-${e.kind}`} style={{gap:14,marginVertical:12,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:10}}>
  <Text style={{...text,fontSize:19,fontWeight:'700'}}>{ja.title}</Text>{!!t&&<Text testID="agri-fertilizer-localized-title" style={text}>{t.title}</Text>}
  {!!f&&<View accessible accessibilityRole="image" accessibilityLabel={[active.alt,active.paragraphs[`${lessonId}-p2`],active.paragraphs[`${lessonId}-p3`],active.paragraphs[`${lessonId}-p4`]].join('\n')} style={{gap:10}}>
   <Text style={{...text,fontWeight:'700'}}>25kg · {f.componentPercent}% · {f.componentKg}kg</Text>
   <View testID="agri-fertilizer-exact-mass-fraction" style={{height:200,width:'100%',maxWidth:320}}><View testID="agri-fertilizer-remainder" style={{height:`${100-f.componentPercent}%`,backgroundColor:'#ead8a1'}}/><View testID="agri-fertilizer-component" style={{height:`${f.componentPercent}%`,backgroundColor:'#318258'}}/></View>
   <Text testID="agri-fertilizer-forward-equation" style={text}>{e.kind==='label'?'25 × 12 ÷ 100 = 3kg':'4 ÷ 16 × 100 = 25kg'}</Text>
   {e.kind==='quantity'&&<Text testID="agri-fertilizer-check-equation" style={text}>25 × 16 ÷ 100 = 4kg</Text>}
   {e.kind==='label'&&<Text testID="agri-fertilizer-assumed-analysis" style={text}>12−6−6 · 25kg</Text>}
  </View>}
  {e.kind==='release'?<View accessible accessibilityRole="image" accessibilityLabel={[active.alt,...e.paragraphIds.slice(1,4).map(id=>active.paragraphs[id])].join('\n')} testID="agri-fertilizer-release-comparison" style={{gap:12}}>{e.paragraphIds.slice(1,4).map(id=><View key={id} style={{gap:5,paddingBottom:10,borderBottomWidth:1,borderColor:colors.border}}>{pair(id)}</View>)}{[e.paragraphIds[0],...e.paragraphIds.slice(4)].map(pair)}</View>:e.kind==='timing'?<View accessible accessibilityRole="image" accessibilityLabel={[active.alt,...e.paragraphIds.slice(1,3).map(id=>active.paragraphs[id])].join('\n')} testID="agri-fertilizer-qualitative-timing" style={{gap:12}}><View style={{gap:14,paddingLeft:12,borderLeftWidth:3,borderColor:colors.border}}>{e.paragraphIds.slice(1,3).map(pair)}</View>{[e.paragraphIds[0],...e.paragraphIds.slice(3)].map(pair)}</View>:e.paragraphIds.map(pair)}
  <Text style={{...text,fontSize:14}}>{e.sources.map(s=>`${s.documentId} · PDF p.${s.pdfPage} / p.${s.printedPage}`).join(' · ')}</Text>
 </View>;
}
