import { Image as CachedImage } from 'expo-image';
import { type PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

export const PAPER_FRAME_SLICES=[require('../../../assets/app/ui/royal-af/paper-slices/0-0.png'),require('../../../assets/app/ui/royal-af/paper-slices/0-1.png'),require('../../../assets/app/ui/royal-af/paper-slices/0-2.png'),require('../../../assets/app/ui/royal-af/paper-slices/1-0.png'),require('../../../assets/app/ui/royal-af/paper-slices/1-1.png'),require('../../../assets/app/ui/royal-af/paper-slices/1-2.png'),require('../../../assets/app/ui/royal-af/paper-slices/2-0.png'),require('../../../assets/app/ui/royal-af/paper-slices/2-1.png'),require('../../../assets/app/ui/royal-af/paper-slices/2-2.png')];
export const OPEN_FRAME_SLICES=[require('../../../assets/app/ui/royal-af/open-slices/0-0.png'),require('../../../assets/app/ui/royal-af/open-slices/0-1.png'),require('../../../assets/app/ui/royal-af/open-slices/0-2.png'),require('../../../assets/app/ui/royal-af/open-slices/1-0.png'),require('../../../assets/app/ui/royal-af/open-slices/1-2.png'),require('../../../assets/app/ui/royal-af/open-slices/2-0.png'),require('../../../assets/app/ui/royal-af/open-slices/2-1.png'),require('../../../assets/app/ui/royal-af/open-slices/2-2.png')];
export const HUD_FRAME_SLICES=[require('../../../assets/app/ui/royal-af/hud-slices/0-0.png'),require('../../../assets/app/ui/royal-af/hud-slices/0-1.png'),require('../../../assets/app/ui/royal-af/hud-slices/0-2.png'),require('../../../assets/app/ui/royal-af/hud-slices/1-0.png'),require('../../../assets/app/ui/royal-af/hud-slices/1-1.png'),require('../../../assets/app/ui/royal-af/hud-slices/1-2.png'),require('../../../assets/app/ui/royal-af/hud-slices/2-0.png'),require('../../../assets/app/ui/royal-af/hud-slices/2-1.png'),require('../../../assets/app/ui/royal-af/hud-slices/2-2.png')];
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
/** Nine raster slices: corners keep their proportions while straight edges extend. */
export default function RoyalPaperPanel({children,style,tone='paper',borderOnly=false}:PropsWithChildren<{style?:StyleProp<ViewStyle>;tone?:'paper'|'hud';borderOnly?:boolean;immediateBorder?:boolean}>) {
 const hud=tone==='hud';
 // Every border uses pre-cropped slices on its first render. Home retains its
 // approved 36px corners; no measured full-source artwork or secondary fill.
 const slices=borderOnly?OPEN_FRAME_SLICES:hud?HUD_FRAME_SLICES:PAPER_FRAME_SLICES;
 const cx=hud&&!borderOnly?30:36,cy=borderOnly?144*36/330:hud?15:24;
 return <View pointerEvents={borderOnly?'none':'auto'} style={[s.panel,style,{backgroundColor:'transparent'}]}>
  <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>{slices.map((source,index)=>{
   const cell=borderOnly&&index>=4?index+1:index,row=Math.floor(cell/3),col=cell%3;
   const horizontal=col===0?{left:0,width:cx}:col===2?{right:0,width:cx}:{left:cx,right:cx};
   const vertical=row===0?{top:0,height:cy}:row===2?{bottom:0,height:cy}:{top:cy,bottom:cy};
   return <View key={cell} style={{position:'absolute',...horizontal,...vertical}}><CachedImage source={source} contentFit="fill" transition={0} cachePolicy="memory-disk" style={{width:'100%',height:'100%'}}/></View>;
  })}</View>{children}
 </View>;
}
const s=StyleSheet.create({panel:{position:'relative',paddingHorizontal:28,paddingVertical:28,minHeight:80}});
