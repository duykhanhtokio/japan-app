import { useState, type PropsWithChildren, type ReactNode } from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

const HUD_ART=require('../../../assets/app/ui/royal-af/farm-hud-plaque-v1.png');
const ART = require('../../../assets/app/ui/royal-af/dialogue-frame-v1.png');
const OPEN_ART = require('../../../assets/app/ui/royal-af/hud-energy-open-frame-v1.png');
// Original open frame: visible band y=156..550; ornaments end at x=330/1842.
// Use one scale for both axes of each corner, including short HUD bars.
export function royalOpenFrameGeometry(width:number,height:number) {
 const scale=Math.max(0,Math.min(36/330,width/660,height/288));
 return {cornerX:330*scale,cornerY:144*scale,left:140*scale,right:139*scale,top:68*scale,bottom:41*scale,radius:70*scale};
}
/** Nine raster slices: corners keep their proportions while straight edges extend. */
export default function RoyalPaperPanel({children,style,tone='paper',borderOnly=false,underlay}:PropsWithChildren<{style?:StyleProp<ViewStyle>;tone?:'paper'|'hud';borderOnly?:boolean;underlay?:ReactNode}>) {
 const [size,setSize]=useState({width:0,height:0});
 const hud=tone==='hud',source=borderOnly?OPEN_ART:hud?HUD_ART:ART,sourceWidth=borderOnly||hud?2172:1600,sourceHeight=borderOnly||hud?724:560;
 const sx=borderOnly?[0,330,1842,2172]:hud?[7,407,1766,2166]:[0,240,1360,1600],sy=borderOnly?[156,300,406,550]:hud?[73,273,428,628]:[68,228,328,488];
 const cornerScale=Math.min(1,size.width/((hud?30:36)*2),size.height/((hud?15:24)*2));
 const open=royalOpenFrameGeometry(size.width,size.height);
 const cornerX=borderOnly?open.cornerX:(hud?30:36)*cornerScale,cornerY=borderOnly?open.cornerY:(hud?15:24)*cornerScale;
 const dx=[0,cornerX,Math.max(cornerX,size.width-cornerX),size.width],dy=[0,cornerY,Math.max(cornerY,size.height-cornerY),size.height];
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
