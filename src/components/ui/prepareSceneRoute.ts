import { Dimensions, type ImageSourcePropType } from 'react-native';
import { japanAssets, regionMaps, type RegionMapId } from '@/data/world-map-config';
import { prepareArtwork, isArtworkSource, type ArtworkSource } from './prepareArtwork';
import { ROUTE_ARTWORK } from './route-artwork';
import { COMMON_UI_ARTWORK } from './common-artwork';
import { router } from 'expo-router';
import { matchRoutePattern, previousRoutePath, type NavigationState } from './navigation-path';

type PreparedBackdrop = { source: ImageSourcePropType; blurRadius: number; city?: boolean };
const routeBackdrops = new Map<string, PreparedBackdrop>();
export const preparedRouteBackdrop = (path: string) => routeBackdrops.get(path);

export async function prepareSceneRoute(path: string) {
  path = path.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  const pattern = matchRoutePattern(path, Object.keys(ROUTE_ARTWORK));
  const routeImages = pattern ? ROUTE_ARTWORK[pattern] : [];
  await prepareArtwork([...COMMON_UI_ARTWORK, ...routeImages]);
  const additional: ArtworkSource[] = [];
  const { width, height } = Dimensions.get('window');
  const ratio = height ? width / height : .46;
  const mode = ratio >= 1.1 ? 'landscape' : ratio >= .62 ? 'tablet' : 'phone';
  let blurRadius = /^(?:\/game|\/portal|\/register(?:\/work)?)$/.test(path) ? 0 : 40;
  let cityBackdrop = false;
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
    : path === '/specified-skills' ? require('../../../assets/app/home-cards/tokutei-engine-safety.png')
    : path === '/portal' ? require('../../../assets/app/registration/registration-bg.jpg')
    : path === '/register/work' ? require('../../../assets/app/backgrounds/registration-work.png')
    : path === '/register' ? require('../../../assets/app/backgrounds/registration.png')
    : path.startsWith('/game/work/') ? (path.split('/')[3].startsWith('1-')
      ? require('../../../assets/game/farm/background/vegetable_map_background_v2.png')
      : require('../../../assets/app/life/location-backgrounds/construction-site/01-clear-morning.jpg'))
    : /^\/(?:world|settings|conversation-log|lesson|portal)(?:\/|$)/.test(path)
      ? require('../../../assets/app/backgrounds/profile-details.png')
      : require('../../../assets/app/backgrounds/study-light.png');
  if (/^\/world\/(?:prefecture|city|location|dialogue)\//.test(path)) {
    const [repository, cities, locations, scenes] = await Promise.all([
      import('@/services/life-content-repository'), import('@/components/world/city-images.generated'),
      import('@/components/world/location-backgrounds.generated'), import('@/components/world/life-assets'),
    ]);
    const [, , kind, rawId] = path.split('/');
    const id = decodeURIComponent(rawId);
    if (kind === 'prefecture') {
      blurRadius = 10;
      const city = repository.getLifeCitiesByPrefecture(id)[0];
      artwork = city ? cities.cityImageById[city.id] : undefined;
      for (const item of repository.getLifeCitiesByPrefecture(id)) {
        const image = cities.cityImageById[item.id];
        if (isArtworkSource(image)) additional.push(image);
      }
    } else if (kind === 'city') {
      cityBackdrop = true;
      blurRadius = width > height ? 10 : 6;
      artwork = cities.cityImageById[id];
      for (const item of repository.getLifeLocationsByCity(id)) {
        const image = locations.locationBackground(item.id, item.category) ?? scenes.sceneForCategory(item.category);
        if (isArtworkSource(image)) additional.push(image);
      }
    } else {
      blurRadius = 0;
      const locationId = kind === 'dialogue' ? repository.getLifeScenarioById(id)?.locationId : id;
      const location = locationId ? repository.getLifeLocationById(locationId) : undefined;
      artwork = location ? locations.locationBackground(location.id, location.category) ?? scenes.sceneForCategory(location.category)
        : require('../../../assets/app/backgrounds/profile-details.png');
      if (!location) blurRadius = 40;
      const npc = scenes.npcForCategory(location?.category);
      if (isArtworkSource(npc)) additional.push(npc);
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
  const ownsPreparedFullScreen = /^\/(?:game|home|profile|specified-skills|register(?:\/work)?|portal)$/.test(path)
    || /^\/world\/(?:prefecture|city|location|dialogue)\//.test(path);
  const backdrop = ownsPreparedFullScreen ? artwork
    : /^\/(?:world|settings|conversation-log|lesson|portal)(?:\/|$)/.test(path)
      ? require('../../../assets/app/backgrounds/profile-details.png')
      : require('../../../assets/app/backgrounds/study-light.png');
  if (isArtworkSource(backdrop)) routeBackdrops.set(path, { source: typeof backdrop === 'string' ? { uri: backdrop } : backdrop, blurRadius: ownsPreparedFullScreen ? blurRadius : 40, city: cityBackdrop });
}

let navigationIntent = 0;
let readNavigationState: (() => NavigationState | undefined) | undefined;
export function registerNavigationStateReader(reader: () => NavigationState | undefined) {
  readNavigationState = reader;
  return () => { if (readNavigationState === reader) readNavigationState = undefined; };
}
export const cancelPreparedNavigation = () => { navigationIntent += 1; };
export function navigateWithPreparedArtwork(path: string, navigate: () => void, additional: ArtworkSource[] = [], prepareState?: () => Promise<unknown>) {
  const intent = ++navigationIntent;
  return Promise.all([prepareSceneRoute(path), prepareArtwork(additional), prepareState?.()]).then(() => {
    if (intent !== navigationIntent) return false;
    navigate();
    return true;
  }).catch(error => { console.warn('Destination artwork:', error); return false; });
}

type Destination = Parameters<typeof router.push>[0];
function destinationPath(href: Destination) {
  if (typeof href === 'string') return href.split(/[?#]/)[0];
  return href.pathname.replace(/\[([^\]]+)\]/g, (_, key: string) => String(href.params?.[key] ?? key));
}
export const pushPrepared = (href: Destination, beforeNavigate?: () => void) => navigateWithPreparedArtwork(destinationPath(href), () => { beforeNavigate?.(); router.push(href); });
export const replacePrepared = (href: Destination) => navigateWithPreparedArtwork(destinationPath(href), () => router.replace(href));
export const dismissToPrepared = (href: Destination) => navigateWithPreparedArtwork(destinationPath(href), () => router.dismissTo(href));
export function backPrepared() {
  if (!router.canGoBack()) { cancelPreparedNavigation(); return Promise.resolve(false); }
  const state = readNavigationState?.();
  const path = state ? previousRoutePath(state) : null;
  if (!path) { cancelPreparedNavigation(); router.back(); return Promise.resolve(true); }
  return navigateWithPreparedArtwork(path, () => router.back());
}
