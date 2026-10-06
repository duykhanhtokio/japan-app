import type { ImageSourcePropType } from 'react-native';
import metadataJson from '@/data/location-place-artwork.json';

const metadata = metadataJson as Record<string, { category: string }>;
const artwork: Record<string, ImageSourcePropType> = {
  'LOC-027-02': require('../../../assets/app/life/location-backgrounds/places/osaka-tsutenkaku.png'),
  'LOC-027-03': require('../../../assets/app/life/location-backgrounds/places/osaka-dotonbori.png'),
};

// Geography belongs to the stable location ID, never a category or round-robin slot.
export function placeBackground(locationId: string, category?: string | null) {
  const entry = metadata[locationId];
  if (!entry || (category && entry.category !== category)) return undefined;
  return artwork[locationId];
}
