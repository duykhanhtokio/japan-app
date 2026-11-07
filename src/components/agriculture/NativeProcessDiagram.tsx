import {Text,View} from 'react-native';
import data from '@/data/agriculture/native-process-diagrams.json';
import support from '@/data/agriculture/daily-learning-support.json';
type Colors={text:string;translation:string;translationText:string;border:string};
type Labels={title:string;alt:string;caption:string;labels:string[]};
type Entry={kind:string;sourceHash:string;revision:string;scopeLevels:string[];assetSha256:string;sourceJapanese:{title:string;alt:string;caption:string};locales:Record<string,Labels>;sources:{documentId:string;printedPage:number}[]};
type Diagram={kind:string;lessonSourceHash:string;assetSha256:string;titleJa:string;altJa:string;captionJa:string};
const entries=data.entries as Record<string,Entry>;
const diagrams=support.controlledDiagrams as Record<string,Diagram>;
export const isNativeProcessContext=(lessonId:string)=>Object.prototype.hasOwnProperty.call(entries,lessonId);
export function nativeProcessLabels(lessonId:string,sourceHash:string,revision:string|undefined,level:string|undefined,language:string){
 const e=entries[lessonId],d=diagrams[lessonId];
 if(data.schemaVersion!==1||!e||!d||!revision||!level||!e.scopeLevels.includes(level)||e.sourceHash!==sourceHash||e.revision!==revision||d.lessonSourceHash!==sourceHash||d.kind!==e.kind||d.assetSha256!==e.assetSha256||(['title','alt','caption'] as const).some(k=>(e.sourceJapanese[k]!==d[`${k}Ja`]||e.locales.ja[k]!==e.sourceJapanese[k])))return null;
 const t=e.locales[language],count=e.kind==='plant-flow'?17:5;
 return t&&['title','alt','caption'].every(k=>typeof t[k as keyof Labels]==='string'&&(t[k as 'title'|'alt'|'caption']).trim())&&t.labels.length===count&&t.labels.every(x=>typeof x==='string'&&x.trim())?t:null;
}
// Directed qualitative source flows; neither arrow size nor band width is a measurement.
const plantFlows=[[7,[0,11]],[7,[13,1,11]],[7,[11,2,13]],[8,[13,2,11]],[8,[11,1,13]],[10,[14,3,12]],[10,[14,5,12]],[3,[12,15,11]],[6,[11,15,16]],[6,[11,15,12]],[9,[11,4,13]]] as const;
export function NativeProcessDiagram({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=nativeProcessLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');
 if(!ja)return null;
 const t=showTranslation&&language!=='ja'?nativeProcessLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null;
 const e=entries[lessonId],active=t||ja,plant=e.kind==='plant-flow';
 const flow=(v:Labels,i:number)=>`${v.labels[plantFlows[i][0]]}: ${plantFlows[i][1].map(j=>v.labels[j]).join(' → ')}`;
 const alt=[active.alt,...(plant?plantFlows.map((_,i)=>flow(active,i)):active.labels)].join('\n');
 const textStyle={color:colors.translationText,fontSize:16,lineHeight:27};
 const pair=(i:number)=><><Text style={textStyle}>{ja.labels[i]}</Text>{!!t&&<Text style={textStyle}>{t.labels[i]}</Text>}</>;
 return <View testID={`agri-native-process-${e.kind}`} style={{gap:12,marginVertical:12,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:10}}>
  <Text style={{...textStyle,fontSize:19,fontWeight:'700'}}>{ja.title}</Text>
  {!!t&&<Text testID="agri-native-process-translated-title" style={textStyle}>{t.title}</Text>}
  <View accessible accessibilityRole="image" accessibilityLabel={alt} style={{gap:14}}>
   {plant?<>
    <View testID="agri-native-process-leaf-stem-root" style={{alignItems:'center',gap:3}}>
     <View style={{borderRadius:34,borderWidth:2,borderColor:'#327842',backgroundColor:'#e6f2df',paddingHorizontal:24,paddingVertical:8}}>{pair(11)}</View>
     <View style={{borderLeftWidth:5,borderColor:'#327842',paddingLeft:10,minHeight:34}}>{pair(15)}</View>
     <View style={{alignSelf:'stretch',borderTopWidth:2,borderColor:'#98734c',alignItems:'center',paddingTop:8}}>{pair(14)}<View style={{borderBottomLeftRadius:32,borderBottomRightRadius:32,borderWidth:2,borderColor:'#98734c',paddingHorizontal:24,paddingVertical:8}}>{pair(12)}</View></View>
    </View>
    {plantFlows.map((_,i)=><View key={i} testID={`agri-native-process-flow-${i}`} style={{gap:3,borderBottomWidth:1,borderColor:colors.border,paddingBottom:7}}><Text style={textStyle}>{flow(ja,i)}</Text>{!!t&&<Text style={textStyle}>{flow(t,i)}</Text>}</View>)}
   </>:<>
    {[false,true].map(light=><View key={String(light)} testID={`agri-native-photoperiod-${light?'night-light':'unlit'}`} style={{gap:5}}>
     {light&&pair(3)}
     <View style={{flexDirection:'row',flexWrap:'wrap',gap:3}}>
      <View style={{flexGrow:1,flexBasis:160,backgroundColor:'#fff0b8',padding:10}}>{pair(0)}</View>
      <View style={{flexGrow:1,flexBasis:160,backgroundColor:'#d9e0ec',padding:10,gap:5}}>{pair(1)}{light&&<View style={{alignSelf:'center',backgroundColor:'#fff0b8',borderWidth:1,borderColor:'#9a751b',padding:8}}>{pair(2)}</View>}</View>
     </View>
    </View>)}
    {pair(4)}
   </>}
  </View>
  <Text style={textStyle}>{ja.caption}</Text>
  {!!t&&<Text testID="agri-native-process-translated-caption" style={textStyle}>{t.caption}</Text>}
  <Text style={{...textStyle,fontSize:14}}>{e.sources.map(s=>`${s.documentId} · p.${s.printedPage}`).join(' / ')}</Text>
 </View>;
}
