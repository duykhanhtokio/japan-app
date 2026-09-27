import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const dir = 'docs/jlpt-workspace/conversion/n1-2014-12/explanations';
const dataset = JSON.parse(fs.readFileSync('src/data/jlpt-official/n1-2014-12/exam.candidate.json', 'utf8'));
const questions = new Map(dataset.questions.filter((question) => question.sectionId === 'written').map((question) => [question.questionNumber, question]));
const sources = fs.readdirSync(dir).filter((name) => /^source-page-\d+\.json$/.test(name)).sort()
  .flatMap((name) => JSON.parse(fs.readFileSync(`${dir}/${name}`, 'utf8')));
assert.equal(sources.length, 70);
assert.equal(new Set(sources.map((record) => record.questionNumber)).size, 70);
const knownSourceKeyMismatches = sources
  .filter((record) => questions.get(record.questionNumber)?.correctOptionId !== record.correctOptionId)
  .map((record) => ({ questionNumber: record.questionNumber, explanationSource: record.correctOptionId, runtime: questions.get(record.questionNumber)?.correctOptionId }));
assert.deepEqual(knownSourceKeyMismatches, [
  { questionNumber: 44, explanationSource: '4', runtime: '3' },
  { questionNumber: 45, explanationSource: '1', runtime: '2' },
]);
for (const record of sources) {
  const question = questions.get(record.questionNumber);
  assert.ok(question, `Unknown question ${record.questionNumber}`);
  if (![44, 45].includes(record.questionNumber)) assert.equal(record.correctOptionId, question.correctOptionId);
  assert.ok(record.text.length > 15);
  assert.equal(record.verificationStatus, 'verified_against_source_image');
}

const targetLocales = ['ja', 'en', 'vi', 'id', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km', 'tl'].sort();
const sourceByQuestion = new Map(sources.map((record) => [record.questionNumber, record]));
const translated = fs.readdirSync(dir).filter((name) => /^translations-q\d+-q\d+\.json$/.test(name)).sort()
  .flatMap((name) => JSON.parse(fs.readFileSync(`${dir}/${name}`, 'utf8')));
assert.equal(new Set(translated.map((record) => record.questionNumber)).size, translated.length, 'Duplicate translation question');
for (const record of translated) {
  const source = sourceByQuestion.get(record.questionNumber);
  assert.ok(source, `Missing source for translated question ${record.questionNumber}`);
  assert.equal(record.sourceTextSha256, createHash('sha256').update(source.text).digest('hex'), `Stale translation ${record.questionNumber}`);
  assert.deepEqual(record.localizedExplanations.map((entry) => entry.localeCode).sort(), targetLocales, `Locale coverage ${record.questionNumber}`);
  for (const entry of record.localizedExplanations) {
    assert.equal(entry.generatedBy, 'AI');
    assert.equal(entry.reviewedByNativeSpeaker, false);
    assert.equal(entry.status, 'translated_ai_unreviewed');
    assert.ok(typeof entry.text === 'string' && entry.text.trim().length > 15, `Empty translation ${record.questionNumber}/${entry.localeCode}`);
    assert.ok(!/TODO|PLACEHOLDER|\uFFFD/.test(entry.text), `Invalid translation ${record.questionNumber}/${entry.localeCode}`);
  }
}
if (process.argv.includes('--complete-translations')) assert.equal(translated.length, 70);
console.log(`N1 2014-12 EXPLANATION PASS: 70/70 source records and ${translated.length * 12}/840 AI-unreviewed translation targets validated; ${70 - translated.length} questions pending.`);
