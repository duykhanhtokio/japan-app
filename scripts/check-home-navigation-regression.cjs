const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');

const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const metadata = JSON.parse(read('src/data/jlpt-qualification-metadata.json'));
const registry = read('src/data/jlpt-official/approved-n1-exams.ts');
const entries = [...registry.matchAll(/id:\s*'([^']+)'\s*,\s*level:\s*'(N[1-5])'[\s\S]*?storageKey:\s*([^,\n]+)/g)];
// Optional connector-fetched key declarations for a sparse checkout. A full
// developer clone always validates against the actual imported modules.
const cacheFile = process.argv.find(arg => arg.startsWith('--session-key-cache='))?.split('=').slice(1).join('=');
const keyCache = cacheFile ? new Map(JSON.parse(fs.readFileSync(cacheFile, 'utf8')).map(x => [x.symbol, x.key])) : new Map();
assert.equal(metadata.length, entries.length, 'Regenerate qualification metadata when registry entries change');
assert.equal(new Set(metadata.map(x => x.id)).size, metadata.length);
for (let i = 0; i < entries.length; i++) {
  const [, id, level, key] = entries[i];
  assert.deepEqual(Object.keys(metadata[i]).sort(), ['id', 'level', 'storageKey']);
  assert.equal(metadata[i].id, id);
  assert.equal(metadata[i].level, level);
  let storageKey;
  if (key.startsWith("'")) storageKey = key.slice(1, -1);
  else {
    const imported = [...registry.matchAll(/import\s*\{([^}]+)\}\s*from\s*'([^']+)'/g)]
      .find(match => match[1].split(',').some(symbol => symbol.trim() === key));
    assert(imported, `Missing imported key ${key}`);
    const file = path.join(root, imported[2].replace('@/', 'src/') + '.ts');
    if (fs.existsSync(file)) {
      const match = fs.readFileSync(file, 'utf8').match(new RegExp(`export const ${key}\\s*=\\s*'([^']+)'`));
      assert(match, `Missing literal session key ${key}`);
      storageKey = match[1];
    } else {
      assert(keyCache.has(key), `Missing source for ${key}; full clone or connector key cache required`);
      storageKey = keyCache.get(key);
    }
  }
  assert.equal(metadata[i].storageKey, storageKey, `Preserve saved key for ${id}`);
}

const routeSource = stripTypeScriptTypes(read('src/components/ui/prepareSceneRoute.ts'));
const navigationCode = routeSource.slice(routeSource.indexOf('let navigationIntent'), routeSource.indexOf('function destinationPath'))
  .replace(/export /g, '');
async function checkNavigation(mode, options = {}) {
  const timers = new Map(), navigations = [];
  let resolveArt, rejectArt, resolveState, rejectState;
  const art = new Promise((resolve, reject) => { resolveArt = resolve; rejectArt = reject; });
  const state = new Promise((resolve, reject) => { resolveState = resolve; rejectState = reject; });
  const context = {
    console: { warn() {} }, prepareSceneRoute: () => art, prepareArtwork: () => art,
    setTimeout: (fn, ms) => { assert.equal(ms, 2500); timers.set(fn, ms); return fn; },
    clearTimeout: fn => timers.delete(fn),
  };
  vm.createContext(context);
  vm.runInContext(navigationCode + '\nglobalThis.go = navigateWithPreparedArtwork; globalThis.cancel = cancelPreparedNavigation;', context);
  const result = context.go('/learn', () => navigations.push('/learn'), [], () => state);
  if (mode === 'success') resolveArt();
  if (mode === 'error') rejectArt(new Error('native cache failed'));
  if (mode === 'timeout') for (const fn of [...timers.keys()]) fn();
  await new Promise(setImmediate);
  assert.equal(navigations.length, 0, 'Never bypass required state preparation');
  if (options.cancel) context.cancel();
  if (options.stateError) rejectState(new Error('credit denied'));
  else resolveState();
  const navigated = await result;
  assert.equal(navigated, !options.cancel && !options.stateError);
  assert.equal(navigations.length, navigated ? 1 : 0);
  assert.equal(timers.size, 0);
  // A late image completion cannot navigate twice after a timeout.
  resolveArt();
  await new Promise(setImmediate);
  assert.equal(navigations.length, navigated ? 1 : 0);
}

const syncSource = read('src/services/sync-jlpt-qualification.ts');
assert(!syncSource.includes('approved-n1-exams'), 'Home must not load the full exam registry');
const syncCode = stripTypeScriptTypes(syncSource).replace(/^import[^;]+;\s*/gm, '').replace(/export /g, '');
async function checkQualifications() {
  const exams = metadata.slice(0, 3), calls = [], credits = [];
  const ledger = { passed: { N1: {}, N2: {}, N3: {}, N4: {}, N5: {} } };
  const savedKeys = [exams[0].storageKey, `${exams[1].storageKey}:attempt-history:v1`];
  const context = {
    qualificationMetadata: exams,
    AsyncStorage: { getAllKeys: async () => savedKeys },
    loadLearningEconomy: async () => ledger,
    loadJlptTrialSession: async key => { calls.push(key); return { submitted: true, result: { correct: 8, total: 10 } }; },
    loadJlptAttemptSummary: async key => key === exams[0].storageKey ? { bestTotal: 10, bestCorrect: 9 } : {},
    recordQualifiedExam: async (...args) => credits.push(args),
  };
  vm.createContext(context);
  vm.runInContext(syncCode + '\nglobalThis.sync = syncJlptQualification;', context);
  const first = context.sync();
  assert.equal(first, context.sync(), 'Coalesce simultaneous Home/Learn refreshes');
  assert.equal(await first, ledger);
  assert.deepEqual(calls, savedKeys.map(key => key.replace(':attempt-history:v1', '')));
  assert.deepEqual(credits, [[exams[0].id, exams[0].level, 9, 10], [exams[1].id, exams[1].level, 8, 10]]);
  calls.length = credits.length = 0;
  savedKeys.length = 0;
  await context.sync();
  assert.equal(calls.length, 0, 'Fresh installs must not scan every empty session');
  assert.equal(credits.length, 0);
}
(async () => {
  for (const mode of ['success', 'error', 'timeout']) {
    await checkNavigation(mode);
    await checkNavigation(mode, { cancel: true });
    await checkNavigation(mode, { stateError: true });
  }
  await checkQualifications();
  console.log(`HOME/NAVIGATION PASS: ${metadata.length} exact metadata bindings; 9 navigation cases; late image completion; required-state guard; saved-history/session fallback; concurrent sync; empty install.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
