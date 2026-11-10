#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const lessons=read('src/data/agriculture/lessons.ja.json').lessons,figures=read('src/data/agriculture/recognition-images.json'),readings=read('src/data/agriculture/image-readings.json'),locales=read('src/data/agriculture/recognition-image-locales.json');
const support=read('src/data/agriculture/daily-learning-support.json'),cache=new Map();
function load(name){
 if(cache.has(name))return cache.get(name).exports;
 const filename=path.join(root,'src/components/agriculture',name+'.tsx');
 const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(name,m);const original=m.require.bind(m);
 m.require=id=>{
  if(id==='react-native')return require('react-native-web');
  if(id==='react'||id.startsWith('react/'))return original(id);
  if(id==='@/data/agriculture')return {agricultureLesson:(id,level)=>lessons.find(l=>l.id===id&&l.levels.includes(level))};
  if(id==='@/data/agriculture/recognition-images.json')return figures;
  if(id==='@/data/agriculture/recognition-image-locales.json')return locales;
  if(id==='@/data/agriculture/image-readings.json')return readings;
  if(id==='@/data/agriculture/daily-learning-support.json')return support;
  if(['./AgricultureImageRuby','./RecognitionImages'].includes(id))return load(id.slice(2));
  if(id==='./ZoomableFigure')return {ZoomableFigure:p=>React.createElement('img',{'data-testid':p.testID,alt:p.altJa})};
  if(/\.(png|webp)$/.test(id))return {uri:'fixture://'+id};
  return {isFertilizerNativeContext:()=>false,isNativeProcessContext:()=>false};
 };
 m._compile(code,filename);return m.exports;
}
const {DailyLearningFigure}=load('DailyLearningSupport');
const colors={text:'#123',translation:'#fff',translationText:'#123',border:'#abc'},langs=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','km','th','tl'];
const render=(lesson,level,language='ja',showTranslation=false)=>renderToStaticMarkup(React.createElement(DailyLearningFigure,{lesson,level,colors,language,showTranslation,includeExisting:true}));
const marker=(f,field)=>`data-testid="agri-image-ruby-${f.id}-${field}"`;
let renders=0,rejects=0,fields=0;
for(const id of ['agr-pest-weeds','agr-pest-ipm']){
 const l=lessons.find(l=>l.id===id),b=support.figureBindings[id],f=b?figures.images.find(f=>f.id===b.figureId):figures.images.find(f=>f.lessonIds.includes(id)&&f.lessonSourceHashes[id]===l.sourceHash),entry=readings.entries[f.id];assert(f&&entry);
 for(const level of l.levels.filter(level=>f.scopeLevels.includes(level))){
  for(const language of langs){
   const html=render(l,level,language,true);
   for(const field of ['title','observation','limit']){assert(html.includes(marker(f,field)),`${id}/${language}/${field}`);fields++;}
   if(f.labelsJa)for(let i=0;i<f.labelsJa.length;i++){if(language!=='ja'){assert(html.includes(marker(f,`label:${i}`)));fields++;}}
   assert.equal(html.includes(`data-testid="agri-daily-support-${l.id}-localized-title"`),language!=='ja');renders++;
  }
  for(const field of ['title','observation','limit']){
   const original=entry.fields[field];entry.fields[field]={...original,sourceJapanese:'stale'};assert(!render(l,level).includes(marker(f,field)));entry.fields[field]=original;rejects++;
  }
  const asset=entry.assetSha256;entry.assetSha256='0'.repeat(64);assert(!render(l,level).includes(marker(f,'title')));entry.assetSha256=asset;rejects++;
  const rev=entry.lessonRevisions[id];entry.lessonRevisions[id]='stale';assert(!render(l,level).includes(marker(f,'title')));entry.lessonRevisions[id]=rev;rejects++;
  const hash=entry.lessonSourceHashes[id];entry.lessonSourceHashes[id]='0'.repeat(64);assert(!render(l,level).includes(marker(f,'title')));entry.lessonSourceHashes[id]=hash;rejects++;
  assert(!render({...l,sourceHash:'0'.repeat(64)},level).includes(marker(f,'title')));rejects++;
 }
}
console.log(`PASS daily-image-ruby-route: ${renders} actual DailyLearningFigure/AgricultureImageRuby/RNW locale renders; ${fields} source-bound image reading fields; ${rejects} stale field/asset/revision/hash/source fallbacks. Raster leaf isolated; no browser/native-device certification.`);
