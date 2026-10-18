const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const dep=n=>require(require.resolve(n,{paths:[process.env.TOKUTEI_QA_MODULES||root]}));
(async()=>{
 const built=await dep('esbuild').build({entryPoints:[path.join(root,'src/data/jlpt-study-data.ts')],bundle:true,write:false,format:'cjs',platform:'node',logLevel:'error'});
 const box={exports:{}};new Function('module','exports','require',built.outputFiles[0].text)(box,box.exports,require);const m=box.exports;
 const original=read('src/data/generated/vocabulary.json'),meanings=read('src/data/generated/vocabulary-meaning-localizations.json'),examples=read('src/data/generated/vocabulary-example-localizations.json');
 const manifest=read('docs/vocabulary-workspace/localization-manifest.json');
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,manifest.canonicalData))).digest('hex'),manifest.canonicalSha256);
 assert.equal(original.length,8350);assert.equal(new Set(original.map(x=>x.id)).size,8350);assert.deepEqual(m.generatedVocabulary.map(x=>x.id),original.map(x=>x.id));
 for(const [i,item]of original.entries())for(const key of Object.keys(item))if(key!=='meaningVi'||item.id!=='VOC0243')assert.deepEqual(m.generatedVocabulary[i][key],item[key],item.id+':'+key);
 for(const [id,bundle]of Object.entries(meanings)){const source=original.find(x=>x.id===id);assert(source);assert.equal(bundle.word,source.word);assert.equal(bundle.reading,source.reading);for(const locale of manifest.localeScope)assert(bundle.translations[locale]?.trim(),id+':'+locale);}
 for(const [id,bundle]of Object.entries(examples)){assert.equal(bundle.sourceJa,original.find(x=>x.id===id)?.exampleJa);for(const locale of manifest.exampleLocaleScope)assert(bundle.translations[locale]?.trim(),id+':'+locale);}
 const languages=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
 assert.equal(m.generatedVocabulary.find(x=>x.id==='VOC0243').meaningVi,'cay');
 const counts=languages.map(language=>{
  const copy=m.getVocabularyCopy(language);assert(Object.values(copy).every(x=>typeof x==='string'&&x.trim()));
  let meaningsPresent=0,examplesPresent=0;
  for(const item of m.generatedVocabulary){const meaning=m.getVocabularyMeaning(item,language),example=m.getVocabularyExampleTranslation(item,language);assert(meaning.trim());if(meaning!==copy.pending)meaningsPresent++;if(example&&example!==copy.pending)examplesPresent++;if(language==='ja')assert.equal(example,undefined);}
  return {language,meaningsPresent,meaningTotal:8350,exampleTranslationsPresent:examplesPresent,sourceExamples:298};
 });
 assert.equal(counts.find(x=>x.language==='en').meaningsPresent,6506);assert.equal(counts.find(x=>x.language==='vi').exampleTranslationsPresent,298);
 for(const locale of manifest.localeScope)assert.equal(counts.find(x=>x.language===locale).meaningsPresent,100);
 const word=m.generatedVocabulary.find(x=>x.id==='VOC0001');for(const locale of manifest.localeScope){assert.notEqual(m.getVocabularyMeaning(word,locale),word.meaningVi);assert.notEqual(m.getVocabularyMeaning(word,locale),word.word);assert.notEqual(m.getVocabularyExampleTranslation(word,locale),word.exampleVi);}
 const missing=m.generatedVocabulary.find(x=>!meanings[x.id]);for(const locale of manifest.localeScope)assert.equal(m.getVocabularyMeaning(missing,locale),m.getVocabularyCopy(locale).pending);
 const report={date:'2026-10-18',status:'PASS_LOCALIZATION_BINDING_AND_PRESERVATION',original8350RecordsBytePreserved:true,orderedIdsUnchanged:true,locales:counts,explicitLocalizedPendingState:true,nativeReviewed:false,allTranslationsComplete:false};
 fs.writeFileSync(path.join(root,'docs/vocabulary-workspace/localization-qa-2026-10-18.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1)});
