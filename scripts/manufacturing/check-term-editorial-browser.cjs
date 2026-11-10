// Actual RNWeb source-bound surface term-reader flows. Royal/safe-area/storage/image adapters are
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
    stdin: {contents: `import * as courseApi from './src/data/manufacturing';import * as mockApi from './src/data/manufacturing/mocks';import * as mockState from './src/services/manufacturing-mock-state';import * as translationApi from './src/data/manufacturing/translations';import * as guideApi from './src/data/manufacturing/source-guides';import React from 'react';import{createRoot}from'react-dom/client';import{ManufacturingCourse}from'./src/components/manufacturing/ManufacturingCourse';import{manufacturingCompletionKey,manufacturingLessonDone,freshTestAttempt,manufacturingExamKey,restoreTestAttempt}from'./src/services/manufacturing-study-state';import{manufacturingSupplementExams}from'./src/data/manufacturing/supplement-practice';let mountSerial=0;const root=createRoot(document.getElementById('root'));window.qaCompletionKey=manufacturingCompletionKey;window.qaLessonDone=manufacturingLessonDone;window.qaMount=(language,learner)=>root.render(<ManufacturingCourse key={language+learner+(++mountSerial)} learner={learner} language={language} onBack={()=>{window.__left=true}}/>);window.qaStudy={freshTestAttempt,manufacturingExamKey,restoreTestAttempt};window.qaSupplement=manufacturingSupplementExams;window.qa33={...courseApi,...mockApi,...mockState,...translationApi,...guideApi};window.qaReady=true;`, resolveDir: root, loader: 'tsx'},
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



    const patch=read('src/data/manufacturing/term-editorial.json');
    const course=read('src/data/manufacturing/surface.json');
    const lesson=course.lessons.find(l=>l.id===patch.lessonId),prior=course.lessons[0];
    const info=read('src/data/manufacturing/course-manifest.json').specialties.find(s=>s.id==='surface');
    const week=info.weeks.find(w=>w.lessonIds.includes(lesson.id)),day=week.lessonIds.indexOf(lesson.id)+1;
    let counter=0;
    for(const width of [320,932])for(const locale of Object.keys(patch.wording)){
      await page.setViewportSize(width===320?{width:320,height:568}:{width:932,height:430});
      const learner=`term-clarification35-${counter++}`,u=labels[locale];
      await page.evaluate(({learner,prior,lesson})=>{
        const key=window.qaCompletionKey(learner,'surface');
        localStorage.setItem(key,JSON.stringify({version:1,entries:{[prior.id]:prior.sourceHash,[lesson.id]:lesson.sourceHash}}));
      },{learner,prior,lesson});
      const open=async()=>{
        await page.evaluate(({locale,learner})=>window.qaMount(locale,learner),{locale,learner});
        await page.getByRole('button',{name:specialtyTitles.surface,exact:true}).click();
        await page.getByRole('button',{name:`第${week.number}週\n${week.titleJa}`,exact:true}).click();
        await page.getByTestId(`mfg-day-surface-${day}`).click();
      };
      await open();
      await page.getByText(patch.wording.ja.after,{exact:false}).waitFor();
      assert.equal(await page.getByText(patch.wording.ja.before,{exact:false}).count(),0);
      if(locale!=='ja'){
        assert.equal(await page.getByText(patch.wording[locale].after,{exact:false}).count(),0);
        await page.getByRole('button',{name:u.translationShow,exact:true}).click();
        await page.getByText(patch.wording[locale].after,{exact:false}).waitFor();
        assert.equal(await page.getByText(patch.wording[locale].before,{exact:false}).count(),0);
        assert.equal(await page.getByText(patch.wording.ja.after,{exact:false}).count(),1);
      }
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      if(['ja','vi','en'].includes(locale)){
        await page.getByText(patch.wording.ja.after,{exact:false}).scrollIntoViewIfNeeded();
        const file=`${locale}-${width}-clarification.png`;await page.screenshot({path:path.join(out,file)});screenshots.push(file);
      }
      if(locale==='vi'&&width===320){
        await page.evaluate(()=>{window.__failWrite=true;});
        await page.getByRole('button',{name:u.complete,exact:true}).click();
        await page.getByRole('alert').waitFor();
        await page.evaluate(()=>{window.__failWrite=false;});
      }
      await page.getByRole('button',{name:u.complete,exact:true}).click();
      await page.getByTestId(`mfg-day-surface-${day}`).waitFor();
      assert.deepEqual(await page.evaluate(({learner})=>JSON.parse(localStorage.getItem(window.qaCompletionKey(learner,'surface'))).entries,{learner}),{[prior.id]:prior.sourceHash,[lesson.id]:lesson.sourceHash});
      await page.getByTestId(`mfg-day-surface-${day}`).click();
      await page.getByText(patch.wording.ja.after,{exact:false}).waitFor();
      checks.push({locale,width,exactJapanese:true,exactTranslation:locale!=='ja',oldWordingAbsent:true,completionPreserved:true,reopen:true});
    }
    assert.equal(errors.length,0);
    assert.equal(checks.length,26);
    const result={status:'PASS',flows:checks.length,checks,screenshots,errors,saveFailureRetry:true,scope:'Actual source-bound surface062 term clarification through ManufacturingCourse/Reader through RNWeb with explicit Royal/storage/safearea/decorative-image adapters and Japanese QA font. No physical-device, all-script glyph or human/native/domain certification.'};
    fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:'PASS',flows:checks.length,errors}));
  }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{
  const launchBlocked=/process_singleton_posix|socket\(\) failed: Operation not permitted/.test(String(e));
  if(out)fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({status:launchBlocked?'BLOCKED':'FAIL',flows:0,errors:[String(e.message).split('Call log:')[0].trim()],scope:'No successful browser acceptance is inferred from a bundled entry. Explicit Royal/storage/safearea/decorative-image adapters and Japanese QA font; no native-device certification.'},null,2));
  console.error(e);process.exitCode=1;
});
