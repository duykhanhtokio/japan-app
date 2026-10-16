// Exercise every new or edited complete locale-week through the actual reader and assessment.
// Runtime checks certify neither translation meaning nor independent language/domain approval.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync, execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const batch = process.env.KAIGO_TRANSLATION_BATCH;
assert(/^\d{2}$/.test(batch ?? ''), 'Set KAIGO_TRANSLATION_BATCH to the checkpoint number');
const reportPath = path.join(root, `docs/ssw-workspace/kaigo/reviews/TRANSLATION_BATCH${batch}_RUNTIME.json`);
assert(!fs.existsSync(reportPath), 'Preserve completed checkpoint runtime reports');
const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
const changed = new Set([...git(['diff', '--name-only', 'HEAD']), ...git(['ls-files', '--others', '--exclude-standard'])]);
for (const value of (process.env.KAIGO_TRANSLATION_FULL_WEEKS ?? '').split(',').filter(Boolean)) {
  const week = Number(value);
  assert(Number.isInteger(week) && week >= 1 && week <= 26, 'Invalid full-week runtime scope');
  const prefix = `week-${String(week).padStart(2, '0')}.`;
  const directory = 'src/data/kaigo/japanese-master/translations';
  for (const file of fs.readdirSync(path.join(root, directory))) if (file.startsWith(prefix)) changed.add(`${directory}/${file}`);
}
const groups = new Map();
for (const file of changed) {
  const match = file.match(/^src\/data\/kaigo\/japanese-master\/translations\/week-(\d{2})\.(en|vi|id|zh-CN|zh-TW|hi|bn|ne|my|th|km|tl)\.json$/);
  if (!match) continue;
  assert(fs.existsSync(path.join(root, file)), 'Removed batches require explicit review');
  const week = Number(match[1]);
  groups.set(week, [...(groups.get(week) ?? []), match[2]]);
}
assert(groups.size, 'No changed complete locale-week files to exercise');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'kaigo-batch-runtime-'));
const reports = [];
for (const [week, locales] of [...groups].sort((a, b) => a[0] - b[0])) {
  locales.sort();
  const output = path.join(temporary, `week-${week}.json`);
  const result = spawnSync(process.execPath, [path.join(__dirname, 'check-kaigo-direct-translations.cjs')], {
    cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, KAIGO_TRANSLATION_WEEK: String(week),
      KAIGO_TRANSLATION_LOCALES: locales.join(','), KAIGO_TRANSLATION_REPORT: output },
  });
  if (result.error || result.status !== 0) {
    process.stderr.write((result.stdout ?? '') + (result.stderr ?? ''));
    throw result.error ?? new Error(`Week${week} runtime failed`);
  }
  const report = JSON.parse(fs.readFileSync(output, 'utf8'));
  assert.equal(report.counts.length, locales.length);
  reports.push(report);
  console.log(JSON.stringify({ week, locales, status: 'PASS' }));
}
// Publish reports only after the entire selected snapshot passes.
for (const report of reports) {
  if (report.counts.length === 6) fs.writeFileSync(path.join(root,
    `docs/ssw-workspace/kaigo/reviews/TRANSLATION_WEEK${String(report.week).padStart(2, '0')}_RUNTIME.json`),
  JSON.stringify(report, null, 2) + '\n');
}
const aggregate = {
  status: 'PASS_CHANGED_DIRECT_TRANSLATION_BATCH_NATIVE_HOST_RUNTIME',
  weeks: reports,
  weekLocalePairsChecked: reports.reduce((n, r) => n + r.counts.length, 0),
  readerDayLocaleModeCases: reports.reduce((n, r) => n + r.readerDayLocaleModeCases, 0),
  paragraphDisplayPairsChecked: reports.reduce((n, r) => n + r.paragraphDisplayPairsChecked, 0),
  selectedLocaleOnly: true, staleTranslationsRejected: true, noRationalesBeforeSubmission: true,
  semanticQualityCertifiedByRuntime: false, humanReviewed: false, domainReviewed: false,
  nativeReviewed: false, nativeDeviceTested: false, releaseReady: false,
};
fs.writeFileSync(reportPath, JSON.stringify(aggregate, null, 2) + '\n');
console.log(JSON.stringify({ ...aggregate, weeks: undefined }));
