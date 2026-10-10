import fs from 'node:fs';import http from 'node:http';import assert from 'node:assert/strict';import crypto from 'node:crypto';
const {default:c}=await import(process.env.KAIGO_CHROMIUM_MODULE),{chromium}=await import(process.env.KAIGO_PLAYWRIGHT_MODULE);
const root=fs.realpathSync(new URL('../../../../../',import.meta.url)),out=root+'/docs/ssw-workspace/kaigo/runtime-tests/2026-10-10-language20',publicDir=process.env.KAIGO_BROWSER_PUBLIC;
const read=p=>JSON.parse(fs.readFileSync(root+'/'+p)),data=read('src/data/kaigo/language-supplements.json'),base=read('src/data/kaigo/content.json'),atomic=read('src/data/kaigo/atomic-supplements.json');
const server=http.createServer((req,res)=>{const url=req.url.split('?')[0],file=url==='/report.html'?root+'/docs/ssw-workspace/kaigo/reviews/doi-chieu-kaigo-toan-tai-lieu-2026-10-09.html':publicDir+(url==='/'?'/index.html':url);try{res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.ttf')?'font/ttf':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(8796,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.KAIGO_CHROMIUM_PATH,args:c.args,headless:true}),p=await browser.newPage({viewport:{width:390,height:844}});p.setDefaultTimeout(12000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
async function home(){await p.goto('http://127.0.0.1:8796');await p.getByTestId('kaigo-day-1').waitFor();}
const back=()=>p.getByRole('button',{name:'戻る',exact:true}).click();let checkedCards=0,termLinksRendered=0;const tasks=[];
await home();assert.equal(await p.locator('[data-testid^="kaigo-mock-kaigo-"]').count(),12);assert.equal(await p.locator('[data-testid^="kaigo-language-day-"]').count(),4);assert((await p.locator('body').innerText()).includes('148 ngày'));
for(const [i,g] of data.groups.entries()){
 const day=data.days[i].day;await p.getByTestId('kaigo-language-day-'+day).click();
 for(const note of g.notesVi)assert(await p.getByText(note,{exact:true}).count()>0);
 for(const id of g.referenceTermIds){const t=base.terms.find(t=>t.id===id);assert(await p.getByText(t.termJa,{exact:true}).count()>0,t.termJa);assert(await p.getByText(t.readingJa+' · '+t.meaningVi,{exact:true}).count()>0,t.termJa);termLinksRendered++;}
 for(const [j,t] of g.tasks.entries()){
  const body=await p.locator('body').innerText();assert(!body.includes(t.expectedVi),t.id+' answer leaked');assert(await p.getByText(t.promptVi,{exact:true}).count()>0);
  for(const tok of t.furigana.filter(x=>x.readingKana))assert(await p.getByText(tok.readingKana,{exact:true}).count()>0,t.id+' reading missing');
  const input=p.getByTestId('kaigo-probe-'+t.id);await input.waitFor();await input.fill('Tự giải thích '+t.id+': phân biệt người làm và việc đã thực hiện với dự định.');await p.getByRole('button',{name:'Đối chiếu ý kiến thức',exact:true}).nth(j).click();assert((await p.locator('body').innerText()).includes(t.expectedVi));checkedCards++;tasks.push(t.id);
 }
 await p.reload();await p.getByTestId('kaigo-language-day-'+day).click();for(const t of g.tasks){assert((await p.getByTestId('kaigo-probe-'+t.id).inputValue()).includes(t.id));assert((await p.locator('body').innerText()).includes(t.expectedVi));}
 // Editing a resumed answer must hide the previous comparison again.
 const first=g.tasks[0];await p.getByTestId('kaigo-probe-'+first.id).fill('Đã sửa '+first.id);assert(!(await p.locator('body').innerText()).includes(first.expectedVi));await back();
}
assert.equal(checkedCards,16);assert.equal(termLinksRendered,95);
const views=[];for(const [width,height] of [[390,844],[768,1024],[844,390]]){
 await p.setViewportSize({width,height});await home();
 for(const [i,g] of data.groups.entries()){
  await p.getByTestId('kaigo-language-day-'+data.days[i].day).click();await p.evaluate(()=>document.fonts.ready);assert(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),g.id);
  if(i===1){await p.getByText(g.tasks[0].titleVi,{exact:true}).scrollIntoViewIfNeeded();await p.screenshot({path:out+'/language20-'+width+'.png'});}
  views.push({width,height,group:g.id,horizontalOverflow:false});await back();
 }
}
// Existing atomic answer key and behavior still work through the changed catalog.
await home();const unit=atomic.units[0],day=atomic.days.find(d=>d.unitIds.includes(unit.id));await p.getByTestId('kaigo-atomic-day-'+day.day).click();await p.getByTestId('kaigo-probe-'+unit.probe.id).fill('Ý ôn cũ được giữ độc lập với thẻ đọc mới.');await p.getByRole('button',{name:'Đối chiếu ý kiến thức',exact:true}).first().click();await p.reload();await p.getByTestId('kaigo-atomic-day-'+day.day).click();assert.equal(await p.getByTestId('kaigo-probe-'+unit.probe.id).inputValue(),'Ý ôn cũ được giữ độc lập với thẻ đọc mới.');assert((await p.locator('body').innerText()).includes(unit.probe.expectedVi));
await p.goto('http://127.0.0.1:8796/report.html');assert((await p.locator('body').innerText()).includes('Tổng 68 thẻ đọc hiểu'));await p.locator('#filter').fill('kaigo-reading-new-');assert.equal(await p.locator('tbody tr:not([hidden])').count(),16); // 16 new task rows
assert.deepEqual(errors,[]);const evidence={date:'2026-10-10',status:'PASS_FOCUSED_ACTUAL_KAIGO_RN_WEB',runtimeSha256:crypto.createHash('sha256').update(fs.readFileSync(root+'/src/data/kaigo/language-supplements.json')).digest('hex'),newCardsRenderedAndAttempted:checkedCards,taskIds:tasks,existingLexicalLinksRendered:termLinksRendered,newCardsHiddenBeforeAttempt:true,all16RevealAndReload:true,editHidesComparison:true,existingAtomicAnswerReload:true,mockCatalogForms:12,reportFilteredRows:16,views,pageErrors:errors,nativeDeviceTested:false,fullExpoRouterTested:false,humanReviewed:false,releaseReady:false};fs.writeFileSync(out+'/evidence.json',JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));await browser.close();server.close();
