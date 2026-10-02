import { readdir, open } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const children = await Promise.all(entries.map(entry => entry.isDirectory()
    ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]));
  return children.flat();
}

const files = (await walk('assets/jlpt')).filter(file => /\.(?:mp3|m4a)$/i.test(file));
const issues = [];
const byLevel = {};
for (const file of files) {
  const handle = await open(file, 'r');
  const bytes = Buffer.alloc(128);
  const { bytesRead } = await handle.read(bytes, 0, bytes.length, 0);
  const size = (await handle.stat()).size;
  await handle.close();
  const level = file.split(path.sep)[2];
  byLevel[level] = (byLevel[level] ?? 0) + 1;
  if (bytes.subarray(0, bytesRead).toString('utf8').startsWith('version https://git-lfs.github.com/spec/v1')) issues.push(`${file}: Git LFS pointer, chưa có âm thanh thật`);
  else if (size < 1024) issues.push(`${file}: chỉ ${size} byte`);
  else if (file.endsWith('.m4a') && bytes.toString('ascii',4,8) === 'ftyp') continue;
  else if (!bytes.subarray(0, 3).equals(Buffer.from('ID3')) && bytes[0] !== 0xff) {
    const probe = spawnSync('ffprobe', ['-v','error','-show_entries','stream=codec_name','-show_entries','format=duration','-of','default=noprint_wrappers=1',file], { encoding:'utf8' });
    if (probe.error) issues.push(`${file}: đầu tệp lạ; ffprobe chưa có để xác minh (${size} byte)`);
    else if (probe.status !== 0 || !/codec_name=(?:mp3|aac|alac)/.test(probe.stdout)) issues.push(`${file}: ffprobe không xác nhận âm thanh MP3/AAC/ALAC (${size} byte): ${probe.stderr.trim()}`);
    else console.log(`${file}: đầu tệp lạ nhưng ffprobe xác nhận ${probe.stdout.trim().replaceAll('\n','; ')}`);
  }
}
console.log(`JLPT audio: ${files.length} tệp MP3/M4A; theo cấp ${JSON.stringify(byLevel)}; lỗi ${issues.length}.`);
for (const issue of issues) console.error(issue);
if (issues.length) process.exitCode = 1;
