import {Text,View} from 'react-native';
import type {FoodManufacturingLesson} from '@/data/food-manufacturing';
import {foodRoyalNativeLabelRuby} from '@/data/food-manufacturing/royal-native-context-readings';

/** Native image labels retain exact Japanese text while showing scoped readings. */
export function FoodRoyalNativeLabel({lesson,text,color,size=17,strong=false}:{lesson:FoodManufacturingLesson;text:string;color:string;size?:number;strong?:boolean}){
 const base={color,fontSize:size,lineHeight:Math.ceil(size*1.6),fontWeight:strong?'700' as const:'400' as const};
 const tokens=foodRoyalNativeLabelRuby(lesson,text);
 if(!tokens)return <Text style={base}>{text}</Text>;
 return <View accessible accessibilityRole={strong?'header':undefined} accessibilityLabel={text} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}>{tokens.map((token,i)=>token.text==='\n'?<View key={i} style={{width:'100%'}}/>:<View key={i} style={{alignItems:'center'}}><Text style={{color,fontSize:10,lineHeight:14}}>{token.reading??' '}</Text><Text style={base}>{token.text}</Text></View>)}</View>;
}
