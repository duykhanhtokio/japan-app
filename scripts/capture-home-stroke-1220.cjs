const fs=require('fs'),path=require('path');
const {chromium}=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'));
const out=path.join(process.cwd(),'docs/ui-workspace/home-stroke-1220-2026-10-03');
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:'/tmp/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const report={errors:[],views:[],diagnostic:'Magenta card background and cyan artwork reveal uncovered areas between artwork and gold stroke.'};
 try{for(const [width,height] of [[360,800],[430,932],[768,1024],[1366,768]]){
 const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto('http://127.0.0.1:8119/home',{waitUntil:'domcontentloaded'});await page.getByText('筆記学習',{exact:true}).waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);
 const cards=await page.evaluate(()=>['筆記学習','会話練習','特定技能学習'].map(name=>{
  const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}};
  return {name,card:rect(document.querySelector(`[data-testid="home-mode-${name}"]`)),clip:rect(document.querySelector(`[data-testid="home-artwork-viewport-${name}"]`)),image:rect(document.querySelector(`[data-testid="home-artwork-${name}"]`))};
 }));
 for(const {card,clip,image} of cards){
  if(Math.abs(clip.width/clip.height-3)>.005)throw Error('Artwork ratio changed');
  if(clip.x-card.x>5||clip.y-card.y>5)throw Error('Artwork still inset at leaf tips');
  if(image.x>clip.x+.1||image.y>clip.y+.1||image.x+image.width<clip.x+clip.width-.1||image.y+image.height<clip.y+clip.height-.1)throw Error('Artwork does not cover clip');
 }
 await page.screenshot({type:'jpeg',quality:80,path:path.join(out,`home-${width}x${height}.jpg`)});
 await page.evaluate(()=>{
  for(const card of document.querySelectorAll('[data-testid^="home-mode-"]')){card.style.backgroundColor='#ff00ff';card.children[1].style.visibility='hidden';}
  for(const clip of document.querySelectorAll('[data-testid^="home-artwork-viewport-"]')){clip.style.backgroundColor='#00ffff';for(const child of clip.children)child.style.visibility='hidden';}
 });
 await page.screenshot({path:path.join(out,`diagnostic-${width}x${height}.png`)});
 for(let index=0;index<cards.length;index++){await page.getByTestId(`home-mode-${cards[index].name}`).screenshot({path:path.join(out,`edge-${width}-${index}.png`)});}
 report.views.push({width,height,cards});await page.close();
 }if(report.errors.length)throw Error(report.errors.join('\n'));
 console.log('Home stroke geometry/web runtime PASS: four sizes, original 3:1 artwork, stroke overlap, no page errors. Pixel diagnostics pending.');
 }finally{fs.writeFileSync(path.join(out,'runtime.json'),JSON.stringify(report,null,2)+'\n');await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
