// Mechanical integration only; semantic review remains with each owning worker.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const {read, hash, locales} = require('./lib/dialogue-translation-validation.cjs');
const {expandContextReceipt} = require('./lib/dialogue-context-receipts.cjs');
const base = 'docs/localization-workspace/region-review/chugoku/session-001/';
const assignment = read(base + 'assignment.json');
const queuePath = 'docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json';
const planPath = 'docs/localization-workspace/region-review/plan.json';
const queue = read(queuePath), plan = read(planPath);
const prefectures = new Set(['PRF-031','PRF-032','PRF-033','PRF-034','PRF-035']);
const members = new Set(queue.prefectures.filter(p => prefectures.has(p.prefectureId)).flatMap(p => p.cities.flatMap(c => [...c.sentenceTaskReviewedScenarioIds, ...c.pendingSentenceTaskScenarioIds])));
assert.equal(members.size, assignment.regionTotal);
const preserved = new Set(assignment.preservedReviewedScenarioIds);
const changedPacks = new Map();
const seen = new Set(), batches = new Set(), workers = [], receipts = [];
for (let worker = 1; worker <= 6; worker++) {
  let count = 0, changes = 0;
  for (const file of fs.readdirSync(base).filter(f => new RegExp(`^worker${worker}-part[0-9]{4}\\.json$`).test(f)).sort()) {
    const raw = read(base + file), receipt = expandContextReceipt(raw);
    assert.equal(raw.worker, worker);
    assert.equal(raw.baselineCommit, assignment.baselineCommit);
    assert.equal(raw.assignmentPath, base+'assignment.json');
    for (const row of raw.entries) {
      assert(members.has(row.scenarioId)); assert(!preserved.has(row.scenarioId), 'Previously reviewed scenario repeated'); assert(!seen.has(row.scenarioId), 'Duplicate scenario');
      seen.add(row.scenarioId); batches.add(row.batch); count++;
    }
    assert.equal(receipt.reviews.length, raw.entries.length * 12);
    for (const change of raw.changes) {
      assert(raw.entries.some(e=>e.scenarioId===change.scenarioId));
      assert.equal(assignment.batchOwners[read('src/data/dialogue-content/locale-batch-index.json')[change.scenarioId]],worker);
      assert.equal(change.path,`src/data/dialogue-content/locale-batches/${change.locale}/${read('src/data/dialogue-content/locale-batch-index.json')[change.scenarioId]}.json`);
      if (!changedPacks.has(change.path)) changedPacks.set(change.path,[]);
      changedPacks.get(change.path).push(change);
    }
    changes += raw.changes.length;
    receipts.push({path:base + file, sha256:hash(base + file)});
  }
  workers.push({worker, reviewed:count, remaining:assignment.workers.find(w => w.worker === worker).scenarioIds.length-count, changedFields:changes});
}
// Replay corrections against Git baseline; reject unexplained pack mutations.
const {execFileSync} = require('node:child_process');
for (const [path,changes] of changedPacks) {
  const original=JSON.parse(execFileSync('git',['show',assignment.baselineCommit+':'+path],{encoding:'utf8',maxBuffer:10*1024*1024}));
  for (const change of changes) {
    const turn=original.scenarios[change.scenarioId].turns[change.turnId];
    assert.equal(turn[change.field],change.before,'Stale correction');
    turn[change.field]=change.after;
  }
  assert(JSON.stringify(original)===JSON.stringify(read(path)),'Unexplained pack modification: '+path);
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
for (const sid of preserved) assert(queue.prefectures.some(p=>p.cities.some(c=>c.sentenceTaskReviewedScenarioIds.includes(sid))),'Lost previous valid review');
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
const region = plan.regions.find(r=>r.regionId==='chugoku');
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
const progress = {region:'chugoku', status:region.remainingScenarios ? 'IN_PROGRESS_NOT_REGION_COMPLETE' : 'AI_CONTEXT_REVIEWED_NOT_NATIVE_CERTIFIED',total:members.size,reviewed:region.contextReviewedScenarios,remaining:region.remainingScenarios,workers,receipts,nativeReviewed:false,semanticCrossReview:false};
if (process.argv.includes('--write')) for (const [path,data] of [[queuePath,queue],[planPath,plan],[manifestPath,manifest],[base+'progress.json',progress]]) fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify({status:'MECHANICAL_RECEIPT_AND_PACK_VALIDATION_PASS',...progress,receipts:receipts.length}));
