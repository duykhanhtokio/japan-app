// Completion requires one Japanese example and all 12 translations for every vocabulary ID.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const dep=n=>require(require.resolve(n,{paths:[process.env.TOKUTEI_QA_MODULES||root]}));
(async()=>{
 const built=await dep('esbuild').build({entryPoints:[path.join(root,'src/data/jlpt-study-data.ts'),path.join(root,'src/data/vocabulary-localization.ts')],outdir:'qa',bundle:true,write:false,format:'cjs',platform:'node',logLevel:'error'});
 const modules=built.outputFiles.map(file=>{const mod={exports:{}};new Function('module','exports','require',file.text)(mod,mod.exports,require);return mod.exports;});
 const mod={exports:modules.find(x=>x.generatedVocabulary)},helpers=modules.find(x=>x.localizeVocabulary);
 const {generatedVocabulary:words,getVocabularyExampleTranslation:getTranslation,getVocabularyCopy:getCopy}=mod.exports;
 const originals=read('src/data/generated/vocabulary.json'),extra=require('./read-vocabulary-practical-examples.cjs')(root);
 const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
 assert.equal(words.length,8350);assert.deepEqual(words.map(x=>x.id),originals.map(x=>x.id));
 const byId=new Map(words.map(x=>[x.id,x]));const sourceById=new Map(originals.map(x=>[x.id,x]));
 for(const [id,item] of Object.entries(extra.entries)){
  const word=byId.get(id);assert(word,'unknown ID '+id);assert.equal(item.word,word.word,id+' binding');assert.equal(item.reading,word.reading,id+' reading');
  assert(!sourceById.get(id).exampleJa,'supplements must preserve existing source examples '+id);
  assert(item.targetForm?.trim()&&item.sourceJa.includes(item.targetForm),id+' demonstrated target word');
  assert(item.sourceJa.length>=8&&item.sourceJa.length<=120,id+' sentence length');
  assert.deepEqual(Object.keys(item.translations).sort(),[...locales].sort(),id+' locale set');
  const scripts={'zh-CN':/[\u3400-\u9fff]/u,'zh-TW':/[\u3400-\u9fff]/u,hi:/[\u0900-\u097f]/u,ne:/[\u0900-\u097f]/u,bn:/[\u0980-\u09ff]/u,my:/[\u1000-\u109f]/u,th:/[\u0e00-\u0e7f]/u,km:/[\u1780-\u17ff]/u};
  for(const language of locales){
   const text=item.translations[language];assert(text?.trim(),id+language);assert(text.length<=1000,id+' possible decoding loop '+language);
   if(language!=='en')assert.notEqual(text,item.translations.en,id+' untranslated English '+language);
   if(scripts[language])assert(scripts[language].test(text),id+' target script '+language);
   if(/^direct-\d+\.json$/.test(item.sourceBatch)&&!['zh-CN','zh-TW'].includes(language)){
    assert(!/[\u3040-\u30ff\u3400-\u9fff]/u.test(text),id+' leftover Japanese in direct translation '+language);
   }
   assert.equal(getTranslation(word,language),text,id+' runtime '+language);
  }
 }
 const overlay=read('src/data/generated/vocabulary-practical-example-additions.json');
 const shardManifest=read('src/data/generated/vocabulary-practical-example-shards/manifest.json');
 const firstShard=shardManifest.files[0]&&read('src/data/generated/vocabulary-practical-example-shards/'+shardManifest.files[0].file);
 for(const firstId of new Set([Object.keys(extra.entries)[0],Object.keys(overlay.entries)[0],firstShard&&Object.keys(firstShard.entries)[0]].filter(Boolean))){
  const original=sourceById.get(firstId);
  for(const changed of [{...original,word:'changed source'},{...original,reading:'changed reading'},{...original,exampleJa:'別の例文です。'}]){
   assert.notEqual(helpers.localizeVocabulary(changed).exampleJa,extra.entries[firstId].sourceJa,'stale source must not receive supplement');
  }
  assert(!original.exampleJa,'original data remains unchanged');
 }
 const withExamples=words.filter(x=>x.exampleJa?.trim()),missing=words.filter(x=>!x.exampleJa?.trim()).map(x=>x.id);
 if(extra.entries.VOC6536)assert(extra.entries.VOC6536.translations.my.includes('ယန်း'),'preserve Japanese yen; do not localize currency to kyat');
 if(extra.entries.VOC6538){assert(extra.entries.VOC6538.translations.hi.includes('अनुभव'),'CV sentence must preserve experience');assert(!extra.entries.VOC6538.translations.hi.includes('पिता'),'reject known unrelated father-credit hallucination');}
 if(extra.entries.VOC6539)assert(!extra.entries.VOC6539.translations.id.includes('bohong'),'arrogant is not lying');
 const perLanguage=Object.fromEntries(locales.map(language=>[language,withExamples.filter(x=>{const v=getTranslation(x,language);return v?.trim()&&v!==getCopy(language).pending;}).length]));
 const byLevel=Object.fromEntries(['N5','N4','N3','N2','N1'].map(level=>[level,{required:words.filter(x=>x.jlpt===level).length,withJapaneseExample:withExamples.filter(x=>x.jlpt===level).length}]));
 const complete=withExamples.length===8350&&locales.every(language=>perLanguage[language]===8350);
 const report={requiredExamplesPerLanguage:8350,sourceJapaneseExamples:withExamples.length,addedJapaneseExamples:Object.keys(extra.entries).length,perLanguage,byLevel,missingJapaneseIds:missing,allExamplesComplete:complete,status:complete?'COMPLETE':'IN_PROGRESS',nativeReviewed:false,semanticReview:'focused AI review only; counts do not certify all-record/all-locale semantic correctness'};
 fs.writeFileSync(path.join(root,'docs/vocabulary-workspace/practical-examples/coverage.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({...report,missingJapaneseIds:undefined,remainingJapaneseExamples:missing.length}));
 if(!complete&&!process.argv.includes('--allow-incomplete')){console.error('INCOMPLETE: every word must have a Japanese example and all 12 translations.');process.exitCode=1;}
})().catch(e=>{console.error(e);process.exit(1)});
