import {Text,View} from 'react-native';
import data from '@/data/agriculture/drainage-method-comparison.json';
import content from '@/data/agriculture/lessons.ja.json';
type Labels={title:string;alt:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>};
type Colors={text:string;translation:string;translationText:string;border:string};
export function drainageMethodLabels(lessonId:string,sourceHash:string,revision:string|undefined,level:string|undefined,language:string){
 const lesson=content.lessons.find(l=>l.id===lessonId);
 if(data.schemaVersion!==1||lessonId!==data.lessonId||sourceHash!==data.sourceHash||revision!==data.revision||level!=='2'||!lesson||!lesson.levels.includes(level)||lesson.sourceHash!==sourceHash||lesson.revision!==revision||lesson.titleJa!==data.sourceJapanese.title||lesson.objectiveJa!==data.sourceJapanese.alt||JSON.stringify(lesson.paragraphs.map(p=>p.id))!==JSON.stringify(data.paragraphIds)||lesson.paragraphs.some(p=>data.sourceJapanese.paragraphs[p.id as keyof typeof data.sourceJapanese.paragraphs]!==p.textJa||data.sourceJapanese.paragraphTitles[p.id as keyof typeof data.sourceJapanese.paragraphTitles]!==p.titleJa)||JSON.stringify(data.locales.ja)!==JSON.stringify(data.sourceJapanese)||JSON.stringify(data.groups)!==JSON.stringify([[`${lessonId}-p1`],[`${lessonId}-p2`,`${lessonId}-p3`],[`${lessonId}-p4`],[`${lessonId}-p5`]])||data.limitId!==`${lessonId}-p6`)return null;
 const t=(data.locales as Record<string,Labels>)[language];
 return t&&t.title.trim()&&t.alt.trim()&&data.paragraphIds.every(id=>t.paragraphs[id]?.trim()&&t.paragraphTitles[id]?.trim())?t:null;
}
// A source-text method comparison, not a construction plan or a photographic task illustration.
export function DrainageMethodComparison({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=drainageMethodLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');
 if(!ja)return null;
 const t=showTranslation&&language!=='ja'?drainageMethodLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null,active=t||ja;
 const text={color:colors.translationText,fontSize:16,lineHeight:27},pair=(id:string)=><View key={id} style={{gap:5}}><Text style={{...text,fontWeight:'700'}}>{ja.paragraphTitles[id]}</Text><Text style={text}>{ja.paragraphs[id]}</Text>{!!t&&<><Text style={{...text,fontWeight:'700'}}>{t.paragraphTitles[id]}</Text><Text style={text}>{t.paragraphs[id]}</Text></>}</View>;
 return <View testID="agri-native-drainage-methods" style={{gap:14,padding:12,marginVertical:12,borderWidth:1,borderColor:colors.border,borderRadius:10}}>
  <Text style={{...text,fontSize:19,fontWeight:'700'}}>{ja.title}</Text>{!!t&&<Text testID="agri-drainage-methods-localized-title" style={text}>{t.title}</Text>}
  <View accessible accessibilityRole="image" accessibilityLabel={[active.alt,...data.paragraphIds.map(id=>active.paragraphs[id])].join('\n')} style={{gap:12}}>{data.groups.map((ids,i)=><View key={i} testID={`agri-drainage-method-row-${i}`} style={{gap:8,paddingVertical:10,borderBottomWidth:1,borderColor:colors.border}}>{ids.map(pair)}</View>)}{pair(data.limitId)}</View>
  <Text style={{...text,fontSize:14}}>AGR-S2 · PDF p.34 / p.32 · PDF p.35 / p.33</Text>
 </View>;
}
