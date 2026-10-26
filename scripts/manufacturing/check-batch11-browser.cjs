const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),out=process.env.MANUFACTURING_QA_OUTPUT,executablePath=process.env.MANUFACTURING_QA_CHROMIUM;
if(!out||!executablePath)throw Error('Set MANUFACTURING_QA_OUTPUT and MANUFACTURING_QA_CHROMIUM');

const esbuild=require('esbuild'),{chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));fs.mkdirSync(out,{recursive:true});
const font=process.env.MANUFACTURING_QA_JAPANESE_FONT;if(!font)throw Error('Set MANUFACTURING_QA_JAPANESE_FONT');fs.copyFileSync(font,path.join(out,'japanese.otf'));
const thaiFont=process.env.MANUFACTURING_QA_THAI_FONT;if(!thaiFont)throw Error('Set MANUFACTURING_QA_THAI_FONT');fs.mkdirSync(out,{recursive:true});fs.copyFileSync(thaiFont,path.join(out,'thai.woff2'));
const adapters={safe:'export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});',backdrop:'export const useBackdropOcclusion=()=>{};',storage:`export default {getItem:async k=>{if(window.__failRead)throw Error('read');return localStorage.getItem(k)},setItem:async(k,v)=>{if(window.__failWrite)throw Error('write');localStorage.setItem(k,v)}};`,royal:`import React from 'react';import {View,Pressable,Text} from 'react-native';export const ROYAL_LAYOUT={screenGutter:12,backSafeTop:8},ROYAL_FONT={};export const RoyalBackButton=({onPress})=><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onPress}><Text>Back</Text></Pressable>;export const RoyalContentPanel=({children,style})=><View style={style}>{children}</View>;export const RoyalExplanationPanel=RoyalContentPanel;export default ({children})=><View style={{flex:1,backgroundColor:'#eee6d6'}}>{children}</View>;`};
(async()=>{
 await esbuild.build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {ManufacturingCourse} from './src/components/manufacturing/ManufacturingCourse';const params=new URLSearchParams(location.search);createRoot(document.getElementById('root')).render(<ManufacturingCourse learner={params.get('learner')||'qa'} language={params.get('language')||'ja'} onBack={()=>{window.__left=true}}/>);`,resolveDir:root,loader:'tsx'},outfile:path.join(out,'entry.js'),nodePaths:(process.env.NODE_PATH||'').split(path.delimiter).filter(Boolean),bundle:true,platform:'browser',jsx:'automatic',define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},plugins:[{name:'adapters',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'adapter'}));b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'adapter'}));
 b.onResolve({filter:/RoyalPageBackground|RoyalPanels|RoyalSurface/},()=>({path:'royal',namespace:'adapter'}));b.onResolve({filter:/AppBackdrop$/},()=>({path:'backdrop',namespace:'adapter'}));b.onLoad({filter:/.*/,namespace:'adapter'},a=>({contents:adapters[a.path],loader:'jsx',resolveDir:root}));
 b.onResolve({filter:/\.(png|webp|jpg)$/},a=>({path:path.resolve(a.resolveDir,a.path),namespace:'asset'}));b.onLoad({filter:/.*/,namespace:'asset'},a=>({contents:'module.exports={uri:'+JSON.stringify(fs.existsSync(a.path)?'data:image/png;base64,'+fs.readFileSync(a.path).toString('base64'):'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=')+'}',loader:'js'}));
 b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2));for(const ext of ['','.tsx','.ts','.json','/index.ts'])if(fs.existsSync(p+ext)&&fs.statSync(p+ext).isFile())return {path:p+ext};throw Error(p);});
 }}]});
 fs.writeFileSync(path.join(out,'index.html'),'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:ManufacturingQA;src:url(/japanese.otf)}@font-face{font-family:ManufacturingThai;src:url(/thai.woff2)}*{font-family:ManufacturingThai,ManufacturingQA,sans-serif!important}html,body,#root{height:100%;margin:0}#root{display:flex;flex-direction:column}*{box-sizing:border-box}</style><div id="root"></div><script src="/entry.js"></script>');
 const server=http.createServer((q,r)=>{const file=q.url.startsWith('/entry.js')?'entry.js':q.url.startsWith('/japanese.otf')?'japanese.otf':q.url.startsWith('/thai.woff2')?'thai.woff2':'index.html';r.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.otf')?'font/otf':file.endsWith('.woff2')?'font/woff2':'text/html; charset=utf-8');r.end(fs.readFileSync(path.join(out,file)));});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;const errors=[],screenshots=[],checks=[];
 try{browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox','--disable-gpu']});const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));const url=`http://127.0.0.1:${server.address().port}/`,names={mechanical:'機械金属加工',electrical:'電気電子機器組立て',surface:'金属表面処理'};
 const go=async(locale='ja',learner='qa')=>{await page.goto(url+'?language='+locale+'&learner='+learner);await page.evaluate(async()=>{await document.fonts.load('16px ManufacturingQA');await document.fonts.load('16px ManufacturingThai');await document.fonts.ready;});};
 const enter=async(s,locale='ja',learner='qa')=>{await go(locale,learner);await page.getByRole('button',{name:names[s],exact:true}).click();};
 const reader=async(s,locale='ja',day=1)=>{await enter(s,locale);await page.getByRole('button',{name:/第1週/}).click();await page.getByTestId(`mfg-day-${s}-${day}`).click();};
 const noOverflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');


 let readerVisits=0,questionVisits=0,rationaleVisits=0;
 for(const specialty of Object.keys(names))for(const requestedWeek of {mechanical:[6,7],electrical:[6],surface:[6]}[specialty]){
 const data=require(root+'/src/data/manufacturing/'+specialty+'.json'),start=(requestedWeek-1)*7,week=requestedWeek,exam=data.checks[week-1];
 assert(data.lessons.length>=start+7);assert(exam);
 for(const [width,height]of [[320,568],[932,430]]){await page.setViewportSize({width,height});for(const locale of ['th']){
 const labels=require(root+'/src/data/manufacturing/ui-translations.json').locales[locale],translations=require(root+'/src/data/manufacturing/translations/'+locale+'.json').lessons;
 for(let i=start;i<start+7;i++){
 await enter(specialty,locale,'batch11reader');await page.getByRole('button',{name:new RegExp('第'+week+'週')}).click();await page.getByTestId(`mfg-day-${specialty}-${i%7+1}`).click();const tr=translations[data.lessons[i].id];assert(tr);
 await page.getByRole('button',{name:labels.translationShow,exact:true}).click();
 for(const text of [tr.title,tr.objective,...tr.paragraphs.flatMap(x=>[x.title,x.text]),...tr.terms.map(x=>x.meaning),...tr.safety,tr.activity,tr.summary])assert(await page.getByText(text,{exact:false}).count(),text);
 await noOverflow();readerVisits++;checks.push(`reader-${specialty}-${locale}-${i+1}-${width}`);
 if([start,start+6].includes(i)&&locale==='th'){const file=`batch11-${specialty}-week${week}-th-day${i%7+1}-${width}.png`;await page.screenshot({path:path.join(out,file)});screenshots.push(file);}
 }}}
 await page.setViewportSize({width:320,height:568});
 for(const locale of ['th']){
 const labels=require(root+'/src/data/manufacturing/ui-translations.json').locales[locale],trq=require(root+'/src/data/manufacturing/translations/questions.'+locale+'.json').questions;
 const open=async()=>{await enter(specialty,locale,'batch11quiz-'+specialty+'-'+locale);await page.getByRole('button',{name:labels.weeklyChecks,exact:true}).click();await page.getByRole('button',{name:labels.openResume,exact:true}).nth(week-1).click();};
 await open();await page.getByRole('button',{name:/^1\. /}).click();await page.getByRole('button',{name:labels.next,exact:true}).click();await open();await page.getByText('2 / 12',{exact:true}).waitFor();await page.getByRole('button',{name:labels.previous,exact:true}).click();checks.push(`${specialty}-week${week}-answer-position-resume-${locale}`);
 await page.getByRole('button',{name:labels.translationShow,exact:true}).click();
 for(const [i,q]of exam.questions.entries()){const tr=trq[q.id];await page.getByText(tr.stem,{exact:true}).waitFor();for(const o of tr.options)assert(await page.getByText(o,{exact:false}).count());for(const why of tr.reasons)assert.equal(await page.getByText(why,{exact:true}).count(),0);await noOverflow();questionVisits++;if(i<11)await page.getByRole('button',{name:labels.next,exact:true}).click();}
 await page.getByRole('button',{name:labels.submit,exact:true}).click();await page.getByRole('button',{name:labels.confirm,exact:true}).click();
 for(let i=11;i>=0;i--){for(const why of trq[exam.questions[i].id].reasons){await page.getByText(why,{exact:true}).waitFor();rationaleVisits++;}await noOverflow();if(i>0)await page.getByRole('button',{name:labels.previous,exact:true}).click();}checks.push(`${specialty}-week${week}-submit-review-12questions-48rationales-${locale}`);
 }
 await enter(specialty,'ja','batch11complete-'+specialty);await page.getByRole('button',{name:new RegExp('第'+week+'週')}).click();await page.getByTestId(`mfg-day-${specialty}-7`).click();await page.getByRole('button',{name:'完了する',exact:true}).click();await page.getByTestId(`mfg-day-${specialty}-7`).waitFor();const lastId=data.lessons[start+6].id;assert(await page.evaluate(id=>Object.keys(localStorage).some(k=>k.includes('manufacturing:completion')&&JSON.parse(localStorage[k]).entries[id]),lastId));checks.push(`${specialty}-week${week}-completion-save-auto-return`);
 }
 for(const specialty of Object.keys(names)){
 const labels=require(root+'/src/data/manufacturing/ui-translations.json').locales['zh-CN'];
 await enter(specialty,'zh-CN','batch11-pending-'+specialty);await page.getByRole('button',{name:/第1週/}).click();await page.getByTestId(`mfg-day-${specialty}-1`).click();
 await page.getByRole('button',{name:labels.translationShow,exact:true}).click();await page.getByText(labels.translationPending,{exact:true}).waitFor();
 const untranslated=require(root+'/src/data/manufacturing/'+specialty+'.json').lessons[0];assert(await page.getByText(untranslated.objectiveJa,{exact:true}).count());checks.push(`unstarted-locale-pending-retains-Japanese-${specialty}`);
 }
 const thaiCaptions=require(root+'/src/data/manufacturing/diagram-translations.json').locales.th;
 for(const [width,height]of [[320,568],[932,430]])for(const [lessonId,caption]of Object.entries(thaiCaptions).filter(([id])=>['mfg1-mechanical-lesson-044','mfg1-electrical-l038','mfg1-surface-lesson-042'].includes(id))){
 await page.setViewportSize({width,height});const specialty=Object.keys(names).find(s=>lessonId.startsWith('mfg1-'+s+'-'));
 const data=require(root+'/src/data/manufacturing/'+specialty+'.json'),index=data.lessons.findIndex(l=>l.id===lessonId),week=Math.floor(index/7)+1;
 const labels=require(root+'/src/data/manufacturing/ui-translations.json').locales.th;
 await enter(specialty,'th','batch11-caption-'+lessonId);await page.getByRole('button',{name:new RegExp('第'+week+'週')}).click();await page.getByTestId(`mfg-day-${specialty}-${index%7+1}`).click();await page.getByRole('button',{name:labels.translationShow,exact:true}).click();
 await page.getByText(caption.text,{exact:true}).waitFor();await page.getByTestId('manufacturing-technical-diagram').scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const img=document.querySelector('[data-testid=manufacturing-technical-diagram] img');return img&&img.complete&&img.naturalWidth>1});await noOverflow();
 await page.getByRole('button',{name:labels.imageZoom,exact:true}).click();const expanded=page.getByTestId('manufacturing-expanded-diagram');await expanded.waitFor();await page.waitForFunction(()=>{const img=document.querySelector('[data-testid=manufacturing-expanded-diagram] img');return img&&img.complete&&img.naturalWidth>1});assert((await expanded.boundingBox()).width>=960);
 assert(await expanded.evaluate(el=>{for(let n=el.parentElement;n;n=n.parentElement){if(n.scrollWidth>n.clientWidth+1&&['auto','scroll'].includes(getComputedStyle(n).overflowX)){n.scrollLeft=100;return n.scrollLeft>0;}}return false}));await page.getByRole('button',{name:labels.imageClose,exact:true}).click();await page.getByTestId('manufacturing-technical-diagram').waitFor();
 if(lessonId==='mfg1-surface-lesson-042'){await page.getByText(caption.text,{exact:true}).scrollIntoViewIfNeeded();const file=`batch11-th-caption-${width}.png`;await page.screenshot({path:path.join(out,file)});screenshots.push(file);}
 checks.push(`thai-caption-image-load-enlarge-pan-close-${lessonId}-${width}`);
 }
 assert.equal(errors.length,0);const result={status:'PASS',checks,screenshots,errors,translatedReaderVisits:readerVisits,translatedQuestionVisits:questionVisits,translatedRationales:rationaleVisits,scope:'Actual manufacturing RN Web component with storage/safearea/Royal adapters;batch11 Thai remaining weeks6–7 translation/resume/submission/completion tested; not fullExpo/native certification.'};fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:'PASS',checks:checks.length,readerVisits,questionVisits,rationaleVisits,screenshots:screenshots.length,errors}));
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
