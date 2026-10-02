import type { PropsWithChildren } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

// Bright approved morning artwork, blurred into colour rather than readable scenery.
export default function JlptStudyBackground({children}:PropsWithChildren) {
 return <ImageBackground source={require('../../../assets/app/life/location-backgrounds/cafe/01-clear-morning.jpg')} blurRadius={40} resizeMode="cover" style={s.background}>
  <View pointerEvents="none" style={s.light}/>{children}
 </ImageBackground>;
}
const s=StyleSheet.create({background:{flex:1},light:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(255,250,236,.72)'}});
