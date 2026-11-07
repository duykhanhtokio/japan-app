import {Text,View} from 'react-native';
import data from '@/data/agriculture/plant-response-native.json';
import content from '@/data/agriculture/lessons.ja.json';
import {NativeProcessDiagram} from './NativeProcessDiagram';
type Labels={title:string;alt:string;paragraphTitles:Record<string,string>;paragraphs:Record<string,string>};
type Colors={text:string;translation:string;translationText:string;border:string};
export function plantResponseLabels(lessonId:string,sourceHash:string,revision:string|undefined,level:string|undefined,language:string){
 const lesson=content.lessons.find(l=>l.id===lessonId),process=content.lessons.find(l=>l.id===data.processContext.id);
 if(data.schemaVersion!==1||lessonId!==data.lessonId||sourceHash!==data.sourceHash||revision!==data.revision||level!=='2'||!lesson||!lesson.levels.includes(level)||lesson.sourceHash!==sourceHash||lesson.revision!==revision||lesson.titleJa!==data.sourceJapanese.title||lesson.objectiveJa!==data.sourceJapanese.alt||lesson.paragraphs.length!==data.paragraphIds.length||lesson.paragraphs.some(p=>data.sourceJapanese.paragraphs[p.id as keyof typeof data.sourceJapanese.paragraphs]!==p.textJa||data.sourceJapanese.paragraphTitles[p.id as keyof typeof data.sourceJapanese.paragraphTitles]!==p.titleJa)||JSON.stringify(data.locales.ja)!==JSON.stringify(data.sourceJapanese)||!process||process.sourceHash!==data.processContext.sourceHash||process.revision!==data.processContext.revision||!process.levels.includes(level)||JSON.stringify(data.groups)!==JSON.stringify([[`${lessonId}-p1`,`${lessonId}-p2`],[`${lessonId}-p3`,`${lessonId}-p4`],[`${lessonId}-p5`]])||data.limitId!==`${lessonId}-p6`)return null;
 const t=(data.locales as Record<string,Labels>)[language];
 return t&&t.title.trim()&&t.alt.trim()&&data.paragraphIds.every(id=>t.paragraphs[id]?.trim()&&t.paragraphTitles[id]?.trim())?t:null;
}
// Three source conditions are kept separate; no numerical light curve or irrigation setpoint is inferred.
export function PlantResponseFigure({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=plantResponseLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');
 if(!ja)return null;
 const t=showTranslation&&language!=='ja'?plantResponseLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null,active=t||ja;
 const text={color:colors.translationText,fontSize:16,lineHeight:27},paragraph=(id:string)=><View key={id} style={{gap:5}}><Text style={{...text,fontWeight:'700'}}>{ja.paragraphTitles[id]}</Text><Text style={text}>{ja.paragraphs[id]}</Text>{!!t&&<><Text style={{...text,fontWeight:'700'}}>{t.paragraphTitles[id]}</Text><Text style={text}>{t.paragraphs[id]}</Text></>}</View>;
 return <View testID="agri-native-plant-response" style={{gap:14,padding:12,marginVertical:12,borderWidth:1,borderColor:colors.border,borderRadius:10}}>
  <Text style={{...text,fontSize:19,fontWeight:'700'}}>{ja.title}</Text>{!!t&&<Text testID="agri-plant-response-localized-title" style={text}>{t.title}</Text>}
  <View accessible accessibilityLabel={[active.alt,...data.paragraphIds.map(id=>active.paragraphs[id])].join('\n')} style={{gap:14}}>{data.groups.map((ids,i)=><View key={i} testID={`agri-plant-response-condition-${i}`} style={{gap:10,borderLeftWidth:3,borderColor:colors.border,paddingLeft:12}}>{ids.map(paragraph)}</View>)}{paragraph(data.limitId)}</View>
  <NativeProcessDiagram lessonId={data.processContext.id} lessonSourceHash={data.processContext.sourceHash} lessonRevision={data.processContext.revision} level={level} language={language} showTranslation={showTranslation} colors={colors}/>
  <Text style={{...text,fontSize:14}}>AGR-S2 · PDF p.9 / p.7 · PDF p.11 / p.9</Text>
 </View>;
}
