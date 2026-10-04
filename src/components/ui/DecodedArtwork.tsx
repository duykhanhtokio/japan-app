import { createElement, forwardRef, type Ref } from 'react';
import { Image, type ImageProps } from 'expo-image';
import { Asset } from 'expo-asset';
import { Platform, View } from 'react-native';
import { preparedNativeArtwork } from './prepareArtwork';

// Native artwork uses the same decoded-image cache as the startup preload.
// Web has fixed geometry already. A CSS image paints the prepared resource in
// the same commit, without an img load event or layout observer's second pass.
const DecodedArtwork = forwardRef<Image, ImageProps>(function DecodedArtwork(props, ref) {
  if (Platform.OS !== 'web') {
    const nativeSource = (source: ImageProps['source'], usePrepared = true) => {
      if (typeof source !== 'number') return source;
      const asset = Asset.fromModule(source);
      const uri = asset.localUri ?? asset.uri;
      return (usePrepared && preparedNativeArtwork(uri)) || { uri, width: asset.width ?? undefined, height: asset.height ?? undefined };
    };
    const source = Array.isArray(props.source) ? props.source.map(source => nativeSource(source, false)) : nativeSource(props.source);
    return <Image ref={ref} {...props} source={source as ImageProps['source']} transition={0} cachePolicy="memory-disk" />;
  }
  const { source, style, contentFit, resizeMode, contentPosition, blurRadius,
    pointerEvents, accessibilityLabel, testID, onLayout } = props;
  const selected = Array.isArray(source) ? source[0] : source;
  const resolved = typeof selected === 'number' ? Asset.fromModule(selected)
    : typeof selected === 'string' ? { uri: selected } : selected;
  const uri = resolved && 'uri' in resolved ? resolved.uri : undefined;
  const fit = contentFit ?? (resizeMode === 'stretch' ? 'fill' : resizeMode === 'center' ? 'none' : resizeMode === 'repeat' ? 'fill' : resizeMode) ?? 'cover';
  return <View ref={ref as unknown as Ref<View>} testID={testID} pointerEvents={pointerEvents} onLayout={onLayout} style={[style, { overflow: 'hidden' }]}>
    {uri && createElement('div', {
      role: accessibilityLabel ? 'img' : undefined, 'aria-label': accessibilityLabel,
      'aria-hidden': accessibilityLabel ? undefined : true,
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%',
        backgroundImage: `url("${uri}")`,
        backgroundSize: fit === 'fill' ? '100% 100%' : fit === 'none' ? 'auto' : fit,
        backgroundRepeat: resizeMode === 'repeat' ? 'repeat' : 'no-repeat',
        backgroundPosition: typeof contentPosition === 'string' ? contentPosition : 'center',
        filter: blurRadius ? `blur(${blurRadius}px)` : undefined },
    })}
  </View>;
});
export default DecodedArtwork;
