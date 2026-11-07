import {Text,View} from 'react-native';
import {AgricultureNativeFigureRuby} from './AgricultureNativeFigureRuby';
import {nativeProcessLabels,nativeProcessEntry,NATIVE_PLANT_FLOWS,nativeProcessFlow} from './NativeProcessLabels';
export {nativeProcessLabels,isNativeProcessContext} from './NativeProcessLabels';
type Colors={text:string;translation:string;translationText:string;border:string};
// Directed qualitative source flows; neither arrow size nor band width is a measurement.
export function NativeProcessDiagram({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors}){
 const ja=nativeProcessLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');
 if(!ja)return null;
 const t=showTranslation&&language!=='ja'?nativeProcessLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null;
 const e=nativeProcessEntry(lessonId)!,active=t||ja,plant=e.kind==='plant-flow';
 const flow=nativeProcessFlow;
 const context={lessonId,lessonSourceHash,lessonRevision,level,color:colors.translationText};
 const alt=[active.alt,...(plant?NATIVE_PLANT_FLOWS.map((_,i)=>flow(active,i)):active.labels)].join('\n');
 const textStyle={color:colors.translationText,fontSize:16,lineHeight:27};
 const pair=(i:number)=><><AgricultureNativeFigureRuby {...context} field={`label:${i}`} text={ja.labels[i]} style={textStyle}/>{!!t&&<Text style={textStyle}>{t.labels[i]}</Text>}</>;
 return <View testID={`agri-native-process-${e.kind}`} style={{gap:12,marginVertical:12,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:10}}>
  <AgricultureNativeFigureRuby {...context} field="title" text={ja.title} style={{...textStyle,fontSize:19,fontWeight:'700'}}/>
  {!!t&&<Text testID="agri-native-process-translated-title" style={textStyle}>{t.title}</Text>}
  <View accessible accessibilityRole="image" accessibilityLabel={alt} style={{gap:14}}>
   {plant?<>
    <View testID="agri-native-process-leaf-stem-root" style={{alignItems:'center',gap:3}}>
     <View style={{borderRadius:34,borderWidth:2,borderColor:'#327842',backgroundColor:'#e6f2df',paddingHorizontal:24,paddingVertical:8}}>{pair(11)}</View>
     <View style={{borderLeftWidth:5,borderColor:'#327842',paddingLeft:10,minHeight:34}}>{pair(15)}</View>
     <View style={{alignSelf:'stretch',borderTopWidth:2,borderColor:'#98734c',alignItems:'center',paddingTop:8}}>{pair(14)}<View style={{borderBottomLeftRadius:32,borderBottomRightRadius:32,borderWidth:2,borderColor:'#98734c',paddingHorizontal:24,paddingVertical:8}}>{pair(12)}</View></View>
    </View>
    {NATIVE_PLANT_FLOWS.map((_,i)=><View key={i} testID={`agri-native-process-flow-${i}`} style={{gap:3,borderBottomWidth:1,borderColor:colors.border,paddingBottom:7}}><AgricultureNativeFigureRuby {...context} field={`flow:${i}`} text={flow(ja,i)} style={textStyle}/>{!!t&&<Text style={textStyle}>{flow(t,i)}</Text>}</View>)}
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
  <AgricultureNativeFigureRuby {...context} field="caption" text={ja.caption} style={textStyle}/>
  {!!t&&<Text testID="agri-native-process-translated-caption" style={textStyle}>{t.caption}</Text>}
  <Text style={{...textStyle,fontSize:14}}>{e.sources.map(s=>`${s.documentId} · p.${s.printedPage}`).join(' / ')}</Text>
 </View>;
}
