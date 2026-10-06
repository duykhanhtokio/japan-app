/* global __dirname */
// Production-browser evidence. This does not certify a native compositor.
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright') : 'playwright');
const root = path.resolve(__dirname, '..');
const build = process.env.JAPAN_UI_BUILD_DIR || '/tmp/japan-app-full-navigation-web';
const output = process.env.JAPAN_UI_OUTPUT_DIR || '/tmp/japan-app-all-route-transitions';
fs.mkdirSync(output, { recursive: true });
const mime = { '.js': 'application/javascript', '.html': 'text/html', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.json': 'application/json', '.wasm': 'application/wasm' };
const server = http.createServer((req, res) => {
  let file = path.join(build, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) file = path.join(build, 'index.html');
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  fs.createReadStream(file).pipe(res);
});
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'src/data/generated/' + name + '.json'), 'utf8'));
const locations = read('locations');
const location = locations.find(item => item.id === 'LOC-001-01');
const scenario = read('scenarios').find(item => item.locationId === location.id);
const word = read('vocabulary').find(item => item.jlpt === 'N5' && item.status !== 'Rejected');
const params = { level: 'N5', section: 'grammar', wordId: word.id, entryId: '1000010', categoryId: 'FOOD', tagId: 'MEAL', lessonId: 'FOOD_BASIC_001', moduleId: 'FOOD_BASIC', industryId: 'FOOD_SERVICE', operationCode: '1-1-1', missionId: 'CAFE_ORDER_001', regionId: 'hokkaido', prefectureId: 'PRF-001', cityId: location.cityId, locationId: location.id, scenarioId: scenario.id };
const source = fs.readFileSync(path.join(root, 'src/components/ui/route-artwork.ts'), 'utf8');
const templates = [...source.matchAll(/^\s+"([^"]+)":/gm)].map(item => item[1]).filter(route => !process.env.JAPAN_UI_ROUTE_FILTER || new RegExp(process.env.JAPAN_UI_ROUTE_FILTER).test(route));
const report = { nativeVerified: false, templates: [], actions: [], errors: [], frames: {} };

async function installFrameAudit(page) {
  await page.evaluate(() => {
    window.__transitionFrames = { total: 0, emptyRoot: 0, wrongBounds: 0, examples: [] };
    function sample() {
      const nodes = [...document.querySelectorAll('[data-testid^="home-tokutei-backdrop-"]')];
      const managed = location.pathname !== '/' && !/^\/game\/(?:work|mission)(?:\/|$)/.test(location.pathname);
      const audit = window.__transitionFrames;
      audit.total++;
      const loaded = nodes.filter(node => [...node.querySelectorAll('img')].some(image => image.complete && image.naturalWidth > 0));
      if (managed && !loaded.length) { audit.emptyRoot++; if (audit.examples.length < 6) audit.examples.push(location.pathname); }
      for (const node of loaded) { const box = node.getBoundingClientRect(); if (Math.abs(box.width - innerWidth) > 1 || Math.abs(box.height - innerHeight) > 1 || Math.abs(box.x) > 1 || Math.abs(box.y) > 1) audit.wrongBounds++; }
      requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
}
async function settled(page) {
  await page.waitForFunction(() => document.body.innerText.trim().length > 0, { timeout: 20000 });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function action(page, name, click, pathname) {
  await click();
  await page.waitForURL(url => url.pathname === pathname, { timeout: 30000 });
  await settled(page);
  report.actions.push({ viewport: page.viewportSize(), name, pathname });
  console.log('ACTION', page.viewportSize().width, name);
}
async function deepFlow(browser, viewport) {
  const page = await browser.newPage({ viewport });
  page.on('pageerror', error => report.errors.push({ path: page.url(), message: error.message }));
  await page.goto('http://127.0.0.1:8081/home', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.getByText('筆記学習', { exact: true }).waitFor({ timeout: 60000 });
  await page.waitForFunction(() => [...document.querySelectorAll('[data-testid^="home-tokutei-backdrop-"] img')].some(image => image.complete && image.naturalWidth > 0));
  await installFrameAudit(page);
  try {
  const back = () => page.getByRole('button', { name: '戻る', exact: true }).first().click();
  await action(page, 'Home -> Learn', () => page.getByText('筆記学習', { exact: true }).click(), '/learn');
  await action(page, 'Learn -> N5', () => page.getByText('N5', { exact: true }).last().click(), '/N5');
  for (const [label, section] of [['文法', 'grammar'], ['文字', 'characters'], ['単語', 'vocabulary']]) {
    await action(page, 'N5 -> ' + section, () => page.getByText(label, { exact: true }).first().click(), '/N5/' + section);
    await page.screenshot({ path: path.join(output, `${viewport.width}-${section}.png`) });
    if (section === 'vocabulary') {
      await page.getByText(word.word, { exact: true }).first().click();
      await page.waitForURL(url => url.pathname.includes('/vocabulary/'), { timeout: 30000 });
      report.actions.push({ viewport, name: 'Vocabulary -> word detail', pathname: new URL(page.url()).pathname });
      await back(); await page.waitForURL(url => url.pathname === '/N5/vocabulary');
      report.actions.push({ viewport, name: 'Word detail -> vocabulary', pathname: '/N5/vocabulary' });
    }
    await action(page, section + ' -> N5', back, '/N5');
  }
  await action(page, 'N5 -> exam catalog', () => page.getByText('JLPT模擬試験', { exact: true }).click(), '/N5/test');
  await page.getByRole('button', { name: /第1回/ }).click();
  await page.getByRole('button', { name: '試験を始める', exact: true }).waitFor();
  await page.getByRole('button', { name: '試験を始める', exact: true }).click();
  await page.getByRole('radio').first().waitFor();
  await page.getByRole('radio').first().click();
  await page.screenshot({ path: path.join(output, `${viewport.width}-exam.png`) });
  report.actions.push({ viewport, name: 'Catalog -> start -> exam -> answer', pathname: '/N5/test' });
  await back(); await page.getByText('受験する試験を選択', { exact: true }).waitFor();
  report.actions.push({ viewport, name: 'Exam -> catalog (internal Back)', pathname: '/N5/test' });
  await action(page, 'Catalog -> N5', back, '/N5'); await action(page, 'N5 -> Learn', back, '/learn'); await action(page, 'Learn -> Home', back, '/home');
  await action(page, 'Home -> Tokutei', () => page.getByText('特定技能学習', { exact: true }).click(), '/specified-skills');
  await action(page, 'Tokutei -> Home', back, '/home');
  await action(page, 'Home -> Japan map', () => page.getByText('会話練習', { exact: true }).click(), '/world');
  await action(page, 'Japan -> Hokkaido', () => page.getByRole('button', { name: '北海道', exact: true }).click(), '/world/hokkaido');
  await action(page, 'Hokkaido -> prefecture', () => page.getByRole('button', { name: '道央', exact: true }).click(), '/world/prefecture/PRF-001');
  await action(page, 'Prefecture -> Sapporo', () => page.getByText('札幌市', { exact: true }).click(), '/world/city/CTY-001');
  await action(page, 'City -> station', () => page.getByText('札幌駅', { exact: true }).click(), '/world/location/LOC-001-01');
  await page.getByText('開始', { exact: true }).click(); await page.waitForURL(url => url.pathname.startsWith('/world/dialogue/'));
  await page.getByTestId('dialogue-npc').waitFor(); await page.screenshot({ path: path.join(output, `${viewport.width}-dialogue.png`) });
  report.actions.push({ viewport, name: 'Location -> dialogue', pathname: new URL(page.url()).pathname });
  await action(page, 'Dialogue -> station', back, '/world/location/LOC-001-01');
  await action(page, 'Station -> city', back, '/world/city/CTY-001');
  await action(page, 'City -> prefecture', back, '/world/prefecture/PRF-001');
  await action(page, 'Prefecture -> region', back, '/world/hokkaido');
  await action(page, 'Region -> Japan', back, '/world'); await action(page, 'Japan -> Home', back, '/home');
  for (const [label, route] of [['ミッション', '/tasks'], ['プロフィール', '/profile'], ['ホーム', '/home']]) {
    await action(page, 'Tab -> ' + route, () => page.getByRole('button', { name: label, exact: true }).click(), route);
  }
  } catch (error) {
    await page.screenshot({ path: path.join(output, `${viewport.width}-failure.png`) });
    throw error;
  } finally {
    report.frames[`${viewport.width}x${viewport.height}`] = await page.evaluate(() => window.__transitionFrames);
    await page.close();
  }
}
async function additionalBranches(browser) {
  const viewport = { width: 430, height: 932 };
  const page = await browser.newPage({ viewport });
  page.on('pageerror', error => report.errors.push({ path: page.url(), message: error.message }));
  const back = () => page.getByRole('button', { name: '戻る', exact: true }).first().click();
  const open = async route => {
    await page.goto('http://127.0.0.1:8081' + route, { waitUntil: 'domcontentloaded' });
    await settled(page);
  };
  try {
    await open('/portal');
    await page.getByText('利用目的を選択', { exact: true }).waitFor();
    await page.waitForFunction(() => [...document.querySelectorAll('[data-testid^="home-tokutei-backdrop-"] img')].some(image => image.complete && image.naturalWidth > 0));
    await installFrameAudit(page);
    for (const [label, route] of [['日本語教育機関', '/portal/education'], ['受け入れ企業', '/portal/company'], ['監理団体・登録支援機関', '/portal/support'], ['学習者', '/register']]) {
      await action(page, 'Portal -> ' + route, () => page.getByRole('button', { name: new RegExp('^' + label + ' ') }).click(), route);
      await action(page, route + ' -> Portal', back, '/portal');
    }
    report.frames.portal = await page.evaluate(() => window.__transitionFrames);
    await open('/portal/education/dashboard');
    for (const [label, route] of [['新しいクラスを作成', '/portal/education/new-class'], ['N5 基礎クラス A', '/portal/education/classroom'], ['N5', '/portal/education/n5']]) {
      await action(page, 'Education -> ' + route, () => (label === 'N5' ? page.getByText(label, { exact: true }).last() : page.getByText(label, { exact: true }).first()).click(), route);
      await action(page, route + ' -> Education', back, '/portal/education/dashboard');
    }
    await open('/profile');
    await page.getByText('詳細を見る · Xem chi tiết ›', { exact: true }).click();
    await page.getByText('プロフィール · 詳細', { exact: true }).waitFor();
    await page.getByText('閉じる · Đóng', { exact: true }).click();
    await page.getByText('詳細を見る · Xem chi tiết ›', { exact: true }).waitFor();
    report.actions.push({ viewport, name: 'Profile -> details modal -> close', pathname: '/profile' });
    await open('/game');
    await page.waitForFunction(() => [...document.querySelectorAll('[data-testid^="home-tokutei-backdrop-"] img')].some(image => image.complete && image.naturalWidth > 0));
    await installFrameAudit(page);
    for (const label of ['野菜畑', '果樹園', '鶏小屋', '牛舎', 'レストラン']) {
      const marker = page.getByRole('button', { name: label, exact: true });
      await marker.waitFor();
      if (await marker.isDisabled()) { (report.lockedBranches ??= []).push('Farm/' + label); continue; }
      await marker.click(); await marker.waitFor({ state: 'hidden' }); await settled(page);
      await back(); await marker.waitFor(); await settled(page);
      report.actions.push({ viewport, name: 'Farm map -> ' + label + ' -> map', pathname: '/game' });
    }
    report.frames.farm = await page.evaluate(() => window.__transitionFrames);
  } catch (error) {
    await page.screenshot({ path: path.join(output, 'additional-failure.png') });
    throw error;
  } finally { await page.close(); }
}
async function main() {
  await new Promise(resolve => server.listen(8081, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: process.env.JAPAN_UI_BROWSER_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  try {
    const context = await browser.newContext({ viewport: { width: 430, height: 932 } });
    await context.addInitScript(() => localStorage.setItem('@japan_app_user_profile', JSON.stringify({ name: 'QA', level: 'N5', country: 'VN', occupationId: 'AGRICULTURE', jobDescription: '', email: '', createdAt: '2026-10-06' })));
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push({ path: page.url(), message: error.message, stack: error.stack?.slice(0, 1500) }));
    for (const template of templates) {
      const url = template.replace(/\[([^\]]+)\]/g, (_, key) => encodeURIComponent(params[key]));
      try {
        await page.goto('http://127.0.0.1:8081' + url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await settled(page);
        report.templates.push({ template, url, status: 'rendered', textLength: (await page.locator('body').innerText()).length });
      } catch (error) { report.templates.push({ template, url, status: 'blocked', message: error.message.slice(0, 250) }); }
      if (report.templates.length % 5 === 0) console.log('ROUTE PROGRESS', report.templates.length, '/', templates.length);
    }
    await context.close();
    if (!process.env.JAPAN_UI_SKIP_DEEP_FLOW) { try { await additionalBranches(browser); } catch (error) { report.errors.push({ flow: 'additional branches', message: error.message.slice(0, 500) }); } }
    for (const viewport of process.env.JAPAN_UI_SKIP_DEEP_FLOW ? [] : [{ width: 430, height: 932 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }]) {
      try { await deepFlow(browser, viewport); }
      catch (error) { report.errors.push({ flow: viewport, message: error.message.slice(0, 350) }); }
    }
  } finally {
    await browser.close(); server.close();
    fs.writeFileSync(path.join(output, 'runtime.json'), JSON.stringify(report, null, 2));
    if (report.errors.length || report.templates.some(item => item.status !== 'rendered') || Object.values(report.frames).some(item => item.emptyRoot || item.wrongBounds)) process.exitCode = 1;
    console.log('RUNTIME SUMMARY', JSON.stringify({ templates: report.templates.length, blocked: report.templates.filter(item => item.status !== 'rendered').length, actions: report.actions.length, errors: report.errors.length, frames: report.frames }));
  }
}
main().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
