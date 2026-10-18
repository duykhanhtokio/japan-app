const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const dep=n=>require(require.resolve(n,{paths:[process.env.TOKUTEI_QA_MODULES||root]}));
(async()=>{
 const built=await dep('esbuild').build({entryPoints:[path.join(root,'src/data/jlpt-study-data.ts'),path.join(root,'src/data/vocabulary-localization.ts'),path.join(root,'src/i18n/languages.ts')],bundle:true,write:false,outdir:'qa',format:'cjs',platform:'node',logLevel:'error'});
 const modules=built.outputFiles.map(f=>{const box={exports:{}};new Function('module','exports','require',f.text)(box,box.exports,require);return box.exports}),m=modules.find(x=>x.generatedVocabulary),helpers=modules.find(x=>x.localizeVocabulary);
 const original=read('src/data/generated/vocabulary.json'),legacyMeanings=read('src/data/generated/vocabulary-meaning-localizations.json'),legacyExamples=read('src/data/generated/vocabulary-example-localizations.json'),repairs=read('src/data/generated/vocabulary-source-repairs.json');
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'src/data/generated/vocabulary.json'))).digest('hex'),'f69cce35c06624316c4ca119f3eb8a73bd63d8faa21b661caa4f041cb2fc56ea');
 assert.equal(original.length,8350);assert.equal(new Set(original.map(x=>x.id)).size,8350);assert.deepEqual(m.generatedVocabulary.map(x=>x.id),original.map(x=>x.id));
 const manifest=read('docs/vocabulary-workspace/localization-manifest.json');assert.equal(manifest.all8350TranslationsComplete,true);for(const {file,sha256}of Object.values(manifest.bundles)){assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'),sha256,file+' immutable snapshot');}
 const languages=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'],levels=['N5','N4','N3','N2','N1'];
 assert.deepEqual(modules.find(x=>x.appLanguages).appLanguages.map(x=>x.code).sort(),[...languages].sort(),'supported app language coverage');
 const translatedLocales=languages.filter(x=>x!=='ja'),planned=read('src/data/generated/vocabulary-planned-source.json');
 for(const [i,item]of original.entries())for(const key of Object.keys(item)){
  if(key==='meaningEn'&&!item.meaningEn)continue;
  const expected=repairs[item.id]?.[key]??item[key];assert.deepEqual(m.generatedVocabulary[i][key],expected,item.id+':'+key);
 }
 for(const locale of translatedLocales){
  const bundle=read('src/data/generated/vocabulary-localizations/'+locale+'.json');assert.equal(bundle.locale,locale);assert.equal(Object.keys(bundle.meanings).length,8350,locale+' meanings');assert.equal(Object.keys(bundle.examples).length,298,locale+' examples');assert.equal(Object.keys(bundle.plannedMeanings).length,311,locale+' planned');
  for(const item of original){assert(bundle.meanings[item.id]?.trim(),locale+item.id);if(item.exampleJa)assert(bundle.examples[item.id]?.trim(),locale+item.id+' example');}
  for(const [id,v]of Object.entries(legacyMeanings))if(v.translations[locale])assert.equal(bundle.meanings[id],v.translations[locale],locale+id+' preserved meaning');
  for(const [id,v]of Object.entries(legacyExamples))if(v.translations[locale])assert.equal(bundle.examples[id],v.translations[locale],locale+id+' preserved example');
  for(const item of planned)assert(bundle.plannedMeanings[item.id]?.trim(),locale+item.id);
 }
 const counts=languages.map(language=>{
  const copy=m.getVocabularyCopy(language);assert(Object.values(copy).every(x=>typeof x==='string'&&x.trim()));let examplesPresent=0;
  const byLevel=Object.fromEntries(levels.map(level=>[level,0]));
  for(const item of m.generatedVocabulary){const meaning=m.getVocabularyMeaning(item,language),example=m.getVocabularyExampleTranslation(item,language);assert(meaning.trim());assert.notEqual(meaning,copy.pending,language+item.id);byLevel[item.jlpt]++;if(language==='ja')assert.equal(example,undefined);else if(item.exampleJa){assert(example?.trim());assert.notEqual(example,copy.pending,language+item.id+' example');examplesPresent++;}}
  const curriculum=require(path.join(root,'src/game/data/n5/n5-curriculum-data'));let calendar=0;for(const day of curriculum.days)for(const item of day.vocabulary){const meaning=helpers.getPlannedVocabularyMeaning(item.japanese,item.reading,language);assert(meaning?.trim());assert.notEqual(meaning,copy.pending,language+item.japanese);calendar++;}
  assert.deepEqual(byLevel,manifest.sourceMeaningsByLevel,language+' level coverage');return {language,meaningsPresent:8350,byLevel,exampleTranslationsPresent:examplesPresent,sourceExamples:298,n5CalendarEntries:calendar};
 });
 const legacyWords=[['食べる','たべる'],['飲む','のむ'],['コーヒー','コーヒー'],['行く','いく'],['続ける','つづける']];for(const [word,reading]of legacyWords){const item=helpers.findVocabularyByJapanese(word,reading);assert(item,word+' legacy resolved');for(const language of languages)assert.notEqual(m.getVocabularyMeaning(item,language),m.getVocabularyCopy(language).pending);}
 const sample=original.find(x=>x.id==='VOC0001'),stale=helpers.localizeVocabulary({...sample,word:'changed source'});assert(!stale.meaningTranslations?.th,'stale translation blocked');
 const changedExample=helpers.localizeVocabulary({...sample,exampleJa:'changed Japanese example'});assert(!changedExample.exampleTranslations?.th,'stale example blocked');
 const pending={id:'unknown',word:'未知',reading:'みち',meaningVi:''};assert.equal(m.getVocabularyMeaning(pending,'th'),m.getVocabularyCopy('th').pending);
 for(const [word,reading]of [['はい','はい'],['乾杯','かんぱい'],['こと','こと']])assert.notEqual(helpers.getPlannedVocabularyMeaning(word,reading,'en'),m.getVocabularyCopy('en').pending);
 assert.match(helpers.getPlannedVocabularyMeaning('はい','はい','en'),/yes/i);assert.match(helpers.getPlannedVocabularyMeaning('乾杯','かんぱい','en'),/cheers|toast/i);
 assert.equal(m.generatedVocabulary.find(x=>x.id==='VOC4206').word,'命に別状なし');assert.match(m.getVocabularyMeaning(m.generatedVocabulary.find(x=>x.id==='VOC4206'),'en'),/no danger/i);
 const report={date:'2026-10-18',status:'PASS_COMPLETE_VOCABULARY_LOCALIZATION',original8350RecordsBytePreserved:true,orderedIdsUnchanged:true,sourceRepairCount:Object.keys(repairs).length,locales:counts,plannedAdditionalMeanings:planned.length,existingExamplesWithoutSourceSentence:8052,explicitLocalizedPendingForUnknownItems:true,sourceBindingVerified:true,nativeReviewed:false,allTranslationsComplete:true};
 fs.writeFileSync(path.join(root,'docs/vocabulary-workspace/localization-qa-2026-10-18.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1)});
