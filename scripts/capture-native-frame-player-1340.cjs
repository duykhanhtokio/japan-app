const fs=require('fs'),path=require('path'),assert=require('assert');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const out='docs/ui-workspace/native-frame-player-1340-2026-10-03';
(async()=>{fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({executablePath:'/tmp/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required']});const report={platform:'production-web',speech:'Controlled SpeechSynthesis callbacks; native speech is not tested.',errors:[],views:[]};try{
for(const [width,height]of [[360,800],[430,932],[768,1024],[1366,768],[932,430]]){
 const p=await browser.newPage({viewport:{width,height}}),view={width,height,frames:[],dialogues:[]};report.views.push(view);p.on('pageerror',e=>report.errors.push(e.message));
 await p.addInitScript(()=>{localStorage.setItem('@japan_app/npc_collection_v1',JSON.stringify({starterCategoryId:'station',unlockedCategoryIds:['station','cafe','bank','hospital','restaurant'],completedScenarioIds:[],categoryProgress:{},rewardedCategoryIds:[]}));speechSynthesis.speak=u=>{window.__utterance=u;u.onstart?.({});};speechSynthesis.cancel=()=>{};});
 const go=async route=>{await p.goto('http://127.0.0.1:8119'+route,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>document.body.innerText.length>25);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(100);};
 const shot=async name=>p.screenshot({type:'jpeg',quality:70,path:path.join(out,`${name}-${width}x${height}.jpg`)});
 const frames=async route=>{const data=await p.locator('img[src*="button-wide"]').evaluateAll(images=>images.filter(e=>e.getBoundingClientRect().height>0&&getComputedStyle(e.parentElement).padding==='0px').map(e=>{const r=e.getBoundingClientRect(),b=e.parentElement.getBoundingClientRect();return{src:e.src.split('/').at(-1),image:{x:r.x,y:r.y,width:r.width,height:r.height},layer:{x:b.x,y:b.y,width:b.width,height:b.height},padding:getComputedStyle(e.parentElement).padding};}));for(const d of data){assert(Math.abs(d.image.width-d.layer.width)<.5&&Math.abs(d.image.height-d.layer.height)<.5,JSON.stringify({route,d}));assert(d.padding==='0px',JSON.stringify(d));}view.frames.push({route,images:data});};
 await go('/home');await p.getByText('学習モード',{exact:true}).waitFor();await frames('/home');await shot('home');
 await p.getByTestId('home-mode-特定技能学習').click();await p.getByText('Specified Skilled Worker',{exact:true}).waitFor();await p.evaluate(()=>document.fonts.ready);await shot('industries');view.sectorImages=await p.locator('img[src*="industries"]').count();assert.equal(view.sectorImages,6);assert.equal(await p.locator('img[src*="rewards/cards"]').count(),0);
 view.sectorHeadingColor=await p.getByText('特定技能学習',{exact:true}).filter({visible:true}).evaluate(e=>getComputedStyle(e).color);assert.equal(view.sectorHeadingColor,'rgb(255, 243, 207)');
 await go('/world/location/LOC-001-01');await p.getByText('開始',{exact:true}).waitFor();await frames('/world/location/LOC-001-01');await shot('location');
 const scenarios=width===430?[['station','SC-LOC-001-01-001'],['cafe','SC-LOC-001-19-001'],['bank','SC-LOC-001-21-001'],['hospital','SC-LOC-001-05-001'],['restaurant','SC-LOC-001-16-001']]:[['station','SC-LOC-001-01-001']];
 for(const [category,id]of scenarios){
 await go('/world/dialogue/'+id);await p.waitForFunction(()=>window.__utterance);assert.equal(await p.getByRole('button',{name:'ヒント',exact:true}).count(),1);assert.equal(await p.getByTestId('dialogue-microphone').count(),0);
 await frames('/world/dialogue/'+id);const before=await p.getByRole('button',{name:'ヒント',exact:true}).first().boundingBox();await shot('npc-only-'+category);
 await p.evaluate(()=>{const u=window.__utterance;u.onboundary?.({charIndex:0,charLength:u.text.length});});assert.equal(await p.getByRole('button',{name:'ヒント',exact:true}).count(),1);
 await p.evaluate(()=>window.__utterance.onend?.({}));await p.getByTestId('dialogue-microphone').waitFor();assert.equal(await p.getByRole('button',{name:'ヒント',exact:true}).count(),2);
 const after=await p.getByRole('button',{name:'ヒント',exact:true}).first().boundingBox();assert(Math.abs(before.y-after.y)<.5,JSON.stringify({before,after}));await shot('paired-'+category);view.dialogues.push({category,before,after,playerHiddenUntilDone:true});
 await p.getByRole('button',{name:'ヒント',exact:true}).first().click();await p.getByRole('button',{name:'ヒント',exact:true}).nth(1).click();await shot('hints-'+category);
 await p.getByRole('button',{name:'次へ',exact:true}).click();await p.waitForTimeout(80);assert.equal(await p.getByTestId('dialogue-microphone').count(),0);assert.equal(await p.getByRole('button',{name:'ヒント',exact:true}).count(),1);view.dialogues.at(-1).nextNpcOnly=true;
 }
 for(const route of ['/profile','/game','/game/work/1-1-1','/N2/grammar','/N2/vocabulary','/N5/test',...(width===430||width===1366?['/register','/register/work','/portal','/npc-starter','/world/city/CTY-001']:[])]){await go(route);await frames(route);await shot(route.replaceAll('/','-').slice(1));}
 if(width===430||width===1366){
 await go('/profile');await p.getByRole('button',{name:'詳細を見る · Xem chi tiết ›',exact:true}).click();await p.getByText('プロフィール · 詳細',{exact:true}).waitFor();await frames('/profile/details');await shot('profile-details');await p.getByRole('button',{name:'閉じる · Đóng',exact:true}).click();
 await go('/game');await p.getByRole('button',{name:'野菜畑',exact:true}).click();await p.getByText('植える',{exact:true}).first().waitFor();await p.getByText('植える',{exact:true}).first().click();await p.getByText('植えたい作物を選んでください',{exact:true}).waitFor();await frames('/game/crop-picker');await shot('crop-picker');await p.getByText('閉じる',{exact:true}).filter({visible:true}).first().click();view.sharedModals=true;
 }
 await p.close();}
assert.deepEqual(report.errors,[]);console.log('Runtime PASS: five sizes, frame images fill padding-free layers, six independent sector assets, NPC-only before completion, stable NPC box after player reveal and next-pair gating, shared consumers.');
}finally{fs.writeFileSync(path.join(out,'runtime.json'),JSON.stringify(report,null,2)+'\n');await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
