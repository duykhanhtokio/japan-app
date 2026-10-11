import fs from 'node:fs';import http from 'node:http';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const {chromium}=await import(process.env.KAIGO_PLAYWRIGHT_MODULE||createRequire(import.meta.url).resolve('playwright'));
const out=new URL('.',import.meta.url).pathname;const publicDir=process.env.KAIGO_BROWSER_PUBLIC;
const allocation=JSON.parse(fs.readFileSync('src/data/kaigo/weekly-art-allocation.json'));const validation=JSON.parse(fs.readFileSync('docs/ssw-workspace/kaigo/reviews/WEEKLY_ART_REDISTRIBUTION_2026-10-11.json'));const assets=new Map(validation.assets.map(a=>[a.id,a]));
const server=http.createServer((req,res)=>{try{const p=publicDir+(req.url==='/'?'/index.html':req.url);res.setHeader('Content-Type',p.endsWith('.js')?'application/javascript':p.endsWith('.ttf')?'font/ttf':'text/html');res.end(fs.readFileSync(p));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.KAIGO_CHROMIUM_PATH||'/tmp/chromium',headless:true,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));const views=[];const screenshots=[];
try{
 for(const size of [{width:390,height:844},{width:768,height:1024},{width:844,height:390}]){
  await page.setViewportSize(size);await page.goto('http://127.0.0.1:'+server.address().port);await page.getByTestId('kaigo-week-1').waitFor();
  const days=size.width===390?allocation.assignments:allocation.assignments.filter(a=>a.day%7===1||a.day===176);
  for(const a of days){
   await page.getByTestId('kaigo-week-'+a.week).click();await page.getByTestId('kaigo-calendar-day-'+a.day).click();
   const loc=page.getByTestId('kaigo-day-art-'+a.day);await loc.waitFor();await loc.locator('img').evaluate(el=>el.decode());
   assert.equal(await page.locator('[data-testid^="kaigo-day-art-"]').count(),1);assert.equal(await page.locator('[data-testid^="kaigo-section-art-"]').count(),0);
   const image=await loc.locator('img').evaluate(el=>({width:el.naturalWidth,height:el.naturalHeight,src:el.src}));assert.equal(crypto.createHash('sha256').update(Buffer.from(image.src.split(',')[1],'base64')).digest('hex'),assets.get(a.artId).sha256);
   const box=await loc.boundingBox();assert(box&&box.width>0);assert(Math.abs(box.width/box.height-image.width/image.height)<.02);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if([1,36,66,99,144,171,176].includes(a.day)||size.width!==390&&[1,36,176].includes(a.day)){await loc.scrollIntoViewIfNeeded();const name=`day-${a.day}-${size.width}.png`;await page.screenshot({path:out+name});screenshots.push(name);}
   views.push({day:a.day,week:a.week,artId:a.artId,viewport:size,decoded:true,correctSource:true,aspectRatioPreserved:true,overflow:false});
   await page.getByTestId('kaigo-reading-back').click();
  }
 }
 assert.equal(errors.length,0);assert.equal(new Set(views.map(v=>v.day)).size,176);
 fs.writeFileSync(out+'runtime-report.json',JSON.stringify({status:'PASS_ACTUAL_RN_WEB_ART_REDISTRIBUTION',studyDaysChecked:176,viewChecks:views.length,views,screenshots,pageErrors:errors,nativeDeviceTested:false},null,2)+'\n');console.log(JSON.stringify({status:'PASS',days:176,viewChecks:views.length,screenshots:screenshots.length,pageErrors:errors.length}));
}finally{await browser.close();server.close();}
