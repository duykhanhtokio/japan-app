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


    const patches=read('src/data/manufacturing/editorial-translations.json').patches;
    const cases=new Map(),sources={lesson:{},guide:{},weekly:{},mock:{}};
    for(const s of ['mechanical','electrical','surface']){
      const c=read(`src/data/manufacturing/${s}.json`);c.lessons.forEach(l=>sources.lesson[l.id]={source:l,specialty:s});
      c.checks.forEach((e,examIndex)=>e.questions.forEach((q,index)=>sources.weekly[q.id]={source:q,exam:e,examIndex,index,specialty:s}));
      read(`src/data/manufacturing/mocks/${s}.json`).exams.forEach((e,examIndex)=>Object.entries(e.sections).forEach(([section,def])=>def.questions.forEach((q,index)=>sources.mock[q.id]={source:q,exam:e,examIndex,index,section,specialty:s})));
    }
    guides.forEach(g=>sources.guide[g.id]={source:g,specialty:g.specialty});
    for(const p of patches){const info=sources[p.kind][p.entryId];assert(info);const k=[p.kind,p.locale,info.specialty].join(':');if(!cases.has(k))cases.set(k,{...p,...info});}
    // Include the independently reviewed safety-meaning correction even if another VI electrical question was selected above.
    const safety=patches.find(p=>p.locale==='vi'&&p.entryId==='mfg1-electrical-mock-06-practical-q04');assert(safety);if(process.env.MANUFACTURING_QA_SAFETY_ONLY)cases.clear();cases.set('safety',{...safety,...sources.mock[safety.entryId]});
    let number=0;
    for(const width of [320,932])for(const c of cases.values()){
      await page.setViewportSize(width===320?{width:320,height:568}:{width:932,height:430});
      const learner=`review33-${width}-${number++}`,u=labels[c.locale],mui=read('src/data/manufacturing/mock-ui-translations.json').locales[c.locale];
      const related=patches.filter(p=>p.kind===c.kind&&p.locale===c.locale&&p.entryId===c.entryId);
      const seed=async(submitted)=>page.evaluate(({c,learner,submitted})=>{
        const a=window.qa33,course=a.loadManufacturingCourse(c.specialty);
        if(c.kind==='mock'){
          const exam=a.loadManufacturingMocks(c.specialty)[c.examIndex];let attempt=a.freshManufacturingMock(exam),now=Date.now()-10000;
          for(const section of ['theory','practical']){
            attempt=a.startManufacturingMockSection(attempt,exam,section,now);now+=100;
            if(submitted||section!==c.section){attempt=a.submitManufacturingMockSection(attempt,exam,section,now);now+=100;}
            else break;
          }
          attempt.sections[c.section].currentQuestion=c.index;
          localStorage.setItem(a.manufacturingMockKey(learner,c.specialty,exam.id),JSON.stringify(attempt));
        }else if(c.kind==='weekly'){
          const exam=course.checks[c.examIndex],attempt=window.qaStudy.freshTestAttempt(exam);attempt.currentQuestion=c.index;attempt.submitted=submitted;
          localStorage.setItem(window.qaStudy.manufacturingExamKey(learner,c.specialty,exam.id),JSON.stringify(attempt));
        }

      },{c,learner,submitted});
      // Use the same learner for mounted controller and namespaced seeded attempt.
      const mount=async(submitted)=>{
        await page.evaluate(({locale,learner})=>window.qaMount(locale,learner),{locale:c.locale,learner});
        await page.getByRole('button',{name:specialtyTitles[c.specialty],exact:true}).click();
        if(c.kind==='lesson'){
          const info=read('src/data/manufacturing/course-manifest.json').specialties.find(s=>s.id===c.specialty),week=info.weeks.find(w=>w.lessonIds.includes(c.entryId));
          await page.getByRole('button',{name:`第${week.number}週\n${week.titleJa}`,exact:true}).click();
          const day=week.lessonIds.indexOf(c.entryId)+1;await page.getByTestId(`mfg-day-${c.specialty}-${day}`).click();
        }else if(c.kind==='guide')await page.getByRole('button',{name:c.source.titleJa,exact:true}).click();
        else{
          await page.getByRole('button',{name:c.kind==='mock'?mui.mockExams:u.weeklyChecks,exact:true}).click();
          await page.getByRole('button',{name:u.openResume,exact:true}).nth(c.examIndex).click();
          if(c.kind==='mock'&&submitted&&c.section==='practical')await page.getByRole('button',{name:`${mui.review} · ${mui.practical}`,exact:true}).click();
        }
        await page.getByRole('button',{name:u.translationShow,exact:true}).click();
      };
      await page.evaluate(()=>window.qaMount('ja','reset-'+Math.random()));
      await seed(false);await mount(false);
      if(c.kind==='mock')assert.equal(await page.getByTestId('manufacturing-mock-rationales').count(),0);
      for(const p of related.filter(p=>!['weekly','mock'].includes(p.kind)||p.fieldPath[0]!=='reasons'))await page.getByText(p.after,{exact:false}).first().waitFor();
      if(['weekly','mock'].includes(c.kind)){
        for(const p of related.filter(p=>p.fieldPath[0]==='reasons'))assert.equal(await page.getByText(p.after,{exact:true}).count(),0,'No corrected reason before submission');
        // Unmount first, then restore an actually submitted state through the real state adapter.
        await page.evaluate(()=>window.qaMount('ja','reset-'+Math.random()));await seed(true);await mount(true);
        for(const p of related)await page.getByText(p.after,{exact:false}).first().waitFor();
      }
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      if(c===cases.get('safety')){
        const safetyReason=related.find(p=>p.fieldPath[0]==='reasons'&&p.fieldPath[1]===3);assert(safetyReason);await page.getByText(safetyReason.after,{exact:true}).scrollIntoViewIfNeeded();
        const file=`vi-safety-${width}.png`;await page.screenshot({path:path.join(out,file)});screenshots.push(file);
      }
      checks.push({kind:c.kind,locale:c.locale,entryId:c.entryId,width,revisedFields:related.length,noEarlyRationale:['weekly','mock'].includes(c.kind)});
    }
    assert.equal(errors.length,0);
    const result={status:'PASS',flows:checks.length,cases:cases.size,checks,screenshots,errors,scope:'Actual RNWeb course, reader, weekly and mock controllers; source-bound revised wording before/after submission. Royal/storage/safearea/decorative-image adapters and Japanese QA font; not physical-device or all-script glyph certification.'};
    fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:'PASS',flows:checks.length,cases:cases.size,errors}));
  }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
