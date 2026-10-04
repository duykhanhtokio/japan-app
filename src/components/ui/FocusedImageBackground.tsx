import { useIsFocused } from '@react-navigation/native';
import { Image, StyleSheet, View, type ImageBackgroundProps } from 'react-native';

import { useInheritedBackdrop } from './AppBackdrop';

// Preserve children and screen state while releasing hidden background artwork.
export default function FocusedImageBackground({ children, style, imageStyle, imageRef, importantForAccessibility, source, enabled = true, inheritBackdrop = false, ...props }: ImageBackgroundProps & { enabled?: boolean; inheritBackdrop?: boolean }) {
  const focused = useIsFocused();
  const inherited = useInheritedBackdrop();
  const flattenedStyle = StyleSheet.flatten(style);
  return <View style={style} importantForAccessibility={importantForAccessibility} accessibilityIgnoresInvertColors>
    {focused && enabled && !(inheritBackdrop && inherited) && <Image {...props} source={source} fadeDuration={0} importantForAccessibility={importantForAccessibility} style={[StyleSheet.absoluteFill, { width: flattenedStyle?.width, height: flattenedStyle?.height }, imageStyle]} ref={imageRef} />}
    {children}
  </View>;
}
