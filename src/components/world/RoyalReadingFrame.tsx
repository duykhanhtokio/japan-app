import { useState, type PropsWithChildren } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { RoyalContentPanel, RoyalExplanationPanel } from '@/components/ui/RoyalPanels';
/** Non-scrolling text: allocate height, then fit any measured overflow inside it. */
export default function RoyalReadingFrame({children,style,explanation=false,fit=false}:PropsWithChildren<{style?:StyleProp<ViewStyle>;explanation?:boolean;fit?:boolean}>){
 const [available,setAvailable]=useState(0),[copyHeight,setCopyHeight]=useState(0);
 const Panel=explanation?RoyalExplanationPanel:RoyalContentPanel;
 const scale=available>0&&copyHeight>0?Math.min(1,available/copyHeight):1;
 return <Panel style={[{width:'100%',minHeight:0,paddingHorizontal:28,paddingVertical:18,justifyContent:'center'},style]}>
  {fit?<View onLayout={event=>setAvailable(event.nativeEvent.layout.height)} style={{flex:1,minHeight:0,position:'relative'}}>
   <View onLayout={event=>setCopyHeight(event.nativeEvent.layout.height)} style={{position:'absolute',left:0,right:0,top:'50%',marginTop:-copyHeight/2,transform:[{scale}]}}>{children}</View>
  </View>:<View style={{minHeight:0,justifyContent:'center'}}>{children}</View>}
 </Panel>;
}
