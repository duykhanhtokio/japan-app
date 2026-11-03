// Reconcile actual, revision-bound worker receipts; never infer semantic review.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const {read, hash, locales, validateBatch} = require('./lib/dialogue-translation-validation.cjs');
const crypto = require('node:crypto');
const digest = s => crypto.createHash('sha256').update(s).digest('hex');
const base = 'docs/localization-workspace/hokkaido-context-2026-11-03/';
const queuePath = 'docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json';
const queue = read(queuePath), index = read('src/data/dialogue-content/locale-batch-index.json');
const planPath = 'docs/localization-workspace/region-review/plan.json', plan = read(planPath);
const hk = queue.prefectures.find(p => p.prefectureId === 'PRF-001');
const member = new Set(hk.cities.flatMap(c => [...c.sentenceTaskReviewedScenarioIds, ...c.pendingSentenceTaskScenarioIds]));
const reviewed = new Map(), batchIds = new Set(), workers = [];
const sources = new Map(), targets = new Map();
const get = (cache, p) => { if (!cache.has(p)) cache.set(p, read(p)); return cache.get(p); };
for (let worker = 1; worker <= 6; worker++) {
  const p = base + `worker${worker}.json`;
  if (!fs.existsSync(p)) continue;
  const receipt = read(p);
  assert.equal(receipt.nativeReviewed, false, p);
  const ownIds = new Set();
  for (const row of receipt.reviews) {
    assert(member.has(row.scenarioId), 'Outside Hokkaido');
    const batch = index[row.scenarioId];
    assert.equal(Number(batch) % 6, worker - 1, 'Wrong batch owner');
    assert(locales.includes(row.locale));
    const source = get(sources, `docs/localization-workspace/sources/dialogue-batch-${batch}.ja.json`).scenarios[row.scenarioId];
    const target = get(targets, `src/data/dialogue-content/locale-batches/${row.locale}/${batch}.json`).scenarios[row.scenarioId];
    const expected = Object.entries(source.turns).flatMap(([id,t]) => [id + ':translation', ...(t.hintJa ? [id + ':hintTranslation'] : [])]);
    const actual = new Set();
    for (const field of row.fields) {
      const s = source.turns[field.turnId], t = target.turns[field.turnId];
      assert(s && t);
      assert(['translation','hintTranslation'].includes(field.field));
      assert.equal(field.sourceSha256, digest(field.field === 'translation' ? s.sourceJa : s.hintJa), 'Stale source');
      assert.equal(field.targetSha256, digest(t[field.field]), 'Stale target');
      const key = field.turnId + ':' + field.field;
      assert(!actual.has(key), 'Duplicate field'); actual.add(key);
    }
    assert.deepEqual([...actual].sort(), expected.sort(), 'Missing sentence/hint evidence');
    const key = row.scenarioId + ':' + row.locale;
    assert(!reviewed.has(key), 'Duplicate scenario locale'); reviewed.set(key, worker);
    ownIds.add(row.scenarioId); batchIds.add(batch);
  }
  for (const id of ownIds) assert(locales.every(l => reviewed.get(id + ':' + l) === worker), 'Incomplete12-locale review');
  assert.equal(receipt.reviewedFields, ownIds.size * 192);
  workers.push({worker, scenarios: ownIds.size, fields: ownIds.size * 192, changes: receipt.changes.length, receipt: p, sha256: hash(p)});
}
const newIds = new Set([...reviewed.keys()].map(k => k.slice(0, k.lastIndexOf(':'))));
for (const c of hk.cities) {
  c.sentenceTaskReviewedScenarioIds = [...new Set([...c.sentenceTaskReviewedScenarioIds, ...c.pendingSentenceTaskScenarioIds.filter(id => newIds.has(id))])];
  c.pendingSentenceTaskScenarioIds = c.pendingSentenceTaskScenarioIds.filter(id => !newIds.has(id));
}
for (const p of queue.prefectures) {
  p.aiSentenceTaskReviewedScenarios = p.cities.reduce((n,c) => n + c.sentenceTaskReviewedScenarioIds.length, 0);
  p.pendingSentenceTaskScenarios = p.scenarioCount - p.aiSentenceTaskReviewedScenarios;
  p.status = p.pendingSentenceTaskScenarios === 0 ? 'AI_SENTENCE_TASK_REVIEWED' : p.aiSentenceTaskReviewedScenarios ? 'IN_PROGRESS' : 'PENDING';
}
queue.aiSentenceTaskReviewedScenarios = queue.prefectures.reduce((n,p) => n + p.aiSentenceTaskReviewedScenarios, 0);
queue.remainingSentenceTaskScenarios = queue.canonicalScenarios - queue.aiSentenceTaskReviewedScenarios;
queue.order = ['PRF-001', ...queue.order.filter(id => id !== 'PRF-001')];
const active = queue.order.map(id => queue.prefectures.find(p => p.prefectureId === id)).find(p => p.pendingSentenceTaskScenarios);
queue.activePrefectureId = active.prefectureId;
queue.activePrefectureNameJa = plan.regions.flatMap(r => r.prefectures).find(p => p.prefectureId === active.prefectureId).nameJa;
queue.nextScenarioId = active.cities.flatMap(c => c.pendingSentenceTaskScenarioIds)[0];
queue.nextBatch = index[queue.nextScenarioId];
const manifestPath = 'docs/localization-workspace/DIALOGUE_TRANSLATION_PROGRESS.json', manifest = read(manifestPath);
for (const batch of batchIds) {
  const checked = validateBatch(batch), existing = manifest.completedBatches.find(b => b.batch === batch);
  assert(existing); existing.sourceSha256 = checked.sourceSha256;
  for (const file of checked.files) existing.files.find(f => f.path === file.path).sha256 = file.sha256;
}
plan.activeRegionId = 'hokkaido';
plan.fullContextReviewedScenarios = queue.aiSentenceTaskReviewedScenarios;
plan.remainingContextScenarios = queue.remainingSentenceTaskScenarios;
for (const r of plan.regions) {
  for (const p of r.prefectures) p.contextReviewedScenarios = queue.prefectures.find(q => q.prefectureId === p.prefectureId).aiSentenceTaskReviewedScenarios;
  r.contextReviewedScenarios = r.prefectures.reduce((n,p) => n + p.contextReviewedScenarios,0);
  r.remainingScenarios = r.totalScenarios - r.contextReviewedScenarios;
  r.status = r.remainingScenarios === 0 ? 'AI_CONTEXT_REVIEWED_NOT_NATIVE_CERTIFIED' : r.contextReviewedScenarios ? 'IN_PROGRESS' : 'NOT_STARTED';
}
const output = {status:hk.pendingSentenceTaskScenarios ? 'REVISION_BOUND_AI_REVIEW_PARTIAL' : 'REVISION_BOUND_AI_CONTEXT_REVIEW_COMPLETE_NOT_NATIVE_CERTIFIED', region:'hokkaido', total:member.size, contextReviewed:hk.aiSentenceTaskReviewedScenarios, remaining:hk.pendingSentenceTaskScenarios, workers, nativeReviewed:false, semanticCrossReview:false};
for (const [p,x] of [[queuePath,queue],[manifestPath,manifest],[planPath,plan],[base+'progress.json',output]]) fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
const lines = [
  '# Rà ngữ cảnh hội thoại Hokkaido — 03/11/2026', '',
  `Đã có bằng chứng AI cho **${output.contextReviewed}/${output.total} bài**, còn **${output.remaining} bài**. ${output.remaining ? 'Chưa hoàn tất vùng.' : 'Hoàn tất lượt rà AI câu thoại/gợi ý đủ 12 ngôn ngữ; các vấn đề nguồn và nghiệm thu còn phân biệt riêng.'}`, '',
  'Sáu AI sở hữu các lô riêng theo số lô modulo 6; không kiểm chéo ngữ nghĩa. Giữ các bằng chứng hợp lệ trước đó. Chỉ cộng bài đã đọc ngữ cảnh Nhật cùng toàn bộ 11 câu thoại và 5 gợi ý trong đủ 12 ngôn ngữ; sàng lọc không tăng số này.', '',
  '| AI | Bài đã rà | Trường đã rà | Trường sửa |',
  '| --- | ---: | ---: | ---: |',
  ...workers.map(w => `| ${w.worker} | ${w.scenarios} | ${w.fields} | ${w.changes} |`), '',
  'Receipt worker1–6 ghi hash nguồn/đích và sửa đổi. assignment.json cố định phạm vi; progress.json và queue chuẩn ghi phần còn lại. Các vấn đề nguồn ghi riêng trong receipt. Bản dịch vẫn translated_ai_unreviewed; rà AI không phải duyệt bản ngữ, nghiệm thu phát âm, thiết bị hoặc phát hành.', '',
];
fs.writeFileSync(base+'README.md',lines.join('\n'));
console.log(JSON.stringify(output));
