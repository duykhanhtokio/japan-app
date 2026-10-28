// Verify saved attempts across the actual two revised mock forms.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

(async () => {
  const built = await require('esbuild').build({
    entryPoints: [path.join(root, 'src/services/manufacturing-mock-state.ts')],
    bundle: true, platform: 'node', format: 'cjs', write: false,
  });
  const module = {exports: {}};
  new Function('module', 'exports', built.outputFiles[0].text)(module, module.exports);
  const state = module.exports;
  const patch = read('docs/ssw-workspace/manufacturing/batch21/mock-editorial-patches.json');
  let staleRejected = 0, unchangedRestored = 0, currentRestored = 0;
  for (const exam of read(patch.sourcePath).exams) {
    const old = structuredClone(exam);
    if (patch.examRevisions[exam.id]) {
      old.revision = patch.examRevisions[exam.id].before;
      for (const section of Object.values(old.sections)) {
        section.questions = section.questions.map(q =>
          patch.patches.find(p => p.questionId === q.id)?.before || q);
      }
    }
    let attempt = state.startManufacturingMockSection(state.freshManufacturingMock(old), old, 'theory', 1000);
    attempt = state.answerManufacturingMock(attempt, old, 'theory', 0, 0, 1100);
    attempt = state.navigateManufacturingMock(attempt, old, 'theory', 5, 1200);
    const restored = state.restoreManufacturingMock(JSON.stringify(attempt), exam);
    if (patch.examRevisions[exam.id]) {
      assert.equal(restored, null, 'Revised form must reject stale answers/timer');
      staleRejected++;
    } else {
      assert.deepEqual(restored, attempt, 'Unchanged form must preserve answers/position/timer');
      unchangedRestored++;
    }
    const fresh = state.startManufacturingMockSection(state.freshManufacturingMock(exam), exam, 'theory', 2000);
    assert.deepEqual(state.restoreManufacturingMock(JSON.stringify(fresh), exam), fresh);
    currentRestored++;
  }
  assert.equal(staleRejected, 2);
  assert.equal(unchangedRestored, 8);
  assert.equal(currentRestored, 10);
  console.log(JSON.stringify({status: 'PASS', staleRevisedFormsRejected: staleRejected,
    unchangedFormsRestored: unchangedRestored, currentFormsRestored: currentRestored,
    scope: 'Actual mock data and state service; no browser/native-device certification.'}));
})().catch(error => {console.error(error); process.exitCode = 1;});
