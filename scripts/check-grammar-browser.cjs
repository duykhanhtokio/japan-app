// Actual grammar route/LanguageProvider/progress storage on React Native Web.
// Artwork, speech, router and native storage are explicit browser adapters.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),modules=process.env.TOKUTEI_QA_MODULES,out=process.env.GRAMMAR_QA_OUTPUT;
if(!modules||!out||!process.env.KENSETSU_QA_CHROMIUM)throw Error('Set TOKUTEI_QA_MODULES, GRAMMAR_QA_OUTPUT, KENSETSU_QA_CHROMIUM');
const esbuild=require(require.resolve('esbuild',{paths:[modules]})),{chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
const adapters={
 storage:`export default {getItem:async k=>localStorage.getItem(k),setItem:async(k,v)=>localStorage.setItem(k,v)};`,
 router:`export const useLocalSearchParams=()=>({level:window.__level||'N5',section:'grammar'});export const router={canGoBack:()=>true};`,
 route:`export const backPrepared=()=>{};export const replacePrepared=()=>{};`,
 royal:`import React from 'react';import {View,Pressable,Text} from 'react-native';export const ROYAL_LAYOUT={screenGutter:12,backSafeTop:8},ROYAL_FONT={body:undefined};export const RoyalBackButton=p=><Pressable onPress={p.onPress}><Text>Back</Text></Pressable>;export default p=><View style={[{backgroundColor:'#eee6d6',flex:p.style?undefined:1},p.style]}>{p.children}</View>;`,
 safe:`export {View as default} from 'react-native';`,speech:`export const stop=()=>{};export const speak=(text,opts)=>{window.__lastSpoken={text,opts}};`,positioning:`export {useWindowDimensions as useRoyalPositioning} from 'react-native';`,exam:`export default ()=>null;`,
};
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const fonts=[['noto-sans-jp','japanese'],['noto-sans-devanagari','devanagari'],['noto-sans-bengali','bengali'],['noto-sans-thai','thai'],['noto-sans-myanmar','myanmar'],['noto-sans-khmer','khmer']];for(const [i,[family,subset]] of fonts.entries())fs.copyFileSync(path.join(modules,'@fontsource',family,'files',family+'-'+subset+'-400-normal.woff2'),path.join(out,'font-'+i+'.woff2'));
 const entry=`import React,{useState} from 'react';import {createRoot} from 'react-dom/client';import Screen from ${JSON.stringify(path.join(root,'src/app/[level]/[section].tsx'))};import Journey from ${JSON.stringify(path.join(root,'src/components/jlpt/N5LearningJourney.tsx'))};import {saveN5JourneyPosition} from ${JSON.stringify(path.join(root,'src/services/jlpt-progress-storage.ts'))};import {LanguageProvider,useAppLanguage} from ${JSON.stringify(path.join(root,'src/context/LanguageContext.tsx'))};import {generatedGrammar,getGrammarMeaning,getGrammarExampleTranslation} from ${JSON.stringify(path.join(root,'src/data/jlpt-study-data.ts'))};import {getGrammarCopy} from ${JSON.stringify(path.join(root,'src/i18n/grammar-copy.ts'))};import {getPlannedGrammar} from ${JSON.stringify(path.join(root,'src/data/grammar-planned-localization.ts'))};import curriculum from ${JSON.stringify(path.join(root,'src/game/data/n5/n5-curriculum-data.js'))};import planBindings from ${JSON.stringify(path.join(root,'src/data/generated/grammar-planned-content.json'))};function Harness(){const [version,setVersion]=useState(0),[mode,setMode]=useState('catalog');const {language,setLanguage,loading}=useAppLanguage();window.__language=language;window.__setLanguage=setLanguage;window.__openLevel=l=>{window.__level=l;setMode('catalog');setVersion(v=>v+1)};window.__items=l=>generatedGrammar.filter(x=>x.jlpt===l);window.__expected=(id,l)=>{const x=generatedGrammar.find(x=>x.id===id);return {meaning:getGrammarMeaning(x,l),example:getGrammarExampleTranslation(x,l),ja:x.exampleJa,reading:x.exampleReading,copy:getGrammarCopy(l)}};window.__journey=async day=>{const d=curriculum.days.find(d=>d.day===day);await saveN5JourneyPosition(d.week,d.day);setMode('journey');setVersion(v=>v+1)};window.__resumeJourney=()=>{setMode('journey');setVersion(v=>v+1)};window.__planned=(day,l)=>{const d=curriculum.days.find(d=>d.day===day);return d.grammar.map((e,i)=>getPlannedGrammar(d.day,i,e,l))};window.__sampleDays=[8,...['PLAN027','PLAN092','PLAN093'].map(id=>curriculum.days.find(d=>d.grammar.some(e=>planBindings[e.pattern]?.extraId===id)).day)];return loading?null:mode==='catalog'?<Screen key={version}/>:<Journey key={version} mode="grammar" onBack={()=>setMode('catalog')} onOpenCharacters={()=>{}}/>;}createRoot(document.getElementById('root')).render(<LanguageProvider><Harness/></LanguageProvider>);`;

 await esbuild.build({stdin:{contents:entry,loader:'tsx',resolveDir:root},outfile:path.join(out,'entry.js'),bundle:true,platform:'browser',format:'iife',jsx:'automatic',nodePaths:[modules],define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},logLevel:'error',plugins:[{name:'browser-adapters',setup(b){
  b.onResolve({filter:/^(react|react-dom)(\/.*)?$/},a=>({path:require.resolve(a.path,{paths:[modules]})}));
  b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web',{paths:[modules]})}));
  b.onResolve({filter:/^expo-router$/},()=>({path:'router',namespace:'adapter'}));b.onResolve({filter:/^expo-speech$/},()=>({path:'speech',namespace:'adapter'}));
  b.onResolve({filter:/async-storage/},()=>({path:'storage',namespace:'adapter'}));b.onResolve({filter:/prepareSceneRoute/},()=>({path:'route',namespace:'adapter'}));
  b.onResolve({filter:/RoyalPaperPanel|RoyalSurface|JlptStudyBackground|FocusedImageBackground/},()=>({path:'royal',namespace:'adapter'}));b.onResolve({filter:/StableSafeAreaView/},()=>({path:'safe',namespace:'adapter'}));
  b.onResolve({filter:/RoyalPositioning/},()=>({path:'positioning',namespace:'adapter'}));b.onResolve({filter:/ApprovedJlptExamCatalog/},()=>({path:'exam',namespace:'adapter'}));b.onLoad({filter:/.*/,namespace:'adapter'},a=>({contents:adapters[a.path],loader:'jsx',resolveDir:root}));
  b.onResolve({filter:/\.(png|webp|jpe?g)$/},()=>({path:'image',namespace:'asset'}));b.onLoad({filter:/.*/,namespace:'asset'},()=>({contents:'module.exports={uri:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="};',loader:'js'}));
  b.onResolve({filter:/^@\//},a=>{const base=path.join(root,'src',a.path.slice(2));for(const ext of ['', '.tsx','.ts','.json','.js','/index.ts'])if(fs.existsSync(base+ext))return {path:base+ext};throw Error(base)});
 }}]});
 const css=fonts.map((_,i)=>'@font-face{font-family:G'+i+';src:url(/font-'+i+'.woff2)}').join('')+'*{font-family:'+fonts.map((_,i)=>'G'+i).join(',')+',sans-serif!important}';
 const html='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'html,body,#root{height:100%;margin:0}#root{display:flex;flex-direction:column}*{box-sizing:border-box}</style><div id="root"></div><script src="/entry.js"></script>';
 const server=http.createServer((q,r)=>{const f=/^\/font-[0-5]\.woff2$/.test(q.url);r.setHeader('Content-Type',f?'font/woff2':q.url==='/entry.js'?'application/javascript':'text/html; charset=utf-8');r.end(f?fs.readFileSync(path.join(out,q.url.slice(1))):q.url==='/entry.js'?fs.readFileSync(path.join(out,'entry.js')):html)});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.KENSETSU_QA_CHROMIUM,args:['--no-sandbox'],headless:true});const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],screenshots=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);await page.getByTestId('grammar-count').waitFor();
  const langs=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let checks=0;
  for(const l of langs){
   await page.setViewportSize({width:320,height:568});
   await page.evaluate(l=>window.__setLanguage(l),l);await page.waitForFunction(l=>window.__language===l,l);
   for(const level of ['N5','N4','N3','N2','N1']){
    await page.evaluate(l=>window.__openLevel(l),level);await page.getByTestId('grammar-count').waitFor();const list=await page.evaluate(l=>window.__items(l),level);const id=list[0].id,ex=await page.evaluate(({id,l})=>window.__expected(id,l),{id,l});
    await page.waitForFunction(({id,value})=>document.querySelector('[data-testid="grammar-meaning-'+id+'"]')?.textContent===value,{id,value:ex.meaning});
    assert.equal(await page.getByTestId('grammar-count').innerText(),ex.copy.count.replace('{count}',String(list.length)));
    assert.equal(await page.getByTestId('grammar-example-ja-'+id).innerText(),ex.ja);assert.equal(await page.getByTestId('grammar-example-reading-'+id).innerText(),ex.reading);
    if(l==='ja')assert.equal(await page.getByTestId('grammar-example-translation-'+id).count(),0);else assert.equal(await page.getByTestId('grammar-example-translation-'+id).innerText(),ex.example);
    if(level==='N5'){
     const toggle=page.getByTestId('grammar-learned-'+id);if(checks===0){await toggle.click();await page.waitForFunction(id=>JSON.parse(localStorage.getItem('@japan_app/jlpt_progress_v1')).learnedIds.includes(id),id);}
     await page.waitForFunction(({id,label})=>document.querySelector('[data-testid="grammar-learned-'+id+'"]')?.textContent.includes(label),{id,label:ex.copy.learned});
    }
    assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),'catalog horizontal overflow '+l+' '+level);
    checks++;
   }
   await page.reload();await page.getByTestId('grammar-count').waitFor();assert.equal(await page.evaluate(()=>window.__language),l);
   if(['vi','my','th','km'].includes(l))for(const [w,h] of [[320,568],[768,1024],[932,430]]){
    await page.setViewportSize({width:w,height:h});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));const file=l+'-'+w+'x'+h+'.png';await page.screenshot({path:path.join(out,file)});screenshots.push(file);
    const boxes=await page.getByTestId('grammar-card-GR0007').evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,width:innerWidth}});assert(boxes.left>=-1&&boxes.right<=boxes.width+1,'card width');
   }
  }
  // Scroll through the actual route's lazy list to reach a formerly escaped item.
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.__openLevel('N5'));
  for(let i=0;i<16&&await page.getByTestId('grammar-card-GR0540').count()===0;i++){
   await page.evaluate(()=>{for(const e of document.querySelectorAll('div'))if(e.scrollHeight>e.clientHeight+20&&getComputedStyle(e).overflowY==='auto')e.scrollTop=e.scrollHeight;});await page.waitForTimeout(100);
  }
  await page.getByTestId('grammar-card-GR0540').waitFor();assert(!(await page.getByTestId('grammar-card-GR0540').innerText()).includes('\\u'));assert.deepEqual(errors,[]);
  let n5Checks=0;
  for(const l of langs){
   await page.setViewportSize({width:320,height:568});
   await page.evaluate(l=>window.__setLanguage(l),l);await page.waitForFunction(l=>window.__language===l,l);
   for(const day of await page.evaluate(()=>window.__sampleDays)){
    await page.evaluate(day=>window.__journey(day),day);const list=await page.evaluate(({day,l})=>window.__planned(day,l),{day,l});
    for(const x of list){
     await page.waitForFunction(({id,value})=>document.querySelector('[data-testid="n5-grammar-meaning-'+id+'"]')?.textContent===value,{id:x.id,value:x.meaning});
     for(const [i,example] of x.examples.entries()){
      const box=page.getByTestId('n5-grammar-example-'+x.id+'-'+i);const text=await box.innerText();assert(text.includes(example.exampleJa));assert(text.includes(example.exampleReading));if(l!=='ja')assert(text.includes(example.exampleTranslation));
     }
    }
    assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),'N5 horizontal overflow '+l);
    const learn=page.getByTestId('n5-grammar-learned-'+list[0].id);
    if(n5Checks===0){await learn.click();await page.waitForFunction(id=>JSON.parse(localStorage.getItem('@japan_app/jlpt_progress_v1')).learnedIds.includes(id),list[0].id);}
    await page.getByTestId('n5-listen-example').click();
    const spoken=await page.evaluate(()=>window.__lastSpoken);assert.equal(spoken.opts.language,'ja-JP');assert(list.some(x=>x.examples[0].exampleJa===spoken.text),'speak actual Japanese, not formula');
    n5Checks++;
   }
   const day=(await page.evaluate(()=>window.__sampleDays)).at(-1),expected=(await page.evaluate(({day,l})=>window.__planned(day,l),{day,l}))[0];
   await page.reload();await page.getByTestId('grammar-count').waitFor();assert.equal(await page.evaluate(()=>window.__language),l);await page.evaluate(()=>window.__resumeJourney());await page.getByTestId('n5-grammar-card-'+expected.id).waitFor();
   if(['vi','my','th','km'].includes(l))for(const [w,h]of [[320,568],[768,1024],[932,430]]){
    await page.setViewportSize({width:w,height:h});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);const card=page.getByTestId('n5-grammar-card-'+expected.id);await card.scrollIntoViewIfNeeded();await page.waitForTimeout(250);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));const name='n5-'+l+'-'+w+'x'+h+'.png';await page.screenshot({path:path.join(out,name)});screenshots.push(name);
    const box=await card.boundingBox();assert(box.x>=-1&&box.x+box.width<=w+1,'N5 card width');
   }
  }
  const firstSampleDay=(await page.evaluate(()=>window.__sampleDays))[0];
  await page.evaluate(day=>window.__journey(day),firstSampleDay);
  const learnedEntry=(await page.evaluate(day=>window.__planned(day,'tl'),firstSampleDay))[0];
  const learnedControl=page.getByTestId('n5-grammar-learned-'+learnedEntry.id);
  await page.waitForFunction(id=>document.querySelector('[data-testid="n5-grammar-learned-'+id+'"]')?.textContent==='✓',learnedEntry.id);assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('@japan_app/jlpt_progress_v1')).learnedIds)).includes(learnedEntry.id),'N5 learned state retained across all language switches and reloads');
  assert.deepEqual(errors,[]);
  const report={status:'PASS',languages:13,levelLanguageCombinations:checks,actualSectionRoute:true,sourceReadingAndExamples:true,learnedStateRetained:true,persistedLanguageRestored:true,lazyListReachedLastN5Item:true,n5ActualJourneyLanguageDayChecks:n5Checks,allLanguagesCheckedAt320px:true,n5ResumePositionRetained:true,n5LearnedStateRetained:true,n5SpeechUsesJapaneseExample:true,screenshots,artworkAndNativeServicesAdapted:true,examBranchNotExecuted:true,nativeDeviceTested:false,productionExpoTested:false,runtimeErrors:errors};fs.writeFileSync(path.join(root,'docs/grammar-workspace/browser-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1)});
