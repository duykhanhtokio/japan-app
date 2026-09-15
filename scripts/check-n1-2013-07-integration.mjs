import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const datasetPath = 'src/data/jlpt-official/n1-2013-07/exam.verified.json';
const audioPath = 'assets/jlpt/n1/2013-07/audio/n1-2013-07.mp3';
const expectedAudioHash = '515a0365abeedd70fdf4641adc17520b227af9dcdd0ceb217e7a86487c9da08b';
const data = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
const failures = [];
const written = data.questions.filter((question) => question.family !== 'listening');
const listening = data.questions.filter((question) => question.family === 'listening');
const segments = [...new Map(listening.map((question) => [question.audio.segmentId, question.audio])).values()];

if (written.length !== 70) failures.push(`written expected 70, found ${written.length}`);
if (listening.length !== 36) failures.push(`listening expected 36, found ${listening.length}`);
if (data.questions.length !== 106) failures.push(`total expected 106, found ${data.questions.length}`);
if (segments.length !== 35) failures.push(`audio segments expected 35, found ${segments.length}`);
if (new Set(data.questions.map((question) => question.questionId)).size !== 106) failures.push('duplicate question IDs');
if (listening.filter((question) => question.audio.segmentId === 'n1-2013-07-p5-q03').length !== 2) failures.push('問題5 question 3 must have two independent response units sharing one segment');
const audioHash = createHash('sha256').update(fs.readFileSync(audioPath)).digest('hex');
if (audioHash !== expectedAudioHash) failures.push(`audio hash mismatch: ${audioHash}`);

for (const question of data.questions) {
  if (!question.options?.length || !question.options.some((option) => option.optionId === question.correctOptionId)) failures.push(`invalid answer/options: ${question.questionId}`);
}

for (const audio of segments) {
  if (!(audio.startMs >= 0 && audio.endMs > audio.startMs)) {
    failures.push(`invalid audio range: ${audio.segmentId}`);
    continue;
  }
  const decoded = spawnSync('ffmpeg', ['-v', 'error', '-ss', String(audio.startMs / 1000), '-to', String(audio.endMs / 1000), '-i', audioPath, '-f', 'null', '-'], { encoding: 'utf8' });
  if (decoded.status !== 0) failures.push(`audio decode failed: ${audio.segmentId}: ${decoded.stderr.trim()}`);
}

const trialSource = fs.readFileSync('src/components/jlpt/N1OfficialTrial.tsx', 'utf8');
if (!/\{submitted \? <><JlptReviewFeedback/.test(trialSource)) failures.push('review feedback is not gated by submitted state');
if (!/showTranscript && question\.audio\?\.transcriptJa/.test(trialSource)) failures.push('transcript review gate missing');
if (/submitted=\{false\}[^\n]*showTranscript=\{true\}/.test(trialSource)) failures.push('transcript reachable before submission');

if (failures.length) {
  console.error('N1 2013-07 INTEGRATION FAILED');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`N1 2013-07 INTEGRATION PASS: written ${written.length}; listening ${listening.length}; responses ${data.questions.length}; decoded audio segments ${segments.length}; source audio verified`);
