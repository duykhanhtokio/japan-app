import { useEffect, useState } from 'react';
import { StyleSheet, type ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { isArtworkSource, prepareArtwork } from './prepareArtwork';
type Backdrop = { key: string; source: ImageSourcePropType; blurRadius: number };
/** Keep one displayed image; prepare its replacement without mounting another layer. */
export default function HomeTokuteiBackdrop({ target }: { target: Backdrop }) {
  const [displayed, setDisplayed] = useState(target);
  useEffect(() => {
    let current = true;
    if (target.key === displayed.key) return;
    const ready = isArtworkSource(target.source) ? prepareArtwork(target.source) : Promise.resolve();
    void ready.then(() => { if (current) setDisplayed(target); })
      .catch(error => console.warn('App backdrop preparation:', error));
    return () => { current = false; };
  }, [target, displayed.key]);
  return <Image pointerEvents="none" testID="app-backdrop" source={displayed.source} contentFit="cover" blurRadius={displayed.blurRadius}
    transition={0} cachePolicy="memory-disk" style={StyleSheet.absoluteFill} />;
}
