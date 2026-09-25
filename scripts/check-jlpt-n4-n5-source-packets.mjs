import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = 'docs/jlpt-workspace/source-packets';
const expected = new Map(Object.entries({
  'n4-2011-12': [70, 27],
  'n4-2012-12': [70, 28],
  'n4-2013-07': [70, 28],
  'n4-2013-12': [70, 28],
  'n4-2014-07': [70, 28],
  'n4-2017-07': [69, 28],
  'n4-2018-07': [70, 28],
  'n4-2021-07': [57, 28],
  'n4-2021-12': [57, 28],
  'n5-2011-12': [65, 24],
  'n5-2012-12': [67, 24],
  'n5-2013-07': [67, 24],
  'n5-2017-07': [65, 24],
  'n5-2018-12': [67, 24],
  'n5-2020-12': [67, 24],
  'n5-2021-12': [43, 24],
}));

const files = fs.readdirSync(root).sort();
assert.deepEqual(
  files,
  [...expected.keys()].map((id) => `${id}.source-packet.json`).sort(),
  'source-packet directory must contain exactly the expected 16 JSON packets',
);

const globalQuestionIds = new Set();
const globalExamIds = new Set();

function walk(value, visit, key = null) {
  visit(value, key);
  if (Array.isArray(value)) for (const item of value) walk(item, visit, key);
  else if (value && typeof value === 'object') for (const [childKey, child] of Object.entries(value)) walk(child, visit, childKey);
}

for (const [id, [writtenCount, listeningCount]] of expected) {
  const file = path.join(root, `${id}.source-packet.json`);
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.includes(0), false, `${file} contains a NUL byte`);
  assert.ok(bytes.length > 0 && bytes[0] === 0x7b, `${file} must be textual JSON, not binary data`);
  const text = bytes.toString('utf8');
  assert.doesNotMatch(text, /(?:\/Users\/|\/Volumes\/|\/private\/|file:\/\/)/, `${file} contains an absolute Mac path`);
  assert.doesNotMatch(text, /data:(?:audio|image|application)\//i, `${file} embeds binary data`);
  const packet = JSON.parse(text);

  assert.equal(packet.schemaVersion, 1);
  assert.equal(packet.structuredReady, false, `${id} must not be structured_ready`);
  assert.equal(packet.binaryAssetsIncluded, false);
  assert.equal(packet.humanReviewed, false);
  assert.equal(packet.perceptualApproval, false);
  assert.equal(packet.timingStatus, 'candidate_unverified');
  assert.ok(!globalExamIds.has(packet.examId), `duplicate examId ${packet.examId}`);
  globalExamIds.add(packet.examId);
  assert.equal(packet.level.toLowerCase(), id.slice(0, 2));
  assert.equal(`${packet.year}-${String(packet.month).padStart(2, '0')}`, id.slice(3));
  assert.ok(Array.isArray(packet.identityEvidence) && packet.identityEvidence.length > 0, `${id} lacks identity evidence`);
  assert.ok(Array.isArray(packet.problemGroups) && packet.problemGroups.length > 0, `${id} lacks problem groups`);
  assert.ok(Array.isArray(packet.passages), `${id} passages must be an array`);
  assert.equal(packet.writtenQuestions.length, writtenCount, `${id} written count mismatch`);
  assert.equal(packet.listeningQuestions.length, listeningCount, `${id} listening count mismatch`);
  assert.deepEqual([packet.counts.auditedWritten, packet.counts.auditedListening], [writtenCount, listeningCount], `${id} audit count mismatch`);
  assert.ok(Array.isArray(packet.sourcePageTextCandidates), `${id} sourcePageTextCandidates must be an array`);
  if (id === 'n4-2013-07') {
    assert.equal(packet.sourcePageTextCandidates.length, 0, `${id} must not retain raw OCR after direct source-image verification`);
    assert.equal(packet.sourceVerification?.method, 'direct_pdf_page_image_character_check');
    assert.equal(packet.sourceVerification?.ocrUsedForNavigationOnly, true);
  } else {
    assert.ok(packet.sourcePageTextCandidates.length > 0, `${id} must carry page-level OCR candidates`);
  }

  for (const question of [...packet.writtenQuestions, ...packet.listeningQuestions]) {
    assert.ok(!globalQuestionIds.has(question.questionId), `duplicate questionId ${question.questionId}`);
    globalQuestionIds.add(question.questionId);
    assert.equal(typeof question.sectionId, 'string');
    assert.ok(Number.isInteger(question.problemNumber) && question.problemNumber > 0);
    assert.ok(Number.isInteger(question.questionNumber) && question.questionNumber > 0);
    assert.equal(typeof question.family, 'string');
    assert.ok(question.promptJa === null || typeof question.promptJa === 'string');
    assert.ok(Array.isArray(question.options) && question.options.length >= 2, `${question.questionId} has insufficient option slots`);
    const optionIds = question.options.map((option) => option.optionId);
    assert.equal(new Set(optionIds).size, optionIds.length, `${question.questionId} has duplicate option IDs`);
    for (const option of question.options) {
      assert.equal(typeof option.optionId, 'string');
      assert.ok(option.textJa === null || typeof option.textJa === 'string');
    }
    if (question.correctOptionId !== null) assert.ok(optionIds.includes(question.correctOptionId), `${question.questionId} answer is not an option`);
    assert.ok(Array.isArray(question.sourcePages));
    assert.ok(Array.isArray(question.blockers));
  }

  const duration = packet.sourceMetadata.audioDurationMs;
  assert.ok(
    Math.abs(duration - packet.sourceMetadata.audioDurationSeconds * 1000) < 1,
    `${id} seconds-to-milliseconds duration conversion differs by one millisecond or more`,
  );
  for (const question of packet.listeningQuestions) {
    assert.equal(question.timingStatus, 'candidate_unverified');
    assert.equal(question.humanReviewed, false);
    assert.equal(question.perceptualApproval, false);
    const hasStart = question.startMs !== null;
    const hasEnd = question.endMs !== null;
    assert.equal(hasStart, hasEnd, `${question.questionId} has a partial timing range`);
    if (hasStart) {
      assert.ok(Number.isInteger(question.startMs) && Number.isInteger(question.endMs));
      assert.ok(question.startMs >= 0 && question.endMs > question.startMs, `${question.questionId} has an invalid timing range`);
      assert.ok(Number.isInteger(duration) && question.endMs <= duration, `${question.questionId} timing exceeds audio duration`);
    }
  }

  if (id === 'n4-2013-07') {
    assert.equal(packet.writtenQuestions.length, 70);
    assert.equal(packet.listeningQuestions.length, 28);
    const passageIds = new Set(packet.passages.map((passage) => passage.passageId));
    assert.equal(passageIds.size, packet.passages.length, 'n4-2013-07 has duplicate passage IDs');
    for (const passage of packet.passages) {
      assert.ok(typeof passage.passageJa === 'string' && passage.passageJa.trim(), `${passage.passageId} has null/empty passage text`);
      assert.ok(Array.isArray(passage.sourcePages) && passage.sourcePages.length > 0, `${passage.passageId} lacks source pages`);
    }
    const writtenAudit = new Map(JSON.parse(fs.readFileSync('docs/jlpt-workspace/conversion/n4-2013-07/written.audit.json', 'utf8')).records.map((record) => [record.auditId, record]));
    const listeningAudit = new Map(JSON.parse(fs.readFileSync('docs/jlpt-workspace/conversion/n4-2013-07/listening.audit.json', 'utf8')).records.map((record) => [record.auditId, record]));
    for (const question of [...packet.writtenQuestions, ...packet.listeningQuestions]) {
      assert.ok(typeof question.instructionJa === 'string' && question.instructionJa.trim(), `${question.questionId} has null/empty instruction`);
      assert.ok(typeof question.promptJa === 'string' && question.promptJa.trim(), `${question.questionId} has null/empty prompt`);
      assert.equal(question.questionId, `${id}-${question.auditId}`, `${question.auditId} has an unstable question ID`);
      assert.ok(Number.isInteger(question.sourcePage), `${question.questionId} lacks a sourcePage`);
      assert.equal(question.answerSourcePage, 14, `${question.questionId} answer must cite PDF page 14`);
      assert.ok(question.options.length >= 3 && question.options.length <= 4, `${question.questionId} has an invalid option count`);
      for (const option of question.options) assert.ok(typeof option.textJa === 'string' && option.textJa.trim(), `${question.questionId}/${option.optionId} has null/empty option text`);
      assert.ok(question.correctOptionId !== null && question.options.some((option) => option.optionId === question.correctOptionId), `${question.questionId} has an invalid answer`);
      if (question.passageId !== null) {
        assert.ok(passageIds.has(question.passageId), `${question.questionId} references an unknown passage`);
        assert.ok(typeof question.passageJa === 'string' && question.passageJa.trim(), `${question.questionId} has null/empty passage text`);
      }
      assert.equal(question.contentStatus, 'source_image_verified', `${question.questionId} is not source-image verified`);
    }
    for (const question of packet.writtenQuestions) {
      const audit = writtenAudit.get(question.auditId);
      assert.ok(audit, `${question.questionId} is absent from the written audit`);
      assert.equal(question.correctOptionId, audit.correctOptionId, `${question.questionId} answer differs from audited page-14 key`);
    }
    for (const question of packet.listeningQuestions) {
      const audit = listeningAudit.get(question.auditId);
      assert.ok(audit, `${question.questionId} is absent from the listening audit`);
      assert.equal(question.correctOptionId, audit.correctOptionId, `${question.questionId} answer differs from audited page-14 key`);
      assert.ok(typeof question.transcriptJa === 'string' && question.transcriptJa.trim(), `${question.questionId} has null/empty transcript`);
      assert.ok(Number.isInteger(question.startMs) && Number.isInteger(question.endMs), `${question.questionId} lacks candidate timing`);
      assert.deepEqual([question.startMs, question.endMs], [audit.timingMs.start, audit.timingMs.end], `${question.questionId} timing differs from the existing candidate`);
      assert.ok(Number.isInteger(question.transcriptSourcePage), `${question.questionId} lacks a transcript source page`);
    }
  }

  walk(packet, (value, key) => {
    if (key === 'humanReviewed' || key === 'perceptualApproval') assert.equal(value, false, `${id} contains approved review state`);
    if (key === 'structuredReady') assert.equal(value, false, `${id} is marked structured_ready`);
  });
}

console.log(`JLPT N4/N5 SOURCE PACKETS PASS: ${expected.size} packets; ${globalQuestionIds.size} unique question IDs; counts, answers, timings, review flags, portability, and text-only policy validated.`);
