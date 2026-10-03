// Visual fixture ONLY: serve a scratch export whose six idle animal slots were
// changed to ready. Never use these results as natural production timing proof.
const fs = require('fs');
const path = require('path');
const { chromium } = require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright'));
const output = process.env.JAPAN_UI_OUTPUT_DIR || path.join(process.cwd(), 'docs/ui-workspace/royal-collect-2026-10-03');
const base = process.env.JAPAN_UI_BASE_URL || 'http://127.0.0.1:8099';
fs.mkdirSync(output, { recursive: true });
(async () => {
 const browser = await chromium.launch({executablePath:process.env.JAPAN_UI_BROWSER_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={runtime:'production-web-with-ready-slot-fixture',fixture:'six initial idle animal slots set ready in scratch export only',errors:[],views:[]};
 try {
  for(const viewport of [{width:360,height:800},{width:430,height:932},{width:768,height:1024},{width:1366,height:768}]) {
   const page=await browser.newPage({viewport});page.on('pageerror',e=>report.errors.push(e.message));
   await page.goto(base+'/game',{waitUntil:'domcontentloaded',timeout:60000});
   await page.getByRole('button',{name:'ショップ',exact:true}).waitFor({timeout:60000});
   await page.evaluate(()=>document.fonts.ready);
   const view={viewport,collections:[]};report.views.push(view);
   for(const [area,label] of [['鶏小屋','収穫'],['牛舎','搾乳']]) {
    await page.getByRole('button',{name:area,exact:true}).click();
    const collect=page.getByText(label,{exact:true}).first();await collect.waitFor();
    await page.waitForTimeout(250);
    await page.screenshot({path:path.join(output,`${area==='鶏小屋'?'chicken':'cow'}-ready-${viewport.width}x${viewport.height}.png`)});
    const geometry=await collect.evaluate(el=>{const r=el.getBoundingClientRect(),p=el.parentElement,s=getComputedStyle(p);return {text:{x:r.x,y:r.y,width:r.width,height:r.height},background:s.backgroundColor,border:s.borderTopWidth,shadow:s.boxShadow,images:p.querySelectorAll('img').length};});
    if(geometry.text.height>25)throw Error('Collection label wrapped');
    if(geometry.background!=='rgba(0, 0, 0, 0)'||geometry.images<1)throw Error('Collection badge is not transparent raster');
    await collect.click();await page.getByText('えさ',{exact:true}).first().waitFor();
    view.collections.push({area,geometry,collectionReturnedToFeed:true});
    await page.getByRole('button',{name:'戻る',exact:true}).click();
    await page.getByRole('button',{name:'ショップ',exact:true}).waitFor();
   }
   await page.getByRole('button',{name:'ショップ',exact:true}).click();
   const notice=page.getByText('同じスロットに装備すると自動で入れ替わります',{exact:true});await notice.waitFor();
   await page.waitForTimeout(250);
   await page.screenshot({path:path.join(output,`shop-notice-${viewport.width}x${viewport.height}.png`)});
   view.notice=await notice.evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,color:getComputedStyle(el).color,background:getComputedStyle(el.parentElement).backgroundColor};});
   await page.close();
  }
  fs.writeFileSync(path.join(output,'runtime.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report));if(report.errors.length)throw Error('Page errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
