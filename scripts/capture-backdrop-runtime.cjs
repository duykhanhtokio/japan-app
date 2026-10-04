// Real production browser capture; no mocked rendering or state injection.
const fs=require('fs'),path=require('path'),{spawn}=require('child_process');const {chromium}=require(process.env.BACKDROP_PLAYWRIGHT_MODULE || 'playwright');
const build=process.env.BACKDROP_BUILD_DIR,out=process.env.BACKDROP_EVIDENCE_DIR;if(!build||!out)throw new Error('Set BACKDROP_BUILD_DIR and BACKDROP_EVIDENCE_DIR');fs.mkdirSync(out,{recursive:true});const server=spawn('python',[path.join(__dirname,'serve-backdrop-runtime.py'),build],{stdio:'ignore'});
(async()=>{await new Promise(r=>setTimeout(r,200));const browser=await chromium.launch({executablePath:process.env.BACKDROP_BROWSER_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--no-zygote']});const context=await browser.newContext({viewport:JSON.parse(process.env.BACKDROP_VIEWPORT||'{"width":430,"height":932}'),recordVideo:{dir:out,size:JSON.parse(process.env.BACKDROP_VIEWPORT||'{"width":430,"height":932}')}});const page=await context.newPage();const report={runtime:'actual-production-web',viewport:JSON.parse(process.env.BACKDROP_VIEWPORT||'{"width":430,"height":932}'),actions:[],errors:[],frameCount:0};page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE ERROR',m.text().slice(0,500))});page.on('pageerror',e=>{report.errors.push(e.message);console.log('PAGE ERROR',e.message)});await page.addInitScript(()=>{window.__backdropFrames=[];window.__backdropStep='cold-start';function frame(t){const layers=[];for(const e of document.querySelectorAll('img,[style*="background-image"]')){
 const s=getComputedStyle(e),src=e.tagName==='IMG'?e.src:s.backgroundImage;
 if(!src||src==='none'||!/\/assets\/(?:app\/(?:backgrounds|welcome|maps\/regions|home-cards|registration|life\/(?:cities|location-backgrounds))|game\/farm\/background)\//.test(src))continue;
 const r=e.getBoundingClientRect();if(r.width<innerWidth*.8||r.height<innerHeight*.8||r.bottom<=0||r.top>=innerHeight||r.right<=0||r.left>=innerWidth)continue;
 let visible=true;for(let a=e;a;a=a.parentElement){const t=getComputedStyle(a);if(t.display==='none'||t.visibility==='hidden'||Number(t.opacity)===0){visible=false;break;}}
 if(!visible)continue;layers.push({src,loaded:e.tagName==='IMG'?e.complete&&e.naturalWidth>0:null,kind:e.tagName==='IMG'?'img':'css-image'});
 }
 window.__backdropFrames.push({t,path:location.pathname,step:window.__backdropStep,layers});requestAnimationFrame(frame)}requestAnimationFrame(frame)});
await page.goto('http://127.0.0.1:8089'+(process.env.BACKDROP_START_PATH||'/home'),{waitUntil:'domcontentloaded'});await page.getByText('筆記学習',{exact:true}).waitFor({timeout:60000});await page.waitForTimeout(250);const cdp=await context.newCDPSession(page);let active='home',index=0;const captures=[];cdp.on('Page.screencastFrame',e=>{cdp.send('Page.screencastFrameAck',{sessionId:e.sessionId}).catch(()=>{});const name=`paint-${String(index++).padStart(4,'0')}-${active}.jpg`;fs.writeFileSync(path.join(out,name),Buffer.from(e.data,'base64'));captures.push({name,timestamp:e.metadata.timestamp,step:active});});await cdp.send('Page.startScreencast',{format:'jpeg',quality:70,everyNthFrame:1});
const act=async(name,run,expected)=>{active=name;await page.evaluate(n=>window.__backdropStep=n,name);const started=Date.now();await run();if(expected)await expected.waitFor({timeout:20000});await page.waitForTimeout(process.env.BACKDROP_FAST==='1'?80:400);await page.screenshot({path:path.join(out,name+'.png')});report.actions.push({name,path:new URL(page.url()).pathname,ms:Date.now()-started});console.log(name,new URL(page.url()).pathname)};
const text=(t)=>page.getByText(t,{exact:true}).filter({visible:true}).first(),back=()=>page.getByRole('button',{name:'戻る',exact:true}).first().click();
try{
await act('home-learn',()=>text('筆記学習').click(),text('JLPT 学習'));
await act('learn-n5',()=>text('初級').click(),text('はじめての日本語'));
console.log('LEVEL TEXT',(await page.locator('body').innerText()).slice(0,800));
await act('n5-grammar',()=>text('文法').click(),text('文法'));
await act('grammar-level',back,text('はじめての日本語'));
await act('n5-characters',()=>text('文字').click(),text('文字'));
await act('characters-level',back,text('はじめての日本語'));
await act('n5-vocabulary',()=>text('単語').click(),text('単語'));
await act('vocabulary-search',()=>page.getByPlaceholder('Tra toàn bộ 8.350 từ: Nhật, cách đọc, nghĩa...').fill('会う'),text('会う'));
await act('vocabulary-detail',()=>page.getByText('会う',{exact:true}).filter({visible:true}).first().click(),text('会う'));
await act('detail-vocabulary',back,text('単語'));
await act('vocabulary-level',back,text('はじめての日本語'));
await act('n5-catalog',()=>text('JLPT模擬試験').click(),text('模擬試験一覧'));
await act('catalog-preflight',()=>text('第1回').click(),text('試験を始める'));
await act('preflight-exam',()=>text('試験を始める').click(),text('答案を提出する'));
await act('exam-select-answer',()=>page.getByRole('radio').first().click());
report.savedBeforeExit=await page.evaluate(()=>Object.keys(localStorage).map(k=>{try{return{k,value:JSON.parse(localStorage.getItem(k))}}catch{return null}}).filter(x=>x?.value?.answers));
await act('exam-navigator',()=>text('問題一覧').click(),text('閉じる'));
await act('navigator-close',()=>text('閉じる').click(),text('答案を提出する'));
await act('exam-submit-modal',()=>text('答案を提出する').click(),text('答案を提出しますか'));
await act('submit-modal-close',()=>text('戻る').last().click(),text('答案を提出する'));
await act('exam-catalog',back,text('模擬試験一覧'));
await act('catalog-resume',()=>text('第1回').click(),text('前回の続きから'));
await act('resume-exam',()=>text('前回の続きから').click(),text('答案を提出する'));
report.savedAfterResume=await page.evaluate(()=>Object.keys(localStorage).map(k=>{try{return{k,value:JSON.parse(localStorage.getItem(k))}}catch{return null}}).filter(x=>x?.value?.answers));
report.answerPreserved=JSON.stringify(report.savedBeforeExit.map(x=>x.value.answers))===JSON.stringify(report.savedAfterResume.map(x=>x.value.answers));
if(!report.answerPreserved)throw new Error('Saved answer changed on resume');
await act('exam-confirm-submit',()=>text('答案を提出する').click(),text('答案を提出しますか'));
console.log('SUBMIT BUTTONS',await page.getByRole('button').allTextContents());
await act('submit-results',()=>text('提出する').click(),text('試験結果'));
report.savedResult=await page.evaluate(()=>Object.keys(localStorage).map(k=>{try{return{k,value:JSON.parse(localStorage.getItem(k))}}catch{return null}}).filter(x=>x?.value?.answers));
await act('results-review',()=>text('解答を確認する').click(),text('解答の確認'));
await act('review-results',back,text('試験結果'));
await act('results-catalog',back,text('模擬試験一覧'));
await act('catalog-level',back,text('はじめての日本語'));
await act('level-learn',back,text('JLPT 学習'));
await act('learn-home',back,text('筆記学習'));
await act('home-world',()=>text('会話練習').click(),text('日本地図'));
await act('world-kanto',()=>text('関東').click(),text('関東地方'));
await act('kanto-prefecture',()=>text('東京').click(),text('東京都'));
console.log('PREFECTURE BUTTONS',await page.getByRole('button').allTextContents());
await act('prefecture-city',()=>page.getByRole('button',{name:'千代田区',exact:true}).click());
console.log('CITY TEXT',(await page.locator('body').innerText()).slice(0,400));
if(await text('駅員と始める').count()){
 await act('choose-starter',()=>text('駅員と始める').click(),text('筆記学習'));
 await act('starter-home-world',()=>text('会話練習').click(),text('日本地図'));
 await act('starter-world-kanto',()=>text('関東').click(),text('関東地方'));
 await act('starter-kanto-prefecture',()=>text('東京').click(),text('東京都'));
 await act('starter-prefecture-city',()=>page.getByRole('button',{name:'千代田区',exact:true}).click());
}
console.log('CITY BUTTONS',await page.getByRole('button').allTextContents());
await act('city-location',()=>page.getByRole('button').filter({hasText:'駅'}).first().click(),text('今回の課題'));
await act('location-guide',()=>text('会話の進め方').click(),text('閉じる'));
await act('guide-close',()=>text('閉じる').click(),text('開始'));
await act('location-dialogue',()=>text('開始').click());
console.log('DIALOGUE TEXT',(await page.locator('body').innerText()).slice(0,400));
await act('dialogue-location',back,text('今回の課題'));
await act('location-city',back);
await act('city-prefecture',back,text('東京都'));
await act('prefecture-kanto',back,text('関東地方'));
await act('kanto-world',back,text('日本地図'));
await act('world-home',back,text('筆記学習'));
await act('home-game',()=>page.getByRole('button',{name:'ゲーム',exact:true}).click(),page.getByRole('button',{name:'ショップ',exact:true}));
await act('game-chicken',()=>page.getByRole('button',{name:'鶏小屋',exact:true}).click(),text('えさ'));
await act('chicken-game',back,page.getByRole('button',{name:'ショップ',exact:true}));
await act('game-shop',()=>page.getByRole('button',{name:'ショップ',exact:true}).click(),text('ファームコスメ'));
await act('shop-close',()=>text('×').click(),page.getByRole('button',{name:'ショップ',exact:true}));
await act('game-home',back,text('筆記学習'));
await act('home-profile',()=>page.getByRole('button',{name:'プロフィール',exact:true}).click(),text('プロフィール'));
await act('profile-details',()=>text('詳細を見る · Xem chi tiết ›').click(),text('プロフィール · 詳細'));
console.log('DETAILS BUTTONS',await page.getByRole('button').allTextContents());
await act('details-close',()=>text('閉じる · Đóng').click());
await act('profile-home',()=>page.getByRole('button',{name:'ホーム',exact:true}).click(),text('筆記学習'));
await act('home-skills',()=>text('特定技能学習').click(),text('特定技能学習'));
await act('skills-home',back,text('筆記学習'));
await act('web-background-return',async()=>{const other=await context.newPage();await other.goto('about:blank');await other.bringToFront();await new Promise(r=>setTimeout(r,150));await page.bringToFront();await other.close()},text('筆記学習'));
for(let i=0;i<3;i++){
 await act('rapid-learn-'+i,()=>text('筆記学習').click(),text('JLPT 学習'));
 await act('rapid-home-'+i,back,text('筆記学習'));
}

}catch(e){report.errors.push('ACTION BLOCKER: '+e.message);console.error(e.message);await page.screenshot({path:path.join(out,'blocked.png')});console.log('BLOCKED TEXT',(await page.locator('body').innerText()).slice(0,1000))}
await cdp.send('Page.stopScreencast');const frames=await page.evaluate(()=>window.__backdropFrames);report.frameCount=frames.length;report.screencastFrames=captures.length;report.frameSummary=Object.fromEntries([...new Set(frames.map(f=>f.step))].map(step=>{const f=frames.filter(f=>f.step===step);return[step,{frames:f.length,minLayers:Math.min(...f.map(x=>x.layers.length)),maxLayers:Math.max(...f.map(x=>x.layers.length)),unloadedFrames:f.filter(x=>x.layers.some(l=>l.loaded===false)).length,paths:[...new Set(f.map(x=>x.path))]}]}));fs.writeFileSync(path.join(out,'runtime.json'),JSON.stringify(report,null,2));fs.writeFileSync(path.join(out,'animation-frames.json'),JSON.stringify(frames));fs.writeFileSync(path.join(out,'paint-frames.json'),JSON.stringify(captures));const video=page.video();await context.close();await video.saveAs(path.join(out,'transitions.webm'));await browser.close();server.kill();console.log(JSON.stringify({actions:report.actions.length,errors:report.errors,frameCount:report.frameCount,screencastFrames:report.screencastFrames,frameSummary:report.frameSummary},null,2))})().catch(e=>{console.error(e.message);server.kill();process.exit(1)});
