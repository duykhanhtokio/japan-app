// Actual RNWeb guide-reader flows. Royal/safe-area/storage/image adapters are
// explicit QA dependencies; this is not full Expo or native-device approval.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const esbuild = require('esbuild');
const root = path.resolve(process.env.MANUFACTURING_QA_ROOT || path.join(__dirname, '../..'));
const out = process.env.MANUFACTURING_QA_OUTPUT;
const executablePath = process.env.MANUFACTURING_QA_CHROMIUM;
const studySurface = process.env.MANUFACTURING_QA_STUDY_SURFACE || path.join(root, 'src/theme/study-surface.ts');
const fontModules = process.env.MANUFACTURING_QA_FONT_MODULES;
if (!out || !path.isAbsolute(out) || !executablePath || !fontModules) throw Error('Set QA_OUTPUT, QA_CHROMIUM and QA_FONT_MODULES');
fs.mkdirSync(out, {recursive: true});
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const guides = read('src/data/manufacturing/source-guides.json').guides;
const targets = read('src/data/manufacturing/source-guide-translations.json').locales;
const guideIds = [
  'mfg1-mechanical-source-guide-tolerance-annotation',
  'mfg1-electrical-source-guide-leakage-earth',
  'mfg1-surface-source-guide-pretreatment-jig',
];
const added = guideIds.map(id => guides.find(g => g.id === id));
assert(added.every(Boolean), 'Three approved extension guides must be integrated first');
const labels = read('src/data/manufacturing/ui-translations.json').locales;
const specialtyTitles = Object.fromEntries(read('src/data/manufacturing/course-manifest.json').specialties.map(s => [s.id, s.titleJa]));
const adapters = {
  safe: 'export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});',
  backdrop: 'export const useBackdropOcclusion=()=>{};',
  storage: `export default {getItem:async k=>localStorage.getItem(k),setItem:async(k,v)=>{if(window.__failWrite)throw Error('QA write failure');localStorage.setItem(k,v)}};`,
  royal: `import React from 'react';import{View,Pressable,Text}from'react-native';export const ROYAL_LAYOUT={screenGutter:12,backSafeTop:8},ROYAL_FONT={};export const RoyalBackButton=({onPress})=><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onPress}><Text>Back</Text></Pressable>;export const RoyalContentPanel=({children,style})=><View style={style}>{children}</View>;export const RoyalExplanationPanel=RoyalContentPanel;export default({children})=><View style={{flex:1,backgroundColor:'#eee6d6'}}>{children}</View>;`,
};

(async () => {
  await esbuild.build({
    stdin: {contents: `import React from 'react';import{createRoot}from'react-dom/client';import{ManufacturingCourse}from'./src/components/manufacturing/ManufacturingCourse';import{manufacturingCompletionKey,manufacturingLessonDone}from'./src/services/manufacturing-study-state';const root=createRoot(document.getElementById('root'));window.qaCompletionKey=manufacturingCompletionKey;window.qaLessonDone=manufacturingLessonDone;window.qaMount=(language,learner)=>root.render(<ManufacturingCourse key={language+learner} learner={learner} language={language} onBack={()=>{window.__left=true}}/>);window.qaReady=true;`, resolveDir: root, loader: 'tsx'},
    outfile: path.join(out, 'entry.js'), bundle: true, platform: 'browser', jsx: 'automatic',
    nodePaths: (process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean),
    tsconfigRaw: {compilerOptions: {baseUrl: root, paths: {'@/*': ['src/*']}}},
    define: {'process.env.NODE_ENV': '"development"', __DEV__: 'true'},
    plugins: [{name: 'explicit-rnweb-qa-adapters', setup(b) {
      b.onResolve({filter: /^react-native$/}, () => ({path: require.resolve('react-native-web')}));
      b.onResolve({filter: /^react-native-safe-area-context$/}, () => ({path: 'safe', namespace: 'adapter'}));
      b.onResolve({filter: /^@react-native-async-storage\/async-storage$/}, () => ({path: 'storage', namespace: 'adapter'}));
      b.onResolve({filter: /RoyalPageBackground|RoyalPanels|RoyalSurface/}, () => ({path: 'royal', namespace: 'adapter'}));
      b.onResolve({filter: /AppBackdrop$/}, () => ({path: 'backdrop', namespace: 'adapter'}));
      b.onResolve({filter: /theme\/study-surface$/}, () => ({path: studySurface}));
      b.onLoad({filter: /.*/, namespace: 'adapter'}, a => ({contents: adapters[a.path], loader: 'jsx', resolveDir: root}));
      b.onResolve({filter: /\.(png|webp|jpg)$/}, a => ({path: a.path, namespace: 'qa-image'}));
      b.onLoad({filter: /.*/, namespace: 'qa-image'}, () => ({contents: `export default {uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jGxkAAAAASUVORK5CYII='};`, loader: 'js'}));
    }}],
  });
  const fontNames = ['noto-sans-jp', 'noto-sans-sc', 'noto-sans-tc', 'noto-sans-devanagari', 'noto-sans-bengali', 'noto-sans-myanmar', 'noto-sans-thai', 'noto-sans-khmer'];
  const imports = fontNames.map(name => `@import url('/font/${name}/400.css');`).join('');
  fs.writeFileSync(path.join(out, 'index.html'), `<!doctype html><meta charset="utf-8"><style>${imports}html,body,#root{height:100%;margin:0}*{box-sizing:border-box;font-family:'Noto Sans JP','Noto Sans SC','Noto Sans TC','Noto Sans Devanagari','Noto Sans Bengali','Noto Sans Myanmar','Noto Sans Thai','Noto Sans Khmer',sans-serif!important}</style><div id="root"></div><script src="/entry.js"></script>`);
  const server = http.createServer((request, response) => {
    const route = new URL(request.url, 'http://localhost').pathname;
    let file;
    if (route.startsWith('/font/')) {
      const relative = route.slice('/font/'.length);
      if (relative.includes('..')) {response.writeHead(400).end(); return;}
      file = path.join(fontModules, '@fontsource', relative);
    } else file = path.join(out, route === '/entry.js' ? 'entry.js' : 'index.html');
    if (!fs.existsSync(file)) {response.writeHead(404).end(); return;}
    response.setHeader('Content-Type', file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.woff2') ? 'font/woff2' : 'text/html; charset=utf-8');
    response.end(fs.readFileSync(file));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  const errors = [], checks = [], screenshots = [];
  try {
    browser = await chromium.launch({executablePath, headless: true, args: ['--no-sandbox', '--disable-gpu', '--no-zygote']});
    const page = await browser.newPage({viewport: {width: 390, height: 844}});
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.waitForFunction(() => window.qaReady === true);
    let index = 0;
    for (const locale of ['ja', ...Object.keys(targets)]) for (const guide of added) {
      const learner = `guide18-${locale}-${guide.specialty}`;
      await page.setViewportSize(index++ % 2 ? {width: 932, height: 430} : {width: 320, height: 568});
      const old = guides.find(g => g.specialty === guide.specialty && !guideIds.includes(g.id))
        || read(`src/data/manufacturing/${guide.specialty}.json`).lessons[0];
      const key = await page.evaluate(({learner, specialty}) => window.qaCompletionKey(learner, specialty), {learner, specialty: guide.specialty});
      await page.evaluate(({key, old, guide}) => {
        localStorage.setItem(key, JSON.stringify({version: 1, entries: {[old.id]: old.sourceHash, [guide.id]: '0'.repeat(64)}}));
        window.qaMount(guide.locale, guide.learner);
      }, {key, old, guide: {...guide, locale, learner}});
      await page.getByRole('button', {name: specialtyTitles[guide.specialty], exact: true}).click();
      await page.getByRole('button', {name: guide.titleJa, exact: true}).click();
      await page.getByText(guide.objectiveJa, {exact: true}).waitFor();
      const stale = await page.evaluate(({key, guide}) => window.qaLessonDone(JSON.parse(localStorage.getItem(key)), guide), {key, guide});
      assert.equal(stale, false, 'Stale completion hash must not count');
      if (locale !== 'ja') {
        const target = targets[locale][guide.id];
        const text = target.title + '\n' + target.objective;
        assert.equal(await page.getByText(text, {exact: true}).count(), 0, 'Translation must begin hidden');
        await page.getByRole('button', {name: labels[locale].translationShow, exact: true}).click();
        await page.getByText(text, {exact: true}).waitFor();
        for (const paragraph of target.paragraphs) await page.getByText(paragraph.title + '\n' + paragraph.text, {exact: true}).waitFor();
        await page.getByRole('button', {name: labels[locale].translationHide, exact: true}).click();
        assert.equal(await page.getByText(text, {exact: true}).count(), 0);
        await page.getByText(guide.objectiveJa, {exact: true}).waitFor();
        await page.getByRole('button', {name: labels[locale].translationShow, exact: true}).click();
      }
      await page.evaluate(() => document.fonts.ready);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Guide horizontal overflow');
      if ((locale === 'vi' && guide.specialty === 'mechanical') || (locale === 'en' && guide.specialty === 'electrical') || (locale === 'ja' && guide.specialty === 'surface')) {
        if (locale === 'en' && guide.specialty === 'electrical') await page.setViewportSize({width: 932, height: 430});
        await page.getByText(guide.objectiveJa, {exact: true}).scrollIntoViewIfNeeded();
        const filename = `${locale}-${guide.specialty}-reader.png`;
        await page.screenshot({path: path.join(out, filename)});
        screenshots.push(filename);
      }
      if (locale === 'vi' && guide.specialty === 'mechanical') {
        await page.evaluate(() => {window.__failWrite = true;});
        await page.getByRole('button', {name: labels[locale].complete, exact: true}).click();
        await page.getByText(labels[locale].saveError, {exact: true}).waitFor();
        assert.equal(await page.evaluate(({key, guide}) => window.qaLessonDone(JSON.parse(localStorage.getItem(key)), guide), {key, guide}), false);
        await page.evaluate(() => {window.__failWrite = false;});
      }
      await page.getByRole('button', {name: labels[locale].complete, exact: true}).click();
      await page.getByRole('button', {name: guide.titleJa, exact: true}).waitFor();
      const record = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
      assert.equal(record.entries[guide.id], guide.sourceHash);
      assert.equal(record.entries[old.id], old.sourceHash, 'Prior source-bound completion must be preserved');
      await page.getByRole('button', {name: guide.titleJa, exact: true}).click();
      await page.getByText(guide.objectiveJa, {exact: true}).waitFor();
      assert(await page.evaluate(({key, guide}) => window.qaLessonDone(JSON.parse(localStorage.getItem(key)), guide), {key, guide}));
      checks.push({locale, guideId: guide.id, completionCurrentHash: true, priorCompletionPreserved: old.id, translationToggle: locale !== 'ja'});
    }
    assert.equal(checks.length, 39);
    assert.deepEqual(errors, []);
    const report = {status: 'PASS', actualReaderFlows: checks.length, checks, screenshots, errors,
      scope: 'Actual ManufacturingCourse/Reader, source-bound guide lookups and state services through ReactNativeWeb; Royal/safearea/storage/image QA adapters and QA fonts. No fullExpo, native-device or native-language certification.',
      storageFailureRecovery: true, staleCompletionRejected: true, nativeReviewed: false, domainReviewed: false, releaseReady: false};
    fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({status: 'PASS', actualReaderFlows: checks.length, screenshots, errors}));
  } finally {if (browser) await browser.close(); server.close();}
})().catch(error => {console.error(error); process.exitCode = 1;});
