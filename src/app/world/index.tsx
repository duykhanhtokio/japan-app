import { pushPrepared } from '@/components/ui/prepareSceneRoute';

import ResponsiveWorldMap, { WorldMapItem } from '@/components/world/ResponsiveWorldMap';
import { japanAssets, japanLandZones, japanRegions } from '@/data/world-map-config';

export default function JapanWorldScreen() {
    const openRegion = (item: WorldMapItem) => {
        if (item.id === 'kansai') {
            pushPrepared('/world/kansai');
            return;
        }
        pushPrepared(`/world/${item.id}` as never);
    };
    return <ResponsiveWorldMap assets={japanAssets} items={japanRegions} landZones={japanLandZones} onItemPress={openRegion}
        regionLabel="地域を選択" title="日本地図"
        subtitle="日本の暮らしと会話を地域から体験しましょう" />;
}
