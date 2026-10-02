import { useState, type PropsWithChildren, type ReactNode } from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

const HUD_ART=require('../../../assets/app/ui/royal-af/farm-hud-plaque-v1.png');
const ART = require('../../../assets/app/ui/royal-af/dialogue-frame-v1.png');
/** Nine raster slices: corners keep their proportions while straight edges extend. */
export default function RoyalPaperPanel({children,style,tone='paper',borderOnly=false,underlay}:PropsWithChildren<{style?:StyleProp<ViewStyle>;tone?:'paper'|'hud';borderOnly?:boolean;underlay?:ReactNode}>) {
 const [size,setSize]=useState({width:0,height:0});
 const hud=tone==='hud',source=hud?HUD_ART:ART,sourceWidth=hud?2172:1600,sourceHeight=hud?724:560;
 const sx=hud?[7,407,1766,2166]:[0,240,1360,1600],sy=hud?[73,273,428,628]:[68,228,328,488];
 const cornerScale=Math.min(1,size.width/((hud?30:36)*2),size.height/((hud?15:24)*2));
 const cornerX=(hud?30:36)*cornerScale,cornerY=(hud?15:24)*cornerScale;
 const dx=[0,cornerX,Math.max(cornerX,size.width-cornerX),size.width],dy=[0,cornerY,Math.max(cornerY,size.height-cornerY),size.height];
 return <View pointerEvents={borderOnly?'none':'auto'} onLayout={event=>{const {width,height}=event.nativeEvent.layout;setSize(old=>old.width===width&&old.height===height?old:{width,height})}} style={[s.panel,style]}>
  {underlay}
  <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
   {size.width>0&&size.height>0&&[0,1,2].flatMap(row=>[0,1,2].map(col=>{
    if(borderOnly&&row===1&&col===1)return null;
    const width=dx[col+1]-dx[col],height=dy[row+1]-dy[row],scaleX=width/(sx[col+1]-sx[col]),scaleY=height/(sy[row+1]-sy[row]);
    return <View key={`${row}-${col}`} style={{position:'absolute',overflow:'hidden',left:dx[col],top:dy[row],width,height}}><Image source={source} resizeMode="stretch" style={{position:'absolute',width:sourceWidth*scaleX,height:sourceHeight*scaleY,left:-sx[col]*scaleX,top:-sy[row]*scaleY}}/></View>;
   }))}
  </View>
  {children}
 </View>;
}
const s=StyleSheet.create({panel:{position:'relative',paddingHorizontal:28,paddingVertical:28,minHeight:80}});
