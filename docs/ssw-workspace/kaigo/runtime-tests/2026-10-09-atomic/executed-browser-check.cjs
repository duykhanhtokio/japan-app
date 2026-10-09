const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require(process.env.KAIGO_PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'../../../../..'),out=__dirname;
const data=JSON.parse(fs.readFileSync(root+'/src/data/kaigo/atomic-supplements.json'));
(async()=>{
 const errors=[],server=require('http').createServer((req,res)=>{const file=path.join(process.env.KAIGO_BROWSER_PUBLIC||'/tmp/kaigo-atomic-web',req.url==='/'?'index.html':req.url.split('?')[0]);try{res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.html')?'text/html':file.endsWith('.ttf')?'font/ttf':'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
 await new Promise(r=>server.listen(8790,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.KAIGO_CHROMIUM_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8790');
 const checked=[];
 for(const day of data.days){
  await page.reload();await page.getByTestId('kaigo-atomic-day-'+day.day).click();
  for(const id of day.unitIds){
   const u=data.units.find(x=>x.id===id),card=page.getByTestId(u.id);await card.waitFor();
   for(const p of u.points)assert.equal(await page.getByTestId(p.id).innerText(),p.explanationVi);
   const input=page.getByTestId('kaigo-probe-'+u.probe.id),panel=input.locator('..');
   assert(!(await panel.innerText()).includes(u.probe.expectedVi));
   await input.fill('Tôi kiểm dữ kiện và giới hạn hỗ trợ.');await panel.getByRole('button',{name:'Đối chiếu ý kiến thức',exact:true}).click();
   assert((await panel.innerText()).includes(u.probe.expectedVi));checked.push({id,points:u.points.length,reveal:true});
  }
  await page.reload();await page.getByTestId('kaigo-atomic-day-'+day.day).click();
  for(const id of day.unitIds){const u=data.units.find(x=>x.id===id);assert.equal(await page.getByTestId('kaigo-probe-'+u.probe.id).inputValue(),'Tôi kiểm dữ kiện và giới hạn hỗ trợ.');assert((await page.locator('body').innerText()).includes(u.probe.expectedVi));}
  console.log('DAY PASS',day.day);
 }
 const base=JSON.parse(fs.readFileSync(root+'/src/data/kaigo/content.json')),ledger=JSON.parse(fs.readFileSync(root+'/docs/ssw-workspace/kaigo/reviews/whole-document-ledger-2026-10-09.json'));const prior=[];
 for(const lesson of base.lessons){
  await page.reload();await page.getByRole('button',{name:'Tuần '+Math.ceil(lesson.day/7),exact:true}).click();await page.getByTestId('kaigo-day-'+lesson.day).click();
  let text=await page.locator('body').innerText();for(const part of lesson.knowledgeSectionsVi)assert(text.includes(part),'Missing section '+lesson.id);
  for(const u of lesson.knowledgeDepthUnits||[]){assert(text.includes(u.knowledgeVi));assert(text.includes(u.methodVi));assert(text.includes(u.mistakesVi));assert(text.includes(u.limitsVi));}
  if(lesson.languageTasks?.length){await page.getByRole('button',{name:'Đọc và hiểu',exact:true}).click();for(const t of lesson.languageTasks){await page.getByTestId('kaigo-probe-'+t.id).waitFor();assert((await page.locator('body').innerText()).includes(t.promptVi));}}
  await page.getByRole('button',{name:'Từ và cách nói',exact:true}).click();text=await page.locator('body').innerText();for(const t of base.terms.filter(t=>lesson.termIds.includes(t.id)))assert(text.includes(t.termJa)&&text.includes(t.meaningVi),'Missing term '+t.id);
  prior.push({id:lesson.id,day:lesson.day,depthUnits:lesson.knowledgeDepthUnits?.length||0,languageTasks:lesson.languageTasks?.length||0});console.log('BASE LESSON PASS',lesson.day);
 }
 const sourceTermsVerified=ledger.lexicalRecords.filter(t=>t.days.length&&t.runtimeTermIds.length).length;assert.equal(sourceTermsVerified,287);
 const views=[];for(const [name,width,height]of [['phone',390,844],['tablet',768,1024],['landscape',844,390]]){
  await page.setViewportSize({width,height});await page.reload();await page.getByTestId('kaigo-atomic-day-57').click();await page.evaluate(()=>document.fonts.ready);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2));await page.screenshot({path:out+'/supplements-'+name+'.png'});views.push({name,width,height,horizontalOverflow:false});
 }
 await page.getByRole('button',{name:'Xem bài liên quan · Ngày 8',exact:true}).first().click();await page.getByRole('button',{name:'Kiến thức',exact:true}).waitFor();
 assert.equal(checked.length,data.units.length);assert.equal(errors.length,0,errors.join(';'));
 fs.writeFileSync(out+'/browser-evidence.json',JSON.stringify({status:'PASS',scope:'Actual KaigoCourse compiled as React Native Web; expo-image mapped to RN Image. Not full Expo Router or installed native binary.',units:checked,points:checked.reduce((n,x)=>n+x.points,0),days:data.days.length,persistedAfterReload:true,parentNavigation:true,baseLessons:prior,sourceTermRecordsLinkedAndRendered:sourceTermsVerified,viewports:views,pageErrors:errors,nativeDeviceTested:false,releaseReady:false},null,2)+'\n');await browser.close();server.close();
})().catch(e=>{console.error(e.stack);process.exit(1)});
