import {Fragment} from 'react';
import {StyleSheet,Text,View,type StyleProp,type TextStyle} from 'react-native';
import data from '@/data/agriculture/diagrams.json';
import {AgricultureConceptRuby,conceptSupportLabels,currentConceptEntry,hasConceptSupport} from './AgricultureConceptSupport';
type Diagram={id:string;lessonIds:string[];scopeLevels?:string[];lessonSourceHashes:Record<string,string|undefined>;titleJa:string;altJa:string;kind:'comparison'|'sequence';panels:{titleJa:string;bodyJa:string}[];sources?:{documentId:string;pdfPage:number;printedPage:number}[]};
type Colors={text:string;translation:string;translationText:string;border:string};
const diagrams=data.diagrams as Diagram[];
export function ConceptDiagrams({lessonId,lessonSourceHash,lessonRevision,colors,level,language='ja',showTranslation=false}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;colors:Colors;level:string;language?:string;showTranslation?:boolean}){
 if(!lessonSourceHash||!['1','2'].includes(level))return null;
 return <>{diagrams.filter(d=>d.lessonIds.includes(lessonId)&&d.lessonSourceHashes?.[lessonId]===lessonSourceHash&&d.scopeLevels?.includes(level)).map(d=>{
 const context={diagramId:d.id,lessonId,lessonSourceHash,lessonRevision,level},reviewed=hasConceptSupport(d.id);
 if(reviewed&&!currentConceptEntry(context))return null;
 const t=showTranslation&&language!=='ja'?conceptSupportLabels({...context,language}):null;
 const ruby=(field:string,text:string,style:StyleProp<TextStyle>,color:string)=><AgricultureConceptRuby {...context} language="ja" field={field} text={text} style={style} color={color}/>;
 return <View key={d.id} testID={d.id} accessibilityLabel={t?.alt||d.altJa} style={s.figure}>
  {ruby('title',d.titleJa,[s.title,{color:colors.text}],colors.text)}
  {!!t&&<Text testID={`${d.id}-localized-title`} style={[s.title,{color:colors.translationText}]}>{t.title}</Text>}
  <View style={d.kind==='sequence'?s.sequence:s.comparison}>{d.panels.map((p,i)=><Fragment key={p.titleJa}>
   {d.kind==='sequence'&&i>0&&<Text style={[s.arrow,{color:colors.text}]}>↓</Text>}
   <View style={[s.panel,d.kind==='comparison'&&s.comparisonPanel,{backgroundColor:colors.translation,borderColor:colors.border}]}>
    {ruby(`panel:${i}:title`,`${d.kind==='sequence'?`${i+1}. `:''}${p.titleJa}`,[s.panelTitle,{color:colors.translationText}],colors.translationText)}
    {ruby(`panel:${i}:body`,p.bodyJa,[s.body,{color:colors.translationText}],colors.translationText)}
    {!!t&&<><Text testID={`${d.id}-localized-panel-${i}-title`} style={[s.panelTitle,{color:colors.translationText}]}>{d.kind==='sequence'?`${i+1}. `:''}{t.panels[i].title}</Text><Text testID={`${d.id}-localized-panel-${i}-body`} style={[s.body,{color:colors.translationText}]}>{t.panels[i].body}</Text></>}
   </View></Fragment>)}</View>
  {!!reviewed&&d.sources&&<Text style={[s.source,{color:colors.text}]}>{d.sources.map(s=>`${s.documentId} · PDF p.${s.pdfPage} / p.${s.printedPage}`).join(' · ')}</Text>}
 </View>;})}</>;
}
const s=StyleSheet.create({figure:{marginVertical:16,gap:10},title:{fontSize:19,lineHeight:29,fontWeight:'700'},sequence:{gap:4},comparison:{flexDirection:'row',flexWrap:'wrap',gap:10},panel:{padding:12,borderWidth:1,borderRadius:10,gap:6},comparisonPanel:{flexGrow:1,flexBasis:170,minWidth:120,maxWidth:'100%'},panelTitle:{fontSize:17,lineHeight:27,fontWeight:'700'},body:{fontSize:16,lineHeight:27},arrow:{textAlign:'center',fontSize:23,lineHeight:29},source:{fontSize:13,lineHeight:20}});
