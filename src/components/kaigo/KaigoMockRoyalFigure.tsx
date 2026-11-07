import React from 'react';
import {Image,Text,View,type ImageStyle,type StyleProp} from 'react-native';
import {kaigoFigures} from '@/data/kaigo/figures';
import {isKnownRoyalMockFigureKey,mockRoyalFigureFor,type PublicMockFigureQuestion} from '@/data/kaigo/royal-mock-figures';

/** Neutral question conditions. Selected-locale alt is supplied only by submitted-review controls. */
export function KaigoMockRoyalFigure({question,translatedAlt,style}:{question:PublicMockFigureQuestion;translatedAlt?:string;style?:StyleProp<ImageStyle>}){
 const figure=mockRoyalFigureFor(question);
 if(!figure&&isKnownRoyalMockFigureKey(question.figureKey))return <View testID="kaigo-mock-figure-pending-source-check"><Text>この問題の図を表示できません。</Text></View>;
 if(!figure)return <Image testID="kaigo-mock-legacy-figure" accessibilityLabel={question.figureDescriptionJa} source={kaigoFigures[question.figureKey??'']} resizeMode="contain" style={style}/>;
 const reach=figure.reachArea;
 const alt=translatedAlt?question.figureDescriptionJa+' / '+translatedAlt:question.figureDescriptionJa;
 return <View testID={`kaigo-mock-royal-${figure.figureKey}`} style={[style,{position:'relative',aspectRatio:figure.width/figure.height,maxHeight:undefined}]}>
  <Image accessibilityLabel={alt} source={figure.source} resizeMode="contain" style={{width:'100%',height:'100%'}}/>
  {reach&&<View pointerEvents="none" testID="kaigo-mock-schematic-reach" style={{position:'absolute',left:`${reach.left}%`,top:`${reach.top}%`,width:`${reach.width}%`,height:`${reach.height}%`,borderRadius:999,borderWidth:2,borderStyle:'dashed',borderColor:'#204563',backgroundColor:'rgba(238,247,255,0.07)'}}/>}
  {figure.markers.map(marker=><View key={marker.label} pointerEvents="none" accessible accessibilityLabel={marker.label} style={{position:'absolute',left:`${marker.x}%`,top:`${marker.y}%`,width:26,height:26,marginLeft:-13,marginTop:-13,borderRadius:13,borderWidth:2,borderColor:'#fffaf0',backgroundColor:'#173b5b',alignItems:'center',justifyContent:'center'}}><Text style={{color:'#fffaf0',fontSize:15,fontWeight:'700'}}>{marker.label}</Text></View>)}
 </View>;
}
