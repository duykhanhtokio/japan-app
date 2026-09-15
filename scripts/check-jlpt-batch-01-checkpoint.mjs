import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checkpoint = path.join(root, 'docs/checkpoints/JAPAN_APP_JLPT_BATCH_01_WORKING_CHECKPOINT.md');
const workspace = path.join(root, 'docs/jlpt-workspace/batch-01');
const manifestPath = path.join(workspace, 'PROGRESS_MANIFEST.json');
const writtenPath = path.join(workspace, 'written/n1-2012-12-written-70.verified.json');
const listeningPath = path.join(workspace, 'listening/n1-2012-12-listening-36.review.json');
const statusPath = path.join(workspace, 'extraction-status/n1-2012-12-extraction-status.json');
const audioReviewPath = path.join(workspace, 'audio-review/N1_2012_12_AUDIO_REVIEW(1).json');
const required = [checkpoint, manifestPath, writtenPath, listeningPath, statusPath, audioReviewPath];
let failed = false;

for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`MISSING: ${path.relative(root, file)}`);
    failed = true;
  }
}
if (failed) process.exit(1);

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
for (const item of manifest.files) {
  const full = path.join(root, item.relativePath);
  if (!fs.existsSync(full)) {
    console.error(`MISSING: ${item.relativePath}`);
    failed = true;
    continue;
  }
  const actual = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
  if (actual !== item.sha256) {
    console.error(`HASH MISMATCH: ${item.relativePath}`);
    failed = true;
  }
}

const written = JSON.parse(fs.readFileSync(writtenPath, 'utf8'));
const listening = JSON.parse(fs.readFileSync(listeningPath, 'utf8'));
const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
const audioReview = JSON.parse(fs.readFileSync(audioReviewPath, 'utf8'));

if (written.writtenQuestionCount !== 70 || written.questions.filter(q => q.verificationStatus === 'verified').length !== 70) {
  console.error('WRITTEN STATUS INVALID');
  failed = true;
}
if (listening.listeningAnswerUnitCount !== 36 || listening.uniqueAudioSegmentCount !== 35 || listening.questions.length !== 36) {
  console.error('LISTENING STRUCTURE INVALID');
  failed = true;
}
if (audioReview.counts?.verified !== 35 || audioReview.completed !== true) {
  console.error('AUDIO REVIEW STATUS INVALID');
  failed = true;
}

const verified = listening.questions.filter(q => q.transcriptVerificationStatus === 'verified');
const pending = listening.questions.filter(q => q.transcriptVerificationStatus === 'needs_review');
const invalidState = listening.questions.filter(q => !['verified', 'needs_review'].includes(q.transcriptVerificationStatus));
const falseVerified = verified.filter(q =>
  typeof q.audio?.transcriptJa !== 'string' ||
  q.audio.transcriptJa.trim().length === 0 ||
  !Array.isArray(q.audio.transcriptSourcePages) ||
  q.audio.transcriptSourcePages.length === 0
);
if (invalidState.length) {
  console.error(`INVALID TRANSCRIPT STATUS: ${invalidState.length}`);
  failed = true;
}
if (falseVerified.length) {
  console.error(`VERIFIED TRANSCRIPT MISSING TEXT OR SOURCE PAGE: ${falseVerified.map(q => q.questionId).join(', ')}`);
  failed = true;
}
if (verified.length + pending.length !== 36) {
  console.error('TRANSCRIPT COUNT INVALID');
  failed = true;
}
if (listening.transcriptVerifiedCount !== verified.length || listening.transcriptNeedsReviewCount !== pending.length) {
  console.error(`TRANSCRIPT SUMMARY MISMATCH: data=${verified.length}/${pending.length}`);
  failed = true;
}
if (status.listeningContent?.transcriptVerifiedCount !== verified.length || status.listeningContent?.transcriptNeedsReviewCount !== pending.length) {
  console.error(`EXTRACTION STATUS MISMATCH: expected ${verified.length}/${pending.length}`);
  failed = true;
}

const currentTask = status.listeningContent?.nextTask || 'Không đọc được mục in_progress';
console.log(`Transcript verified: ${verified.length}/36`);
console.log(`Transcript needs_review: ${pending.length}/36`);
console.log(`in_progress: ${currentTask}`);
console.log(`Manifest entries checked: ${manifest.files.length}`);
console.log(failed ? 'CHECKPOINT CHECK: FAIL' : 'CHECKPOINT CHECK: PASS');
if (failed) process.exit(1);

