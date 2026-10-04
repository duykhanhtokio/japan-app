import { useArtworkVisible } from './ArtworkVisibility';
import Image from './DecodedArtwork';
import type { ImageProps } from 'expo-image';
import { StyleSheet, View, type ImageBackgroundProps } from 'react-native';

// Preserve children and screen state while releasing hidden background artwork.
export default function FocusedImageBackground({ children, style, imageStyle, imageRef, importantForAccessibility, source, enabled = true, ...props }: ImageBackgroundProps & { enabled?: boolean }) {
  const focused = useArtworkVisible();
  const flattenedStyle = StyleSheet.flatten(style);
  return <View style={style} importantForAccessibility={importantForAccessibility} accessibilityIgnoresInvertColors>
    {focused && enabled && <Image ref={imageRef as unknown as import('react').Ref<import('expo-image').Image>} {...(props as unknown as ImageProps)} source={source} fadeDuration={0} importantForAccessibility={importantForAccessibility} style={[StyleSheet.absoluteFill, { width: flattenedStyle?.width, height: flattenedStyle?.height }, imageStyle]} />}
    {children}
  </View>;
}
