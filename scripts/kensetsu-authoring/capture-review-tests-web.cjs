const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'));
const out=process.env.KENSETSU_QA_OUTPUT,bank=JSON.parse(fs.readFileSync('src/data/kensetsu/review-tests.ja.json'));
(async()=>{
const server=http.createServer((q,r)=>{const f=q.url.startsWith('/entry.js')?'entry.js':q.url.startsWith('/font.ttf')?'font.ttf':'index.html';r.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.ttf')?'font/ttf':'text/html');r.end(fs.readFileSync(path.join(out,f)));}).listen(0,'127.0.0.1');await new Promise(r=>server.on('listening',r));
const browser=await chromium.launch({executablePath:process.env.KENSETSU_QA_CHROMIUM,args:['--no-sandbox','--disable-gpu','--disable-software-rasterizer','--use-gl=disabled','--disable-dev-shm-usage','--no-zygote','--single-process']});
const page=await browser.newPage();const url='http://127.0.0.1:'+server.address().port;
await page.goto(url);
const exam=bank.exams[0],key='@japan_app_kensetsu_review:v2:exam-qa:1:building:'+exam.id;
for(const submitted of [false,true]){
const attempt={version:1,examId:exam.id,contentRevision:exam.revision,questionIds:exam.questions.map(q=>q.id),answers:exam.questions.map(q=>q.correctIndex),currentQuestion:0,submitted};
await page.evaluate(({key,attempt})=>localStorage.setItem(key,JSON.stringify(attempt)),{key,attempt});await page.goto(url);await page.getByTestId('kensetsu-test-exam-01').click();await page.getByTestId('kensetsu-test-question').waitFor();
assert.equal(await page.getByTestId('kensetsu-test-explanation').count(),submitted?1:0);
for(const [w,h,name] of [[320,568,'phone'],[768,1024,'tablet'],[932,430,'landscape']]){
await page.setViewportSize({width:w,height:h});await page.evaluate(()=>document.fonts.ready);await page.getByTestId('kensetsu-test-content').evaluate(e=>e.scrollTop=0);
assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
await page.screenshot({path:path.join(out,name+(submitted?'-result':'')+'.png')});
}}
console.log('PASS: six stable runner screenshots; before/after submission; no overflow');
await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});
