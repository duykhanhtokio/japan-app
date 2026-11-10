// Agriculture 2026-10-31 actual-route mock checks. Explicit adapters, no native certification.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),out=process.env.AGRICULTURE_QA_OUTPUT;
const esbuild=require('esbuild'),{chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
const all=JSON.parse(fs.readFileSync(path.join(root,'src/data/agriculture/weekly-checks.ja.json'))).exams;
const banks=JSON.parse(fs.readFileSync(path.join(root,'src/data/agriculture/mock-exams.ja.json'))).exams;
assert(out&&process.env.AGRICULTURE_QA_CHROMIUM&&process.env.AGRICULTURE_QA_JAPANESE_FONT);
assert(Array.isArray(banks));
const qaFontBytes=fs.readFileSync(process.env.AGRICULTURE_QA_JAPANESE_FONT);assert(qaFontBytes.length>1000&&!qaFontBytes.subarray(0,100).toString().includes('git-lfs'),'QA font must be actual font bytes, not a Git LFS pointer');
fs.mkdirSync(out,{recursive:true});fs.copyFileSync(process.env.AGRICULTURE_QA_JAPANESE_FONT,path.join(out,'japanese.otf'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

const guardedInputPaths=['src/data/agriculture/daily-learning-support.json','src/components/agriculture/DailyLearningSupport.tsx','src/components/agriculture/DailyInstructionDiagram.tsx','src/data/agriculture/index.ts','src/data/agriculture/lessons.ja.json','src/data/agriculture/course-manifest.json','src/data/agriculture/weekly-checks.ja.json','src/data/agriculture/mock-exams.ja.json','src/data/agriculture/translations.ts','src/components/agriculture/AgricultureCourse.tsx','src/components/agriculture/RecognitionImages.tsx','src/components/agriculture/ConceptDiagrams.tsx','src/services/agriculture-study-state.ts','src/services/kensetsu-test-state.ts','src/components/tokutei/StudyAppearance.tsx',...Object.keys(require('./translation-fixture.cjs')().locales).map(l=>'src/data/agriculture/translations/'+l+'.json')];
const guardedInputSha256=Object.fromEntries(guardedInputPaths.map(p=>[p,sha(path.join(root,p))]));
const adapters={safe:'export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});',backdrop:'export const useBackdropOcclusion=()=>{};',storage:`export default {getItem:async k=>{if(window.__failRead)throw Error('read');return localStorage.getItem(k)},setItem:async(k,v)=>{if(window.__failWrite)throw Error('write');localStorage.setItem(k,v)}};`,royal:`import React from 'react';import {View,Pressable,Text} from 'react-native';export const ROYAL_LAYOUT={screenGutter:12,backSafeTop:8},ROYAL_FONT={};export const RoyalBackButton=({onPress})=><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onPress}><Text>Back</Text></Pressable>;export const RoyalContentPanel=({children,style})=><View style={style}>{children}</View>;export const RoyalExplanationPanel=RoyalContentPanel;export default ({children})=><View style={{flex:1,backgroundColor:'#eee6d6'}}>{children}</View>;`};
(async()=>{
 await esbuild.build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {AgricultureCourse} from './src/components/agriculture/AgricultureCourse';createRoot(document.getElementById('root')).render(<AgricultureCourse learner="agrihold20261031" language={new URLSearchParams(location.search).get("language")||"ja"} onBack={()=>{}}/>);`,resolveDir:root,loader:'tsx'},outfile:path.join(out,'entry.js'),bundle:true,platform:'browser',jsx:'automatic',nodePaths:[process.env.AGRICULTURE_QA_NODE_MODULES],define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},plugins:[{name:'explicit-test-adapters',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'adapter'}));
 b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'adapter'}));
 b.onResolve({filter:/RoyalPageBackground|RoyalPanels|RoyalSurface/},()=>({path:'royal',namespace:'adapter'}));
 b.onResolve({filter:/AppBackdrop$/},()=>({path:'backdrop',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},a=>({contents:adapters[a.path],loader:'jsx',resolveDir:root}));
 b.onResolve({filter:/\.(png|webp|jpg)$/},a=>({path:path.resolve(a.resolveDir,a.path),namespace:'real-asset'}));
 b.onLoad({filter:/.*/,namespace:'real-asset'},a=>({contents:'module.exports={uri:'+JSON.stringify('/qa-asset?path='+encodeURIComponent(path.relative(root,a.path)))+'}',loader:'js'}));
 b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2));for(const ext of ['','.tsx','.ts','.json','/index.ts'])if(fs.existsSync(p+ext)&&fs.statSync(p+ext).isFile())return {path:p+ext};throw Error(p);});
 }}]});
 fs.writeFileSync(path.join(out,'index.html'),'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:AgricultureQA;src:url(/japanese.otf)}'+['hi','bn','my','th','km'].map(l=>'@font-face{font-family:AgricultureQA_'+l+';src:url(/qa-font-'+l+'.woff2)}').join('')+'*{font-family:AgricultureQA,AgricultureQA_hi,AgricultureQA_bn,AgricultureQA_my,AgricultureQA_th,AgricultureQA_km,sans-serif!important;box-sizing:border-box}html,body,#root{height:100%;margin:0}#root{display:flex;flex-direction:column}</style><div id="root"></div><script src="/entry.js"></script>');
 const server=http.createServer((q,r)=>{if(q.url.startsWith('/qa-asset?')){const relative=new URL(q.url,'http://localhost').searchParams.get('path');const asset=path.resolve(root,relative||'');if(!asset.startsWith(path.join(root,'assets')+path.sep)){r.statusCode=403;r.end();return;}r.setHeader('Content-Type',asset.endsWith('.webp')?'image/webp':asset.endsWith('.png')?'image/png':'image/jpeg');r.end(fs.readFileSync(asset));return;}if(q.url.startsWith('/qa-font-')){const file=path.join(process.env.AGRICULTURE_QA_SCRIPT_FONT_DIR,path.basename(q.url));r.setHeader('Content-Type','font/woff2');r.end(fs.readFileSync(file));return;}const f=q.url==='/entry.js'?'entry.js':q.url==='/japanese.otf'?'japanese.otf':'index.html';r.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.otf')?'font/otf':'text/html; charset=utf-8');r.end(fs.readFileSync(path.join(out,f)));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const errors=[],screenshots=[],responsiveCases=[];let questionCases=0,resumeCases=0,retryCases=0;
 try{
  let executablePath=process.env.AGRICULTURE_QA_CHROMIUM,launchArgs=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'];
  if(process.env.AGRICULTURE_QA_SPARTICUZ==='1'){const c=require('@sparticuz/chromium').default??require('@sparticuz/chromium');executablePath=await c.executablePath();launchArgs=c.args;}
  browser=await chromium.launch({executablePath,headless:true,args:launchArgs});
  const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));
  const url=`http://127.0.0.1:${server.address().port}/`;
  const adoption=JSON.parse(fs.readFileSync(path.join(root,(process.env.AGRICULTURE_HOLD_SESSION||'docs/ssw-workspace/agriculture/daily-fix-20261031')+'/reader-scope.json'),'utf8'));
  const lessons=require('../../src/data/agriculture/lessons.ja.json').lessons,manifest=require('../../src/data/agriculture/course-manifest.json');
  const translations=require('./translation-fixture.cjs')();const readerShots=[];let japaneseCases=0,localeCases=0,responsiveReaderCases=0;
  async function openReader(lesson,locale='ja',mode='day'){
   const level=lesson.levels[0],week=manifest.levels[level].weeks.find(w=>w.lessonIds.includes(lesson.id));assert(week);
   await page.goto(url+'?language='+locale);await page.evaluate(m=>localStorage.setItem('@japan_app_tokutei_reading_appearance_v1',m),mode);await page.reload();
   await page.evaluate(async()=>{await Promise.all(['AgricultureQA','AgricultureQA_hi','AgricultureQA_bn','AgricultureQA_my','AgricultureQA_th','AgricultureQA_km'].map(f=>document.fonts.load('16px '+f)));await document.fonts.ready;});
   await page.getByRole('button',{name:'特定技能'+level+'号',exact:true}).click();await page.getByRole('button',{name:new RegExp('^第'+week.number+'週')}).click();await page.getByTestId('agri-day-'+level+'-'+(week.lessonIds.indexOf(lesson.id)+1)).click();
   if(locale!=='ja')await page.getByRole('button',{name:'訳を表示',exact:true}).click();
   const text=await page.locator('body').innerText();assert(text.includes(lesson.titleJa)&&text.includes(lesson.activityJa));for(const p of lesson.paragraphs)assert(text.includes(p.textJa),p.id);
   if(locale!=='ja'){const t=translations.locales[locale][lesson.id];assert(t&&t.sourceHash===lesson.sourceHash);assert(text.includes(t.title)&&text.includes(t.objective)&&text.includes(t.activity));for(const p of lesson.paragraphs)assert(text.includes(t.paragraphs[p.id])&&text.includes(t.paragraphTitles[p.id]),locale+'/'+p.id);}
   const support=require('../../src/data/agriculture/daily-learning-support.json');
   for(const pair of support.companionReadings[lesson.id]||[]){const related=lessons.find(l=>l.id===pair.lessonId&&l.levels.includes(level)&&l.sourceHash===pair.sourceHash);if(related){assert(text.includes(related.titleJa));for(const paragraph of related.paragraphs.filter(p=>pair.paragraphIds.includes(p.id)))assert(text.includes(paragraph.textJa),'Missing context '+paragraph.id);}}
   await page.waitForFunction(()=>Array.from(document.querySelectorAll('img')).every(x=>x.complete&&x.naturalWidth>1));
   assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
   if(process.env.AGRICULTURE_QA_FIGURE_FOCUS==='1'){
    const figure=page.locator('[data-testid^="agri-daily-diagram-"][data-testid$="-image"]').first();
    assert(await figure.count(),'Expected controlled daily figure');if(await figure.count()){await figure.scrollIntoViewIfNeeded();assert(await figure.isVisible());const expand=page.locator('[data-testid^="agri-daily-diagram-"][data-testid$="-expand"]').first();if(await expand.count()){await expand.click();assert(await figure.isVisible());}assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));}
   }

  }
  for(const id of (process.env.AGRICULTURE_QA_RESPONSIVE_ONLY==='1'?[]:process.env.AGRICULTURE_QA_FIGURE_FOCUS==='1'?['agr-fruit-detail-harvest-calendar','agr-flower-details-economic-rows','agr-f40-flower-sleeve-printing']:adoption.readerAffectedLessonIds)){const l=lessons.find(l=>l.id===id);await openReader(l);const file=id+'-ja-phone.png';await page.screenshot({path:path.join(out,file)});readerShots.push(file);japaneseCases++;}
  const largest=(process.env.AGRICULTURE_QA_FIGURE_FOCUS==='1'?['agr-fruit-detail-harvest-calendar']:adoption.readerAffectedLessonIds).map(id=>lessons.find(l=>l.id===id)).sort((a,b)=>b.paragraphs.reduce((n,p)=>n+p.textJa.length,0)-a.paragraphs.reduce((n,p)=>n+p.textJa.length,0))[0];
  for(const locale of (process.env.AGRICULTURE_QA_RESPONSIVE_ONLY==='1'?[]:process.env.AGRICULTURE_QA_FIGURE_FOCUS==='1'?['vi']:Object.keys(translations.locales))){await openReader(largest,locale);const file='largest-'+locale+'-phone.png';await page.screenshot({path:path.join(out,file)});readerShots.push(file);localeCases++;}
  for(const locale of (process.env.AGRICULTURE_QA_FIGURE_FOCUS==='1'?['ja']:['ja','vi','my','bn']))for(const mode of ['day','night'])for(const [width,height]of [[390,844],[844,390],[768,1024],[1440,900]]){
   await page.setViewportSize({width,height});await openReader(largest,locale,mode);
   const complete=page.getByRole('button',{name:'完了する',exact:true});if(process.env.AGRICULTURE_QA_FIGURE_FOCUS!=='1'){await complete.scrollIntoViewIfNeeded();assert(await complete.isVisible());}
   const file='reader-'+locale+'-'+mode+'-'+width+'x'+height+'.png';await page.screenshot({path:path.join(out,file)});readerShots.push(file);responsiveReaderCases++;
  }
  assert.deepEqual(errors,[]);for(const [p,digest]of Object.entries(guardedInputSha256))assert.equal(sha(path.join(root,p)),digest,'Input changed during reader QA '+p);
  const report={status:'PASS',japaneseReaderCases:japaneseCases,allLocaleLongestLessonCases:localeCases,longestLessonId:largest.id,responsiveReaderCases,missingOrStaleTranslationCases:0,screenshots:readerShots,guardedInputSha256,inputsUnchangedDuringRun:true,scriptQaFonts:['ja','hi','bn','my','th','km'],adapters:['Royal artwork','safe area','background','localStorage storage'],realRasterFilesUsed:true,physicalDeviceTested:false,productionExpoTested:false,nativeLanguageCertified:false};
  fs.writeFileSync(path.join(root,(process.env.AGRICULTURE_HOLD_SESSION||'docs/ssw-workspace/agriculture/daily-fix-20261031')+(process.env.AGRICULTURE_QA_FIGURE_FOCUS==='1'?'/figure-browser-qa.json':'/reader-browser-qa.json')),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,screenshots:readerShots.length,guardedInputSha256:undefined}));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
