// Reuse the hash-guarded real-route QA bundle to exercise failed and incompatible reads.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),out=process.env.AGRICULTURE_QA_OUTPUT;
const {chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));
const reportPath=path.join(root,'docs/ssw-workspace/agriculture/parallel-29/browser-qa.json');
const prior=JSON.parse(fs.readFileSync(reportPath));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const [p,h]of Object.entries(prior.guardedInputSha256))assert.equal(sha(path.join(root,p)),h);
(async()=>{
 const server=http.createServer((req,res)=>{const f=req.url==='/entry.js'?'entry.js':req.url==='/japanese.otf'?'japanese.otf':'index.html';res.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.otf')?'font/otf':'text/html');res.end(fs.readFileSync(path.join(out,f)));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.AGRICULTURE_QA_CHROMIUM,headless:true,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']});
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.getByRole('button',{name:'特定技能2号',exact:true}).click();await page.getByRole('button',{name:'総合練習',exact:true}).click();
  const key='@japan_app_agriculture:exam:v1:agri20261028:2:agr-2-m02';
  const other='@japan_app_agriculture:exam:v1:agri20261028:1:agr-1-m01';
  await page.evaluate(k=>localStorage.setItem(k,'other-bank-sentinel'),other);
  const enter=()=>page.getByRole('button',{name:'開く・再開',exact:true}).nth(1).click();
  await page.evaluate(()=>window.__failRead=true);await enter();
  await page.getByRole('button',{name:'読み込みを再試行',exact:true}).waitFor();
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),null);
  await page.evaluate(()=>window.__failRead=false);await page.getByRole('button',{name:'読み込みを再試行',exact:true}).click();
  await page.getByRole('button',{name:'提出する',exact:true}).waitFor();
  await page.getByRole('button').filter({hasText:/^1\. /}).first().click();
  await page.waitForFunction(k=>JSON.parse(localStorage.getItem(k)||'null')?.answers[0]===0,key);
  const valid=await page.evaluate(k=>localStorage.getItem(k),key);
  for(const [kind,value]of [['malformed','{broken'],['staleRevision',JSON.stringify({...JSON.parse(valid),contentRevision:'old-revision'})]]){
   await page.getByRole('button',{name:'Back',exact:true}).click();
   await page.evaluate(({key,value})=>localStorage.setItem(key,value),{key,value});await enter();
   await page.getByRole('button',{name:'読み込みを再試行',exact:true}).waitFor();
   assert((await page.locator('body').innerText()).includes('記録は上書きしていません。'));
   assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),value,kind);
   await page.evaluate(({key,valid})=>localStorage.setItem(key,valid),{key,valid});
   await page.getByRole('button',{name:'読み込みを再試行',exact:true}).click();await page.getByRole('button',{name:'提出する',exact:true}).waitFor();
  }
  assert.equal(await page.evaluate(k=>localStorage.getItem(k),other),'other-bank-sentinel');assert.deepEqual(errors,[]);
  for(const [p,h]of Object.entries(prior.guardedInputSha256))assert.equal(sha(path.join(root,p)),h);
  const result={status:'PASS',examId:'agr-2-m02',readFailureRetry:true,malformedAttemptPreserved:true,staleRevisionPreserved:true,otherLevelBankSentinelPreserved:true,bundleSha256:sha(path.join(out,'entry.js')),inputHashes:prior.guardedInputSha256,adapters:prior.adapters,nativeDeviceTested:false,productionExpoTested:false};
  fs.writeFileSync(path.join(root,'docs/ssw-workspace/agriculture/parallel-29/recovery-qa.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,inputHashes:'24 unchanged files'}));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
