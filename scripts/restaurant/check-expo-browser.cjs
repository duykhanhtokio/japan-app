/** Execute the isolated real Expo web production export; this is not native execution. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const qa=process.env.RESTAURANT_EXPO_QA_DIR,chromiumPath=process.env.RESTAURANT_QA_CHROMIUM;
if(!qa||!chromiumPath)throw Error('Set RESTAURANT_EXPO_QA_DIR and RESTAURANT_QA_CHROMIUM');
const {chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
const dist=path.join(qa,'metro-project/dist');
(async()=>{
 const server=http.createServer((req,res)=>{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=path.resolve(dist,'.'+name);if(!file.startsWith(dist+path.sep)&&file!==dist){res.writeHead(403);res.end();return;}if(name==='/')file=path.join(dist,'index.html');if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.html')?'text/html':'application/octet-stream');fs.createReadStream(file).pipe(res);});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({executablePath:chromiumPath,headless:true,args:['--no-sandbox','--disable-gpu']});const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));const start=Date.now();await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'load',timeout:60000});await page.waitForFunction(()=>window.__restaurantExpoDiagnostic,{timeout:60000});const diagnostic=await page.evaluate(()=>window.__restaurantExpoDiagnostic);assert.equal(diagnostic.status,'PASS');assert.equal(diagnostic.lessons,120);assert.equal(diagnostic.questions,984);assert.equal(diagnostic.lessonTranslations,1440);assert.equal(diagnostic.questionTranslations,11808);assert.deepEqual(errors,[]);
  const report={status:'PRODUCTION_EXPO_WEB_MODULE_EXECUTION_PASS',diagnostic,browser:await browser.version(),navigationToDiagnosticMs:Date.now()-start,measurementScope:'One cold isolated diagnostic navigation in this environment; not app startup/device performance benchmark.',pageErrors:errors,nativeExecution:false,realDevice:false};fs.writeFileSync(path.join(qa,'results/expo-web-runtime.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
