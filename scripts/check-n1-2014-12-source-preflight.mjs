import assert from 'node:assert/strict';
import fs from 'node:fs';

const reviewDir = 'docs/jlpt-workspace/conversion/n1-2014-12';
const read = (name) => JSON.parse(fs.readFileSync(`${reviewDir}/${name}`, 'utf8'));
const written = fs.readdirSync(reviewDir).filter((name) => /^written-page-\d+\.review\.json$/.test(name)).sort()
  .flatMap((name) => read(name)).sort((a, b) => a.questionNumber - b.questionNumber);
assert.equal(written.length, 70);
assert.deepEqual(written.map((q) => q.questionNumber), Array.from({ length: 70 }, (_, i) => i + 1));
for (const q of written) {
  assert.equal(q.options.length, 4, `written ${q.questionNumber}`);
  assert.ok(q.options[Number(q.correctOptionId) - 1], `written key ${q.questionNumber}`);
  assert.ok(q.promptJa && (q.sourcePage || q.sourcePages?.length), `written source ${q.questionNumber}`);
}
const names = [
  ...Array.from({ length: 6 }, (_, i) => `listening-transcript-q${String(i + 1).padStart(2, '0')}.review.json`),
  ...Array.from({ length: 7 }, (_, i) => `listening-transcript-p2-q${String(i + 1).padStart(2, '0')}.review.json`),
  ...Array.from({ length: 6 }, (_, i) => `listening-transcript-p3-q${String(i + 1).padStart(2, '0')}.review.json`),
  ...Array.from({ length: 14 }, (_, i) => `listening-transcript-p4-q${String(i + 1).padStart(2, '0')}.review.json`),
  ...Array.from({ length: 3 }, (_, i) => `listening-transcript-p5-q${String(i + 1).padStart(2, '0')}.review.json`),
];
assert.equal(names.length, 36);
const responseCount = names.reduce((total, name) => {
  const data = read(name);
  assert.equal(data.transcriptVerificationStatus, 'verified_against_source_image', name);
  assert.equal(data.audioTimingStatus, 'not_yet_transcribed_or_aligned', name);
  assert.ok(data.transcriptJa.length > 20, name);
  return total + (data.responseUnits?.length ?? 1);
}, 0);
assert.equal(responseCount, 37);
const alignment = read('audio-alignment-candidates.json');
assert.equal(alignment.timingVerificationStatus, 'candidate_alignment_requires_audio_review');
assert.equal(alignment.segments.length, 36);
console.log('N1 2014-12 SOURCE PREFLIGHT PASS: 70 written; 36 listening source files; 37 scored responses; timing remains candidate-only.');
