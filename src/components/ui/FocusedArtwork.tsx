import { useIsFocused } from '@react-navigation/native';
import { Image, type ImageProps } from 'expo-image';
import { useInheritedBackdrop } from './AppBackdrop';
export default function FocusedArtwork(props: ImageProps) {
  const focused = useIsFocused();
  const inherited = useInheritedBackdrop();
  return focused && !inherited ? <Image {...props} transition={0} /> : null;
}
