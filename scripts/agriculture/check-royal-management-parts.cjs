#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const data=json('src/data/agriculture/recognition-images.json'),registry=json('src/data/agriculture/recognition-image-locales.json'),support=json('src/data/agriculture/daily-learning-support.json');
const lessons=new Map(json('src/data/agriculture/lessons.ja.json').lessons.map(l=>[l.id,l]));
const f=data.images.find(f=>f.id==='agr-f40-safety-media-management-positions'),bytes=fs.readFileSync(path.join(root,f.assetPath));
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.assetSha256);assert.equal(bytes.subarray(8,12).toString(),'WEBP');
assert.equal(f.width,1024);assert.equal(f.height,1536);
const asset={uri:'data:image/webp;base64,'+bytes.toString('base64')},cache=new Map();
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
  if(id==='@/data/agriculture')return {agricultureLesson:(id,level)=>{const l=lessons.get(id);return l?.levels.includes(level)?l:null;},agricultureTranslation:()=>null};
  if(['./RecognitionImages','./ZoomableFigure'].includes(id))return load(id.slice(2));
  if(id==='./FertilizerNativeFigure')return {isFertilizerNativeContext:()=>false};
  if(id==='./NativeProcessDiagram')return {isNativeProcessContext:()=>false};
  if(['./DrainageMethodComparison','./DailyInstructionDiagram','./Statistics2019Figure','./WinterClimateFigure','./WinterSpatialReference','./CropCalendarFigure','./SoilGroupComparison','./CropClassificationFigure','./PlantResponseFigure','./FlowerLegendFigure','@/components/tokutei/StudyAppearance'].includes(id))return {};
  if(/\.(png|webp)$/.test(id))return path.basename(id)===path.basename(f.assetPath)?asset:{uri:'asset://'+id};
  return original(id);
 };m._compile(code,filename);return m.exports;
}
const {DailyLearningFigure}=load('DailyLearningSupport'),{RecognitionImages}=load('RecognitionImages'),colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
const id='agr-f40-safety-cultivation-details',l=lessons.get(id),langs=['ja',...Object.keys(registry.entries[f.id].locales)];
const b=support.figureBindings[id];assert.equal(b.figureId,f.id);assert.equal(b.assetSha256,f.assetSha256);assert.equal(b.lessonSourceHash,l.sourceHash);assert(b.reuseReasonJa.includes('第1・第2段落'));assert(!f.lessonIds.includes(id),'avoid direct+daily duplicate');
const daily=(lesson,level,language)=>renderToStaticMarkup(React.createElement(DailyLearningFigure,{lesson,level,language,showTranslation:language!=='ja',includeExisting:true,colors}));
let positive=0,negative=0;
for(const language of langs){const html=daily(l,'2',language);assert(html.includes('data:image/webp;base64,'));assert(html.includes(b.reuseReasonJa));assert(html.includes(f.limitJa));positive++;assert.equal(daily(l,'1',language),'');negative++;}
for(const stale of ['0'.repeat(64),'']){assert.equal(daily({...l,sourceHash:stale},'2','vi'),'');negative++;}
console.log(`PASS management parts: ${positive} actual bounded daily renders; ${negative} level/source guards; no duplicate direct binding.`);
