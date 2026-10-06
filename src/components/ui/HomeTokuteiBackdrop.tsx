import { useRef, useState } from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';

type Backdrop = { key: string; source: ImageSourcePropType; blurRadius: number };

// Keep the outgoing bitmap until the incoming image reports that its processed bitmap is displayed.
// Stable keys preserve the loaded instance when the outgoing layer is removed.
export default function HomeTokuteiBackdrop({ target }: { target: Backdrop }) {
  const [displayed, setDisplayed] = useState(target);
  const latestTarget = useRef(target);
  latestTarget.current = target;
  const layers = displayed.key === target.key ? [target] : [displayed, target];
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    {layers.map(layer => <Image key={layer.key} testID={`home-tokutei-backdrop-${layer.key}`}
      source={layer.source} contentFit="cover" blurRadius={layer.blurRadius}
      transition={0} cachePolicy="memory-disk" style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
      onDisplay={() => { if (latestTarget.current.key === layer.key) setDisplayed(layer); }}
      onError={event => console.warn('App backdrop failed to load:', event.error)} />)}
  </View>;
}
