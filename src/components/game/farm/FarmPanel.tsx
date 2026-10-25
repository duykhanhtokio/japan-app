import type { PropsWithChildren } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
/** Flat paper window for farm tools; the scene and HUD retain their artwork. */
export function FarmPanel({children,style}: PropsWithChildren<{style?:StyleProp<ViewStyle>}>) {
 return <View style={[s.panel,style]}>{children}</View>;
}
const s=StyleSheet.create({panel:{padding:28,minHeight:80,backgroundColor:'#f4efe3',borderColor:'#cba55a',borderWidth:1,borderRadius:12}});
