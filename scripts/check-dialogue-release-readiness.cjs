// Default is a release gate (exit 2 while acceptance remains incomplete).
// --technical-only checks data/runtime bindings without claiming release approval.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const {root, read, locales, validateBatch, hash} = require('./lib/dialogue-translation-validation.cjs');
const digest = text => crypto.createHash('sha256').update(text).digest('hex');
const args = process.argv.slice(2);

async function main() {
  const built = await require('esbuild').build({
    stdin: {contents: [
      'src/services/dialogue-content-loader.ts',
      'src/services/life-content-repository.ts',
      'src/services/dialogue-audio-packs.ts',
    ].map(p => `export * from ${JSON.stringify(path.join(root, p))}`).join('\n'), resolveDir: root},
    bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'error',
    alias: {'@': path.join(root, 'src')},
  });
  const actualRequire = Object.assign(name => require(name), {
    context(directory, recursive, pattern) {
      const base = path.resolve(root, 'src/services', directory), files = {}, cache = new Map();
      function scan(dir, prefix = '.') {
        for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
          if (e.isDirectory()) { if (recursive) scan(path.join(dir, e.name), prefix + '/' + e.name); }
          else if (pattern.test(e.name)) files[prefix + '/' + e.name] = path.join(dir, e.name);
        }
      }
      scan(base);
      return Object.assign(key => {
        assert(files[key], 'Missing runtime data ' + key);
        if (!cache.has(key)) {
          cache.set(key, JSON.parse(fs.readFileSync(files[key], 'utf8')));
          if (cache.size > 32) cache.delete(cache.keys().next().value);
        }
        return cache.get(key);
      }, {keys: () => Object.keys(files)});
    },
  });
  const module = {exports: {}};
  new Function('module', 'exports', 'require', built.outputFiles[0].text)(module, module.exports, actualRequire);
  const runtime = module.exports;
  const canonical = new Set([
    'src/data/generated/scenarios.json', 'src/data/dialogue-content/scenario-overrides.json',
    'src/data/dialogue-content/independent-city-overrides.json',
  ].flatMap(p => read(p)).map(s => s.id));
  const index = read('src/data/dialogue-content/locale-batch-index.json');
  assert.deepEqual(new Set(Object.keys(index)), canonical, 'Translation index differs from canonical corpus');
  const batches = [...new Set(Object.values(index))].sort();
  const progress = read('docs/localization-workspace/DIALOGUE_TRANSLATION_PROGRESS.json');
  const receipts = new Map(progress.completedBatches.map(b => [b.batch, b]));
  let sentences = 0, hints = 0;
  for (const batch of batches) {
    const checked = validateBatch(batch), receipt = receipts.get(batch);
    assert(receipt, 'Missing coverage manifest batch ' + batch);
    assert.equal(checked.sourceSha256, receipt.sourceSha256, 'Stale source manifest ' + batch);
    for (const file of checked.files) assert.equal(file.sha256, receipt.files.find(f => f.path === file.path)?.sha256, 'Stale target manifest ' + file.path);
    sentences += checked.turnTranslationChecks; hints += checked.hintTranslationChecks;
  }
  const cast = read('src/data/dialogue-content/npc-voice-casting.json');
  const voices = read('src/data/jlpt-original/voice-casting.json');
  let npc = 0, player = 0, ruby = 0, packed = 0;
  for (const sid of canonical) {
    const scenario = runtime.getLifeScenarioById(sid);
    const category = (runtime.getLifeLocationById(scenario.locationId)?.category ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    assert(!cast.unverifiedCategories.includes(category), 'Unverified voice category ' + category);
    const role = cast.categories[category] ?? cast.fallbackRole;
    const turns = runtime.loadDialogueTurns(sid);
    assert.equal(turns.length, 11, sid);
    for (const turn of turns) {
      const isNpc = turn.speaker === 'NPC';
      const data = isNpc ? turn.npc : turn.player;
      const ja = isNpc ? data.textJa : data.recommendedAnswerJa;
      const parts = isNpc ? data.textRuby : data.recommendedAnswerRuby;
      assert(Array.isArray(parts), 'Missing hiragana ' + turn.id);
      assert.equal(parts.map(p => p.text).join(''), ja, 'Stale hiragana ' + turn.id);
      for (const p of parts) if (/[\p{Script=Han}々〆ヵヶ]/u.test(p.text)) assert(/^[\p{Script=Hiragana}ー\s]+$/u.test(p.reading ?? ''), 'Missing kanji reading ' + turn.id);
      ruby++;
      for (const locale of locales) {
        assert(data.translations[locale]?.trim(), 'Missing runtime translation ' + turn.id + ':' + locale);
        if (!isNpc) assert(data.hintTranslations[locale]?.trim(), 'Missing runtime hint ' + turn.id + ':' + locale);
      }
      if (isNpc) {
        npc++;
        assert(runtime.packedRecordingFor(ja, sid, turn.id, role, voices.roles[role].speakerId), 'Missing current packed recording ' + turn.id);
        assert.equal(runtime.packedRecordingFor(ja + '変更', sid, turn.id, role, voices.roles[role].speakerId), null, 'Stale recording accepted');
        packed++;
      } else player++;
    }
  }
  const reviewFiles = [
    'docs/localization-workspace/naturalness-review-2026-10-25/context-pass-02.json',
    'docs/localization-workspace/naturalness-review-2026-10-25/prefecture-pass-03.json',
    'docs/localization-workspace/naturalness-review-2026-10-25/prefecture-pass-04.json',
    'docs/localization-workspace/release-audit-2026-11-03/kanazawa-01-context-review.json',
    ...fs.readdirSync(path.join(root, 'docs/localization-workspace/naturalness-review-2026-11-03'))
      .filter(name => /^kanazawa-\d{2}-\d{2}\.json$/.test(name)).sort()
      .map(name => 'docs/localization-workspace/naturalness-review-2026-11-03/' + name),
    ...fs.readdirSync(path.join(root, 'docs/localization-workspace'), {withFileTypes: true})
      .filter(entry => entry.isDirectory() && /^context-parallel-2026-11-03(?:-round\d+|-recovered)?$/.test(entry.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .flatMap(entry => fs.readdirSync(path.join(root, 'docs/localization-workspace', entry.name))
        .filter(name => (entry.name.endsWith('-recovered') ? /^batch-\d{3}\.json$/ : /^worker[1-6]\.json$/).test(name)).sort()
        .map(name => 'docs/localization-workspace/' + entry.name + '/' + name)),
  ];
  const reviewed = new Map();
  let reviewedFields = 0;
  for (const file of reviewFiles) {
    const receipt = read(file);
    assert.equal(receipt.nativeReviewed, false);
    for (const row of receipt.reviews) {
      assert(canonical.has(row.scenarioId));
      const turns = new Map(runtime.loadDialogueTurns(row.scenarioId).map(t => [t.id, t]));
      const seen = new Set();
      for (const field of row.fields) {
        const t = turns.get(field.turnId), data = t.speaker === 'NPC' ? t.npc : t.player;
        const source = field.field === 'hintTranslation' ? data.hint : (t.speaker === 'NPC' ? data.textJa : data.recommendedAnswerJa);
        const target = field.field === 'hintTranslation' ? data.hintTranslations[row.locale] : data.translations[row.locale];
        assert.equal(digest(source), field.sourceSha256, 'Stale contextual source ' + file + ':' + field.turnId);
        assert.equal(digest(target), field.targetSha256, 'Stale contextual target ' + file + ':' + field.turnId);
        seen.add(field.turnId + ':' + field.field); reviewedFields++;
      }
      assert.equal(seen.size, 16, 'Review omits sentence/task fields ' + row.scenarioId);
      if (!reviewed.has(row.scenarioId)) reviewed.set(row.scenarioId, new Set());
      reviewed.get(row.scenarioId).add(row.locale);
    }
  }
  const fullyReviewed = [...reviewed.values()].filter(s => locales.every(l => s.has(l))).length;
  const queue = read('docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json');
  const queuedReviewed = queue.prefectures.flatMap(p => p.cities.flatMap(c => c.sentenceTaskReviewedScenarioIds));
  assert.equal(new Set(queuedReviewed).size, queuedReviewed.length, 'Scenario appears twice in reviewed queue');
  assert.deepEqual(new Set(queuedReviewed), new Set(reviewed.keys()), 'Queue and revision-bound review receipts differ');
  assert.equal(queue.aiSentenceTaskReviewedScenarios, fullyReviewed, 'Stale reviewed queue total');
  assert.equal(queue.remainingSentenceTaskScenarios, canonical.size - fullyReviewed, 'Stale remaining queue total');
  assert(canonical.has(queue.nextScenarioId) && !reviewed.has(queue.nextScenarioId), 'Next queue scenario is absent/already reviewed');
  assert.equal(index[queue.nextScenarioId], queue.nextBatch, 'Next queue batch is incorrect');
  const report = {
    status: 'PASS_TECHNICAL_COVERAGE_RELEASE_INCOMPLETE',
    canonicalScenarios: canonical.size, batches: batches.length, targetLocales: locales,
    turnTranslations: sentences, hintTranslations: hints,
    currentSourceBoundHiraganaTurns: ruby, npcTurns: npc, playerTurns: player,
    currentSourceAndVoicePackedNpcTurns: packed,
    contextReview: {revisionBoundScenariosAll12Locales: fullyReviewed, revisionBoundFields: reviewedFields, remainingScenarios: canonical.size - fullyReviewed, nextScenarioId: queue.nextScenarioId, nextBatch: queue.nextBatch, queueMatchesReceipts: true, scope: 'AI sentence/task review only; known issues remain.'},
    nativeReviewed: false, nativePronunciationApproved: false, nativeDeviceVerified: false,
    releaseAccepted: false,
    acceptanceBlockers: [
      'Full-corpus contextual semantic review remains incomplete.',
      'Independent native-speaker review has not been performed.',
      'Scenario metadata translation/display integration remains unfinished.',
      'Pronunciation/listening review is not established by clip identity or decoder checks.',
      'Native iOS/Android device playback, layout and measured navigation performance remain unverified.',
    ],
    evidenceSha256: Object.fromEntries(reviewFiles.map(p => [p, hash(p)])),
  };
  const outputAt = args.indexOf('--out');
  if (outputAt >= 0) fs.writeFileSync(path.resolve(args[outputAt + 1]), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
  if (!args.includes('--technical-only')) process.exitCode = 2;
}
main().catch(error => { console.error(error); process.exitCode = 1; });
