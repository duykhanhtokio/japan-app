import type { ImageSourcePropType } from 'react-native';
import metadataJson from '@/data/location-place-artwork.json';

const metadata = metadataJson as Record<string, { category: string }>;
const artwork: Record<string, ImageSourcePropType> = {
  'LOC-001-15': require('../../../assets/app/life/location-backgrounds/places/sapporo-maruyama-zoo.png'),
  'LOC-001-07': require('../../../assets/app/life/location-backgrounds/places/sapporo-hassamu-mall.png'),
  'LOC-001-01': require('../../../assets/app/life/location-backgrounds/places/sapporo-station-south.png'),
  'LOC-001-09': require('../../../assets/app/life/location-backgrounds/places/sapporo-ramen-alley.png'),
  'LOC-001-10': require('../../../assets/app/life/location-backgrounds/places/sapporo-susukino.png'),
  'LOC-001-11': require('../../../assets/app/life/location-backgrounds/places/sapporo-nijo-market.png'),
  'LOC-001-17': require('../../../assets/app/life/location-backgrounds/places/sapporo-jozankei-futami.png'),
  'LOC-001-14': require('../../../assets/app/life/location-backgrounds/places/sapporo-hokkaido-shrine.png'),
  'LOC-001-02': require('../../../assets/app/life/location-backgrounds/places/sapporo-odori-tv-tower.png'),
  'LOC-001-04': require('../../../assets/app/life/location-backgrounds/places/sapporo-odori-tv-tower.png'),
  'LOC-001-03': require('../../../assets/app/life/location-backgrounds/places/sapporo-clock-tower.png'),
  'LOC-027-02': require('../../../assets/app/life/location-backgrounds/places/osaka-tsutenkaku.png'),
  'LOC-027-03': require('../../../assets/app/life/location-backgrounds/places/osaka-dotonbori.png'),
};

// Geography belongs to the stable location ID, never a category or round-robin slot.
export function placeBackground(locationId: string, category?: string | null) {
  const entry = metadata[locationId];
  if (!entry || (category && entry.category !== category)) return undefined;
  return artwork[locationId];
}
