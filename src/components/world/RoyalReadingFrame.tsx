import { type PropsWithChildren } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { RoyalContentPanel, RoyalExplanationPanel } from '@/components/ui/RoyalPanels';
/** The dialogue caller fits its copy before mounting; no measured rescale pass. */
export default function RoyalReadingFrame({children,style,explanation=false}:PropsWithChildren<{style?:StyleProp<ViewStyle>;explanation?:boolean;fit?:boolean}>){
 const Panel=explanation?RoyalExplanationPanel:RoyalContentPanel;
 return <Panel style={[{width:'100%',minHeight:0,paddingHorizontal:28,paddingVertical:18,justifyContent:'center'},style]}><View style={{minHeight:0,justifyContent:'center'}}>{children}</View></Panel>;
}
