const fs=require('fs'),path=require('path'),assert=require('assert');
const {chromium}=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'));
const out=path.join(process.cwd(),'docs/ui-workspace/stable-waist-back-1253-2026-10-03');
const assetSource=fs.readFileSync('src/components/world/life-assets.ts','utf8');
const waists=JSON.parse(assetSource.match(/const npcWaistY:Record<string,number>=(.*);/)[1]);
const scenarios=[['station','SC-LOC-001-01-001'],['cafe','SC-LOC-001-19-001'],['bank','SC-LOC-001-21-001'],['hospital','SC-LOC-001-05-001'],['restaurant','SC-LOC-001-16-001']];
(async()=>{fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({executablePath:'/tmp/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});const report={platform:'production-web',speech:'Isolated browser SpeechSynthesis stub completes Japanese utterances; not an audio/device test.',errors:[],views:[]};
try{
for(const [width,height] of [[360,800],[430,932],[768,1024],[1366,768],[932,430]]){
 const page=await browser.newPage({viewport:{width,height}});const view={width,height,backs:[],dialogues:[],entryChecks:[]};report.views.push(view);page.on('pageerror',e=>report.errors.push(e.message));
 await page.addInitScript(()=>{
  localStorage.setItem('@japan_app/npc_collection_v1',JSON.stringify({starterCategoryId:'station',unlockedCategoryIds:['station','cafe','bank','hospital','restaurant'],completedScenarioIds:[],categoryProgress:{},rewardedCategoryIds:[]}));
  // Preserve the app callbacks, replacing only unavailable headless speech output.
  speechSynthesis.speak=u=>{queueMicrotask(()=>{u.onstart?.({});u.onboundary?.({charIndex:0,charLength:u.text.length});u.onend?.({});});};speechSynthesis.cancel=()=>{};
 });
 const go=async(route,label)=>{await page.goto('http://127.0.0.1:8119'+route,{waitUntil:'domcontentloaded'});await page.getByText(label,{exact:true}).filter({visible:true}).first().waitFor();await page.evaluate(()=>document.fonts.ready);};
 const shot=async label=>{await page.waitForTimeout(100);await page.screenshot({type:'jpeg',quality:65,path:path.join(out,`${label}-${width}x${height}.jpg`)});};
 const checkBack=async state=>{
  const box=await page.getByRole('button',{name:'戻る',exact:true}).filter({visible:true}).first().boundingBox();
  assert(Math.abs(box.x-12)<.1&&Math.abs(box.y-8)<.1&&box.width===44&&box.height===44,JSON.stringify({state,box}));view.backs.push({state,...box});
 };
 await go('/N5/test','模擬試験一覧');await checkBack('catalog');await shot('catalog');
 await page.getByText('第1回',{exact:true}).click();await page.getByText('N5 · JLPT模擬試験',{exact:true}).waitFor();await checkBack('start');await shot('exam-start');
 await page.getByRole('button',{name:'戻る',exact:true}).click();await page.getByText('模擬試験一覧',{exact:true}).first().waitFor();
 await page.evaluate(()=>localStorage.setItem('jlpt:n5:2011-12:exam-01:session:v1',JSON.stringify({version:4,answers:{},mode:'exam',status:'submitted',started:true,submitted:true,currentQuestion:'',scrollY:0,playedAudioSegments:[],listeningPositionMs:0,submittedAt:new Date().toISOString(),result:{correct:0,wrong:0,unanswered:89,total:89},updatedAt:new Date().toISOString()})));
 await page.getByText('第1回',{exact:true}).click();await page.getByRole('button',{name:'結果を見る',exact:true}).waitFor();await page.getByRole('button',{name:'結果を見る',exact:true}).click();await page.getByText('N5 · 試験結果',{exact:true}).waitFor();await checkBack('result');await shot('exam-result');
 await page.getByRole('button',{name:'戻る',exact:true}).click();await page.getByText('模擬試験一覧',{exact:true}).first().waitFor();view.resultBack=true;
 await go('/N1/test','模擬試験一覧');await page.getByText('第2回',{exact:true}).click();await page.getByRole('button',{name:'試験を始める',exact:true}).click();await page.getByRole('button',{name:'問題一覧',exact:true}).waitFor();await checkBack('running-N1');await shot('exam-running');
 await page.getByRole('radio').first().click();await page.getByRole('button',{name:'問題一覧',exact:true}).click();await page.getByRole('button',{name:'閉じる',exact:true}).click();await checkBack('running-after-navigator');
 await page.getByRole('button',{name:'戻る',exact:true}).click();await page.getByText('模擬試験一覧',{exact:true}).first().waitFor();view.runningBack=true;
 for(const [category,id] of scenarios){
  if(width===932&&category!=='station')continue;
  await page.goto('http://127.0.0.1:8119/world/dialogue/'+id,{waitUntil:'domcontentloaded'});await page.getByTestId('dialogue-panels').waitFor();await page.waitForTimeout(180);
  const geometry=await page.evaluate(waistY=>{
   const box=document.querySelector('[data-testid="dialogue-npc"]').getBoundingClientRect(),panels=document.querySelector('[data-testid="dialogue-panels"]').getBoundingClientRect(),mic=document.querySelector('[data-testid="dialogue-microphone"]').getBoundingClientRect();
   const drawHeight=Math.min(box.height,box.width/(1024/1536));const waist=box.top+(box.height-drawHeight)/2+drawHeight*waistY/1536;
   return {waist,panels:{top:panels.top,bottom:panels.bottom,height:panels.height},mic:{top:mic.top,bottom:mic.bottom},npc:{top:box.top,width:box.width,height:box.height}};
  },waists[category]);
  assert(geometry.panels.top>=geometry.waist-.5,JSON.stringify({category,geometry}));assert(geometry.panels.height>0&&geometry.panels.bottom<=geometry.mic.top+1,JSON.stringify({category,geometry}));view.dialogues.push({category,id,...geometry});await shot('dialogue-'+category);
  if(width===430&&category==='station'){
   const lanterns=page.getByRole('button',{name:'ヒント',exact:true});
   // Labels vary by lantern color; inspect existing controls without changing callback behavior.
   await lanterns.first().click();await lanterns.nth(1).click();await shot('dialogue-hint');await lanterns.nth(1).click();await shot('dialogue-answer');view.hintStages=true;
   view.hintButtons=await page.locator('[role="button"]').count();
   await page.getByRole('button',{name:'前へ',exact:true}).waitFor();await page.getByRole('button',{name:'次へ',exact:true}).waitFor();
  }
 }
 for(const [route,label]  of [['/world','日本地図','[role="button"]'],['/world/city/CTY-001','札幌市','[role="button"]'],['/npc-starter','最初の仲間','[role="button"]'],['/portal','学習者','[role="button"]']]){
  await go(route,label);const handle=page.getByText(label,{exact:true}).filter({visible:true}).first();
  const first=await handle.boundingBox();const transforms=await handle.evaluate(e=>{const r=[];for(let p=e;p&&p!==document.body;p=p.parentElement)r.push({transform:getComputedStyle(p).transform,opacity:getComputedStyle(p).opacity});return r;});
  await page.waitForTimeout(500);const later=await handle.boundingBox();assert(Math.abs(first.y-later.y)<1&&Math.abs(first.x-later.x)<1,JSON.stringify({route,first,later}));assert(transforms.every(s=>s.opacity==='1'&&(s.transform==='none'||s.transform==='matrix(1, 0, 0, 1, 0, 0)')),JSON.stringify({route,transforms}));view.entryChecks.push({route,first,later,transforms});await shot(route.replaceAll('/','-').slice(1));
 }
 // Ordinary learned pages still share the same approved Back coordinates.
 for(const [route,label] of [['/N2/grammar','文法'],['/N2/vocabulary','単語']]){await go(route,label);await checkBack(route);await shot(route.endsWith('grammar')?'grammar':'vocabulary');}
 await go('/home','筆記学習');await shot('home');await page.getByTestId('home-mode-会話練習').click();await page.getByText('日本地図',{exact:true}).waitFor();await page.getByRole('button',{name:'戻る',exact:true}).click();await page.getByText('筆記学習',{exact:true}).filter({visible:true}).first().waitFor();view.homeBack=true;
 await page.close();
}
if(report.errors.length)throw Error(report.errors.join('\n'));console.log('Stable UI runtime PASS: five sizes, source-specific NPC waists, catalog/start/result Back, stable page entry, Home and learning frames. Native acceptance pending.');
}finally{fs.writeFileSync(path.join(out,'runtime.json'),JSON.stringify(report,null,2)+'\n');await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
