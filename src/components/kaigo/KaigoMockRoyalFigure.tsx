import React,{useState} from 'react';
import {Image,Pressable,ScrollView,Text,View,type ImageStyle,type StyleProp} from 'react-native';
import {mockRoyalFigureFor,type PublicMockFigureQuestion} from '@/data/kaigo/royal-mock-figures';
import type {RubyToken} from '@/data/kaigo/types';

/** Readings belong to the complete current public caption, never to a stale partial string. */
export function mockFigureCaptionTokens(question:PublicMockFigureQuestion):RubyToken[]|undefined {
 const figure=mockRoyalFigureFor(question),tokens=question.furigana?.figureDescription;
 if(!figure || !tokens?.length || tokens.map(t=>t.text).join('')!==question.figureDescriptionJa
   || tokens.some(t=>/[一-龯々]/.test(t.text) && !t.readingKana))return undefined;
 const corrections=figure.captionReadingCorrections;if(!corrections?.length)return tokens;
 const boundaries=new Map<number,number>([[0,0]]);let offset=0;
 tokens.forEach((t,i)=>{offset+=t.text.length;boundaries.set(offset,i+1);});
 const result:RubyToken[]=[];let previous=0;
 for(const repair of corrections){const end=repair.start+repair.text.length,a=boundaries.get(repair.start),b=boundaries.get(end);
  if(a===undefined || b===undefined || a<previous || question.figureDescriptionJa.slice(repair.start,end)!==repair.text || !/^[ぁ-ゖー]+$/.test(repair.readingKana))return undefined;
  result.push(...tokens.slice(previous,a),{text:repair.text,readingKana:repair.readingKana});previous=b;
 }
 result.push(...tokens.slice(previous));return result.map(t=>t.text).join('')===question.figureDescriptionJa?result:undefined;
}
function captionSlice(question:PublicMockFigureQuestion,start:number,end:number){
 const tokens=mockFigureCaptionTokens(question);if(!tokens)return undefined;
 const result:RubyToken[]=[];let offset=0;
 for(const token of tokens){const next=offset+token.text.length,a=Math.max(start,offset),b=Math.min(end,next);
  if(a<b){if(token.readingKana&&(a!==offset||b!==next))return undefined;result.push({...token,text:token.text.slice(a-offset,b-offset)});}offset=next;
 }
 return result.map(t=>t.text).join('')===question.figureDescriptionJa.slice(start,end)?result:undefined;
}
function CaptionRow({question,text,start,expanded}:{question:PublicMockFigureQuestion;text:string;start:number;expanded:boolean}){
 const tokens=captionSlice(question,start,start+text.length),size=expanded?24:16;
 return tokens?<View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',justifyContent:'center'}}>
  {tokens.map((t,i)=><View key={i} style={{alignItems:'center'}}>{!!t.readingKana&&<Text style={{fontSize:expanded?13:10,lineHeight:expanded?18:14,color:'#526674'}}>{t.readingKana}</Text>}<Text style={{fontSize:size,lineHeight:size+6,color:'#173b5b'}}>{t.text}</Text></View>)}
 </View>:<Text style={{fontSize:size,color:'#173b5b'}}>{text}</Text>;
}

/** Only public question conditions are visible before submission; localized alt is review-only. */
export function KaigoMockRoyalFigure({question,translatedAlt,style}:{question:PublicMockFigureQuestion;translatedAlt?:string;style?:StyleProp<ImageStyle>}){
 const [expanded,setExpanded]=useState(false),figure=mockRoyalFigureFor(question);
 if(!figure)return <View testID="kaigo-mock-figure-pending-source-check"><Text>この問題の図を表示できません。</Text></View>;
 const reach=figure.reachArea,alt=translatedAlt?question.figureDescriptionJa+' / '+translatedAlt:question.figureDescriptionJa;
 let rowStart=0;
 return <View style={[style,{aspectRatio:undefined,maxHeight:undefined}]}>
  <Pressable accessibilityRole="button" accessibilityLabel={alt} accessibilityHint="図を押すと拡大・縮小できます。" onPress={()=>setExpanded(v=>!v)}>
   <ScrollView horizontal={expanded} contentContainerStyle={{flexGrow:1}} maximumZoomScale={3} minimumZoomScale={1}>
    <View testID={`kaigo-mock-royal-${figure.figureKey}`} style={{position:'relative',width:expanded?1000:'100%',aspectRatio:figure.width/figure.height}}>
     {figure.renderMode==='native_table'?<View testID="kaigo-mock-native-source-table" accessible accessibilityLabel={alt} style={{width:'100%',height:'100%',padding:8,gap:8,backgroundColor:'#fffaf0'}}>
      {(figure.rowsSourceJa??[]).map((text,i)=>{const start=rowStart;rowStart+=text.length;return <View key={i} testID={`kaigo-mock-native-table-row-${i}`} style={{flex:1,borderWidth:2,borderColor:'#173b5b',borderRadius:14,padding:6,justifyContent:'center',backgroundColor:['#eaf2fa','#fff2d5','#e8f4ec'][i]}}><CaptionRow question={question} text={text} start={start} expanded={expanded}/></View>;})}
     </View>:<Image accessibilityLabel={alt} source={figure.source} resizeMode="contain" style={{width:'100%',height:'100%'}}/>}
     {reach&&<View pointerEvents="none" testID="kaigo-mock-schematic-reach" style={{position:'absolute',left:`${reach.left}%`,top:`${reach.top}%`,width:`${reach.width}%`,height:`${reach.height}%`,borderRadius:999,borderWidth:2,borderStyle:'dashed',borderColor:'#204563',backgroundColor:'rgba(238,247,255,0.07)'}}/>}
     {figure.markers.map(marker=><View key={marker.label} pointerEvents="none" accessible accessibilityLabel={marker.label} style={{position:'absolute',left:`${marker.x}%`,top:`${marker.y}%`,width:26,height:26,marginLeft:-13,marginTop:-13,borderRadius:13,borderWidth:2,borderColor:'#fffaf0',backgroundColor:'#173b5b',alignItems:'center',justifyContent:'center'}}><Text style={{color:'#fffaf0',fontSize:15,fontWeight:'700'}}>{marker.label}</Text></View>)}
    </View>
   </ScrollView>
  </Pressable>
 </View>;
}
