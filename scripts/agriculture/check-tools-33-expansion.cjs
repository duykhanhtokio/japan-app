// Focused real-route expansion checks using the final hash-guarded equipment bundle.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),out=process.env.AGRICULTURE_QA_OUTPUT;
const captureOnly=process.env.AGRICULTURE_QA_CAPTURE_ONLY==='1';
const {chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
const report=JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/agriculture/tools-33/browser-qa.json')));
const registry=JSON.parse(fs.readFileSync(path.join(root,'src/data/agriculture/recognition-images.json')));
const images=registry.images.filter(x=>x.assetPath.startsWith('assets/agriculture/tools/'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'src/data/agriculture/course-manifest.json')));
const lessonId='agr-safety-maintenance-tools',week=manifest.levels['2'].weeks.find(w=>w.lessonIds.includes(lessonId));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const [p,h]of Object.entries(report.guardedInputSha256))assert.equal(sha(path.join(root,p)),h);
(async()=>{
 const server=http.createServer((req,res)=>{const relative=req.url.startsWith('/equipment/')?'equipment/'+path.basename(req.url):req.url==='/entry.js'?'entry.js':req.url==='/japanese.otf'?'japanese.otf':/^\/Agri\w+\.woff2$/.test(req.url)?path.basename(req.url):'index.html';const p=path.join(out,relative);res.setHeader('Content-Type',p.endsWith('.png')?'image/png':p.endsWith('.js')?'application/javascript':p.endsWith('.otf')?'font/otf':p.endsWith('.woff2')?'font/woff2':'text/html');res.end(fs.readFileSync(p));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.AGRICULTURE_QA_CHROMIUM,headless:true,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});
  const page=await browser.newPage({viewport:{width:844,height:390}}),errors=[],cases=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/?language=ja`);
  await page.getByRole('button',{name:'特定技能2号',exact:true}).click();await page.getByRole('button',{name:new RegExp('^第'+week.number+'週')}).click();await page.getByTestId('agri-day-2-'+(week.lessonIds.indexOf(lessonId)+1)).click();await page.getByRole('button',{name:'完了する',exact:true}).waitFor();
  for(const figure of captureOnly?[]:images){
   const picture=page.locator('[data-testid="'+figure.id+'-image"] img, img[data-testid="'+figure.id+'-image"]').first();
   const button=page.getByTestId(figure.id+'-expand');await button.scrollIntoViewIfNeeded();assert(await button.isVisible());
   const before=await picture.evaluate(im=>im.getBoundingClientRect().width);
   await button.click();const expanded=await picture.evaluate(async im=>{await im.decode();const r=im.getBoundingClientRect();return {width:r.width,height:r.height,naturalWidth:im.naturalWidth,src:im.currentSrc};});
   assert(expanded.width>before+8);assert.equal(expanded.naturalWidth,figure.width);assert(expanded.src.includes(figure.assetSha256));assert(Math.abs(expanded.width/expanded.height-1)<0.01);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
   await picture.scrollIntoViewIfNeeded();const filename=figure.id+'-expanded-844x390.png';await page.screenshot({path:path.join(out,filename)});
   if(figure.assetKey==='tool-screwdrivers'){await picture.evaluate(im=>{let p=im.parentElement;while(p&&!(p.scrollHeight>p.clientHeight+1&&['auto','scroll'].includes(getComputedStyle(p).overflowY)))p=p.parentElement;if(!p)throw Error('No reader scroll container');const r=im.getBoundingClientRect(),c=p.getBoundingClientRect();p.scrollTop+=r.bottom-c.bottom+12;});await page.screenshot({path:path.join(out,'screwdrivers-expanded-tip-detail-844x390.png')});}
   await button.scrollIntoViewIfNeeded();await button.click();assert(Math.abs(await picture.evaluate(im=>im.getBoundingClientRect().width)-before)<1);cases.push({assetId:figure.id,collapsedWidth:before,expandedWidth:expanded.width,screenshot:filename});
  }
  const defaultCaptures=[];if(captureOnly){for(const [width,height]of [[390,844],[844,390]]){await page.setViewportSize({width,height});const figure=images[0],picture=page.locator('[data-testid="'+figure.id+'-image"] img, img[data-testid="'+figure.id+'-image"]').first();await picture.scrollIntoViewIfNeeded();const box=await picture.boundingBox();assert(box&&box.height<=height&&box.x>=-1&&box.x+box.width<=width+1);const file='equipment-default-'+width+'x'+height+'.png';await page.screenshot({path:path.join(out,file)});defaultCaptures.push(file);}}
  const done=page.getByRole('button',{name:'完了する',exact:true});await done.scrollIntoViewIfNeeded();assert(await done.isVisible());assert.deepEqual(errors,[]);
  for(const [p,h]of Object.entries(report.guardedInputSha256))assert.equal(sha(path.join(root,p)),h);
  const result={status:'PASS',defaultCaptures,expandedAndCollapsedImages:cases.length,viewport:{width:844,height:390},cases,inputHashesUnchanged:true,guardedInputCount:Object.keys(report.guardedInputSha256).length,actualOriginalPngBytes:true,noHorizontalOverflow:true,completionReachable:true,adapters:report.adapters,nativeDeviceTested:false,productionExpoTested:false};
  fs.writeFileSync(path.join(root,'docs/ssw-workspace/agriculture/tools-33/'+(captureOnly?'default-capture-qa.json':'expansion-qa.json')),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,cases:cases.length}));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
