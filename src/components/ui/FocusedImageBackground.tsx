import { useContext, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { View, type ImageBackgroundProps } from 'react-native';
import type { ImageProps } from 'expo-image';
import DisplayedArtwork, { fullSceneArtworkStyle } from './DisplayedArtwork';
import { SceneBackdropContext, useSceneBackdrop, useScenePath } from './SceneBackdropContext';

// Full-screen scenes hand off at the persistent root. Cards and modal artwork
// retain their local geometry and use the same processed-bitmap display gate.
export default function FocusedImageBackground({ children, style, imageStyle, imageRef, importantForAccessibility,
  source, enabled = true, inheritBackdrop = false, sceneBackdrop = false, localScene = false, resizeMode = 'cover', blurRadius,
  fadeDuration: _fadeDuration, onLoad, onLoadEnd, onError, ...props
}: ImageBackgroundProps & { enabled?: boolean; inheritBackdrop?: boolean; sceneBackdrop?: boolean; localScene?: boolean }) {
  const focused = useIsFocused();
  const coordinator = useContext(SceneBackdropContext);
  const pathname = useScenePath();
  const focusRef = useRef(focused);
  focusRef.current = focused;
  const resolved = source as ImageProps['source'];
  const artwork = { source: resolved, blurRadius, contentFit: resizeMode === 'repeat' || resizeMode === 'stretch' ? 'fill' as const : resizeMode === 'center' ? 'none' as const : resizeMode,
    style: fullSceneArtworkStyle };
  const managed = useSceneBackdrop(artwork, enabled && (sceneBackdrop || inheritBackdrop));
  return <View style={style} importantForAccessibility={importantForAccessibility} accessibilityIgnoresInvertColors>
    {focused && enabled && !managed && <DisplayedArtwork source={resolved} blurRadius={blurRadius}
      contentFit={artwork.contentFit} style={[fullSceneArtworkStyle, imageStyle]}
      testID={props.testID} accessibilityLabel={props.accessibilityLabel}
      onLoad={onLoad ? event => onLoad({ nativeEvent: { source: { uri: event.source.url,
        width: event.source.width, height: event.source.height } } } as Parameters<NonNullable<ImageBackgroundProps['onLoad']>>[0]) : undefined}
      onLoadEnd={onLoadEnd}
      onError={event => onError?.({ nativeEvent: { error: event.error } } as Parameters<NonNullable<ImageBackgroundProps['onError']>>[0])}
      onDisplay={() => {
        if (localScene && focusRef.current) coordinator?.register({ pathname, artwork: { source: null } });
      }} />}
    {children}
  </View>;
}
