/** Real React/RNW component check. Storage is explicitly adapted; this is not a native run. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),out=process.env.RESTAURANT_ORDERING_QA_DIR,chrome=process.env.RESTAURANT_QA_CHROMIUM;
if(!out||!chrome)throw Error('Set RESTAURANT_ORDERING_QA_DIR and RESTAURANT_QA_CHROMIUM');
const esbuild=require('esbuild'),{chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
fs.mkdirSync(out,{recursive:true});
(async()=>{
 await esbuild.build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {RestaurantOrderingExercise} from './src/components/restaurant/RestaurantOrderingExercise';
 import '@fontsource/noto-sans-jp/400.css';import '@fontsource/noto-sans-devanagari/400.css';import '@fontsource/noto-sans-bengali/400.css';import '@fontsource/noto-sans-myanmar/400.css';import '@fontsource/noto-sans-thai/400.css';import '@fontsource/noto-sans-khmer/400.css';
 const p=new URLSearchParams(location.search);createRoot(document.getElementById('root')).render(<RestaurantOrderingExercise lessonId={p.get('lesson')||'rst-2-ops-05'} language={p.get('locale')||'ja'} showTranslation={p.get('show')!=='0'}/>);`,resolveDir:root,loader:'tsx'},outfile:path.join(out,'entry.js'),bundle:true,platform:'browser',nodePaths:(process.env.NODE_PATH||'').split(path.delimiter),jsx:'automatic',loader:{'.woff':'file','.woff2':'file'},define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},plugins:[{name:'ordering-component-only',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},()=>({contents:'export default {getItem:async()=>null,setItem:async()=>{}}',loader:'js'}));
 b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2));for(const ext of ['','.tsx','.ts','.json','/index.ts'])if(fs.existsSync(p+ext)&&fs.statSync(p+ext).isFile())return{path:p+ext};throw Error(p)});
 }}]});
 const html='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/entry.css"><style>*{box-sizing:border-box;font-family:"Noto Sans JP","Noto Sans Devanagari","Noto Sans Bengali","Noto Sans Myanmar","Noto Sans Thai","Noto Sans Khmer",sans-serif!important}body{margin:0;padding:16px;background:#faf6ed}#root{max-width:1000px;margin:auto}</style><div id="root"></div><script src="/entry.js"></script>';
 const server=http.createServer((q,r)=>{const name=(q.url||'').split('?')[0].slice(1);if(/^[\w.-]+\.(js|css|woff2?)$/.test(name)&&fs.existsSync(path.join(out,name))){r.setHeader('Content-Type',name.endsWith('.js')?'application/javascript':name.endsWith('.css')?'text/css':name.endsWith('.woff2')?'font/woff2':'font/woff');r.end(fs.readFileSync(path.join(out,name)));}else{r.setHeader('Content-Type','text/html');r.end(html);}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-gpu']});const page=await browser.newPage(),errors=[],results=[],screenshots=[];page.on('pageerror',e=>errors.push(e.message));
  const data=JSON.parse(fs.readFileSync(path.join(root,'src/data/restaurant/ordering-exercise.json'))),locales=['ja',...Object.keys(data.labels.title.translations)];
  async function goto(locale,extra=''){await page.goto(`http://127.0.0.1:${server.address().port}/?locale=${locale}${extra}`);await page.getByTestId('restaurant-ordering-exercise').waitFor();await page.evaluate(()=>document.fonts.ready);}
  async function noOverflow(context){assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),'horizontal overflow: '+context);}
  for(const [width,height] of [[320,568],[844,390],[768,1024],[1440,900]])for(const locale of locales){
   await page.setViewportSize({width,height});await goto(locale);
   assert.equal((await page.getByTestId('restaurant-ordering-result').innerText()).trim(),'? kg');
   for(let i=0;i<data.plans.length;i++)assert.equal((await page.getByTestId('restaurant-ordering-rice-'+i).innerText()).trim(),'? kg');
   const body=await page.locator('body').innerText();
   if(locale!=='ja')for(const label of Object.values(data.labels)){if(label===data.labels.hide||label===data.labels.portions)continue;assert(body.includes(label.translations[locale]),locale+' missing label: '+label.ja);}
   await noOverflow(`${width}/${locale}/hidden`);
   await page.getByTestId('restaurant-ordering-reveal').click();
   assert.equal((await page.getByTestId('restaurant-ordering-result').innerText()).trim(),'4.2 kg');
   assert((await page.getByTestId('restaurant-ordering-formula').innerText()).includes('7.2 + 0.3 − 2.0 − 1.3 = 4.2 kg'));
   for(let i=0;i<data.plans.length;i++)assert.equal((await page.getByTestId('restaurant-ordering-rice-'+i).innerText()).trim(),data.plans[i].riceKg.toFixed(1)+' kg');
   await noOverflow(`${width}/${locale}/shown`);
   if(locale==='vi'){const file=`ordering-${width}x${height}-vi.png`;await page.screenshot({path:path.join(out,file),fullPage:true,type:'png'});screenshots.push(file);}
   await page.getByTestId('restaurant-ordering-reveal').click();assert.equal((await page.getByTestId('restaurant-ordering-result').innerText()).trim(),'? kg');
   results.push({width,height,locale,passed:true});
  }
  const scaled=[];await page.setViewportSize({width:320,height:568});
  for(const locale of locales){await goto(locale);await page.getByTestId('restaurant-ordering-reveal').click();await page.evaluate(()=>{for(const el of document.querySelectorAll('[dir="auto"]')){const c=getComputedStyle(el);el.style.fontSize=(parseFloat(c.fontSize)*2)+'px';const h=parseFloat(c.lineHeight);if(Number.isFinite(h))el.style.lineHeight=(h*2)+'px';}});await noOverflow('2x/'+locale);scaled.push(locale);if(locale==='vi'){const file='ordering-320x568-vi-font2x.png';await page.screenshot({path:path.join(out,file),fullPage:true,type:'png'});screenshots.push(file);}}
  await goto('vi','&show=0');assert(!(await page.locator('body').innerText()).includes(data.labels.title.translations.vi));
  await page.goto(`http://127.0.0.1:${server.address().port}/?lesson=rst-2-ops-04`);await page.waitForTimeout(100);assert.equal(await page.getByTestId('restaurant-ordering-exercise').count(),0);
  assert.deepEqual(errors,[]);
  const result={status:'ORDERING_BROWSER_PASS',viewportLocaleCases:results.length,viewports:4,locales:locales.length,font2xCases:scaled.length,translationHideChecked:true,unrelatedLessonExcluded:true,revealHideChecked:true,errors,screenshots: screenshots.map(name=>({path:path.join(out,name),bytes:fs.statSync(path.join(out,name)).size})),scope:'Actual React/React Native Web ordering component, RestaurantReading and default appearance; AsyncStorage no-op adapter. Browser font/line-height doubled is not native font scaling. Screenshots are transient internal QA files.',nativeDeviceTested:false,productionExpoTested:false};
  const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
  result.inputFingerprints={dataSha256:hash('src/data/restaurant/ordering-exercise.json'),componentSha256:hash('src/components/restaurant/RestaurantOrderingExercise.tsx')};
  fs.writeFileSync(path.join(root,'docs/ssw-workspace/restaurant/completion27-ordering-browser-qa.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
