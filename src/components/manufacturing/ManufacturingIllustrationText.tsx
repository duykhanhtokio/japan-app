import React from 'react';
import {Text,View,StyleSheet,type TextProps} from 'react-native';
import {manufacturingIllustrationTokensFor} from '@/data/manufacturing/illustration-readings';

/** Exact Japanese illustration fields only; translations and unknown fields keep their text. */
export function ManufacturingIllustrationText({children,style,selectable,readingLanguage,...props}:TextProps&{readingLanguage?:string}){
 const pieces=React.Children.toArray(children);
 if(!pieces.every(p=>typeof p==='string'||typeof p==='number'))return <Text style={style} selectable={selectable} {...props}>{children}</Text>;
 const text=pieces.join(''),tokens=readingLanguage==='ja'?manufacturingIllustrationTokensFor(text):undefined;
 if(!tokens)return <Text style={style} selectable={selectable} {...props}>{children}</Text>;
 const displayTokens=tokens.flatMap(token=>token.readingKana?[token]:token.text.split(/(\n)/).filter(Boolean).map(text=>({text,readingKana:undefined})));
 const flat=StyleSheet.flatten(style)??{},size=typeof flat.fontSize==='number'?flat.fontSize:16;
 const baseStyle={fontSize:size,color:flat.color,fontWeight:flat.fontWeight,fontFamily:flat.fontFamily,lineHeight:flat.lineHeight,textAlign:flat.textAlign};
 return <View testID="manufacturing-illustration-ruby" accessible accessibilityLabel={text} style={[style,{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}]}>
  {displayTokens.map((token,i)=>token.text==='\n'?<View key={i} style={{width:'100%',height:Math.max(6,size*.35)}}/>:<View key={i} style={{alignItems:'center',maxWidth:'100%'}}>
   {!!token.readingKana&&<Text style={{fontSize:Math.max(9,size*.58),lineHeight:Math.max(13,size*.8),color:flat.color??'#526071'}}>{token.readingKana}</Text>}
   <Text selectable={selectable} style={baseStyle}>{token.text}</Text>
  </View>)}
 </View>;
}
