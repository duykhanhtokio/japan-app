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
const figure=data.images.find(f=>f.id===(process.argv[2]||'agr-f40-general-seeder'));assert(figure);
const imageBytes=fs.readFileSync(path.join(root,figure.assetPath));
assert.equal(crypto.createHash('sha256').update(imageBytes).digest('hex'),figure.assetSha256);
assert.equal(imageBytes.subarray(8,12).toString(),'WEBP');
const actualSource={uri:'data:image/webp;base64,'+imageBytes.toString('base64')};
const cache=new Map();
function load(name){
 if(cache.has(name))return cache.get(name).exports;
 const filename=path.join(root,'src/components/agriculture',name+'.tsx');
 const source=fs.readFileSync(filename,'utf8');
 const code=transformSync(source,{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 const loaded=new Module(filename,module);loaded.filename=filename;loaded.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(name,loaded);const original=loaded.require.bind(loaded);
 loaded.require=id=>{
  if(id==='react-native')return require('react-native-web');
  if(id==='@/data/agriculture/recognition-images.json')return data;
  if(id==='@/data/agriculture/recognition-image-locales.json')return localeData;
  if(id==='./ZoomableFigure')return load('ZoomableFigure');
  if(id==='./RecognitionImages')return load('RecognitionImages');
  if(id==='@/data/agriculture/exam-illustrations.json')return JSON.parse(read('src/data/agriculture/exam-illustrations.json'));
  if(id==='@/data/agriculture/daily-learning-support.json')return JSON.parse(read('src/data/agriculture/daily-learning-support.json'));
  if(id==='@/data/agriculture')return {agricultureTranslation:()=>null};
  if(['./DailyInstructionDiagram','./Statistics2019Figure','./WinterClimateFigure','./WinterSpatialReference','@/components/tokutei/StudyAppearance'].includes(id))return {};
  if(id==='./FlowerLegendFigure')return {};// Not invoked by the two selected lotus lesson contexts.
  if(/\.(png|webp)$/.test(id))return id.endsWith(path.basename(figure.assetPath))?actualSource:{uri:'asset://'+id};
  return original(id);
 };
 loaded._compile(code,filename);return loaded.exports;
}
const {RecognitionImages,hasRecognitionImage}=load('RecognitionImages');
const colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
const marker=`data-testid="${figure.id}"`;
const render=(lesson,level,sourceHash=lesson.sourceHash)=>renderToStaticMarkup(React.createElement(RecognitionImages,{lessonId:lesson.id,lessonSourceHash:sourceHash,lessonRevision:lesson.revision,level,colors}));
let positive=0,negative=0;
for(const lessonId of figure.lessonIds){
 const lesson=lessons.get(lessonId);assert(lesson);assert.equal(figure.lessonSourceHashes[lessonId],lesson.sourceHash);
 for(const level of figure.scopeLevels){
  assert(lesson.levels.includes(level));assert(hasRecognitionImage(lessonId,lesson.sourceHash,figure.assetKey,level));
  const html=render(lesson,level);assert(html.includes(marker));assert(html.includes('data:image/webp;base64,'));assert(html.includes(figure.titleJa));assert(html.includes(figure.altJa));positive++;
  for(const badHash of ['0'.repeat(64),'']){assert(!hasRecognitionImage(lessonId,badHash,figure.assetKey,level));assert(!render(lesson,level,badHash).includes(marker));negative++;}
 }
 assert(!render(lesson,'3').includes(marker));negative++;
}
const mapping=read('src/components/agriculture/RecognitionImages.tsx');assert(mapping.includes(`"${figure.assetKey}":require('../../../${figure.assetPath}')`));
const daily=JSON.parse(read('src/data/agriculture/daily-learning-support.json'));
const {DailyLearningFigure}=load('DailyLearningSupport');
for(const [lessonId,b] of Object.entries(daily.figureBindings).filter(([_,b])=>b.figureId===figure.id)){
 const lesson=lessons.get(lessonId);assert.equal(b.assetSha256,figure.assetSha256);assert.equal(b.lessonSourceHash,lesson.sourceHash);
 for(const level of b.scopeLevels){const html=renderToStaticMarkup(React.createElement(DailyLearningFigure,{lesson,level,colors}));assert(html.includes('data:image/webp;base64,'));assert(html.includes(b.reuseReasonJa));positive++;}
}
const exam=JSON.parse(read('src/data/agriculture/exam-illustrations.json'));
const {AgricultureExamIllustration,hasAgricultureExamIllustration}=load('AgricultureExamIllustration');
for(const item of exam.illustrations.filter(i=>i.figureId===figure.id)){
 assert.equal(item.sourceAssetSha256,figure.assetSha256);assert.deepEqual(item.masks,[],'new art requires full reassessment of nonempty masks');
 for(const level of item.scopeLevels){assert(hasAgricultureExamIllustration(item.id,item.revision,level));const html=renderToStaticMarkup(React.createElement(AgricultureExamIllustration,{id:item.id,revision:item.revision,level,colors}));assert(html.includes('data:image/webp;base64,'));assert(!html.includes(figure.titleJa),'teaching label leaked into exam');positive++;assert(!hasAgricultureExamIllustration(item.id,'stale',level));negative++;}
}
console.log(`PASS royal equipment ${figure.id}: ${positive} actual production recognition/daily/exam renders with verified WebP; ${negative} source/scope/revision rejection cases. No pixel/device/domain certification.`);
