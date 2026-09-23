import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const outputDir = 'docs/jlpt-workspace/conversion/n5-2011-12';
fs.mkdirSync(outputDir, { recursive: true });

const makeWritten = ({ section, problemNumber, answers, pages, overallOffset = 0 }) => answers.map((correctOptionId, index) => {
  const questionNumber = index + 1;
  const overallQuestionNumber = overallOffset + questionNumber;
  const questionSourcePages = pages(questionNumber);
  const explanationOrTranslationPages = section === 'vocabulary'
    ? (overallQuestionNumber <= 12 ? [14] : overallQuestionNumber <= 25 ? [15] : [16])
    : (overallQuestionNumber <= 14 ? [overallQuestionNumber <= 3 ? 16 : 17] : overallQuestionNumber >= 27 ? [18] : []);
  return {
    auditId: `${section}-p${problemNumber}-q${questionNumber}`,
    section,
    problemNumber,
    questionNumber,
    overallQuestionNumber,
    correctOptionId: String(correctOptionId),
    questionSourcePages,
    answerKeyPage: 13,
    explanationOrTranslationPages,
    questionVisualAudit: 'checked_against_pdf_page',
    answerAudit: 'checked_against_page_13_key',
    explanationTranslationAudit: explanationOrTranslationPages.length
      ? 'simplified_chinese_source_present_not_runtime_transcribed'
      : 'source_absent_for_this_question',
    runtimeTranscriptionStatus: 'pending_character_level_verification',
  };
});

const vocabularyAnswers = [
  2, 4, 1, 2, 2, 3, 4, 2, 2, 3,
  1, 2, 3, 4, 4, 1, 3, 1,
  4, 3, 1, 1, 3, 2, 1, 4, 2, 4,
  3, 1, 2, 3, 4,
];
const grammarReadingAnswers = [
  2, 3, 2, 4, 3, 2, 3, 1, 3, 3, 1, 1, 4, 2, 4, 1,
  4, 1, 4, 2, 2,
  4, 2, 4, 3, 1,
  2, 3, 4,
  4, 3,
  2,
];

const writtenRecords = [
  ...makeWritten({ section: 'vocabulary', problemNumber: 1, answers: vocabularyAnswers.slice(0, 10), pages: () => [2], overallOffset: 0 }),
  ...makeWritten({ section: 'vocabulary', problemNumber: 2, answers: vocabularyAnswers.slice(10, 18), pages: (q) => q <= 3 ? [2] : [3], overallOffset: 10 }),
  ...makeWritten({ section: 'vocabulary', problemNumber: 3, answers: vocabularyAnswers.slice(18, 28), pages: () => [3], overallOffset: 18 }),
  ...makeWritten({ section: 'vocabulary', problemNumber: 4, answers: vocabularyAnswers.slice(28, 33), pages: () => [4], overallOffset: 28 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 1, answers: grammarReadingAnswers.slice(0, 16), pages: (q) => q <= 12 ? [5] : [6], overallOffset: 0 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 2, answers: grammarReadingAnswers.slice(16, 21), pages: () => [6], overallOffset: 16 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 3, answers: grammarReadingAnswers.slice(21, 26), pages: () => [7], overallOffset: 21 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 4, answers: grammarReadingAnswers.slice(26, 29), pages: (q) => q <= 2 ? [7] : [8], overallOffset: 26 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 5, answers: grammarReadingAnswers.slice(29, 31), pages: () => [8], overallOffset: 29 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 6, answers: grammarReadingAnswers.slice(31), pages: () => [9], overallOffset: 31 }),
];

const listeningAnswers = [
  [2, 2, 3, 3, 1, 4, 4],
  [4, 3, 2, 4, 1, 3],
  [1, 3, 2, 3, 2],
  [1, 1, 2, 3, 3, 1],
];

// Local Whisper navigation markers in seconds. Conversion to integer milliseconds is mechanical;
// these ranges remain candidate_unverified and are never authoritative or perceptually approved.
const timingSeconds = [
  ['listening-p1-q1', 172.90, 235.64],
  ['listening-p1-q2', 235.64, 293.56],
  ['listening-p1-q3', 293.56, 346.78],
  ['listening-p1-q4', 346.78, 413.46],
  ['listening-p1-q5', 413.46, 487.38],
  ['listening-p1-q6', 487.38, 555.00],
  ['listening-p1-q7', 555.00, 635.20],
  ['listening-p2-q1', 757.96, 827.26],
  ['listening-p2-q2', 827.26, 900.58],
  ['listening-p2-q3', 900.58, 964.36],
  ['listening-p2-q4', 964.36, 1026.20],
  ['listening-p2-q5', 1026.20, 1092.20],
  ['listening-p2-q6', 1092.20, 1164.80],
  ['listening-p3-q1', 1259.58, 1292.72],
  ['listening-p3-q2', 1292.72, 1328.38],
  ['listening-p3-q3', 1328.38, 1361.80],
  ['listening-p3-q4', 1361.80, 1396.66],
  ['listening-p3-q5', 1396.66, 1436.44],
  ['listening-p4-q1', 1518.26, 1547.18],
  ['listening-p4-q2', 1547.18, 1577.14],
  ['listening-p4-q3', 1577.14, 1607.48],
  ['listening-p4-q4', 1607.48, 1634.10],
  ['listening-p4-q5', 1634.10, 1666.54],
  ['listening-p4-q6', 1666.54, 1696.24],
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
  const questionSourcePages = problemNumber === 1 && questionNumber <= 4
    ? [10]
    : problemNumber === 3
      ? [questionNumber <= 4 ? 11 : 12]
      : [];
  return {
    auditId,
    section: 'listening',
    problemNumber,
    questionNumber,
    correctOptionId: String(correctOptionId),
    questionSourcePages,
    answerKeyPage: 13,
    transcriptSourcePages: problemNumber === 1 ? [19] : problemNumber === 2 ? [20] : problemNumber === 3 ? [20, 21] : [21],
    questionVisualAudit: questionSourcePages.length ? 'checked_against_pdf_page' : 'not_applicable_audio_only',
    answerAudit: 'checked_against_page_13_key',
    transcriptAudit: 'source_present; audio_cross_check_and_character_level_runtime_transcription_pending',
    timingMs: timing ? { start: timing.start, end: timing.end } : null,
    timingEvidence: timing ? {
      method: 'local Whisper small word-timestamp navigation aligned to printed transcript question markers',
      authoritativeSourceTiming: false,
    } : null,
    timingVerificationStatus: timing ? 'candidate_unverified' : 'missing',
    humanReviewed: false,
    perceptualApproval: false,
    reviewDisposition: 'needs_later_review',
  };
}));

assert.equal(writtenRecords.length, 65);
assert.equal(new Set(writtenRecords.map((record) => record.auditId)).size, 65);
assert.equal(listeningRecords.length, 24);
assert.equal(new Set(listeningRecords.map((record) => record.auditId)).size, 24);

const written = {
  counts: { vocabulary: 33, grammarReading: 32, total: 65 },
  records: writtenRecords,
};
const listening = {
  counts: { responses: 24, problems: [7, 6, 5, 6], candidateTimings: timingCandidates.length },
  records: listeningRecords,
};

fs.writeFileSync(path.join(outputDir, 'written.audit.json'), `${JSON.stringify(written, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, 'listening.audit.json'), `${JSON.stringify(listening, null, 2)}\n`);
console.log(`N5 2010-2011 AUDIT DATA: ${writtenRecords.length} written, ${listeningRecords.length} listening, ${timingCandidates.length} timing candidates.`);
