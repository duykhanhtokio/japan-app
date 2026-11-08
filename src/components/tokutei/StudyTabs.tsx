import {View} from 'react-native';
import {StudyAction} from './StudyAction';
export function StudyTabs<T extends string>({value,onChange,items}:{value:T;onChange:(value:T)=>void;items:readonly {value:T;label:string;testID?:string}[]}){
 return <View accessibilityRole="tablist" style={{width:'100%',flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:8}}>
  {items.map(item=><View key={item.value} accessibilityRole="tab" accessibilityState={{selected:item.value===value}} style={{flexBasis:'48%',flexGrow:1,minWidth:0,maxWidth:'100%'}}><StudyAction testID={item.testID} title={`${item.value===value?'✓ ':''}${item.label}`} onPress={()=>onChange(item.value)}/></View>)}
 </View>;
}
