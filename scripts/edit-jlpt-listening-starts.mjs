import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registry = fs.readFileSync(path.join(root, 'src/data/jlpt-official/approved-n1-exams.ts'), 'utf8');
const settingsFile = path.join(root, 'src/data/jlpt-official/listening-start-overrides.json');
const settingsPath = 'src/data/jlpt-official/listening-start-overrides.json';
const branch = execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim();
const assetPattern = /require\(['"]\.\.\/\.\.\/\.\.\/(assets\/jlpt\/[^'"]+\.(?:mp3|m4a))['"]\)/g;
const aliases = new Map();
for (const file of fs.readdirSync(path.join(root, 'src/data/jlpt-mock')).filter(name => name.endsWith('.ts'))) {
  const body = fs.readFileSync(path.join(root, 'src/data/jlpt-mock', file), 'utf8');
  for (const match of body.matchAll(/(?:export )?const (\w+_AUDIO)\s*=\s*require\(['"]\.\.\/\.\.\/\.\.\/(assets\/jlpt\/[^'"]+\.(?:mp3|m4a))['"]\)/g)) aliases.set(match[1], match[2]);
}
const exams = [...registry.matchAll(/\bid: '(n[1-5]-\d{4}-\d{2}-exam-\d+)'[^]*?\blevel: '(N[1-5])'[^]*?\bperiodLabel: '([^']+)'[^]*?\baudioSource: (\w+_AUDIO|require\(['"]\.\.\/\.\.\/\.\.\/(assets\/jlpt\/[^'"]+\.(?:mp3|m4a))['"]\))/g)]
  .map(([, id, level, period, expression, direct]) => ({ id, level, period, asset: direct ?? aliases.get(expression) }))
  .filter(exam => exam.asset)
  .sort((a, b) => a.level.localeCompare(b.level, undefined, { numeric: true }) || a.period.localeCompare(b.period));
if (exams.length === 0) throw Error('No playable structured exams found');
const byId = new Map(exams.map(exam => [exam.id, exam]));
const fingerprint = content => crypto.createHash('sha256').update(content).digest('hex');
const readSettings = () => fs.readFileSync(settingsFile, 'utf8');
const send = (res, status, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
};
const html = fs.readFileSync(path.join(root, 'scripts/edit-jlpt-listening-starts.html'), 'utf8');
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/') return send(res, 200, html, 'text/html; charset=utf-8');
  if (req.method === 'GET' && url.pathname === '/api/exams') {
    const content = readSettings();
    return send(res, 200, { exams, starts: JSON.parse(content), revision: fingerprint(content) });
  }
  if (req.method === 'GET' && url.pathname.startsWith('/audio/')) {
    const exam = byId.get(decodeURIComponent(url.pathname.slice(7)));
    if (!exam) return send(res, 404, { error: 'Exam unavailable' });
    const file = path.join(root, exam.asset);
    if (!fs.existsSync(file)) return send(res, 409, { error: 'Audio missing in this checkout; run git lfs pull on this Mac' });
    const size = fs.statSync(file).size;
    if (size < 100000) return send(res, 409, { error: 'Audio missing; run git lfs pull on this Mac' });
    const match = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range ?? '');
    const start = match ? Number(match[1]) : 0;
    const end = match && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    if (start > end || start >= size) { res.writeHead(416, { 'Content-Range': `bytes */${size}` }); return res.end(); }
    res.writeHead(match ? 206 : 200, {
      'Content-Type': file.endsWith('.m4a') ? 'audio/mp4' : 'audio/mpeg',
      'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1,
      ...(match ? { 'Content-Range': `bytes ${start}-${end}/${size}` } : {}),
      'Cache-Control': 'no-store',
    });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  if (req.method === 'POST' && url.pathname === '/api/save') {
    try {
      if (branch !== 'recovery/jlpt-n3-n1') throw Error(`Hãy chuyển sang nhánh recovery/jlpt-n3-n1; hiện tại: ${branch}`);
      let body = '';
      for await (const chunk of req) { body += chunk; if (body.length > 100000) throw Error('Too much data'); }
      const { starts, revision } = JSON.parse(body);
      const current = readSettings();
      if (revision !== fingerprint(current)) return send(res, 409, { error: 'Tệp đã thay đổi. Tải lại trang trước khi lưu.' });
      if (!starts || typeof starts !== 'object' || Array.isArray(starts)) throw Error('Invalid values');
      const previous = JSON.parse(current);
      for (const [id, milliseconds] of Object.entries(starts)) {
        if (!byId.has(id) || !Number.isInteger(milliseconds) || milliseconds < 0 || milliseconds > 14400000 || milliseconds % 500 !== 0) throw Error(`Invalid start for ${id}`);
        previous[id] = milliseconds;
      }
      const next = JSON.stringify(Object.fromEntries(Object.entries(previous).sort(([a], [b]) => a.localeCompare(b))), null, 2) + '\n';
      const temporary = settingsFile + '.tmp';
      fs.writeFileSync(temporary, next);
      fs.renameSync(temporary, settingsFile);
      const commit = spawnSync('git', ['commit', '--only', '-m', 'data: save JLPT listening start calibration', '--', settingsPath], { cwd: root, encoding: 'utf8' });
      if (commit.status !== 0 && !/nothing to commit|no changes added/.test(commit.stdout + commit.stderr)) {
        return send(res, 200, { saved: Object.keys(starts).length, revision: fingerprint(next), sync: `Lưu trên máy thành công; chưa tạo được commit: ${commit.stderr.trim()}` });
      }
      const push = spawnSync('git', ['push', 'origin', branch], { cwd: root, encoding: 'utf8' });
      return send(res, 200, { saved: Object.keys(starts).length, revision: fingerprint(next), sync: push.status === 0 ? 'Đã lưu trong app và GitHub.' : `Đã lưu trên máy; chưa đẩy được lên GitHub: ${push.stderr.trim()}` });
    } catch (error) { return send(res, 400, { error: error.message }); }
  }
  return send(res, 404, { error: 'Not found' });
});
server.listen(8765, '127.0.0.1', () => {
  const address = 'http://127.0.0.1:8765/';
  console.log(`JLPT listening start editor: ${address} (${exams.length} structured exams)`);
  if (process.platform === 'darwin') spawnSync('open', [address], { stdio: 'ignore' });
});
