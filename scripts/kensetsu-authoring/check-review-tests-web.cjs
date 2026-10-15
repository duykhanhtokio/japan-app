const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const root=process.cwd(),deps=process.env.KENSETSU_QA_NODE_MODULES,out=process.env.KENSETSU_QA_OUTPUT;
if(!deps||!out)throw Error('Set KENSETSU_QA_NODE_MODULES and KENSETSU_QA_OUTPUT');
const esbuild=require(path.join(deps,'esbuild'));
const {chromium}=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'));
const bank=JSON.parse(fs.readFileSync('src/data/kensetsu/review-tests.ja.json','utf8'));
fs.mkdirSync(out,{recursive:true});
fs.copyFileSync('docs/ssw-workspace/kensetsu/shared-session-001.json',path.join(out,'source.json'));
fs.writeFileSync(path.join(out,'entry.tsx'),`import React from 'react';import {createRoot} from 'react-dom/client';import {KensetsuReviewTests} from ${JSON.stringify(root+'/src/components/kensetsu/KensetsuReviewTests')};import source from './source.json';const params=new URLSearchParams(location.search);createRoot(document.getElementById('root')).render(<KensetsuReviewTests learner={params.get('learner')||'exam-qa'} level={params.get('level')||'1'} field={params.get('field')||'building'} getSourceLesson={id=>id===source.id?source:undefined} onBack={()=>{window.__left=true;}}/>);`);
const adapters={
safe:'export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});',
storage:`const wait=()=>new Promise(r=>setTimeout(r,window.__readDelay||0));export default {getItem:async k=>{await wait();if(window.__failRead)throw Error('read failure');return localStorage.getItem(k);},setItem:async(k,v)=>{window.__writeCalls=(window.__writeCalls||0)+1;if(window.__failSave)throw Error('save failure');localStorage.setItem(k,v);}};`,
royal:`import React from 'react';import {View,Pressable,Text} from 'react-native';export const ROYAL_FONT={heading:undefined,body:undefined};export function RoyalBackButton({onPress}){return <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onPress}><Text>Back</Text></Pressable>};export const RoyalContentPanel=({children,style})=><View style={style}>{children}</View>;export const RoyalExplanationPanel=RoyalContentPanel;export default ({children})=><View style={{flex:1,backgroundColor:'#d5dce4'}}>{children}</View>;`
};
(async()=>{
 await esbuild.build({entryPoints:[path.join(out,'entry.tsx')],outfile:path.join(out,'entry.js'),bundle:true,platform:'browser',format:'iife',jsx:'automatic',nodePaths:[deps],define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},plugins:[{name:'qa',setup(b){
 b.onResolve({filter:/^(react|react-dom)(\/.*)?$/},a=>({path:require.resolve(a.path,{paths:[deps]})}));
 b.onResolve({filter:/^react-native$/},()=>({path:path.join(deps,'react-native-web/dist/index.js')}));
 b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'adapter'}));
 b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'adapter'}));
 b.onResolve({filter:/RoyalPageBackground|RoyalPanels|RoyalSurface/},()=>({path:'royal',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},a=>({contents:adapters[a.path],loader:'jsx',resolveDir:out}));
 b.onResolve({filter:/^@\//},a=>{const base=path.join(root,'src',a.path.slice(2));const ext=['.tsx','.ts','.json'].find(e=>fs.existsSync(base+e));return {path:ext?base+ext:base+'/index.ts'};});
 }}]});
 const font=fs.readFileSync(process.env.KENSETSU_QA_FONT);assert(!font.subarray(0,80).toString().startsWith('version https://git-lfs'));
 fs.writeFileSync(path.join(out,'font.ttf'),font);
 fs.writeFileSync(path.join(out,'index.html'),'<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:ExamQA;src:url(/font.ttf)}*{font-family:ExamQA,sans-serif!important}html,body,#root{margin:0;height:100%}#root{display:flex;flex-direction:column}</style><div id="root"></div><script src="/entry.js"></script>');
 const server=http.createServer((q,r)=>{const file=q.url.startsWith('/entry.js')?'entry.js':q.url.startsWith('/font.ttf')?'font.ttf':'index.html';r.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.ttf')?'font/ttf':'text/html');r.end(fs.readFileSync(path.join(out,file)));}).listen(0,'127.0.0.1');await new Promise(resolve=>server.on('listening',resolve));
 const browser=await chromium.launch({executablePath:process.env.KENSETSU_QA_CHROMIUM,args:['--no-sandbox','--disable-gpu',...JSON.parse(process.env.KENSETSU_QA_CHROMIUM_ARGS||'[]')]});
 const page=await browser.newPage({viewport:{width:430,height:932}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url='http://127.0.0.1:'+server.address().port;
 const id=s=>page.getByTestId('kensetsu-test-'+s);
 const open=async(n)=>{await id('exam-'+String(n).padStart(2,'0')).click();await id('question').waitFor();};
 const saved=async()=>{await page.waitForFunction(()=>{const el=document.querySelector('[data-testid="kensetsu-test-save-status"]');return el&&!el.textContent.includes('保存中');});};
 const back=async()=>{await saved();await page.getByRole('button',{name:'Back',exact:true}).click();await id('catalog').waitFor();};
 const move=async(n)=>{await id('navigator-'+n).click();await page.waitForFunction(n=>document.querySelector('[data-testid="kensetsu-test-question-position"]')?.textContent.startsWith('問題 '+n+'/'),n);};
 await page.goto(url);assert.equal(await page.locator('[data-testid^="kensetsu-test-exam-"]').count(),10);
 const totals=[];let verified=0;
 for(let en=1;en<=10;en++){
  const exam=bank.exams[en-1];await open(en);assert.equal(await id('explanation').count(),0);assert.equal(await id('result').count(),0);
  const answers=exam.questions.map((q,i)=>en===1?q.correctIndex:en===2?(i<10?(q.correctIndex+1)%4:null):en%2===0?(i%3===0?q.correctIndex:null):null);
  for(let qi=0;qi<40;qi++){
   if(qi)await move(qi+1);
   const q=exam.questions[qi];assert((await id('question').innerText()).includes(q.promptJa));
   for(let ci=0;ci<4;ci++)assert((await id('choice-'+(ci+1)).innerText()).endsWith(q.choicesJa[ci]));
   assert.equal(await id('explanation').count(),0);
   if(answers[qi]!==null)await id('choice-'+(answers[qi]+1)).click();verified++;
  }
  await saved();await id('submit').click();await id('confirm-cancel').click();assert.equal(await id('result').count(),0);
  await id('submit').click();await id('confirm-submit').click();await id('result').waitFor();await saved();
  const correct=answers.filter((a,i)=>a!==null&&a===exam.questions[i].correctIndex).length,wrong=answers.filter((a,i)=>a!==null&&a!==exam.questions[i].correctIndex).length,blank=answers.filter(a=>a===null).length;
  const text=await id('result').innerText();assert(text.includes(correct+'/40'));assert(text.includes('正答 '+correct+' · 誤答 '+wrong+' · 未解答 '+blank));
  assert(await id('choice-1').isDisabled());assert.equal(await id('explanation').count(),1);
  await page.reload();await open(en);assert((await id('question-position').innerText()).startsWith('問題 40/'));assert.equal(await id('result').count(),1);
  totals.push({examId:exam.id,correct,wrong,unanswered:blank});await back();
 }
 // Exact position/answer persistence, restart confirmation, source access and scoped attempts.
 await open(1);await move(1);await id('source-1').click();await id('source-lesson').waitFor();assert((await id('source-lesson').innerText()).includes('第')||(await id('source-lesson').innerText()).length>100);await id('source-close').click();await id('source-lesson').waitFor({state:'hidden'});
 const screens=[];
 for(const [w,h,name] of [[320,568,'phone'],[768,1024,'tablet'],[932,430,'landscape']]){
  await page.setViewportSize({width:w,height:h});await page.evaluate(()=>document.fonts.ready);await id('content').evaluate(e=>e.scrollTop=0);await page.screenshot({path:path.join(out,name+'.png')});assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));screens.push({width:w,height:h});
 }
 await id('restart').click();await id('confirm-cancel').click();assert.equal(await id('result').count(),1);
 await id('restart').click();await id('confirm-restart').click();await saved();assert.equal(await id('result').count(),0);
 await move(17);await id('choice-2').click();await saved();await page.reload();await open(1);assert((await id('question-position').innerText()).startsWith('問題 17/'));assert.equal(await id('choice-2').getAttribute('aria-checked'),'true');
 const original=await page.evaluate(()=>JSON.stringify({...localStorage}));
 for(const suffix of ['?learner=another','?level=2','?field=civil']){
  await page.goto(url+suffix);await open(1);assert((await id('question-position').innerText()).startsWith('問題 1/'));assert.equal(await id('choice-2').getAttribute('aria-checked'),'false');
 }
 assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),original);
 // Read failures and corrupt saved data must not be overwritten.
 await page.goto(url+'?learner=read-failure');await page.evaluate(()=>window.__failRead=true);await id('exam-01').click();await id('load-error').waitFor();assert.equal(await page.evaluate(()=>window.__writeCalls||0),0);await page.evaluate(()=>window.__failRead=false);await id('retry-load').click();await id('question').waitFor();
 await page.goto(url+'?learner=corrupt');const corruptKey='@japan_app_kensetsu_review:v2:corrupt:1:building:kensetsu-review-v2-01';await page.evaluate(k=>localStorage.setItem(k,'{bad'),corruptKey);await id('exam-01').click();await id('load-error').waitFor();assert.equal(await page.evaluate(k=>localStorage.getItem(k),corruptKey),'{bad');await id('recover').click();await id('confirm-restart').click();await id('question').waitFor();await saved();
 // Failed writes retain current answers; explicit retry persists them.
 await page.evaluate(()=>window.__failSave=true);await id('choice-3').click();await id('retry-save').waitFor();assert.equal(await id('choice-3').getAttribute('aria-checked'),'true');assert(await id('submit').isDisabled());await page.evaluate(()=>window.__failSave=false);await id('retry-save').click();await saved();await page.reload();await open(1);assert.equal(await id('choice-3').getAttribute('aria-checked'),'true');
 assert.deepEqual(errors,[]);
 const report={status:'PASS_ACTUAL_WEB_ADAPTED_TEST_RUNNER',examCount:10,verifiedQuestions:verified,choiceTextsChecked:verified*4,answersHiddenUntilSubmit:true,allTenSubmissionAndReloadGrades:totals,unansweredConfirmationAndCancel:true,submittedChoicesLocked:true,sourceLessonModal:true,explicitRestartAndCancel:true,exactQuestionAndAnswerResume:true,learnerLevelFieldIsolation:true,readErrorWithoutOverwrite:true,corruptAttemptExplicitRecovery:true,writeFailureRetainedAndRetry:true,viewportOverflowChecks:screens,fontSha256:require('crypto').createHash('sha256').update(font).digest('hex'),runtimeErrors:errors,limits:['Royal decorations and AsyncStorage/safearea adapted for web; not native device validation.','Browser interaction verifies rendering and grading, not expert correctness of teaching claims.'],humanDomainReviewed:false,nativeDeviceTested:false,releaseReady:false};
 fs.writeFileSync('docs/ssw-workspace/kensetsu/exams/ten-by-forty/web-qa.json',JSON.stringify(report,null,2)+'\n');console.log('PASS: actual adapted runner 10tests/400questions/1600choices; submit/review/grade/resume/isolation/read-write failures/3viewports');
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1);});
