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
    stdin: {contents: `import React from 'react';import{createRoot}from'react-dom/client';import{ManufacturingCourse}from'./src/components/manufacturing/ManufacturingCourse';import{manufacturingCompletionKey,manufacturingLessonDone,freshTestAttempt,manufacturingExamKey,restoreTestAttempt}from'./src/services/manufacturing-study-state';import{manufacturingSupplementExams}from'./src/data/manufacturing/supplement-practice';const root=createRoot(document.getElementById('root'));window.qaCompletionKey=manufacturingCompletionKey;window.qaLessonDone=manufacturingLessonDone;window.qaMount=(language,learner)=>root.render(<ManufacturingCourse key={language+learner} learner={learner} language={language} onBack={()=>{window.__left=true}}/>);window.qaReady=true;window.qaStudy={freshTestAttempt,manufacturingExamKey,restoreTestAttempt};window.qaSupplement=manufacturingSupplementExams;`, resolveDir: root, loader: 'tsx'},
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

    const supplement=read('src/data/manufacturing/supplement-practice.json');
    const url=`http://127.0.0.1:${server.address().port}/`;
    for(const width of [320,932])for(const locale of ['ja',...Object.keys(supplement.locales)]){
      await page.setViewportSize(width===320?{width:320,height:568}:{width:932,height:430});
      const learner=`practice32-${width}-${locale}`,u=labels[locale];
      async function open(){
        await page.goto(url);await page.waitForFunction(()=>window.qaReady);
        await page.evaluate(({locale,learner})=>window.qaMount(locale,learner),{locale,learner});
        await page.getByRole('button',{name:specialtyTitles.mechanical,exact:true}).click();
        await page.getByRole('button',{name:u.weeklyChecks,exact:true}).click();
        const card=page.getByText(supplement.titleJa,{exact:true}).locator('..');
        await card.getByRole('button',{name:u.openResume,exact:true}).click();
      }
      await open();
      const old=await page.evaluate(({learner})=>{
        const e=window.qaSupplement('mechanical')[0],key=window.qaStudy.manufacturingExamKey(learner,'mechanical','mfg1-mechanical-weekly-01');
        const raw=JSON.stringify({preserve:'existing-check-record'});localStorage.setItem(key,raw);return{key,raw};
      },{learner});
      for(let i=0;i<8;i++){
        const q=supplement.questions[i];await page.getByText(q.stemJa,{exact:true}).waitFor();
        if(i===0&&locale!=='ja')await page.getByRole('button',{name:u.translationShow,exact:true}).click();
        if(locale!=='ja')await page.getByText(supplement.locales[locale][i][0],{exact:true}).waitFor();
        assert.equal(await page.getByText('正解です。'+q.explanationJa,{exact:true}).count(),0,'Early explanation');
        const translated=locale==='ja'?'':'\n'+supplement.locales[locale][i][1][q.correctIndex];
        if(i===0&&locale==='vi'&&width===320){
          await page.evaluate(()=>window.__failWrite=true);
          await page.getByRole('button',{name:`${q.correctIndex+1}. ${q.optionsJa[q.correctIndex]}${translated}`,exact:true}).click();
          await page.getByText(u.answerSaveError,{exact:true}).waitFor();
          await page.evaluate(()=>window.__failWrite=false);await page.getByRole('button',{name:u.retry,exact:true}).click();
        }else await page.getByRole('button',{name:`${q.correctIndex+1}. ${q.optionsJa[q.correctIndex]}${translated}`,exact:true}).click();
        if(i<7)await page.getByRole('button',{name:u.next,exact:true}).click();
      }
      await page.waitForFunction(({learner,id})=>{
        const raw=localStorage.getItem(window.qaStudy.manufacturingExamKey(learner,'mechanical',id));return raw&&JSON.parse(raw).answers.every(x=>x!==null)&&JSON.parse(raw).currentQuestion===7;
      },{learner,id:supplement.id});
      await open();await page.getByText(supplement.questions[7].stemJa,{exact:true}).waitFor();
      await page.getByRole('button',{name:u.submit,exact:true}).click();await page.getByRole('button',{name:u.confirm,exact:true}).click();
      await page.getByText(`${u.correct} 8 / 8 · ${u.unanswered} 0`,{exact:true}).waitFor();
      if(locale!=='ja')await page.getByRole('button',{name:u.translationShow,exact:true}).click();
      for(let i=7;i>=0;i--){
        const q=supplement.questions[i];await page.getByText(q.stemJa,{exact:true}).waitFor();
        for(let option=0;option<4;option++){
          const reason=(option===q.correctIndex?'正解です。':'この選択肢は適切ではありません。')+q.explanationJa;
          await page.getByText(`${option+1}. ${reason}`,{exact:true}).waitFor();
          if(locale!=='ja'){
            const reason=supplement.reasonPrefixes[locale][option===q.correctIndex?0:1]+supplement.locales[locale][i][2];
            assert((await page.getByText(reason,{exact:true}).count())>0);
          }
        }
        if(i>0)await page.getByRole('button',{name:u.previous,exact:true}).click();
      }
      assert.equal(await page.evaluate(k=>localStorage.getItem(k),old.key),old.raw);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      if(['ja','vi'].includes(locale)){
        const file=`${locale}-${width}-submitted.png`;await page.screenshot({path:path.join(out,file)});screenshots.push(file);
      }
      checks.push({locale,width,questions:8,translatedQuestions:locale==='ja'?0:8,score:8,resume:true,priorRecordPreserved:true,noEarlyReasons:true});
    }
    assert.equal(errors.length,0);assert.equal(checks.length,26);
    const result={status:'PASS',flows:checks.length,questionVisits:208,targetQuestionVisits:192,checks,screenshots,errors,scope:'Actual RNWeb course and weekly controller; explicit Royal, storage, safe-area and decorative-image adapters. Japanese QA font. No full Expo/native-device or all-script glyph certification.'};
    fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:'PASS',flows:26,questionVisits:208,targetQuestionVisits:192,errors}));
  }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
