import { Image as CachedImage } from 'expo-image';
import { useState, type PropsWithChildren, type ReactNode } from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

export const PAPER_FRAME_SLICES=[require('../../../assets/app/ui/royal-af/paper-slices/0-0.png'),require('../../../assets/app/ui/royal-af/paper-slices/0-1.png'),require('../../../assets/app/ui/royal-af/paper-slices/0-2.png'),require('../../../assets/app/ui/royal-af/paper-slices/1-0.png'),require('../../../assets/app/ui/royal-af/paper-slices/1-1.png'),require('../../../assets/app/ui/royal-af/paper-slices/1-2.png'),require('../../../assets/app/ui/royal-af/paper-slices/2-0.png'),require('../../../assets/app/ui/royal-af/paper-slices/2-1.png'),require('../../../assets/app/ui/royal-af/paper-slices/2-2.png')];
export const OPEN_FRAME_SLICES=[require('../../../assets/app/ui/royal-af/open-slices/0-0.png'),require('../../../assets/app/ui/royal-af/open-slices/0-1.png'),require('../../../assets/app/ui/royal-af/open-slices/0-2.png'),require('../../../assets/app/ui/royal-af/open-slices/1-0.png'),require('../../../assets/app/ui/royal-af/open-slices/1-2.png'),require('../../../assets/app/ui/royal-af/open-slices/2-0.png'),require('../../../assets/app/ui/royal-af/open-slices/2-1.png'),require('../../../assets/app/ui/royal-af/open-slices/2-2.png')];
const HUD_ART=require('../../../assets/app/ui/royal-af/farm-hud-plaque-v1.png');
const ART = require('../../../assets/app/ui/royal-af/dialogue-frame-v1.png');
const OPEN_ART = require('../../../assets/app/ui/royal-af/hud-energy-open-frame-v1.png');
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
export default function RoyalPaperPanel({children,style,tone='paper',borderOnly=false,immediateBorder=false,underlay}:PropsWithChildren<{style?:StyleProp<ViewStyle>;tone?:'paper'|'hud';borderOnly?:boolean;immediateBorder?:boolean;underlay?:ReactNode}>) {
 const [size,setSize]=useState({width:0,height:0});
 const hud=tone==='hud',source=borderOnly?OPEN_ART:hud?HUD_ART:ART,sourceWidth=borderOnly||hud?2172:1600,sourceHeight=borderOnly||hud?724:560;
 const sx=borderOnly?[0,330,1842,2172]:hud?[7,407,1766,2166]:[0,240,1360,1600],sy=borderOnly?[156,300,406,550]:hud?[73,273,428,628]:[68,228,328,488];
 const cornerScale=Math.min(1,size.width/((hud?30:36)*2),size.height/((hud?15:24)*2));
 const open=royalOpenFrameGeometry(size.width,size.height);
 const cornerX=borderOnly?open.cornerX:(hud?30:36)*cornerScale,cornerY=borderOnly?open.cornerY:(hud?15:24)*cornerScale;
 const dx=[0,cornerX,Math.max(cornerX,size.width-cornerX),size.width],dy=[0,cornerY,Math.max(cornerY,size.height-cornerY),size.height];
 // Open borders also mount once, without a delayed full-source image pass.
 if(borderOnly&&immediateBorder)return <View pointerEvents="none" style={[s.panel,style,{backgroundColor:'transparent'}]}>{underlay}<View pointerEvents="none" style={StyleSheet.absoluteFillObject}>{OPEN_FRAME_SLICES.map((source,index)=>{
  const cell=index<4?index:index+1,row=Math.floor(cell/3),col=cell%3;
  const horizontal=col===0?{left:0,width:36}:col===2?{right:0,width:36}:{left:36,right:36};
  const vertical=row===0?{top:0,height:144*36/330}:row===2?{bottom:0,height:144*36/330}:{top:144*36/330,bottom:144*36/330};
  return <View key={cell} style={{position:'absolute',...horizontal,...vertical}}><CachedImage source={source} contentFit="fill" transition={0} cachePolicy="memory-disk" style={{width:'100%',height:'100%'}}/></View>;
 })}</View>{children}</View>;
 // Paper corners/edges are positioned on the first render. Each source is
 // already cropped, so no onLayout -> state update -> oversized image pass.
 if(!borderOnly&&!hud)return <View style={[s.panel,style,{backgroundColor:'transparent'}]}>
  {underlay}<View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
   {PAPER_FRAME_SLICES.map((source,index)=>{
    const row=Math.floor(index/3),col=index%3;
    const horizontal=col===0?{left:0,width:36}:col===2?{right:0,width:36}:{left:36,right:36};
    const vertical=row===0?{top:0,height:24}:row===2?{bottom:0,height:24}:{top:24,bottom:24};
    return <View key={index} style={{position:'absolute',...horizontal,...vertical}}><CachedImage source={source} contentFit="fill" transition={0} cachePolicy="memory-disk" style={{width:'100%',height:'100%'}}/></View>;
   })}
  </View>{children}</View>;
 return <View pointerEvents={borderOnly?'none':'auto'} onLayout={event=>{const {width,height}=event.nativeEvent.layout;setSize(old=>old.width===width&&old.height===height?old:{width,height})}} style={[s.panel,style,{backgroundColor:'transparent'}]}>
  {underlay}
  <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
   {size.width>0&&size.height>0&&[0,1,2].flatMap(row=>[0,1,2].map(col=>{
    if(borderOnly&&row===1&&col===1)return null;
    const width=dx[col+1]-dx[col],height=dy[row+1]-dy[row],scaleX=width/(sx[col+1]-sx[col]),scaleY=height/(sy[row+1]-sy[row]);
    return <View key={`${row}-${col}`} style={{position:'absolute',overflow:'hidden',left:dx[col],top:dy[row],width,height}}><Image fadeDuration={0} source={source} resizeMode="stretch" style={{position:'absolute',width:sourceWidth*scaleX,height:sourceHeight*scaleY,left:-sx[col]*scaleX,top:-sy[row]*scaleY}}/></View>;
   }))}
  </View>
  {children}
 </View>;
}
const s=StyleSheet.create({panel:{position:'relative',paddingHorizontal:28,paddingVertical:28,minHeight:80}});
