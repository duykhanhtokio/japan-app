import { useIsFocused } from '@react-navigation/native';
import { type ImageProps } from 'expo-image';
import { useSceneBackdrop } from './SceneBackdropContext';
import DisplayedArtwork, { fullSceneArtworkStyle } from './DisplayedArtwork';

// Existing callers are the five full-viewport farm scene backgrounds.
export default function FocusedArtwork(props: ImageProps) {
  const focused = useIsFocused();
  const managed = useSceneBackdrop({ ...props, style: fullSceneArtworkStyle }, true);
  return focused && !managed ? <DisplayedArtwork {...props} /> : null;
}
