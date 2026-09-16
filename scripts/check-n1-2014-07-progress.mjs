import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const base = 'docs/jlpt-workspace/conversion/n1-2014-07';
const manifest = JSON.parse(fs.readFileSync(`${base}/source-manifest.json`, 'utf8'));
assert.equal(manifest.examId, 'n1-2014-07-exam-05');
assert.equal(manifest.assets.length, 29);
for (const a of manifest.assets) {
  const bytes = fs.readFileSync(a.path);
  assert.equal(bytes.length, a.bytes, a.path);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), a.sha256, a.path);
}
const source = fs.readFileSync('src/data/jlpt-mock/n1-2014-07-official.ts', 'utf8');
const key = JSON.parse(`[${source.match(/WRITTEN_KEY = \[([\s\S]*?)\] as const/)[1].replace(/,\s*$/, '')}]`);
assert.equal(key.length, 70);
const files = fs.readdirSync(base).filter(n => /^written-.*\.review\.json$/.test(n)).sort();
const rows = files.flatMap(n => JSON.parse(fs.readFileSync(`${base}/${n}`, 'utf8')));
const seen = new Set();
for (const q of rows) {
  assert(!seen.has(q.questionNumber), `Duplicate ${q.questionNumber}`); seen.add(q.questionNumber);
  assert.equal(q.correctOptionId, String(key[q.questionNumber - 1]), `Key ${q.questionNumber}`);
  assert.equal(q.options.length, 4); assert(q.options.every(x => typeof x === 'string' && x.trim()));
  assert(q.promptJa.trim()); assert(q.instructionJa.trim());
  assert(manifest.assets.some(x => x.path.endsWith(`/question/page-${String(q.sourcePage).padStart(2, '0')}.jpg`)));
  if (q.underlinedText) assert(q.promptJa.includes(q.underlinedText));
}
assert.deepEqual([...seen].sort((a,b) => a-b), Array.from({length:rows.length}, (_,i)=>i+1));
if (process.argv.includes('--complete-written')) assert.equal(rows.length, 70);
console.log(`N1 2014-07 PROGRESS PASS: ${rows.length}/70 written, exact answer keys, options, contiguous sequence and 29 source hashes; listening/translation remain pending.`);
