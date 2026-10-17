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
const readerOnly = process.env.KENSETSU_BROWSER_READER_ONLY === '1';
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
  const entry = `import React from 'react';import {createRoot} from 'react-dom/client';import {KensetsuReviewTests} from ${JSON.stringify(path.join(root,'src/components/kensetsu/KensetsuReviewTests'))};import {KensetsuCourse} from ${JSON.stringify(path.join(root,'src/components/kensetsu/KensetsuCourse'))};import {reviewTestsForScope} from ${JSON.stringify(path.join(root,'src/data/kensetsu/review-tests'))};import {sessionById,completionKey} from ${JSON.stringify(path.join(root,'src/data/kensetsu'))};const p=new URLSearchParams(location.search);const field=p.get('field')||'utilities',subject=p.get('subject')||'theory',level=p.get('level')||'1',learner=p.get('learner')||'browser-final';window.__forms=reviewTestsForScope(level,field,subject);window.__lesson=id=>sessionById.get(id);window.__completionKey=completionKey;createRoot(document.getElementById('root')).render(p.get('reader')==='1'?<KensetsuCourse learner={learner} language={p.get('language')||'vi'} onBack={()=>{window.__left=true}}/>:<KensetsuReviewTests learner={learner} field={field} subject={subject} level={level} getSourceLesson={id=>sessionById.get(id)} onBack={()=>{window.__left=true}}/>);`;
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
    if(readerOnly){
      const cases=[];let japaneseParagraphs=0,translatedParagraphs=0,revisionUpgradeCases=0;
      for(const field of ['building','civil'])for(const n of (field==='building'?[7,35,36,37,38,40,41,42,43,44,45,46,47,48]:[7,35,36,37,38,40,41,42,43,44,45,14])){
        const sessionId='kensetsu-'+(field==='civil'&&n===14?'civil':'building')+'-practical-session-'+String(n).padStart(3,'0');
        const learner='merged-reader-'+field+'-'+n;
        await page.goto(base+'/?reader=1&language=vi&learner='+learner);
        await page.getByTestId('kensetsu-field-'+field).waitFor();
        const lesson=await page.evaluate(id=>window.__lesson(id),sessionId);assert(lesson);
        const key=await page.evaluate(({learner,field})=>window.__completionKey(learner,'1',field),{learner,field});
        await page.evaluate(({key,sessionId,revision})=>{localStorage.setItem(key+':navigation:practical:v2',JSON.stringify({week:0,lastId:sessionId,view:'days',offset:0}));if(revision===2)localStorage.setItem(key,JSON.stringify({[sessionId+':r1']:true}))},{key,sessionId,revision:lesson.revision});
        await page.getByTestId('kensetsu-field-'+field).click();await page.getByTestId('kensetsu-mode-practical-study').click();await page.getByTestId('kensetsu-day-'+n).click();
        const reader=page.getByTestId('kensetsu-reader');await reader.waitFor();const text=await reader.innerText();
        for(const cluster of lesson.clusters)for(const paragraph of cluster.paragraphs){assert(text.includes(paragraph.ja),paragraph.id);japaneseParagraphs++}
        await page.getByTestId('kensetsu-translation').click();
        for(const cluster of lesson.clusters)for(const paragraph of cluster.paragraphs){const actual=await page.getByTestId('kensetsu-translation-'+paragraph.id).innerText();assert.equal(actual,paragraph.translations.vi);translatedParagraphs++}
        const complete=page.getByTestId('kensetsu-complete');
        if(lesson.revision===2){assert(!(await complete.innerText()).includes('学習済み'));revisionUpgradeCases++}
        await reader.evaluate(e=>{e.scrollTop=e.scrollHeight;e.dispatchEvent(new Event('scroll',{bubbles:true}))});
        await page.waitForFunction(()=>document.querySelector('[data-testid="kensetsu-complete"]')?.getAttribute('aria-disabled')!=='true');
        await complete.click();
        await page.waitForFunction(({key,id})=>JSON.parse(localStorage.getItem(key)||'{}')[id]===true,{key,id:sessionId+':r'+lesson.revision});
        const progress=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
        if(lesson.revision===2)assert(progress[sessionId+':r1']);
        cases.push({field,sessionId,revision:lesson.revision,japaneseAndVietnameseRendered:true,completionSaved:true,priorR1Preserved:lesson.revision===2});
        console.log('PASS merged reader '+field+'/'+n+' r'+lesson.revision);
      }
      assert.deepEqual(errors,[]);
      const report={date:'2026-10-17',status:'PASS_REAL_CHROMIUM_MERGED_READERS_AND_REVISION_PROGRESS',browserVersion:await browser.version(),readerCases:cases.length,japaneseParagraphs,translatedParagraphs,revisionUpgradeCases,cases,runtimeErrors:errors,bundleSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(out,'entry.js'))).digest('hex'),limits:['Actual KensetsuCourse reader with RN Web; Royal artwork/safe-area/storage/image data have explicit fixture adapters.','Japanese and Vietnamese DOM rendering checked here; all12locales are separately checked by the host suite.','No production Expo/native-device, professional or human-native approval.'],nativeDeviceTested:false,domainReviewed:false,nativeReviewed:false,releaseReady:false};
      fs.writeFileSync(path.join(root,'docs/ssw-workspace/kensetsu/ONE_GO_MERGED_READER_BROWSER_QA_2026-10-17.json'),JSON.stringify(report,null,2)+'\n');
      console.log('PASS merged readers: '+cases.length+' routes, '+japaneseParagraphs+' Japanese/'+translatedParagraphs+' Vietnamese paragraphs, '+revisionUpgradeCases+' revision upgrades');return;
    }
    const cases=[],screenshots=[];
    let choiceLabels=0,resumes=0;
    for(const field of ['utilities','building','civil'])for(const subject of ['theory','practical']) {
      const url=base+'/?field='+field+'&subject='+subject;
      await page.goto(url);await id('catalog').waitFor();
      const forms=await page.evaluate(()=>window.__forms);assert.equal(forms.length,10);
      assert.equal(await page.locator('[data-testid^="kensetsu-test-exam-"]').count(),10);
      if(visualOnly){
        await open(1);
        for(const [width,height,label] of [[320,568,'phone'],[768,1024,'tablet'],[932,430,'landscape']]){
          await page.setViewportSize({width,height});
          await page.evaluate(async()=>{await document.fonts.ready;window.scrollTo(0,0);document.querySelector('[data-testid="kensetsu-test-content"]').scrollTop=0});
          assert(await page.evaluate(()=>document.fonts.check('17px ExamQA','建設')));
          assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
          for(const control of ['next','previous','submit','restart']){const b=await id(control).boundingBox();assert(b&&b.x>=-1&&b.x+b.width<=width+1&&b.y>=-1&&b.y+b.height<=height+1,control+' clipped');assert(b.height>=44)}
          const name=field+'-'+subject+'-'+label+'.png';await page.screenshot({path:path.join(out,name)});screenshots.push({field,subject,width,height,file:name,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(out,name))).digest('hex')});
        }
        await page.setViewportSize({width:390,height:844});await back();console.log('PASS visual '+field+'/'+subject);continue;
      }
      for(let en=1;en<=10;en++) {
        const exam=forms[en-1],mode=en%3===1?'correct':en%3===2?'wrong':'mixed';
        await open(en);let correct=0,wrong=0,unanswered=0;
        for(let qi=0;qi<40;qi++) {
          const q=exam.questions[qi];assert((await id('question').innerText()).includes(q.promptJa));
          assert.equal(await id('explanation').count(),0);
          for(let ci=0;ci<4;ci++){assert((await id('choice-'+(ci+1)).innerText()).endsWith(q.choicesJa[ci]));choiceLabels++}
          const answer=mode==='correct'?q.correctIndex:mode==='wrong'?(q.correctIndex+1)%4:qi%4===0?null:qi%4===1?(q.correctIndex+1)%4:q.correctIndex;
          if(answer===null)unanswered++;else {await id('choice-'+(answer+1)).click();if(answer===q.correctIndex)correct++;else wrong++}
          if(qi===17) {
            await saved();await page.reload();await open(en);
            assert((await id('question-position').innerText()).startsWith('問題 18/'));
            if(answer!==null)assert.equal(await id('choice-'+(answer+1)).getAttribute('aria-checked'),'true');
            resumes++;
          }
          if(qi<39)await id('next').click();
        }
        await saved();await id('submit').click();await id('confirm-cancel').click();assert.equal(await id('result').count(),0);
        await id('submit').click();await id('confirm-submit').click();await id('result').waitFor();await saved();
        let result=await id('result').innerText();assert(result.includes(correct+'/40'));assert(result.includes('正答 '+correct+' · 誤答 '+wrong+' · 未解答 '+unanswered));
        assert.equal(await id('choice-1').getAttribute('aria-disabled'),'true');assert.equal(await id('explanation').count(),1);
        await page.reload();await open(en);result=await id('result').innerText();assert(result.includes(correct+'/40'));
        if(en===1) {
          await id('source-1').click();await id('source-lesson').waitFor();assert((await id('source-lesson').innerText()).length>100);await id('source-close').click();await id('source-lesson').waitFor({state:'hidden'});
          for(const [width,height,label] of [[320,568,'phone'],[768,1024,'tablet'],[932,430,'landscape']]) {
            await page.setViewportSize({width,height});
            await page.evaluate(async()=>{await document.fonts.ready;window.scrollTo(0,0);document.querySelector('[data-testid="kensetsu-test-content"]').scrollTop=0});
            assert(await page.evaluate(()=>document.fonts.check('17px ExamQA','建設')),'Japanese font not loaded');
            assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),'Horizontal overflow');
            for(const control of ['next','previous','restart']) {
              const box=await id(control).boundingBox();assert(box&&box.x>=-1&&box.x+box.width<=width+1&&box.y>=-1&&box.y+box.height<=height+1,control+' clipped');assert(box.height>=44,'Touch target too small');
            }
            const name=field+'-'+subject+'-'+label+'.png';await page.screenshot({path:path.join(out,name)});
            screenshots.push({field,subject,width,height,file:name,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(out,name))).digest('hex')});
          }
          await page.setViewportSize({width:390,height:844});
        }
        cases.push({field,subject,examId:exam.id,mode,correct,wrong,unanswered});
        await back();console.log('PASS '+field+'/'+subject+' form '+en+' '+mode+' '+correct+'/40');
      }
    }
    // Storage failures retain the learner's choices; a retry must persist them.
    await page.goto(base+'/?field=building&subject=practical&learner=save-failure');await open(1);
    await page.evaluate(()=>window.__failSave=true);await id('choice-3').click();await id('retry-save').waitFor();assert.equal(await id('choice-3').getAttribute('aria-checked'),'true');assert.equal(await id('submit').getAttribute('aria-disabled'),'true');
    await page.evaluate(()=>window.__failSave=false);await id('retry-save').click();await saved();await page.reload();await open(1);assert.equal(await id('choice-3').getAttribute('aria-checked'),'true');
    await id('restart').click();await id('confirm-cancel').click();assert.equal(await id('choice-3').getAttribute('aria-checked'),'true');await id('restart').click();await id('confirm-restart').click();await saved();assert.equal(await id('choice-3').getAttribute('aria-checked'),'false');
    await page.goto(base+'/?field=building&subject=practical&learner=read-failure');await id('catalog').waitFor();await page.evaluate(()=>window.__failRead=true);await id('exam-01').click();await id('load-error').waitFor();await page.evaluate(()=>window.__failRead=false);await id('retry-load').click();await id('question').waitFor();
    await page.goto(base+'/?level=2&field=building&subject=practical');await id('catalog').waitFor();assert.equal(await page.locator('[data-testid^="kensetsu-test-exam-"]').count(),0);
    assert.deepEqual(errors,[]);
    const report={date:'2026-10-17',status:'PASS_REAL_CHROMIUM_ADAPTED_WEB_SIX_SCOPES',browserVersion:await browser.version(),scopes:6,fullAttempts:cases.length,questions:cases.length*40,choiceLabels,resumes,postSubmitReloads:cases.length,cancelSubmit:true,sourceLessonModals:6,saveFailureRetainsChoices:true,readFailureRetry:true,restartAndCancel:true,secondLevelStaysDeferred:true,screenshots,cases,runtimeErrors:errors,limits:['Real Chromium renders the actual KensetsuReviewTests and TokuteiChrome components through react-native-web.','Royal artwork, safe-area insets and AsyncStorage have explicit web adapters; this does not certify the production Expo bundle or artwork.','No native device, human construction/safety, native-language or rights approval.'],nativeDeviceTested:false,domainReviewed:false,nativeReviewed:false,rightsReviewed:false,releaseReady:false};
    report.fontSha256=crypto.createHash('sha256').update(fs.readFileSync(path.join(out,'font.woff2'))).digest('hex');
    const name=visualOnly?'ONE_GO_BROWSER_VISUAL_QA_2026-10-17.json':'ONE_GO_BROWSER_QA_2026-10-17.json';
    report.visualPassOnly=visualOnly;
    report.screenshotState=visualOnly?'unsubmitted_first_question':'submitted_review';
    report.bundleSha256=crypto.createHash('sha256').update(fs.readFileSync(path.join(out,'entry.js'))).digest('hex');
    if(visualOnly){report.status='PASS_REAL_CHROMIUM_18_VIEWPORT_CAPTURES';report.sourceLessonModals=0;report.cancelSubmit=false}
    fs.writeFileSync(path.join(root,'docs/ssw-workspace/kensetsu',name),JSON.stringify(report,null,2)+'\n');
    console.log(`PASS: 6 scopes, ${cases.length} full attempts, ${cases.length*40} questions, ${choiceLabels} choices, ${resumes} resumes, 18 viewport screenshots`);
  } finally {if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
}
main().catch(e=>{console.error(e);process.exitCode=1});
