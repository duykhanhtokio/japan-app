#!/usr/bin/env node
'use strict';
// Pass only the newly authored figure IDs; unrelated raster imports are URI adapters.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const Module=require('node:module');
const {transformSync}=require('@babel/core');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=JSON.parse(read('src/data/agriculture/recognition-images.json'));
const registry=JSON.parse(read('src/data/agriculture/recognition-image-locales.json'));
const lessons=new Map(JSON.parse(read('src/data/agriculture/lessons.ja.json')).lessons.map(l=>[l.id,l]));
const languages=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','km','th','tl'];
const ids=process.argv.slice(2);assert(ids.length>=1,'supply changed figure IDs');
const selected=ids.map(id=>{const f=data.images.find(x=>x.id===id);assert(f,`unknown ${id}`);return f;});
const sources=new Map();
for(const f of selected){
 const bytes=fs.readFileSync(path.join(root,f.assetPath));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.assetSha256);
 const mime=f.assetPath.endsWith('.png')?'image/png':'image/webp';
 sources.set(path.basename(f.assetPath),{uri:'data:'+mime+';base64,'+bytes.toString('base64')});
 const entry=registry.entries[f.id];assert(entry,`missing ${f.id}`);
 assert.equal(entry.assetSha256,f.assetSha256);
 if(f.labelsJa?.length){assert.deepEqual(entry.sourceLabelsJa,f.labelsJa);for(const language of languages){assert.equal(entry.locales[language].labels?.length,f.labelsJa.length);assert(entry.locales[language].labels.every(x=>typeof x==='string'&&x.trim()));}}
 assert.deepEqual(entry.sourceJapanese,{title:f.titleJa,alt:f.altJa,observation:f.observationJa,limit:f.limitJa});
 assert.deepEqual(Object.keys(entry.locales).sort(),[...languages].sort());
 for(const lid of f.lessonIds){assert.equal(entry.lessonSourceHashes[lid],lessons.get(lid).sourceHash);assert.equal(entry.lessonRevisions[lid],lessons.get(lid).revision);}
 for(const language of languages){const t=entry.locales[language],limit=registry.limits[t.limitKey];assert(limit);assert.equal(limit.sourceJapanese,f.limitJa);for(const key of ['title','alt','observation'])assert.equal(typeof t[key],'string');assert(t.title.trim()&&t.alt.trim()&&t.observation.trim()&&limit.locales[language]?.trim());}
}
const cache=new Map();
function load(name){
 if(cache.has(name))return cache.get(name).exports;
 const filename=path.join(root,'src/components/agriculture',name+'.tsx');
 const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 const loaded=new Module(filename,module);loaded.filename=filename;loaded.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(name,loaded);const original=loaded.require.bind(loaded);
 loaded.require=id=>{
  if(id==='react-native')return require('react-native-web');
  if(id==='@/data/agriculture/recognition-images.json')return data;
  if(id==='@/data/agriculture/recognition-image-locales.json')return registry;
  if(id==='./ZoomableFigure')return load('ZoomableFigure');
  if(id==='./CropCalendarFigure')return {};// Not used by standalone soil/irrigation plates.
  if(id==='./FlowerLegendFigure')return {};// Not used by these standalone appearance plates.
  if(/\.(png|webp)$/.test(id))return sources.get(path.basename(id))||{uri:'asset://'+id};
  return original(id);
 };
 loaded._compile(code,filename);return loaded.exports;
}
const {RecognitionImages,recognitionImageTranslation}=load('RecognitionImages');
const colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
const render=(f,l,level,language,showTranslation=true,lessonRevision=l.revision)=>renderToStaticMarkup(React.createElement(RecognitionImages,{lessonId:l.id,lessonSourceHash:l.sourceHash,lessonRevision,level,language,showTranslation,colors}));
let contexts=0,renders=0,negative=0;
for(const f of selected){
 const entry=registry.entries[f.id];
 for(const lid of f.lessonIds){const l=lessons.get(lid);
  for(const level of f.scopeLevels.filter(x=>l.levels.includes(x))){contexts++;
   for(const language of languages){
    const t=recognitionImageTranslation(f,lid,l.sourceHash,l.revision,language);assert(t,`${f.id}/${lid}/${language}`);
    const html=render(f,l,level,language);
    assert(html.includes(`data-testid="${f.id}-localized-title"`));
    for(const key of ['title','alt','observation','limit'])assert(html.includes(escape(t[key])),`missing actual ${key} ${f.id}/${language}`);
    assert(html.includes(escape(f.titleJa))&&html.includes(escape(f.observationJa))&&html.includes(escape(f.limitJa)),'canonical Japanese must remain visible');
    if(f.labelsJa?.length){assert.deepEqual(t.labels,entry.locales[language].labels);for(let i=0;i<f.labelsJa.length;i++){assert(html.includes(`data-testid="${f.id}-localized-label-${i}"`));assert(html.includes(escape(f.labelsJa[i])));assert(html.includes(escape(t.labels[i])));}}renders++;
    assert.equal(recognitionImageTranslation(f,lid,'0'.repeat(64),l.revision,language),null);negative++;
    assert.equal(recognitionImageTranslation(f,lid,l.sourceHash,'stale-revision',language),null);negative++;
   }
   assert(!render(f,l,level,'vi',false).includes(`data-testid="${f.id}-localized-title"`));negative++;
   assert(!render(f,l,level,'vi',true,'stale-revision').includes(`data-testid="${f.id}-localized-title"`));negative++;
  }
 }
 const lid=f.lessonIds[0],l=lessons.get(lid),language='vi';
 const asset=entry.assetSha256;entry.assetSha256='0'.repeat(64);assert.equal(recognitionImageTranslation(f,lid,l.sourceHash,l.revision,language),null);entry.assetSha256=asset;negative++;
 const alt=entry.sourceJapanese.alt;entry.sourceJapanese.alt+=' changed';assert.equal(recognitionImageTranslation(f,lid,l.sourceHash,l.revision,language),null);entry.sourceJapanese.alt=alt;negative++;
 const limit=registry.limits[entry.locales[language].limitKey],saved=limit.locales[language];delete limit.locales[language];assert.equal(recognitionImageTranslation(f,lid,l.sourceHash,l.revision,language),null);limit.locales[language]=saved;negative++;
 if(f.labelsJa?.length){
  const sourceLabels=entry.sourceLabelsJa;entry.sourceLabelsJa=[...sourceLabels].reverse();assert.equal(recognitionImageTranslation(f,lid,l.sourceHash,l.revision,language),null);entry.sourceLabelsJa=sourceLabels;negative++;
  const labels=entry.locales[language].labels;entry.locales[language].labels=labels.slice(1);assert.equal(recognitionImageTranslation(f,lid,l.sourceHash,l.revision,language),null);negative++;
  entry.locales[language].labels=[...labels];entry.locales[language].labels[0]='';assert.equal(recognitionImageTranslation(f,lid,l.sourceHash,l.revision,language),null);entry.locales[language].labels=labels;negative++;
 }
}
assert.equal(registry.nativeReviewed,false);assert.equal(registry.domainReviewed,false);
console.log(`PASS recognition-locale-batch: ${selected.length} unchanged actual raster plates; ${contexts} source-bound lesson/course contexts; ${renders} actual12locale renders; ${negative} stale/hidden/dependency/limit rejection checks; canonical Japanese retained.`);
