import fs from 'node:fs';
import http from 'node:http';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const {chromium}=await import(process.env.KAIGO_PLAYWRIGHT_MODULE);
const root=fs.realpathSync(new URL('../../../../../',import.meta.url));
const out=root+'/docs/ssw-workspace/kaigo/runtime-tests/2026-10-11-week1-art';
const publicDir=process.env.KAIGO_BROWSER_PUBLIC;
const manifest=JSON.parse(fs.readFileSync(out+'/asset-review.json','utf8'));
const coverCaptions=[null,
 'Người sử dụng nêu lựa chọn; nhân viên lắng nghe và phối hợp với nhóm chuyên môn trong phạm vi vai trò của mình.',
 'Điều kiện tham gia và hỗ trợ phù hợp giúp giữ sự tôn trọng và hoạt động có ý nghĩa với từng người.',
 'Bác giữ phần muốn tự làm; nhân viên hỏi nhu cầu và chỉ hỗ trợ phần đã thống nhất.',
 'Nhân viên gõ cửa và chờ trước khi vào. Xin phép, che chắn và chia sẻ đúng phạm vi giúp giữ sự riêng tư trong chăm sóc.',
 'Bác cùng nhân viên và người phụ trách trao đổi kế hoạch dịch vụ, bắt đầu từ mong muốn và phần bác muốn tham gia.',
 'Nhân viên làm khô tay bằng giấy sau rửa, vùng cổ tay không bị trang sức che. Hình nhắc một điểm kiểm; không mô tả đầy đủ quy trình vệ sinh tay.',
 'Nhân viên trao đổi sức khỏe, giới hạn hỗ trợ và điều kiện chuẩn bị trước khi làm việc.'];
assert.equal(manifest.assets.length,33);assert.equal(manifest.weekAssets.length,73);
for(const a of manifest.assets){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(root+'/'+a.path)).digest('hex'),a.sha256);}
const server=http.createServer((req,res)=>{try{
 const name=req.url.split('?')[0],file=publicDir+(name==='/'?'/index.html':name);
 res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.ttf')?'font/ttf':'text/html');res.end(fs.readFileSync(file));
}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;const errors=[],views=[],screenshots=[];
try{
 browser=await chromium.launch({executablePath:process.env.KAIGO_CHROMIUM_PATH,headless:true,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});
 const page=await browser.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
 for(const size of [{width:390,height:844},{width:768,height:1024},{width:844,height:390}]){
  await page.setViewportSize(size);await page.goto('http://127.0.0.1:'+server.address().port);
  const days=[];
  for(let day=1;day<=7;day++){
   await page.getByTestId('kaigo-calendar-day-'+day).click();
   const assets=manifest.weekAssets.filter(a=>a.day===day);
   await page.getByTestId('kaigo-reading-section-'+assets[0].sectionId).waitFor({state:'attached'});
   assert.equal(await page.locator('[data-testid^="kaigo-reading-section-"]').count(),assets.length);
   assert.equal(await page.locator('[data-testid^="kaigo-section-art-"]').count(),assets.length);
   assert.equal(await page.getByText(coverCaptions[day],{exact:true}).count(),1);
   if(day===5){
    assert.equal(await page.getByText('Bác cùng nhân viên và người phụ trách trao đổi kế hoạch dịch vụ, bắt đầu từ mong muốn và phần bác muốn tham gia.',{exact:true}).count(),1);
    assert.equal(await page.getByText('Bác cân nhắc vẽ màu hoặc nghe âm thanh; nhân viên lắng nghe để bác tự chọn. Cần hỗ trợ thao tác vẫn có thể giữ quyền lựa chọn.',{exact:true}).count(),0);
   }
   const pictures=[];
   for(const asset of assets){
    const section=page.getByTestId('kaigo-reading-section-'+asset.sectionId),loc=section.getByTestId('kaigo-section-art-'+asset.sectionId);
    await loc.scrollIntoViewIfNeeded();await loc.locator('img').evaluate(el=>el.decode());
    const box=await loc.boundingBox();assert(box&&box.width>0&&box.height>0);
    assert(Math.abs(box.width/box.height-asset.width/asset.height)<.02,asset.sectionId);
    if(size.width>size.height)assert(box.height<=size.height-169,asset.sectionId);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    const decoded=await loc.locator('img').evaluate(el=>({width:el.naturalWidth,height:el.naturalHeight}));
    assert.equal(decoded.width,asset.width);assert.equal(decoded.height,asset.height);
    assert(await section.getByText(asset.captionVi,{exact:true}).count()>=1);
    pictures.push({sectionId:asset.sectionId,...box,decoded:true});
    if(asset.sectionId.endsWith('-summary')||(size.width===390&&['kaigo-depth-01','kaigo-depth-02','kaigo-depth-03','kaigo-foundation-05-dialogue','kaigo-foundation-06-dialogue','kaigo-foundation-07-dialogue'].includes(asset.sectionId))){
     const name=asset.sectionId+'-'+size.width+'.png';await page.screenshot({path:out+'/'+name});screenshots.push(name);
    }
   }
   assert.equal(await page.locator('input,textarea').count(),0);
   days.push({day,sectionImages:assets.length,pictures});
   await page.getByRole('button',{name:'戻る',exact:true}).click();
   await page.getByTestId('kaigo-calendar-day-'+day).waitFor({state:'attached'});
  }
  views.push({...size,days});console.log(JSON.stringify({viewport:size,checkedImages:days.reduce((n,d)=>n+d.pictures.length,0)}));
 }
 assert.deepEqual(errors,[]);assert.equal(screenshots.length,27);
 const inputs=['src/components/kaigo/WeeklyKaigo.tsx','src/data/kaigo/paragraph-illustrations.ts','src/data/kaigo/lesson-illustrations.ts',...manifest.weekAssets.map(a=>a.path)];
 const evidence={status:'PASS_WEEK1_73_SECTION_IMAGES_RN_WEB',views,pageErrors:errors,newImages:33,weekImages:73,screenshots,
  inputSha256:Object.fromEntries(inputs.map(p=>[p,crypto.createHash('sha256').update(fs.readFileSync(root+'/'+p)).digest('hex')])),
  fullParagraphArtComplete:false,nativeDeviceTested:false,fullExpoRouterTested:false,humanReviewed:false,domainReviewed:false,rightsReviewed:false};
 fs.writeFileSync(out+'/evidence.json',JSON.stringify(evidence,null,2)+'\n');
 console.log(JSON.stringify({status:evidence.status,viewports:views.length,decodedImageChecks:views.reduce((n,v)=>n+v.days.reduce((m,d)=>m+d.pictures.length,0),0),screenshots:screenshots.length,pageErrors:errors}));
}finally{await browser?.close();await new Promise(r=>server.close(r));}
