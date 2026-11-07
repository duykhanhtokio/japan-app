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
const support=JSON.parse(read('src/data/agriculture/daily-learning-support.json'));
const figures=JSON.parse(read('src/data/agriculture/recognition-images.json'));
const lesson=JSON.parse(read('src/data/agriculture/lessons.ja.json')).lessons.find(l=>l.id==='agr-vegwork-feed');
const binding=support.figureBindings[lesson.id];
const figure=figures.images.find(f=>f.id===binding.figureId);assert(figure);
const imageBytes=fs.readFileSync(path.join(root,figure.assetPath));
assert.equal(crypto.createHash('sha256').update(imageBytes).digest('hex'),figure.assetSha256);
assert.equal(imageBytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
const imageSource={uri:'data:image/png;base64,'+imageBytes.toString('base64')};
const cache=new Map();
const isolated=new Set();
function load(relative){
 if(cache.has(relative))return cache.get(relative).exports;
 const filename=path.join(root,'src/components/agriculture',relative+'.tsx');
 const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,
  plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 const loaded=new Module(filename,module);loaded.filename=filename;loaded.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(relative,loaded);
 const original=loaded.require.bind(loaded);
 loaded.require=id=>{
  if(id==='react-native')return require('react-native-web');
  if(id==='@/data/agriculture/daily-learning-support.json')return support;
  if(id==='@/data/agriculture/recognition-images.json')return figures;
  if(id==='react'||id.startsWith('react/'))return original(id);
  if(['./RecognitionImages','./ZoomableFigure'].includes(id))return load(id.slice(2));
  if(/\.(png|webp)$/.test(id))return id.endsWith(path.basename(figure.assetPath))?imageSource:{uri:'asset://'+id};
  // Unrelated diagram/translation/course modules do not execute for this feed case.
  isolated.add(id);return {};
 };
 loaded._compile(code,filename);return loaded.exports;
}
const {DailyLearningFigure}=load('DailyLearningSupport');
const colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
const render=(selected=lesson,level='1')=>renderToStaticMarkup(React.createElement(DailyLearningFigure,{lesson:selected,level,colors}));
let positive=0,negative=0;
assert.equal(binding.lessonSourceHash,lesson.sourceHash);
assert.equal(binding.assetSha256,figure.assetSha256);
for(const level of lesson.levels){
 const html=render(lesson,level);assert(html.includes('agri-daily-support-agr-vegwork-feed-image'));assert(html.includes(figure.altJa));assert(html.includes(binding.reuseReasonJa));assert(html.includes('data:image/png;base64,'));positive++;
 for(const sourceHash of ['0'.repeat(64),'',undefined]){assert.equal(render({...lesson,sourceHash},level),'');negative++;}
 const source=binding.lessonSourceHash;binding.lessonSourceHash='f'.repeat(64);assert.equal(render(lesson,level),'');negative++;binding.lessonSourceHash=source;
 const asset=binding.assetSha256;binding.assetSha256='0'.repeat(64);assert.equal(render(lesson,level),'');negative++;binding.assetSha256=asset;
 const levels=binding.scopeLevels;binding.scopeLevels=[];assert.equal(render(lesson,level),'');negative++;binding.scopeLevels=levels;
}
assert.equal(render({...lesson,id:'unsupported-lesson'},'1'),'');negative++;
console.log(`PASS feed-daily-binding: ${positive} current course renders with verified actual PNG, ${negative} stale/scope/dependency rejection cases. Actual DailyLearningFigure+asset resolver+ZoomableFigure/RNW; ${isolated.size} unrelated imports isolated.`);
