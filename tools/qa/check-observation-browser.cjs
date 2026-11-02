// Browser UI regression only. Synthetic clock actions are not learner evidence.
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const { chromium } = require('playwright');
(async () => {
  const executablePath = process.env.QA_CHROMIUM_PATH || (require('node:fs').existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
  const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(pathToFileURL(path.join(__dirname, 'physical-study-session.html')).href);
    await page.selectOption('#m-sector', 'agriculture');
    await page.selectOption('#m-target', 'nativeApp');
    for (const [key, value] of Object.entries({ anonymousLearner: 'SYNTHETIC-UI-FIXTURE', deviceModel: 'NOT-A-PHYSICAL-TEST', os: 'fixture', buildLabel: 'fixture', buildCommit: 'a'.repeat(40), locale: 'vi', courseScope: '1go', studyDay: 'fixture-day', contentIds: 'fixture-id' })) await page.fill('#m-' + key, value);
    await page.click('#create');
    await page.click('#start');
    assert.equal(await page.isDisabled('#phase'), true);
    assert.equal(await page.isDisabled('#start'), true);
    await page.click('#pause');
    const before = await page.evaluate(() => StudyObservation.summary(JSON.parse(localStorage.getItem('japan-app:qa:manual-study-observation:v1'))).activeMs);
    assert(before > 0);
    await page.reload();
    await page.click('#recover');
    const after = await page.evaluate(() => StudyObservation.summary(JSON.parse(localStorage.getItem('japan-app:qa:manual-study-observation:v1'))).activeMs);
    assert.equal(after, before, 'reload/recovery cannot add an assumed learning interval');
    await page.selectOption('#c-coldStart', 'pass');
    await page.click('#finish');
    assert.match(await page.textContent('#message'), /evidence reference/);
    await page.selectOption('#c-coldStart', 'not_run');
    await page.selectOption('#completed', 'false');
    await page.fill('#comprehension', 'SYNTHETIC UI CHECK ONLY — no human learner/device tested');
    const download = page.waitForEvent('download');
    await page.click('#finish');
    const fs = require('node:fs');
    const exported = JSON.parse(fs.readFileSync(await (await download).path(), 'utf8'));
    assert.equal(exported.review.physicalDeviceVerified, false);
    assert.equal(exported.review.learnerDurationAccepted, false);
    assert.equal(exported.deviceChecks.coldStart.status, 'not_run');
    assert.equal(exported.acceptance, 'human_report_pending_evidence_review');
    assert.equal(exported.summary.activeMs, before);
    for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1280, height: 800 }]) {
      await page.setViewportSize(viewport);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'No horizontal overflow at ' + JSON.stringify(viewport));
    }
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS_OBSERVATION_BROWSER: create/start/pause/recover, evidence rejection, unverified export, 3 viewport geometries; synthetic checks excluded from learner/device acceptance');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
