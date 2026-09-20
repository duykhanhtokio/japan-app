import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const explanationDir = 'docs/jlpt-workspace/conversion/n1-2015-07/explanations';
const dataset = JSON.parse(fs.readFileSync('src/data/jlpt-official/n1-2015-07/exam.candidate.json', 'utf8'));
const written = new Map(dataset.questions.filter((question) => question.sectionId === 'written')
  .map((question) => [question.questionNumber, question]));
const sourceFiles = fs.readdirSync(explanationDir).filter((name) => /^source-page-\d+\.json$/.test(name)).sort();
const records = sourceFiles.flatMap((name) => JSON.parse(fs.readFileSync(`${explanationDir}/${name}`, 'utf8')));

assert.ok(records.length > 0, 'At least one source explanation is required');
assert.equal(new Set(records.map((record) => record.questionNumber)).size, records.length, 'Duplicate explanation question');
for (const record of records) {
  const question = written.get(record.questionNumber);
  assert.ok(question, `No source-readable written question ${record.questionNumber} in candidate dataset`);
  assert.equal(record.correctOptionId, question.correctOptionId, `Answer mismatch for question ${record.questionNumber}`);
  assert.ok(typeof record.text === 'string' && record.text.trim().length > 15, `Empty explanation ${record.questionNumber}`);
  assert.equal(record.verificationStatus, 'verified_against_source_image');
  for (const page of record.sourcePages ?? [record.sourcePage]) {
    const image = `assets/jlpt/n1/2015-07/answer-script/page-${String(page).padStart(2, '0')}.jpg`;
    const actualHash = createHash('sha256').update(fs.readFileSync(image)).digest('hex');
    assert.equal(actualHash, dataset.source.assets[image], image);
  }
}

assert.ok(!records.some((record) => record.questionNumber === 29), 'Blocked question 29 must not be inferred');
console.log(`N1 2015-07 EXPLANATION SOURCE PASS: ${records.length}/69 source-readable records; unique questions, matching source keys and image hashes; blocked question 29 absent.`);

const targetLocales = ['ja', 'en', 'vi', 'id', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km', 'tl'].sort();
const sources = new Map(records.map((record) => [record.questionNumber, record]));
const translationFiles = fs.readdirSync(explanationDir)
  .filter((name) => /^translations-q\d+-q\d+\.json$/.test(name))
  .sort();
const translations = translationFiles.flatMap((name) => JSON.parse(fs.readFileSync(`${explanationDir}/${name}`, 'utf8')));

assert.equal(new Set(translations.map((record) => record.questionNumber)).size, translations.length, 'Duplicate translation question');
for (const record of translations) {
  const source = sources.get(record.questionNumber);
  assert.ok(source, `Missing source for translated question ${record.questionNumber}`);
  assert.equal(
    record.sourceTextSha256,
    createHash('sha256').update(source.text).digest('hex'),
    `Stale translation ${record.questionNumber}`,
  );
  assert.deepEqual(
    record.localizedExplanations.map((entry) => entry.localeCode).sort(),
    targetLocales,
    `Locale coverage ${record.questionNumber}`,
  );
  for (const entry of record.localizedExplanations) {
    assert.equal(entry.generatedBy, 'AI');
    assert.equal(entry.reviewedByNativeSpeaker, false);
    assert.equal(entry.status, 'translated_ai_unreviewed');
    assert.ok(typeof entry.text === 'string' && entry.text.trim().length > 15, `Empty translation ${record.questionNumber}/${entry.localeCode}`);
    assert.ok(!/TODO|PLACEHOLDER|\uFFFD/.test(entry.text), `Invalid translation ${record.questionNumber}/${entry.localeCode}`);
  }
}

console.log(`N1 2015-07 EXPLANATION TRANSLATION PASS: ${translations.length * 12}/828 targets; all completed questions have 12 locales, source hashes and AI-unreviewed metadata; ${69 - translations.length} source-readable questions pending.`);
