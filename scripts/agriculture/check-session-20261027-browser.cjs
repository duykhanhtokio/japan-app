// Scoped actual Agriculture route checks for new mock forms; explicit browser adapters, no native certification.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),out=process.env.AGRICULTURE_QA_OUTPUT;
const esbuild=require('esbuild'),{chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
const all=JSON.parse(fs.readFileSync(path.join(root,'src/data/agriculture/weekly-checks.ja.json'))).exams;
const banks=JSON.parse(fs.readFileSync(path.join(root,'src/data/agriculture/mock-exams.ja.json'))).exams;
assert(out&&process.env.AGRICULTURE_QA_CHROMIUM&&process.env.AGRICULTURE_QA_JAPANESE_FONT);
assert(Array.isArray(banks));
fs.mkdirSync(out,{recursive:true});fs.copyFileSync(process.env.AGRICULTURE_QA_JAPANESE_FONT,path.join(out,'japanese.otf'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

const guardedInputPaths=['src/data/agriculture/index.ts','src/data/agriculture/lessons.ja.json','src/data/agriculture/course-manifest.json','src/data/agriculture/weekly-checks.ja.json','src/data/agriculture/mock-exams.ja.json','src/data/agriculture/translations.ts','src/components/agriculture/AgricultureCourse.tsx','src/components/agriculture/RecognitionImages.tsx','src/components/agriculture/ConceptDiagrams.tsx','src/services/agriculture-study-state.ts','src/services/kensetsu-test-state.ts','src/components/tokutei/StudyAppearance.tsx',...Object.keys(require('./translation-fixture.cjs')().locales).map(l=>'src/data/agriculture/translations/'+l+'.json')];
const guardedInputSha256=Object.fromEntries(guardedInputPaths.map(p=>[p,sha(path.join(root,p))]));
const adapters={safe:'export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});',backdrop:'export const useBackdropOcclusion=()=>{};',storage:`export default {getItem:async k=>{if(window.__failRead)throw Error('read');return localStorage.getItem(k)},setItem:async(k,v)=>{if(window.__failWrite)throw Error('write');localStorage.setItem(k,v)}};`,royal:`import React from 'react';import {View,Pressable,Text} from 'react-native';export const ROYAL_LAYOUT={screenGutter:12,backSafeTop:8},ROYAL_FONT={};export const RoyalBackButton=({onPress})=><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onPress}><Text>Back</Text></Pressable>;export const RoyalContentPanel=({children,style})=><View style={style}>{children}</View>;export const RoyalExplanationPanel=RoyalContentPanel;export default ({children})=><View style={{flex:1,backgroundColor:'#eee6d6'}}>{children}</View>;`};
(async()=>{
 await esbuild.build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {AgricultureCourse} from './src/components/agriculture/AgricultureCourse';createRoot(document.getElementById('root')).render(<AgricultureCourse learner="agri20261027" language="ja" onBack={()=>{}}/>);`,resolveDir:root,loader:'tsx'},outfile:path.join(out,'entry.js'),bundle:true,platform:'browser',jsx:'automatic',nodePaths:[process.env.AGRICULTURE_QA_NODE_MODULES],define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},plugins:[{name:'explicit-test-adapters',setup(b){
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
 fs.writeFileSync(path.join(out,'index.html'),'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:AgricultureQA;src:url(/japanese.otf)}*{font-family:AgricultureQA,sans-serif!important;box-sizing:border-box}html,body,#root{height:100%;margin:0}#root{display:flex;flex-direction:column}</style><div id="root"></div><script src="/entry.js"></script>');
 const server=http.createServer((q,r)=>{const f=q.url==='/entry.js'?'entry.js':q.url==='/japanese.otf'?'japanese.otf':'index.html';r.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.otf')?'font/otf':'text/html; charset=utf-8');r.end(fs.readFileSync(path.join(out,f)));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const errors=[],screenshots=[],responsiveCases=[];let questionCases=0,resumeCases=0,retryCases=0;
 try{
  let executablePath=process.env.AGRICULTURE_QA_CHROMIUM,launchArgs=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'];
  if(process.env.AGRICULTURE_QA_SPARTICUZ==='1'){const c=require('@sparticuz/chromium').default??require('@sparticuz/chromium');executablePath=await c.executablePath();launchArgs=c.args;}
  browser=await chromium.launch({executablePath,headless:true,args:launchArgs});
  const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));
  const url=`http://127.0.0.1:${server.address().port}/`;
  async function open(exam,mode='day'){
   await page.goto(url);await page.evaluate(m=>localStorage.setItem('@japan_app_tokutei_reading_appearance_v1',m),mode);await page.reload();
   await page.evaluate(async()=>{await document.fonts.load('16px AgricultureQA');await document.fonts.ready;});
   await page.getByRole('button',{name:'特定技能'+exam.levels[0]+'号',exact:true}).click();await page.getByRole('button',{name:'総合練習',exact:true}).click();
   await page.getByRole('button',{name:'開く・再開',exact:true}).nth(banks.filter(e=>e.levels.includes(exam.levels[0])).findIndex(e=>e.id===exam.id)).click();
   await page.getByRole('button',{name:/^(提出する|もう一度解く)$/}).waitFor();
  }
  async function reachable(locator,height){await locator.scrollIntoViewIfNeeded();const box=await locator.boundingBox();assert(box&&box.y>=-1&&box.y+box.height<=height+1);}
  for(const exam of banks){
   await open(exam);const key='@japan_app_agriculture:exam:v1:agri20261027:'+exam.levels[0]+':'+exam.id;
   for(const [i,q]of exam.questions.entries()){
    const body=await page.locator('body').innerText();assert(body.includes(q.stemJa)&&q.optionsJa.every(v=>body.includes(v)),q.id);assert(!body.includes('正解：'));assert(!body.includes(q.optionReasonsJa[q.correctIndex]));
    const answer=page.getByRole('button').filter({hasText:new RegExp('^'+(q.correctIndex+1)+'\\. ')}).first();await answer.click();
    await page.waitForFunction(({key,i,answer})=>JSON.parse(localStorage.getItem(key)||'null')?.answers[i]===answer,{key,i,answer:q.correctIndex});
    if(i===0){await open(exam);assert((await page.locator('body').innerText()).includes('1 / '+exam.questions.length));assert.equal(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).answers[0],key),q.correctIndex);resumeCases++;}
    if(i<exam.questions.length-1)await page.getByRole('button',{name:'次へ',exact:true}).click();questionCases++;
   }
   await page.getByRole('button',{name:'提出する',exact:true}).click();await page.getByRole('button',{name:'キャンセル',exact:true}).click();assert(!(await page.locator('body').innerText()).includes('正解：'));
   await page.getByRole('button',{name:'提出する',exact:true}).click();await page.getByRole('button',{name:'確定',exact:true}).click();await page.getByRole('button',{name:'もう一度解く',exact:true}).waitFor();
   assert((await page.locator('body').innerText()).includes('正解 '+exam.questions.length+' / '+exam.questions.length));
   for(let back=0;back<exam.questions.length-1;back++)await page.getByRole('button',{name:'前へ',exact:true}).click();
   const first=exam.questions[0],review=await page.locator('body').innerText();assert(first.optionReasonsJa.every(v=>review.includes(v)));
   await page.getByRole('button',{name:'Back',exact:true}).click();assert((await page.locator('body').innerText()).includes(exam.questions.length+'問 · ✓ 完了'));
   // Restart only this bank, then check the new first question at all viewports in both palettes.
   await open(exam);await page.getByRole('button',{name:'もう一度解く',exact:true}).click();await page.getByRole('button',{name:'確定',exact:true}).click();
   for(const mode of ['day','night'])for(const [width,height]of [[390,844],[844,390],[768,1024],[1440,900]]){
    await page.setViewportSize({width,height});await open(exam,mode);
    assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
    for(let n=1;n<=4;n++)await reachable(page.getByRole('button').filter({hasText:new RegExp('^'+n+'\\. ')}).first(),height);
    await reachable(page.getByRole('button',{name:'提出する',exact:true}),height);
    const file=exam.id+'-'+mode+'-'+width+'x'+height+'.png';await page.screenshot({path:path.join(out,file)});screenshots.push(file);responsiveCases.push({examId:exam.id,mode,width,height});
   }
   await page.setViewportSize({width:390,height:844});await open(exam);
   await page.evaluate(()=>window.__failWrite=true);await page.getByRole('button').filter({hasText:/^1\. /}).first().click();await page.getByRole('alert').waitFor();
   await page.evaluate(()=>window.__failWrite=false);await page.getByRole('button',{name:'保存を再試行',exact:true}).click();await page.waitForFunction(k=>JSON.parse(localStorage.getItem(k)||'null')?.answers[0]===0,key);retryCases++;
  }
  // Empty levels must not expose fake forms.
  let emptyLevelCases=0;for(const level of ['1','2'])if(!banks.some(e=>e.levels.includes(level))){await page.goto(url);await page.getByRole('button',{name:'特定技能'+level+'号',exact:true}).click();await page.getByRole('button',{name:'総合練習',exact:true}).click();assert((await page.locator('body').innerText()).includes('この区分の総合練習は準備中です。'));assert.equal(await page.getByRole('button',{name:'開く・再開',exact:true}).count(),0);emptyLevelCases++;}
  // Existing banks retain their independent IDs/revisions and remain answerable.
  await page.goto(url);await page.getByRole('button',{name:'特定技能1号',exact:true}).click();await page.getByRole('button',{name:'週の確認',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'開く・再開',exact:true}).count(),all.filter(e=>e.levels.includes('1')).length);
  await page.getByRole('button',{name:'開く・再開',exact:true}).first().click();assert((await page.locator('body').innerText()).includes(all.find(e=>e.levels.includes('1')).questions[0].stemJa));
  assert.deepEqual(errors,[]);
  for(const [p,digest]of Object.entries(guardedInputSha256))assert.equal(sha(path.join(root,p)),digest,'Input changed during QA '+p);
  const report={guardedInputSha256,inputsUnchangedDuringRun:true,status:'PASS',emptyLevelCases,newBanks:banks.length,newQuestionCases:questionCases,resumeCases,saveFailureRetryCases:retryCases,responsiveCases:responsiveCases.length,reachableFourOptions:banks.length>0,answersHiddenBeforeSubmit:banks.length>0,cancelSubmit:banks.length>0,fullMarksAfterCorrectAnswers:banks.length>0,individualReasonsAfterSubmit:banks.length>0,restartAndCompletionBadge:banks.length>0,existingLevel1BankAccessible:true,screenshots,inputSha256:{'src/data/agriculture/mock-exams.ja.json':sha(path.join(root,'src/data/agriculture/mock-exams.ja.json')),'src/components/agriculture/AgricultureCourse.tsx':sha(path.join(root,'src/components/agriculture/AgricultureCourse.tsx'))},adapters:['Royal artwork','safe area','background','localStorage storage','placeholder artwork'],nativeDeviceTested:false,productionExpoTested:false,nativeFontsCertified:false};
  fs.writeFileSync(path.join(root,'docs/ssw-workspace/agriculture/session-20261027/browser-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({...report,screenshots:screenshots.length}));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
