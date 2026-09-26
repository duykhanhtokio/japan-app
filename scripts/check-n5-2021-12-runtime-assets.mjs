import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const audio = path.join(root, 'assets/jlpt/n5/2021-12/audio/n5-2021-12.mp3');
const imageDir = path.join(root, 'assets/jlpt/n5/2021-12/visual-options');
const imageNames = ['p1q1','p1q2','p1q3','p1q4','p1q7','p2q1','p2q2','p2q3','p2q4','p2q6','p3q1','p3q2','p3q3','p3q4','p3q5'];

let failures = 0;
try {
  const [size, bytes] = await Promise.all([stat(audio), readFile(audio)]);
  if (size.size !== 13_850_975 || !(bytes.subarray(0, 3).toString() === 'ID3' || bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0)) {
    throw new Error(`MP3 chưa được tải đầy đủ (${size.size} byte).`);
  }
} catch (error) {
  failures++;
  console.error(`AUDIO: ${error instanceof Error ? error.message : error}`);
  console.error('Chạy: git lfs pull --include="assets/jlpt/n5/2021-12/audio/n5-2021-12.mp3"');
}
for (const name of imageNames) {
  try {
    const bytes = await readFile(path.join(imageDir, `${name}.jpg`));
    if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes.length < 1000) throw new Error('JPEG không hợp lệ');
  } catch (error) {
    failures++;
    console.error(`IMAGE ${name}: ${error instanceof Error ? error.message : error}`);
  }
}
if (failures) process.exit(1);
console.log(`N5 2021-12 ASSETS PASS: MP3 13850975 byte và ${imageNames.length} JPEG hợp lệ.`);
