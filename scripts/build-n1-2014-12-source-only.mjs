import assert from 'node:assert/strict';
import fs from 'node:fs';

const reviewDir = 'docs/jlpt-workspace/conversion/n1-2014-12';
const outPath = `${reviewDir}/source-only-structured.candidate.json`;
const read = (name) => JSON.parse(fs.readFileSync(`${reviewDir}/${name}`, 'utf8'));
const written = fs.readdirSync(reviewDir).filter((name) => /^written-page-\d+\.review\.json$/.test(name)).sort()
  .flatMap((name) => read(name)).sort((a, b) => a.questionNumber - b.questionNumber)
  .map((q) => ({
    questionId: `n1-2014-12-written-q${String(q.questionNumber).padStart(2, '0')}`,
    sectionId: 'written', questionNumber: q.questionNumber, problemNumber: q.problemNumber,
    sourceFamily: q.family, promptJa: q.promptJa, underlinedText: q.underlinedText,
    instructionJa: q.instructionJa, options: q.options.map((textJa, i) => ({ optionId: String(i + 1), textJa })),
    correctOptionId: q.correctOptionId, sourcePages: q.sourcePages ?? [q.sourcePage],
    verificationStatus: 'verified_against_source_image',
  }));
const files = [
  ...Array.from({ length: 6 }, (_, i) => `listening-transcript-q${String(i + 1).padStart(2, '0')}.review.json`),
  ...Array.from({ length: 7 }, (_, i) => `listening-transcript-p2-q${String(i + 1).padStart(2, '0')}.review.json`),
  ...Array.from({ length: 6 }, (_, i) => `listening-transcript-p3-q${String(i + 1).padStart(2, '0')}.review.json`),
  ...Array.from({ length: 14 }, (_, i) => `listening-transcript-p4-q${String(i + 1).padStart(2, '0')}.review.json`),
  ...Array.from({ length: 3 }, (_, i) => `listening-transcript-p5-q${String(i + 1).padStart(2, '0')}.review.json`),
];
const listening = files.flatMap((file) => {
  const q = read(file); const responses = q.responseUnits ?? [q];
  return responses.map((response, index) => ({
    questionId: `n1-2014-12-p${q.problemNumber}-q${String(response.questionNumber ?? q.questionNumber).padStart(2, '0')}${q.sharedSegment ? `-${String.fromCharCode(97 + index)}` : ''}`,
    sectionId: 'listening', problemNumber: q.problemNumber, questionNumber: response.questionNumber ?? q.questionNumber,
    promptJa: response.promptJa ?? q.promptJa, options: (response.options ?? q.options ?? []).map((textJa, i) => ({ optionId: String(i + 1), textJa })),
    correctOptionId: response.correctOptionId ?? q.correctOptionId, transcriptJa: q.transcriptJa,
    transcriptSourcePages: q.sourcePages, transcriptVerificationStatus: q.transcriptVerificationStatus,
    sourceReview: file, timingVerificationStatus: 'candidate_alignment_requires_audio_review',
  }));
});
assert.equal(written.length, 70); assert.equal(listening.length, 37);
const data = { schemaVersion: 1, examId: 'n1-2014-12-exam-06', status: 'source_only_pre_runtime', counts: { writtenResponses: 70, listeningResponses: 37, totalResponses: 107, uniqueAudioSegments: 36 }, timingGate: 'No runtime timing metadata: candidate alignment requires perceptual audio review.', questions: [...written, ...listening] };
const serialized = `${JSON.stringify(data, null, 2)}\n`;
if (process.argv.includes('--check')) assert.equal(fs.readFileSync(outPath, 'utf8'), serialized, 'source-only candidate differs from verified reviews');
else fs.writeFileSync(outPath, serialized);
console.log('N1 2014-12 source-only candidate built: 70 written + 37 listening; no runtime timing metadata.');
