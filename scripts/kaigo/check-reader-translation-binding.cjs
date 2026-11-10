// Exercises the shipped selector with real rows and stale/missing source mutations.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const root = path.resolve(__dirname, '../..');
const esbuild = require(require.resolve('esbuild', { paths: [process.env.TOKUTEI_QA_MODULES || root] }));
const output = esbuild.buildSync({
  entryPoints: [path.join(root, 'src/data/kaigo/reader-communication-localization.ts')],
  bundle: true, platform: 'node', format: 'cjs', write: false,
});
const compiled = new Module('reader-binding-test');
compiled._compile(output.outputFiles[0].text, 'reader-binding-test.cjs');
const { getCommunicationReaderTranslation: get } = compiled.exports;
const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/kaigo/reader-communication-checks.json')));
const locales = ['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
let aligned = 0, rejected = 0;
for (const row of data.checks) {
  for (const locale of locales) {
    assert.deepEqual(get(row, locale), row.translations[locale]); aligned++;
    for (const field of ['promptJa', 'modelAnswerJa', 'teachingJa']) {
      const changed = structuredClone(row); changed[field] = (changed[field] || '') + '変更';
      assert.equal(get(changed, locale), undefined, `${row.id}/${locale}/${field}`); rejected++;
    }
    for (const field of ['prompt', 'modelAnswer', ...(row.teachingJa ? ['teaching'] : [])]) {
      const changed = structuredClone(row); changed.translations[locale][field] = ' ';
      assert.equal(get(changed, locale), undefined, `${row.id}/${locale}/empty-${field}`); rejected++;
    }
  }
  assert.equal(get({ ...row, id: 'unknown-check' }, 'vi'), undefined); rejected++;
  assert.equal(get(row, 'unknown-locale'), undefined); rejected++;
  if (row.teachingJa) {
    const changed = structuredClone(row); delete changed.teachingJa;
    assert.equal(get(changed, 'vi'), undefined); rejected++;
  }
}
console.log(JSON.stringify({ status: 'PASS_KAIGO_READER_TRANSLATION_BINDING', checks: data.checks.length,
  alignedLocalePairs: aligned, staleOrMissingMutationsRejected: rejected, nativeOrSemanticAcceptance: false }));
