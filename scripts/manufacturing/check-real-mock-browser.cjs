const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),out=process.env.MANUFACTURING_QA_OUTPUT,executablePath=process.env.MANUFACTURING_QA_CHROMIUM;
if(!out||!executablePath)throw Error('Set MANUFACTURING_QA_OUTPUT and MANUFACTURING_QA_CHROMIUM');

const esbuild=require('esbuild'),{chromium}=require('playwright');fs.mkdirSync(out,{recursive:true});
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

 try{
 browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox','--disable-gpu']});const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));

 const labels=require(root+'/src/data/manufacturing/ui-translations.json').locales.en,mockLabels=require(root+'/src/data/manufacturing/mock-ui-translations.json').locales.en;
 const url=`http://127.0.0.1:${server.address().port}/`;
 for(const specialty of ['mechanical','electrical','surface']){
  const exams=require(root+`/src/data/manufacturing/mocks/${specialty}.json`).exams;
  const title={mechanical:'機械金属加工',electrical:'電気電子機器組立て',surface:'金属表面処理'}[specialty];
  for(let index=0;index<10;index++){
   const exam=exams[index];await page.setViewportSize({width:index%2?932:320,height:index%2?430:568});
   await page.goto(url+'?language=en&learner=real-'+specialty+'-'+index);
   await page.getByRole('button',{name:title,exact:true}).click();await page.getByRole('button',{name:mockLabels.mockExams,exact:true}).click();
   assert.equal(await page.getByRole('button',{name:labels.openResume,exact:true}).count(),10);
   await page.getByRole('button',{name:labels.openResume,exact:true}).nth(index).click();
   await page.getByRole('button',{name:mockLabels.startSection,exact:true}).click();
   const q=exam.sections.theory.questions[0];await page.getByRole('button',{name:'1. '+q.optionsJa[0],exact:true}).click();
   assert.equal(await page.getByTestId('manufacturing-mock-results').count(),0);assert.equal(await page.getByTestId('manufacturing-mock-rationales').count(),0);
   await page.waitForFunction(()=>Object.keys(localStorage).some(k=>k.includes('manufacturing:mock:v1:')));
   const records=await page.evaluate(()=>Object.entries(localStorage).filter(([k])=>k.includes('manufacturing:mock:v1:')).map(([key,v])=>({key,value:JSON.parse(v)})));
   const stored=records.find(r=>r.value.examId===exam.id);assert(stored);assert.equal(stored.value.revision,exam.revision);assert.equal(stored.value.sections.theory.answers[0],0);
   await page.getByRole('button',{name:mockLabels.submitSection,exact:true}).click();await page.getByRole('button',{name:labels.confirm,exact:true}).click();
   await page.getByRole('button',{name:mockLabels.startSection,exact:true}).click();
   const practical=exam.sections.practical.questions[0];for(let i=0;i<4;i++)await page.getByRole('button',{name:`${i+1}. ${practical.optionsJa[i]}`,exact:true}).waitFor();
   await page.getByRole('button',{name:`${practical.correctIndex+1}. ${practical.optionsJa[practical.correctIndex]}`,exact:true}).click();
   await page.getByRole('button',{name:mockLabels.submitSection,exact:true}).click();await page.getByRole('button',{name:labels.confirm,exact:true}).click();await page.getByTestId('manufacturing-mock-results').waitFor();await page.getByTestId('manufacturing-mock-rationales').waitFor();
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks.push(exam.id);
   if(index===0){const filename='real-'+specialty+'-result.png';await page.screenshot({path:path.join(out,filename)});screenshots.push(filename);}
  }
 }
 assert.equal(errors.length,0);fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({status:'PASS',checks,screenshots,errors,fixtureOnly:false,scope:'Actual course and mock controllers with all30canonical exams, real ruby/translation data, RNWeb; storage, safearea and Royal adapters. No fullExpo/native certification.'},null,2));console.log(JSON.stringify({status:'PASS',realExams:checks.length,errors}));
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
