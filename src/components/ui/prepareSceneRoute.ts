import { Dimensions } from 'react-native';
import { japanAssets, regionMaps, type RegionMapId } from '@/data/world-map-config';
import { prepareArtwork } from './prepareArtwork';
import { ROUTE_ARTWORK } from './route-artwork';
import { COMMON_UI_ARTWORK } from './common-artwork';
import { router } from 'expo-router';

export async function prepareSceneRoute(path: string) {
  const pattern = Object.keys(ROUTE_ARTWORK).find(key => new RegExp('^' + key.replace(/\[[^\]]+\]/g, '[^/]+') + '$').test(path));
  const routeImages = pattern ? ROUTE_ARTWORK[pattern] : [];
  await prepareArtwork([...COMMON_UI_ARTWORK, ...routeImages]);
  const additional: number[] = [];
  const { width, height } = Dimensions.get('window');
  const ratio = height ? width / height : .46;
  const mode = ratio >= 1.1 ? 'landscape' : ratio >= .62 ? 'tablet' : 'phone';
  const region = path.replace('/world/', '') as RegionMapId;
  let artwork = path === '/world' ? japanAssets[mode]
    : path.startsWith('/world/') && region in regionMaps ? regionMaps[region].assets[mode]
    : path === '/game' ? (width > height
      ? width / height < 1.55
        ? require('../../../assets/game/farm/background/farm_map_tablet_landscape_v1.png')
        : require('../../../assets/game/farm/background/farm_map_landscape_v1.png')
      : require('../../../assets/game/farm/background/farm_map_master.png'))
    : path === '/profile' ? require('../../../assets/app/backgrounds/profile-light.png')
    : path === '/home' ? require('../../../assets/app/welcome/welcome-japan-landscape-v2.png')
    : path === '/portal' ? require('../../../assets/app/registration/registration-bg.jpg')
    : path === '/register/work' ? require('../../../assets/app/backgrounds/registration-work.png')
    : path === '/register' ? require('../../../assets/app/backgrounds/registration.png')
    : path.startsWith('/game/work/') ? (path.split('/')[3].startsWith('1-')
      ? require('../../../assets/game/farm/background/vegetable_map_background_v2.png')
      : require('../../../assets/app/life/location-backgrounds/construction-site/01-clear-morning.jpg'))
    : /^\/(?:world|settings|conversation-log|lesson)(?:\/|$)/.test(path)
      ? require('../../../assets/app/backgrounds/profile-details.png')
      : require('../../../assets/app/backgrounds/study-light.png');
  if (/^\/world\/(?:prefecture|city|location|dialogue)\//.test(path)) {
    const [repository, cities, locations, scenes] = await Promise.all([
      import('@/services/life-content-repository'), import('@/components/world/city-images.generated'),
      import('@/components/world/location-backgrounds.generated'), import('@/components/world/life-assets'),
    ]);
    const [, , kind, id] = path.split('/');
    if (kind === 'prefecture') {
      const city = repository.getLifeCitiesByPrefecture(id)[0];
      artwork = city ? cities.cityImageById[city.id] : undefined;
      for (const item of repository.getLifeCitiesByPrefecture(id)) {
        const image = cities.cityImageById[item.id];
        if (typeof image === 'number') additional.push(image);
      }
    } else if (kind === 'city') {
      artwork = cities.cityImageById[id];
      for (const item of repository.getLifeLocationsByCity(id)) {
        const image = locations.locationBackground(item.id, item.category) ?? scenes.sceneForCategory(item.category);
        if (typeof image === 'number') additional.push(image);
      }
    } else {
      const locationId = kind === 'dialogue' ? repository.getLifeScenarioById(id)?.locationId : id;
      const location = locationId ? repository.getLifeLocationById(locationId) : undefined;
      artwork = locations.locationBackground(location?.id, location?.category) ?? scenes.sceneForCategory(location?.category);
      const npc = scenes.npcForCategory(location?.category);
      if (typeof npc === 'number') additional.push(npc);
    }
  }
  if (path.startsWith('/game/mission/')) {
    const [missions, locations, assets] = await Promise.all([
      import('@/data/missions'), import('@/data/locations'), import('@/data/game-assets'),
    ]);
    const mission = missions.missions.find(item => item.id === path.split('/')[3]);
    const location = locations.gameLocations.find(item => item.id === mission?.locationId);
    artwork = location?.backgroundId ? assets.gameBackgrounds[location.backgroundId] : undefined;
  }
  if (artwork !== undefined) await prepareArtwork(artwork as Parameters<typeof prepareArtwork>[0]);
  await prepareArtwork(additional);
}

let navigationIntent = 0;
export const cancelPreparedNavigation = () => { navigationIntent += 1; };
export function navigateWithPreparedArtwork(path: string, navigate: () => void) {
  const intent = ++navigationIntent;
  void prepareSceneRoute(path).then(() => {
    if (intent === navigationIntent) navigate();
  }).catch(error => console.warn('Destination artwork:', error));
}

type Destination = Parameters<typeof router.push>[0];
function destinationPath(href: Destination) {
  if (typeof href === 'string') return href.split(/[?#]/)[0];
  return href.pathname.replace(/\[([^\]]+)\]/g, (_, key: string) => String(href.params?.[key] ?? key));
}
export const pushPrepared = (href: Destination) => navigateWithPreparedArtwork(destinationPath(href), () => router.push(href));
export const replacePrepared = (href: Destination) => navigateWithPreparedArtwork(destinationPath(href), () => router.replace(href));
