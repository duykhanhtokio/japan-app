/** Real React/RNW geometry checks for additional guide diagrams, with explicit storage adapter.
 * This is browser component QA, not native font-scale/device evidence.
 */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),qa=process.env.RESTAURANT_EXPO_QA_DIR,chrome=process.env.RESTAURANT_QA_CHROMIUM;
if(!qa||!chrome)throw Error('Set QA dir and Chromium path');
const esbuild=require('esbuild'),{chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
const out=path.join(qa,'additional-guides'),fontDir=path.join(qa,'fonts');fs.mkdirSync(out,{recursive:true});
(async()=>{
 await esbuild.build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {RestaurantAdditionalGuides} from './src/components/restaurant/RestaurantAdditionalGuides';const p=new URLSearchParams(location.search);createRoot(document.getElementById('root')).render(<RestaurantAdditionalGuides lessonId={p.get('lesson')} language={p.get('locale')} showTranslation={true}/>);`,resolveDir:root,loader:'tsx'},outfile:path.join(out,'entry.js'),bundle:true,platform:'browser',nodePaths:(process.env.NODE_PATH||'').split(path.delimiter),jsx:'automatic',define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},plugins:[{name:'guide-only-browser',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'adapter'}));b.onLoad({filter:/.*/,namespace:'adapter'},()=>({contents:'export default {getItem:async()=>null,setItem:async()=>{}}',loader:'js'}));
 b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2));for(const ext of ['','.tsx','.ts','.json','/index.ts'])if(fs.existsSync(p+ext)&&fs.statSync(p+ext).isFile())return{path:p+ext};throw Error(p)});
 }}]});
 const fonts=['japanese.ttf','qa-bn.woff2','qa-hi.woff2','qa-my.woff2','qa-th.woff2','qa-km.woff2'];for(const f of fonts)assert(fs.existsSync(path.join(fontDir,f)),f);
 const css=fonts.map((f,i)=>`@font-face{font-family:QA${i};src:url(/${f})}`).join('')+'*{box-sizing:border-box;font-family:QA0,QA1,QA2,QA3,QA4,QA5,sans-serif!important}body{margin:0;padding:16px;background:#faf6ed}#root{max-width:900px;margin:auto}';
 const html='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'</style><div id="root"></div><script src="/entry.js"></script>';
 const server=http.createServer((q,r)=>{if(q.url==='/entry.js'){r.setHeader('Content-Type','application/javascript');r.end(fs.readFileSync(path.join(out,'entry.js')))}else if(fonts.includes(q.url.slice(1))){r.setHeader('Content-Type',q.url.endsWith('ttf')?'font/ttf':'font/woff2');r.end(fs.readFileSync(path.join(fontDir,q.url.slice(1))))}else{r.setHeader('Content-Type','text/html');r.end(html)}});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const data=JSON.parse(fs.readFileSync(path.join(root,'src/data/restaurant/additional-guides.json'))),results=[],errors=[];
 try{
 browser=await chromium.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-gpu']});const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const [width,height]of [[390,844],[844,390],[768,1024],[1440,900]])for(const locale of ['ja','en','vi','id','km','my','ne','th','zh-CN','zh-TW','hi','bn','tl'])for(const guide of data.guides){
  await page.setViewportSize({width,height});await page.goto(`http://127.0.0.1:${server.address().port}/?lesson=${guide.lessonIds[0]}&locale=${locale}`);await page.getByTestId('restaurant-additional-'+guide.id).waitFor();await page.evaluate(()=>document.fonts.ready);
  const body=await page.locator('body').innerText(),hasJapanese=async value=>page.evaluate(v=>document.body.innerText.includes(v)||Array.from(document.querySelectorAll('[aria-label]')).some(el=>el.getAttribute('aria-label')===v),value);
  assert(await hasJapanese(guide.titleJa));if(locale!=='ja'&&guide.titleTranslations[locale])assert(body.includes(guide.titleTranslations[locale]));
  for(const list of [guide.labels,guide.forms,guide.results,guide.instruments])for(const item of list||[]){assert(await hasJapanese(item.labelJa));if(locale!=='ja'&&item.translations[locale])assert(body.includes(item.translations[locale]));}
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),`${width}/${locale}/${guide.id} horizontal overflow`);
  if(width===390&&locale==='vi'){const file=`${guide.id}-390x844-vi.png`;await page.screenshot({path:path.join(out,file),fullPage:true});}
  results.push({width,height,locale,guide:guide.id,passed:true});
 }
 const scaled=[];
 for(const guide of data.guides){await page.setViewportSize({width:390,height:844});await page.goto(`http://127.0.0.1:${server.address().port}/?lesson=${guide.lessonIds[0]}&locale=vi`);await page.getByTestId('restaurant-additional-'+guide.id).waitFor();await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>{for(const el of document.querySelectorAll('[dir="auto"]')){const c=getComputedStyle(el);if(c.fontSize==='12px'&&c.lineHeight==='17px'&&/^\d+$/.test(el.textContent||''))continue;el.style.fontSize=(parseFloat(c.fontSize)*2)+'px';const h=parseFloat(c.lineHeight);if(Number.isFinite(h))el.style.lineHeight=(h*2)+'px';}});await page.waitForTimeout(100);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),'2x '+guide.id);await page.screenshot({path:path.join(out,guide.id+'-390x844-vi-font2x.png'),fullPage:true});scaled.push(guide.id);}
 assert.deepEqual(errors,[]);const report={status:'ADDITIONAL_GUIDES_BROWSER_PASS',viewportLocaleGuideCases:results.length,viewports:4,locales:13,guides:data.guides.length,font2xCases:scaled.length,errors,fonts:fonts,adapter:['AsyncStorage no-op; guide uses default appearance context'],nativeDeviceTested:false,fontScaleScope:'Browser Text DOM font/line-height doubled; not native accessibility-font scaling',screenshotsDirectory:out};fs.writeFileSync(path.join(qa,'results/additional-guides-browser.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
