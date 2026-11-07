import React from 'react';
import {Text,View} from 'react-native';
import type {mockPublicLabelsFor} from '@/data/kaigo/mock-public-label-readings';

/** Read the exact public lettering without adding question interpretation. */
export function KaigoMockPublicLabelReadings({binding}:{binding:NonNullable<ReturnType<typeof mockPublicLabelsFor>>}){
 return <View testID={`kaigo-mock-public-readings-${binding.figureKey}`} style={{gap:8,paddingVertical:10}}>
  {binding.labels.map((label,index)=><View key={index} accessible accessibilityLabel={label.text} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',gap:1}}>
   {label.tokens.map((token,i)=><View key={i} style={{alignItems:'center'}}>
    {'readingKana' in token&&<Text style={{fontSize:10,lineHeight:14,color:'#526674'}}>{token.readingKana}</Text>}
    <Text style={{fontSize:16,lineHeight:23,color:'#173b5b'}}>{token.text}</Text>
   </View>)}
  </View>)}
 </View>;
}
