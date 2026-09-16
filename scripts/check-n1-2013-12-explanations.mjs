import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const dir = 'docs/jlpt-workspace/conversion/n1-2013-12/explanations';
const dataset = JSON.parse(fs.readFileSync('src/data/jlpt-official/n1-2013-12/exam.candidate.json', 'utf8'));
const questions = new Map(dataset.questions.filter((q) => q.sectionId === 'written').map((q) => [q.questionNumber, q]));
const records = fs.readdirSync(dir).filter((name) => /^source-page-\d+\.json$/.test(name)).sort()
  .flatMap((name) => JSON.parse(fs.readFileSync(`${dir}/${name}`, 'utf8')));
assert.ok(records.length > 0);
assert.equal(new Set(records.map((r) => r.questionNumber)).size, records.length);
for (const r of records) {
  const question = questions.get(r.questionNumber);
  assert.ok(question, `Unknown question ${r.questionNumber}`);
  assert.equal(r.correctOptionId, question.correctOptionId);
  assert.ok(r.text.length > 15);
  assert.equal(r.verificationStatus, 'verified_against_source_image');
  const image = `assets/jlpt/n1/2013-12/answer-script/page-${String(r.sourcePage).padStart(2, '0')}.jpg`;
  assert.equal(createHash('sha256').update(fs.readFileSync(image)).digest('hex'), dataset.source.assets[image]);
}
if (process.argv.includes('--complete')) assert.equal(records.length, 70);
console.log(`N1 2013-12 EXPLANATION SOURCE PASS: ${records.length}/70 records, unique questions, matching source keys and image hashes.`);
