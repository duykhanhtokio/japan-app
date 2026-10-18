// Integrate only fully translated examples. Partial authoring never counts as runtime coverage.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const clean=text=>typeof text==='string'?text.replace(/&\s*#\s*(\d+)\s*;/g,(_,n)=>Number(n)<=0x10ffff?String.fromCodePoint(Number(n)):'').replace(/\u00a0/g,' ').trim():text;
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const work=process.env.VOCABULARY_EXAMPLE_TRANSLATIONS;
const dir=path.join(root,'docs/vocabulary-workspace/practical-examples'),dataDir=path.join(root,'src/data/generated');
const source=new Map(read(path.join(dataDir,'vocabulary.json')).map(x=>[x.id,x])),repairs=read(path.join(dataDir,'vocabulary-source-repairs.json'));
const locales=['id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const translated=Object.fromEntries(locales.map(l=>{const f=work&&path.join(work,'translations-'+l+'.json');return[l,f&&fs.existsSync(f)?read(f):{}]}));
const corrections=read(path.join(dir,'editorial-corrections.json')).entries;
const target=path.join(dataDir,'vocabulary-practical-example-additions.json'),baseline=read(path.join(dataDir,'vocabulary-practical-examples.json')),output=require('./read-vocabulary-practical-examples.cjs')(root),pending=[],seen=new Set();
for(const file of fs.readdirSync(dir).filter(x=>/^batch-\d+\.tsv$/.test(x)).sort())for(const line of fs.readFileSync(path.join(dir,file),'utf8').trim().split('\n')){
 const parts=line.split('|');assert.equal(parts.length,4,file+' expected ID, Japanese, English, Vietnamese');const [id,sourceJa,en,vi]=parts;
 assert(!seen.has(id),id+' duplicate authoring row');seen.add(id);
 const original=source.get(id);assert(original,id);assert(!original.exampleJa,id+' preserve legacy example');
 const item={...original,...repairs[id]},translations={en,vi,...Object.fromEntries(locales.map(l=>[l,clean(translated[l][id])]))};
 if(corrections[id]){assert.equal(corrections[id].sourceJa,sourceJa,id+' stale editorial correction');Object.assign(translations,corrections[id].translations);}
 // A checkout already contains the integrated legacy drafts. Reuse only exact
 // source/headword/reading matches when the optional offline cache is absent.
 const existing=output.entries[id];
 if(!work&&existing&&existing.sourceJa===sourceJa&&existing.word===item.word&&existing.reading===item.reading){
  for(const l of locales)if(!translations[l])translations[l]=existing.translations[l];
 }
 if(!Object.values(translations).every(v=>typeof v==='string'&&v.trim())){pending.push(id);continue;}
 const targetForm=({'VOC0413':'売って','VOC0415':'働き'})[id]||item.word;assert(sourceJa.includes(targetForm),id+' must demonstrate target');
 output.entries[id]={word:item.word,reading:item.reading,targetForm,sourceJa,translations,sourceBatch:file};
}
// Direct multilingual batches are reproducible without a local model/cache. Each row
// binds the target surface, Japanese source and all translations in one record.
for(const file of fs.readdirSync(dir).filter(x=>/^direct-\d+\.json$/.test(x)).sort()){
 const batch=read(path.join(dir,file)),required=['en','vi',...locales];
 assert.deepEqual(batch.locales,required,file+' locale order');
 for(const row of batch.rows){
  assert.equal(row.length,15,file+' expected ID, target form, Japanese and 12 translations');
  const [id,targetForm,sourceJa,...values]=row;assert(!seen.has(id),id+' duplicate authoring row');seen.add(id);
  const original=source.get(id);assert(original,id);assert(!original.exampleJa,id+' preserve legacy example');
  const item={...original,...repairs[id]};assert(sourceJa.includes(targetForm),id+' must demonstrate target');
  assert(values.every(v=>typeof v==='string'&&v.trim()),id+' incomplete direct translation');
  output.entries[id]={word:item.word,reading:item.reading,targetForm,sourceJa,translations:Object.fromEntries(required.map((l,i)=>[l,values[i]])),sourceBatch:file,translationMethod:'Direct AI multilingual authoring bound to Japanese source; not native-reviewed'};
 }
}
output.status='in_progress';output.generatedBy='AI';output.nativeReviewed=false;output.semanticReview='focused AI review only; not an all-record/all-locale quality certification';output.editorialCorrections='docs/vocabulary-workspace/practical-examples/editorial-corrections.json';
output.translationMethod={tsvBatches:'English and Vietnamese directly authored; other locales drafted offline with MADLAD-400 3B and source-bound editorial corrections',directJsonBatches:'All 12 translations directly AI-authored with Japanese source; each record identifies its sourceBatch',nativeReviewed:false,runtimeTranslation:false};
const shardEntries={},legacyEntries={};
for(const [id,item]of Object.entries(output.entries)){
 const match=/^direct-(\d+)\.json$/.exec(item.sourceBatch||'');
 if(match&&Number(match[1])>=1000)(shardEntries[item.sourceBatch]??={})[id]=item;
 else legacyEntries[id]=item;
}
const entries=Object.fromEntries(Object.entries(legacyEntries).filter(([id,item])=>JSON.stringify(item)!==JSON.stringify(baseline.entries[id])));
fs.writeFileSync(target,JSON.stringify({generatedBy:'AI',nativeReviewed:false,entries},null,2)+'\n');
const shardDir=path.join(dataDir,'vocabulary-practical-example-shards');fs.mkdirSync(shardDir,{recursive:true});
const crypto=require('node:crypto'),files=[],imports=[],spreads=[];
for(const [file,entries]of Object.entries(shardEntries).sort(([a],[b])=>a.localeCompare(b))){
 const text=JSON.stringify({generatedBy:'AI',nativeReviewed:false,entries},null,2)+'\n';
 fs.writeFileSync(path.join(shardDir,file),text);
 files.push({file,entries:Object.keys(entries).length,sha256:crypto.createHash('sha256').update(text).digest('hex')});
 const name='shard'+imports.length;imports.push(`import ${name} from './vocabulary-practical-example-shards/${file}';`);spreads.push(`    ...${name}.entries,`);
}
fs.writeFileSync(path.join(shardDir,'manifest.json'),JSON.stringify({generatedBy:'AI',nativeReviewed:false,entries:files.reduce((n,f)=>n+f.entries,0),files},null,2)+'\n');
fs.writeFileSync(path.join(dataDir,'vocabulary-practical-example-shards.ts'),imports.join('\n')+'\nexport const practicalExampleShardEntries = {\n'+spreads.join('\n')+'\n};\n');
console.log(JSON.stringify({completeAddedEntries:Object.keys(output.entries).length,overlayEntries:Object.keys(entries).length,shardEntries:files.reduce((n,f)=>n+f.entries,0),pendingAuthoredEntries:pending.length}));
