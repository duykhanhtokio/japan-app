import { Asset } from 'expo-asset';
import { Image, type ImageRef } from 'expo-image';
import { Platform } from 'react-native';

const prepared = new Map<string, Promise<void>>();
// Retain decoded resources, never DOM nodes in the page. Otherwise the browser
// can release the preload before navigation and re-fetch on the first paint.
const decodedWebArtwork = new Map<string, HTMLImageElement>();
const decodedNativeArtwork = new Map<string, ImageRef>();
export const preparedNativeArtwork = (uri: string) => decodedNativeArtwork.get(uri);

// Preparation never mounts an image, changes a backdrop, or starts a transition.
// Keep the current screen until the destination's approved artwork is decoded.
export async function prepareArtwork(sources: Parameters<typeof Asset.loadAsync>[0]) {
  const assets = await Asset.loadAsync(sources);
  await Promise.all(assets.map(asset => {
    const uri = asset.localUri ?? asset.uri;
    let pending = prepared.get(uri);
    if (!pending) {
      pending = (async () => {
        if (Platform.OS === 'web') {
          const image = new globalThis.Image();
          image.src = uri;
          await image.decode();
          decodedWebArtwork.set(uri, image);
        } else {
          decodedNativeArtwork.set(uri, await Image.loadAsync(uri));
        }
      })();
      prepared.set(uri, pending);
      pending.catch(() => prepared.delete(uri));
    }
    return pending;
  }));
}
