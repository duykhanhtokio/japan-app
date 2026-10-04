import { Asset } from 'expo-asset';
import { Image as ExpoImage } from 'expo-image';
import { Image as NativeImage, Platform } from 'react-native';

const prepared = new Map<number, Promise<void>>();
const decodedWeb = new Map<string, HTMLImageElement>();

// Populate the caches used by the existing renderers. Never replace sources,
// geometry, overlays or mounted components with a preload representation.
export async function prepareArtwork(sources: Parameters<typeof Asset.loadAsync>[0]) {
  const modules = Array.isArray(sources) ? sources : [sources];
  await Promise.all(modules.map(source => {
    if (typeof source !== 'number') return Promise.resolve();
    let pending = prepared.get(source);
    if (!pending) {
      pending = (async () => {
        const asset = Asset.fromModule(source);
        await asset.downloadAsync();
        const resolved = typeof NativeImage.resolveAssetSource === 'function'
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
      prepared.set(source, pending);
      pending.catch(() => prepared.delete(source));
    }
    return pending;
  }));
}
