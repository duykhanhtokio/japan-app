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
const figure=data.images.find(f=>f.id==='agr-fig-f40-crop-lotus-atlas-v1');assert(figure);
assert.equal(figure.assetPath,'assets/agriculture/royal-weekly-20261107/week02/lotus-above-water-and-rhizome.webp');
assert.deepEqual(figure.scopeLevels,['2']);
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
 const lesson=lessons.get(lessonId);assert(lesson);assert.equal(figure.lessonSourceHashes[lessonId],lesson.sourceHash);assert(lesson.levels.includes('2'));
 assert(hasRecognitionImage(lessonId,lesson.sourceHash,figure.assetKey,'2'));
 const html=render(lesson,'2');assert(html.includes(marker));assert(html.includes('data:image/webp;base64,'));assert(html.includes(figure.titleJa));assert(html.includes(figure.altJa));positive++;
 for(const badHash of ['0'.repeat(64),'']){assert(!hasRecognitionImage(lessonId,badHash,figure.assetKey,'2'));assert(!render(lesson,'2',badHash).includes(marker));negative++;}
 for(const level of ['1','3']){assert(!hasRecognitionImage(lessonId,lesson.sourceHash,figure.assetKey,level));assert(!render(lesson,level).includes(marker));negative++;}
}
assert(!hasRecognitionImage('unsupported-lesson',figure.lessonSourceHashes[figure.lessonIds[0]],figure.assetKey,'2'));negative++;
const mapping=read('src/components/agriculture/RecognitionImages.tsx');assert(mapping.includes(`"${figure.assetKey}":require('../../../${figure.assetPath}')`));
const daily=JSON.parse(read('src/data/agriculture/daily-learning-support.json'));assert(!Object.values(daily.figureBindings).some(b=>b.figureId===figure.id));
const exam=JSON.parse(read('src/data/agriculture/exam-illustrations.json'));assert(!exam.illustrations.some(i=>i.figureId===figure.id));
const queue=JSON.parse(read('docs/ssw-workspace/agriculture/royal-weekly-20261107/full-existing-week-image-queue.json'));
const currentPending=queue.weeks.find(w=>w.level==='1'&&w.week===1).recognitionIds.filter(id=>!localeData.entries[id]);
assert.deepEqual(queue.week01Reconciliation.pendingLocaleFigureIds,currentPending);
assert.equal(queue.week01Reconciliation.wholeWeekComplete,false);
assert.equal(queue.weeks.find(w=>w.level==='1'&&w.week===2).lotusDisposition.state,'not_applicable_declared_figure_scope_is_level2_only');
console.log(`PASS week02-lotus: ${positive} actual production lesson-context renders with verified WebP, ${negative} source/scope rejection cases, no exam/daily dependency edits; week01 recorded locale deficits=${currentPending.length}.`);
