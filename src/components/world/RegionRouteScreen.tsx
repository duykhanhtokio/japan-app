import { router } from 'expo-router';
import ResponsiveWorldMap, { WorldMapItem } from '@/components/world/ResponsiveWorldMap';
import { RegionMapId, regionMaps } from '@/data/world-map-config';
import { regionLabelJa } from '@/components/world/world-ja';

const prefectureIds: Record<string, string> = {
    doo:'PRF-001',donan:'PRF-001',dohoku:'PRF-001',doto:'PRF-001',aomori:'PRF-002',iwate:'PRF-003',miyagi:'PRF-004',akita:'PRF-005',yamagata:'PRF-006',fukushima:'PRF-007',
    ibaraki:'PRF-008',tochigi:'PRF-009',gunma:'PRF-010',saitama:'PRF-011',chiba:'PRF-012',tokyo:'PRF-013',kanagawa:'PRF-014',niigata:'PRF-015',toyama:'PRF-016',ishikawa:'PRF-017',fukui:'PRF-018',yamanashi:'PRF-019',nagano:'PRF-020',gifu:'PRF-021',shizuoka:'PRF-022',aichi:'PRF-023',
    mie:'PRF-024',shiga:'PRF-025',kyoto:'PRF-026',osaka:'PRF-027',hyogo:'PRF-028',nara:'PRF-029',wakayama:'PRF-030',
    tottori:'PRF-031',shimane:'PRF-032',okayama:'PRF-033',hiroshima:'PRF-034',yamaguchi:'PRF-035',tokushima:'PRF-036',kagawa:'PRF-037',ehime:'PRF-038',kochi:'PRF-039',fukuoka:'PRF-040',saga:'PRF-041',nagasaki:'PRF-042',kumamoto:'PRF-043',oita:'PRF-044',miyazaki:'PRF-045',kagoshima:'PRF-046',okinawa:'PRF-047',
};

export default function RegionRouteScreen({ region }: { region: RegionMapId }) {
    const config = regionMaps[region];
    const handlePress = (item: WorldMapItem) => {
        const prefectureId = prefectureIds[item.id];
        if (prefectureId) router.push(`/world/prefecture/${prefectureId}`);
    };
    return <ResponsiveWorldMap assets={config.assets} items={config.items} onItemPress={handlePress}
        regionLabel="都道府県を選択" title={`${regionLabelJa(region)}地方`}
        subtitle="都道府県を選んで、暮らしの会話を始めよう" />;
}
