// Default is a release gate (exit 2 while acceptance remains incomplete).
// --technical-only checks data/runtime bindings without claiming release approval.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const {root, read, locales, validateBatch, hash} = require('./lib/dialogue-translation-validation.cjs');
const digest = text => crypto.createHash('sha256').update(text).digest('hex');
const args = process.argv.slice(2);
const contextOnly = args.includes('--context-only');

async function main() {
  const built = await require('esbuild').build({
    stdin: {contents: [
      'src/services/dialogue-content-loader.ts',
      'src/services/life-content-repository.ts',
      'src/services/dialogue-audio-packs.ts',
    ].map(p => `export * from ${JSON.stringify(path.join(root, p))}`).join('\n'), resolveDir: root},
    bundle: true, write: false, platform: 'node', format: 'cjs', logLevel: 'error',
    alias: {'@': path.join(root, 'src')},
    // Keep curriculum JSON outside generated JS: compiling the entire corpus
    // duplicates it in the bundle, parser and runtime and can exhaust QA memory.
    plugins: [{name:'qa-lazy-json', setup(build) {
      build.onResolve({filter:/\.json$/}, input => ({
        path: input.path.startsWith('@/') ? path.join(root,'src',input.path.slice(2)) : path.resolve(input.resolveDir,input.path),
        external:true,
      }));
    }}],
  });
  const jsonCache = new Map();
  const actualRequire = Object.assign(name => {
    if (!path.isAbsolute(name) || !name.endsWith('.json')) return require(name);
    if (!jsonCache.has(name)) {
      jsonCache.set(name, JSON.parse(fs.readFileSync(name, 'utf8')));
      if (jsonCache.size > 32) jsonCache.delete(jsonCache.keys().next().value);
    }
    return jsonCache.get(name);
  }, {
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
  const batchArgumentAt = args.indexOf('--batches');
  const checkedBatches = contextOnly
    ? [...new Set(batchArgumentAt >= 0 ? args[batchArgumentAt + 1].split(',').filter(Boolean) : [])].sort()
    : batches;
  for (const batch of checkedBatches) assert(batches.includes(batch), 'Unknown requested batch ' + batch);
  const progress = read('docs/localization-workspace/DIALOGUE_TRANSLATION_PROGRESS.json');
  const receipts = new Map(progress.completedBatches.map(b => [b.batch, b]));
  let sentences = 0, hints = 0;
  for (const batch of checkedBatches) {
    const checked = validateBatch(batch), receipt = receipts.get(batch);
    assert(receipt, 'Missing coverage manifest batch ' + batch);
    assert.equal(checked.sourceSha256, receipt.sourceSha256, 'Stale source manifest ' + batch);
    for (const file of checked.files) assert.equal(file.sha256, receipt.files.find(f => f.path === file.path)?.sha256, 'Stale target manifest ' + file.path);
    sentences += checked.turnTranslationChecks; hints += checked.hintTranslationChecks;
  }
  const cast = read('src/data/dialogue-content/npc-voice-casting.json');
  const voices = read('src/data/jlpt-original/voice-casting.json');
  let npc = 0, player = 0, ruby = 0, packed = 0;
  for (const sid of contextOnly ? [] : canonical) {
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
  // Historical duplicate receipts remain immutable. Count only receipts bound to
  // the selected current source/target revision, including verified amendments.
  const unionRun = require('node:child_process').spawnSync(process.execPath,
    ['--max-old-space-size=384', 'scripts/check-dialogue-regional-union.cjs'],
    {cwd:root,encoding:'utf8',maxBuffer:1024*1024});
  assert.equal(unionRun.status,0,unionRun.stdout + unionRun.stderr);
  const union = read('docs/localization-workspace/region-review/union-validation-20261103.json');
  assert.equal(union.status,'PASS');
  const reviewed = new Map(Object.keys(union.evidence).map(sid=>[sid,new Set(locales)]));
  const reviewedFields = union.fields;
  const amendments = {count:union.revisionAmendedFields};
  const fullyReviewed = [...reviewed.values()].filter(s => locales.every(l => s.has(l))).length;
  const queue = read('docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json');
  const queuedReviewed = queue.prefectures.flatMap(p => p.cities.flatMap(c => c.sentenceTaskReviewedScenarioIds));
  assert.equal(new Set(queuedReviewed).size, queuedReviewed.length, 'Scenario appears twice in reviewed queue');
  assert.deepEqual(new Set(queuedReviewed), new Set(reviewed.keys()), 'Queue and revision-bound review receipts differ');
  assert.equal(queue.aiSentenceTaskReviewedScenarios, fullyReviewed, 'Stale reviewed queue total');
  assert.equal(queue.remainingSentenceTaskScenarios, canonical.size - fullyReviewed, 'Stale remaining queue total');
  if (fullyReviewed === canonical.size) {
    assert.equal(queue.nextScenarioId, null, 'Completed corpus must have no next scenario');
    assert.equal(queue.nextBatch, null, 'Completed corpus must have no next batch');
  } else {
    assert(canonical.has(queue.nextScenarioId) && !reviewed.has(queue.nextScenarioId), 'Next queue scenario is absent/already reviewed');
    assert.equal(index[queue.nextScenarioId], queue.nextBatch, 'Next queue batch is incorrect');
  }
  const report = {
    status: contextOnly ? 'PASS_CONTEXT_RECEIPTS_AND_SCOPED_BATCHES_RELEASE_INCOMPLETE' : 'PASS_TECHNICAL_COVERAGE_RELEASE_INCOMPLETE',
    validationScope: contextOnly ? 'All contextual receipts plus explicitly requested batches; no corpus-wide hiragana/audio assertion.' : 'Whole-corpus technical coverage',
    checkedTranslationBatches: checkedBatches,
    canonicalScenarios: canonical.size, batches: batches.length, targetLocales: locales,
    turnTranslations: contextOnly ? null : sentences, hintTranslations: contextOnly ? null : hints,
    scopedTurnTranslations: sentences, scopedHintTranslations: hints,
    currentSourceBoundHiraganaTurns: contextOnly ? null : ruby, npcTurns: contextOnly ? null : npc, playerTurns: contextOnly ? null : player,
    currentSourceAndVoicePackedNpcTurns: contextOnly ? null : packed,
    contextReview: {revisionBoundScenariosAll12Locales: fullyReviewed, revisionBoundFields: reviewedFields, revisionAmendedFields: amendments.count, remainingScenarios: canonical.size - fullyReviewed, nextScenarioId: queue.nextScenarioId, nextBatch: queue.nextBatch, queueMatchesReceipts: true, scope: 'AI sentence/task review only; known issues remain.'},
    nativeReviewed: false, nativePronunciationApproved: false, nativeDeviceVerified: false,
    releaseAccepted: false,
    acceptanceBlockers: [
      'AI context review is complete; source, native, audio and device acceptance remain separate.',
      'Independent native-speaker review has not been performed.',
      'Scenario metadata translation/display integration remains unfinished.',
      'Pronunciation/listening review is not established by clip identity or decoder checks.',
      'Native iOS/Android device playback, layout and measured navigation performance remain unverified.',
    ],
    evidenceSha256: Object.fromEntries([...reviewFiles, ...amendments.evidenceFiles].map(p => [p, hash(p)])),
  };
  const outputAt = args.indexOf('--out');
  if (outputAt >= 0) fs.writeFileSync(path.resolve(args[outputAt + 1]), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
  if (!args.includes('--technical-only')) process.exitCode = 2;
}
main().catch(error => { console.error(error); process.exitCode = 1; });
