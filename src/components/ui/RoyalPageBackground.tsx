import type { PropsWithChildren } from 'react';
import { ImageBackground, StyleSheet, View, type ImageSourcePropType } from 'react-native';

// Full-screen artwork lives outside safe-area padding and scroll containers.
export default function RoyalPageBackground({children,tone='light',source}:PropsWithChildren<{tone?:'light'|'dark';source?:ImageSourcePropType}>) {
 return <ImageBackground source={source ?? require('../../../assets/app/life/location-backgrounds/cafe/01-clear-morning.jpg')} resizeMode="cover" blurRadius={40} style={s.background}>
  <View pointerEvents="none" style={[s.overlay,tone==='dark'?s.dark:s.light]}/>{children}
 </ImageBackground>;
}
const s=StyleSheet.create({background:{flex:1},overlay:{...StyleSheet.absoluteFillObject},light:{backgroundColor:'rgba(255,255,255,.45)'},dark:{backgroundColor:'rgba(11,24,48,.78)'}});
