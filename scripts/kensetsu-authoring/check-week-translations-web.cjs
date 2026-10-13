const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const root=process.cwd(),deps=process.env.KENSETSU_QA_NODE_MODULES;
if(!deps)throw Error('Set KENSETSU_QA_NODE_MODULES to installed React/ReactDOM/RNWeb/esbuild dependencies.');
const esbuild=require(path.join(deps,'esbuild'));
const {chromium}=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'));
const out=process.env.KENSETSU_QA_OUTPUT;
if(!out)throw Error('Set KENSETSU_QA_OUTPUT to a temporary test directory.');
fs.mkdirSync(out,{recursive:true});
const week=Number(process.argv[2]||1);if(!Number.isInteger(week)||week<1||week>55)throw Error('Invalid week');
const weekCode=String(week).padStart(3,'0');
const bundles=Array.from({length:7},(_,i)=>JSON.parse(fs.readFileSync(`src/data/kensetsu/translations/session-${String((week-1)*7+i+1).padStart(3,'0')}.json`)));
const bundle=bundles[0];
const firstParagraph=Object.keys(bundle.entries).find(id=>/-p\d+$/.test(id));
const sourceIds=bundles.flatMap(b=>Object.keys(b.entries));
const verifiedFields=[['title',id=>id==='title'],['clusterTitles',id=>/:title$/.test(id)],['paragraphs',id=>/-p\d+$/.test(id)],['prompts',id=>/:prompt$/.test(id)],['reflections',id=>/:reflection$/.test(id)],['learningActivities',id=>id==='learningActivity'||/:activity$/.test(id)],['caption',id=>/:caption$/.test(id)],['glossary',id=>/:term:/.test(id)],['keyTerms',id=>/^keyTerm:/.test(id)],['illustrationAlt',id=>/^illustration:/.test(id)]].filter(([,matches])=>sourceIds.some(matches)).map(([name])=>name);
fs.writeFileSync(path.join(out,'entry.tsx'),`import React from 'react';import {createRoot} from 'react-dom/client';import {KensetsuCourse} from ${JSON.stringify(root+'/src/components/kensetsu/KensetsuCourse')};createRoot(document.getElementById('root')).render(<KensetsuCourse learner="translation-qa" language={new URLSearchParams(location.search).get('language')||'en'} onBack={()=>{}}/>);`);
const adapters={
 safe:`export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});`,
 storage:`export default {getItem:async k=>localStorage.getItem(k),setItem:async(k,v)=>localStorage.setItem(k,v)};`,
 royal:`import React from 'react';import {View,Pressable,Text} from 'react-native';export const ROYAL_FONT={heading:undefined,body:undefined};export function RoyalBackButton({onPress}){return <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onPress}><Text>Back</Text></Pressable>};export const RoyalContentPanel=({children,style})=><View style={style}>{children}</View>;export const RoyalExplanationPanel=RoyalContentPanel;export default ({children})=><View style={{flex:1,backgroundColor:'#263850'}}>{children}</View>;`
};
(async()=>{
 await esbuild.build({entryPoints:[path.join(out,'entry.tsx')],outfile:path.join(out,'entry.js'),bundle:true,platform:'browser',format:'iife',jsx:'automatic',nodePaths:[deps],define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},plugins:[{name:'qa-adapters',setup(b){
  b.onResolve({filter:/^(react|react-dom)(\/.*)?$/},a=>({path:require.resolve(a.path,{paths:[deps]})}));
  b.onResolve({filter:/^react-native$/},()=>({path:path.join(deps,'react-native-web/dist/index.js')}));
  b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'adapter'}));
  b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'adapter'}));
  b.onResolve({filter:/RoyalPageBackground|RoyalPanels|RoyalSurface/},()=>({path:'royal',namespace:'adapter'}));
  b.onLoad({filter:/.*/,namespace:'adapter'},a=>({contents:adapters[a.path],loader:'jsx',resolveDir:out}));
  b.onResolve({filter:/^@\//},a=>{const base=path.join(root,'src',a.path.slice(2));const ext=['.tsx','.ts','.json'].find(e=>fs.existsSync(base+e));return {path:ext?base+ext:base+'/index.ts'};});
  b.onResolve({filter:/\.(png|jpe?g|webp)$/},a=>({path:a.path,namespace:'art'}));
  b.onLoad({filter:/.*/,namespace:'art'},()=>({contents:'module.exports='+JSON.stringify({uri:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1672" height="941"></svg>'}),loader:'js'}));
 }}]});
 fs.copyFileSync(path.join(root,'assets/app/fonts/NotoSansJP-Medium.ttf'),path.join(out,'font.ttf'));
 fs.writeFileSync(path.join(out,'index.html'),'<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:TranslationQA;src:url(/font.ttf)}*{font-family:TranslationQA,sans-serif!important}html,body,#root{margin:0;height:100%}#root{display:flex;flex-direction:column}</style><div id="root"></div><script src="/entry.js"></script>');
 const server=http.createServer((q,r)=>{const file=q.url.startsWith('/entry.js')?'entry.js':q.url.startsWith('/font.ttf')?'font.ttf':'index.html';r.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.ttf')?'font/ttf':'text/html');r.end(fs.readFileSync(path.join(out,file)));}).listen(0,'127.0.0.1');
 await new Promise(resolve=>server.on('listening',resolve));
 const browser=await chromium.launch({...(process.env.KENSETSU_QA_CHROMIUM?{executablePath:process.env.KENSETSU_QA_CHROMIUM}:{}),args:['--no-sandbox','--disable-gpu']});
 const page=await browser.newPage({viewport:{width:430,height:932}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=`http://127.0.0.1:${server.address().port}`;
 const enter=async(locale,day=1)=>{
  await page.goto(url+'/?language='+locale);await page.getByTestId('kensetsu-field-building').click();
  const targetDay=page.getByTestId('kensetsu-day-'+((week-1)*7+day));
  if(!await targetDay.count()){
   const targetWeek=page.getByTestId('kensetsu-week-'+week);
   if(!await targetWeek.count())await page.getByTestId('kensetsu-group-'+(Math.floor((week-1)/10)+1)).click();
   await targetWeek.click();
  }
  await targetDay.click();
 };
 const tested=[];
 for(const locale of Object.keys(bundle.entries.title.translations)){
  for(const [lessonIndex,lessonBundle] of bundles.entries()){
  await enter(locale,lessonIndex+1);
  const sessionId=lessonBundle.sessionId;
  assert.equal(await page.getByTestId('kensetsu-localized-'+sessionId+':title').count(),0);
  await page.getByTestId('kensetsu-translation').click();
  for(const [id,entry] of Object.entries(lessonBundle.entries)){
   let testId;if(id==='title')testId='kensetsu-localized-'+sessionId+':title';
   else if(/-p\d+$/.test(id))testId='kensetsu-translation-'+id;
   else if(/^keyTerm:|^illustration:/.test(id))testId='kensetsu-localized-'+sessionId+':'+id;
   else if(id==='learningActivity')testId='kensetsu-localized-'+sessionId+':learningActivity';
   else if(/:title$|:caption$|:prompt$|:reflection$|:activity$|:term:/.test(id))testId='kensetsu-localized-'+id;
   else throw Error('Unverified translation field: '+id);
   assert.equal(await page.getByTestId(testId).innerText(),entry.translations[locale],testId+':'+locale);
   if(/-p\d+$/.test(id))assert.equal(await page.getByText(entry.sourceJa,{exact:true}).count(),1,'Japanese remains visible');
   if(id==='learningActivity'||/:reflection$|:activity$/.test(id)){
    const sourceId=id==='learningActivity'?sessionId+':learningActivity':id;
    assert.equal(await page.getByTestId('kensetsu-source-'+sourceId).innerText(),entry.sourceJa);
    assert.equal(await page.getByText(entry.sourceJa,{exact:true}).count(),1,'Repeated instruction displayed once');
   }
  }
  assert.equal(await page.getByText('この段落の翻訳は準備中です。',{exact:true}).count(),0);
  assert(await page.getByTestId('kensetsu-complete').isDisabled());
  await page.getByTestId('kensetsu-translation').click();
  assert.equal(await page.getByTestId('kensetsu-translation-'+Object.keys(lessonBundle.entries).find(id=>/-p\d+$/.test(id))).count(),0);
  for(const id of Object.keys(lessonBundle.entries).filter(id=>id==='learningActivity'||/:reflection$|:activity$/.test(id)))assert.equal(await page.getByTestId('kensetsu-localized-'+(id==='learningActivity'?sessionId+':learningActivity':id)).count(),0);
  }
  tested.push(locale);
 }
 await enter('vi',5);await page.getByTestId('kensetsu-translation').click();
 const screens=[];
 for(const [w,h,name] of [[320,568,'phone'],[768,1024,'tablet'],[932,430,'landscape']]){
  await page.setViewportSize({width:w,height:h});await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(out,name+'.png')});
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));screens.push({width:w,height:h});
  await page.getByTestId('kensetsu-reflections').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(out,name+'-reflections.png')});
  assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
  await page.getByTestId('kensetsu-reader').evaluate(e=>{e.scrollTop=0;});
 }
 await enter('vi');await page.getByTestId('kensetsu-translation').click();
 await page.getByTestId('kensetsu-reader').evaluate(e=>{e.scrollTop=e.scrollHeight;e.dispatchEvent(new Event('scroll',{bubbles:true}));});
 await page.waitForTimeout(200);assert(await page.getByTestId('kensetsu-complete').isEnabled());
 await page.getByTestId('kensetsu-complete').click();await page.reload();
 await page.getByTestId('kensetsu-field-building').click();await page.getByTestId('kensetsu-day-'+((week-1)*7+1)).click();
 assert((await page.getByTestId('kensetsu-complete').innerText()).includes('学習済み'));
 await enter('ja');await page.getByTestId('kensetsu-translation').click();
 assert.equal(await page.getByTestId('kensetsu-translation-'+firstParagraph).count(),0);
 const exerciseIds=Object.keys(bundle.entries).filter(id=>id==='learningActivity'||/:activity$|:reflection$/.test(id));
 for(const id of exerciseIds)assert.equal(await page.getByTestId('kensetsu-localized-'+(id==='learningActivity'?bundle.sessionId+':learningActivity':id)).count(),0);
 await enter('xx');await page.getByTestId('kensetsu-translation').click();
 assert.equal(await page.getByTestId('kensetsu-translation-'+firstParagraph).innerText(),'この段落の翻訳は準備中です。');
 for(const id of exerciseIds)assert.equal(await page.getByTestId('kensetsu-localized-'+(id==='learningActivity'?bundle.sessionId+':learningActivity':id)).innerText(),'この段落の翻訳は準備中です。');
 assert.equal(errors.length,0,errors.join('\n'));
 const report={status:'PASS_WEB_ADAPTED_READER',week,locales:tested,lessons:7,localeLessonCombinations:84,translatedFieldsVerified:verifiedFields,toggleVerified:true,japaneseRetained:true,noLocaleFallback:true,completionNotTriggeredByTranslation:true,completionReloadVerified:true,viewports:screens,consoleErrors:errors,adapters:['ReactNativeWeb','AsyncStorage to localStorage','zero safe area','Royal decorative wrappers/back button stubbed','image placeholders'],limits:['Core real reader tested; decorative art/Royal design and all-script glyph coverage not certified','No native device, human language or domain review'],nativeDeviceTested:false,releaseReady:false};
 fs.writeFileSync(process.env.KENSETSU_QA_REPORT||`docs/ssw-workspace/kensetsu/translations/week-${weekCode}-web-qa.json`,JSON.stringify(report,null,2)+'\n');
 console.log('PASS: all seven lessons x 12 translation locales in actual reader; toggle, source Japanese, no fallback, completion/reload; three viewport overflow checks. Decorative wrappers/assets adapted.');
 await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
