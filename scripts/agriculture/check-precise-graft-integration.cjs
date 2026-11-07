#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const illustrations=json('src/data/agriculture/exam-illustrations.json'),lessonData=json('src/data/agriculture/lessons.ja.json');
const data=json('src/data/agriculture/recognition-images.json'),registry=json('src/data/agriculture/recognition-image-locales.json'),support=json('src/data/agriculture/daily-learning-support.json');
const lessons=new Map(json('src/data/agriculture/lessons.ja.json').lessons.map(l=>[l.id,l]));
const selected=data.images.filter(f=>['agr-f40-branch-graft-type-profiles','agr-f40-graft-source-example-dimensions','agr-f40-safety-media-tractor-source-conditions'].includes(f.id));assert.equal(selected.length,3);
const assets=new Map();for(const f of selected){const bytes=fs.readFileSync(path.join(root,f.assetPath));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.assetSha256);if(f.assetPath.endsWith('.png')){assert.equal(bytes.readUInt32BE(16),f.width);assert.equal(bytes.readUInt32BE(20),f.height);}else{assert.equal(bytes.subarray(12,16).toString(),'VP8 ');assert.equal(bytes.readUInt16LE(26)&0x3fff,f.width);assert.equal(bytes.readUInt16LE(28)&0x3fff,f.height);}assets.set(path.basename(f.assetPath),{uri:'data:'+(f.assetPath.endsWith('.png')?'image/png':'image/webp')+';base64,'+bytes.toString('base64')});}
const cache=new Map();
function load(name){
 if(cache.has(name))return cache.get(name).exports;
 const filename=path.join(root,'src/components/agriculture',name+'.tsx');
 const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(name,m);const original=m.require.bind(m);
 m.require=id=>{
  if(id==='react-native')return require('react-native-web');
  if(id==='@/data/agriculture/recognition-images.json')return data;
  if(id==='@/data/agriculture/recognition-image-locales.json')return registry;
  if(id==='@/data/agriculture/image-readings.json')return JSON.parse(read('src/data/agriculture/image-readings.json'));
  if(id==='./AgricultureImageRuby')return load('AgricultureImageRuby');
  if(id==='@/data/agriculture/daily-learning-support.json')return support;
  if(id==='@/data/agriculture/exam-illustrations.json')return illustrations;
  if(id==='@/data/agriculture/lessons.ja.json')return lessonData;
  if(id==='@/data/agriculture')return {agricultureLesson:(id,level)=>{const l=lessons.get(id);return l?.levels.includes(level)?l:null;},agricultureTranslation:()=>null};
  if(['./AgricultureExamIllustration','./RecognitionImages','./ZoomableFigure'].includes(id))return load(id.slice(2));
  if(id==='./FertilizerNativeFigure')return {isFertilizerNativeContext:()=>false};
  if(id==='./NativeProcessDiagram')return {isNativeProcessContext:()=>false};
  if(['./SprayerPartSupport','./PestFoundationSupport','./MulchColorSupport','./FruitManagementSupport','./DrainageMethodComparison','./DailyInstructionDiagram','./Statistics2019Figure','./WinterClimateFigure','./WinterSpatialReference','./CropCalendarFigure','./SoilGroupComparison','./CropClassificationFigure','./PlantResponseFigure','./FlowerLegendFigure','@/components/tokutei/StudyAppearance'].includes(id))return {};
  if(/\.(png|webp)$/.test(id))return assets.get(path.basename(id))||{uri:'asset://'+id};
  return original(id);
 };m._compile(code,filename);return m.exports;
}
const {RecognitionImages}=load('RecognitionImages'),colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
let renders=0,guards=0;
for(const f of selected)for(const id of f.lessonIds){const l=lessons.get(id);assert.equal(f.lessonSourceHashes[id],l.sourceHash);for(const level of f.scopeLevels){for(const language of ['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','km','th','tl']){const html=renderToStaticMarkup(React.createElement(RecognitionImages,{lessonId:id,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,level,language,showTranslation:language!=='ja',colors}));assert(html.includes(assets.get(path.basename(f.assetPath)).uri));assert(html.includes(f.titleJa));assert(html.includes(f.limitJa));renders++;}for(const props of [{lessonSourceHash:'stale'},{level:'9'}]){const html=renderToStaticMarkup(React.createElement(RecognitionImages,{lessonId:id,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,level,colors,...props}));assert(!html.includes(assets.get(path.basename(f.assetPath)).uri));guards++;}}}
console.log(`PASS graft and tractor integration: ${renders} actual RecognitionImages/ZoomableFigure renders with two precise PNGs and one actual tractor WebP, ${guards} source/level guards; existing Japanese fallback retained where no locale entry exists.`);
