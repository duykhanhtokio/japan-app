// Scoped new Japanese and12locale Agriculture reader QA. Native/artwork adapters explicit.
// Scoped real Agriculture route checks for the new weekly banks. No production UI changes.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),out=process.env.AGRICULTURE_QA_OUTPUT;
const esbuild=require('esbuild'),{chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/agriculture/parallel-22-manifest.json')));
const lessons=require('../../src/data/agriculture/lessons.ja.json').lessons.filter(l=>manifest.newLessonIds.includes(l.id));
const course=require('../../src/data/agriculture/course-manifest.json');const translations=require('./translation-fixture.cjs')().locales;
assert(out&&process.env.AGRICULTURE_QA_CHROMIUM&&process.env.AGRICULTURE_QA_JAPANESE_FONT);assert.equal(lessons.length,6);
fs.mkdirSync(out,{recursive:true});fs.copyFileSync(process.env.AGRICULTURE_QA_JAPANESE_FONT,path.join(out,'japanese.otf'));
const fontMap={AgriDev:'devanagari',AgriBn:'bengali',AgriMy:'myanmar',AgriTh:'thai',AgriKm:'khmer'};
for(const [family,script]of Object.entries(fontMap)){const p=path.join(process.env.AGRICULTURE_QA_NODE_MODULES,'@fontsource/noto-sans-'+script,'files','noto-sans-'+script+'-'+script+'-400-normal.woff2');fs.copyFileSync(p,path.join(out,family+'.woff2'));}
const fontCss=Object.keys(fontMap).map(f=>'@font-face{font-family:'+f+';src:url(/'+f+'.woff2)}').join('');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const adapters={safe:'export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});',backdrop:'export const useBackdropOcclusion=()=>{};',storage:`export default {getItem:async k=>{if(window.__failRead)throw Error('read');return localStorage.getItem(k)},setItem:async(k,v)=>{if(window.__failWrite)throw Error('write');localStorage.setItem(k,v)}};`,royal:`import React from 'react';import {View,Pressable,Text} from 'react-native';export const ROYAL_LAYOUT={screenGutter:12,backSafeTop:8},ROYAL_FONT={};export const RoyalBackButton=({onPress})=><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onPress}><Text>Back</Text></Pressable>;export const RoyalContentPanel=({children,style})=><View style={style}>{children}</View>;export const RoyalExplanationPanel=RoyalContentPanel;export default ({children})=><View style={{flex:1,backgroundColor:'#eee6d6'}}>{children}</View>;`};
(async()=>{
 await esbuild.build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {AgricultureCourse} from './src/components/agriculture/AgricultureCourse';createRoot(document.getElementById('root')).render(<AgricultureCourse learner="batch21" language={new URLSearchParams(location.search).get('language')||'ja'} onBack={()=>{}}/>);`,resolveDir:root,loader:'tsx'},outfile:path.join(out,'entry.js'),bundle:true,platform:'browser',jsx:'automatic',nodePaths:[process.env.AGRICULTURE_QA_NODE_MODULES],define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},plugins:[{name:'explicit-test-adapters',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'adapter'}));
 b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'adapter'}));
 b.onResolve({filter:/RoyalPageBackground|RoyalPanels|RoyalSurface/},()=>({path:'royal',namespace:'adapter'}));
 b.onResolve({filter:/AppBackdrop$/},()=>({path:'backdrop',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},a=>({contents:adapters[a.path],loader:'jsx',resolveDir:root}));
 b.onResolve({filter:/\.(png|webp|jpg)$/},()=>({path:'image',namespace:'asset'}));
 b.onLoad({filter:/.*/,namespace:'asset'},()=>({contents:'export default {uri:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="}',loader:'js'}));
 b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2));for(const ext of ['','.tsx','.ts','.json','/index.ts'])if(fs.existsSync(p+ext)&&fs.statSync(p+ext).isFile())return {path:p+ext};throw Error(p);});
 }}]});
 fs.writeFileSync(path.join(out,'index.html'),'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:AgricultureQA;src:url(/japanese.otf)}'+fontCss+'*{font-family:AgricultureQA,AgriDev,AgriBn,AgriMy,AgriTh,AgriKm,sans-serif!important;box-sizing:border-box}html,body,#root{height:100%;margin:0}#root{display:flex;flex-direction:column}</style><div id="root"></div><script src="/entry.js"></script>');
 const server=http.createServer((q,r)=>{const font=Object.keys(fontMap).find(f=>q.url==='/'+f+'.woff2');const f=font?font+'.woff2':q.url==='/entry.js'?'entry.js':q.url==='/japanese.otf'?'japanese.otf':'index.html';r.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.otf')?'font/otf':f.endsWith('.woff2')?'font/woff2':'text/html; charset=utf-8');r.end(fs.readFileSync(path.join(out,f)));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;

 const errors=[],screenshots=[];let sourceResponsiveCases=0,translatedReaderCases=0,longTranslationResponsiveCases=0,nightTranslationCases=0,completionReloadCases=0;
 try{
  let launchArgs=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'];if(process.env.AGRICULTURE_QA_SPARTICUZ==='1')launchArgs=require('@sparticuz/chromium').args;
  browser=await chromium.launch({executablePath:process.env.AGRICULTURE_QA_CHROMIUM,headless:true,args:launchArgs});
  const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));const url=`http://127.0.0.1:${server.address().port}/`;
  async function open(l,locale='ja',mode='day'){
   await page.goto(url+'?language='+locale);await page.evaluate(m=>localStorage.setItem('@japan_app_tokutei_reading_appearance_v1',m),mode);await page.reload();
   await page.evaluate(async families=>{await Promise.all(families.map(f=>document.fonts.load('16px '+f)));await document.fonts.ready;for(const f of families)if(![...document.fonts].some(face=>face.family===f&&face.status==='loaded'))throw Error('Missing QAfont '+f);},['AgricultureQA',...Object.keys(fontMap)]);
   const week=course.levels['2'].weeks.find(w=>w.lessonIds.includes(l.id));await page.getByRole('button',{name:'特定技能2号',exact:true}).click();await page.getByRole('button',{name:new RegExp('^第'+week.number+'週')}).click();await page.getByTestId('agri-day-2-'+(week.lessonIds.indexOf(l.id)+1)).click();
   await page.getByRole('button',{name:'完了する',exact:true}).waitFor();
   if(locale!=='ja')await page.getByRole('button',{name:'訳を表示',exact:true}).click();
  }
  async function readable(l,locale,height){
   const text=await page.locator('body').innerText();assert(l.paragraphs.every(p=>text.includes(p.textJa)&&text.includes(p.titleJa)));assert(text.includes(l.objectiveJa)&&text.includes(l.activityJa));
   if(locale!=='ja'){const t=translations[locale][l.id];assert(text.includes(t.title)&&text.includes(t.objective)&&text.includes(t.activity));assert(l.paragraphs.every(p=>text.includes(t.paragraphs[p.id])&&text.includes(t.paragraphTitles[p.id])));}
   assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
   const button=page.getByRole('button',{name:'完了する',exact:true});await button.scrollIntoViewIfNeeded();const box=await button.boundingBox();assert(box&&box.y>=-1&&box.y+box.height<=height+1);
  }
  for(const l of lessons){
   for(const [width,height]of [[390,844],[844,390],[768,1024],[1440,900]]){await page.setViewportSize({width,height});await open(l);await readable(l,'ja',height);const file=l.id+'-ja-'+width+'x'+height+'.png';await page.screenshot({path:path.join(out,file)});screenshots.push(file);sourceResponsiveCases++;}
   await page.setViewportSize({width:390,height:844});await open(l);
   await page.getByRole('button',{name:'完了する',exact:true}).click();const week=course.levels['2'].weeks.find(w=>w.lessonIds.includes(l.id)),day=week.lessonIds.indexOf(l.id)+1;await page.getByTestId('agri-day-2-'+day).waitFor();assert((await page.getByTestId('agri-day-2-'+day).innerText()).includes('学習済み'));
   await page.reload();await page.getByRole('button',{name:'特定技能2号',exact:true}).click();await page.getByRole('button',{name:new RegExp('^第'+week.number+'週')}).click();assert((await page.getByTestId('agri-day-2-'+day).innerText()).includes('学習済み'));completionReloadCases++;
  }
  for(const locale of Object.keys(translations)){
   for(const l of lessons){await page.setViewportSize({width:390,height:844});await open(l,locale);await readable(l,locale,844);translatedReaderCases++;}
   const longest=[...lessons].sort((a,b)=>Object.values(translations[locale][b.id].paragraphs).join('').length-Object.values(translations[locale][a.id].paragraphs).join('').length)[0];
   for(const [width,height]of [[390,844],[844,390],[768,1024],[1440,900]]){await page.setViewportSize({width,height});await open(longest,locale);await readable(longest,locale,height);if(width!==768){const file='long-'+locale+'-'+width+'x'+height+'.png';await page.screenshot({path:path.join(out,file)});screenshots.push(file);}longTranslationResponsiveCases++;}
   await page.setViewportSize({width:390,height:844});await open(longest,locale,'night');await readable(longest,locale,844);const file='long-'+locale+'-night-390x844.png';await page.screenshot({path:path.join(out,file)});screenshots.push(file);nightTranslationCases++;
  }
  const first=lessons[0];await open(first);await page.evaluate(()=>window.__failWrite=true);await page.getByRole('button',{name:'完了する',exact:true}).click();await page.getByRole('alert').waitFor();assert(await page.getByRole('button',{name:'完了する',exact:true}).isVisible());await page.evaluate(()=>window.__failWrite=false);await page.getByRole('button',{name:'完了する',exact:true}).click();await page.getByTestId('agri-day-2-1').waitFor();
  await page.goto(url);await page.getByRole('button',{name:'特定技能1号',exact:true}).click();assert(!(await page.locator('body').innerText()).includes('作業別の補足知識'));assert.deepEqual(errors,[]);
  const inputPaths=['src/data/agriculture/lessons.ja.json','src/data/agriculture/course-manifest.json','src/components/agriculture/AgricultureCourse.tsx','scripts/agriculture/check-parallel-22-browser.cjs',...Object.keys(translations).map(locale=>'src/data/agriculture/translations/'+locale+'.json')];
  const report={status:'PASS',sourceLessons:6,sourceResponsiveCases,translatedReaderCases,translatedLocales:Object.keys(translations).length,longTranslationResponsiveCases,nightTranslationCases,completionReloadCases,saveFailureRetry:true,level1Isolation:true,noHorizontalOverflow:true,completionReachable:true,allNewJapaneseAndTranslatedFieldsRendered:true,screenshots,inputSha256:Object.fromEntries(inputPaths.map(p=>[p,sha(path.join(root,p))])),adapters:['Royal artwork','safe area','background','localStorage storage','placeholder artwork'],qaScriptFonts:Object.values(fontMap),nativeDeviceTested:false,productionExpoTested:false,nativeFontsCertified:false};
  fs.writeFileSync(path.join(root,'docs/ssw-workspace/agriculture/parallel-22/browser-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,screenshots:screenshots.length,inputSha256:'recorded'}));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
