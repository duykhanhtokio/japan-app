import {Fragment} from 'react';
import {StyleSheet,Text,View} from 'react-native';
import data from '@/data/agriculture/diagrams.json';

type Diagram={id:string;lessonIds:string[];titleJa:string;altJa:string;kind:'comparison'|'sequence';panels:{titleJa:string;bodyJa:string}[]};
type Colors={text:string;translation:string;translationText:string;border:string};
const diagrams=data.diagrams as Diagram[];

export function ConceptDiagrams({lessonId,colors}:{lessonId:string;colors:Colors}) {
 return <>{diagrams.filter(d=>d.lessonIds.includes(lessonId)).map(d=><View key={d.id} testID={d.id} accessibilityLabel={d.altJa} style={s.figure}>
  <Text style={[s.title,{color:colors.text}]}>{d.titleJa}</Text>
  <View style={d.kind==='sequence'?s.sequence:s.comparison}>
   {d.panels.map((p,i)=><Fragment key={p.titleJa}>
    {d.kind==='sequence'&&i>0&&<Text style={[s.arrow,{color:colors.text}]}>↓</Text>}
    <View style={[s.panel,d.kind==='comparison'&&s.comparisonPanel,{backgroundColor:colors.translation,borderColor:colors.border}]}>
     <Text style={[s.panelTitle,{color:colors.translationText}]}>{d.kind==='sequence'?`${i+1}. `:''}{p.titleJa}</Text>
     <Text style={[s.body,{color:colors.translationText}]}>{p.bodyJa}</Text>
    </View>
   </Fragment>)}
  </View>
 </View>)}</>;
}
const s=StyleSheet.create({
 figure:{marginVertical:16,gap:10},title:{fontSize:19,lineHeight:29,fontWeight:'700'},
 sequence:{gap:4},comparison:{flexDirection:'row',flexWrap:'wrap',gap:10},
 panel:{padding:12,borderWidth:1,borderRadius:10,gap:6},comparisonPanel:{flexGrow:1,flexBasis:170,minWidth:120,maxWidth:'100%'},
 panelTitle:{fontSize:17,lineHeight:27,fontWeight:'700'},body:{fontSize:16,lineHeight:27},arrow:{textAlign:'center',fontSize:23,lineHeight:29},
});
