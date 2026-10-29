import {StyleSheet,Text,View} from 'react-native';
import {foodManufacturingQuestionRuby} from '@/data/food-manufacturing/question-ruby';
import type {FoodManufacturingQuestion} from '@/data/food-manufacturing';

export function FoodQuestionRuby({question,field,text,color,readingColor,heading=false}:{question:FoodManufacturingQuestion;field:string;text:string;color:string;readingColor:string;heading?:boolean}) {
 const segments=foodManufacturingQuestionRuby(question,field,text),fontSize=heading?19:17;
 if(!segments)return <Text style={{color,fontSize,lineHeight:heading?30:29,fontWeight:heading?'700':'400'}}>{text}</Text>;
 const pieces=segments.flatMap(part=>part.reading?[part]:Array.from(part.text,char=>({text:char,reading:undefined})));
 return <View accessible accessibilityLabel={text} testID={`food-question-ruby-${question.id}-${field}`} style={s.line}>{pieces.map((part,i)=><View key={i} style={s.word}><Text style={{color:readingColor,fontSize:Math.max(9,fontSize*.56),lineHeight:14}}>{part.reading??' '}</Text><Text style={{color,fontSize,lineHeight:heading?30:29,fontWeight:heading?'700':'400'}}>{part.text}</Text></View>)}</View>;
}
const s=StyleSheet.create({line:{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'},word:{alignItems:'center'}});
