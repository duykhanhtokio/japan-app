const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),modules=process.env.TOKUTEI_QA_MODULES,output=process.env.DIALOGUE_LAYOUT_QA_OUTPUT;
if(!modules||!output)throw Error('Set TOKUTEI_QA_MODULES and DIALOGUE_LAYOUT_QA_OUTPUT');
const esbuild=require(require.resolve('esbuild',{paths:[modules]}));
const {chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
const head=execFileSync('git',['rev-parse',process.env.DIALOGUE_LAYOUT_QA_COMMIT||'HEAD'],{cwd:root,encoding:'utf8'}).trim();
const committedUi=process.env.DIALOGUE_LAYOUT_USE_COMMITTED_UI==='1';
const rubyMode=process.env.DIALOGUE_LAYOUT_QA_VARIANT==='ruby';
const viewports=process.env.DIALOGUE_LAYOUT_QA_VIEWPORTS?JSON.parse(process.env.DIALOGUE_LAYOUT_QA_VIEWPORTS):[[360,800],[390,844],[430,932],[768,1024],[1366,768],[932,430]];
assert(Array.isArray(viewports)&&viewports.every(v=>Array.isArray(v)&&v.length===2&&v.every(n=>Number.isInteger(n)&&n>=240&&n<=5000)),'Invalid QA viewports');
const committed=p=>JSON.parse(execFileSync('git',['show',head+':'+p],{cwd:root,encoding:'utf8',maxBuffer:50*1024*1024}));
const locales=['en','vi','id','tl','zh-CN','zh-TW','hi','bn','ne','my','th','km'];
const index=committed('src/data/dialogue-content/locale-batch-index.json'),batches=[...new Set(Object.values(index))];
const scenarios=new Map(committed('src/data/generated/scenarios.json').map(s=>[s.id,s]));
const locations=new Map(committed('src/data/generated/locations.json').map(s=>[s.id,s]));
const authoredHints=committed('src/data/dialogue-content/player-hints.json');
const canonicalCache=new Map();
function canonicalTurn(sid,id){
 if(!canonicalCache.has(sid)){let file=`src/data/generated/dialogues/${sid}.json`,generic=false;if(!fs.existsSync(path.join(root,file))){const m=/^SC-LOC-JP-\d{5}-(\d{2})-001$/.exec(sid);assert(m);file=`src/data/generated/dialogues/GENERIC-CITY-${m[1]}.json`;generic=true;}const data=committed(file),turns=Array.isArray(data)?data:data.shared??data.N5;canonicalCache.set(sid,turns.map(t=>generic?{...t,id:t.id.replace(/GENERIC-CITY-\d{2}/g,sid),scenarioId:sid}:t));}
 const turn=canonicalCache.get(sid).find(t=>t.id===id);assert(turn);return JSON.parse(JSON.stringify(turn));
}
const fixtures={};
for(const language of locales){let hint,npc;
 for(const batch of batches){const pack=committed(`src/data/dialogue-content/locale-batches/${language}/${batch}.json`);
  for(const [sid,s]of Object.entries(pack.scenarios))for(const [id,t]of Object.entries(s.turns)){
   const allowedHint=!rubyMode||(authoredHints[id]?.recommendedAnswerRuby?.length&&authoredHints[id].answerJa===t.sourceJa);
   if(t.speaker==='PLAYER'&&allowedHint&&(!hint||(rubyMode?t.sourceJa.length>hint.t.sourceJa.length:Array.from(t.hintTranslation).length>Array.from(hint.t.hintTranslation).length)))hint={sid,id,t};
   if(t.speaker==='NPC'&&(!npc||Array.from(t.translation).length>Array.from(npc.t.translation).length))npc={sid,id,t};
  }
 }
 const scenario=scenarios.get(hint.sid)||{id:hint.sid,name:'会話練習'};
 const npcTurn=canonicalTurn(npc.sid,npc.id),playerTurn=canonicalTurn(hint.sid,hint.id);
 assert.equal(npcTurn.npc.textJa,npc.t.sourceJa);assert.equal(playerTurn.player.recommendedAnswerJa,hint.t.sourceJa);
 if(authoredHints[hint.id]?.answerJa===hint.t.sourceJa&&authoredHints[hint.id].recommendedAnswerRuby)playerTurn.player.recommendedAnswerRuby=authoredHints[hint.id].recommendedAnswerRuby;
 npcTurn.npc.translations={[language]:npc.t.translation};playerTurn.player.translations={[language]:hint.t.translation};playerTurn.player.hintTranslations={[language]:hint.t.hintTranslation};
 fixtures[language]={scenario,location:locations.get(scenario.locationId)||{id:'layout-fixture',category:'station',nameJa:'駅'},hintId:hint.id,npcId:npc.id,hint:hint.t.hintTranslation,translation:npc.t.translation,answerJa:hint.t.sourceJa,turns:[npcTurn,playerTurn]};
}
const adapters={
 backdrop:`export const useInheritedBackdrop=()=>false;export const useRootBackdropSource=()=>null;`,
 router:`export const useLocalSearchParams=()=>({scenarioId:window.__fixture.scenario.id});`,
 route:`export const backPrepared=()=>{};export const dismissToPrepared=()=>{};`,
 safe:`export {View as default} from 'react-native';export const useSafeAreaInsets=()=>({top:0,left:0,right:0,bottom:0});`,
 language:`export const useAppLanguage=()=>({language:window.__language});`,
 profile:`export const useUserProfile=()=>({profile:{name:'Player'}});`,
 speech:`export const stop=async()=>{};export const speak=(text,options)=>{window.__speech={text,options}};`,
 gameSpeech:`const noop=()=>{};const state={abortListening:noop,startListening:noop,stopListening:noop,finalTranscript:'',transcript:'',recognizing:false,speechAvailable:true};export const useGameSpeech=()=>state;`,
 repository:`export const getLifeScenarioById=()=>window.__fixture.scenario;export const getLifeLocationById=()=>window.__fixture.location;`,
 loader:`export const loadDialogueTurns=()=>window.__fixture.turns;`,
 background:`import React from 'react';import {View,Image} from 'react-native';export default ({children,style,source})=><View style={style}><Image source={source} resizeMode="cover" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}/>{children}</View>;`,
 locationBackground:`export const locationBackground=()=>null;`,
 reward:`export default ()=>null;`,
 progressionStorage:`export const recordNpcScenario=async()=>({progress:1});`,
 expoImage:`import React from 'react';import {Image as NativeImage} from 'react-native';export const Image=({contentFit,...props})=><NativeImage {...props} resizeMode={contentFit==='fill'?'stretch':contentFit||'cover'}/>;`,
};
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const entry=`import React,{useState} from 'react';import {createRoot} from 'react-dom/client';import Dialogue from ${JSON.stringify(path.join(root,'src/app/world/dialogue/[scenarioId].tsx'))};window.__fixtures=${JSON.stringify(fixtures)};function Harness(){const [key,setKey]=useState('en');window.__show=language=>{window.__language=language;window.__fixture=window.__fixtures[language];window.__speech=null;setKey(language+':'+Date.now())};if(!window.__fixture){window.__language='en';window.__fixture=window.__fixtures.en}return <Dialogue key={key}/>;}createRoot(document.getElementById('root')).render(<Harness/>);`;
 await esbuild.build({stdin:{contents:entry,loader:'tsx',resolveDir:root},outfile:path.join(output,'entry.js'),bundle:true,platform:'browser',format:'iife',jsx:'automatic',nodePaths:[modules],define:{'global':'globalThis','process.env.NODE_ENV':'"development"','__DEV__':'true'},logLevel:'silent',plugins:[{name:'layout-fixtures',setup(b){
  b.onResolve({filter:/^(react|react-dom)(\/.*)?$/},a=>({path:require.resolve(a.path,{paths:[modules]})}));
  b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web',{paths:[modules]})}));
  const stubs=[[/AppBackdrop/,'backdrop'],[/^expo-router$/,'router'],[/^expo-speech$/,'speech'],[/^expo-image$/,'expoImage'],[/prepareSceneRoute/,'route'],[/react-native-safe-area-context|StableSafeAreaView/,'safe'],[/useUserProfile/,'profile'],[/context\/LanguageContext/,'language'],[/useGameSpeech/,'gameSpeech'],[/services\/life-content-repository/,'repository'],[/services\/dialogue-content-loader/,'loader'],[/FocusedImageBackground/,'background'],[/location-backgrounds.generated/,'locationBackground'],[/NpcRewardModal/,'reward'],[/npc-progression-storage/,'progressionStorage']];
  for(const [filter,key]of stubs)b.onResolve({filter},()=>({path:key,namespace:'fixture'}));
  b.onLoad({filter:/.*/,namespace:'fixture'},a=>({contents:adapters[a.path],loader:'jsx',resolveDir:root}));
  if(committedUi)b.onLoad({filter:/src\/app\/world\/dialogue\/\[scenarioId\]\.tsx$/},a=>({contents:execFileSync('git',['show',head+':'+path.relative(root,a.path)],{cwd:root,encoding:'utf8'}),loader:'tsx',resolveDir:path.dirname(a.path)}));
  b.onResolve({filter:/\.(png|webp|jpe?g)$/},a=>({path:path.resolve(a.resolveDir,a.path),namespace:'asset'}));
  b.onLoad({filter:/.*/,namespace:'asset'},a=>({contents:'module.exports={uri:'+JSON.stringify('/asset?path='+encodeURIComponent(path.relative(root,a.path)))+'};'}));
  b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2));for(const ext of ['','.tsx','.ts','.json','.js','/index.ts'])if(fs.existsSync(p+ext)&&fs.statSync(p+ext).isFile())return{path:p+ext};});
 }}]});
 const fontPackages=['noto-sans-jp','noto-sans-devanagari','noto-sans-bengali','noto-sans-thai','noto-sans-myanmar','noto-sans-khmer'];
 const fontRoot=path.join(modules,'@fontsource');
 const fonts=fontPackages.map(pkg=>fs.readFileSync(path.join(fontRoot,pkg,'400.css'),'utf8').replace(/url\(\.\/files\//g,'url(/font/'+pkg+'/files/')).join('\n');
 const html='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+fonts+'html,body,#root{height:100%;margin:0}#root{display:flex;flex-direction:column}*{font-family:"Noto Sans JP","Noto Sans Devanagari","Noto Sans Bengali","Noto Sans Thai","Noto Sans Myanmar","Noto Sans Khmer",sans-serif!important}</style><div id="root"></div><script src="/entry.js"></script>';
 const server=http.createServer((q,r)=>{try{const u=new URL(q.url,'http://local');if(u.pathname==='/entry.js'){r.setHeader('Content-Type','application/javascript');r.end(fs.readFileSync(path.join(output,'entry.js')))}else if(u.pathname==='/asset'){const f=path.resolve(root,u.searchParams.get('path'));assert(f.startsWith(root+'/assets/'));r.end(fs.readFileSync(f))}else if(u.pathname.startsWith('/font/')){const f=path.resolve(fontRoot,u.pathname.slice(6));assert(f.startsWith(fontRoot+'/'));r.setHeader('Content-Type','font/woff2');r.end(fs.readFileSync(f))}else{r.setHeader('Content-Type','text/html; charset=utf-8');r.end(html)}}catch(e){r.statusCode=404;r.end('missing asset')}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const report={status:'RUNNING',head,variant:rubyMode?'authored_ruby':'longest_native',uiSource:committedUi?'committed':'working_tree',scenarios:Object.keys(index).length,locales,views:[],errors:[],limits:['Actual dialogue route, Royal panels, geometry and text-fit code; native services and data entry points use controlled browser adapters. Artwork availability is not validated.','Native task and NPC translation are independent committed-text layout stress fixtures, not a conversation-role or semantic evaluation.','Noto script fonts in Chromium; this does not certify native-device font metrics, speech, or platform rendering.']};
 try{
  browser=await chromium.launch({executablePath:process.env.KENSETSU_QA_CHROMIUM||'/tmp/chromium',headless:true,args:['--no-sandbox']});
  for(const [width,height]of viewports){
   const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>report.errors.push(e.message));await page.goto('http://127.0.0.1:'+server.address().port);
   for(const language of locales){await page.waitForFunction(()=>window.__show);await page.evaluate(l=>window.__show(l),language);await page.waitForFunction(()=>window.__speech);await page.evaluate(()=>window.__speech.options.onDone());await page.getByTestId('dialogue-microphone').waitFor();await page.waitForFunction(()=>getComputedStyle(document.querySelector('[data-testid="dialogue-panels"]')).pointerEvents!=='none');await page.evaluate(()=>document.fonts.ready);
    const hint=fixtures[language].hint;await page.getByText(hint,{exact:true}).waitFor();
    const measure=async value=>(typeof value==='string'?page.getByText(value,{exact:true}).first():value).evaluate(el=>{const box=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right}};const parents=[];let p=el;for(let i=0;p&&i<7;i++,p=p.parentElement)parents.push(box(p));return{text:box(el),parents,fontSize:parseFloat(getComputedStyle(el).fontSize),lineHeight:parseFloat(getComputedStyle(el).lineHeight),conversation:box(document.querySelector('[data-testid="dialogue-panels"]'))}});
    const row={language,width,height,hintId:fixtures[language].hintId,npcId:fixtures[language].npcId,hint:await measure(hint)};
    await page.getByRole('button',{name:'ヒント',exact:true}).first().click();await page.getByText(fixtures[language].translation,{exact:true}).waitFor();row.initialHint=row.hint;row.hint=await measure(hint);row.npc=await measure(fixtures[language].translation);
    if(width===390&&['en','my','km'].includes(language))await page.screenshot({path:path.join(output,language+'-'+width+'x'+height+'.png')});
    await page.getByRole('button',{name:'ヒント',exact:true}).nth(1).click();await page.getByText(hint,{exact:true}).waitFor({state:'hidden'});
    const ruby=page.getByTestId('japanese-ruby');row.answerUsesRuby=(await ruby.count())>0;if(rubyMode)assert(row.answerUsesRuby,'Authored ruby fixture must exercise real ruby rendering');row.answer=await measure(row.answerUsesRuby?ruby:page.getByText(fixtures[language].answerJa,{exact:true}).first());row.npcWithAnswer=await measure(fixtures[language].translation);
    for(const v of [row.initialHint,row.hint,row.npc,row.answer,row.npcWithAnswer]){const frame=v.parents[2],clip=v.conversation;v.fitsFrame=v.text.y>=frame.y+7&&v.text.bottom<=frame.bottom-7&&v.text.x>=frame.x&&v.text.right<=frame.right;v.fitsConversation=v.text.y>=clip.y&&v.text.bottom<=clip.bottom&&v.text.x>=clip.x&&v.text.right<=clip.right;v.fits=v.fitsFrame&&v.fitsConversation;}
    report.views.push(row);
   }await page.close();
  }
  report.failures=report.views.filter(r=>[r.initialHint,r.hint,r.npc,r.answer,r.npcWithAnswer].some(v=>!v.fits)).length;report.status=report.errors.length?'ERROR':report.failures?'FAIL_TEXT_FIT':'PASS';
 }catch(e){report.status='ERROR';report.errors.push(e.message);throw e;}finally{fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');if(browser)await browser.close();await new Promise(r=>server.close(r));}
 console.log(JSON.stringify({status:report.status,head,scenarios:report.scenarios,cases:report.views.length,failures:report.failures,errors:report.errors.slice(0,3),report:path.join(output,'report.json')}));
 if(report.status!=='PASS')process.exitCode=1;
})().catch(e=>{console.error(e.errors?.slice(0,3)??e);process.exitCode=1});
