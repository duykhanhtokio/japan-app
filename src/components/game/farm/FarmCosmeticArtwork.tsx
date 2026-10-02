import { Image, View } from 'react-native';
import { getFarmCosmeticAsset } from '@/game/data/farm-cosmetic-assets';
import measuredBounds from '@/game/data/farm-cosmetic-art-bounds.json';

/** Fit the visible artwork, rather than its transparent scene canvas. */
export default function FarmCosmeticArtwork({ assetKey, width, height }: {
    assetKey: string; width: number; height: number;
}) {
    const art = (measuredBounds as Record<string, {
        width: number; height: number; bounds: number[];
    }>)[assetKey];
    const source = getFarmCosmeticAsset(assetKey);
    if (!source) return null;
    if (!art) return <Image source={source} fadeDuration={0} resizeMode="contain" style={{ width, height }} />;
    const [left, top, right, bottom] = art.bounds;
    const scale = Math.min(width / (right - left), height / (bottom - top));
    return <View style={{ width, height, overflow: 'hidden' }}>
        <Image source={source} fadeDuration={0} resizeMode="stretch" style={{
            position: 'absolute', width: art.width * scale, height: art.height * scale,
            left: (width - (right - left) * scale) / 2 - left * scale,
            top: (height - (bottom - top) * scale) / 2 - top * scale,
        }} />
    </View>;
}
