import { useArtworkVisible } from './ArtworkVisibility';
import Image from './DecodedArtwork';
import { type ImageProps } from 'expo-image';

// Farm scenes use expo-image rather than ImageBackground; apply the same rule.
export default function FocusedArtwork({ source, ...props }: ImageProps) {
  const focused = useArtworkVisible();
  return focused ? <Image {...props} source={source} /> : null;
}
