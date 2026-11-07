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


 const labels=require(root+'/src/data/manufacturing/ui-translations.json').locales.en;
 const manifest=require(root+'/src/data/manufacturing/course-manifest.json');
 const targets=require(root+'/docs/ssw-workspace/manufacturing/batch12/new-diagram-captions.json').captions;
 const register=require(root+'/docs/ssw-workspace/manufacturing/illustration-register.json');
 const url=`http://127.0.0.1:${server.address().port}/`;
 for(const [lessonId,caption]of Object.entries(targets)){
  const sp=manifest.specialties.find(s=>s.weeks.some(w=>w.lessonIds.includes(lessonId)));const week=sp.weeks.find(w=>w.lessonIds.includes(lessonId));const day=week.lessonIds.indexOf(lessonId)+1;
  for(const [width,height]of [[320,568],[932,430]]){
   await page.setViewportSize({width,height});await page.goto(url+'?language=en&learner=diagram-qa');await page.getByRole('button',{name:sp.titleJa,exact:true}).click();await page.getByRole('button',{name:`第${week.number}週\n${week.titleJa}`,exact:true}).click();await page.getByTestId(`mfg-day-${sp.id}-${day}`).click();
   const image=page.getByTestId('manufacturing-technical-diagram');await image.scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>{const i=document.querySelector('[data-testid="manufacturing-technical-diagram"] img');return i?.complete&&i.naturalWidth===1200;});
   await page.getByRole('button',{name:labels.imageZoom,exact:true}).click();const expanded=page.getByTestId('manufacturing-expanded-diagram');await expanded.waitFor();
   const expected=register.assets.find(a=>a.lessonIds.includes(lessonId)).dimensions;
   const box=await expanded.boundingBox();assert(Math.abs(box.width/box.height-expected.width/expected.height)<0.01);
   await expanded.evaluate(e=>{let p=e.parentElement;while(p){p.scrollLeft=200;p.scrollTop=200;p=p.parentElement;}});
   await page.getByRole('button',{name:labels.imageClose,exact:true}).click();await expanded.waitFor({state:'detached'});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks.push(lessonId+'-'+width);
  }
 }
 assert.equal(errors.length,0);fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({status:'PASS',checks,errors,scope:'Seven actual source-linked PNGs load/ratio/expand/pan/close at320and932px using actualreader/diagram components, RNWeb with storage/safearea/Royaladapters; no native/fullExpo certification.'},null,2));console.log(JSON.stringify({status:'PASS',diagramViewportChecks:checks.length,errors}));
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
