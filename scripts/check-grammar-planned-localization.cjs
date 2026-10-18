const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),dep=n=>require(require.resolve(n,{paths:[process.env.TOKUTEI_QA_MODULES||root]}));
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
(async()=>{
 const b=await dep('esbuild').build({entryPoints:[path.join(root,'src/data/grammar-planned-localization.ts'),path.join(root,'src/i18n/grammar-copy.ts')],outdir:'qa',bundle:true,write:false,platform:'node',format:'cjs',logLevel:'error'});
 const modules=b.outputFiles.map(f=>{const m={exports:{}};new Function('module','exports','require',f.text)(m,m.exports,require);return m.exports;});
 const api=modules.find(m=>m.getPlannedGrammar),copy=modules.find(m=>m.getGrammarCopy),curriculum=require(path.join(root,'src/game/data/n5/n5-curriculum-data.js'));
 const previous=read('docs/grammar-workspace/previous-n5-progress-bindings.json'),progress=read('src/data/generated/grammar-planned-progress-bindings.json'),content=read('src/data/generated/grammar-planned-content.json'),extra=read('src/data/generated/grammar-planned-extra-localizations.json');
 assert.deepEqual(progress,previous,'do not change existing learned keys');assert.equal(Object.keys(previous).length,398);assert.equal(Object.keys(content).length,103);assert.equal(Object.keys(extra).length,40);
 const languages=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
 const scripts={'ja':/[\u3040-\u30ff\u3400-\u9fff]/,'zh-CN':/[\u3400-\u9fff]/,'zh-TW':/[\u3400-\u9fff]/,hi:/[\u0900-\u097f]/,ne:/[\u0900-\u097f]/,bn:/[\u0980-\u09ff]/,my:/[\u1000-\u109f]/,th:/[\u0e00-\u0e7f]/,km:/[\u1780-\u17ff]/};
 let combinations=0,sourceExamples=0;
 for(const day of curriculum.days) for(const [index,item] of day.grammar.entries()){
  const frozen=previous[`${day.day}:${index}`];assert(frozen);assert.equal(frozen.pattern,item.pattern);
  for(const language of languages){
   const x=api.getPlannedGrammar(day.day,index,item,language),pending=copy.getGrammarCopy(language).pending;
   assert.equal(x.id,frozen.progressId,'stable progress identity');assert(x.meaning?.trim()&&!x.meaning.includes(pending),`${day.day}:${index} ${language} missing meaning`);
   assert(x.pattern?.trim()&&x.examples.length,`${day.day}:${index} no structure/examples`);
   assert(!/[À-ỹ]|plain-form|dictionary-form|người|Động|Tính/.test(x.name),x.name+' unlocalized pattern');
   if(scripts[language])assert(scripts[language].test(x.meaning),x.id+' meaning script '+language);
   for(const sample of x.examples){
    assert(sample.exampleJa?.trim()&&sample.exampleReading?.trim());assert(!/[A-Za-z\u3400-\u9fff]/.test(sample.exampleReading),x.id+' reading');
    if(language==='ja')assert.equal(sample.exampleTranslation,undefined);
    else{
     assert(sample.exampleTranslation?.trim()&&sample.exampleTranslation!==pending,x.id+' missing translation '+language);
     if(scripts[language])assert(scripts[language].test(sample.exampleTranslation),x.id+' example script '+language);
     if(language==='km')assert(!/[\u0e00-\u0e7f]/.test(sample.exampleTranslation),x.id+' Thai in Khmer');
    }
   }
   combinations++;if(language==='ja')sourceExamples+=x.examples.length;
  }
 }
 const day=curriculum.days.find(d=>d.grammar.length),item=day.grammar[0];
 for(const language of languages){const changed={...item,example:{...item.example,japanese:'これは新しい未翻訳の例文です。'}};const x=api.getPlannedGrammar(day.day,0,changed,language);assert.equal(x.meaning,copy.getGrammarCopy(language).pending,'changed curriculum must not silently reuse old content');}
 const report={status:'PASS',date:'2026-10-18',occurrences:398,distinctPatterns:103,canonicalMappings:63,explicitExtraLessons:40,languages:13,localeOccurrenceChecks:combinations,displayedJapaneseExampleOccurrences:sourceExamples,stableAll398ProgressKeys:true,noFuzzyMatching:true,sourceChangeGuard:true,nativeReviewed:false};
 fs.writeFileSync(path.join(root,'docs/grammar-workspace/n5-planned-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1)});
