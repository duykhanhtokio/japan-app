const fs=require('fs'),path=require('path');
const {chromium}=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'));
const output=path.join(process.cwd(),'docs/ui-workspace/royal-safearea-1205-2026-10-03');
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({executablePath:'/tmp/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={platform:'production-web',errors:[],views:[],resumeActions:[]};
 try{
 for(const [width,height] of [[360,800],[430,932],[768,1024],[1366,768]]){
 const page=await browser.newPage({viewport:{width,height}}),view={width,height,actions:[]};report.views.push(view);
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.addInitScript(()=>{window.__tasks=[];new PerformanceObserver(list=>{for(const e of list.getEntries())window.__tasks.push({start:e.startTime,ms:e.duration})}).observe({type:'longtask',buffered:true})});
 const shot=async name=>{await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(180);await page.screenshot({type:'jpeg',quality:65,path:path.join(output,`${name}-${width}x${height}.jpg`)})};
 const go=async(route,text)=>{const start=Date.now();await page.goto('http://127.0.0.1:8119'+route,{waitUntil:'domcontentloaded'});await page.getByText(text,{exact:true}).first().waitFor();view.actions.push({route,readyMs:Date.now()-start})};
 await go('/home','筆記学習');await shot('home');
 view.home=await page.evaluate(()=>['筆記学習','会話練習','特定技能学習'].map(name=>{
  const card=document.querySelector(`[data-testid="home-mode-${name}"]`).getBoundingClientRect(),clip=document.querySelector(`[data-testid="home-artwork-viewport-${name}"]`).getBoundingClientRect(),image=document.querySelector(`[data-testid="home-artwork-${name}"]`).getBoundingClientRect();
  const inside=clip.left>card.left&&clip.top>card.top&&clip.right<card.right&&clip.bottom<card.bottom;
  const covers=image.left<=clip.left+.1&&image.top<=clip.top+.1&&image.right>=clip.right-.1&&image.bottom>=clip.bottom-.1;
  if(Math.abs(clip.width/clip.height-3)>.005)throw Error('Frame opening does not match 3:1 artwork');
  return {name,inside,covers,openingRatio:clip.width/clip.height,clipStyle:getComputedStyle(document.querySelector(`[data-testid="home-artwork-viewport-${name}"]`)).overflow};
 }));if(view.home.some(x=>!x.inside||!x.covers||x.clipStyle!=='hidden'))throw Error('Home clipping failed');
 await go('/N2/grammar','文法');await shot('grammar');
 view.grammar={paperSlices:await page.locator('img[src*="paper-slices"]').count(),firstMounted:await page.getByText('Đánh dấu',{exact:true}).count()};
 if(view.grammar.paperSlices<9)throw Error('Grammar raster slices absent');
 const countBefore=view.grammar.firstMounted;await page.getByText('Đang tự tải thêm…',{exact:true}).scrollIntoViewIfNeeded();await page.waitForTimeout(250);view.grammar.afterScroll=await page.getByText('Đánh dấu',{exact:true}).count();if(view.grammar.afterScroll<=countBefore)throw Error('Grammar lazy batch failed');
 await go('/N2/vocabulary','単語');await shot('vocabulary');
 view.vocabulary={paperSlices:await page.locator('img[src*="paper-slices"]').count()};if(view.vocabulary.paperSlices<9)throw Error('Vocabulary raster slices absent');
 await page.getByPlaceholder('Tra toàn bộ 8.350 từ: Nhật, cách đọc, nghĩa...').fill('政策');await page.getByText('政策',{exact:true}).first().waitFor();view.vocabulary.searchWorks=true;
 await go('/N5/test','模擬試験一覧');await shot('catalog');
 view.catalogHeader=await page.getByText('N5 · 模擬試験一覧',{exact:true}).evaluate(e=>{let p=e.parentElement.parentElement;return {background:getComputedStyle(p).backgroundColor,top:p.getBoundingClientRect().top}});
 if(view.catalogHeader.background!=='rgba(0, 0, 0, 0)')throw Error('Catalog header opaque');
 await page.getByText('第1回',{exact:true}).click();await page.getByText('N5 · JLPT模擬試験',{exact:true}).waitFor();
 await page.getByTestId('jlpt-exam-safe-area').waitFor();await shot('exam-start');
 await page.getByRole('button',{name:'戻る',exact:true}).click();await page.getByText('模擬試験一覧',{exact:true}).first().waitFor();
 if(width===430){
  report.resumeFixture='isolated browser saved-session seed; production storage implementation unchanged';
  await page.evaluate(()=>localStorage.setItem('jlpt:n5:2011-12:exam-01:session:v1',JSON.stringify({version:4,answers:{},mode:'exam',status:'in_progress',started:true,submitted:false,currentQuestion:'',scrollY:0,playedAudioSegments:[],listeningPositionMs:0,submittedAt:null,result:null,updatedAt:new Date().toISOString()})));
  await page.getByText('第1回',{exact:true}).click();await page.getByText('前回の続きがあります',{exact:true}).waitFor();await shot('resume');
  for(const label of ['前回の続きから','最初からやり直す','キャンセル'])await page.getByRole('button',{name:label,exact:true}).waitFor();
  await page.getByRole('button',{name:'最初からやり直す',exact:true}).click();await page.getByText('最初からやり直しますか',{exact:true}).waitFor();report.resumeActions.push('restart-confirmation');
  await page.getByText('最初からやり直しますか',{exact:true}).locator('..').getByRole('button',{name:'キャンセル',exact:true}).click();await page.getByText('最初からやり直しますか',{exact:true}).waitFor({state:'hidden'});await page.getByText('前回の続きがあります',{exact:true}).waitFor();await page.getByLabel('キャンセル',{exact:true}).click();await page.getByText('模擬試験一覧',{exact:true}).first().waitFor();report.resumeActions.push('cancel');
 }

 await go('/N2','中上級日本語');
 for(let round=0;round<3;round++){
  for(const [label,ready] of [['文法','文法'],['単語','単語']]){
   const start=Date.now();await page.getByText(label,{exact:true}).filter({visible:true}).click();await page.getByText(ready,{exact:true}).filter({visible:true}).first().waitFor();
   view.actions.push({round,label,readyMs:Date.now()-start});await page.getByRole('button',{name:'戻る',exact:true}).click();await page.getByText('中上級日本語',{exact:true}).filter({visible:true}).waitFor();
  }
 }
 view.longTasks=await page.evaluate(()=>window.__tasks);await page.close();
 }
 if(report.errors.length)throw Error(report.errors.join('\n'));
 console.log('Royal follow-up PASS: four web sizes, Home 3:1 opening and first-render border, exam safe-area wrapper/start/Back, vocabulary/grammar frames, grammar lazy load, search, transparent catalog header, saved-session prompt/confirm/cancel. Native/performance acceptance pending.');
 }finally{fs.writeFileSync(path.join(output,'runtime.json'),JSON.stringify(report,null,2)+'\n');await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
