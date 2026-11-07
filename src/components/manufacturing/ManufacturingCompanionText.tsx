import {Text,View,StyleSheet,type StyleProp,type TextStyle} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {manufacturingCompanionFieldReading} from '@/data/manufacturing/companion-field-readings';
export function ManufacturingCompanionText({lesson,paragraphId,field,text,enabled=true,hideText=false,style}:{lesson:ManufacturingLesson;paragraphId:string;field:'title'|'text';text:string;enabled?:boolean;hideText?:boolean;style?:StyleProp<TextStyle>}){
 if(hideText)return null;
 const parts=enabled?manufacturingCompanionFieldReading(lesson,paragraphId,field,text):undefined,color=StyleSheet.flatten(style)?.color;
 if(!parts)return <Text selectable style={style}>{text}</Text>;
 return <View accessible accessibilityLabel={text} testID={`manufacturing-companion-ruby-${lesson.id}-${paragraphId}-${field}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{parts.map((p,i)=>p.text==='\n'?<View key={i} style={{width:'100%',height:0}}/>:<View key={i} style={{alignItems:'center',maxWidth:'100%',minWidth:0}}><Text style={{fontSize:10,lineHeight:14,color}}>{p.reading??' '}</Text><Text selectable style={style}>{p.text}</Text></View>)}</View>;
}
