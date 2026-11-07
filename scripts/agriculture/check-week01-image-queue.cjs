#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const {transformSync}=require('@babel/core');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const figures=JSON.parse(read('src/data/agriculture/recognition-images.json'));
const localeData=JSON.parse(read('src/data/agriculture/recognition-image-locales.json'));
const lessons=new Map(JSON.parse(read('src/data/agriculture/lessons.ja.json')).lessons.map(l=>[l.id,l]));
const queue=JSON.parse(read('docs/ssw-workspace/agriculture/royal-weekly-20261107/full-existing-week-image-queue.json'));
const core=queue.weeks.find(w=>w.level==='1'&&w.week===1).recognitionIds;
const languages=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','km','th','tl'];
const filename=path.join(root,'src/components/agriculture/RecognitionImages.tsx');
const source=read('src/components/agriculture/RecognitionImages.tsx');
const code=transformSync(source,{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
const loaded=new Module(filename,module);loaded.filename=filename;loaded.paths=Module._nodeModulePaths(path.dirname(filename));const original=loaded.require.bind(loaded);
loaded.require=id=>{
 if(id==='react-native')return require('react-native-web');
 if(id==='@/data/agriculture/recognition-images.json')return figures;
 if(id==='@/data/agriculture/recognition-image-locales.json')return localeData;
 if(id.startsWith('./'))return {};// Leaf renderer imports are not invoked by the actual pure source/locale selector.
 if(/\.(png|webp)$/.test(id))return{uri:'asset://'+id};
 return original(id);
};
loaded._compile(code,filename);const {recognitionImageTranslation}=loaded.exports;
let pairs=0,negative=0;
for(const id of core){
 const f=figures.images.find(x=>x.id===id);assert(f);
 const e=localeData.entries[id];assert(e,`missing ${id}`);
 assert.deepEqual(e.sourceJapanese,{title:f.titleJa,alt:f.altJa,observation:f.observationJa,limit:f.limitJa});assert.equal(e.assetSha256,f.assetSha256);
 assert.deepEqual(Object.keys(e.locales).sort(),[...languages].sort());
 for(const lid of f.lessonIds){const l=lessons.get(lid);assert(l);assert.equal(e.lessonSourceHashes[lid],l.sourceHash);assert.equal(e.lessonRevisions[lid],l.revision);}
 const lid=f.lessonIds[0],l=lessons.get(lid);
 for(const language of languages){
  const t=recognitionImageTranslation(f,lid,l.sourceHash,l.revision,language);assert(t,`actual selector rejected ${id}/${language}`);
  for(const key of ['title','alt','observation','limit'])assert(t[key]?.trim(),`empty ${key}`);pairs++;
 }
 assert.equal(recognitionImageTranslation(f,lid,'0'.repeat(64),l.revision,'vi'),null);negative++;
 assert.equal(recognitionImageTranslation(f,lid,l.sourceHash,'stale-revision','vi'),null);negative++;
}
assert.equal(core.length,26);assert.equal(pairs,312);
assert.deepEqual(queue.week01Reconciliation.pendingLocaleFigureIds,[]);
assert.equal(queue.week01Reconciliation.currentCoreLocalizedEntries,26);
assert.equal(queue.week01Reconciliation.currentValidCoreFigureLocalePairs,312);
assert.deepEqual(queue.remainingWeek01,[]);
assert.equal(queue.week01Reconciliation.wholeWeekComplete,false);
for(const flag of ['nativeReviewed','domainReviewed','physicalDeviceTested','learnerDurationMeasured'])assert.equal(queue.week01Reconciliation[flag],false);
console.log(`PASS week01-image-queue: ${core.length} core records/${pairs} current source-bound production locale selectors/${negative} stale source+revision rejects; supported locale deficit0; external acceptance flags remainfalse.`);
