// Capture the real Expo web app. This does not certify native iOS/Android rendering.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES
  ? path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright')
  : 'playwright');

const base = process.env.JAPAN_UI_BASE_URL || 'http://127.0.0.1:8081';
const output = path.resolve(process.argv[2] || '/tmp/japan-royal-runtime');
const devices = [['iphone16plus', 430, 932], ['small-phone', 320, 568],
  ['ipad', 768, 1024], ['web', 1440, 900]];
const routes = ['home', 'learn', 'N5', 'N5/vocabulary', 'N5/grammar', 'N5/test'];

async function captureEdges(page, panel, stem, viewport) {
  for (const edge of ['top', 'bottom']) {
    await panel.evaluate((element, side) => element.scrollIntoView({
      block: side === 'top' ? 'start' : 'end' }), edge);
    await page.waitForTimeout(100);
    const rect = await panel.boundingBox();
    const y = edge === 'top' ? rect.y : rect.y + rect.height - 32;
    if (y < 0 || y + 32 > viewport.height + 1) throw new Error(`Invisible ${stem} ${edge} edge`);
    await page.screenshot({ path: path.join(output, `${stem}-${edge}.png`),
      clip: { x: rect.x, y, width: rect.width, height: 32 } });
  }
}

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true,
    ...(process.env.JAPAN_UI_BROWSER_PATH ? { executablePath: process.env.JAPAN_UI_BROWSER_PATH } : {}),
    args: ['--no-sandbox'] });
  const measurements = [], errors = [];
  try {
    for (const [device, w, h] of devices) {
      for (const landscape of [false, true]) {
        const viewport = { width: landscape ? h : w, height: landscape ? w : h };
        const page = await browser.newPage({ viewport });
        page.on('pageerror', error => errors.push({ device, landscape, error: error.message }));
        for (const route of routes) {
          await page.goto(`${base}/${route}`);
          const art = page.locator(route === 'home'
            ? 'img[src*="study-man.png"]' : 'img[src*="dialogue-frame-v1.png"]');
          await art.first().waitFor({ timeout: 60000 });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(800); // Wait for React Native onLayout's second render.
          const stem = `${device}-${landscape ? 'landscape' : 'portrait'}-${route.replaceAll('/', '-')}`;
          await page.screenshot({ path: path.join(output, `${stem}.png`) });
          const panels = page.locator('img[src*="dialogue-frame-v1.png"]');
          if (await panels.count()) {
            // The image is inside a clipped slice, an art layer, then the actual panel.
            await panels.first().locator('..').locator('..').locator('..')
              .screenshot({ path: path.join(output, `${stem}-first-panel.png`) });
          }
          measurements.push({ device, landscape, route, viewport,
            layout: await page.evaluate(() => {
              const box = element => {
                const rect = element.getBoundingClientRect(), style = getComputedStyle(element);
                return { x: rect.x, y: rect.y, width: rect.width, height: rect.height,
                  background: style.backgroundColor, padding: style.padding };
              };
              const label = text => {
                const element = [...document.querySelectorAll('div,span')].find(e =>
                  !e.children.length && e.textContent.replace(/\s+/g, ' ').trim() === text);
                return element ? [element, element.parentElement,
                  element.parentElement.parentElement, element.parentElement.parentElement.parentElement].map(box) : null;
              };
              return { credit: label('CREDIT 100/100'), mode: label('WRITING & READING'),
                title: label('JLPT 学習'), images: [...document.querySelectorAll('img')]
                  .filter(e => /study-man|dialogue-frame|hud-energy/.test(e.src)).map(e =>
                    ({ ...box(e), source: e.src, naturalWidth: e.naturalWidth, naturalHeight: e.naturalHeight })) };
            }) });
          if (route === 'home') {
            for (const [index, badge] of ['WRITING & READING', 'SPEAKING ROLEPLAY', 'SPECIFIED SKILLS'].entries()) {
              await captureEdges(page, page.getByText(badge, { exact: true })
                .locator('..').locator('..').locator('..'), `${stem}-mode-${index + 1}`, viewport);
            }
          } else if (await panels.count()) {
            // A tall panel can be clipped by its ScrollView even in an element screenshot.
            // Scroll each edge into the viewport and capture the actual visible pixels.
            await captureEdges(page, panels.first().locator('..').locator('..').locator('..'), stem, viewport);
          }
        }
        await page.close();
      }
    }
    for (const credits of [100, 75, 25, 0]) {
      const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
      await page.addInitScript(value => localStorage.setItem('@japan_app_learning_economy_v1',
        JSON.stringify({ credits: value, charges: {}, passed: { N5: {}, N4: {}, N3: {}, N2: {}, N1: {} }, officialRank: null })), credits);
      await page.goto(`${base}/home`);
      await page.getByText(new RegExp(`CREDIT\\s+${credits}/100`)).waitFor();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(output, `credit-${credits}.png`) });
      await page.close();
    }
    fs.writeFileSync(path.join(output, 'layout.json'), JSON.stringify({ measurements, errors }, null, 2));
    console.log(`CAPTURED: ${measurements.length} viewport/route combinations and 4 Credit states. Inspect images; native validation remains separate.`);
    if (errors.length) throw new Error(`${errors.length} runtime errors; see layout.json`);
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
