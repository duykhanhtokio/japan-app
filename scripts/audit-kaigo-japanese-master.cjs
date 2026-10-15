const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'), modules=process.env.TOKUTEI_QA_MODULES||root;
const esbuild=require(require.resolve('esbuild',{paths:[modules]}));
const code=esbuild.buildSync({stdin:{contents:`export * from './src/data/kaigo/japanese-reading';export * from './src/data/kaigo/catalog';export * from './src/data/kaigo/weekly-learning';export * from './src/data/kaigo/japanese-master';`,resolveDir:root},bundle:true,write:false,format:'cjs',platform:'node',logLevel:'error'}).outputFiles[0].text;
const box={exports:{}};new Function('module','exports',code)(box,box.exports);const m=box.exports;
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const vi=/[À-ỹ]/u, ja=/[\u3040-\u30ff\u3400-\u9fff]/u;
const classify=s=>!s?'empty':vi.test(s)?ja.test(s)?'mixed':'vietnamese':ja.test(s)?'japanese':'other';
const perDay=m.kaigoCatalog.map(e=>({day:e.day,id:e.id,kind:e.kind,week:Math.ceil(e.day/7),sections:m.japaneseSectionsFor(e).map(s=>({id:s.id,legacyHeadingLanguage:classify(s.heading),legacyParagraphs:s.paragraphs.map((p,i)=>({index:i,language:classify(p),sha256:hash(p)})),hasFullJapaneseRepresentation:s.japaneseComplete,japaneseMasterStatus:s.masterStatus??'legacy_fields_presence_only',japaneseParagraphCount:s.paragraphsJa.length,sourceRevision:m.japaneseMasterSections[s.id]?m.japaneseMasterRevision(m.japaneseMasterSections[s.id]):null,translationStatus:s.masterStatus?'Japanese_master_translation_tracking':'legacy_unverified',translationDraftLanguages:Object.keys(m.japaneseMasterTranslations[s.id]??{}).filter(lang=>m.translationForMaster(s.id,lang)),domainReviewed:false,nativeReviewed:false}))}));
const all=perDay.flatMap(d=>d.sections),week1=perDay.filter(d=>d.week===1).flatMap(d=>d.sections);
assert.equal(all.length,866);assert.equal(perDay.length,176);assert.equal(week1.length,73);assert(week1.every(s=>s.hasFullJapaneseRepresentation));
const totals={days:perDay.length,sections:all.length,completeJapaneseRepresentations:all.filter(s=>s.hasFullJapaneseRepresentation).length,missingJapaneseRepresentations:all.filter(s=>!s.hasFullJapaneseRepresentation).length,week1Sections:week1.length,week1JapaneseParagraphs:week1.reduce((a,s)=>a+s.japaneseParagraphCount,0),masterTranslationDrafts:Object.values(m.japaneseMasterTranslations).reduce((n,v)=>n+Object.keys(v).length,0),sectionsWith12TranslationDrafts:Object.keys(m.japaneseMasterTranslations).length,sourceBookKnowledgeCoveragePercent:null};
// Every existing field is counted, including quiz explanations and captions.
const fieldInventory=[];
for(const name of ['content','atomic-supplements','gap-supplements','depth-supplements','completeness-supplements','language-supplements','daily-plan','weekly-art-allocation']){
 const data=JSON.parse(fs.readFileSync(path.join(root,'src/data/kaigo',name+'.json')));
 function walk(x,p,id){if(Array.isArray(x))x.forEach((v,i)=>walk(v,p+'['+i+']',id));else if(x&&typeof x==='object'){id=x.id??id;for(const [k,v] of Object.entries(x))walk(v,p+'.'+k,id);}else if(typeof x==='string'&&(/Vi|Ja|caption|context|objective|rationale|prompt|expected|knowledge|meaning|title|limit|method|mistake|text|reading/i.test(p)))fieldInventory.push({file:name+'.json',id,path:p,language:classify(x),sha256:hash(x)});}
 walk(data,'$',null);
}
const report={date:'2026-10-16',status:'WEEK1_JAPANESE_DRAFT_INTEGRATED_TRANSLATIONS_PENDING',totals,review:{humanReviewed:false,domainReviewed:false,nativeReviewed:false,nativeDeviceTested:false,releaseReady:false},perDay,fieldInventory};
const out=path.join(root,'docs/ssw-workspace/kaigo/reviews/japanese-master-inventory-2026-10-16.json');fs.writeFileSync(out,JSON.stringify(report)+'\n');
console.log(JSON.stringify({...totals,inventoriedLanguageFields:fieldInventory.length}));
