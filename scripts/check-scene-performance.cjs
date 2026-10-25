/* global __dirname */
// Exercise real preparation code; native I/O is controlled, never timed over a network.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const modules = new Map(), ids = new Map(), calls = [], imports = [];
let gate = Promise.resolve(), navigations = [], downloads = 0, decodes = 0, failDecode = false;
let imageSize = 10;
const platform = { OS: 'web' };
class WebImage {
  constructor() { this.naturalWidth = imageSize; this.naturalHeight = imageSize; }
  async decode() { decodes++; if (failDecode) { failDecode = false; throw Error('decode failed'); } }
}
const mocks = {
  './RoyalPaperPanel': { OPEN_FRAME_SLICES: [10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008] },
  'react-native': { Platform: platform, Dimensions: { get: () => ({ width: 430, height: 932 }) },
    Image: { prefetch: async () => true } },
  'expo-image': { Image: { prefetch: async () => true } },
  'expo-asset': { Asset: { fromModule: source => ({ uri: typeof source === 'object' ? source.uri : `/image-${source}`, name: String(source), downloadAsync: async () => { downloads++; } }) } },
  'expo-router': { router: { canGoBack: () => true, push: path => navigations.push(path) } },
  '@/data/world-map-config': { japanAssets: { phone: 900 }, regionMaps: {} },
  '@/services/life-content-repository': {
    getLifeCitiesByPrefecture: () => [{ id: 'city' }, { id: 'unusedCity' }],
    getLifeLocationsByCity: () => { throw Error('Must not enumerate neighbouring location backgrounds'); },
    getLifeScenarioById: () => ({ locationId: 'place' }),
    getLifeLocationById: () => ({ id: 'place', category: 'station' }),
  },
  '@/components/world/city-images.generated': { cityImageById: { city: 801, unusedCity: 899 } },
  '@/components/world/location-backgrounds.generated': { locationBackground: () => 802 },
  '@/components/world/life-assets': { sceneForCategory: () => 803, npcForCategory: () => 804 },
};
function load(file, overrides = {}) {
  file = path.resolve(root, file);
  if (modules.has(file)) return modules.get(file);
  const exports = {}; modules.set(file, exports);
  let source = read(path.relative(root, file));
  if (file.endsWith('prepareArtwork.ts')) source += '\nexport const cacheStatsForTest = () => ({count: decodedWeb.size, pixels: decodedPixels});';
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(code, { exports, console, Image: WebImage, setTimeout, clearTimeout, require: request => {
    imports.push(request);
    if (request in overrides) return overrides[request];
    if (request in mocks) return mocks[request];
    if (/\.(?:png|jpe?g|mp3)$/.test(request)) {
      if (!ids.has(request)) ids.set(request, ids.size + 1);
      return ids.get(request);
    }
    const base = request.startsWith('@/') ? path.join(root, 'src', request.slice(2)) : path.resolve(path.dirname(file), request);
    return load(fs.existsSync(base + '.ts') ? base + '.ts' : base + '.tsx', overrides);
  } }, { filename: file });
  return exports;
}
(async () => {
  const actual = load('src/components/ui/prepareArtwork.ts');
  await Promise.all([actual.prepareArtwork(42), actual.prepareArtwork(42)]);
  assert.equal(decodes, 1, 'concurrent preparation shares one decode');
  assert.equal(downloads, 0, 'web must not run Asset.downloadAsync before a second image decode');
  await actual.prepareArtwork(Array.from({ length: 35 }, (_, i) => i + 100));
  assert(actual.cacheStatsForTest().count <= 24, 'decoded image references are bounded');
  let before = decodes;
  await actual.prepareArtwork(42);
  assert.equal(decodes, before + 1, 'evicted artwork can be prepared again');
  imageSize = 6000;
  await actual.prepareArtwork(500);
  assert(actual.cacheStatsForTest().pixels <= 12000000, 'oversized images cannot escape pixel budget');
  imageSize = 10;
  failDecode = true;
  await assert.rejects(actual.prepareArtwork(600));
  await actual.prepareArtwork(600);
  platform.OS = 'ios';
  await actual.prepareArtwork(700);
  assert.equal(downloads, 1, 'native retains its asset/cache preparation');
  const preparation = { isArtworkSource: actual.isArtworkSource,
    prepareArtwork: async sources => { calls.push(Array.isArray(sources) ? sources : [sources]); await gate; } };
  const helper = load('src/components/ui/prepareSceneRoute.ts', { './prepareArtwork': preparation });
  let release;
  gate = new Promise(resolve => { release = resolve; });
  const home = helper.prepareSceneRoute('/home');
  assert(helper.preparedRouteBackdrop('/home'), 'target backdrop is published before waiting for decode');
  const homeCount = new Set(calls.at(-1)).size;
  assert.equal(homeCount, 22, 'Home decodes only its displayed artwork');
  release(); await home;
  gate = Promise.resolve(); calls.length = 0; imports.length = 0;
  await helper.prepareSceneRoute('/world/city/city');
  assert.equal(calls.length, 1, 'destination image and controls prepare in parallel');
  assert(calls[0].includes(801));
  assert(!imports.includes('@/components/world/location-backgrounds.generated'), 'city does not initialize location art catalog');
  calls.length = 0;
  await helper.prepareSceneRoute('/world/prefecture/prefecture');
  assert(!calls[0].includes(899), 'neighbouring city images do not delay navigation');
  calls.length = 0;
  await helper.prepareSceneRoute('/world/dialogue/scenario');
  assert(calls[0].includes(802) && calls[0].includes(804), 'dialogue prepares its own background and NPC');
  navigations = []; gate = new Promise(resolve => { release = resolve; });
  const first = helper.pushPrepared('/home'), second = helper.pushPrepared('/learn');
  release(); await Promise.all([first, second]);
  assert.deepEqual(navigations, ['/learn'], 'latest navigation wins; no double transition');
  let musicPath = '/home', musicLoads = 0, musicPlays = 0;
  const musicPrefs = { ready: true, active: true, preferences: { music: true } };
  const music = load('src/components/audio/OnboardingMusic.tsx', {
    '@/components/effects/EffectsProvider': { useEffects: () => musicPrefs },
    '@/config/development-features': { DEVELOPMENT_FEATURES: { skipRegistration: true } },
    'expo-router': { usePathname: () => musicPath },
    'expo-audio': { setAudioModeAsync: async () => {}, useAudioPlayer: () => {
      musicLoads++;
      return { pause() {}, play() { musicPlays++; } };
    } },
    react: { useEffect: callback => callback(), useState: value => [value, () => {}] },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }) },
  });
  assert.equal(music.OnboardingMusic(), null);
  musicPath = '/'; assert.equal(music.OnboardingMusic(), null, 'dev redirect must not allocate welcome audio');
  musicPath = '/world/dialogue/scenario'; assert.equal(music.OnboardingMusic(), null);
  assert.equal(musicLoads, 0);
  musicPath = '/portal';
  const welcomePlayer = music.OnboardingMusic();
  welcomePlayer.type(); await new Promise(setImmediate);
  assert.equal(musicLoads, 1); assert.equal(musicPlays, 1);
  musicPrefs.active = false; assert.equal(music.OnboardingMusic(), null);
  musicPrefs.active = true; musicPrefs.preferences.music = false; assert.equal(music.OnboardingMusic(), null);
  const layout = read('src/app/_layout.tsx');
  assert(!layout.includes('Animated.') && !layout.includes('MotionStack'));
  assert(layout.includes("animation: 'none'"));
  for (const file of ['src/app/home.tsx', 'src/components/world/ResponsiveWorldMap.tsx', 'src/components/ui/RoyalSurface.tsx']) {
    assert(!read(file).includes('SceneLighting') && !read(file).includes('LanternGlow'), 'ambient loops must be unmounted');
  }
  console.log(`SCENE PERFORMANCE PASS: Home ${homeCount} unique images; early backdrop, parallel decode, no neighbour loading, cache limits/retry, native preparation, navigation cancellation, no root fades/ambient loops.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
