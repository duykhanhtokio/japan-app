import { useIsFocused } from '@react-navigation/native';
import { Platform, Image, StyleSheet, View, type ImageBackgroundProps } from 'react-native';
import { Image as DisplayImage, type ImageProps as DisplayImageProps } from 'expo-image';

import { usePathname } from 'expo-router';
import { useInheritedBackdrop, usePreparedSceneBackdrop } from './AppBackdrop';

// Preserve children and screen state while releasing hidden background artwork.
export default function FocusedImageBackground({ children, style, imageStyle, imageRef, importantForAccessibility, source, enabled = true, inheritBackdrop = false, ...props }: ImageBackgroundProps & { enabled?: boolean; inheritBackdrop?: boolean }) {
  const focused = useIsFocused();
  const inherited = useInheritedBackdrop();
  usePreparedSceneBackdrop(usePathname(), source, (props.blurRadius ?? 0) * (Platform.OS === 'ios' ? 2 : 1), enabled && inheritBackdrop);
  const flattenedStyle = StyleSheet.flatten(style);
  const imageGeometry = [StyleSheet.absoluteFill, { width: flattenedStyle?.width ?? '100%' as const, height: flattenedStyle?.height ?? '100%' as const }, imageStyle];
  const blurred = !!props.blurRadius;
  return <View style={style} importantForAccessibility={importantForAccessibility} accessibilityIgnoresInvertColors>
    {focused && enabled && !(inheritBackdrop && inherited) && (blurred ? <DisplayImage
      {...props as unknown as DisplayImageProps} source={source as DisplayImageProps['source']}
      contentFit={props.resizeMode === 'stretch' ? 'fill' : props.resizeMode === 'contain' ? 'contain' : 'cover'}
      transition={0} cachePolicy="memory-disk" style={imageGeometry}
    /> : <Image {...props} source={source} fadeDuration={0} importantForAccessibility={importantForAccessibility} style={imageGeometry} ref={imageRef} />)}
    {children}
  </View>;
}
