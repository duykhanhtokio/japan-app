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
  assert.ok(Array.isArray(packet.sourcePageTextCandidates) && packet.sourcePageTextCandidates.length > 0, `${id} must carry page-level OCR candidates`);

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

  walk(packet, (value, key) => {
    if (key === 'humanReviewed' || key === 'perceptualApproval') assert.equal(value, false, `${id} contains approved review state`);
    if (key === 'structuredReady') assert.equal(value, false, `${id} is marked structured_ready`);
  });
}

console.log(`JLPT N4/N5 SOURCE PACKETS PASS: ${expected.size} packets; ${globalQuestionIds.size} unique question IDs; counts, answers, timings, review flags, portability, and text-only policy validated.`);
