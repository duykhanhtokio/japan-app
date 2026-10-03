// Full production app checks. Browser viewports do not certify native platforms.
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES
  ? path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright') : 'playwright');
const output = process.env.JAPAN_UI_OUTPUT_DIR || path.join(process.cwd(), 'docs/ui-workspace/royal-final-2026-10-03');
const base = process.env.JAPAN_UI_BASE_URL || 'http://127.0.0.1:8099';
fs.mkdirSync(output, { recursive: true });

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.JAPAN_UI_BROWSER_PATH,
    headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const report = { runtime: 'production-web', errors: [], views: [] };
  try {
    for (const viewport of [{ width: 430, height: 932 }, { width: 360, height: 800 },
      { width: 768, height: 1024 }, { width: 1366, height: 768 }]) {
      const page = await browser.newPage({ viewport });
      const view = { viewport, actions: [] };
      report.views.push(view);
      page.on('pageerror', error => report.errors.push({ viewport, message: error.message }));
      await page.addInitScript(() => {
        window.__uiQA = { longTasks: [], gaps: [] };
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) window.__uiQA.longTasks.push({ start: entry.startTime, ms: entry.duration });
        }).observe({ entryTypes: ['longtask'] });
        let last = performance.now();
        function frame(now) {
          if (now - last > 50) window.__uiQA.gaps.push({ start: last, ms: now - last });
          last = now;
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
      const readyStart = Date.now();
      await page.goto(base + '/home', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.getByText('筆記学習', { exact: true }).waitFor({ timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);
      view.initialReadyMs = Date.now() - readyStart;
      await page.waitForTimeout(300);
      view.initialPerformance = await page.evaluate(() => window.__uiQA);
      await page.evaluate(() => { window.__uiQA.longTasks = []; window.__uiQA.gaps = []; });
      const capture = async name => {
        await page.waitForTimeout(150);
        await page.screenshot({ path: path.join(output, `${name}-${viewport.width}x${viewport.height}.png`) });
      };
      async function action(name, run, visible) {
        const start = Date.now();
        const performanceStart = await page.evaluate(() => performance.now());
        await run();
        await visible.waitFor({ timeout: 15000 });
        view.actions.push({ name, ms: Date.now() - start, performanceStart });
        await page.waitForTimeout(200);
      }
      const back = () => page.getByRole('button', { name: '戻る', exact: true }).click();
      const home = page.getByText('筆記学習', { exact: true });
      const map = page.getByRole('button', { name: 'ショップ', exact: true });
      await capture('home');
      const cdp = await page.context().newCDPSession(page);
      if (viewport.width === 430) {
        await cdp.send('Profiler.enable');
        await cdp.send('Profiler.setSamplingInterval', { interval: 500 });
        await cdp.send('Profiler.start');
      }
      await action('Home → Learn', () => home.click(), page.getByText('JLPT 学習', { exact: true }));
      if (viewport.width === 430) {
        const { profile } = await cdp.send('Profiler.stop');
        fs.writeFileSync(path.join(output, 'first-learn-after.cpuprofile'), JSON.stringify(profile));
      }
      await capture('learn');
      await action('Learn → Home', back, home);
      await action('Home → Game', () => page.getByRole('button', { name: 'ゲーム', exact: true }).click(), page.getByText(/^Lv\.\d+$/));
      await capture('game');
      if (viewport.width === 430) {
        for (const area of ['鶏小屋', '牛舎']) {
          await action(`Game → ${area}`, () => page.getByRole('button', { name: area, exact: true }).click(), page.getByText('えさ', { exact: true }).first());
          await page.getByText('えさ', { exact: true }).first().click();
          await page.waitForTimeout(250);
          await capture(area === '鶏小屋' ? 'chicken-fed' : 'cow-fed');
          await action(`${area} → map`, back, map);
        }
        await action('Game → restaurant', () => page.getByRole('button', { name: 'レストラン', exact: true }).click(), page.getByText('ファームレストラン', { exact: true }));
        await capture('restaurant');
        await action('Restaurant → map', back, map);
      }
      await action('Game → orchard', () => page.getByRole('button', { name: '果樹園', exact: true }).click(), page.getByText('植える', { exact: true }).first());
      await page.getByText('植える', { exact: true }).first().click();
      await page.getByText('植える木を選ぶ', { exact: true }).waitFor();
      await capture('orchard-picker');
      view.orchardPanel = await page.getByText('植える木を選ぶ', { exact: true }).evaluate(el => {
        const panel = el.parentElement.parentElement.parentElement;
        const style = getComputedStyle(panel);
        return { borderTopWidth: style.borderTopWidth, backgroundColor: style.backgroundColor, boxShadow: style.boxShadow };
      });
      await page.getByRole('button', { name: '閉じる', exact: true }).click();
      await action('Orchard → map', back, map);
      await action('Game → Home', back, home);
      if (viewport.width === 430) {
        for (let cycle = 0; cycle < 2; cycle++) {
          await action('Home → Learn', () => home.click(), page.getByText('JLPT 学習', { exact: true }));
          await action('Learn → Home', back, home);
          await action('Home → Game', () => page.getByRole('button', { name: 'ゲーム', exact: true }).click(), map);
          await action('Game → Home', back, home);
        }
      }
      view.navigationPerformance = await page.evaluate(() => window.__uiQA);
      await page.close();
    }
    fs.writeFileSync(path.join(output, 'runtime.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ errors: report.errors, views: report.views.map(view => ({
      viewport: view.viewport, actions: view.actions, navigationPerformance: view.navigationPerformance, orchardPanel: view.orchardPanel,
    })) }));
    if (report.errors.length) throw new Error('Runtime page errors were captured');
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
