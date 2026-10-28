import {createElement} from 'react';
import {Platform,StyleSheet,Text,View,type StyleProp,type TextStyle} from 'react-native';
import {hasAlignedFoodRuby,type FoodRubySegment} from '@/data/food-manufacturing/ruby';

/** Food-only ruby: native aligned blocks, and real inline HTML ruby on web. */
export function FoodRubyText({text,segments,style,readingColor,testID,selectable=false,accessible=true}:{text:string;segments?:FoodRubySegment[];style?:StyleProp<TextStyle>;readingColor?:string;testID?:string;selectable?:boolean;accessible?:boolean}){
 if(!hasAlignedFoodRuby(text,segments))return <Text testID={testID} accessible={accessible} accessibilityLabel={text} selectable={selectable} style={style}>{text}</Text>;
 const flat=StyleSheet.flatten(style)??{},fontSize=typeof flat.fontSize==='number'?flat.fontSize:17;
 if(Platform.OS==='web')return <Text testID={testID} accessible={accessible} accessibilityLabel={text} selectable={selectable} style={[style,{lineHeight:Math.max(flat.lineHeight??0,fontSize*1.95)}]}>{segments.map((part,i)=>part.reading?createElement('ruby',{key:i,style:{rubyPosition:'over',rubyAlign:'center'}},part.text,createElement('rp',null,'('),createElement('rt',{'aria-hidden':true,style:{fontSize:'.56em',lineHeight:1,color:readingColor??flat.color,fontWeight:'normal'}},part.reading),createElement('rp',null,')')):part.text)}</Text>;
 const pieces=segments.flatMap(part=>part.reading?[part]:Array.from(part.text,char=>({text:char,reading:undefined})));
 return <View testID={testID} accessible={accessible} accessibilityLabel={text} style={{alignSelf:'stretch',flexDirection:'row',flexWrap:'wrap',justifyContent:flat.textAlign==='center'?'center':'flex-start',alignItems:'flex-end'}}>{pieces.map((part,i)=>part.text==='\n'?<View key={i} style={{width:'100%',height:0}}/>:<View key={i} style={{alignItems:'center'}}><Text accessible={false} style={{fontFamily:flat.fontFamily,color:readingColor??flat.color,fontSize:fontSize*.56,lineHeight:fontSize*.75}}>{part.reading??' '}</Text><Text accessible={false} selectable={selectable} style={[style,{lineHeight:fontSize*1.35}]}>{part.text}</Text></View>)}</View>;
}
