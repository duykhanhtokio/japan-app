#!/usr/bin/env node
'use strict';
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
const localeData=JSON.parse(read('src/data/agriculture/recognition-image-locales.json'));
const lessons=new Map(JSON.parse(read('src/data/agriculture/lessons.ja.json')).lessons.map(l=>[l.id,l]));
const targetLessons=['agr-par12-management-machine-mechanisms','agr-ricework-nursery'];
const expectedIds=new Set(['agr-equipment-manual-shoulder-sprayer-v1','agr-equipment-powered-backpack-sprayer-v1','agr-equip-speed-sprayer-v1','agr-equipment-portable-brush-cutter-v1','walkbehind-hammer-mower-v1','agr-equipment-ride-on-mower-v1','agr-fig-f40-rice-leaf-positions-v1','agr-fig-f40-rice-machines-scenes-v1']);
const selected=data.images.filter(f=>expectedIds.has(f.id));assert.equal(selected.length,8);
const actualAssets=new Map();
for(const f of selected){
 const bytes=fs.readFileSync(path.join(root,f.assetPath));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.assetSha256,`stale bytes ${f.id}`);
 assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 actualAssets.set(path.basename(f.assetPath),{uri:'data:image/png;base64,'+bytes.toString('base64')});
}
const cache=new Map();
function load(name){
 if(cache.has(name))return cache.get(name).exports;
 const filename=path.join(root,'src/components/agriculture',name+'.tsx');
 const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,
  plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 const loaded=new Module(filename,module);loaded.filename=filename;loaded.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(name,loaded);const original=loaded.require.bind(loaded);
 loaded.require=id=>{
  if(id==='react-native')return require('react-native-web');
  if(id==='@/data/agriculture/recognition-images.json')return data;
  if(id==='@/data/agriculture/recognition-image-locales.json')return localeData;
  if(id==='./ZoomableFigure')return load('ZoomableFigure');
  if(id==='./FlowerLegendFigure')return {};// Not invoked by the eight selected non-flower figures.
  if(/\.(png|webp)$/.test(id))return actualAssets.get(path.basename(id))||{uri:'asset://'+id};
  return original(id);
 };
 loaded._compile(code,filename);return loaded.exports;
}
const {RecognitionImages,hasRecognitionImage,recognitionImageTranslation}=load('RecognitionImages');
const colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
const render=(lesson,level,sourceHash=lesson.sourceHash)=>renderToStaticMarkup(React.createElement(RecognitionImages,{lessonId:lesson.id,lessonSourceHash:sourceHash,lessonRevision:lesson.revision,level,colors}));
let selectorVariants=0,negative=0,renderGroups=0,renderedImages=0;
for(const lid of targetLessons){
 const l=lessons.get(lid);assert(l);
 for(const level of l.levels){
  const expected=selected.filter(f=>f.lessonIds.includes(lid)&&f.scopeLevels.includes(level));
  const html=render(l,level);renderGroups++;
  for(const f of expected){
   assert.equal(f.lessonSourceHashes[lid],l.sourceHash);
   assert(hasRecognitionImage(lid,l.sourceHash,f.assetKey,level));selectorVariants++;
   assert(html.includes(`data-testid="${f.id}"`));assert(html.includes(f.altJa));renderedImages++;
   for(const badHash of ['0'.repeat(64),'',undefined]){assert(!hasRecognitionImage(lid,badHash,f.assetKey,level));negative++;}
   assert(!hasRecognitionImage(lid,l.sourceHash,f.assetKey,'3'));negative++;
   // These preexisting figures have no localized row. Preserve Japanese fallback, never borrow another image's descriptions.
   assert(!localeData.entries[f.id]);
   for(const language of ['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','km','th','tl'])assert.equal(recognitionImageTranslation(f,lid,l.sourceHash,l.revision,language),null);
  }
  assert.equal(render(l,level,'0'.repeat(64)),'');negative++;
 }
}
let stale=0;
for(const f of data.images)for(const [lid,hash]of Object.entries(f.lessonSourceHashes))if(!lessons.has(lid)||lessons.get(lid).sourceHash!==hash)stale++;
assert.equal(stale,0,'unresolved current recognition lesson bindings remain');
console.log(`PASS recognition-source-repairs: ${selected.length} verified actual PNGs; ${selectorVariants} current selectors; ${renderGroups} production render groups/${renderedImages} images; ${negative} negative guards; 12-locale Japanese fallbacks retained; registry stale lesson bindings=${stale}.`);
