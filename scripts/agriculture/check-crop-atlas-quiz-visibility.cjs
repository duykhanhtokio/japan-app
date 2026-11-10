#!/usr/bin/env node
'use strict';
// Bounded visual proof: two crop atlas plates; ten source-reviewed existing questions; answer captions masked.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const figures=JSON.parse(read('src/data/agriculture/recognition-images.json'));
const illustrations=JSON.parse(read('src/data/agriculture/exam-illustrations.json'));
const lessons=JSON.parse(read('src/data/agriculture/lessons.ja.json'));
const exams=JSON.parse(read('src/data/agriculture/mock-exams.ja.json'));
const refs=exams.exams.flatMap(e=>e.questions.filter(q=>q.illustrationId).map(q=>({q,level:e.level})));
const fruit='agr-fig-f40-crop-fruits-atlas-v1',leaf='agr-fig-f40-crop-leaves-atlas-v1';
const checks=[['agr-1-m03-q15',fruit,1,[.72,.45,.12,.1]],['agr-1-m03-q33',fruit,3,[.73,.8,.12,.1]],['agr-1-m04-q05',leaf,1,[.2,.45,.15,.1]],['agr-1-m04-q13',fruit,0,[.33,.46,.12,.1]],['agr-1-m04-q39',leaf,0,[.2,.14,.12,.1]],['agr-1-m05-q06',fruit,1,[.75,.17,.12,.08]],['agr-1-m05-q24',leaf,2,[.7,.48,.12,.1]],['agr-1-m06-q17',fruit,0,[.25,.15,.12,.1]],['agr-1-m06-q33',leaf,0,[.72,.14,.12,.1]],['agr-1-m06-q35',fruit,0,[.25,.8,.12,.1]]];
const captions={ [fruit]:[[.03,.293,.94,.03],[.03,.622,.94,.03],[.03,.95,.94,.03]], [leaf]:[[.03,.29,.94,.03],[.03,.628,.94,.03],[.03,.95,.94,.03]] };
const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
const rect=([x,y,width,height])=>({x,y,width,height});

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
for(const [id,figureId,correct,roi] of checks){const ref=refs.find(x=>x.q.id===id);assert(ref,id);const q=ref.q,f=figures.images.find(x=>x.id===figureId),item=illustrations.illustrations.find(x=>x.id===q.illustrationId);assert.equal(q.correctIndex,correct);assert.equal(item.figureId,figureId);assert.equal(item.sourceAssetSha256,f.assetSha256);assert.equal(item.masks.length,3,'three caption rows must remain masked');for(const label of captions[figureId].map(rect))assert(item.masks.some(m=>m.x<=label.x&&m.y<=label.y&&m.x+m.width>=label.x+label.width&&m.y+m.height>=label.y+label.height),'embedded answer labels fully covered');assert(item.masks.every(m=>overlap(m,rect(roi))===0),'actual answer cue remains unmasked');assert(f.lessonIds.includes(q.lessonId));
 const context={lessonId:q.lessonId,lessonSourceHash:q.lessonSourceHash};assert(ready(q.illustrationId,q.illustrationRevision,ref.level,context));
 for(windowWidth of [390,768])for(expanded of [false,true]){pictures=[];masks=[];const html=renderToStaticMarkup(React.createElement(Figure,{id:q.illustrationId,revision:q.illustrationRevision,level:ref.level,questionSource:context,colors}));assert(html.includes(pixels.get(path.resolve(root,f.assetPath)).uri),'exact reviewed image bytes reach actual Image');assert.equal(pictures.length,1);assert.equal(masks.length,item.masks.length);for(let i=0;i<masks.length;i++){const m=item.masks[i],s=masks[i];assert.deepEqual([s.left,s.top,s.width,s.height],[`${m.x*100}%`,`${m.y*100}%`,`${m.width*100}%`,`${m.height*100}%`]);assert.equal(s.backgroundColor,'#ffffff');}const picture=pictures[0];assert(picture.width>0&&picture.height>0);assert(Math.abs(picture.height/picture.width-f.height/f.width)<1e-10);if(!expanded)assert(picture.width<=windowWidth-66);else assert(picture.width>=Math.min(f.width,1600));
  // Quiz receives neutral illustration captions, never the study title, observation or translated labels.
  for(const text of [f.titleJa,f.observationJa,f.limitJa,...q.optionsJa])assert(!html.includes(text),'study answer/caption must not be injected into quiz markup');assert(html.includes(item.titleJa)&&html.includes(item.altJa));renders++;
 }
 const stale={...context,lessonSourceHash:'0'.repeat(64)};assert(!ready(q.illustrationId,q.illustrationRevision,ref.level,stale));const html=renderToStaticMarkup(React.createElement(Figure,{id:q.illustrationId,revision:q.illustrationRevision,level:ref.level,questionSource:stale,colors}));assert(html.includes('参考図を読み込めません。')&&!html.includes('data:image/png;base64,'));rejected++;
}
console.log(`PASS crop-atlas-quiz-visibility: ${checks.length} source/pixel/answer-reviewed contexts, ${pixels.size} unchanged PNGs, ${renders} actual renders at two simulated widths and normal/expanded modes; source/pixel-selected answer cues unmasked, all embedded caption rows masked, study/answer metadata absent; ${rejected} stale-context fallbacks. No physical-device acceptance.`);
