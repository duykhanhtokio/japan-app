import { Asset } from 'expo-asset';
import { Image as ExpoImage } from 'expo-image';
import { Image as NativeImage, Platform } from 'react-native';

export type ArtworkSource = Parameters<typeof Asset.fromModule>[0];
export function isArtworkSource(source: unknown): source is ArtworkSource {
  return typeof source === 'number' || typeof source === 'string'
    || (!!source && typeof source === 'object' && 'uri' in source && typeof source.uri === 'string');
}
const prepared = new Map<number | string, Promise<void>>();
const decodedWeb = new Map<string, HTMLImageElement>();

// Populate the caches used by the existing renderers. Never replace sources,
// geometry, overlays or mounted components with a preload representation.
export async function prepareArtwork(sources: ArtworkSource | ArtworkSource[]) {
  const modules = Array.isArray(sources) ? sources : [sources];
  await Promise.all(modules.map(source => {
    if (!isArtworkSource(source)) return Promise.resolve();
    const key = typeof source === 'object' ? source.uri : source;
    let pending = prepared.get(key);
    if (!pending) {
      pending = (async () => {
        const asset = Asset.fromModule(source);
        await asset.downloadAsync();
        const resolved = typeof source === 'number' && typeof NativeImage.resolveAssetSource === 'function'
          ? NativeImage.resolveAssetSource(source) : undefined;
        const uri = resolved?.uri ?? asset.uri;
        if (Platform.OS === 'web') {
          const image = new globalThis.Image();
          image.src = uri;
          await image.decode();
          decodedWeb.set(uri, image);
        } else {
          const [nativeReady, expoReady] = await Promise.all([
            NativeImage.prefetch(uri),
            ExpoImage.prefetch([...new Set([uri, asset.uri, asset.localUri].filter((value): value is string => !!value))], { cachePolicy: 'memory-disk' }),
          ]);
          if (!nativeReady || !expoReady) throw new Error(`Artwork cache failed: ${asset.name}`);
        }
      })();
      prepared.set(key, pending);
      pending.catch(() => prepared.delete(key));
    }
    return pending;
  }));
}
