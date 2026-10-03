// Real production web layout checks; native rendering still needs Simulator QA.
const fs=require('fs');
const path=require('path');
const {chromium}=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'));
const output=path.join(process.cwd(),'docs/ui-workspace/home-measured-cover-2026-10-03');
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({executablePath:'/tmp/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={platform:'production-web',errors:[],views:[]};
 try {
  const page=await browser.newPage();
  page.on('pageerror',e=>report.errors.push(e.message));
  for(const [width,height] of [[360,800],[430,932],[768,1024],[1366,768],[932,430],[1024,768]]){
   await page.setViewportSize({width,height});
   if(!report.views.length)await page.goto('http://127.0.0.1:8107/home',{waitUntil:'domcontentloaded',timeout:60000});
   await page.getByTestId('home-artwork-筆記学習').waitFor({timeout:60000});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(200);
   const cards=await page.evaluate(()=>['筆記学習','会話練習','特定技能学習'].map(name=>{
    const box=document.querySelector(`[data-testid="home-mode-${name}"]`).getBoundingClientRect();
    const image=document.querySelector(`[data-testid="home-artwork-${name}"]`).getBoundingClientRect();
    const tolerance=.1;
    return {name,card:{width:box.width,height:box.height},image:{width:image.width,height:image.height,left:image.left-box.left,top:image.top-box.top},covers:image.left<=box.left+tolerance&&image.top<=box.top+tolerance&&image.right>=box.right-tolerance&&image.bottom>=box.bottom-tolerance,aspectPreserved:Math.abs(image.width/image.height-3)<.001};
   }));
   report.views.push({width,height,cards});
   if(cards.length!==3||cards.some(c=>!c.covers||!c.aspectPreserved))throw Error(`Artwork coverage failed at ${width}x${height}`);
   await page.screenshot({type:"jpeg",quality:65,path:path.join(output,`home-${width}x${height}.jpg`)});
  }
  if(report.errors.length)throw Error(report.errors.join('\n'));
  console.log(`Home measured coverage PASS: ${report.views.length} viewports, 18 card bounds, responsive resize; zero page errors. Native acceptance pending.`);
 } finally {
  fs.writeFileSync(path.join(output,'runtime.json'),JSON.stringify(report,null,2)+'\n');
  await browser.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1});
