import fs from 'node:fs';
import http from 'node:http';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const {chromium}=await import(process.env.KAIGO_PLAYWRIGHT_MODULE);
const root=fs.realpathSync(new URL('../../../../../',import.meta.url));
const out=root+'/docs/ssw-workspace/kaigo/runtime-tests/2026-10-11-day2-art';
const publicDir=process.env.KAIGO_BROWSER_PUBLIC;
const manifest=JSON.parse(fs.readFileSync(out+'/asset-review.json','utf8'));
const server=http.createServer((req,res)=>{try{
 const name=req.url.split('?')[0],file=publicDir+(name==='/'?'/index.html':name);
 res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.ttf')?'font/ttf':'text/html');
 res.end(fs.readFileSync(file));
}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;const errors=[],views=[];
try{
 browser=await chromium.launch({executablePath:process.env.KAIGO_CHROMIUM_PATH,headless:true,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});
 const page=await browser.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
 for(const size of [{width:390,height:844},{width:768,height:1024},{width:844,height:390}]){
  await page.setViewportSize(size);await page.goto('http://127.0.0.1:'+server.address().port);
  await page.getByTestId('kaigo-calendar-day-2').click();
  assert.equal(await page.locator('[data-testid^="kaigo-reading-section-"]').count(),10);
  assert.equal(await page.locator('[data-testid^="kaigo-section-art-"]').count(),10);
  const pictures=[];
  for(const asset of manifest.assets){
   const loc=page.getByTestId('kaigo-section-art-'+asset.sectionId);await loc.scrollIntoViewIfNeeded();
   await loc.locator('img').evaluate(el=>el.decode());
   const box=await loc.boundingBox();assert(box&&box.width>0&&box.height>0);
   assert(Math.abs(box.width/box.height-asset.width/asset.height)<.02,asset.sectionId);
   if(size.width>size.height)assert(box.height<=size.height-169,asset.sectionId);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const image=await loc.locator('img').evaluate(el=>({width:el.naturalWidth,height:el.naturalHeight}));
   assert.equal(image.width,asset.width);assert.equal(image.height,asset.height);
   pictures.push({sectionId:asset.sectionId,...box,decoded:true});
   if(['kaigo-foundation-02-summary','kaigo-foundation-02-dialogue','kaigo-language-transfer-252'].includes(asset.sectionId))
    await page.screenshot({path:out+`/${asset.sectionId}-${size.width}.png`});
  }
  assert.equal(await page.locator('input,textarea').count(),0);
  views.push({...size,pictures});
 }
 assert.deepEqual(errors,[]);
 const inputs=['src/data/kaigo/paragraph-illustrations.ts',...manifest.assets.map(a=>a.path)];
 const evidence={status:'PASS_DAY2_TEN_SECTION_IMAGES_RN_WEB',views,pageErrors:errors,day2SpecificImages:10,
  inputSha256:Object.fromEntries(inputs.map(p=>[p,crypto.createHash('sha256').update(fs.readFileSync(root+'/'+p)).digest('hex')])),
  fullParagraphArtComplete:false,nativeDeviceTested:false,fullExpoRouterTested:false,humanReviewed:false};
 fs.writeFileSync(out+'/evidence.json',JSON.stringify(evidence,null,2)+'\n');
 console.log(JSON.stringify({status:evidence.status,views:views.length,decodedImageChecks:views.reduce((n,v)=>n+v.pictures.length,0),pageErrors:errors}));
}finally{await browser?.close();await new Promise(r=>server.close(r));}
