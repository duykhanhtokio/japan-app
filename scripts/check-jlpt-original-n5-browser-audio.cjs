// Actual Chromium asset playback, not a native-device or perceptual review.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES
  ? path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright') : 'playwright');
const root = path.resolve(__dirname, '..');
const number = process.argv[2] || '01';
assert.ok(/^(0[1-6])$/.test(number), 'Expected N5 exam number 01–06');
const manifest = JSON.parse(fs.readFileSync(path.join(root, `src/data/jlpt-original/n5/${number}/audio.manifest.json`)));
const images = JSON.parse(fs.readFileSync(path.join(root, `src/data/jlpt-original/n5/${number}/images.manifest.json`)));
const paths = new Map([['/audio', manifest.continuousAudioPath], ...images.items.map((x, i) => [`/image-${i}`, x.path])]);
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.end('<!doctype html><html><body><audio id="audio" preload="auto" src="/audio"></audio></body></html>');
    return;
  }
  if (!paths.has(req.url)) { res.writeHead(404); res.end(); return; }
  const file = path.join(root, paths.get(req.url));
  const size = fs.statSync(file).size;
  res.setHeader('Content-Type', req.url === '/audio' ? 'audio/mpeg' : 'image/png');
  res.setHeader('Accept-Ranges', 'bytes');
  const match = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || '');
  const start = match ? Number(match[1]) : 0;
  const end = match && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  if (start >= size || end < start) { res.writeHead(416); res.end(); return; }
  if (match) res.writeHead(206, {'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1});
  else res.setHeader('Content-Length', size);
  fs.createReadStream(file, {start, end}).pipe(res);
});
(async () => {
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({executablePath: process.env.JAPAN_UI_BROWSER_PATH, headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--autoplay-policy=no-user-gesture-required']});
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.waitForFunction(() => document.getElementById('audio').readyState >= 2);
    const report = await page.evaluate(async ({durationMs, boundaryMs, count}) => {
      const audio = document.getElementById('audio');
      const errors = []; audio.addEventListener('error', () => errors.push(audio.error?.code));
      if (Math.abs(audio.duration * 1000 - durationMs) > 100) throw new Error('Browser duration mismatch');
      audio.currentTime = 0; await audio.play();
      await new Promise(resolve => setTimeout(resolve, 500));
      if (audio.currentTime <= 0 || audio.currentTime >= 3) throw new Error('Opening playback failed');
      audio.pause(); const pausedAt = audio.currentTime;
      await new Promise(resolve => setTimeout(resolve, 150));
      if (Math.abs(audio.currentTime - pausedAt) > .05) throw new Error('Pause failed');
      audio.currentTime = boundaryMs / 1000 - .3;
      await new Promise(resolve => audio.addEventListener('seeked', resolve, {once: true}));
      await audio.play();
      await new Promise(resolve => setTimeout(resolve, 900));
      if (audio.currentTime * 1000 <= boundaryMs) throw new Error('Playback stopped at music boundary');
      audio.pause(); const boundaryPositionMs = Math.round(audio.currentTime * 1000);
      const dimensions = [];
      for (let i = 0; i < count; i++) {
        const image = new Image(); image.src = `/image-${i}`; await image.decode();
        if (!image.naturalWidth || !image.naturalHeight) throw new Error('Image decode failed');
        dimensions.push([image.naturalWidth, image.naturalHeight]);
      }
      if (errors.length) throw new Error(JSON.stringify(errors));
      return {status: 'PASS', scope: 'Chromium asset playback only; no native/device/full-app/perceptual approval',
        measuredBrowserDurationMs: Math.round(audio.duration * 1000), manifestDurationMs: durationMs,
        openingStartsAtMs: 0, pauseResume: true, boundaryPositionMs, imagesDecoded: dimensions.length, dimensions};
    }, {durationMs: manifest.durationMs, boundaryMs: manifest.break.musicEndMs, count: images.items.length});
    console.log(JSON.stringify(report));
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => {console.error(error); process.exitCode = 1;});
