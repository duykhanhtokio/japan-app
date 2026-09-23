import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const outputDir = 'docs/jlpt-workspace/conversion/n5-2012-12';
fs.mkdirSync(outputDir, { recursive: true });

const makeWritten = ({ section, problemNumber, answers, pages, explanationPages, overallOffset = 0 }) => answers.map((correctOptionId, index) => {
  const questionNumber = index + 1;
  const overallQuestionNumber = overallOffset + questionNumber;
  const questionSourcePages = pages(questionNumber, overallQuestionNumber);
  const explanationOrTranslationPages = explanationPages(questionNumber, overallQuestionNumber);
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
    questionVisualAudit: questionSourcePages.length ? 'checked_against_pdf_page' : 'source_question_material_absent',
    answerAudit: 'checked_against_page_13_key',
    explanationTranslationAudit: explanationOrTranslationPages.length
      ? 'simplified_chinese_source_present_not_runtime_transcribed'
      : 'source_absent_for_this_question',
    runtimeTranscriptionStatus: questionSourcePages.length
      ? 'pending_character_level_verification'
      : 'blocked_missing_question_source',
  };
});

const vocabularyAnswers = [
  3, 4, 1, 2, 3, 1, 2, 1, 1, 4, 4, 4,
  1, 3, 2, 2, 3, 2, 4, 4,
  1, 3, 3, 4, 2, 4, 2, 3, 4, 1,
  3, 1, 2, 3, 2,
];
const grammarReadingAnswers = [
  4, 1, 4, 3, 4, 2, 2, 1, 4, 4, 3, 2, 1, 2, 3, 2,
  1, 3, 2, 1, 4,
  1, 2, 3, 4, 2,
  4, 4, 3,
  2, 3,
  3,
];

const vocabularyExplanationPages = (_q, overall) => overall <= 12 ? [] : overall <= 25 ? [14] : [15];
const grammarExplanationPages = (_q, overall) => overall <= 12 ? [16] : overall <= 23 ? [17] : [18, 19];

const writtenRecords = [
  ...makeWritten({ section: 'vocabulary', problemNumber: 1, answers: vocabularyAnswers.slice(0, 12), pages: () => [2], explanationPages: vocabularyExplanationPages }),
  ...makeWritten({ section: 'vocabulary', problemNumber: 2, answers: vocabularyAnswers.slice(12, 20), pages: (q) => q === 1 ? [2] : [3], explanationPages: vocabularyExplanationPages, overallOffset: 12 }),
  ...makeWritten({ section: 'vocabulary', problemNumber: 3, answers: vocabularyAnswers.slice(20, 30), pages: () => [3], explanationPages: vocabularyExplanationPages, overallOffset: 20 }),
  ...makeWritten({ section: 'vocabulary', problemNumber: 4, answers: vocabularyAnswers.slice(30), pages: () => [4], explanationPages: vocabularyExplanationPages, overallOffset: 30 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 1, answers: grammarReadingAnswers.slice(0, 16), pages: (q) => q <= 2 ? [4] : q <= 15 ? [5] : [6], explanationPages: grammarExplanationPages }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 2, answers: grammarReadingAnswers.slice(16, 21), pages: () => [6], explanationPages: grammarExplanationPages, overallOffset: 16 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 3, answers: grammarReadingAnswers.slice(21, 26), pages: () => [6], explanationPages: grammarExplanationPages, overallOffset: 21 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 4, answers: grammarReadingAnswers.slice(26, 29), pages: () => [], explanationPages: grammarExplanationPages, overallOffset: 26 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 5, answers: grammarReadingAnswers.slice(29, 31), pages: () => [7], explanationPages: grammarExplanationPages, overallOffset: 29 }),
  ...makeWritten({ section: 'grammar-reading', problemNumber: 6, answers: grammarReadingAnswers.slice(31), pages: () => [7, 8], explanationPages: grammarExplanationPages, overallOffset: 31 }),
];

const listeningAnswers = [
  [2, 2, 3, 3, 4, 2, 3],
  [2, 4, 4, 3, 1, 1],
  [1, 2, 3, 3, 1],
  [2, 3, 1, 3, 2, 2],
];

// Local Whisper navigation markers in seconds. Every range remains
// candidate_unverified and is not an authoritative or perceptually approved boundary.
const timingSeconds = [
  ['listening-p1-q1', 214.90, 261.84],
  ['listening-p1-q2', 261.84, 318.98],
  ['listening-p1-q3', 318.98, 374.06],
  ['listening-p1-q4', 374.06, 430.78],
  ['listening-p1-q5', 430.78, 494.98],
  ['listening-p1-q6', 494.98, 558.40],
  ['listening-p1-q7', 558.40, 644.36],
  ['listening-p2-q1', 767.30, 823.62],
  ['listening-p2-q2', 823.62, 886.24],
  ['listening-p2-q3', 886.24, 947.68],
  ['listening-p2-q4', 947.68, 1011.40],
  ['listening-p2-q5', 1011.40, 1087.74],
  ['listening-p2-q6', 1087.74, 1198.08],
  ['listening-p3-q1', 1294.24, 1326.16],
  ['listening-p3-q2', 1326.16, 1360.62],
  ['listening-p3-q3', 1360.62, 1395.48],
  ['listening-p3-q4', 1395.48, 1432.92],
  ['listening-p3-q5', 1432.92, 1467.52],
  ['listening-p4-q1', 1549.72, 1581.00],
  ['listening-p4-q2', 1581.00, 1612.92],
  ['listening-p4-q3', 1612.92, 1642.52],
  ['listening-p4-q4', 1642.52, 1673.32],
  ['listening-p4-q5', 1673.32, 1705.22],
  ['listening-p4-q6', 1705.22, 1737.88],
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
    ? [questionNumber <= 5 ? 9 : 10]
    : problemNumber === 2
      ? [questionNumber <= 4 ? 10 : 11]
      : problemNumber === 3
        ? [questionNumber <= 3 ? 11 : 12]
        : [];
  return {
    auditId,
    section: 'listening',
    problemNumber,
    questionNumber,
    correctOptionId: String(correctOptionId),
    questionSourcePages,
    answerKeyPage: 13,
    transcriptSourcePages: problemNumber === 1 ? [20, 21] : problemNumber === 2 ? [21, 22] : [22],
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

assert.equal(writtenRecords.length, 67);
assert.equal(new Set(writtenRecords.map((record) => record.auditId)).size, 67);
assert.equal(listeningRecords.length, 24);
assert.equal(new Set(listeningRecords.map((record) => record.auditId)).size, 24);

const written = {
  counts: { vocabulary: 35, grammarReading: 32, total: 67 },
  records: writtenRecords,
};
const listening = {
  counts: { responses: 24, problems: [7, 6, 5, 6], candidateTimings: timingCandidates.length },
  records: listeningRecords,
};

fs.writeFileSync(path.join(outputDir, 'written.audit.json'), `${JSON.stringify(written, null, 2)}\n`);
fs.writeFileSync(path.join(outputDir, 'listening.audit.json'), `${JSON.stringify(listening, null, 2)}\n`);
console.log(`N5 2012-12 AUDIT DATA: ${writtenRecords.length} written, ${listeningRecords.length} listening, ${timingCandidates.length} timing candidates.`);
