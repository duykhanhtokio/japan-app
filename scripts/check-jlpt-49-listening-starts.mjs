import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const starts = JSON.parse(readFileSync(path.join(root, 'src/data/jlpt-official/listening-start-overrides.json'), 'utf8'));
const registry = readFileSync(path.join(root, 'src/data/jlpt-official/approved-n1-exams.ts'), 'utf8');
const runner = readFileSync(path.join(root, 'src/components/jlpt/N1OfficialTrial.tsx'), 'utf8');
const selected = Object.fromEntries(Object.entries(starts)
  .filter(([id]) => /^n[123]-/.test(id) || /^n4-(2012-12|2013-07|2013-12|2014-07)-/.test(id))
  .sort(([a], [b]) => a.localeCompare(b, 'en')));
const entries = Object.entries(selected);
const digest = createHash('sha256').update(JSON.stringify(selected)).digest('hex');
const expected = 'aa893dbcad85ffd425013b75237ede739b7127bdf71e5b530936ca0d7a303fc6';
const failures = [];

if (entries.length !== 49) failures.push(`expected 49 starts; found ${entries.length}`);
if (digest !== expected) failures.push(`49 saved start positions differ from backup commit 294b7045 (${digest})`);
for (const [id, milliseconds] of entries) {
  if (!Number.isInteger(milliseconds) || milliseconds < 0) failures.push(`invalid start: ${id}`);
  if (!registry.includes(`id: '${id}'`)) failures.push(`start is not registered in the runnable exam registry: ${id}`);
}
if (!runner.includes('getJlptListeningStart(exam.id)') || !runner.includes('Math.max(listeningStartMs / 1000, listeningPosition.current / 1000)')) {
  failures.push('approved exam runner no longer uses the saved listening start when playing');
}

if (failures.length) {
  for (const failure of failures) console.error(failure);
  process.exitCode = 1;
} else console.log('JLPT 49 LISTENING STARTS PASS: exact backup values, 49 registered exams, runtime seek wiring');
