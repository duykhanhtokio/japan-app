const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),out=process.env.FOOD_QA_OUTPUT,executablePath=process.env.FOOD_QA_CHROMIUM;
if(!out||!executablePath)throw Error('Set FOOD_QA_OUTPUT and FOOD_QA_CHROMIUM');
const esbuild=require('esbuild'),{chromium}=require(require.resolve('playwright',{paths:[process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES]}));fs.mkdirSync(out,{recursive:true});
const assessmentOnly=process.env.FOOD_QA_ASSESSMENTS_ONLY==='1';
const translationOnly=assessmentOnly||process.env.FOOD_QA_TRANSLATIONS_ONLY==='1';
const selectedLocales=assessmentOnly?[]:process.env.FOOD_QA_LOCALES?process.env.FOOD_QA_LOCALES.split(','):['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const selectedTestLocales=process.env.FOOD_QA_TEST_LOCALES?process.env.FOOD_QA_TEST_LOCALES.split(','):(translationOnly&&!assessmentOnly?['en']:['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']);
const scriptFontDir=process.env.FOOD_QA_SCRIPT_FONT_DIR;
if(translationOnly&&selectedLocales.concat(selectedTestLocales).some(l=>['hi','bn','ne','my','th','km'].includes(l))&&!scriptFontDir)throw Error('Set FOOD_QA_SCRIPT_FONT_DIR for script-specific font checks');
const scriptFonts=scriptFontDir?['hi','bn','my','th','km']:[];
for(const locale of scriptFonts)fs.copyFileSync(path.join(scriptFontDir,'qa-'+locale+'.woff2'),path.join(out,'qa-'+locale+'.woff2'));
const extraFontCss=scriptFonts.map(locale=>'@font-face{font-family:FoodQA_'+locale+';src:url(/qa-'+locale+'.woff2)}').join('');
const fontFamilies=['FoodQA',...scriptFonts.map(locale=>'FoodQA_'+locale),'sans-serif'].join(',');
const font=process.env.FOOD_QA_JAPANESE_FONT;if(!font)throw Error('Set FOOD_QA_JAPANESE_FONT');fs.copyFileSync(font,path.join(out,'japanese.ttf'));
const adapters={safe:'export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});',backdrop:'export const useBackdropOcclusion=()=>{};',storage:`export default {getItem:async k=>{if(window.__failRead)throw Error('read');return localStorage.getItem(k)},setItem:async(k,v)=>{if(window.__failWrite)throw Error('write');localStorage.setItem(k,v)}};`,royal:`import React from 'react';import {View,Pressable,Text} from 'react-native';export const ROYAL_LAYOUT={screenGutter:12,backSafeTop:8},ROYAL_FONT={};export const RoyalBackButton=({onPress})=><Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onPress}><Text>Back</Text></Pressable>;export const RoyalContentPanel=({children,style})=><View style={style}>{children}</View>;export const RoyalExplanationPanel=RoyalContentPanel;export default ({children})=><View style={{flex:1,backgroundColor:'#eee6d6'}}>{children}</View>;`};
const localeIds=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
// Freeze each input once so a parallel author cannot change expectations after bundling.
const inputFiles=['lessons.1.ja.json','lessons.2.ja.json','exams.ja.json','diagrams.json','translations/glossary.json',...localeIds.flatMap(locale=>['translations/'+locale+'.json','test-translations/'+locale+'.json'])];
const frozenInputs=new Map(inputFiles.map(file=>[path.join(root,'src/data/food-manufacturing',file),fs.readFileSync(path.join(root,'src/data/food-manufacturing',file),'utf8')]));
const frozenData=file=>JSON.parse(frozenInputs.get(path.join(root,'src/data/food-manufacturing',file)));
if(assessmentOnly&&process.env.FOOD_QA_EXPECTED_QUESTION_PAIRS){const actual=selectedTestLocales.reduce((n,l)=>n+Object.keys(frozenData('test-translations/'+l+'.json').questions).length,0);assert.equal(actual,Number(process.env.FOOD_QA_EXPECTED_QUESTION_PAIRS),'Incomplete assessment translation batch');}

if(translationOnly){
 for(const figure of frozenData('diagrams.json').diagrams)for(const locale of selectedLocales)assert(figure.translations[locale],'Missing diagram caption: '+figure.id+'/'+locale);
 const baseline=JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/food-manufacturing',assessmentOnly?'browser-locales-qa.json':'browser-qa.json'),'utf8'));
 assert.equal(baseline.status,'PASS');
 if(assessmentOnly){const core=JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/food-manufacturing/browser-qa.json'),'utf8'));assert.equal(core.status,'PASS');assert.equal(core.testQuestions,839);assert.equal(baseline.sourceHashes['exams.ja.json'],core.sourceHashes['exams.ja.json']);}else assert.equal(baseline.testQuestions,839);
 for(const [file,hash]of Object.entries(baseline.sourceHashes)){
  if((file==='diagrams.json'&&!assessmentOnly)||selectedLocales.some(l=>file==='translations/'+l+'.json')||selectedTestLocales.some(l=>file==='test-translations/'+l+'.json'))continue;
  assert.equal(require('node:crypto').createHash('sha256').update(frozenInputs.get(path.join(root,'src/data/food-manufacturing',file))).digest('hex'),hash,'Baseline changed: '+file);
 }
}

(async()=>{
 await esbuild.build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {FoodManufacturingCourse} from './src/components/food-manufacturing/FoodManufacturingCourse';const locale=new URLSearchParams(location.search).get('language')||'vi';createRoot(document.getElementById('root')).render(<FoodManufacturingCourse learner="qa" language={locale} onBack={()=>{window.__left=true}}/>);`,resolveDir:root,loader:'tsx'},outfile:path.join(out,'entry.js'),bundle:true,nodePaths:(process.env.NODE_PATH||'').split(path.delimiter).filter(Boolean),platform:'browser',jsx:'automatic',define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},plugins:[{name:'browser-adapters',setup(b){
 b.onLoad({filter:/\.json$/},a=>frozenInputs.has(a.path)?{contents:frozenInputs.get(a.path),loader:'json'}:null);
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'adapter'}));
 b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'adapter'}));
 b.onResolve({filter:/RoyalPageBackground|RoyalPanels|RoyalSurface/},()=>({path:'royal',namespace:'adapter'}));
 b.onResolve({filter:/AppBackdrop$/},()=>({path:'backdrop',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},a=>({contents:adapters[a.path],loader:'jsx',resolveDir:root}));
 b.onResolve({filter:/\.(png|webp|jpg)$/},()=>({path:'image',namespace:'asset'}));b.onLoad({filter:/.*/,namespace:'asset'},()=>({contents:'export default {uri:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="}',loader:'js'}));
 b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2));for(const ext of ['','.tsx','.ts','.json','/index.ts'])if(fs.existsSync(p+ext)&&fs.statSync(p+ext).isFile())return {path:p+ext};throw Error(p);});
 }}]});
 fs.writeFileSync(path.join(out,'index.html'),'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@font-face{font-family:FoodQA;src:url(/japanese.ttf)}'+extraFontCss+'*{font-family:'+fontFamilies+'!important}html,body,#root{height:100%;margin:0}#root{display:flex;flex-direction:column}*{box-sizing:border-box}</style><div id="root"></div><script src="/entry.js"></script>');
 const server=http.createServer((q,r)=>{const scriptFile=scriptFonts.map(locale=>'qa-'+locale+'.woff2').find(file=>q.url==='/'+file);const file=scriptFile||(q.url.startsWith('/entry.js')?'entry.js':q.url.startsWith('/japanese.ttf')?'japanese.ttf':'index.html');r.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.ttf')?'font/ttf':file.endsWith('.woff2')?'font/woff2':'text/html; charset=utf-8');r.end(fs.readFileSync(path.join(out,file)));});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const errors=[],screenshots=[];
 try{
 browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox','--disable-gpu']});const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));const url=`http://127.0.0.1:${server.address().port}/`;
 async function fontsReady(){await page.evaluate(async locales=>{await Promise.all(locales.map(locale=>document.fonts.load('16px FoodQA_'+locale)));await document.fonts.ready;for(const locale of locales)if(!document.fonts.check('16px FoodQA_'+locale))throw Error('Missing font '+locale);},scriptFonts);}
 async function start(level='1',language='vi'){await page.goto(url+'?language='+language);await fontsReady();await page.getByRole('button',{name:'特定技能'+level+'号',exact:true}).click();}
 async function reader(level='1',language='vi'){await start(level,language);await page.getByRole('button',{name:/第1週/}).click();await page.getByTestId('food-day-'+level+'-1').click();}

 const lessons=[...frozenData('lessons.1.ja.json').lessons,...frozenData('lessons.2.ja.json').lessons];
 const exams=frozenData('exams.ja.json').exams;
 const report={sourceHashes:Object.fromEntries(inputFiles.map(file=>[file,require('node:crypto').createHash('sha256').update(frozenInputs.get(path.join(root,'src/data/food-manufacturing',file))).digest('hex')])),status:'RUNNING',readerCases:0,responsiveCases:0,translatedReaderPairs:0,testQuestions:0,viewports:[[390,844],[844,390],[768,1024],[1440,900]],screenshots,adapters:['Royal artwork','background','safe area','localStorage for AsyncStorage'],nativeDeviceTested:false,productionExpoTested:false};
 if(!translationOnly){
 for(const lesson of lessons){
  await start(lesson.level,'ja');await page.getByRole('button',{name:new RegExp('^第'+lesson.week+'週')}).click();await page.getByTestId('food-day-'+lesson.level+'-'+lesson.day).click();const text=await page.locator('body').innerText();assert(text.includes(lesson.objectiveJa)&&text.includes(lesson.activityJa)&&text.includes(lesson.summaryJa),lesson.id);for(const p of lesson.paragraphs)assert(text.includes(p.textJa),lesson.id+'/'+p.id);report.readerCases++;if(report.readerCases%26===0)console.log('QA Japanese readers',report.readerCases);
 }
 for(const level of ['1','2'])for(const [width,height]of report.viewports)for(const mode of ['昼','夜']){
  await page.setViewportSize({width,height});await reader(level,'ja');await page.getByRole('button',{name:mode,exact:true}).click();assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));const complete=page.getByRole('button',{name:'完了する',exact:true});await complete.scrollIntoViewIfNeeded();const box=await complete.boundingBox();assert(box&&box.y>=-1&&box.y+box.height<=height+1);const file=`reader-${level}-${width}x${height}-${mode==='昼'?'day':'night'}.png`;await page.screenshot({path:path.join(out,file)});screenshots.push(file);if(width===390){const objective=lessons.find(l=>l.level===level&&l.week===1&&l.day===1).objectiveJa;await page.getByText(objective,{exact:true}).scrollIntoViewIfNeeded();const top=`reader-${level}-390x844-${mode==='昼'?'day':'night'}-top.png`;await page.screenshot({path:path.join(out,top)});screenshots.push(top);}report.responsiveCases++;
 }
 await page.setViewportSize({width:390,height:844});await reader('1','ja');await page.evaluate(()=>window.__failWrite=true);await page.getByRole('button',{name:'完了する',exact:true}).click();await page.getByRole('alert').waitFor();await page.evaluate(()=>window.__failWrite=false);await page.getByRole('button',{name:'完了する',exact:true}).click();await page.getByTestId('food-day-1-1').waitFor();assert((await page.getByTestId('food-day-1-1').innerText()).includes('学習済み'));
 await page.reload();await page.getByRole('button',{name:'特定技能1号',exact:true}).click();await page.getByRole('button',{name:/第1週/}).click();assert((await page.getByTestId('food-day-1-1').innerText()).includes('学習済み'));
 await start('2','ja');await page.getByRole('button',{name:/第1週/}).click();assert(!(await page.getByTestId('food-day-2-1').innerText()).includes('学習済み'));
 }
 for(const locale of selectedLocales){
  const translations=frozenData('translations/'+locale+'.json');
  for(const [id,t]of Object.entries(translations)){
   const lesson=lessons.find(l=>l.id===id);if(!lesson)continue;await start(lesson.level,locale);await page.getByRole('button',{name:new RegExp('^第'+lesson.week+'週')}).click();await page.getByTestId('food-day-'+lesson.level+'-'+lesson.day).click();await page.getByRole('button',{name:'訳を表示',exact:true}).click();const text=await page.locator('body').innerText();assert(text.includes(t.title)&&text.includes(t.objective)&&text.includes(t.summary));for(const p of lesson.paragraphs)assert(text.includes(t.paragraphs[p.id]));report.translatedReaderPairs++;if(report.translatedReaderPairs%78===0)console.log('QA translated reader pairs',report.translatedReaderPairs);
  }
 }

 report.newLocaleResponsiveCases=0;
 for(const locale of (translationOnly?selectedLocales:['id','zh-CN','zh-TW'])){
  const entries=Object.entries(frozenData('translations/'+locale+'.json')).sort((a,b)=>Object.values(b[1].paragraphs).join('').length-Object.values(a[1].paragraphs).join('').length);if(!entries.length)continue;
  const [id,t]=entries[0],lesson=lessons.find(l=>l.id===id);
  for(const [width,height]of report.viewports)for(const mode of ['昼','夜']){
   await page.setViewportSize({width,height});await start(lesson.level,locale);await page.getByRole('button',{name:new RegExp('^第'+lesson.week+'週')}).click();await page.getByTestId('food-day-'+lesson.level+'-'+lesson.day).click();await page.getByRole('button',{name:'訳を表示',exact:true}).click();await page.getByRole('button',{name:mode,exact:true}).click();assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),locale+'/'+width+'/'+mode);const complete=page.getByRole('button',{name:'完了する',exact:true});await complete.scrollIntoViewIfNeeded();const box=await complete.boundingBox();assert(box&&box.y>=-1&&box.y+box.height<=height+1);if(width===390&&mode==='昼'){await page.getByText(t.title,{exact:false}).first().scrollIntoViewIfNeeded();const file='reader-'+locale+'-390x844.png';await page.screenshot({path:path.join(out,file)});screenshots.push(file);}report.newLocaleResponsiveCases++;
  }
 }
 const diagramData=frozenData('diagrams.json').diagrams;report.diagramTranslationPairs=0;report.responsiveDiagramCases=0;report.missingTranslationCases=0;
 await page.setViewportSize({width:390,height:844});
 for(const d of diagramData)for(const locale of Object.keys(d.translations).filter(l=>!translationOnly||selectedLocales.includes(l))){
  const lesson=lessons.find(l=>l.id===d.lessonIds[0]);if(!lesson)continue;await start(lesson.level,locale);await page.getByRole('button',{name:new RegExp('^第'+lesson.week+'週')}).click();await page.getByTestId('food-day-'+lesson.level+'-'+lesson.day).click();const figure=page.getByTestId(d.id);assert(!(await figure.innerText()).includes(d.translations[locale].title));await page.getByRole('button',{name:'訳を表示',exact:true}).click();const text=await figure.innerText(),t=d.translations[locale];assert(text.includes(d.titleJa)&&text.includes(t.title)&&text.includes(t.description)&&text.includes(t.note));for(const label of Object.values(t.nodeLabels))assert(text.includes(label));for(const label of t.edgeLabels)assert(text.includes(label));for(const [width,height]of report.viewports)for(const mode of ['昼','夜']){await page.setViewportSize({width,height});await page.getByRole('button',{name:mode,exact:true}).click();assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),d.id+'/'+locale+'/'+width+'/'+mode);const figureBox=await figure.boundingBox();assert(figureBox&&figureBox.x>=-1&&figureBox.x+figureBox.width<=width+1);const complete=page.getByRole('button',{name:'完了する',exact:true});await complete.scrollIntoViewIfNeeded();const bounds=await complete.boundingBox();assert(bounds&&bounds.y>=-1&&bounds.y+bounds.height<=height+1);if(width===390&&mode==='昼'){await figure.scrollIntoViewIfNeeded();const file=d.id+'-'+locale+'-390x844.png';await page.screenshot({path:path.join(out,file)});screenshots.push(file);}report.responsiveDiagramCases++;}await page.getByRole('button',{name:'訳を隠す',exact:true}).click();assert(!(await figure.innerText()).includes(t.title));report.diagramTranslationPairs++;
 }
 for(const locale of selectedLocales){
  const pack=frozenData('translations/'+locale+'.json'),lesson=lessons.find(l=>!pack[l.id]);if(!lesson)continue;await start(lesson.level,locale);await page.getByRole('button',{name:new RegExp('^第'+lesson.week+'週')}).click();await page.getByTestId('food-day-'+lesson.level+'-'+lesson.day).click();await page.getByRole('button',{name:'訳を表示',exact:true}).click();assert((await page.locator('body').innerText()).includes('この言語の訳は準備中です。'));report.missingTranslationCases++;
 }
 for(const exam of (translationOnly?[]:exams)){console.log('QA assessment',exam.id);
  const level=exam.level,index=exams.filter(e=>e.level===level).findIndex(e=>e.id===exam.id);
  await start(level,'ja');await page.getByRole('button',{name:'確認・模擬試験',exact:true}).click();await page.getByRole('button',{name:'開く・再開',exact:true}).nth(index).click();await page.getByRole('button',{name:'次へ',exact:true}).waitFor();assert(!(await page.locator('body').innerText()).includes('正解：'));
  await page.evaluate(()=>window.__failWrite=true);await page.getByRole('button').filter({hasText:/^1\. /}).first().click();await page.getByRole('alert').waitFor();await page.evaluate(()=>window.__failWrite=false);await page.getByRole('button',{name:'保存を再試行',exact:true}).click();await page.getByRole('button',{name:'提出する',exact:true}).waitFor();await page.getByRole('button',{name:'次へ',exact:true}).click();await page.reload();await page.getByRole('button',{name:'特定技能'+level+'号',exact:true}).click();await page.getByRole('button',{name:'確認・模擬試験',exact:true}).click();await page.getByRole('button',{name:'開く・再開',exact:true}).nth(index).click();await page.getByRole('button',{name:'提出する',exact:true}).waitFor();assert((await page.locator('body').innerText()).includes('2 /'));await page.getByRole('button',{name:'前へ',exact:true}).click();
  for(const [i,q]of exam.questions.entries()){
   const text=await page.locator('body').innerText();assert(text.includes(q.promptJa)&&q.optionsJa.every(t=>text.includes(t)),q.id);assert(!text.includes('正解：'));await page.getByRole('button').filter({hasText:new RegExp('^'+(q.answerIndex+1)+'\\. ')}).first().click();if(i<exam.questions.length-1)await page.getByRole('button',{name:'次へ',exact:true}).click();report.testQuestions++;
  }
  await page.getByRole('button',{name:'提出する',exact:true}).click();await page.getByRole('button',{name:'キャンセル',exact:true}).click();assert(!(await page.locator('body').innerText()).includes('正解：'));await page.getByRole('button',{name:'提出する',exact:true}).click();await page.getByRole('button',{name:'確定',exact:true}).click();await page.getByRole('button',{name:'もう一度解く',exact:true}).waitFor();assert((await page.locator('body').innerText()).includes(`正解 ${exam.questions.length} / ${exam.questions.length}`));await page.getByRole('button',{name:'Back',exact:true}).click();await page.getByText(/問 · ✓ 完了/).first().waitFor();
 }

 report.translatedQuestionPairs=0;report.testTranslationLeakChecks=0;report.testTranslationResponsiveCases=0;
 if(selectedTestLocales.length){
 for(const locale of selectedTestLocales){
  const pack=frozenData('test-translations/'+locale+'.json');
  for(const exam of exams.filter(e=>e.questions.some(q=>pack.questions[q.id]))){
   const index=exams.filter(e=>e.level===exam.level).findIndex(e=>e.id===exam.id);
   await start(exam.level,locale);await page.getByRole('button',{name:'確認・模擬試験',exact:true}).click();await page.getByRole('button',{name:'開く・再開',exact:true}).nth(index).click();
   await page.getByRole('button',{name:/^(提出する|もう一度解く)$/}).waitFor();if(!await page.getByRole('button',{name:'もう一度解く',exact:true}).isVisible()){await page.getByRole('button',{name:'提出する',exact:true}).click();await page.getByRole('button',{name:'確定',exact:true}).click();await page.getByRole('button',{name:'もう一度解く',exact:true}).waitFor();}
   await page.getByRole('button',{name:'もう一度解く',exact:true}).click();await page.getByRole('button',{name:'確定',exact:true}).click();
   await page.getByRole('button',{name:'訳を表示',exact:true}).click();
   for(const [i,q]of exam.questions.entries()){
    const t=pack.questions[q.id];if(!t){if(i<exam.questions.length-1)await page.getByRole('button',{name:'次へ',exact:true}).click();continue;}
    let text=await page.locator('body').innerText();assert(text.includes(q.promptJa)&&text.includes(t.prompt),q.id+'/'+locale);for(const v of t.options)assert(text.includes(v),q.id+'/'+locale+'/choice');assert(!text.includes('正解：'));assert(!text.includes(t.explanation),q.id+'/'+locale+'/early explanation');report.testTranslationLeakChecks++;
    for(const [width,height]of report.viewports){await page.setViewportSize({width,height});assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),q.id+'/'+locale+'/width');const submit=page.getByRole('button',{name:'提出する',exact:true});await submit.scrollIntoViewIfNeeded();const bounds=await submit.boundingBox();assert(bounds&&bounds.y>=-1&&bounds.y+bounds.height<=height+1,q.id+'/'+locale+'/submit bounds');report.testTranslationResponsiveCases++;}
    await page.getByRole('button').filter({hasText:new RegExp('^'+(q.answerIndex+1)+'\\. ')}).first().click();if(i<exam.questions.length-1)await page.getByRole('button',{name:'次へ',exact:true}).click();
   }
   await page.getByRole('button',{name:'提出する',exact:true}).click();await page.getByRole('button',{name:'確定',exact:true}).click();await page.getByRole('button',{name:'もう一度解く',exact:true}).waitFor();
   for(let i=exam.questions.length-1;i>=0;i--){
    const q=exam.questions[i],t=pack.questions[q.id];if(t){const text=await page.locator('body').innerText();assert(text.includes(t.explanation),q.id+'/'+locale+'/review');for(const reason of t.optionExplanations)assert(text.includes(reason),q.id+'/'+locale+'/reason');report.translatedQuestionPairs++;}
    if(i>0)await page.getByRole('button',{name:'前へ',exact:true}).click();
   }
   if(exam.id==='food-1-weekly-01'){await page.setViewportSize({width:390,height:844});const file='translated-weekly-review-'+locale+'-390x844.png';await page.screenshot({path:path.join(out,file)});screenshots.push(file);}
  }
 }
 const missingPack=frozenData('test-translations/vi.json'),missingExam=exams.find(e=>e.questions.every(q=>!missingPack.questions[q.id]));assert(missingExam,'Missing-translation fixture required');const missingIndex=exams.filter(e=>e.level===missingExam.level).findIndex(e=>e.id===missingExam.id);await start(missingExam.level,'vi');await page.getByRole('button',{name:'確認・模擬試験',exact:true}).click();await page.getByRole('button',{name:'開く・再開',exact:true}).nth(missingIndex).click();await page.getByRole('button',{name:'訳を表示',exact:true}).click();assert((await page.locator('body').innerText()).includes('この言語の問題訳は準備中です。'));report.missingQuestionTranslationHandled=true;report.missingQuestionTranslationFixture=missingExam.id;
 }
 assert.deepEqual(errors,[]);Object.assign(report,translationOnly?{status:'PASS',mode:assessmentOnly?'assessment_translation_batch_only':'locale_batch_only',testedLocales:selectedLocales,testedQuestionLocales:selectedTestLocales,scriptFontFamiliesLoaded:scriptFonts,previousBaselineCommit:assessmentOnly?'1344c92fd4f5892c887b241e17f2018f6aee399a':'7ef2d42a169b61b3e2cac44b24013d316d215492'}:{status:'PASS',completionSaveFailureHandled:true,examSaveFailureHandled:true,completionReload:true,levelIsolation:true,examResume:true,hiddenAnswersBeforeSubmit:true,cancelSubmit:true,completionBadge:true,japaneseQaFontLoaded:true});fs.writeFileSync(path.join(root,'docs/ssw-workspace/food-manufacturing',assessmentOnly?'browser-assessments-qa.json':translationOnly?'browser-locales-qa.json':'browser-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
