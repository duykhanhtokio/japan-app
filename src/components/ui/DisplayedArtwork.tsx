import { useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Image, type ImageProps } from 'expo-image';

const AnimatedImage = Animated.createAnimatedComponent(Image);
export type ArtworkProps = ImageProps & { animated?: boolean };
export function artworkKey(props: ArtworkProps) {
  const source = props.source && typeof props.source === 'object' && 'uri' in props.source ? props.source.uri : props.source;
  return JSON.stringify([source, props.blurRadius ?? 0, props.contentFit ?? 'cover', props.recyclingKey]);
}

// onLoad is too early for RN Fabric's asynchronous blur. Keep the old bitmap
// until expo-image assigns the processed destination bitmap and emits onDisplay.
export default function DisplayedArtwork(props: ArtworkProps) {
  const targetKey = artworkKey(props);
  const latestKey = useRef(targetKey);
  latestKey.current = targetKey;
  const [displayed, setDisplayed] = useState(() => ({ key: targetKey, props }));
  const target = { key: targetKey, props };
  const layers = displayed.key === targetKey ? [target] : [displayed, target];
  return <>{layers.map(layer => {
    const { animated, onDisplay, ...imageProps } = layer.props;
    const Component = animated ? AnimatedImage : Image;
    return <Component {...imageProps} key={layer.key} transition={0}
      cachePolicy={imageProps.cachePolicy ?? 'memory-disk'}
      onDisplay={() => {
        if (latestKey.current === layer.key) setDisplayed(layer);
        onDisplay?.();
      }} />;
  })}</>;
}

export const fullSceneArtworkStyle = StyleSheet.create({ full: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' } }).full;
