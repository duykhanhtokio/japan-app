const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../../../..');
const read = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const digest = s => crypto.createHash('sha256').update(s).digest('hex');
const {validateBatch,locales} = require(path.join(root,'scripts/lib/dialogue-translation-validation.cjs'));
const index = read('src/data/dialogue-content/locale-batch-index.json');
const ids = new Map(); let fields=0,repairs=0;
const cache = new Map();
for(const filename of fs.readdirSync(__dirname).filter(n=>/^worker-[1-9]\d*\.json$/.test(n)).sort()) {
  const receipt=JSON.parse(fs.readFileSync(path.join(__dirname,filename),'utf8'));
  assert.equal(receipt.nativeReviewed,false);
  for(const row of receipt.reviews) {
    const batch=index[row.scenarioId];
    if(!cache.has(batch)) {
      validateBatch(batch);
      cache.set(batch,{source:read(`docs/localization-workspace/sources/dialogue-batch-${batch}.ja.json`),
        targets:Object.fromEntries(locales.map(l=>[l,read(`src/data/dialogue-content/locale-batches/${l}/${batch}.json`)]))});
    }
    const data=cache.get(batch), seen=new Set();
    for(const f of row.fields) {
      const source=data.source.scenarios[row.scenarioId].turns[f.turnId];
      const target=data.targets[row.locale].scenarios[row.scenarioId].turns[f.turnId];
      assert.equal(digest(source[f.field==='hintTranslation'?'hintJa':'sourceJa']),f.sourceSha256);
      assert.equal(digest(target[f.field]),f.targetSha256);
      seen.add(f.turnId+':'+f.field);fields++;
    }
    assert.equal(seen.size,16);
    if(!ids.has(row.scenarioId))ids.set(row.scenarioId,new Set());
    ids.get(row.scenarioId).add(row.locale);
  }
  repairs+=receipt.changes.length;
}
for(const ls of ids.values())assert.deepEqual([...ls].sort(),[...locales].sort());
const progress=JSON.parse(fs.readFileSync(path.join(__dirname,'progress.json'),'utf8'));
assert.equal(progress.reviewed,ids.size);assert.equal(fields,ids.size*192);
const q=read('docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json');
const queued=new Set(q.prefectures.filter(p=>Number(p.prefectureId.slice(-3))>=40)
  .flatMap(p=>p.cities.flatMap(c=>c.sentenceTaskReviewedScenarioIds)));
assert.deepEqual(queued,new Set(ids.keys()));
const report={status:'PASS_KYUSHU_OKINAWA_SOURCE_TARGET_BINDINGS',reviewedScenarios:ids.size,
  reviewedFields:fields,repairs,validatedBatches:cache.size,total:1064,remaining:1064-ids.size,
  nativeReviewed:false,releaseAccepted:false,
  corpusGate:'NOT_RUN_BY_THIS_SCOPED_CHECK',
  scope:'Only this region; use check-dialogue-release-readiness.cjs for the complete corpus.',
  originalRemoteIntegrationBaseline:'4196b82f9590e97f4020e9b34c1865e550dc8a7f'};
fs.writeFileSync(path.join(__dirname,'integration-qa.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
