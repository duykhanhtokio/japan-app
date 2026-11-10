const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const {read, locales, hash} = require('./dialogue-translation-validation.cjs');
const digest = text => crypto.createHash('sha256').update(text).digest('hex');
const packCache = new Map();
let metadataCache;
function metadataFor(sid) {
  if (!metadataCache) {
    metadataCache = new Map();
    const keys = ['name', 'situation', 'learningObjective', 'playerGoal', 'npcGoal', 'description', 'locationId'].sort();
    for (const file of ['src/data/generated/scenarios.json', 'src/data/dialogue-content/scenario-overrides.json', 'src/data/dialogue-content/independent-city-overrides.json']) {
      for (const row of read(file)) metadataCache.set(row.id, Object.fromEntries(keys.map(k => [k, row[k] ?? null])));
    }
  }
  assert(metadataCache.has(sid), 'Missing compact context');
  return metadataCache.get(sid);
}
function targetPack(batch, locale) {
  const key = batch + ':' + locale;
  if (!packCache.has(key)) {
    packCache.set(key, read(`src/data/dialogue-content/locale-batches/${locale}/${batch}.json`));
    if (packCache.size > 32) packCache.delete(packCache.keys().next().value);
  }
  return packCache.get(key);
}

function expandContextReceipt(receipt) {
  if (receipt.schemaVersion === 'context-review-archive-v1') {
    const fs = require('node:fs'), path = require('node:path');
    const root = path.resolve(__dirname, '../..');
    assert(receipt.archivePath.startsWith('docs/localization-workspace/region-review/kanto-20261103/'));
    assert(!receipt.archivePath.split('/').includes('..'));
    const zipped = fs.readFileSync(path.join(root, receipt.archivePath));
    assert.equal(digest(zipped), receipt.archiveSha256, 'Changed evidence archive');
    const raw = require('node:zlib').gunzipSync(zipped);
    assert.equal(digest(raw), receipt.uncompressedSha256, 'Changed expanded evidence');
    return expandContextReceipt(JSON.parse(raw.toString('utf8')));
  }
  if (receipt.reviewFieldEncoding === 'tuple-v1') {
    const keys = ['turnId', 'field', 'sourceSha256', 'targetSha256'];
    for (const row of receipt.reviews) row.fields = row.fields.map(f => Array.isArray(f) ? Object.fromEntries(keys.map((k, n) => [k, f[n]])) : f);
    delete receipt.reviewFieldEncoding;
  }
  if (receipt.schemaVersion !== 'context-review-compact-v1') return receipt;
  assert.equal(receipt.nativeReviewed, false);
  assert.equal(receipt.wholeScenarioAll12Read, true);
  const assignment = read(receipt.assignmentPath);
  assert.equal(hash(receipt.assignmentPath), receipt.assignmentSha256, 'Changed region assignment');
  const owner = assignment.workers.find(w => w.worker === receipt.worker);
  assert(owner, 'Unknown region worker');
  const seen = new Set(), reviews = [];
  const index = read('src/data/dialogue-content/locale-batch-index.json');
  for (const entry of receipt.entries) {
    assert(!seen.has(entry.scenarioId), 'Duplicate compact scenario'); seen.add(entry.scenarioId);
    assert(owner.scenarioIds.includes(entry.scenarioId), 'Unowned compact scenario');
    assert.equal(index[entry.scenarioId], entry.batch);
    assert.equal(assignment.batchOwners[entry.batch], receipt.worker, 'Overlapping file ownership');
    const source = read(`docs/localization-workspace/sources/dialogue-batch-${entry.batch}.ja.json`).scenarios[entry.scenarioId];
    const fields = Object.entries(source.turns).flatMap(([turnId, turn]) => [
      {turnId, field: 'translation'}, ...(turn.hintJa ? [{turnId, field: 'hintTranslation'}] : []),
    ]);
    assert.equal(fields.length, 16);
    assert.equal(entry.sourceSha256.length, 16);
    assert.equal(entry.contextSha256, digest(JSON.stringify(metadataFor(entry.scenarioId))), 'Stale compact Japanese context');
    for (let n = 0; n < fields.length; n++) {
      const f = fields[n], turn = source.turns[f.turnId];
      assert.equal(entry.sourceSha256[n], digest(f.field === 'hintTranslation' ? turn.hintJa : turn.sourceJa), 'Wrong compact source hash');
    }
    assert.deepEqual(Object.keys(entry.targetSha256).sort(), [...locales].sort(), 'Incomplete compact locale review');
    assert(entry.reviewNotes?.trim().length >= 30, 'Missing case-specific review note');
    for (const locale of locales) {
      assert.equal(entry.targetSha256[locale].length, 16);
      const pack = targetPack(entry.batch, locale);
      assert.equal(pack.nativeReviewed, false);
      for (let n = 0; n < fields.length; n++) {
        const f = fields[n];
        assert.equal(entry.targetSha256[locale][n], digest(pack.scenarios[entry.scenarioId].turns[f.turnId][f.field]), 'Wrong compact target hash');
      }
      reviews.push({scenarioId: entry.scenarioId, locale, nativeReviewed: false,
        fields: fields.map((f, n) => ({...f, sourceSha256: entry.sourceSha256[n], targetSha256: entry.targetSha256[locale][n]}))});
    }
  }
  assert.equal(receipt.reviewedScenarios, seen.size);
  assert.equal(receipt.reviewedFields, seen.size * 192);
  return {...receipt, reviews};
}
module.exports = {expandContextReceipt};
