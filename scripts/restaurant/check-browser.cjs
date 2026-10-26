/** Real React and react-native-web course; artwork/safe-area/storage use explicit browser adapters. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),out=process.env.RESTAURANT_QA_OUTPUT,executablePath=process.env.RESTAURANT_QA_CHROMIUM,font=process.env.RESTAURANT_QA_JAPANESE_FONT;
if(!out||!executablePath||!font)throw Error('Set RESTAURANT_QA_OUTPUT, RESTAURANT_QA_CHROMIUM and RESTAURANT_QA_JAPANESE_FONT');
const actualRasterAssets=new Set(),localeOnly=process.env.RESTAURANT_QA_LOCALES_ONLY==='1';
const esbuild=require('esbuild'),{chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
const lessons=['1','2'].flatMap(level=>JSON.parse(fs.readFileSync(path.join(root,`src/data/restaurant/lessons.${level}.ja.json`))).lessons),exams=['1','2'].flatMap(level=>JSON.parse(fs.readFileSync(path.join(root,`src/data/restaurant/exams.${level}.ja.json`))).exams);
const adapters={safe:'export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});',backdrop:'export const useBackdropOcclusion=()=>{};',storage:`export default {getItem:async k=>{if(window.__failRead)throw Error('read');return localStorage.getItem(k)},setItem:async(k,v)=>{await new Promise(r=>setTimeout(r,window.__writeDelay||0));if(window.__failWrite)throw Error('write');localStorage.setItem(k,v)}};`,royal:`import React from 'react';import {View,Pressable,Text} from 'react-native';export const ROYAL_LAYOUT={screenGutter:12,backSafeTop:8},ROYAL_FONT={};export const RoyalBackButton=({onPress})=><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onPress}><Text>Back</Text></Pressable>;export const RoyalContentPanel=({children,style})=><View style={style}>{children}</View>;export const RoyalExplanationPanel=RoyalContentPanel;export default ({children})=><View style={{flex:1,backgroundColor:'#eee6d6'}}>{children}</View>;`};
(async()=>{
 fs.mkdirSync(out,{recursive:true});fs.copyFileSync(font,path.join(out,'japanese.ttf'));
 const scriptFontDir=process.env.RESTAURANT_QA_SCRIPT_FONT_DIR||path.dirname(font),scriptFonts=['bn','hi','my','th','km'].filter(locale=>fs.existsSync(path.join(scriptFontDir,'qa-'+locale+'.woff2')));
 for(const locale of scriptFonts)fs.copyFileSync(path.join(scriptFontDir,'qa-'+locale+'.woff2'),path.join(out,'qa-'+locale+'.woff2'));
 const extraFontCss=scriptFonts.map(locale=>'@font-face{font-family:RestaurantQA_'+locale+';src:url(/qa-'+locale+'.woff2)}').join('');
 const fontFamilies=['RestaurantQA',...scriptFonts.map(locale=>'RestaurantQA_'+locale),'sans-serif'].join(',');
 await esbuild.build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {RestaurantCourse} from './src/components/restaurant/RestaurantCourse';const query=new URLSearchParams(location.search);createRoot(document.getElementById('root')).render(<RestaurantCourse learner={query.get('learner')||'qa'} language={query.get('language')||'ja'} onBack={()=>{window.__left=true}}/>);`,resolveDir:root,loader:'tsx'},outfile:path.join(out,'entry.js'),bundle:true,platform:'browser',nodePaths:(process.env.NODE_PATH||'').split(path.delimiter).filter(Boolean),jsx:'automatic',define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},plugins:[{name:'browser-adapters',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'adapter'}));b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'adapter'}));b.onResolve({filter:/RoyalPageBackground|RoyalPanels|RoyalSurface/},()=>({path:'royal',namespace:'adapter'}));b.onResolve({filter:/AppBackdrop$/},()=>({path:'backdrop',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},a=>({contents:adapters[a.path],loader:'jsx',resolveDir:root}));b.onResolve({filter:/\.(png|webp|jpg)$/},a=>({path:path.resolve(a.resolveDir,a.path),namespace:'asset'}));b.onLoad({filter:/.*/,namespace:'asset'},a=>{
 const restaurantRaster=a.path.startsWith(path.join(root,'assets/restaurant')+path.sep)&&fs.existsSync(a.path);
 if(restaurantRaster){const ext=path.extname(a.path).slice(1);actualRasterAssets.add(path.relative(root,a.path));return {contents:'module.exports = '+JSON.stringify({uri:'data:image/'+ext+';base64,'+fs.readFileSync(a.path).toString('base64')}),loader:'js'};}
 return {contents:'module.exports = {uri:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="}',loader:'js'};});
 b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2));for(const ext of ['','.tsx','.ts','.json','/index.ts'])if(fs.existsSync(p+ext)&&fs.statSync(p+ext).isFile())return {path:p+ext};throw Error(p);});
 }}]});
 fs.writeFileSync(path.join(out,'index.html'),'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:RestaurantQA;src:url(/japanese.ttf)}'+extraFontCss+'*{font-family:'+fontFamilies+'!important}html,body,#root{height:100%;margin:0}#root{display:flex;flex-direction:column}*{box-sizing:border-box}</style><div id="root"></div><script src="/entry.js"></script>');
 const server=http.createServer((q,r)=>{const scriptFontFile=scriptFonts.map(locale=>'qa-'+locale+'.woff2').find(file=>q.url==='/'+file);const file=scriptFontFile||(q.url.startsWith('/entry.js')?'entry.js':q.url.startsWith('/japanese.ttf')?'japanese.ttf':'index.html');r.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.ttf')?'font/ttf':file.endsWith('.woff2')?'font/woff2':'text/html; charset=utf-8');r.end(fs.readFileSync(path.join(out,file)));});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const errors=[],screenshots=[],checks={};
 try{
 browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox','--disable-gpu']});const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));const url=`http://127.0.0.1:${server.address().port}/`;
 async function start(level='1',language='ja',learner='qa'){await page.goto(url+`?language=${language}&learner=${learner}`);await page.evaluate(()=>document.fonts.ready);await page.getByTestId('restaurant-level-'+level).click();}
 async function cleanStart(level='1',language='ja',learner='qa'){await page.goto(url);await page.evaluate(()=>localStorage.clear());await start(level,language,learner);}
 async function openLesson(lesson,language='ja',learner='qa'){await cleanStart(lesson.level,language,learner);await page.getByTestId('restaurant-week-'+lesson.week).click();await page.getByTestId('restaurant-day-'+lesson.id).click();await page.getByTestId('restaurant-complete').waitFor();}
 async function openExam(exam,learner='qa'){await start(exam.level,'ja',learner);await page.getByTestId('restaurant-tab-'+exam.kind).click();await page.getByTestId('restaurant-exam-'+exam.id).click();await page.getByTestId('restaurant-submit').waitFor();}
 const first=lessons.find(l=>l.level==='1'),second=lessons.find(l=>l.level==='2');assert(first&&second);
 if(!localeOnly){
 for(const [width,height]of [[390,844],[844,390],[768,1024],[1440,900]]){
  await page.setViewportSize({width,height});await openLesson(first);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));const complete=page.getByTestId('restaurant-complete');await complete.scrollIntoViewIfNeeded();const box=await complete.boundingBox();assert(box&&box.y>=-1&&box.y+box.height<=height+1);const file=`reader-${width}x${height}.png`;await page.screenshot({path:path.join(out,file)});screenshots.push(file);
 }
 checks.responsiveViewports=4;
 const illustrations=JSON.parse(fs.readFileSync(path.join(root,'src/data/restaurant/illustrations.json'))).illustrations;
 for(const illustration of illustrations){const lesson=lessons.find(l=>illustration.lessonIds.includes(l.id));assert(lesson);for(const [width,height]of [[390,844],[844,390],[768,1024],[1440,900]]){await page.setViewportSize({width,height});await openLesson(lesson);const picture=page.getByLabel(illustration.captionJa,{exact:true}).first();await picture.scrollIntoViewIfNeeded();await page.waitForFunction(()=>Array.from(document.images).some(image=>image.complete&&image.naturalWidth>100));const bounds=await picture.boundingBox();assert(bounds&&bounds.width>100&&Math.abs(bounds.width/bounds.height-illustration.aspectRatio)<.03);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));if(width===390){const file=illustration.id+'-390x844.png';await page.screenshot({path:path.join(out,file)});screenshots.push(file);}}}
 checks.rasterResponsiveCases=illustrations.length*4;
 const diagrams=JSON.parse(fs.readFileSync(path.join(root,'src/data/restaurant/diagrams.json'))).diagrams;
 for(const diagram of diagrams){const lesson=lessons.find(l=>diagram.lessonIds.includes(l.id));assert(lesson);await openLesson(lesson);const figure=page.getByTestId('restaurant-diagram-'+diagram.id);await figure.scrollIntoViewIfNeeded();assert((await figure.innerText()).includes(diagram.titleJa));for(const node of diagram.nodes)assert((await figure.innerText()).includes(node.labelJa));assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));}
 checks.diagramCases=diagrams.length;
 await page.setViewportSize({width:390,height:844});
 // Completing a lesson must stay in the reader if durable storage fails.
 await openLesson(first);await page.evaluate(()=>window.__failWrite=true);await page.getByTestId('restaurant-complete').click();await page.getByText('完了・閲覧位置を保存できませんでした。',{exact:true}).waitFor();assert(await page.getByTestId('restaurant-complete').isVisible());assert(await page.getByTestId('restaurant-complete').isDisabled());await page.evaluate(()=>window.__failWrite=false);await page.getByRole('button',{name:'保存を再試行',exact:true}).click();await page.getByTestId('restaurant-day-'+first.id).waitFor();assert((await page.getByTestId('restaurant-day-'+first.id).innerText()).includes('学習済み'));checks.completionFailureRetry=true;
 await start('1');await page.getByTestId('restaurant-day-'+first.id).waitFor();assert((await page.getByTestId('restaurant-day-'+first.id).innerText()).includes('学習済み'));checks.completionReload=true;
 await start('2');await page.getByTestId('restaurant-week-'+second.week).click();assert(!(await page.getByTestId('restaurant-day-'+second.id).innerText()).includes('学習済み'));checks.levelIsolation=true;
 // Reader position is restored only for matching source revision.
 await openLesson(first);await page.getByRole('button',{name:'Back',exact:true}).click();await page.getByTestId('restaurant-day-'+first.id).waitFor();await page.getByTestId('restaurant-day-'+first.id).click();await start('1');await page.getByTestId('restaurant-complete').waitFor();checks.readerResume=true;
 }
 // Natural-language translations are exercised only when complete and revision-bound.
 let translatedPairs=0,missingPairs=0;
 for(const locale of ['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){
  const shard=JSON.parse(fs.readFileSync(path.join(root,'src/data/restaurant/translations',locale+'.json')));const candidate=lessons.find(l=>shard.lessons[l.id]?.sourceHash===l.sourceHash);
  await openLesson(candidate||first,locale);await page.getByTestId('restaurant-translation-toggle').click();const text=await page.locator('body').innerText();if(candidate){const t=shard.lessons[candidate.id];assert(text.includes(t.title)&&text.includes(t.objective)&&text.includes(t.summary)&&text.includes(t.activity));for(const p of candidate.paragraphs)assert(text.includes(t.paragraphs[p.id]));assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),locale+'/translation overflow');const complete=page.getByTestId('restaurant-complete');await complete.scrollIntoViewIfNeeded();const bounds=await complete.boundingBox();assert(bounds&&bounds.y>=-1&&bounds.y+bounds.height<=844+1,locale+'/completion control');if(['ne','my','th','km'].includes(locale)){const file='translated-'+locale+'-390x844.png';await page.screenshot({path:path.join(out,file)});screenshots.push(file);}translatedPairs++;}else{assert(text.includes('この言語の訳は準備中です。'));missingPairs++;}
 }
 checks.translatedLocales=translatedPairs;checks.explicitMissingLocaleBehavior=missingPairs;
 // Optionally verify every newly authored pair from a batch, not just one locale sample.
 const translationBatch=process.env.RESTAURANT_QA_TRANSLATION_BATCH;
 if(translationBatch){
  const batch=JSON.parse(fs.readFileSync(translationBatch));let batchCases=0;
  for(const item of batch.entries){
   const lesson=lessons.find(l=>l.id===item.id);assert(lesson,'Batch lesson missing');
   const shard=JSON.parse(fs.readFileSync(path.join(root,'src/data/restaurant/translations',item.locale+'.json'))),t=shard.lessons[item.id];
   assert(t&&t.sourceHash===lesson.sourceHash&&item.sourceHash===lesson.sourceHash,'Stale batch pair');
   for(const [width,height]of [[390,844],[1440,900]]){
    await page.setViewportSize({width,height});await openLesson(lesson,item.locale);await page.getByTestId('restaurant-translation-toggle').click();
    const text=await page.locator('body').innerText();for(const field of ['title','objective','summary','activity'])assert(text.includes(t[field]),item.locale+'/'+item.id+'/'+field);
    for(const paragraph of lesson.paragraphs){assert(text.includes(t.paragraphTitles[paragraph.id]));assert(text.includes(t.paragraphs[paragraph.id]));}
    for(const term of lesson.terms)assert(text.includes(t.terms[term.ja]),item.locale+'/'+item.id+'/term');
    assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),item.locale+'/'+item.id+'/overflow');
    const complete=page.getByTestId('restaurant-complete');await complete.scrollIntoViewIfNeeded();const bounds=await complete.boundingBox();assert(bounds&&bounds.y>=-1&&bounds.y+bounds.height<=height+1,'Batch completion reachable');
    if(item.id==='rst-1-hyg-14'&&width===390){await page.getByTestId('restaurant-translation-toggle').scrollIntoViewIfNeeded();const file='batch-'+item.locale+'-'+item.id+'.png';await page.screenshot({path:path.join(out,file)});screenshots.push(file);}batchCases++;
   }
  }
  checks.translationBatchPairs=batch.entries.length;checks.translationBatchViewportCases=batchCases;
 }

 if(!localeOnly){
 for(const level of ['1','2']){
  const exam=exams.find(e=>e.level===level&&e.kind==='practice'&&e.questions.length>1);if(!exam)continue;
  await cleanStart(level);await openExam(exam);assert.equal(await page.getByTestId('restaurant-answer-review').count(),0);
  await page.evaluate(()=>window.__writeDelay=20);await page.getByTestId('restaurant-option-0').click();await page.getByTestId('restaurant-option-2').click();await page.getByRole('button',{name:'次へ',exact:true}).click();await page.waitForFunction(()=>Object.keys(localStorage).some(key=>key.includes(':exam:')&&JSON.parse(localStorage.getItem(key)).currentQuestion===1));await openExam(exam);assert((await page.locator('body').innerText()).includes(`2 / ${exam.questions.length}`));checks['examResumeLevel'+level]=true;
  await page.getByTestId('restaurant-submit').click();await page.getByRole('button',{name:'キャンセル',exact:true}).click();assert.equal(await page.getByTestId('restaurant-answer-review').count(),0);await page.getByTestId('restaurant-submit').click();await page.getByRole('button',{name:'確定',exact:true}).click();await page.getByTestId('restaurant-result').waitFor();assert.equal(await page.getByTestId('restaurant-answer-review').count(),1);checks['hiddenAnswersAndSubmissionLevel'+level]=true;
  await page.getByRole('button',{name:'Back',exact:true}).click();await page.getByTestId('restaurant-exam-'+exam.id).waitFor();assert((await page.locator('body').innerText()).includes('✓ 完了'));checks['examCompletionBadgeLevel'+level]=true;
 }
 await page.goto(url);await page.evaluate(()=>{localStorage.clear();localStorage.setItem('@japan_app:restaurant:v1:qa:1:progress','broken record');});await start('1');await page.getByText('保存記録を読み取れません。元の記録は上書きしていません。',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('@japan_app:restaurant:v1:qa:1:progress')),'broken record');checks.corruptProgressPreserved=true;
 await page.goto(url);await page.evaluate(()=>localStorage.clear());await page.reload();await page.evaluate(()=>window.__failRead=true);await page.getByTestId('restaurant-level-1').click();await page.getByText('保存記録を読み込めませんでした。',{exact:true}).waitFor();await page.evaluate(()=>window.__failRead=false);await page.getByRole('button',{name:'読み込みを再試行',exact:true}).click();await page.getByTestId('restaurant-week-'+first.week).waitFor();checks.readFailureRetry=true;
 }
 if(localeOnly)assert.equal(translatedPairs,12,'All12revision-boundlocale shards must render');
 assert.deepEqual(errors,[]);const report={status:'PASS',scope:localeOnly?'locale-extension':'course-state-responsive-and-artwork',checks,screenshots,adapters:['Royal artwork and calendar leaf placeholder','background','safe area','localStorage for AsyncStorage'],restaurantRasterAssetsLoaded:[...actualRasterAssets],additionalQaScriptFonts:scriptFonts,realCourseReactAndNativeWeb:true,nativeDeviceTested:false,productionExpoTested:false,fullTranslationCoverageCertified:false};fs.writeFileSync(path.join(root,'docs/ssw-workspace/restaurant',localeOnly?'locale-browser-qa.json':'browser-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
