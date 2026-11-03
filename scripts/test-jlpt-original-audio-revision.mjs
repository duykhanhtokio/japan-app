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
