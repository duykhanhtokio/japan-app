import { useIsFocused } from '@react-navigation/native';
import { Image, StyleSheet, View, type ImageBackgroundProps } from 'react-native';
import { Image as DisplayImage, type ImageProps as DisplayImageProps } from 'expo-image';
import { useRef, useState } from 'react';

import { useInheritedBackdrop } from './AppBackdrop';

// Preserve children and screen state while releasing hidden background artwork.
export default function FocusedImageBackground({ children, style, imageStyle, imageRef, importantForAccessibility, source, enabled = true, inheritBackdrop = false, ...props }: ImageBackgroundProps & { enabled?: boolean; inheritBackdrop?: boolean }) {
  const focused = useIsFocused();
  const inherited = useInheritedBackdrop();
  const flattenedStyle = StyleSheet.flatten(style);
  const [displayed, setDisplayed] = useState(source);
  const latest = useRef(source);
  latest.current = source;
  // Native RN blur assigns the processed bitmap after its onLoad event. Use
  // Tokutei's display-aware renderer for blurred page artwork and retain the
  // last displayed bitmap until the incoming processed image is presented.
  const layers = displayed === source ? [source] : [displayed, source];
  const imageGeometry = [StyleSheet.absoluteFill, { width: flattenedStyle?.width ?? '100%' as const, height: flattenedStyle?.height ?? '100%' as const }, imageStyle];
  const blurred = !!props.blurRadius;
  return <View style={style} importantForAccessibility={importantForAccessibility} accessibilityIgnoresInvertColors>
    {focused && enabled && !(inheritBackdrop && inherited) && (blurred ? layers.map(layer => <DisplayImage
      key={typeof layer === 'number' ? layer : JSON.stringify(layer)}
      {...props as unknown as DisplayImageProps} source={layer as DisplayImageProps['source']}
      contentFit={props.resizeMode === 'stretch' ? 'fill' : props.resizeMode === 'contain' ? 'contain' : 'cover'}
      transition={0} cachePolicy="memory-disk" style={imageGeometry}
      onDisplay={() => { if (latest.current === layer) setDisplayed(layer); }}
    />) : <Image {...props} source={source} fadeDuration={0} importantForAccessibility={importantForAccessibility} style={imageGeometry} ref={imageRef} />)}
    {children}
  </View>;
}
