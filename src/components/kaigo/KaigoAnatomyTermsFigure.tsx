import React from 'react';
import {Image,Text,View,type ImageSourcePropType} from 'react-native';
import translations from '@/data/kaigo/anatomy-term-labels.json';
export function KaigoAnatomyTermsFigure({source,kind,language='ja',expanded=false}:{source:ImageSourcePropType;kind:'colon'|'male';language?:string;expanded?:boolean}){
 const ja=translations.ja, tr=(translations as Record<string,typeof ja>)[language]??ja;
 const text=(a:string,b:string)=>tr===ja?a:a+' / '+b;
 return <View testID={`kaigo-anatomy-terms-${kind}`} style={{width:expanded?1000:'100%'}}>
  <Image source={source} accessibilityLabel={text(ja[kind+'Scope' as 'colonScope'],tr[kind+'Scope' as 'colonScope'])} resizeMode="contain" style={{width:'100%',aspectRatio:1400/1100}} />
  {ja[kind].map((label,i)=><Text key={i} style={{fontSize:16,lineHeight:24,color:'#243d4d',padding:6}}>{text(label,tr[kind][i])}</Text>)}
  <Text style={{fontSize:14,lineHeight:21,padding:8,color:'#526674'}}>{text(ja[kind+'Scope' as 'colonScope'],tr[kind+'Scope' as 'colonScope'])}</Text>
 </View>;
}
