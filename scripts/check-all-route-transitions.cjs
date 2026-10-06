/* global __dirname */
// Execute the real TypeScript helpers with controlled native/cache interfaces.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const parser = require('@babel/parser');
const root = path.resolve(__dirname, '..');
const files = fs.readdirSync(path.join(root, 'src'), { recursive: true }).filter(file => file.endsWith('.tsx')).map(file => 'src/' + file);
const violations = [];
for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const ast = parser.parse(source, { sourceType: 'module', plugins: ['typescript', 'jsx'] });
  for (const node of ast.program.body) {
    if (node.type === 'ImportDeclaration' && ['react-native', 'react-native-safe-area-context'].includes(node.source.value)
      && node.specifiers.some(item => item.imported?.name === 'SafeAreaView')) violations.push(file + ': native SafeAreaView');
  }
  if (/\brouter\.(?:push|replace|back|navigate|dismiss|dismissTo|dismissAll)\s*\(/.test(source)) violations.push(file + ': bypassed prepared navigation');
  if (/animationType=["'](?:slide|fade)["']/.test(source)) violations.push(file + ': animated modal entry');
}
assert.deepEqual(violations, []);

const assets = new Map();
const assetId = name => { if (!assets.has(name)) assets.set(name, assets.size + 1); return assets.get(name); };
const jsx = (type, props, key) => ({ type, props, key });
const flatten = style => Array.isArray(style) ? Object.assign({}, ...style.map(flatten)) : style || {};
let dimensions = { width: 430, height: 932 };
let gate = Promise.resolve();
let prepared = [];
let navigations = [];
let slots = [], hookIndex = 0;
const react = {
  useState: initial => { const index = hookIndex++; if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial; return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }]; },
  useRef: initial => { const index = hookIndex++; return slots[index] ?? (slots[index] = { current: initial }); },
  useMemo: factory => factory(), useEffect: () => {},
};
const mocks = {
  'react': react,
  'react/jsx-runtime': { jsx, jsxs: jsx },
  'react-native': { View: 'View', ScrollView: 'ScrollView', StyleSheet: { create: value => value, flatten, absoluteFill: {} }, Dimensions: { get: () => dimensions } },
  'react-native-safe-area-context': { useSafeAreaInsets: () => ({ top: 59, bottom: 34, left: 0, right: 0 }) },
  'expo-asset': { Asset: { fromModule: () => ({ width: 100, height: 100 }) } },
  'expo-image': { Image: 'DisplayImage' },
  'expo-router': { router: { canGoBack: () => true, push: value => navigations.push(['push', value]), replace: value => navigations.push(['replace', value]), back: () => navigations.push(['back']), dismissTo: value => navigations.push(['dismissTo', value]) } },
  '@/data/world-map-config': { japanAssets: { phone: 900, tablet: 901, landscape: 902 }, regionMaps: {} },
  './prepareArtwork': { isArtworkSource: source => typeof source === 'number' || typeof source === 'string' || !!source?.uri, prepareArtwork: async sources => { prepared.push(sources); await gate; } },
  './common-artwork': { COMMON_UI_ARTWORK: [999] },
  '@/services/life-content-repository': { getLifeCitiesByPrefecture: () => [{ id: 'city' }], getLifeLocationsByCity: () => [{ id: 'place', category: 'station' }], getLifeScenarioById: id => id === 'scenario' ? { locationId: 'place' } : undefined, getLifeLocationById: id => id === 'place' ? { id, category: 'station' } : undefined },
  '@/components/world/city-images.generated': { cityImageById: { city: 801 } },
  '@/components/world/location-backgrounds.generated': { locationBackground: () => 802 },
  '@/components/world/life-assets': { sceneForCategory: () => 803, npcForCategory: () => 804 },
};
const decodedUris = [];
class WebImage { async decode() { decodedUris.push(this.src); } }
const modules = new Map();
function load(relative) {
  const file = path.join(root, relative);
  if (modules.has(file)) return modules.get(file);
  const exports = {};
  modules.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(code, { exports, console, Image: WebImage, require: request => {
    if (mocks[request]) return mocks[request];
    const target = request.startsWith('@/') ? path.join(root, 'src', request.slice(2)) : path.resolve(path.dirname(file), request);
    if (/\.(?:png|jpe?g|gif|webp)$/.test(request)) return assetId(target);
    if (fs.existsSync(target + '.ts')) return load(path.relative(root, target + '.ts'));
    if (fs.existsSync(target + '.tsx')) return load(path.relative(root, target + '.tsx'));
    throw new Error('Missing test dependency: ' + request);
  } }, { filename: file });
  return exports;
}
async function main() {
  const nav = load('src/components/ui/navigation-path.ts');
  const artwork = load('src/components/ui/route-artwork.ts').ROUTE_ARTWORK;
  const routes = fs.readdirSync(path.join(root, 'src/app'), { recursive: true }).filter(file => file.endsWith('.tsx') && !file.endsWith('_layout.tsx'));
  assert.equal(Object.keys(artwork).length, routes.length);
  for (const route of Object.keys(artwork)) {
    const sample = route.replace(/\[level\]/g, 'n5').replace(/\[section\]/g, 'grammar').replace(/\[[^\]]+\]/g, 'fixture');
    assert.equal(nav.matchRoutePattern(sample, Object.keys(artwork)), route);
  }
  assert.equal(nav.matchRoutePattern('/world/cities', Object.keys(artwork)), '/world/cities');
  assert.equal(nav.matchRoutePattern('/portal/education/n5?preview=1', Object.keys(artwork)), '/portal/education/n5');
  assert.equal(nav.previousRoutePath({ index: 1, routes: [{ name: '[level]/vocabulary/[wordId]', params: { level: 'n5', wordId: 'a b' } }, { name: '[level]/[section]', params: { level: 'n5', section: 'grammar' } }] }), '/n5/vocabulary/a%20b');
  assert.equal(nav.previousRoutePath({ routes: [{ name: '(app)', state: { index: 1, routes: [{ name: 'world/cities' }, { name: 'world/city/[cityId]', params: { cityId: 'city' } }] } }], index: 0 }), '/world/cities');
  assert.equal(nav.previousRoutePath({ routes: [{ name: 'home' }], index: 0 }), null);
  const stable = load('src/components/ui/StableSafeAreaView.tsx').default;
  let rendered = stable({ style: { padding: 8, paddingTop: 12 }, edges: ['top', 'bottom'], testID: 'screen' });
  assert.equal(flatten(rendered.props.style).paddingTop, 71); assert.equal(flatten(rendered.props.style).paddingBottom, 42); assert.equal(rendered.props.testID, 'screen');
  rendered = stable({ style: { paddingBottom: 40 }, edges: { bottom: 'maximum' } }); assert.equal(flatten(rendered.props.style).paddingBottom, 40);
  rendered = stable({ style: { marginTop: 10 }, mode: 'margin', edges: ['top'] }); assert.equal(flatten(rendered.props.style).marginTop, 69);
  const scene = load('src/components/ui/HomeTokuteiBackdrop.tsx').default;
  const render = (key, source, blurRadius = 40) => { hookIndex = 0; return scene({ target: { key, source, blurRadius } }).props.children; };
  assert.equal(render('home', 1).length, 1);
  const old = render('city', 2, 6); assert.deepEqual(Array.from(old, item => item.key), ['home', 'city']);
  const latest = render('dialogue', 3, 0); old[1].props.onDisplay(); assert.equal(slots[0].key, 'home');
  latest[1].props.onDisplay(); assert.equal(render('dialogue', 3, 0).length, 1); assert.equal(slots[0].source, 3);
  const helper = load('src/components/ui/prepareSceneRoute.ts');
  let release;
  gate = new Promise(resolve => { release = resolve; });
  const first = helper.pushPrepared('/home'), second = helper.pushPrepared('/learn');
  assert.equal(navigations.length, 0); release(); await Promise.all([first, second]); assert.deepEqual(navigations, [['push', '/learn']]);
  gate = new Promise(resolve => { release = resolve; });
  const obsolete = helper.replacePrepared('/home'); helper.cancelPreparedNavigation(); release(); assert.equal(await obsolete, false);
  navigations = []; gate = Promise.resolve();
  helper.registerNavigationStateReader(() => ({ index: 1, routes: [{ name: 'world/city/[cityId]', params: { cityId: 'city' } }, { name: 'world/location/[locationId]', params: { locationId: 'place' } }] }));
  await helper.backPrepared(); assert.deepEqual(navigations, [['back']]);
  assert.equal(helper.preparedRouteBackdrop('/world/city/city').source, 801); assert.equal(helper.preparedRouteBackdrop('/world/city/city').blurRadius, 6);
  await helper.prepareSceneRoute('/world/prefecture/prefecture'); assert.equal(helper.preparedRouteBackdrop('/world/prefecture/prefecture').source, 801);
  await helper.prepareSceneRoute('/world/dialogue/scenario'); assert.equal(helper.preparedRouteBackdrop('/world/dialogue/scenario').source, 802); assert.equal(helper.preparedRouteBackdrop('/world/dialogue/scenario').blurRadius, 0);
  await helper.prepareSceneRoute('/game'); assert.equal(helper.preparedRouteBackdrop('/game').blurRadius, 0);
  await helper.prepareSceneRoute('/world'); assert.notEqual(helper.preparedRouteBackdrop('/world').source, 900, 'Map canvas must retain its dark root backdrop');
  await helper.prepareSceneRoute('/portal/education/n5'); assert.equal(helper.preparedRouteBackdrop('/portal/education/n5').blurRadius, 40);
  dimensions = { width: 1024, height: 768 }; await helper.prepareSceneRoute('/world/city/city'); assert.equal(helper.preparedRouteBackdrop('/world/city/city').blurRadius, 10);
  let stateReady = false; gate = new Promise(resolve => { release = resolve; });
  const stateChange = helper.navigateWithPreparedArtwork('/n5/test', () => { assert.equal(stateReady, true); }, [], async () => { await gate; stateReady = true; }); release(); assert.equal(await stateChange, true);
  const webSource = { uri: '/assets/city.jpg', width: 1024, height: 768 };
  mocks['@/components/world/city-images.generated'].cityImageById.web = webSource;
  await helper.prepareSceneRoute('/world/city/web');
  assert.equal(helper.preparedRouteBackdrop('/world/city/web').source.uri, webSource.uri);
  assert.ok(prepared.some(items => Array.isArray(items) ? items.includes(webSource) : items === webSource));
  assert.ok(prepared.length > 0);
  // Prepared session renders the correct start/resume view on the first
  // controller render; continuation retains its answers, scroll and audio.
  let savedSession;
  mocks['expo-audio'] = { useAudioPlayer: () => ({ pause() {} }), useAudioPlayerStatus: () => ({ isLoaded: false }) };
  mocks['./JlptStudyBackground'] = { default: 'StudyBackground' };
  mocks['@/components/jlpt/ui/JlptExamUI'] = new Proxy({}, { get: (_, name) => String(name) });
  mocks['@/services/jlpt-listening-start-storage'] = { getJlptListeningStart: () => 0 };
  mocks['@/services/jlpt-trial-session-storage'] = { loadJlptTrialSession: async () => null, saveJlptTrialSession: async (_, value) => { savedSession = value; } };
  mocks['@/services/jlpt-exam-attempt-history'] = {};
  const trial = load('src/components/jlpt/N1OfficialTrial.tsx').default;
  const exam = { id: 'fixture', level: 'N5', title: 'Fixture', periodLabel: '第1回', startLabel: '試験を始める', storageKey: 'fixture', audioSource: 1, visualOptions: {}, questions: [{ id: 'q1', family: 'vocabulary', questionNumber: 1, problemNumber: 1 }] };
  const props = { exam, onExit() {}, registerExit() {} };
  slots = []; hookIndex = 0;
  assert.equal(trial({ ...props, initialSession: null }).type, 'View', 'New exam must not show the lookup-only header');
  const session = { version: 4, started: true, submitted: false, status: 'in_progress', mode: 'exam', answers: { q1: '2' }, currentQuestion: 'q1', scrollY: 123, listeningPositionMs: 5000, playedAudioSegments: [], updatedAt: '2026-10-06T00:00:00Z' };
  slots = []; hookIndex = 0;
  const prompt = trial({ ...props, initialSession: session }); assert.equal(prompt.type, 'JlptResumePrompt');
  prompt.props.onContinue(); assert.equal(savedSession.answers.q1, '2'); assert.equal(savedSession.scrollY, 123); assert.equal(savedSession.listeningPositionMs, 5000);
  slots = []; hookIndex = 0;
  assert.equal(trial({ ...props }).type, 'StudyBackground', 'Direct legacy consumers retain the async lookup guard');
  mocks['react-native'].Platform = { OS: 'web' };
  mocks['react-native'].Image = {};
  mocks['expo-asset'].Asset.fromModule = source => ({ uri: typeof source === 'object' ? source.uri : '/assets/' + source + '.png', downloadAsync: async () => {} });
  const actualPreparation = load('src/components/ui/prepareArtwork.ts');
  await actualPreparation.prepareArtwork([42, webSource]);
  await actualPreparation.prepareArtwork([42, { ...webSource }]);
  assert.deepEqual(decodedUris, ['/assets/42.png', webSource.uri], 'URI modules and native IDs decode once before navigation');
  assert.equal(actualPreparation.isArtworkSource(webSource), true);
  assert.equal(actualPreparation.isArtworkSource(null), false);
  console.log(`ALL ROUTE TRANSITION CONTRACT PASS: ${routes.length} route templates; ${files.length} TSX files audited; safe-area, history, cancellation, bitmap handoff, dynamic scenes and state preparation.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
