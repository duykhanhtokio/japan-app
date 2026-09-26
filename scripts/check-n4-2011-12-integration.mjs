import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync('docs/jlpt-workspace/conversion/n4-2011-12/WORK_MANIFEST.json', 'utf8'));
const catalog = fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts', 'utf8');
const registry = fs.readFileSync('src/data/jlpt-official/approved-n1-exams.ts', 'utf8');
const adapter = fs.readFileSync('src/data/jlpt-official/n4-2011-12-trial.ts', 'utf8');
const hash = (path) => createHash('sha256').update(fs.readFileSync(path)).digest('hex');

assert.equal(manifest.examId, 'n4-2011-12-exam-01');
assert.equal(manifest.status, 'incomplete');
assert.deepEqual(
  [manifest.sourceAudit.writtenResponsesObserved, manifest.sourceAudit.listeningResponsesObserved],
  [70, 27],
);
assert.equal(manifest.sourceAudit.answerKeyPresent, true);
assert.equal(manifest.sourceAudit.chineseExplanationsAndTranslationsPresent, true);
assert.equal(manifest.sourceAudit.japaneseListeningTranscriptPresent, true);
assert.equal(manifest.sourceAudit.sourceTimingPresent, false);
assert.equal(manifest.timingEvidence.humanReviewed, false);
assert.equal(manifest.timingEvidence.perceptualApproval, false);
assert.equal(manifest.timingEvidence.reviewDisposition, 'needs_later_review');
assert.ok(manifest.blockers.length >= 3);
assert.doesNotMatch(catalog, /'n4-2011-12'/);
assert.match(catalog, /incompleteSourceIds\.has\(sourceId\) \? 'incomplete' : 'scanned_only'/);
assert.match(registry, /id: 'n4-2011-12-exam-01'/);
assert.match(registry, /audioSource: require\('\.\.\/\.\.\/\.\.\/assets\/jlpt\/n4\/2011-12\/audio\/n4-2011-12\.mp3'\)/);
assert.match(adapter, /segmentId: 'n4-2011-12-continuous'/);
assert.equal(hash('assets/jlpt/n4/2011-12/audio/n4-2011-12.mp3'), manifest.runtimeAssets.audioSha256);
assert.equal(hash('assets/jlpt/n4/2011-12/visual-options/problem1-item1.jpg'), manifest.runtimeAssets.problem1VisualSha256);
assert.equal(hash('assets/jlpt/n4/2011-12/visual-options/problem3-items1-5.jpg'), manifest.runtimeAssets.problem3VisualSha256);
console.log('N4 2011-12 INTEGRATION AUDIT PASS: 70 written and 27 listening candidates registered with continuous audio; source verification remains open.');
