import {StyleSheet,Text,View} from 'react-native';
import {foodManufacturingLessonRuby} from '@/data/food-manufacturing/lesson-ruby';
import type {FoodManufacturingLesson} from '@/data/food-manufacturing';

/** Sector-local paragraph layout; shared Japanese/JLPT components remain unchanged. */
export function FoodLessonRuby({lesson,field,text,color,readingColor,heading=false}:{lesson:FoodManufacturingLesson;field:string;text:string;color:string;readingColor:string;heading?:boolean}) {
 const segments=foodManufacturingLessonRuby(lesson,field,text),fontSize=heading?19:17;
 if(!segments)return <Text selectable style={{color,fontSize,lineHeight:heading?30:29,fontWeight:heading?'700':'400'}}>{text}</Text>;
 const pieces=segments.flatMap(part=>part.reading?[part]:Array.from(part.text,char=>({text:char,reading:undefined})));
 return <View accessible accessibilityLabel={text} testID={`food-ruby-${lesson.id}-${field}`} style={s.line}>{pieces.map((part,i)=><View key={i} style={s.word}><Text style={{color:readingColor,fontSize:Math.max(9,fontSize*.56),lineHeight:14,maxWidth:'100%',flexShrink:1,textAlign:'center'}}>{part.reading??' '}</Text><Text selectable style={{color,fontSize,lineHeight:heading?30:29,fontWeight:heading?'700':'400',maxWidth:'100%',flexShrink:1}}>{part.text}</Text></View>)}</View>;
}
const s=StyleSheet.create({line:{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',justifyContent:'flex-start'},word:{alignItems:'center',maxWidth:'100%',minWidth:0}});
