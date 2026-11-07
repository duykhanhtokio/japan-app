// Isolated web course harness: real reader/data/figures/storage logic; platform chrome is adapted.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),out=process.env.HOTEL_QA_OUTPUT;
if(!out)throw Error('HOTEL_QA_OUTPUT required');fs.mkdirSync(out,{recursive:true});
const esbuild=require('esbuild');
const assetCommit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
const translationSnapshot=new Map([...fs.readFileSync(path.join(root,'src/data/hospitality/translation-loaders.ts'),'utf8').matchAll(/require\('\.\/translations\/([^']+)\.json'\)/g)].map(m=>[m[1],JSON.parse(fs.readFileSync(path.join(root,'src/data/hospitality/translations',m[1]+'.json')))]));
const deps=process.env.HOTEL_QA_WEB_MODULES||path.join(root,'node_modules');
const {chromium}=require(require.resolve('playwright',{paths:[process.env.HOTEL_QA_PLAYWRIGHT_MODULES||process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES||deps]}));
const mocks={
 '@/hooks/useUserProfile':`export const useUserProfile=()=>({profile:{createdAt:'qa'},loading:false});`,
 '@/context/LanguageContext':`export const useAppLanguage=()=>({language:new URLSearchParams(location.search).get('language')||'ja'});`,
 '@/components/ui/prepareSceneRoute':`export const backPrepared=async()=>{window.__exit=true};`,
 '@/components/ui/StableSafeAreaView':`export{View as default}from'react-native';`,
 '@react-native-async-storage/async-storage':`export default {getItem:async k=>{if(window.__failRead)throw Error('read');return localStorage.getItem(k)},setItem:async(k,v)=>{if(window.__failWrite)throw Error('write');localStorage.setItem(k,v)}};`,
 'react-native-safe-area-context':`export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});`,
 '@/components/ui/RoyalPanels':`import React from 'react';import{View}from'react-native';export const RoyalContentPanel=({children,style})=><View style={[{backgroundColor:'#ede5d2',borderRadius:12},style]}>{children}</View>;export const RoyalExplanationPanel=({children,style})=><View style={[{backgroundColor:'#20364a',borderRadius:12},style]}>{children}</View>;`,
 '@/components/ui/RoyalPageBackground':`import React from 'react';import{View}from'react-native';export default({children})=><View style={{flex:1,backgroundColor:'#ede5d2'}}>{children}</View>;`,
 '@/components/tokutei/TokuteiChrome':`import React from'react';import{View,Text,Pressable}from'react-native';export const TokuteiHeader=({title,onBack})=><View><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onBack}><Text>Back</Text></Pressable><Text style={{fontSize:22,padding:12}}>{title}</Text></View>;`,
};
(async()=>{
 // Fail before fetching/embedding image blobs when this host cannot launch a browser.
 if(process.env.HOTEL_QA_BUILD_ONLY!=='1'){
  let preflight;
  try{preflight=await chromium.launch({executablePath:process.env.HOTEL_QA_CHROMIUM||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox','--disable-gpu']});}
  catch(error){fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({status:'BLOCKED_BROWSER_STARTUP',browserTested:false,physicalDeviceTested:false,error:String(error),harness:'real hospitality route/data/reader with adapted platform chrome'},null,2)+'\n');throw error;}
  finally{if(preflight)await preflight.close();}
 }
 await esbuild.build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import HospitalityRoute from '${root}/src/app/specified-skills/hospitality';createRoot(document.getElementById('root')).render(<HospitalityRoute/>);`,resolveDir:root,loader:'tsx'},outfile:path.join(out,'entry.js'),bundle:true,platform:'browser',format:'iife',jsx:'automatic',loader:{'.png':'dataurl'},define:{__DEV__:'false','process.env.NODE_ENV':'"production"'},plugins:[{name:'platform',setup(b){b.onResolve({filter:/.*/},a=>{if(mocks[a.path])return{path:a.path,namespace:'mock'};if(['react','react/jsx-runtime','react-dom/client'].includes(a.path))return{path:require.resolve(a.path,{paths:[deps]})};if(a.path==='react-native')return{path:require.resolve('react-native-web',{paths:[deps]})};if(a.path.startsWith('@/')){const p=path.join(root,'src',a.path.slice(2));for(const ext of['','.tsx','.ts','.json','/index.ts'])if(fs.existsSync(p+ext)&&fs.statSync(p+ext).isFile())return{path:p+ext};throw Error(p);}});b.onLoad({filter:/.*/,namespace:'mock'},a=>({contents:mocks[a.path],loader:'tsx'}));
 b.onResolve({filter:/\.(png|webp|jpe?g)$/},a=>({path:path.resolve(a.resolveDir,a.path),namespace:'hotel-asset'}));
 b.onLoad({filter:/.*/,namespace:'hotel-asset'},a=>{const relative=path.relative(root,a.path);if(process.env.HOTEL_QA_TRACE_ASSETS==='1')console.log('Hotel QA asset:',relative);assert(relative.startsWith('assets/'),'Only app assets');const bytes=fs.existsSync(a.path)?fs.readFileSync(a.path):execFileSync('git',['show',assetCommit+':'+relative],{cwd:root,maxBuffer:10*1024*1024,timeout:30000});assert(!bytes.subarray(0,80).toString().includes('git-lfs.github.com'),'Asset must contain image bytes');const mime=a.path.endsWith('.webp')?'image/webp':a.path.endsWith('.png')?'image/png':'image/jpeg';return{contents:'module.exports={uri:'+JSON.stringify('data:'+mime+';base64,'+bytes.toString('base64'))+'}',loader:'js'};});}}],logLevel:'error'});
 fs.copyFileSync('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',path.join(out,'japanese.ttc'));
 fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:HotelQA;src:url('/japanese.ttc')}*{box-sizing:border-box;font-family:HotelQA,sans-serif!important}html,body,#root{margin:0;height:100%}#root{display:flex;flex-direction:column}</style><div id="root"></div><script src="/entry.js"></script>`);
 if(process.env.HOTEL_QA_BUILD_ONLY==='1'){console.log(JSON.stringify({status:'BUILT_HOST_HARNESS_ONLY',browserTested:false,physicalDeviceTested:false}));return;}
 const server=http.createServer((req,res)=>{const name=req.url.startsWith('/entry.js')?'entry.js':req.url.startsWith('/japanese.ttc')?'japanese.ttc':'index.html';res.setHeader('Content-Type',name.endsWith('.js')?'application/javascript':name.endsWith('.ttc')?'font/collection':'text/html');res.end(fs.readFileSync(path.join(out,name)));});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;const errors=[];let readers=0,responsive=0,translationPairs=0;
 try{
 let executablePath=process.env.HOTEL_QA_CHROMIUM;
 if(!executablePath&&fs.existsSync('/usr/bin/chromium'))executablePath='/usr/bin/chromium';
 browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox','--disable-gpu']});const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));const url=`http://127.0.0.1:${server.address().port}`;
 const catalog=require('../../src/data/hospitality/catalog.json');const find=id=>require(`../../src/data/hospitality/${catalog.find(e=>e.id===id).group}.json`).lessons.find(l=>l.id===id);
 async function start(language='ja'){await page.goto(url+'?language='+language);await page.getByRole('button',{name:'特定技能２号 · 基礎の復習と管理・判断',exact:true}).click();}
 async function open(id,language='ja'){await start(language);const index=catalog.findIndex(e=>e.id===id);await page.getByRole('button',{name:'学習を開く・続ける',exact:true}).nth(index).click();}
 for(const entry of catalog){const l=find(entry.id);await open(l.id);const content=await page.locator('body').innerText();for(const section of l.sections)assert(content.includes(section.body),l.id);assert(!content.includes('正解：'));const image=page.getByTestId('hotel-figure-'+l.id);assert.equal(await image.count(),1);await image.locator('img').evaluate(async el=>{if(!el.complete)await new Promise((resolve,reject)=>{el.addEventListener('load',resolve,{once:true});el.addEventListener('error',reject,{once:true});});if(!el.naturalWidth||!el.naturalHeight)throw Error('Main image did not decode');});readers++;}
 const first=find(catalog[0].id);await open(first.id);for(const q of first.questions){await page.getByTestId(q.id).getByRole('button',{name:`${q.answerIndex+1}. ${q.choices[q.answerIndex]}`,exact:true}).click();}
 assert(!(await page.locator('body').innerText()).includes('正解：'));await page.getByRole('button',{name:'確認問題を提出する',exact:true}).click();await page.getByRole('button',{name:'確認',exact:true}).click();await page.getByText(`正解 ${first.questions.length} / ${first.questions.length}`,{exact:true}).waitFor();await page.getByRole('button',{name:'この日の学習を完了する',exact:true}).click();await page.getByRole('button',{name:'✓ この日の学習を完了しました',exact:true}).waitFor();await open(first.id);assert((await page.locator('body').innerText()).includes('✓ この日の学習を完了しました'));
 await page.getByRole('button',{name:'もう一度解く',exact:true}).click();await page.getByRole('button',{name:'確認',exact:true}).click();assert(!(await page.locator('body').innerText()).includes('正解：'));
 // Failed saves must block back navigation and preserve the last committed state.
 await page.evaluate(()=>window.__failWrite=true);const q=first.questions[0];await page.getByRole('button',{name:`1. ${q.choices[0]}`,exact:true}).click();await page.getByRole('button',{name:'保存を再試行',exact:true}).waitFor();await page.getByRole('button',{name:'Back',exact:true}).click();assert((await page.locator('body').innerText()).includes(first.sections[0].body));await page.evaluate(()=>window.__failWrite=false);await page.getByRole('button',{name:'保存を再試行',exact:true}).click();await page.getByRole('button',{name:'保存を再試行',exact:true}).waitFor({state:'detached'});
 // Verify the separate 25-question synthesis practice and independent saved record.
 await start();await page.getByRole('button',{name:'総合練習（25問）',exact:true}).click();const mock=require('../../src/data/hospitality/mocks.json').mocks.find(m=>m.level===2);for(const q of mock.questions){await page.getByTestId(q.id).getByRole('button',{name:`${q.answerIndex+1}. ${q.choices[q.answerIndex]}`,exact:true}).click();}await page.getByRole('button',{name:'確認問題を提出する',exact:true}).click();await page.getByRole('button',{name:'確認',exact:true}).click();await page.getByText('正解 25 / 25',{exact:true}).waitFor();
 // Distinct learner/corrupt storage handling is also unit tested separately.
 for(const [width,height]of[[390,844],[844,390],[768,1024],[1440,900]])for(const id of['hotel-service-01','hotel-restaurant-03','hotel-planning-02','hotel-restaurant-04','hotel-service-02']){await page.setViewportSize({width,height});await open(id);const fig=page.getByTestId('hotel-figure-'+id);await fig.scrollIntoViewIfNeeded();assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));const box=await fig.boundingBox();assert(box&&box.width<=width);if(width===390)await page.screenshot({path:path.join(out,`${id}-${width}x${height}.png`)});responsive++;}
 // Verify actual complete/stale-bound translation payloads, never a fallback.
 for(const locale of['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'])for(const group of['front','planning','service','restaurant','safety']){const file=path.join(root,`src/data/hospitality/translations/${locale}/${group}.json`);if(!translationSnapshot.has(locale+'/'+group))continue;for(const t of translationSnapshot.get(locale+'/'+group).lessons.slice(0,Number(process.env.HOTEL_QA_TRANSLATION_LIMIT||9999))){const l=find(t.id);if(t.sourceRevision!==l.revision)continue;await open(t.id,locale);await page.getByRole('button',{name:require('../../src/data/manufacturing/ui-translations.json').locales[locale].translationShow,exact:true}).click();const content=await page.locator('body').innerText();assert(content.includes(t.title)&&t.sections.every(s=>content.includes(s.body)),locale+'/'+t.id);translationPairs++;}}
 // Ruby must render in the real reader at narrow/landscape/tablet/desktop widths.
 let rubyCases=0;
 for(const [width,height] of [[390,844],[844,390],[768,1024],[1440,900]])for(const id of ['hotel-service-04','hotel-safety-07']){
  await page.setViewportSize({width,height});await open(id);await page.getByRole('button',{name:'ふりがなを表示',exact:true}).click();
  await page.getByRole('button',{name:'ふりがなを隠す',exact:true}).waitFor();
  const l=find(id);for(const section of l.sections)assert(await page.getByLabel(section.body,{exact:true}).count()>0,'missing ruby body '+id);
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),'ruby horizontal overflow '+id);
  for(const q of l.questions){const b=page.getByTestId(q.id);assert(await b.getByRole('button').count()===4);}
  if(width===390)await page.screenshot({path:path.join(out,`${id}-ruby-${width}x${height}.png`)});
  await page.getByRole('button',{name:'ふりがなを隠す',exact:true}).click();assert((await page.locator('body').innerText()).includes(l.sections[0].body));rubyCases++;
 }
 // Actual absent translation path.
 const missing=catalog.find(e=>!translationSnapshot.has('km/'+e.group));if(missing){await open(missing.id,'km');await page.getByRole('button',{name:require('../../src/data/manufacturing/ui-translations.json').locales.km.translationShow,exact:true}).click();assert((await page.locator('body').innerText()).includes(require('../../src/data/manufacturing/ui-translations.json').locales.km.translationPending));}
 assert.deepEqual(errors,[]);const report={status:'PASS',harness:'hospitality app route and reader; React Native Web with adapted platform chrome',readers,responsive,translationPairs,rubyCases,saveRestore:true,saveFailure:true,submissionAnswerSecrecy:true,physicalDeviceTested:false};fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
