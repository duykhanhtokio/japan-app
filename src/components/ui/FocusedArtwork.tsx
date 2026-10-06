import { useIsFocused } from '@react-navigation/native';
import { Image, type ImageProps } from 'expo-image';
import { useInheritedBackdrop } from './AppBackdrop';
import { useRef, useState } from 'react';

// Farm scenes use expo-image rather than ImageBackground; apply the same rule.
export default function FocusedArtwork({ source, ...props }: ImageProps) {
  const focused = useIsFocused();
  const inherited = useInheritedBackdrop();
  const [displayed, setDisplayed] = useState(source);
  const latest = useRef(source);
  latest.current = source;
  const layers = displayed === source ? [source] : [displayed, source];
  return focused && !inherited ? <>{layers.map(layer => <Image key={typeof layer === 'number' ? layer : JSON.stringify(layer)}
    {...props} source={layer} transition={0}
    onDisplay={() => {
      if (latest.current !== layer) return;
      setDisplayed(layer);
      props.onDisplay?.();
    }} />)}</> : null;
}
