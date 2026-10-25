import { Asset } from 'expo-asset';
import { createElement, type PropsWithChildren } from 'react';
import { Image, Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

// Original open frame: visible band y=156..550; ornaments end at x=330/1842.
// Use one scale for both axes of each corner, including short HUD bars.
export function royalOpenFrameGeometry(width:number,height:number) {
 const scale=Math.max(0,Math.min(36/330,width/660,height/288));
 return {cornerX:330*scale,cornerY:144*scale,left:140*scale,right:139*scale,top:68*scale,bottom:41*scale,radius:70*scale};
}
// Home artwork reaches beneath the opaque gold stroke, not the leaf tips.
// Source stroke: x=10..55 / 2116..2166; top y=175..220; bottom y=515..545.
// These anchors sit inside opaque gold, allowing subpixel overlap on all edges.
export function royalOpenStrokeGeometry(width:number,height:number) {
 const scale=Math.max(0,Math.min(36/330,width/660,height/288));
 return {left:36*scale,right:36*scale,top:38*scale,bottom:22*scale,radius:140*scale};
}
export const MERGED_FRAMES = {
 paper: require('../../../assets/app/ui/royal-af/paper-merged.png'),
 hud: require('../../../assets/app/ui/royal-af/hud-merged.png'),
 open: require('../../../assets/app/ui/royal-af/open-merged.png'),
};
/** One border surface; no measuring pass or independently loading corner images. */
export default function RoyalPaperPanel({children,style,tone='paper',borderOnly=false,edgeScale=1}:PropsWithChildren<{style?:StyleProp<ViewStyle>;tone?:'paper'|'hud';borderOnly?:boolean;immediateBorder?:boolean;edgeScale?:number}>) {
 const source = MERGED_FRAMES[borderOnly ? 'open' : tone];
 const cx = tone === 'hud' && !borderOnly ? 30 : 36;
 const cy = borderOnly ? 16 : tone === 'hud' ? 15 : 24;
 return <View pointerEvents={borderOnly?'none':'auto'} style={[s.panel,style,{backgroundColor:'transparent'}]}>
  {Platform.OS === 'web' ? createElement('div', { 'aria-hidden': true, style: {
    position: 'absolute', inset: 0, pointerEvents: 'none', boxSizing: 'border-box',
    borderStyle: 'solid', borderColor: 'transparent', borderWidth: `${cy*edgeScale}px ${cx*edgeScale}px`,
    borderImageSource: `url("${Asset.fromModule(source).uri}")`,
    borderImageSlice: `${cy} ${cx}${borderOnly ? '' : ' fill'}`, borderImageRepeat: 'stretch',
  } }) : <View pointerEvents="none" style={StyleSheet.absoluteFillObject}><Image accessible={false} source={source} fadeDuration={0}
    resizeMode="stretch" capInsets={{top:cy,left:cx,bottom:cy,right:cx}} style={StyleSheet.absoluteFillObject} /></View>}
  {children}
 </View>;
}
const s=StyleSheet.create({panel:{position:'relative',paddingHorizontal:28,paddingVertical:28,minHeight:80}});
