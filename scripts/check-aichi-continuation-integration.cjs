const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { stripTypeScriptTypes } = require('node:module');
const root = path.resolve(__dirname, '..');
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, p))).digest('hex');
const baseline = '7ace5edee3818dc43fcda2069357ac858b72b2a9';
const before = p => JSON.parse(execFileSync('git', ['show', `${baseline}:${p}`], { cwd: root, encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 }));
const sources = Array.from({ length: 5 }, (_, i) => `scripts/dialogue-authoring/prf-023-continuation-review-group-${String(i + 1).padStart(2, '0')}.json`);
sources.push('scripts/dialogue-authoring/prf-023-continuation-runtime-role-repairs.json');
const entries = new Map();
for (const source of sources) for (const [id, entry] of Object.entries(read(source))) entries.set(id, { source, entry });
assert.equal(entries.size, 125);

// Run the repository's real TypeScript adapters with JSON loading and Metro's
// require.context supplied by a local filesystem context. This is an adapter
// check, not a native-device or production Metro build certification.
function moduleRequire(name) {
  assert(name.startsWith('@/'));
  return read(`src/${name.slice(2)}`);
}
moduleRequire.context = (directory, recursive, pattern) => {
  assert.equal(directory, '../data/generated/dialogues');
  assert.equal(recursive, false);
  const directoryPath = path.join(root, 'src/data/generated/dialogues');
  const keys = fs.readdirSync(directoryPath).filter(name => pattern.test(name)).map(name => `./${name}`);
  const context = key => read(`src/data/generated/dialogues/${key.slice(2)}`);
  context.keys = () => keys;
  return context;
};
function loadAdapter(file, names) {
  const code = stripTypeScriptTypes(fs.readFileSync(path.join(root, file), 'utf8'), { mode: 'transform' })
    .replace(/^import (\w+) from ['"]([^'"]+)['"];\s*$/gm, (_, local, name) => `const ${local} = require(${JSON.stringify(name)});`)
    .replace(/^export /gm, '');
  return new Function('require', `${code}\nreturn {${names.join(',')}};`)(moduleRequire);
}
const repository = loadAdapter('src/services/life-content-repository.ts', ['getLifeScenarioById', 'getLifeLocationById', 'getLifeScenarioIndex']);
const loader = loadAdapter('src/services/dialogue-content-loader.ts', ['loadDialogueTurns']);
const scenarios = read('src/data/generated/scenarios.json');
const overrides = read('src/data/dialogue-content/scenario-overrides.json');
const merged = new Map([...scenarios, ...overrides].map(row => [row.id, row]));
const previous = new Map([...before('src/data/generated/scenarios.json'), ...before('src/data/dialogue-content/scenario-overrides.json')].map(row => [row.id, row]));
assert.deepEqual([...merged.keys()], [...previous.keys()]);
assert.equal(merged.size, 7128);
for (const [id, row] of merged) {
  if (!entries.has(id)) assert.deepEqual(row, previous.get(id), `Unrelated scenario metadata changed: ${id}`);
  else for (const field of ['id', 'cityId', 'locationId', 'order', 'type', 'trigger', 'branching']) assert.deepEqual(row[field], previous.get(id)[field], `${id}: changed identity/link ${field}`);
}
const players = new Set();
const inventory = [];
for (const [id, { source, entry }] of entries) {
  const file = `src/data/generated/dialogues/${id}.json`;
  const data = read(file);
  const rows = loader.loadDialogueTurns(id);
  const oldRows = before(file).shared;
  const scenario = repository.getLifeScenarioById(id);
  const location = repository.getLifeLocationById(scenario.locationId);
  const index = repository.getLifeScenarioIndex(id);
  assert.equal(rows.length, 11, id);
  assert.equal(scenario.name, entry.title, `${id}: title`);
  assert.equal(scenario.situation, entry.premise, `${id}: premise`);
  assert.equal(scenario.playerGoal, entry.tasks[0][1], `${id}: scenario goal`);
  assert.equal(scenario.locationType, location.category, `${id}: effective category`);
  assert.equal(scenario.difficulty, null, `${id}: level gate`);
  for (const field of ['description', 'evaluationCriteria', 'outcome', 'startingExpression']) assert.equal(scenario[field], null, `${id}: stale legacy ${field}`);
  assert.equal(index.dialogueCount, 11);
  assert.equal(index.firstDialogueId, rows[0].id);
  assert.equal(data.authoring.editorialSource, source);
  assert.equal(data.authoring.premise, entry.premise);
  assert.equal(data.authoring.nativeSpeakerReviewed, false);
  assert.equal(data.authoring.contentPass, false);
  for (let i = 0; i < rows.length; i++) {
    const turn = rows[i];
    const player = i % 2 === 1;
    assert.equal(turn.id, oldRows[i].id, `${id}: turn identity`);
    assert.equal(turn.nextDialogueId, oldRows[i].nextDialogueId, `${id}: chain identity`);
    assert.equal(turn.nextDialogueId, rows[i + 1]?.id ?? null);
    assert.equal(turn.scenarioId, id);
    assert.equal(turn.turnOrder, i + 1);
    assert.equal(turn.speaker, player ? 'PLAYER' : 'NPC');
    const object = player ? turn.player : turn.npc;
    const text = player ? object.recommendedAnswerJa : object.textJa;
    assert.equal(text, entry.turns[i]);
    assert.deepEqual((player ? data.shared[i].player : data.shared[i].npc).translations, {});
    if (player) {
      const goal = entry.tasks[Math.floor(i / 2)];
      assert.equal(object.communicativeIntent, goal[0]);
      assert.deepEqual(object.requiredSemanticComponents, { goal: goal[1] });
      assert.equal(object.recommendedAnswerFurigana, null);
      assert.deepEqual(object.acceptableExamples, []);
      assert(!players.has(text), `${id}: duplicate Player sentence`);
      players.add(text);
    } else assert.equal(object.furigana, null);
  }
  const objectHash = object => crypto.createHash('sha256').update(JSON.stringify(object)).digest('hex');
  inventory.push({ scenarioId: id, source, sourceSha256: hash(source), runtimeSha256: hash(file), effectiveScenarioSha256: objectHash(scenario), effectiveLocationSha256: objectHash(location), locationId: scenario.locationId, effectiveCategory: location.category, effectiveNpcJob: location.npcJob });
}
const report = { status: 'PASS_REAL_REPOSITORY_AND_DIALOGUE_LOADER_ADAPTERS', scenarios: 125, turns: 1375, goals: 625, canonicalScenarios: 7128, stableIdsAndChains: true, unchangedUnrelatedScenarioMetadata: true, exactPlayerDuplicatesWithinScope: 0, staleTurnTranslationsCleared: true, nativeDeviceVerified: false, humanNativeReviewed: false, prefectureContentPass: false, limits: ['Filesystem-backed Metro require.context adapter; no production Metro/native visual or microphone certification', 'Only 125 integrated scenarios receive acceptance; remaining Aichi drafts and whole-prefecture semantic audit are unfinished'], inventory };
fs.writeFileSync(path.join(root, 'docs/dialogue-workspace/content-qa/PRF-023_CONTINUATION_RUNTIME_QA.json'), JSON.stringify(report, null, 2) + '\n');
console.log('AICHI CONTINUATION INTEGRATION PASS: 125 scenarios; 1375 turns; 625 goals; 7128 canonical IDs preserved; real repository/loader adapters.');
