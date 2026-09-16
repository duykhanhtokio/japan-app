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
  for (const page of r.sourcePages ?? [r.sourcePage]) {
    const image = `assets/jlpt/n1/2013-12/answer-script/page-${String(page).padStart(2, '0')}.jpg`;
    assert.equal(createHash('sha256').update(fs.readFileSync(image)).digest('hex'), dataset.source.assets[image]);
  }
}
if (process.argv.includes('--complete')) assert.equal(records.length, 70);
console.log(`N1 2013-12 EXPLANATION SOURCE PASS: ${records.length}/70 records, unique questions, matching source keys and image hashes.`);

const targetLocales = ['ja', 'en', 'vi', 'id', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km', 'tl'].sort();
const sources = new Map(records.map((r) => [r.questionNumber, r]));
const translated = fs.readdirSync(dir).filter((name) => /^translations-q\d+-q\d+\.json$/.test(name)).sort()
  .flatMap((name) => JSON.parse(fs.readFileSync(`${dir}/${name}`, 'utf8')));
assert.equal(new Set(translated.map((r) => r.questionNumber)).size, translated.length, 'Duplicate translation question');
for (const r of translated) {
  const source = sources.get(r.questionNumber);
  assert.ok(source, `Missing source for translated question ${r.questionNumber}`);
  assert.equal(r.sourceTextSha256, createHash('sha256').update(source.text).digest('hex'), `Stale translation ${r.questionNumber}`);
  assert.deepEqual(r.localizedExplanations.map((entry) => entry.localeCode).sort(), targetLocales, `Locale coverage ${r.questionNumber}`);
  for (const entry of r.localizedExplanations) {
    assert.equal(entry.generatedBy, 'AI');
    assert.equal(entry.reviewedByNativeSpeaker, false);
    assert.equal(entry.status, 'translated_ai_unreviewed');
    assert.ok(typeof entry.text === 'string' && entry.text.trim().length > 15, `Empty translation ${r.questionNumber}/${entry.localeCode}`);
    assert.ok(!/TODO|PLACEHOLDER|\uFFFD/.test(entry.text), `Invalid translation ${r.questionNumber}/${entry.localeCode}`);
  }
}
if (process.argv.includes('--complete-translations')) {
  assert.equal(records.length, 70);
  assert.equal(translated.length, 70, 'All 70 questions must have 12 target translations');
}
console.log(`N1 2013-12 EXPLANATION TRANSLATION PASS: ${translated.length * 12}/840 targets; each completed question has all 12 locales, source hashes and AI-unreviewed metadata. Remaining questions are pending.`);
