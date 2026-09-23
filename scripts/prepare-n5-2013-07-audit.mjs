import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const outputDir = 'docs/jlpt-workspace/conversion/n5-2013-07';
fs.mkdirSync(outputDir, { recursive: true });

const makeWritten = ({ section, problemNumber, answers, pages, overallOffset = 0 }) => answers.map((correctOptionId, index) => {
  const questionNumber = index + 1;
  const overallQuestionNumber = overallOffset + questionNumber;
  return {
    auditId: `${section}-p${problemNumber}-q${questionNumber}`,
    section,
    problemNumber,
    questionNumber,
    overallQuestionNumber,
    correctOptionId: String(correctOptionId),
    questionSourcePages: pages(questionNumber),
    answerKeyPage: 14,
    explanationOrTranslationPages: [],
    questionVisualAudit: 'checked_against_pdf_page',
    answerAudit: 'checked_against_physical_page_14_internal_page_13_key',
    explanationTranslationAudit: 'source_absent_edited_pdf_omits_internal_pages_14_through_19',
    runtimeTranscriptionStatus: 'pending_character_level_verification',
  };
});

const vocabularyAnswers = [
  2, 1, 3, 1, 1, 2, 2, 2, 3, 3, 4, 2,
  1, 4, 3, 3, 3, 1, 2, 3,
  4, 4, 1, 4, 1, 1, 2, 3, 4, 2,
  2, 4, 3, 4, 4,
];
const grammarReadingAnswers = [
  3, 2, 4, 2, 3, 3, 4, 1, 3, 1, 2, 1, 4, 2, 1, 4,
  1, 3, 2, 4, 4,
  2, 1, 4, 2, 3,
  2, 3, 1,
  3, 4,
  4,
];

const writtenRecords = [
  ...makeWritten({ section: 'vocabulary', problemNumber: 1, answers: vocabularyAnswers.slice(0, 12), pages: () => [2] }),
  ...makeWritten({ section: 'vocabulary', problemNumber: 2, answers: vocabularyAnswers.slice(12, 20), pages: (q) => q <= 2 ? [2] : [3], overallOffset: 12 }),
  ...makeWritten({ section: 'vocabulary', problemNumber: 3, answers: vocabularyAnswers.slice(20, 30), pages: () => [3], overallOffset: 20 }),
  ...makeWritten({ section: 'vocabulary', problemNumber: 4, answers: vocabularyAnswers.slice(30), pages: () => [4], overallOffset: 30 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 1, answers: grammarReadingAnswers.slice(0, 16), pages: (q) => q <= 2 ? [4] : [5] }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 2, answers: grammarReadingAnswers.slice(16, 21), pages: () => [6], overallOffset: 16 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 3, answers: grammarReadingAnswers.slice(21, 26), pages: () => [6, 7], overallOffset: 21 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 4, answers: grammarReadingAnswers.slice(26, 29), pages: (q) => q <= 2 ? [7] : [8], overallOffset: 26 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 5, answers: grammarReadingAnswers.slice(29, 31), pages: () => [8], overallOffset: 29 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 6, answers: grammarReadingAnswers.slice(31), pages: () => [8, 9], overallOffset: 31 }),
];

const listeningAnswers = [
  [4, 1, 1, 2, 3, 4, 2],
  [3, 1, 4, 3, 2, 2],
  [1, 3, 3, 2, 3],
  [3, 3, 1, 3, 2, 2],
];

// Local Whisper navigation markers. These ranges are never authoritative and
// always remain candidate_unverified.
const timingSeconds = [
  ['listening-p1-q1', 207.72, 271.90],
  ['listening-p1-q2', 271.90, 327.96],
  ['listening-p1-q3', 327.96, 390.04],
  ['listening-p1-q4', 390.04, 453.94],
  ['listening-p1-q5', 453.94, 516.74],
  ['listening-p1-q6', 516.74, 590.00],
  ['listening-p1-q7', 590.00, 670.86],
  ['listening-p2-q1', 793.82, 851.08],
  ['listening-p2-q2', 851.08, 915.22],
  ['listening-p2-q3', 915.22, 974.70],
  ['listening-p2-q4', 974.70, 1036.66],
  ['listening-p2-q5', 1036.66, 1101.14],
  ['listening-p2-q6', 1101.14, 1224.76],
  ['listening-p3-q1', 1319.72, 1352.50],
  ['listening-p3-q2', 1352.50, 1391.08],
  ['listening-p3-q3', 1391.08, 1427.54],
  ['listening-p3-q4', 1427.54, 1462.60],
  ['listening-p3-q5', 1462.60, 1501.20],
  ['listening-p4-q1', 1583.50, 1612.94],
  ['listening-p4-q2', 1612.94, 1642.22],
  ['listening-p4-q3', 1642.22, 1673.40],
  ['listening-p4-q4', 1673.40, 1694.50],
  ['listening-p4-q5', 1694.50, 1737.10],
  ['listening-p4-q6', 1737.10, 1772.78],
];
const timingCandidates = timingSeconds.map(([auditId, startSeconds, endSeconds]) => ({
  auditId,
  start: Math.round(startSeconds * 1000),
  end: Math.round(endSeconds * 1000),
}));
assert.ok(timingCandidates.every((item, index) => item.start === Math.round(timingSeconds[index][1] * 1000) && item.end === Math.round(timingSeconds[index][2] * 1000)));

const listeningRecords = listeningAnswers.flatMap((answers, problemIndex) => answers.map((correctOptionId, index) => {
  const problemNumber = problemIndex + 1;
  const questionNumber = index + 1;
  const auditId = `listening-p${problemNumber}-q${questionNumber}`;
  const timing = timingCandidates.find((item) => item.auditId === auditId) ?? null;
  const questionSourcePages = problemNumber === 1
    ? [questionNumber <= 4 ? 10 : 11]
    : problemNumber === 2
      ? [questionNumber <= 4 ? 11 : 12]
      : problemNumber === 3
        ? [questionNumber <= 2 ? 12 : 13]
        : [];
  return {
    auditId,
    section: 'listening',
    problemNumber,
    questionNumber,
    correctOptionId: String(correctOptionId),
    questionSourcePages,
    answerKeyPage: 14,
    transcriptSourcePages: problemNumber === 1 ? [15, 16] : problemNumber === 2 ? [16] : [16, 17],
    questionVisualAudit: questionSourcePages.length ? 'checked_against_pdf_page' : 'not_applicable_audio_only',
    answerAudit: 'checked_against_physical_page_14_internal_page_13_key',
    transcriptAudit: 'source_present; audio_cross_check_and_character_level_runtime_transcription_pending',
    timingMs: timing ? { start: timing.start, end: timing.end } : null,
    timingEvidence: timing ? { method: 'local Whisper small word-timestamp navigation aligned to printed transcript question markers', authoritativeSourceTiming: false } : null,
    timingVerificationStatus: timing ? 'candidate_unverified' : 'missing',
    humanReviewed: false,
    perceptualApproval: false,
    reviewDisposition: 'needs_later_review',
  };
}));

assert.equal(writtenRecords.length, 67);
assert.equal(new Set(writtenRecords.map((record) => record.auditId)).size, 67);
assert.equal(listeningRecords.length, 24);
assert.equal(new Set(listeningRecords.map((record) => record.auditId)).size, 24);

fs.writeFileSync(path.join(outputDir, 'written.audit.json'), `${JSON.stringify({ counts: { vocabulary: 35, grammarReading: 32, total: 67 }, records: writtenRecords }, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, 'listening.audit.json'), `${JSON.stringify({ counts: { responses: 24, problems: [7, 6, 5, 6], candidateTimings: timingCandidates.length }, records: listeningRecords }, null, 2)}\n`);
console.log(`N5 2013-07 AUDIT DATA: ${writtenRecords.length} written, ${listeningRecords.length} listening, ${timingCandidates.length} timing candidates.`);
