const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../..'),out=process.env.FOOD_DAILY_QA_OUTPUT;if(!out)throw Error('Set FOOD_DAILY_QA_OUTPUT outside repository');fs.mkdirSync(out,{recursive:true});
const esbuild=require('esbuild'),{chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]})),sp=require('@sparticuz/chromium').default;
const adapters={safe:'export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});',backdrop:'export const useBackdropOcclusion=()=>{};',storage:`export default {getItem:async k=>localStorage.getItem(k),setItem:async(k,v)=>localStorage.setItem(k,v)};`,royal:`import React from 'react';import {View,Pressable,Text} from 'react-native';export const ROYAL_LAYOUT={screenGutter:12,backSafeTop:8},ROYAL_FONT={body:'FoodQA',heading:'FoodQA'};export const RoyalBackButton=({onPress})=><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onPress}><Text>Back</Text></Pressable>;export const RoyalContentPanel=({children,style})=><View style={style}>{children}</View>;export const RoyalExplanationPanel=RoyalContentPanel;export default ({children})=><View style={{flex:1}}>{children}</View>;`};
const entry=`import React,{useState} from 'react';import {createRoot} from 'react-dom/client';import {Reader} from './src/components/food-manufacturing/FoodManufacturingCourse';import {StudyAppearanceProvider} from './src/components/tokutei/StudyAppearance';import {foodManufacturingLessons} from './src/data/food-manufacturing';function App(){const [state,set]=useState({id:'food-1-017',language:'ja'});window.qaSet=(id,language='ja',stale=false)=>set({id,language,stale,nonce:Math.random()});window.qaLessonHashes=Object.fromEntries(foodManufacturingLessons.map(l=>[l.id,l.sourceHash]));window.qaIds=foodManufacturingLessons.map(l=>l.id);return <StudyAppearanceProvider><Reader key={state.id+state.language+state.nonce} lesson={state.stale?{...foodManufacturingLessons.find(l=>l.id===state.id),sourceHash:'qa-stale-source'}:foodManufacturingLessons.find(l=>l.id===state.id)} language={state.language} saving={false} saveError={false} onBack={()=>{}} onComplete={()=>window.qaCompleted=state.id}/></StudyAppearanceProvider>;}createRoot(document.getElementById('root')).render(<App/>);`;
(async()=>{await esbuild.build({stdin:{contents:entry,resolveDir:root,loader:'tsx'},outfile:path.join(out,'bundle.js'),bundle:true,platform:'browser',format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"','__DEV__':'false'},alias:{'react-native':'react-native-web'},plugins:[{name:'qa-adapters',setup(b){b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'qa'}));b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'qa'}));b.onResolve({filter:/^@\/components\/ui\/AppBackdrop$/},()=>({path:'backdrop',namespace:'qa'}));b.onResolve({filter:/^@\/components\/ui\/(RoyalSurface|RoyalPanels|RoyalPageBackground)$/},()=>({path:'royal',namespace:'qa'}));b.onLoad({filter:/.*/,namespace:'qa'},a=>({contents:adapters[a.path],loader:'tsx',resolveDir:root}));b.onResolve({filter:/\.(webp|png|jpe?g)$/},a=>({path:path.resolve(a.resolveDir,a.path),namespace:'asset'}));b.onLoad({filter:/.*/,namespace:'asset'},a=>({contents:'module.exports={uri:'+JSON.stringify('/asset/'+path.relative(root,a.path).replaceAll('\\','/'))+'};',loader:'js'}));}}]});
fs.copyFileSync(process.env.FOOD_QA_JAPANESE_FONT,path.join(out,'font.otf'));fs.writeFileSync(path.join(out,'index.html'),`<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:FoodQA;src:url(/font.otf)}html,body,#root{margin:0;height:100%;font-family:FoodQA,sans-serif}*{box-sizing:border-box}</style></head><body><div id="root"></div><script src="/bundle.js"></script></body></html>`);
const server=http.createServer((req,res)=>{let file;if(req.url.startsWith('/asset/'))file=path.join(root,decodeURIComponent(req.url.slice(7)));else file=path.join(out,req.url==='/'?'index.html':req.url.slice(1));if(!fs.existsSync(file)){res.writeHead(404);res.end();return;}const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.webp':'image/webp','.otf':'font/otf'})[ext]||'application/octet-stream');res.end(fs.readFileSync(file));});await new Promise(r=>server.listen(0,'127.0.0.1',r));const crypto=require('crypto');
const supplements=JSON.parse(fs.readFileSync(path.join(root,'src/data/food-manufacturing/source-closure34.json'),'utf8'));
const legacy=JSON.parse(fs.readFileSync(path.join(root,'src/data/food-manufacturing/source-closure31.json'),'utf8'));
assert.equal(supplements.sections.length,36);
const delta=process.env.FOOD_QA_SUPPLEMENT_DELTA==='1';
const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const phone={width:390,height:844},otherViewports=[{width:844,height:390},{width:768,height:1024},{width:1366,height:768}];
const screenshotsFor=new Set(['food34-handwashing-detail','food34-cold-packing','food34-chart-axes','food34-error-prevention-2','food34-tail-histogram-bins',...(delta?['food34-energy-design']:[])]);
const normalize=s=>s.replace(/\s+/gu,' ').trim();
const inputFiles=['src/components/food-manufacturing/FoodClosureSupplements.tsx','src/data/food-manufacturing/source-closure34.json'];
const inputSha256=Object.fromEntries(inputFiles.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]));
const executablePath=await sp.executablePath();
async function runShard(name,matrix){
 const browser=await chromium.launch({executablePath,args:sp.args,headless:true});
 const errors=[],screenshots=[];let cases=0,legacyCases=0,staleLessonChecks=0;
 try{
  const page=await browser.newPage({viewport:phone});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.waitForFunction(()=>window.qaSet&&window.qaIds&&window.qaLessonHashes);await page.evaluate(()=>document.fonts.ready);
  for(const section of supplements.sections){
   assert.equal(await page.evaluate(id=>window.qaLessonHashes[id],section.lessonId),section.lessonSourceHash,'Stale lesson binding '+section.id);
   for(const language of locales.filter(l=>l!=='ja'))assert.equal(section.translations[language].sourceHash,section.sourceHash,'Stale translation '+language+'/'+section.id);
  }
  for(const {viewport,languages} of matrix){
   await page.setViewportSize(viewport);
   for(const language of languages)for(const section of supplements.sections){
    if(delta && section.id!=='food34-energy-design' && !(viewport.width===390 && ((section.id==='food34-kyt-case-set'&&language==='km')||(section.id==='food34-ojt-opportunities'&&language==='tl')||(section.id==='food34-rights-remedy'&&['hi','ne'].includes(language)))))continue;
    await page.evaluate(({id,language})=>window.qaSet(id,language),{id:section.lessonId,language});
    const block=page.getByTestId(section.id);await block.waitFor();
    if(delta&&section.id==='food34-energy-design')assert(await block.evaluate(el=>[...el.querySelectorAll('*')].some(n=>n.children.length===0&&n.textContent==='角'&&n.parentElement.textContent.includes('かど'))),'Context reading must be かど');
    const labels=await block.locator('[aria-label]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label')));
    assert(labels.includes(section.titleJa),'Missing Japanese accessible title '+section.id);
    assert(labels.includes(section.textJa),'Missing full Japanese accessible text/exercise '+section.id);
    const japaneseParts=section.textJa.split('\n\n');assert(japaneseParts.length>=2&&japaneseParts.at(-1).trim(),'No embedded exercise '+section.id);
    if(language!=='ja'){
     await page.getByRole('button',{name:'訳を表示',exact:true}).click();
     const actual=normalize(await block.innerText()),t=section.translations[language];
     assert(actual.includes(normalize(t.title)),'Missing full translated title '+language+'/'+section.id);
     assert(actual.includes(normalize(t.text)),'Missing full translated body/exercise '+language+'/'+section.id);
     const parts=t.text.split('\n\n');assert(parts.length>=2&&parts.at(-1).trim(),'No translated embedded exercise '+language+'/'+section.id);
     assert(actual.includes(normalize(parts.at(-1))),'Missing final translated exercise '+language+'/'+section.id);
    }
    await block.scrollIntoViewIfNeeded();
    const box=await block.boundingBox();assert(box&&box.width<=viewport.width+1&&box.x>=-1,'Block overflow '+language+'/'+section.id);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Document overflow '+language+'/'+section.id);
    cases++;
    if(language==='vi'&&screenshotsFor.has(section.id)){
     const file=path.join(out,`${section.id}-vi-${viewport.width}x${viewport.height}.png`);await block.screenshot({path:file});screenshots.push(file);
    }
    if(cases%52===0)console.log(JSON.stringify({shard:name,completedCases:cases}));
   }
  }
  if(name==='phone'){
   await page.setViewportSize(phone);
   for(const section of legacy.sections){
    await page.evaluate(id=>window.qaSet(id,'ja'),section.lessonId);
    const block=page.getByTestId(section.id);await block.waitFor();
    const labels=await block.locator('[aria-label]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('aria-label')));
    assert(labels.includes(section.titleJa)&&labels.includes(section.textJa),'Legacy supplement regression '+section.id);legacyCases++;
   }
   const section=supplements.sections[0];await page.evaluate(id=>window.qaSet(id,'ja',true),section.lessonId);
   await page.waitForFunction(()=>!document.querySelector('[data-testid="food34-hygiene-matrix"]'));
   assert.equal(await page.getByTestId(section.id).count(),0,'Stale lesson supplement must be suppressed');staleLessonChecks++;
  }
  assert.equal(errors.length,0,errors.join('\n'));
  return {name,cases,legacyCases,staleLessonChecks,screenshots,pageErrors:errors,matrix};
 }finally{await browser.close();}
}
try{
 const shards=delta?[await runShard('delta',[{viewport:phone,languages:locales},...otherViewports.map(viewport=>({viewport,languages:locales}))])]:await Promise.all([
  runShard('phone',[{viewport:phone,languages:locales}]),
  runShard('other-viewports',otherViewports.map(viewport=>({viewport,languages:['ja','vi']})))
 ]);
 const cases=shards.reduce((n,s)=>n+s.cases,0);assert.equal(cases,delta?56:684);
 const report={status:'PASS',actualReader:true,sectionLocaleViewportCases:cases,sections:delta?4:36,canonicalSections:36,deltaRun:delta,
  matrix:delta?[{sectionIds:['food34-energy-design'],viewports:[phone,...otherViewports],locales,cases:52},{sectionId:'food34-kyt-case-set',viewport:phone,locales:['km'],cases:1},{sectionId:'food34-ojt-opportunities',viewport:phone,locales:['tl'],cases:1},{sectionId:'food34-rights-remedy',viewport:phone,locales:['hi','ne'],cases:2}]:[{viewport:phone,locales,sections:36,cases:468},...otherViewports.map(viewport=>({viewport,locales:['ja','vi'],sections:36,cases:72}))],
  fullLocaleViewportCrossProductTested:false,allTranslatedTitleBodyExerciseAssertions:delta?52:540,japaneseAccessibleTitleBodyAssertions:cases,contextReadingAssertions:delta?52:0,
  lessonSourceHashBindings:36,translationSourceHashBindings:432,legacyJapanesePhoneRegressions:shards.reduce((n,s)=>n+s.legacyCases,0),
  staleLessonSuppressionChecks:shards.reduce((n,s)=>n+s.staleLessonChecks,0),
  screenshots:shards.flatMap(s=>s.screenshots),screenshotVisualInspection:'pending_agent_inspection',
  maxConcurrentChromium:delta?1:2,inputSha256,adapters:['Royal surface/artwork','safe-area','backdrop','localStorage'],
  browserPageErrors:shards.flatMap(s=>s.pageErrors),physicalDeviceTested:false,productionExpoTested:false};

 fs.writeFileSync(path.join(root,'docs/ssw-workspace/food-manufacturing/source-closure-20261031/'+(delta?'browser34-supplements-delta-validation.json':'browser34-supplements-validation.json')),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
