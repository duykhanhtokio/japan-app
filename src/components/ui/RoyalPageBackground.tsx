import type { PropsWithChildren } from 'react';
import { StyleSheet, type ImageSourcePropType } from 'react-native';
import FocusedImageBackground from './FocusedImageBackground';

// Full-screen artwork lives outside safe-area padding and scroll containers.
export default function RoyalPageBackground({children,source,enabled=true}:PropsWithChildren<{source?:ImageSourcePropType;enabled?:boolean}>) {
 return <FocusedImageBackground enabled={enabled} source={source ?? require('../../../assets/app/backgrounds/study-light.png')} resizeMode="cover" blurRadius={40} style={s.background}>{children}</FocusedImageBackground>;
}
const s=StyleSheet.create({background:{flex:1,backgroundColor:'#1e140c'}});
