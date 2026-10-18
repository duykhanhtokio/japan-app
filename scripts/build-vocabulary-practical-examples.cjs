// Integrate only fully translated examples. Partial authoring never counts as runtime coverage.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const clean=text=>typeof text==='string'?text.replace(/&\s*#\s*(\d+)\s*;/g,(_,n)=>Number(n)<=0x10ffff?String.fromCodePoint(Number(n)):'').replace(/\u00a0/g,' ').trim():text;
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const work=process.env.VOCABULARY_EXAMPLE_TRANSLATIONS;if(!work)throw Error('Set VOCABULARY_EXAMPLE_TRANSLATIONS to the offline translation output directory.');
const dir=path.join(root,'docs/vocabulary-workspace/practical-examples'),dataDir=path.join(root,'src/data/generated');
const source=new Map(read(path.join(dataDir,'vocabulary.json')).map(x=>[x.id,x])),repairs=read(path.join(dataDir,'vocabulary-source-repairs.json'));
const locales=['id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const translated=Object.fromEntries(locales.map(l=>{const f=path.join(work,'translations-'+l+'.json');return[l,fs.existsSync(f)?read(f):{}]}));
const corrections=read(path.join(dir,'editorial-corrections.json')).entries;
const target=path.join(dataDir,'vocabulary-practical-examples.json'),output=read(target),pending=[],seen=new Set();
for(const file of fs.readdirSync(dir).filter(x=>/^batch-\d+\.tsv$/.test(x)).sort())for(const line of fs.readFileSync(path.join(dir,file),'utf8').trim().split('\n')){
 const parts=line.split('|');assert.equal(parts.length,4,file+' expected ID, Japanese, English, Vietnamese');const [id,sourceJa,en,vi]=parts;
 assert(!seen.has(id),id+' duplicate authoring row');seen.add(id);
 const original=source.get(id);assert(original,id);assert(!original.exampleJa,id+' preserve legacy example');
 const item={...original,...repairs[id]},translations={en,vi,...Object.fromEntries(locales.map(l=>[l,clean(translated[l][id])]))};
 if(corrections[id]){assert.equal(corrections[id].sourceJa,sourceJa,id+' stale editorial correction');Object.assign(translations,corrections[id].translations);}
 if(!Object.values(translations).every(v=>typeof v==='string'&&v.trim())){pending.push(id);continue;}
 const targetForm=({'VOC0413':'売って','VOC0415':'働き'})[id]||item.word;assert(sourceJa.includes(targetForm),id+' must demonstrate target');
 output.entries[id]={word:item.word,reading:item.reading,targetForm,sourceJa,translations,sourceBatch:file};
}
output.status='in_progress';output.generatedBy='AI';output.nativeReviewed=false;output.semanticReview='focused AI review only; not an all-record/all-locale quality certification';output.editorialCorrections='docs/vocabulary-workspace/practical-examples/editorial-corrections.json';
output.translationMethod={en:'Directly authored with Japanese source',vi:'Directly authored with Japanese source',otherLocales:'Offline MADLAD-400 3B translation from the explicitly authored English meaning; machine translation, not native-reviewed',runtimeTranslation:false};
fs.writeFileSync(target,JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify({completeAddedEntries:Object.keys(output.entries).length,pendingAuthoredEntries:pending.length}));
