import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

const home = require('../../../assets/app/welcome/welcome-japan-landscape-v2.png');
const tokutei = require('../../../assets/app/home-cards/tokutei-engine-safety.png');

// Keep the outgoing bitmap until the incoming image reports that its processed bitmap is displayed.
// Stable keys preserve the loaded instance when the outgoing layer is removed.
export default function HomeTokuteiBackdrop({ pathname }: { pathname: string }) {
  const target = pathname === '/home' ? 'home' : 'tokutei';
  const [displayed, setDisplayed] = useState(target);
  const latestTarget = useRef(target);
  latestTarget.current = target;
  const layers = displayed === target ? [displayed] : [displayed, target];
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    {layers.map(source => <Image key={source} testID={`home-tokutei-backdrop-${source}`}
      source={source === 'home' ? home : tokutei} contentFit="cover" blurRadius={40}
      transition={0} cachePolicy="memory-disk" style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
      onDisplay={() => { if (latestTarget.current === source) setDisplayed(source); }}
      onError={event => console.warn('Home/Tokutei backdrop failed to load:', event.error)} />)}
  </View>;
}
