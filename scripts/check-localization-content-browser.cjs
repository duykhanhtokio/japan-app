// Real Chromium + RN Web. Artwork, safe area and AsyncStorage have explicit adapters.
// No native-device, professional-content or rights approval is implied by this check.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const assert = require('node:assert/strict'), crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const modules = process.env.TOKUTEI_QA_MODULES;
const webModules = process.env.KENSETSU_WEB_MODULES;
const executablePath = process.env.KENSETSU_QA_CHROMIUM;
const out = process.env.KENSETSU_QA_OUTPUT;
const visualOnly = process.env.KENSETSU_BROWSER_VISUAL_ONLY === '1';
const inlineOnly = process.env.KENSETSU_BROWSER_INLINE_REUSE_ONLY === '1';
const twoGoOnly = process.env.KENSETSU_BROWSER_TWO_GO_ONLY === '1';
const foremanImagesOnly = process.env.KENSETSU_BROWSER_FOREMAN_IMAGES_ONLY === '1';
const foremanOnly = process.env.KENSETSU_BROWSER_FOREMAN_ONLY === '1';
const readerOnly = process.env.KENSETSU_BROWSER_READER_ONLY === '1';
const captureParagraphIds = (process.env.KENSETSU_BROWSER_CAPTURE_PARAGRAPH_IDS || '').split(',').filter(Boolean);
for (const [key, value] of Object.entries({modules, webModules, executablePath, out}))
  if (!value) throw Error('Missing QA input: ' + key);
const esbuild = require(require.resolve('esbuild', {paths: [modules]}));
const {chromium} = require(require.resolve('playwright', {paths: [process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
fs.mkdirSync(out, {recursive: true});
const adapters = {
  safe: 'export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});',
  storage: `export default {getItem:async k=>{if(window.__failRead)throw Error('read failure');return localStorage.getItem(k)},setItem:async(k,v)=>{if(window.__failSave)throw Error('save failure');localStorage.setItem(k,v)}};`,
  royal: `import React from 'react';import {View,Pressable,Text} from 'react-native';export const ROYAL_FONT={body:undefined,heading:undefined},ROYAL_LAYOUT={screenGutter:12,backSafeTop:8};export const RoyalBackButton=({onPress})=><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onPress}><Text>Back</Text></Pressable>;export const RoyalContentPanel=({children,style})=><View style={style}>{children}</View>;export const RoyalExplanationPanel=RoyalContentPanel;export default ({children})=><View style={{flex:1,backgroundColor:'#eee6d6'}}>{children}</View>;`,
};
async function build() {
  const fontDir=path.join(webModules,'@fontsource/noto-sans-jp');
  fs.copyFileSync(path.join(fontDir,'files/noto-sans-jp-japanese-400-normal.woff2'),path.join(out,'font.woff2'));
  const entry = `import React from 'react';import {createRoot} from 'react-dom/client';import {KensetsuReviewTests} from ${JSON.stringify(path.join(root,'src/components/kensetsu/KensetsuReviewTests'))};import {KensetsuCourse} from ${JSON.stringify(path.join(root,'src/components/kensetsu/KensetsuCourse'))};import {reviewTestsForScope} from ${JSON.stringify(path.join(root,'src/data/kensetsu/review-tests'))};import paragraphPolicy from ${JSON.stringify(path.join(root,'src/data/kensetsu/paragraph-reuse-policy.json'))};import {sessionsForScope,sessionForScope} from ${JSON.stringify(path.join(root,'src/data/kensetsu/scope'))};import {sessionById,completionKey,completionId} from ${JSON.stringify(path.join(root,'src/data/kensetsu'))};const p=new URLSearchParams(location.search);const field=p.get('field')||'utilities',subject=p.get('subject')||'theory',level=p.get('level')||'1',learner=p.get('learner')||'browser-final';window.__forms=reviewTestsForScope(level,field,subject);window.__lesson=id=>sessionById.get(id);window.__completionKey=completionKey;window.__completionId=completionId;window.__scopeLesson=(id,level,field)=>sessionForScope(id,level,field,'practical');window.__inlineCases=paragraphPolicy.supplements.flatMap(spec=>spec.fields.map(field=>({...spec,field})));window.__readerCases=['utilities','building','civil'].flatMap(field=>sessionsForScope('1',field,'practical').filter(s=>/^kensetsu-(building|civil)-practical-session-/.test(s.id)||['175','365','366','263','275','291','294','295','296','299','303','307','308','312','337'].some(n=>s.id==='kensetsu-common-session-'+n)).map(s=>({field,sessionId:s.id,n:Number(s.id.split('-').pop())}))); createRoot(document.getElementById('root')).render(p.get('reader')==='1'?<KensetsuCourse learner={learner} language={p.get('language')||'vi'} onBack={()=>{window.__left=true}}/>:<KensetsuReviewTests learner={learner} field={field} subject={subject} level={level} getSourceLesson={id=>sessionForScope(id,level,field,subject)??sessionForScope(id,level,field,"theory")} onBack={()=>{window.__left=true}}/>);`;
  await esbuild.build({stdin:{contents:entry,resolveDir:root,loader:'tsx'},outfile:path.join(out,'entry.js'),bundle:true,platform:'browser',format:'iife',jsx:'automatic',nodePaths:[webModules,modules],define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},logLevel:'error',plugins:[{name:'qa-web',setup(b){
    b.onResolve({filter:/^(react|react-dom)(\/.*)?$/},a=>({path:require.resolve(a.path,{paths:[webModules]})}));
    b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web',{paths:[webModules]})}));
    b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'adapter'}));
    b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'adapter'}));
    b.onResolve({filter:/RoyalPageBackground|RoyalPanels|RoyalSurface/},()=>({path:'royal',namespace:'adapter'}));
    b.onLoad({filter:/.*/,namespace:'adapter'},a=>({contents:adapters[a.path],loader:'jsx',resolveDir:root}));
    b.onResolve({filter:/\.(png|webp|jpe?g)$/},()=>({path:'image',namespace:'asset'}));
    b.onLoad({filter:/.*/,namespace:'asset'},()=>({contents:'export default "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";',loader:'js'}));
    b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2));for(const ext of ['.tsx','.ts','.json','/index.ts'])if(fs.existsSync(p+ext))return {path:p+ext};throw Error(p)});
  }}]});
  fs.writeFileSync(path.join(out,'index.html'),'<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:ExamQA;src:url(/font.woff2)}html,body,#root{height:100%;margin:0}#root{display:flex;flex-direction:column}*{box-sizing:border-box;font-family:ExamQA,sans-serif!important}</style><div id="root"></div><script src="/entry.js"></script></html>');
}
async function main() {
  await build();
  const server=http.createServer((q,r)=>{const file=q.url==='/entry.js'?'entry.js':q.url==='/font.woff2'?'font.woff2':'index.html';r.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.woff2')?'font/woff2':'text/html; charset=utf-8');r.end(fs.readFileSync(path.join(out,file)))});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser=await chromium.launch({executablePath,args:['--no-sandbox','--disable-gpu'],headless:true});
    const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const base='http://127.0.0.1:'+server.address().port;
    const id=s=>page.getByTestId('kensetsu-test-'+s);
    const saved=()=>page.waitForFunction(()=>{const n=document.querySelector('[data-testid="kensetsu-test-save-status"]');return n&&!n.textContent.includes('保存中')});
    const open=async n=>{await id('exam-'+String(n).padStart(2,'0')).click();await id('question').waitFor()};
    const back=async()=>{await saved();await page.getByRole('button',{name:'Back',exact:true}).click();await id('catalog').waitFor()};

    await page.goto(base+'/?level=1&field=building&subject=theory&learner=dedup-locale-qa');
    await open(1);assert.equal(await page.locator('[data-testid^="kensetsu-test-source-"]').count(),0);
    await id('submit').click();await id('confirm-submit').click();await id('result').waitFor();
    const questions=await page.evaluate(()=>window.__forms[0].questions);let linkChecks=0,removed=0;
    for(let i=0;i<questions.length;i++){
      if(i){await saved();await id('next').click();await page.waitForFunction(n=>document.querySelector('[data-testid="kensetsu-test-question-position"]')?.textContent.startsWith('問題 '+n+'/'),i+1);}
      const expected=await page.evaluate(i=>{const refs=window.__forms[0].questions[i].sourceReferences,seen=new Set();let count=0;for(const r of refs){const lesson=window.__lesson(r.sessionId);if(!lesson)continue;const body=JSON.stringify(lesson.clusters.flatMap(c=>c.paragraphs.map(p=>p.ja.normalize('NFKC').replace(/\s+/g,' ').trim())));if(!seen.has(body)){seen.add(body);count++;}}return count;},i);
      assert.equal(await page.locator('[data-testid^="kensetsu-test-source-"]').count(),expected);removed+=questions[i].sourceReferences.length-expected;linkChecks++;
    }
    await id('source-1').click();await id('source-lesson').waitFor();assert((await id('source-lesson').innerText()).length>100);await id('source-close').click();
    let paragraphChecks=0,readerLocales=0;
    for(const language of ['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){
     await page.goto(base+'/?reader=1&language='+language+'&learner=locale-reader-'+language);
     await page.getByTestId('kensetsu-level-2').click();await page.getByTestId('kensetsu-field-building').click();await page.getByTestId('kensetsu-mode-foreman-study').click();await page.getByTestId('kensetsu-week-1').click();await page.getByTestId('kensetsu-day-4').click();
     const reader=page.getByTestId('kensetsu-reader');await reader.waitFor();const lesson=await page.evaluate(()=>window.__lesson('kensetsu-foreman-session-004'));
     await page.getByTestId('kensetsu-translation').click();const text=await reader.innerText();
     for(const c of lesson.clusters){for(const p of c.paragraphs){assert(text.includes(p.ja));if(language!=='ja'){assert.equal(await page.getByTestId('kensetsu-translation-'+p.id).innerText(),p.translations[language]);paragraphChecks++;}else assert.equal(await page.getByTestId('kensetsu-translation-'+p.id).count(),0);}if(language!=='ja')assert(text.includes(c.applicationPromptTranslations[language]));}
     readerLocales++;
    }
    assert.deepEqual(errors,[]);const report={status:'PASS_ADAPTED_CHROMIUM',readerLocales,paragraphChecks,reviewQuestions:linkChecks,duplicateVisibleLinksRemoved:removed,sourceModalOpens:true,unsubmittedSourceLinksHidden:true,runtimeErrors:errors,artworkAndNativeApisAdapted:true,nativeDeviceTested:false,semanticCrossReview:false};
    fs.writeFileSync(path.join(root,'docs/localization-workspace/content-browser-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1});
