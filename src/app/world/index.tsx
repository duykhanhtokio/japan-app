import { router } from 'expo-router';

import ResponsiveWorldMap, { WorldMapItem } from '@/components/world/ResponsiveWorldMap';
import { japanAssets, japanRegions } from '@/data/world-map-config';

export default function JapanWorldScreen() {
    const openRegion = (item: WorldMapItem) => {
        if (item.id === 'kansai') {
            router.push('/world/kansai');
            return;
        }
        router.push(`/world/${item.id}` as never);
    };
    return <ResponsiveWorldMap assets={japanAssets} items={japanRegions} onItemPress={openRegion}
        regionLabel="地域を選択" title="日本地図"
        subtitle="日本の暮らしと会話を地域から体験しましょう" />;
}
