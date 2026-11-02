// Actual reader + RNWeb, real controlled PNG bytes. This is browser evidence only.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),out=process.env.CONSTRUCTION_WEB_OUTPUT;if(!out)throw Error('CONSTRUCTION_WEB_OUTPUT must point outside repository');fs.mkdirSync(out,{recursive:true});
const esbuild=require(path.join(root,'node_modules/esbuild')), {chromium}=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'));
const mocks={
 '@react-native-async-storage/async-storage':`export default {getItem:async()=>new URLSearchParams(location.search).get('mode')||'day',setItem:async()=>{}};`,
 'react-native-safe-area-context':`export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});`,
 '@/components/ui/AppBackdrop':`export const useBackdropOcclusion=()=>{};`,
 '@/components/ui/RoyalSurface':`import React from 'react';export const ROYAL_FONT={body:undefined,heading:undefined},ROYAL_LAYOUT={screenGutter:12};export const RoyalBackButton=()=>null;`,
 '@/components/ui/RoyalPanels':`import React from 'react';import {View} from 'react-native';export const RoyalContentPanel=({children,style})=><View style={style}>{children}</View>;export const RoyalExplanationPanel=RoyalContentPanel;`,
 '@/components/ui/RoyalPageBackground':`import React from 'react';import {View} from 'react-native';export default({children})=><View style={{flex:1}}>{children}</View>;`,
 '@/data/kensetsu':`export {foremanIllustrations as illustrations,foremanIllustrationAspectRatios as illustrationAspectRatios} from ${JSON.stringify(path.join(root,'src/data/kensetsu/foreman-illustrations'))};export const fields=[],completionId=s=>s.id,completionKey=()=>'',restoreProgress=()=>({});`,
 '@/data/kensetsu/scope':`export const subjectLabels={};export const weeksForScope=()=>[],sessionsForScope=()=>[],sessionForScope=()=>undefined,studyDayForScope=()=>undefined,studyDayIdForSession=id=>id,studyDayCompletionIds=()=>[];`,
 './KensetsuReviewTests':`export const KensetsuReviewTests=()=>null;`
};
const resolve=p=>{for(const x of ['','.ts','.tsx','.json','/index.ts'])if(fs.existsSync(p+x)&&fs.statSync(p+x).isFile())return p+x;throw Error(p)};
(async()=>{
 fs.writeFileSync(path.join(out,'entry.tsx'),`import React from 'react';import {createRoot} from 'react-dom/client';import {KensetsuDayReader} from ${JSON.stringify(path.join(root,'src/components/kensetsu/KensetsuCourse'))};import {StudyAppearanceProvider} from ${JSON.stringify(path.join(root,'src/components/tokutei/StudyAppearance'))};import {foremanSessions} from ${JSON.stringify(path.join(root,'src/data/kensetsu/foreman'))};const q=new URLSearchParams(location.search),s=foremanSessions.find(s=>s.id.endsWith(q.get('session')||'017'));createRoot(document.getElementById('root')).render(<StudyAppearanceProvider><KensetsuDayReader session={s} language={q.get('language')||'en'} ready={true} done={false} saving={false} onComplete={()=>{}}/></StudyAppearanceProvider>);`);
 await esbuild.build({entryPoints:[path.join(out,'entry.tsx')],outfile:path.join(out,'entry.js'),bundle:true,format:'iife',platform:'browser',jsx:'automatic',nodePaths:[path.join(root,'node_modules')],define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},logLevel:'error',plugins:[{name:'construction-browser-adapters',setup(b){
  b.onResolve({filter:/.*/},a=>{if(mocks[a.path])return {path:a.path,namespace:'mock'};if(a.path==='react-native')return{path:require.resolve('react-native-web',{paths:[root]})};if(a.path.startsWith('@/'))return{path:resolve(path.join(root,'src',a.path.slice(2)))};});
  b.onLoad({filter:/.*/,namespace:'mock'},a=>({contents:mocks[a.path],loader:'tsx',resolveDir:root}));
  b.onResolve({filter:/\.(png|webp|jpe?g)$/},a=>({path:path.resolve(a.resolveDir,a.path),namespace:'png'}));
  b.onLoad({filter:/.*/,namespace:'png'},a=>{const raw=fs.readFileSync(a.path);assert(!raw.toString('utf8',0,60).includes('git-lfs'),'Actual PNG bytes required');return{contents:'module.exports='+JSON.stringify({uri:'data:image/png;base64,'+raw.toString('base64')}),loader:'js'};});
 }}]});
 fs.copyFileSync(path.join(root,'assets/app/fonts/NotoSansJP-Medium.ttf'),path.join(out,'font.ttf'));
 fs.writeFileSync(path.join(out,'index.html'),'<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:QAJP;src:url(/font.ttf)}html,body,#root{margin:0;height:100%;width:100%}#root{display:flex;flex-direction:column}*{font-family:QAJP,sans-serif!important}</style><div id="root"></div><script src="/entry.js"></script>');
 const server=http.createServer((q,r)=>{const file=q.url.startsWith('/entry.js')?'entry.js':q.url.startsWith('/font.ttf')?'font.ttf':'index.html';r.setHeader('Content-Type',file.endsWith('js')?'text/javascript':file.endsWith('ttf')?'font/ttf':'text/html');r.end(fs.readFileSync(path.join(out,file)));}).listen(0,'127.0.0.1');await new Promise(r=>server.on('listening',r));let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.CONSTRUCTION_CHROMIUM?{executablePath:process.env.CONSTRUCTION_CHROMIUM}:{}),args:['--no-sandbox','--disable-gpu']});const page=await browser.newPage(),errors=[],cases=[];page.on('pageerror',e=>errors.push(e.message));
  for(const number of [17,18,19])for(const [width,height,name] of [[390,844,'phone'],[844,390,'landscape'],[768,1024,'tablet'],[1440,900,'desktop']]){
   await page.setViewportSize({width,height});const id=String(number).padStart(3,'0');await page.goto(`http://127.0.0.1:${server.address().port}/?session=${id}&language=en&mode=${name==='landscape'?'night':'day'}`);await page.getByTestId('kensetsu-study-image').waitFor();await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.getByTestId(`kensetsu-localized-kensetsu-foreman-session-${id}:learningActivity`).count(),0);await page.getByTestId('kensetsu-translation').click();assert(await page.getByTestId(`kensetsu-localized-kensetsu-foreman-session-${id}-c2:caption`).count());
   const image=page.getByTestId('kensetsu-study-image');await image.scrollIntoViewIfNeeded();await page.waitForFunction(()=>[...document.querySelectorAll('img')].some(i=>i.complete&&i.naturalWidth===1200));
   const dims=await image.evaluate(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}));assert(Math.abs(dims.w/dims.h-1200/720)<.01);assert(dims.w<=width);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
   await page.screenshot({path:path.join(out,`${id}-${name}.png`)});await image.click();await page.getByText('閉じる',{exact:true}).waitFor();await page.getByText('閉じる',{exact:true}).click();cases.push({session:number,width,height,realImageLoaded:true,captionLocale:'en',zoomOpenedAndClosed:true});
  }
  assert.equal(errors.length,0,errors.join('\n'));const report={date:'2026-11-02',status:'PASS_ACTUAL_READER_RNWEB_REAL_IMAGE_BYTES',cases,adapters:['ReactNativeWeb','RoyalFrames','Backdrop','storage','unusedScopeAndReviewRoutes'],nativeDeviceTested:false,productionExpoTested:false,learnerDurationMeasured:false,pixelScreenshotsRequireSeparateVisualInspection:true};fs.writeFileSync(path.join(root,'docs/ssw-workspace/source-coverage-v2/construction-browser-validation.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,cases:cases.length,nativeDeviceTested:false}));
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
