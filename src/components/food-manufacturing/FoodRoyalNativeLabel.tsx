import {Text,View} from 'react-native';
import type {FoodManufacturingLesson} from '@/data/food-manufacturing';
import {foodRoyalNativeLabelRuby} from '@/data/food-manufacturing/royal-native-context-readings';

/** Native image labels retain exact Japanese text while showing scoped readings. */
export function FoodRoyalNativeLabel({lesson,text,color}:{lesson:FoodManufacturingLesson;text:string;color:string}){
 const tokens=foodRoyalNativeLabelRuby(lesson,text);
 if(!tokens)return <Text style={{color,fontSize:17,lineHeight:28}}>{text}</Text>;
 return <View accessible accessibilityLabel={text} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}>{tokens.map((token,i)=>token.text==='\n'?<View key={i} style={{width:'100%'}}/>:<View key={i} style={{alignItems:'center'}}><Text style={{color,fontSize:10,lineHeight:14}}>{token.reading??' '}</Text><Text style={{color,fontSize:17,lineHeight:28}}>{token.text}</Text></View>)}</View>;
}
