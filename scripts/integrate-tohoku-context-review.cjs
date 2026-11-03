// Mechanical integration only; semantic review remains with each owning worker.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const {read, hash, locales} = require('./lib/dialogue-translation-validation.cjs');
const {expandContextReceipt} = require('./lib/dialogue-context-receipts.cjs');
const base = 'docs/localization-workspace/region-review/tohoku/session-001/';
const assignment = read(base + 'assignment.json');
const queuePath = 'docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json';
const planPath = 'docs/localization-workspace/region-review/plan.json';
const queue = read(queuePath), plan = read(planPath);
const prefectures = new Set(['PRF-002','PRF-003','PRF-004','PRF-005','PRF-006','PRF-007']);
const members = new Set(queue.prefectures.filter(p => prefectures.has(p.prefectureId)).flatMap(p => p.cities.flatMap(c => [...c.sentenceTaskReviewedScenarioIds, ...c.pendingSentenceTaskScenarioIds])));
assert.equal(members.size, assignment.regionTotal);
const seen = new Set(), batches = new Set(), workers = [], receipts = [];
for (let worker = 1; worker <= 6; worker++) {
  let count = 0, changes = 0;
  for (const file of fs.readdirSync(base).filter(f => new RegExp(`^worker${worker}-part[0-9]{4}\\.json$`).test(f)).sort()) {
    const raw = read(base + file), receipt = expandContextReceipt(raw);
    assert.equal(raw.worker, worker);
    for (const row of raw.entries) {
      assert(members.has(row.scenarioId)); assert(!seen.has(row.scenarioId), 'Duplicate scenario');
      seen.add(row.scenarioId); batches.add(row.batch); count++;
    }
    assert.equal(receipt.reviews.length, raw.entries.length * 12);
    changes += raw.changes.length;
    receipts.push({path:base + file, sha256:hash(base + file)});
  }
  workers.push({worker, reviewed:count, remaining:assignment.workers.find(w => w.worker === worker).scenarioIds.length-count, changedFields:changes});
}
// Check complete affected packs without fetching unrelated source assets.
for (const batch of batches) {
  const source = read(`docs/localization-workspace/sources/dialogue-batch-${batch}.ja.json`);
  for (const locale of locales) {
    const pack = read(`src/data/dialogue-content/locale-batches/${locale}/${batch}.json`);
    assert.equal(pack.nativeReviewed, false); assert.equal(pack.status, 'translated_ai_unreviewed');
    assert.equal(pack.language, locale);
    assert.deepEqual(Object.keys(pack.scenarios).sort(), Object.keys(source.scenarios).sort());
    for (const [sid,s] of Object.entries(source.scenarios)) {
      const target = pack.scenarios[sid];
      assert.deepEqual(Object.keys(target.turns).sort(), Object.keys(s.turns).sort());
      for (const [tid,t] of Object.entries(s.turns)) {
        const v = target.turns[tid];
        assert.equal(v.sourceJa,t.sourceJa); assert.equal(v.speaker,t.speaker);
        assert(v.translation?.trim());
        if (t.hintJa) {assert.equal(v.hintJa,t.hintJa);assert(v.hintTranslation?.trim());}
      }
    }
  }
}
for (const p of queue.prefectures) {
  if (prefectures.has(p.prefectureId)) for (const c of p.cities) {
    c.sentenceTaskReviewedScenarioIds = [...new Set([...c.sentenceTaskReviewedScenarioIds,...c.pendingSentenceTaskScenarioIds.filter(s => seen.has(s))])];
    c.pendingSentenceTaskScenarioIds = c.pendingSentenceTaskScenarioIds.filter(s => !seen.has(s));
  }
  p.aiSentenceTaskReviewedScenarios = p.cities.reduce((n,c) => n+c.sentenceTaskReviewedScenarioIds.length,0);
  p.pendingSentenceTaskScenarios = p.scenarioCount-p.aiSentenceTaskReviewedScenarios;
  p.status = p.pendingSentenceTaskScenarios ? (p.aiSentenceTaskReviewedScenarios ? 'IN_PROGRESS' : 'PENDING') : 'AI_SENTENCE_TASK_REVIEWED';
}
queue.aiSentenceTaskReviewedScenarios = queue.prefectures.reduce((n,p)=>n+p.aiSentenceTaskReviewedScenarios,0);
queue.remainingSentenceTaskScenarios = queue.canonicalScenarios-queue.aiSentenceTaskReviewedScenarios;
plan.fullContextReviewedScenarios = queue.aiSentenceTaskReviewedScenarios;
plan.remainingContextScenarios = queue.remainingSentenceTaskScenarios;
for (const r of plan.regions) {
  for (const p of r.prefectures) p.contextReviewedScenarios = queue.prefectures.find(q=>q.prefectureId===p.prefectureId).aiSentenceTaskReviewedScenarios;
  r.contextReviewedScenarios = r.prefectures.reduce((n,p)=>n+p.contextReviewedScenarios,0);
  r.remainingScenarios = r.totalScenarios-r.contextReviewedScenarios;
  r.status = r.remainingScenarios ? (r.contextReviewedScenarios ? 'IN_PROGRESS' : 'NOT_STARTED') : 'AI_CONTEXT_REVIEWED_NOT_NATIVE_CERTIFIED';
}
const region = plan.regions.find(r=>r.regionId==='tohoku');
const manifestPath = 'docs/localization-workspace/DIALOGUE_TRANSLATION_PROGRESS.json';
const manifest = read(manifestPath);
for (const batch of batches) {
  const entry = manifest.completedBatches.find(b=>b.batch===batch); assert(entry);
  assert.equal(entry.sourceSha256,hash(`docs/localization-workspace/sources/dialogue-batch-${batch}.ja.json`));
  for (const locale of locales) {
    const path = `src/data/dialogue-content/locale-batches/${locale}/${batch}.json`;
    const file = entry.files.find(f=>f.path===path); assert(file); file.sha256=hash(path);
  }
}
const progress = {region:'tohoku', status:region.remainingScenarios ? 'IN_PROGRESS_NOT_REGION_COMPLETE' : 'AI_CONTEXT_REVIEWED_NOT_NATIVE_CERTIFIED',total:members.size,reviewed:region.contextReviewedScenarios,remaining:region.remainingScenarios,workers,receipts,nativeReviewed:false,semanticCrossReview:false};
if (process.argv.includes('--write')) for (const [path,data] of [[queuePath,queue],[planPath,plan],[manifestPath,manifest],[base+'progress.json',progress]]) fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify({status:'MECHANICAL_RECEIPT_AND_PACK_VALIDATION_PASS',...progress,receipts:receipts.length}));
