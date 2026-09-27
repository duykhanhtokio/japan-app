import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const audioRoot = path.join(root, 'assets/jlpt');
const failures = [];
let checked = 0;

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(file);
    else if (directory.includes(`${path.sep}audio`) && /\.(mp3|m4a|wav)$/i.test(entry.name)) {
      checked++;
      const header = Buffer.alloc(48);
      const fd = fs.openSync(file, 'r');
      const bytes = fs.readSync(fd, header, 0, header.length, 0);
      fs.closeSync(fd);
      const signature = header.subarray(0, bytes).toString('ascii');
      if (signature.startsWith('version https://git-lfs.github.com/spec')) failures.push(`${path.relative(root, file)}: Git LFS pointer; run git lfs pull`);
      else if (bytes < 4) failures.push(`${path.relative(root, file)}: empty audio file`);
    }
  }
}

visit(audioRoot);
if (failures.length) {
  console.error(`JLPT AUDIO ASSETS FAIL: ${failures.length}/${checked} files are unavailable locally`);
  for (const failure of failures.slice(0, 8)) console.error(failure);
  if (failures.length > 8) console.error(`... and ${failures.length - 8} more`);
  process.exitCode = 1;
} else console.log(`JLPT AUDIO ASSETS PASS: ${checked} local audio files`);
