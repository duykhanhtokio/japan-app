import { navigateWithPreparedArtwork } from '@/components/ui/prepareSceneRoute';
import { router } from 'expo-router';

import ResponsiveWorldMap, { WorldMapItem } from '@/components/world/ResponsiveWorldMap';
import { japanAssets, japanLandZones, japanRegions } from '@/data/world-map-config';

export default function JapanWorldScreen() {
    const openRegion = (item: WorldMapItem) => {
        const destination = `/world/${item.id}`;
        navigateWithPreparedArtwork(destination, () => router.push(destination as never));
    };
    return <ResponsiveWorldMap assets={japanAssets} items={japanRegions} landZones={japanLandZones} onItemPress={openRegion}
        regionLabel="地域を選択" title="日本地図"
        subtitle="日本の暮らしと会話を地域から体験しましょう" />;
}
