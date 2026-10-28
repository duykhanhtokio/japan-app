// Actual RNWeb guide-reader flows. Royal/safe-area/storage/image adapters are
// explicit QA dependencies; this is not full Expo or native-device approval.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const {chromium} = require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
const esbuild = require('esbuild');
const root = path.resolve(process.env.MANUFACTURING_QA_ROOT || path.join(__dirname, '../..'));
const out = process.env.MANUFACTURING_QA_OUTPUT;
const executablePath = process.env.MANUFACTURING_QA_CHROMIUM;
const studySurface = process.env.MANUFACTURING_QA_STUDY_SURFACE || path.join(root, 'src/theme/study-surface.ts');
const japaneseFont = process.env.MANUFACTURING_QA_JAPANESE_FONT;
if (!out || !path.isAbsolute(out) || !executablePath || !japaneseFont) throw Error('Set QA_OUTPUT, QA_CHROMIUM and QA_JAPANESE_FONT');
fs.mkdirSync(out, {recursive: true});
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const guides = read('src/data/manufacturing/source-guides.json').guides;
const targets = read('src/data/manufacturing/source-guide-translations.json').locales;
const guideIds = [read('docs/ssw-workspace/manufacturing/batch27-caliper/guide.ja.json').id];
const added = guideIds.map(id => guides.find(g => g.id === id));
assert(added.every(Boolean), 'Caliper preview guide must be integrated first');
const labels = read('src/data/manufacturing/ui-translations.json').locales;
const specialtyTitles = Object.fromEntries(read('src/data/manufacturing/course-manifest.json').specialties.map(s => [s.id, s.titleJa]));
const adapters = {
  safe: 'export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});',
  backdrop: 'export const useBackdropOcclusion=()=>{};',
  storage: `export default {getItem:async k=>localStorage.getItem(k),setItem:async(k,v)=>{if(window.__failWrite)throw Error('QA write failure');localStorage.setItem(k,v)}};`,
  royal: `import React from 'react';import{View,Pressable,Text}from'react-native';export const ROYAL_LAYOUT={screenGutter:12,backSafeTop:8},ROYAL_FONT={};export const RoyalBackButton=({onPress})=><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onPress}><Text>Back</Text></Pressable>;export const RoyalContentPanel=({children,style})=><View style={style}>{children}</View>;export const RoyalExplanationPanel=RoyalContentPanel;export default({children})=><View style={{flex:1,backgroundColor:'#eee6d6'}}>{children}</View>;`,
};

(async () => {
  const bundle = await esbuild.build({
    stdin: {contents: `import React from 'react';import{createRoot}from'react-dom/client';import{ManufacturingCourse}from'./src/components/manufacturing/ManufacturingCourse';import{manufacturingCompletionKey,manufacturingLessonDone}from'./src/services/manufacturing-study-state';const root=createRoot(document.getElementById('root'));window.qaCompletionKey=manufacturingCompletionKey;window.qaLessonDone=manufacturingLessonDone;window.qaMount=(language,learner)=>root.render(<ManufacturingCourse key={language+learner} learner={learner} language={language} onBack={()=>{window.__left=true}}/>);window.qaReady=true;`, resolveDir: root, loader: 'tsx'},
    write:false, minify:true, bundle: true, platform: 'browser', jsx: 'automatic',
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
  const html=`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:ManufacturingQA;src:url('/japanese.otf')}html,body,#root{height:100%;margin:0}#root{display:flex;flex-direction:column}*{box-sizing:border-box;font-family:ManufacturingQA,sans-serif!important}</style><div id="root"></div><script src="/entry.js"></script>`;
  const server=http.createServer((req,res)=>{
    const route=new URL(req.url,'http://localhost').pathname;
    res.setHeader('Content-Type',route==='/entry.js'?'application/javascript':route==='/japanese.otf'?'font/otf':'text/html; charset=utf-8');
    res.end(route==='/entry.js'?bundle.outputFiles[0].contents:route==='/japanese.otf'?fs.readFileSync(japaneseFont):html);
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
    for (const viewportWidth of [320,932]) for (const locale of ['ja', ...Object.keys(targets)]) for (const guide of added) {
      const learner = `guide29-${locale}-${guide.specialty}-${viewportWidth}`;
      await page.setViewportSize(viewportWidth === 932 ? {width:932,height:430} : {width:320,height:568});
      const old = guides.find(g => g.specialty === guide.specialty && !guideIds.includes(g.id))
        || read(`src/data/manufacturing/${guide.specialty}.json`).lessons[0];
      const core = read(`src/data/manufacturing/${guide.specialty}.json`).lessons[0];
      const key = await page.evaluate(({learner, specialty}) => window.qaCompletionKey(learner, specialty), {learner, specialty: guide.specialty});
      await page.evaluate(({key, old, core, guide}) => {
        localStorage.setItem(key, JSON.stringify({version: 1, entries: {[old.id]: old.sourceHash, [core.id]:core.sourceHash, [guide.id]: '0'.repeat(64)}}));
        window.qaMount(guide.locale, guide.learner);
      }, {key, old, core, guide: {...guide, locale, learner}});
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
      if ((locale === 'vi' || locale === 'ja') && guide.specialty === 'mechanical') {
        
        await page.getByText(guide.objectiveJa, {exact: true}).scrollIntoViewIfNeeded();
        const filename = `${locale}-${guide.specialty}-${viewportWidth}-reader.png`;
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
      assert.equal(record.entries[core.id], core.sourceHash, 'Core lesson completion must be preserved');
      await page.getByRole('button', {name: guide.titleJa, exact: true}).click();
      await page.getByText(guide.objectiveJa, {exact: true}).waitFor();
      assert(await page.evaluate(({key, guide}) => window.qaLessonDone(JSON.parse(localStorage.getItem(key)), guide), {key, guide}));
      checks.push({locale, viewportWidth, guideId: guide.id, completionCurrentHash: true, priorCompletionPreserved: old.id, coreCompletionPreserved:core.id, translationToggle: locale !== 'ja'});
    }
    assert.equal(checks.length, 26);
    assert.deepEqual(errors, []);
    const report = {status: 'PASS', actualReaderFlows: checks.length, checks, screenshots, errors,
      scope: 'Actual ManufacturingCourse/Reader, source-bound guide lookups and state services through ReactNativeWeb; Royal/safearea/storage/decorative-image QA adapters; In-memory bundle to avoid disk duplication; Japanese QA font only. No all-script glyph, fullExpo, native-device or native-language certification.',
      storageFailureRecovery: true, staleCompletionRejected: true, nativeReviewed: false, domainReviewed: false, releaseReady: false};
    fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({status: 'PASS', actualReaderFlows: checks.length, screenshots, errors}));
  } finally {if (browser) await browser.close(); server.close();}
})().catch(error => {console.error(error); process.exitCode = 1;});
