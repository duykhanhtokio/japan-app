import { useIsFocused } from '@react-navigation/native';
import { Image, type ImageProps } from 'expo-image';

// Farm scenes use expo-image rather than ImageBackground; apply the same rule.
export default function FocusedArtwork({ source, ...props }: ImageProps) {
  const focused = useIsFocused();
  return <Image {...props} source={focused ? source : null} />;
}
