import fs from 'node:fs';
import crypto from 'node:crypto';

const written = JSON.parse(fs.readFileSync('docs/jlpt-workspace/conversion/n5-2017-07/written.partial.json', 'utf8'));
const listening = JSON.parse(fs.readFileSync('docs/jlpt-workspace/conversion/n5-2017-07/listening.partial.json', 'utf8'));
const registry = fs.readFileSync('src/data/jlpt-official/approved-n1-exams.ts', 'utf8');
const visualPaths = [...new Set([...written.questions, ...listening.questions].map(question => question.visualOptionAsset).filter(Boolean))];
if (visualPaths.length !== 14) throw new Error(`Expected 14 visual option assets, found ${visualPaths.length}`);
for (const path of visualPaths) {
  const bytes = fs.readFileSync(path);
  if (bytes.length < 2_000 || bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error(`Invalid JPEG ${path}`);
  if (!registry.includes(`require('../../../${path}')`)) throw new Error(`Visual not registered ${path}`);
}
const audioPath = 'assets/jlpt/n5/2017-07/audio/n5-2017-07.mp3';
const bytes = fs.readFileSync(audioPath);
const hash = crypto.createHash('sha256').update(bytes).digest('hex');
if (bytes.length !== 15_325_537 || hash !== '118ec4a892b0287f419e05f8562b164397536b7732e3b6b96711829de4646a3e') {
  throw new Error(`N5 2017-07 MP3 content is missing or a Git LFS pointer: ${bytes.length} bytes; sha256 ${hash}`);
}
if (!registry.includes(`require('../../../${audioPath}')`)) throw new Error('MP3 not registered');
const starts = JSON.parse(fs.readFileSync('src/data/jlpt-official/listening-start-overrides.json', 'utf8'));
if (starts['n5-2017-07-exam-04'] !== 0) throw new Error('Listening must start at the beginning of the continuous track');
console.log(`N5 2017-07 runtime assets PASS: ${visualPaths.length} JPEGs and ${bytes.length}-byte MP3`);