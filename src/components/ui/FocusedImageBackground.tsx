import { useIsFocused } from '@react-navigation/native';
import { Image, StyleSheet, View, type ImageBackgroundProps } from 'react-native';

// Preserve children and screen state while releasing hidden background artwork.
export default function FocusedImageBackground({ children, style, imageStyle, imageRef, importantForAccessibility, source, enabled = true, ...props }: ImageBackgroundProps & { enabled?: boolean }) {
  const focused = useIsFocused();
  const flattenedStyle = StyleSheet.flatten(style);
  return <View style={style} importantForAccessibility={importantForAccessibility} accessibilityIgnoresInvertColors>
    {focused && enabled && <Image {...props} source={source} fadeDuration={0} importantForAccessibility={importantForAccessibility} style={[StyleSheet.absoluteFill, { width: flattenedStyle?.width, height: flattenedStyle?.height }, imageStyle]} ref={imageRef} />}
    {children}
  </View>;
}
