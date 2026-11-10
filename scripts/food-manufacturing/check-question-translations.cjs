const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const root=path.resolve(__dirname,'../..');
(async()=>{
 const esbuild=require('esbuild');
 const built=await esbuild.build({entryPoints:[path.join(root,'src/data/food-manufacturing/index.ts')],bundle:true,write:false,platform:'node',format:'cjs',logLevel:'silent'});
 const loaded=new Module(path.join(root,'food-adapter-qa.cjs'),module);loaded.filename=path.join(root,'food-adapter-qa.cjs');loaded.paths=module.paths;loaded._compile(built.outputFiles[0].text,loaded.filename);const adapter=loaded.exports;
 let valid=0,stale=0,missing=0;
 for(const locale of ['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){
  const pack=JSON.parse(fs.readFileSync(path.join(root,'src/data/food-manufacturing/test-translations',locale+'.json'),'utf8'));
  for(const name of fs.readdirSync(path.join(root,'src/data/food-manufacturing/authoring-20261029')).filter(n=>/^part[1-6]\.json$/.test(n))){const extra=JSON.parse(fs.readFileSync(path.join(root,'src/data/food-manufacturing/authoring-20261029',name))).testTranslations?.[locale];if(extra){Object.assign(pack.questions,extra.questions);Object.assign(pack.examTitles,extra.examTitles);}}
  for(const level of ['1','2'])for(const exam of adapter.foodManufacturingChecks(level)){
   const title=adapter.foodManufacturingExamTitleTranslation(exam,locale);if(pack.examTitles[exam.id])assert.equal(title,pack.examTitles[exam.id].title);else assert.equal(title,null);
   for(const q of exam.questions){const t=adapter.foodManufacturingQuestionTranslation(q,locale);if(pack.questions[q.id]){assert.equal(t.prompt,pack.questions[q.id].prompt);assert.equal(t.options.length,4);assert.equal(t.optionExplanations.length,4);valid++;assert.equal(adapter.foodManufacturingQuestionTranslation({...q,sourceHash:q.sourceHash+'-stale'},locale),null);stale++;}else{assert.equal(t,null);missing++;}}
  }
 }
 assert(valid>0);console.log(JSON.stringify({status:'PASS',validTranslationPairs:valid,rejectedStalePairs:stale,missingPairsWithoutFallback:missing,meaning:'Adapter checks only; answer/explanation visibility tested in browser.'}));
})().catch(e=>{console.error(e);process.exitCode=1});
