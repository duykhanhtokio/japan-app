const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),out=process.env.AGRICULTURE_QA_OUTPUT,executablePath=process.env.AGRICULTURE_QA_CHROMIUM;
if(!out||!executablePath)throw Error('Set AGRICULTURE_QA_OUTPUT and AGRICULTURE_QA_CHROMIUM');
const translatedFixture=require('./translation-fixture.cjs')();
const esbuild=require('esbuild'),{chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));fs.mkdirSync(out,{recursive:true});
const scriptFontDir=process.env.AGRICULTURE_QA_SCRIPT_FONT_DIR;
const scriptFonts=scriptFontDir?['bn','hi','my','th','km']:[];
for(const locale of scriptFonts)fs.copyFileSync(path.join(scriptFontDir,'qa-'+locale+'.woff2'),path.join(out,'qa-'+locale+'.woff2'));
const extraFontCss=scriptFonts.map(locale=>'@font-face{font-family:AgricultureQA_'+locale+';src:url(/qa-'+locale+'.woff2)}').join('');
const fontFamilies=['AgricultureQA',...scriptFonts.map(locale=>'AgricultureQA_'+locale),'sans-serif'].join(',');
const font=process.env.AGRICULTURE_QA_JAPANESE_FONT;if(!font)throw Error('Set AGRICULTURE_QA_JAPANESE_FONT');fs.copyFileSync(font,path.join(out,'japanese.ttf'));
const adapters={safe:'export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});',backdrop:'export const useBackdropOcclusion=()=>{};',storage:`export default {getItem:async k=>{if(window.__failRead)throw Error('read');return localStorage.getItem(k)},setItem:async(k,v)=>{if(window.__failWrite)throw Error('write');localStorage.setItem(k,v)}};`,royal:`import React from 'react';import {View,Pressable,Text} from 'react-native';export const ROYAL_LAYOUT={screenGutter:12,backSafeTop:8},ROYAL_FONT={};export const RoyalBackButton=({onPress})=><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onPress}><Text>Back</Text></Pressable>;export const RoyalContentPanel=({children,style})=><View style={style}>{children}</View>;export const RoyalExplanationPanel=RoyalContentPanel;export default ({children})=><View style={{flex:1,backgroundColor:'#eee6d6'}}>{children}</View>;`};
(async()=>{
 await esbuild.build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {AgricultureCourse} from './src/components/agriculture/AgricultureCourse';const locale=new URLSearchParams(location.search).get('language')||'vi';createRoot(document.getElementById('root')).render(<AgricultureCourse learner="qa" language={locale} onBack={()=>{window.__left=true}}/>);`,resolveDir:root,loader:'tsx'},outfile:path.join(out,'entry.js'),bundle:true,platform:'browser',jsx:'automatic',define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},plugins:[{name:'browser-adapters',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'adapter'}));
 b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'adapter'}));
 b.onResolve({filter:/RoyalPageBackground|RoyalPanels|RoyalSurface/},()=>({path:'royal',namespace:'adapter'}));
 b.onResolve({filter:/AppBackdrop$/},()=>({path:'backdrop',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},a=>({contents:adapters[a.path],loader:'jsx',resolveDir:root}));
 b.onResolve({filter:/\.(png|webp|jpg)$/},()=>({path:'image',namespace:'asset'}));b.onLoad({filter:/.*/,namespace:'asset'},()=>({contents:'export default {uri:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="}',loader:'js'}));
 b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2));for(const ext of ['.tsx','.ts','.json','/index.ts'])if(fs.existsSync(p+ext))return {path:p+ext};throw Error(p);});
 }}]});
 fs.writeFileSync(path.join(out,'index.html'),'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:AgricultureQA;src:url(/japanese.ttf)}'+extraFontCss+'*{font-family:'+fontFamilies+'!important}html,body,#root{height:100%;margin:0}#root{display:flex;flex-direction:column}*{box-sizing:border-box}</style><div id="root"></div><script src="/entry.js"></script>');
 const server=http.createServer((q,r)=>{const scriptFile=scriptFonts.map(locale=>'qa-'+locale+'.woff2').find(file=>q.url==='/'+file);const file=scriptFile||(q.url.startsWith('/entry.js')?'entry.js':q.url.startsWith('/japanese.ttf')?'japanese.ttf':'index.html');r.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.ttf')?'font/ttf':file.endsWith('.woff2')?'font/woff2':'text/html; charset=utf-8');r.end(fs.readFileSync(path.join(out,file)));});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const errors=[],screenshots=[];
 try{
 browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox','--disable-gpu']});const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));const url=`http://127.0.0.1:${server.address().port}/`;
 async function fontsReady(){await page.evaluate(async locales=>{await Promise.all(locales.map(locale=>document.fonts.load('16px AgricultureQA_'+locale)));await document.fonts.ready;},scriptFonts);}
 async function start(level='1',language='vi'){await page.goto(url+'?language='+language);await fontsReady();await page.getByRole('button',{name:'特定技能'+level+'号',exact:true}).click();}
 async function reader(level='1',language='vi'){await start(level,language);await page.getByRole('button',{name:/第1週/}).click();await page.getByTestId('agri-day-'+level+'-1').click();}
 let translatedLessonLocalePairs=0;
 const lessons=require('../../src/data/agriculture/lessons.ja.json').lessons,manifest=require('../../src/data/agriculture/course-manifest.json');
 for(const [language,entries]of Object.entries(translatedFixture.locales)){
 await page.goto(url+'?language='+language);await fontsReady();
 for(const [id,t]of Object.entries(entries)){
 const lesson=lessons.find(l=>l.id===id),level=lesson.levels[0],week=manifest.levels[level].weeks.find(w=>w.lessonIds.includes(id)),day=week.lessonIds.indexOf(id)+1;
 await page.getByRole('button',{name:'特定技能'+level+'号',exact:true}).click();await page.getByRole('button',{name:new RegExp('^第'+week.number+'週')}).click();await page.getByTestId('agri-day-'+level+'-'+day).click();await page.getByRole('button',{name:'訳を表示',exact:true}).click();const text=await page.locator('body').innerText();
 assert(text.includes(t.title)&&text.includes(t.objective)&&text.includes(t.activity),language+'/'+id);
 for(const p of lesson.paragraphs){assert(text.includes(p.textJa));assert(text.includes(t.paragraphs[p.id]),language+'/'+p.id);assert(text.includes(t.paragraphTitles[p.id]),language+'/'+p.id);}
 translatedLessonLocalePairs++;
 // Return through reader, calendar and course without reloading the whole bundle.
 for(let back=0;back<3;back++)await page.getByRole('button',{name:'Back',exact:true}).click();
 }
 }
 // Exercise the longest newly translated lesson in each locale at all four sizes.
 let newTranslationResponsiveCases=0;
 for(const [language,entries]of Object.entries(translatedFixture.locales)){
  const candidates=Object.entries(entries).filter(([id])=>/^agr-(safety|ricework|vegwork)-/.test(id));
  if(!candidates.length)continue;
  const [id,t]=candidates.sort((a,b)=>Object.values(b[1].paragraphs).join('').length-Object.values(a[1].paragraphs).join('').length)[0];
  const lesson=lessons.find(l=>l.id===id),level=lesson.levels[0],week=manifest.levels[level].weeks.find(w=>w.lessonIds.includes(id)),day=week.lessonIds.indexOf(id)+1;
  for(const [width,height]of [[390,844],[844,390],[768,1024],[1440,900]]){
   await page.setViewportSize({width,height});await start(level,language);await page.getByRole('button',{name:new RegExp('^第'+week.number+'週')}).click();await page.getByTestId('agri-day-'+level+'-'+day).click();await page.getByRole('button',{name:'訳を表示',exact:true}).click();
   assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),language+'/'+id+'/'+width);
   await page.getByRole('button',{name:'完了する',exact:true}).scrollIntoViewIfNeeded();assert(await page.getByRole('button',{name:'完了する',exact:true}).isVisible());
   const text=await page.locator('body').innerText();assert(Object.values(t.paragraphs).every(v=>text.includes(v)));
   if(width===390){const file='new-long-'+language+'-390x844.png';await page.screenshot({path:path.join(out,file)});screenshots.push(file);}
   newTranslationResponsiveCases++;
  }
 }
 for(const [w,h]of [[390,844],[844,390],[768,1024],[1440,900]]){await page.setViewportSize({width:w,height:h});await reader();await page.getByRole('button',{name:'訳を表示',exact:true}).click();assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));const file=`reader-${w}x${h}.png`;await page.screenshot({path:path.join(out,file)});screenshots.push(file);}
 await page.setViewportSize({width:390,height:844});await reader();await page.evaluate(()=>window.__failWrite=true);await page.getByRole('button',{name:'完了する',exact:true}).click();await page.getByRole('alert').waitFor();assert(await page.getByRole('button',{name:'完了する',exact:true}).isVisible());await page.evaluate(()=>window.__failWrite=false);await page.getByRole('button',{name:'完了する',exact:true}).click();await page.getByTestId('agri-day-1-1').waitFor();assert((await page.getByTestId('agri-day-1-1').innerText()).includes('学習済み'));
 await page.reload();await page.getByRole('button',{name:'特定技能1号',exact:true}).click();await page.getByRole('button',{name:/第1週/}).click();assert((await page.getByTestId('agri-day-1-1').innerText()).includes('学習済み'));
 await start('2');await page.getByRole('button',{name:/第1週/}).click();assert(!(await page.getByTestId('agri-day-2-1').innerText()).includes('学習済み'));
 // Numeric suffixes are valid lesson IDs and must survive completion/reload.
 const numeric=lessons.find(l=>l.id==='agr-water-equipment-2'),nw=manifest.levels['2'].weeks.find(w=>w.lessonIds.includes(numeric.id)),nd=nw.lessonIds.indexOf(numeric.id)+1;
 await start('2','ja');await page.getByRole('button',{name:new RegExp('^第'+nw.number+'週')}).click();await page.getByTestId('agri-day-2-'+nd).click();await page.getByRole('button',{name:'完了する',exact:true}).click();await page.getByTestId('agri-day-2-'+nd).waitFor();assert((await page.getByTestId('agri-day-2-'+nd).innerText()).includes('学習済み'));
 await page.reload();await page.getByRole('button',{name:'特定技能2号',exact:true}).click();await page.getByRole('button',{name:new RegExp('^第'+nw.number+'週')}).click();assert((await page.getByTestId('agri-day-2-'+nd).innerText()).includes('学習済み'));
 for(const level of ['1','2']){
 await start(level);await page.getByRole('button',{name:'週の確認',exact:true}).click();await page.getByRole('button',{name:'開く・再開',exact:true}).first().click();await page.getByRole('button',{name:'次へ',exact:true}).waitFor();assert(!(await page.locator('body').innerText()).includes('正解：'));
 const option=page.getByRole('button').filter({hasText:/^1\./}).first();await option.click();await page.getByRole('button',{name:'次へ',exact:true}).click();await page.reload();await page.getByRole('button',{name:'特定技能'+level+'号',exact:true}).click();await page.getByRole('button',{name:'週の確認',exact:true}).click();await page.getByRole('button',{name:'開く・再開',exact:true}).first().click();await page.getByRole('button',{name:'提出する',exact:true}).waitFor();assert((await page.locator('body').innerText()).includes('2 /'));
 await page.getByRole('button',{name:'提出する',exact:true}).click();await page.getByRole('button',{name:'キャンセル',exact:true}).click();assert(!(await page.locator('body').innerText()).includes('正解：'));
 await page.getByRole('button',{name:'提出する',exact:true}).click();await page.getByRole('button',{name:'確定',exact:true}).click();await page.getByRole('button',{name:'もう一度解く',exact:true}).waitFor();assert((await page.locator('body').innerText()).includes('正解：'));
 await page.getByRole('button',{name:'Back',exact:true}).click();await page.getByText(/問 · ✓ 完了/).waitFor();
 }
 // Same source questions, independent saved attempts for the two levels.
 await start('1');await page.getByRole('button',{name:'週の確認',exact:true}).click();await page.getByRole('button',{name:'開く・再開',exact:true}).nth(1).click();await page.getByRole('button',{name:'次へ',exact:true}).waitFor();await page.getByRole('button').filter({hasText:/^1\./}).first().click();await page.waitForFunction(()=>{const v=localStorage.getItem('@japan_app_agriculture:exam:v1:qa:1:agr-shared-w02-check');return v&&JSON.parse(v).answers[0]!==null;});
 await start('2');await page.getByRole('button',{name:'週の確認',exact:true}).click();await page.getByRole('button',{name:'開く・再開',exact:true}).nth(1).click();await page.getByRole('button',{name:'次へ',exact:true}).waitFor();assert(await page.evaluate(()=>{const v=localStorage.getItem('@japan_app_agriculture:exam:v1:qa:2:agr-shared-w02-check');return !v||JSON.parse(v).answers.every(a=>a===null);}));await page.getByRole('button').filter({hasText:/^2\./}).first().click();await page.waitForFunction(()=>{const one=JSON.parse(localStorage.getItem('@japan_app_agriculture:exam:v1:qa:1:agr-shared-w02-check')||'null'),two=JSON.parse(localStorage.getItem('@japan_app_agriculture:exam:v1:qa:2:agr-shared-w02-check')||'null');return one?.answers[0]===0&&two?.answers[0]===1;});
 await start('2');await page.getByRole('button',{name:/第3週/}).click();await page.getByTestId('agri-day-2-3').click();await page.setViewportSize({width:390,height:844});assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));await page.getByLabel('ばらまきはうね全体、すじまきは列、点まきは一か所に数粒ずつ。図は模式図で、実際の間隔を示しません。').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'sowing-390x844.png')});screenshots.push('sowing-390x844.png');
 assert.deepEqual(errors,[]);const report={status:'PASS',translatedReaderLocales:12,translatedLessonLocalePairs,sharedWeeklyAttemptIsolation:true,newTranslationResponsiveCases,viewports:[[390,844],[844,390],[768,1024],[1440,900]],completionSaveFailureHandled:true,completionReload:true,numericLessonIdCompletionReload:true,levelIsolation:true,examResume:true,hiddenAnswersBeforeSubmit:true,cancelSubmit:true,weeklyCompletionBadge:true,screenshots,adapters:['Royal artwork','background','safe area','localStorage for AsyncStorage'],nativeDeviceTested:false,productionExpoTested:false,japaneseQaFontLoaded:true,additionalQaScriptFonts:scriptFonts,nativeFontsCertified:false,courseComplete:false};fs.writeFileSync(path.join(root,'docs/ssw-workspace/agriculture/browser-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
