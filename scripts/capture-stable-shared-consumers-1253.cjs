const fs=require('fs'),path=require('path'),assert=require('assert');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const out=path.join(process.cwd(),'docs/ui-workspace/stable-waist-back-1253-2026-10-03');
(async()=>{const b=await chromium.launch({executablePath:'/tmp/chromium',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});const report={errors:[],views:[]};
try{for(const [width,height] of [[430,932],[1366,768]]){
const p=await b.newPage({viewport:{width,height}});p.on('pageerror',e=>report.errors.push(e.message));
const ready=async route=>{await p.goto('http://127.0.0.1:8119'+route,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>document.body.innerText.length>25);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);};
const shot=async name=>p.screenshot({type:'jpeg',quality:65,path:path.join(out,`shared-${name}-${width}x${height}.jpg`)});
const view={width,height,routes:[],roundTrips:[]};report.views.push(view);
for(const route of ['/profile','/game','/game/work/1-1-1','/world/location/LOC-001-01']){await ready(route);await shot(route.replaceAll('/','-').slice(1));view.routes.push({route,buttons:await p.locator('[role="button"]').count(),hudSlices:await p.locator('img[src*="hud-slices"]').count(),navyCrop:await p.locator('img[src*="button-wide-visible"]').count()});}
await ready('/profile');await p.getByRole('button',{name:'詳細を見る · Xem chi tiết ›',exact:true}).click();await p.getByText('プロフィール · 詳細',{exact:true}).waitFor();await shot('profile-details');await p.getByRole('button',{name:'閉じる · Đóng',exact:true}).click();view.profileDetails=true;
await ready('/game');await p.getByRole('button',{name:'野菜畑',exact:true}).click();await p.getByText('植える',{exact:true}).first().waitFor();await p.getByText('植える',{exact:true}).first().click();await p.getByText('植えたい作物を選んでください',{exact:true}).waitFor();await shot('crop-picker');await p.getByText('閉じる',{exact:true}).filter({visible:true}).first().click();view.cropPicker=true;
await ready('/N2');await p.getByText('中上級日本語',{exact:true}).filter({visible:true}).waitFor();
for(let n=0;n<3;n++)for(const label of ['文法','単語']){await p.getByText(label,{exact:true}).filter({visible:true}).first().click();const title=p.getByText(label,{exact:true}).filter({visible:true}).first();await title.waitFor();const a=await title.boundingBox();await p.waitForTimeout(200);const z=await title.boundingBox();assert(Math.abs(a.y-z.y)<1);await p.getByRole('button',{name:'戻る',exact:true}).click();await p.getByText('中上級日本語',{exact:true}).filter({visible:true}).waitFor();view.roundTrips.push({n,label,first:a,later:z});}
await p.close();}
if(report.errors.length)throw Error(report.errors.join('\n'));console.log('Shared consumer/warm navigation PASS: profile/details, farm/crop picker, work and location, three grammar/vocabulary round trips at two sizes.');
}finally{fs.writeFileSync(path.join(out,'shared-consumers.json'),JSON.stringify(report,null,2)+'\n');await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
