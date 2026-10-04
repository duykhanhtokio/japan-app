import { useIsFocused } from '@react-navigation/native';
import { ImageBackground, type ImageBackgroundProps } from 'react-native';

// Preserve children and screen state while releasing hidden background artwork.
export default function FocusedImageBackground({ source, enabled = true, ...props }: ImageBackgroundProps & { enabled?: boolean }) {
  const focused = useIsFocused();
  return <ImageBackground {...props} source={focused && enabled ? source : undefined} fadeDuration={0} />;
}
