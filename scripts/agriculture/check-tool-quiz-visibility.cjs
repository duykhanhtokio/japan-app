#!/usr/bin/env node
'use strict';
// Bounded visual proof: six source-reviewed tool plates, seven existing questions.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const figures=JSON.parse(read('src/data/agriculture/recognition-images.json'));
const illustrations=JSON.parse(read('src/data/agriculture/exam-illustrations.json'));
const lessons=JSON.parse(read('src/data/agriculture/lessons.ja.json'));
const exams=JSON.parse(read('src/data/agriculture/mock-exams.ja.json'));
const refs=exams.exams.flatMap(e=>e.questions.filter(q=>q.illustrationId).map(q=>({q,level:e.level})));
const checks=[['agr-1-m03-q31','agr-recognition-socket-wrench-v1',1],['agr-1-m04-q28','agr-recognition-open-end-spanner-v1',2],['agr-1-m04-q22','agr-tools33-box-end-wrench-v1',3],['agr-1-m05-q20','agr-tool-screwdrivers-v1',0],['agr-1-m06-q03','agr-recognition-adjustable-wrench-v1',3],['agr-1-m05-q18','agr-recognition-hex-keys-v1',1],['agr-2-m08-q40','agr-tools33-box-end-wrench-v1',3]];
const pixels=new Map();
for(const id of new Set(checks.map(x=>x[1]))){const f=figures.images.find(x=>x.id===id);assert(f);const bytes=fs.readFileSync(path.join(root,f.assetPath));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.assetSha256);pixels.set(path.resolve(root,f.assetPath),{uri:'data:image/png;base64,'+bytes.toString('base64')});}
let windowWidth=390,expanded=false,pictures=[],masks=[];
const native=require('react-native-web');
function ObservedView(props){const s=props.style;if(s?.position==='relative'&&typeof s.width==='number')pictures.push(s);if(s?.position==='absolute'&&typeof s.left==='string')masks.push(s);return React.createElement(native.View,props);}
const cache=new Map();
function load(name){if(cache.has(name))return cache.get(name).exports;const filename=path.join(root,'src/components/agriculture',name+'.tsx');const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(name,m);const original=m.require.bind(m);
 m.require=id=>id==='react-native'?{...native,View:ObservedView,useWindowDimensions:()=>({width:windowWidth,height:844})}:id==='react'?{...React,useState:initial=>React.useState(initial===false?expanded:initial)}:id==='@/data/agriculture/recognition-images.json'?figures:id==='@/data/agriculture/exam-illustrations.json'?illustrations:id==='@/data/agriculture/lessons.ja.json'?lessons:id==='@/data/agriculture/recognition-image-locales.json'?JSON.parse(read('src/data/agriculture/recognition-image-locales.json')):id==='@/data/agriculture/image-readings.json'?JSON.parse(read('src/data/agriculture/image-readings.json')):id==='./FlowerLegendFigure'||id==='./CropCalendarFigure'?{}:id==='./RecognitionImages'?load('RecognitionImages'):id==='./AgricultureImageRuby'?load('AgricultureImageRuby'):id==='./ZoomableFigure'?load('ZoomableFigure'):/\.(png|webp)$/.test(id)?pixels.get(path.resolve(path.dirname(filename),id))||{uri:'asset://'+id}:original(id);m._compile(code,filename);return m.exports;
}
const {AgricultureExamIllustration:Figure,hasAgricultureExamIllustration:ready}=load('AgricultureExamIllustration');
const colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
let renders=0,rejected=0;
for(const [id,figureId,correct] of checks){const ref=refs.find(x=>x.q.id===id);assert(ref,id);const q=ref.q,f=figures.images.find(x=>x.id===figureId),item=illustrations.illustrations.find(x=>x.id===q.illustrationId);assert.equal(q.correctIndex,correct);assert.equal(item.figureId,figureId);assert.equal(item.sourceAssetSha256,f.assetSha256);assert.deepEqual(item.masks,[],'these six label-free tool plates need no masks');assert(f.lessonIds.includes(q.lessonId));
 const context={lessonId:q.lessonId,lessonSourceHash:q.lessonSourceHash};assert(ready(q.illustrationId,q.illustrationRevision,ref.level,context));
 for(windowWidth of [390,768])for(expanded of [false,true]){pictures=[];masks=[];const html=renderToStaticMarkup(React.createElement(Figure,{id:q.illustrationId,revision:q.illustrationRevision,level:ref.level,questionSource:context,colors}));assert(html.includes(pixels.get(path.resolve(root,f.assetPath)).uri),'exact reviewed image bytes reach actual Image');assert.equal(pictures.length,1);assert.equal(masks.length,0,'no answer evidence occluded');const picture=pictures[0];assert(picture.width>0&&picture.height>0);assert(Math.abs(picture.height/picture.width-f.height/f.width)<1e-10);if(!expanded)assert(picture.width<=windowWidth-66);else assert(picture.width>=Math.min(f.width,1600));
  // Quiz receives neutral illustration captions, never the study title, observation or translated labels.
  for(const text of [f.titleJa,f.observationJa,f.limitJa,...q.optionsJa])assert(!html.includes(text),'study answer/caption must not be injected into quiz markup');assert(html.includes(item.titleJa)&&html.includes(item.altJa));renders++;
 }
 const stale={...context,lessonSourceHash:'0'.repeat(64)};assert(!ready(q.illustrationId,q.illustrationRevision,ref.level,stale));const html=renderToStaticMarkup(React.createElement(Figure,{id:q.illustrationId,revision:q.illustrationRevision,level:ref.level,questionSource:stale,colors}));assert(html.includes('参考図を読み込めません。')&&!html.includes('data:image/png;base64,'));rejected++;
}
console.log(`PASS tool-quiz-visibility: ${checks.length} source/pixel/answer-reviewed contexts, ${pixels.size} unchanged PNGs, ${renders} actual renders at two simulated widths and normal/expanded modes; all visual evidence unmasked, study/answer captions absent; ${rejected} stale-context fallbacks. No physical-device acceptance.`);
