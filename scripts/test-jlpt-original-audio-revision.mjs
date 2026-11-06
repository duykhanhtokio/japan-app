import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInThisContext } from 'node:vm';
import path from 'node:path';

const require = createRequire(process.env.JLPT_QA_DEPENDENCY_ROOT
  ? path.join(process.env.JLPT_QA_DEPENDENCY_ROOT, 'package.json') : import.meta.url);
const ts = require('typescript');
const source = new URL('../src/services/jlpt-original-audio-revision.ts', import.meta.url);
const compiled = ts.transpileModule(readFileSync(source, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const mod = { exports: {} };
runInThisContext(`(function(module,exports){${compiled}\n})`, { filename: source.pathname })(mod, mod.exports);
const { createOriginalAudioRevisionMigrator, remapOriginalListeningPosition, validateOriginalAudioRevision, originalAudioRevisionKey } = mod.exports;

function compiledModule(relativePath, injectedRequire) {
  const file = new URL('../' + relativePath, import.meta.url);
  const output = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const result = { exports: {} };
  runInThisContext(`(function(module,exports,require){${output}\n})`, { filename: file.pathname })(result, result.exports, injectedRequire);
  return result.exports;
}

const { createOriginalAudioRoutePreparation } = compiledModule('src/services/jlpt-original-audio-preparation.ts', name => {
  assert.equal(name, './jlpt-original-audio-revision');
  return mod.exports;
});

const revision = {
  examId: 'jpapp-n5-original-01-v1', level: 'N5', sessionKey: 'jlpt:jpapp:n5:original:01:v2',
  fromAudioSha256: 'a'.repeat(64), toAudioSha256: 'b'.repeat(64),
  // The middle 60000 ms represent unchanged music; the final 12000 ms
  // represent an unchanged answer window after a newly paced passage.
  anchors: [[0, 0], [20000, 17000], [80000, 77000], [100000, 95000], [112000, 107000]],
};
const session = {
  version: 4, answers: { q1: '2', q2: '1' }, mode: 'exam', status: 'in_progress',
  started: true, submitted: false, currentQuestion: 'q2', scrollY: 80,
  playedAudioSegments: ['__full_listening_track__'], listeningPositionMs: 50000,
  submittedAt: null, result: null, updatedAt: '2026-11-01T01:02:03Z', custom: { keep: true },
};

const installedHashes = Object.fromEntries(['n1', 'n2', 'n3', 'n4', 'n5'].flatMap(level =>
  Array.from({ length: 6 }, (_, number) => [`jpapp-${level}-original-0${number + 1}-v1`, 'b'.repeat(64)])));

function storage(initial = session) {
  const data = new Map(initial === null ? [] : [[revision.sessionKey, JSON.stringify(initial)]]);
  const reads = [], writes = [];
  let failMarker = false;
  return {
    data, reads, writes,
    failNextMarker: () => { failMarker = true; },
    getItem: async key => { reads.push(key); return data.get(key) ?? null; },
    setItem: async (key, value) => {
      writes.push(key);
      if (failMarker && key === originalAudioRevisionKey(revision.sessionKey)) {
        failMarker = false;
        throw new Error('simulated marker write failure');
      }
      data.set(key, value);
    },
  };
}

test('timeline keeps music and answer elapsed time, exact boundaries and end', () => {
  validateOriginalAudioRevision(revision);
  const map = value => remapOriginalListeningPosition(value, revision.anchors);
  assert.equal(map(0), 0);
  assert.equal(map(-1), 0);
  assert.equal(map(10000), 8500);
  assert.equal(map(20000), 17000);
  assert.equal(map(50000) - map(20000), 30000);
  assert.equal(map(80000) - map(20000), 60000);
  assert.equal(map(106000) - map(100000), 6000);
  assert.equal(map(112000), 107000);
  assert.equal(map(999999), 107000);
  assert.throws(() => map(NaN));
});

test('rejects a historical key, a mismatched exam, duplicate or reversed anchors', () => {
  for (const changed of [
    { sessionKey: 'jlpt:n1:2012:07' }, { sessionKey: 'jlpt:jpapp:n5:original:02:v2' },
    { anchors: [[0, 0], [10, 10], [10, 20]] },
    { anchors: [[0, 0], [10, 20], [20, 10]] }, { anchors: [[1, 0], [20, 20]] },
  ]) assert.throws(() => validateOriginalAudioRevision({ ...revision, ...changed }));
});

test('construction performs no storage or content loading; an unrelated level is untouched', async () => {
  const store = storage();
  const prepare = createOriginalAudioRevisionMigrator(store, [revision]);
  assert.equal(store.reads.length, 0);
  await prepare('N1');
  assert.equal(store.reads.length, 0);
  assert.equal(store.writes.length, 0);
});

test('changes only position and recovery metadata, preserving all answers and progress', async () => {
  const store = storage();
  const historicalKey = 'jlpt:n1:2012:07';
  store.data.set(historicalKey, 'historical data must stay byte-identical');
  await createOriginalAudioRevisionMigrator(store, [revision])('N5');
  assert.deepEqual(JSON.parse(store.data.get(revision.sessionKey)), {
    ...session, listeningPositionMs: 47000, __originalAudioSha256: revision.toAudioSha256,
  });
  assert.equal(store.data.get(historicalKey), 'historical data must stay byte-identical');
  assert.ok(!store.reads.includes(historicalKey) && !store.writes.includes(historicalKey));
});

test('submitted and reviewing attempts remain byte-identical', async () => {
  for (const overrides of [{ submitted: true }, { status: 'submitted' }, { status: 'reviewing' }]) {
    const store = storage({ ...session, ...overrides, result: { correct: 1, total: 2 } });
    const before = store.data.get(revision.sessionKey);
    await createOriginalAudioRevisionMigrator(store, [revision])('N5');
    assert.equal(store.data.get(revision.sessionKey), before);
    assert.ok(!store.writes.includes(revision.sessionKey));
  }
});

test('fresh, zero-position and incompatible sessions are not rewritten', async () => {
  for (const value of [null, { ...session, listeningPositionMs: 0 }, { ...session, version: '4' }, { ...session, answers: [] }]) {
    const store = storage(value);
    const before = store.data.get(revision.sessionKey);
    await createOriginalAudioRevisionMigrator(store, [revision])('N5');
    assert.equal(store.data.get(revision.sessionKey), before);
    assert.ok(!store.writes.includes(revision.sessionKey));
  }
});

test('parallel requests share one migration and subsequent opens do not map again', async () => {
  const store = storage();
  const prepare = createOriginalAudioRevisionMigrator(store, [revision]);
  await Promise.all([prepare('N5'), prepare('N5'), prepare('N5')]);
  assert.equal(store.reads.length, 2);
  assert.equal(store.writes.length, 2);
  await prepare('N5');
  assert.equal(store.reads.length, 2);
  // Simulate app restart, where the in-memory cache no longer exists.
  await createOriginalAudioRevisionMigrator(store, [revision])('N5');
  assert.equal(JSON.parse(store.data.get(revision.sessionKey)).listeningPositionMs, 47000);
  assert.equal(store.writes.length, 2);
});

test('marker failure recovers without mapping the already changed session twice', async () => {
  const store = storage();
  const prepare = createOriginalAudioRevisionMigrator(store, [revision]);
  store.failNextMarker();
  await assert.rejects(prepare('N5'), /simulated/);
  assert.equal(JSON.parse(store.data.get(revision.sessionKey)).listeningPositionMs, 47000);
  await prepare('N5');
  assert.equal(JSON.parse(store.data.get(revision.sessionKey)).listeningPositionMs, 47000);
  assert.equal(store.writes.filter(key => key === revision.sessionKey).length, 1);
  assert.equal(store.data.get(originalAudioRevisionKey(revision.sessionKey)), revision.toAudioSha256);
});

test('an unknown audio revision fails safely without rewriting the saved attempt', async () => {
  const store = storage();
  store.data.set(originalAudioRevisionKey(revision.sessionKey), 'c'.repeat(64));
  const before = store.data.get(revision.sessionKey);
  await assert.rejects(createOriginalAudioRevisionMigrator(store, [revision])('N5'), /Unknown/);
  assert.equal(store.data.get(revision.sessionKey), before);
  assert.equal(store.writes.length, 0);
});

test('missing/inactive activation and non-JLPT routes load no indexes or storage', async () => {
  for (const activation of [undefined, { installedCompleteSet: false }]) {
    const prepare = createOriginalAudioRoutePreparation({
      activation, storage: () => assert.fail('No baseline storage access'),
      loadLevel: () => assert.fail('No baseline index loading'),
    });
    await prepare('/N5/test');
    await prepare('/home');
  }
});

test('complete-set route gate validates all six level revisions before session loading', async () => {
  const store = storage();
  const calls = [];
  const forms = Array.from({ length: 6 }, (_, index) => ({
    ...revision,
    examId: `jpapp-n5-original-0${index + 1}-v1`,
    sessionKey: `jlpt:jpapp:n5:original:0${index + 1}:v2`,
  }));
  const prepare = createOriginalAudioRoutePreparation({
    activation: { schemaVersion: 1, installedCompleteSet: true, forms: 30,
      levels: ['N5', 'N4', 'N3', 'N2', 'N1'], profileSha256: 'd'.repeat(64), installedAudioSha256ByExamId: installedHashes },
    storage: () => { calls.push('storage'); return store; },
    loadLevel: level => { calls.push(level); return { schemaVersion: 1, level,
      profileSha256: 'd'.repeat(64), forms }; },
  });
  await prepare('/home');
  assert.equal(calls.length, 0);
  await prepare('/N5/test?entry=deep-link-catalog');
  assert.equal(JSON.parse(store.data.get(revision.sessionKey)).listeningPositionMs, 47000);
  await prepare('/N5/test/');
  assert.deepEqual(calls, ['N5', 'storage']);
});

test('partial activation or level index fails before touching session storage', async () => {
  const activation = { schemaVersion: 1, installedCompleteSet: true, forms: 30,
    levels: ['N1', 'N2', 'N3', 'N4', 'N5'], profileSha256: 'd'.repeat(64), installedAudioSha256ByExamId: installedHashes };
  for (const override of [{ forms: 24 }, { levels: ['N5'] }, { profileSha256: '' }, { installedAudioSha256ByExamId: {} }]) {
    const prepare = createOriginalAudioRoutePreparation({
      activation: { ...activation, ...override },
      storage: () => assert.fail('Invalid activation must not access storage'),
      loadLevel: () => assert.fail('Invalid activation must not load indexes'),
    });
    await assert.rejects(prepare('/N5/test'), /Incomplete/);
  }
  const prepare = createOriginalAudioRoutePreparation({
    activation, storage: () => assert.fail('Partial index must not access storage'),
    loadLevel: level => ({ schemaVersion: 1, level, profileSha256: activation.profileSha256, forms: [revision] }),
  });
  await assert.rejects(prepare('/N5/test'), /Incomplete/);
  const wrongTarget = createOriginalAudioRoutePreparation({
    activation, storage: () => assert.fail('Wrong audio target must not access storage'),
    loadLevel: level => ({ schemaVersion: 1, level, profileSha256: activation.profileSha256,
      forms: Array.from({ length: 6 }, (_, offset) => ({ ...revision,
        examId: `jpapp-n5-original-0${offset + 1}-v1`, sessionKey: `jlpt:jpapp:n5:original:0${offset + 1}:v2`,
        toAudioSha256: 'c'.repeat(64) })) }),
  });
  await assert.rejects(wrongTarget('/N5/test'), /Incomplete/);
});

function preparedNavigation(prepareAudio) {
  const dependencies = name => {
    if (name === 'react-native') return { Dimensions: { get: () => ({ width: 430, height: 932 }) } };
    if (name === '@/services/jlpt-original-audio-preparation') return { prepareOriginalJlptAudioForRoute: prepareAudio };
    if (name === '@/data/world-map-config') return { japanAssets: {}, regionMaps: {} };
    if (name === './prepareArtwork') return { prepareArtwork: async () => {}, isArtworkSource: () => false };
    if (name === './common-artwork') return { COMMON_UI_ARTWORK: [] };
    if (name === './home-artwork') return { HOME_ARTWORK: [] };
    if (name === './tokutei-artwork') return { TOKUTEI_ARTWORK: [] };
    if (name === 'expo-router') return { router: {} };
    if (name === './navigation-path') return {};
    if (name.endsWith('.png')) return 1;
    assert.fail('Unexpected navigation dependency: ' + name);
  };
  return compiledModule('src/components/ui/prepareSceneRoute.ts', dependencies).navigateWithPreparedArtwork;
}

test('actual prepared navigation awaits audio migration before reading saved session', async () => {
  const order = [];
  let finish;
  const gate = new Promise(resolve => { finish = resolve; });
  const navigate = preparedNavigation(async path => { order.push(path); await gate; order.push('migrated'); });
  const pending = navigate('/N5/test', () => order.push('opened'), [], async () => order.push('session-read'));
  await Promise.resolve();
  assert.deepEqual(order, ['/N5/test']);
  finish();
  assert.equal(await pending, true);
  assert.deepEqual(order, ['/N5/test', 'migrated', 'session-read', 'opened']);
});

test('actual navigation skips unrelated routes and blocks session reads on migration failure', async () => {
  let calls = 0;
  const navigate = preparedNavigation(async () => { calls += 1; throw new Error('migration failed'); });
  assert.equal(await navigate('/profile', () => {}, [], async () => {}), true);
  assert.equal(calls, 0);
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    assert.equal(await navigate('/N5/test', () => assert.fail('must not open'), [],
      async () => assert.fail('must not read stale session')), false);
    assert.equal(calls, 1);
  } finally { console.warn = originalWarn; }
});

test('cold catalog selection uses the guarded navigation before passing the saved session to the runner', async () => {
  const order = [];
  let selection;
  let navigation;
  let states = 0;
  const saved = { ...session, listeningPositionMs: 47000 };
  const navigate = preparedNavigation(async () => { order.push('migrated'); });
  const element = (type, props) => ({ type, props });
  const fakeExam = { id: revision.examId, level: 'N5', storageKey: revision.sessionKey, questions: [], visualOptions: {} };
  const dependencies = name => {
    if (name === 'react/jsx-runtime') return { jsx: element, jsxs: element };
    if (name === 'react') return {
      useState: initial => { const index = states++; return [initial, value => { if (index === 0) { selection = value; order.push('selected'); } }]; },
      useMemo: callback => callback(), useEffect: () => {}, useRef: value => ({ current: value }),
    };
    if (name === 'react-native') return { Pressable: 'Pressable', ScrollView: 'ScrollView', Text: 'Text', View: 'View',
      StyleSheet: { create: value => value }, BackHandler: {} };
    if (name === 'expo-router') return { useNavigation: () => ({}) };
    if (name === '@/components/ui/StableSafeAreaView') return { default: 'SafeArea' };
    if (name === '@/components/ui/RoyalPanels') return { RoyalContentPanel: 'RoyalPanel' };
    if (name === './JlptStudyBackground') return { default: 'Background' };
    if (name === '@/components/ui/prepareArtwork') return { isArtworkSource: () => false };
    if (name === '@/components/ui/prepareSceneRoute') return { navigateWithPreparedArtwork: (...args) => { navigation = navigate(...args); return navigation; } };
    if (name === '@/services/jlpt-trial-session-storage') return { loadJlptTrialSession: async key => {
      assert.equal(key, revision.sessionKey); order.push('session-read'); return saved;
    } };
    if (name === '@/components/jlpt/N1OfficialTrial') return { default: 'Runner' };
    if (name === '@/components/jlpt/ui/JlptExamUI') return { JlptExamHeader: 'Header', JlptPaper: 'Paper' };
    if (name === '@/data/jlpt-official/approved-n1-exams') return { APPROVED_N1_EXAMS: [fakeExam] };
    if (name === '@/theme/jlpt-exam-design-system') return { JLPT_EXAM: { font: {}, type: {}, color: {} } };
    if (name === '@/services/jlpt-exam-attempt-history') return {};
    assert.fail('Unexpected catalog dependency: ' + name);
  };
  const Catalog = compiledModule('src/components/jlpt/ApprovedJlptExamCatalog.tsx', dependencies).default;
  const tree = Catalog({ level: 'N5', onBack: () => {} });
  const flatten = node => Array.isArray(node) ? node.flatMap(flatten)
    : node && typeof node === 'object' ? [node, ...flatten(node.props?.children)] : [];
  const elements = flatten(tree);
  assert.equal(elements.filter(node => node.type === 'Runner').length, 0, 'Cold catalog does not open a stale saved attempt automatically');
  const button = elements.find(node => node.type === 'Pressable');
  assert.ok(button);
  button.props.onPress();
  assert.equal(await navigation, true);
  assert.deepEqual(order, ['migrated', 'session-read', 'selected']);
  assert.equal(selection.session, saved);
});

test('the actual cold test route opens the catalog, even with an exam-looking deep-link parameter', () => {
  const element = (type, props) => ({ type, props });
  const dependencies = name => {
    if (name === 'react/jsx-runtime') return { jsx: element, jsxs: element };
    if (name === 'react') return { useState: initial => [initial, () => {}], useMemo: callback => callback(), useEffect: () => {} };
    if (name === '@/context/LanguageContext') return { useAppLanguage: () => ({ language: 'en' }) };
    if (name === '@/i18n/ui-text') return {};
    if (name === '@/components/jlpt/GrammarCatalog') return { default: 'Grammar' };
    if (name === '@/components/ui/prepareSceneRoute') return {};
    if (name === '@/components/ui/StableSafeAreaView') return { default: 'SafeArea' };
    if (name === '@/components/jlpt/JlptStudyBackground') return { default: 'Background' };
    if (name === 'expo-router') return { router: {}, useLocalSearchParams: () => ({ level: 'N5', section: 'test', exam: revision.examId }) };
    if (name === 'react-native') return { View: 'View', StyleSheet: { create: value => value } };
    if (name === 'expo-speech') return {};
    if (name === '@/data/jlpt-study-data') return { generatedGrammar: [], isJlptLevel: level => /^N[1-5]$/.test(level) };
    if (name === '@/services/jlpt-progress-storage') return {};
    if (name === '@/components/ui/RoyalSurface') return { ROYAL_LAYOUT: {}, ROYAL_FONT: {} };
    if (name === '@/components/jlpt/ApprovedJlptExamCatalog') return { default: 'Catalog' };
    assert.fail('Unexpected cold route dependency: ' + name);
  };
  const Route = compiledModule('src/app/[level]/[section].tsx', dependencies).default;
  const tree = Route();
  assert.equal(tree.props.children.type, 'Catalog');
  assert.equal(tree.props.children.props.level, 'N5');
  assert.equal(tree.props.children.props.initialSession, undefined);
});
