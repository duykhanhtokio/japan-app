import React from 'react';
import {Text,View,StyleSheet,type TextProps} from 'react-native';
import {illustrationRubyTokensFor} from '@/data/kaigo/illustration-readings';

/** Native Japanese illustration labels retain the selected-language text beside them. */
export function KaigoIllustrationText({children,style,...props}:TextProps){
 const pieces=React.Children.toArray(children);
 if(!pieces.every(p=>typeof p==='string'||typeof p==='number')) return <Text style={style} {...props}>{children}</Text>;
 const text=pieces.join(''),match=text.match(/^(\d+ · )?(.*?)( \/ .*)?$/s);
 const prefix=match?.[1]??'',japanese=match?.[2]??text,suffix=match?.[3]??'';
 const tokens=illustrationRubyTokensFor(japanese);
 if(!tokens) return <Text style={style} {...props}>{children}</Text>;
 const flat=StyleSheet.flatten(style)??{},size=typeof flat.fontSize==='number'?flat.fontSize:16;
 const baseStyle={fontSize:size,color:flat.color,fontWeight:flat.fontWeight,fontFamily:flat.fontFamily,lineHeight:flat.lineHeight,textAlign:flat.textAlign};
 return <View testID="kaigo-illustration-ruby" accessible accessibilityLabel={text} style={[style,{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}]}>
  {!!prefix&&<Text style={baseStyle}>{prefix}</Text>}
  {tokens.map((token,i)=><View key={i} style={{alignItems:'center'}}>
   {!!token.readingKana&&<Text style={{fontSize:Math.max(9,size*.58),lineHeight:Math.max(13,size*.8),color:flat.color??'#526674'}}>{token.readingKana}</Text>}
   <Text style={baseStyle}>{token.text}</Text>
  </View>)}
  {!!suffix&&<Text style={baseStyle}>{suffix}</Text>}
 </View>;
}
