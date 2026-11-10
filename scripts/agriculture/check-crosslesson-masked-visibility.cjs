#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const figures=JSON.parse(read('src/data/agriculture/recognition-images.json'));
const illustrations=JSON.parse(read('src/data/agriculture/exam-illustrations.json'));
const lessons=JSON.parse(read('src/data/agriculture/lessons.ja.json'));
const exams=JSON.parse(read('src/data/agriculture/mock-exams.ja.json'));
const refs=exams.exams.flatMap(e=>e.questions.filter(q=>q.illustrationId).map(q=>({q,level:e.level})));
const localeData=JSON.parse(read('src/data/agriculture/recognition-image-locales.json'));
const actualPixels=new Map(['agr-f40-seedling-condition-comparison','agr-f40-graft-cambium-contact-corrected-v2','agr-f40-temperature-instrument-source-examples'].map(id=>{const f=figures.images.find(x=>x.id===id),bytes=fs.readFileSync(path.join(root,f.assetPath));assert.equal(require('node:crypto').createHash('sha256').update(bytes).digest('hex'),f.assetSha256);return [path.resolve(root,f.assetPath),{uri:'data:image/png;base64,'+bytes.toString('base64')}];}));
let windowWidth=390,expanded=false,capturedMasks=[],capturedPictures=[];
const native=require('react-native-web');
function ObservedView(props){const style=props.style;if(style?.position==='absolute'&&typeof style.left==='string'){capturedMasks.push({style,label:props.children?.props?.children});}if(style?.position==='relative'&&typeof style.width==='number')capturedPictures.push(style);return React.createElement(native.View,props);}
const cache=new Map();
function load(name){if(cache.has(name))return cache.get(name).exports;
 const filename=path.join(root,'src/components/agriculture',name+'.tsx');
 const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(name,m);const original=m.require.bind(m);
 m.require=id=>id==='react-native'?{...native,View:ObservedView,useWindowDimensions:()=>({width:windowWidth,height:844})}:id==='react'?{...React,useState:initial=>React.useState(initial===false?expanded:initial)}:id==='@/data/agriculture/recognition-images.json'?figures:id==='@/data/agriculture/exam-illustrations.json'?illustrations:id==='@/data/agriculture/lessons.ja.json'?lessons:id==='./RecognitionImages'?load('RecognitionImages'):id==='@/data/agriculture/recognition-image-locales.json'?localeData:id==='./FlowerLegendFigure'||id==='./CropCalendarFigure'?{}:id==='./ZoomableFigure'?load('ZoomableFigure'):/\.(png|webp)$/.test(id)?actualPixels.get(path.resolve(path.dirname(filename),id))||{uri:'asset://'+id}:original(id);m._compile(code,filename);return m.exports;
}
const {hasAgricultureExamIllustration:ready,AgricultureExamIllustration:Figure}=load('AgricultureExamIllustration');
const checks=[
 {question:'agr-1-m07-q40',correct:2,letters:['A','B','C'],rois:[['A elongated stem',.167,.335,.014,.33],['B thick stem',.491,.432,.015,.23],['B upward leaf',.497,.44,.025,.04],['C small leaves',.827,.53,.022,.02]]},
 {question:'agr-2-m09-q30',correct:2,letters:['A','B','C'],rois:[['A elongated stem',.167,.335,.014,.33],['B thick stem',.491,.432,.015,.23],['C small leaves',.827,.53,.022,.02]]},
 {question:'agr-1-m08-q15',correct:0,letters:['A','B','C'],rois:[['B left tube',.661,.27,.013,.145],['B right tube',.729,.27,.013,.145],['B bottom tube join',.669,.411,.061,.01]]},
 {question:'agr-1-m08-q39',correct:1,letters:['A','B','C'],rois:[['C numeric display and degreeC',.19,.71,.125,.075]]},
 {question:'agr-2-m09-q34',correct:1,letters:[],rois:[['left cambium contact',.24,.59,.025,.05],['right cambium gap',.731,.62,.017,.06]]}
];
const colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
let renders=0,masks=0,regions=0,occlusionProbes=0;
for(const c of checks){const ref=refs.find(r=>r.q.id===c.question);assert(ref);const q=ref.q,item=illustrations.illustrations.find(x=>x.id===q.illustrationId),f=figures.images.find(x=>x.id===item.figureId);
 assert.equal(q.correctIndex,c.correct);assert(ready(q.illustrationId,q.illustrationRevision,ref.level,{lessonId:q.lessonId,lessonSourceHash:q.lessonSourceHash}));
 assert(!f.lessonIds.includes(q.lessonId),'exercise preserved crosslesson reuse');
 for(windowWidth of [390,768])for(expanded of [false,true]){
  capturedMasks=[];capturedPictures=[];
  const html=renderToStaticMarkup(React.createElement(Figure,{id:q.illustrationId,revision:q.illustrationRevision,level:ref.level,questionSource:{lessonId:q.lessonId,lessonSourceHash:q.lessonSourceHash},colors}));
  assert(html.includes('data:image/png;base64,'),'exact actual source bytes reach Image');
  assert.equal(capturedPictures.length,1);const picture=capturedPictures[0];assert(picture.width>0&&picture.height>0);assert(Math.abs(picture.height/picture.width-f.height/f.width)<1e-10);
  if(!expanded)assert(picture.width<=windowWidth-66);else assert(picture.width>=Math.min(f.width,1600));
  assert.equal(capturedMasks.length,item.masks.length);
  for(let i=0;i<item.masks.length;i++){const m=item.masks[i],got=capturedMasks[i];assert.deepEqual([got.style.left,got.style.top,got.style.width,got.style.height],[`${m.x*100}%`,`${m.y*100}%`,`${m.width*100}%`,`${m.height*100}%`]);assert.equal(got.style.backgroundColor,m.backgroundColor||'#fffaf0');assert.equal(got.label,m.label||undefined);masks++;}
  for(const letter of c.letters)assert(capturedMasks.some(m=>m.label===letter),'visible neutral panel labels');
  for(const [name,x,y,width,height] of c.rois){const roi={x,y,width,height};assert(item.masks.every(m=>overlap(roi,m)===0),`${q.id}: key evidence masked: ${name}`);regions++;}
  renders++;
 }
 // Demonstrate the visibility check detects a newly obscured answer cue in actual runtime output.
 const [name,x,y,width,height]=c.rois[0],probe={x,y,width,height};item.masks.push(probe);capturedMasks=[];
 renderToStaticMarkup(React.createElement(Figure,{id:q.illustrationId,revision:q.illustrationRevision,level:ref.level,questionSource:{lessonId:q.lessonId,lessonSourceHash:q.lessonSourceHash},colors}));
 assert.equal(capturedMasks.length,item.masks.length);assert(overlap(probe,item.masks.at(-1))>0);assert.equal(capturedMasks.at(-1).style.left,`${x*100}%`);item.masks.pop();occlusionProbes++;
}
console.log(`PASS crosslesson-masked-visibility: ${checks.length} source-reviewed existing questions; ${renders} actual runtime renders at2simulated widths × normal/expanded; ${masks} actual mask styles/labels retained; ${regions} source/pixel-reviewed answer-evidence region checks unobscured; ${occlusionProbes} actual runtime injected-occlusion probes detected. No device/browser or whole-source acceptance.`);
