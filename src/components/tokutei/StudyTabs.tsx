import {Pressable,StyleSheet,Text,View} from 'react-native';
import {ROYAL_FONT} from '@/components/ui/RoyalSurface';
import {useStudyAppearance} from './StudyAppearance';
export function StudyTabs<T extends string>({value,onChange,items}:{value:T;onChange:(value:T)=>void;items:readonly {value:T;label:string;testID?:string}[]}){
 const {colors,dark}=useStudyAppearance();
 return <View accessibilityRole="tablist" style={[s.rail,{backgroundColor:colors.translation,borderColor:colors.border}]}>
  {items.map(item=><Pressable key={item.value} testID={item.testID} accessibilityRole="tab" accessibilityState={{selected:item.value===value}} onPress={()=>onChange(item.value)} style={({pressed})=>[s.tab,{backgroundColor:item.value===value?(dark?'#e4c982':'#173a60'):'transparent',opacity:pressed?.8:1}]}><Text style={[s.label,{color:item.value===value?(dark?'#182b40':'#fff3cf'):colors.text}]}>{item.label}</Text></Pressable>)}
 </View>;
}
const s=StyleSheet.create({rail:{width:'100%',flexDirection:'row',alignItems:'stretch',gap:4,padding:4,borderWidth:1,borderRadius:14,marginBottom:8},tab:{flex:1,minWidth:0,minHeight:48,borderRadius:10,paddingHorizontal:8,paddingVertical:10,alignItems:'center',justifyContent:'center'},label:{fontFamily:ROYAL_FONT.body,fontSize:15,lineHeight:23,textAlign:'center',fontWeight:'600',flexShrink:1}});
