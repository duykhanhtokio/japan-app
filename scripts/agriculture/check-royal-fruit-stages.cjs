#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const data=json('src/data/agriculture/recognition-images.json'),registry=json('src/data/agriculture/recognition-image-locales.json'),support=json('src/data/agriculture/daily-learning-support.json');
const lessons=new Map(json('src/data/agriculture/lessons.ja.json').lessons.map(l=>[l.id,l]));
const f=data.images.find(f=>f.id==='agr-royal-fruit-thinning-stages-v1'),bytes=fs.readFileSync(path.join(root,f.assetPath));
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.assetSha256);assert.equal(bytes.subarray(8,12).toString(),'WEBP');
assert.equal(f.width,1536);assert.equal(f.height,1024);
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
  if(['./PestFoundationSupport','./MulchColorSupport','./FruitManagementSupport','./DrainageMethodComparison','./DailyInstructionDiagram','./Statistics2019Figure','./WinterClimateFigure','./WinterSpatialReference','./CropCalendarFigure','./SoilGroupComparison','./CropClassificationFigure','./PlantResponseFigure','./FlowerLegendFigure','@/components/tokutei/StudyAppearance'].includes(id))return {};
  if(/\.(png|webp)$/.test(id))return path.basename(id)===path.basename(f.assetPath)?asset:{uri:'asset://'+id};
  return original(id);
 };m._compile(code,filename);return m.exports;
}
const {DailyLearningFigure}=load('DailyLearningSupport'),{RecognitionImages}=load('RecognitionImages'),colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
const id='agr-management-detail-staged-thinning',l=lessons.get(id),langs=['ja',...Object.keys(registry.entries[f.id].locales)];
assert(f.observationJa.includes('生理落果が終わるまで'));assert(f.observationJa.includes('仕上げ摘果はその後'));assert(f.limitJa.includes('葉果比'));
assert(!support.figureBindings[id],'direct recognition image must not also be duplicated as main daily binding');
const daily=(lesson,level,language,includeExisting=true)=>renderToStaticMarkup(React.createElement(DailyLearningFigure,{lesson,level,language,showTranslation:language!=='ja',includeExisting,colors}));
const recognition=(lesson,level,language)=>renderToStaticMarkup(React.createElement(RecognitionImages,{lessonId:lesson.id,lessonSourceHash:lesson.sourceHash,lessonRevision:lesson.revision,level,language,showTranslation:language!=='ja',colors}));
let recognitionRenders=0,dailyRenders=0,negative=0;
for(const language of langs){
 const html=recognition(l,'2',language);assert(html.includes('data:image/webp;base64,'));assert(html.includes(f.titleJa));assert(html.includes(f.observationJa));recognitionRenders++;
 const companion=daily(l,'2',language);assert(companion.includes('data:image/webp;base64,'));assert(companion.includes(f.limitJa));dailyRenders++;
 assert.equal(daily(l,'2',language,false),'');negative++;
 assert.equal(recognition(l,'1',language),'');negative++;
 assert.equal(daily(l,'1',language),'');negative++;
}
for(const stale of ['0'.repeat(64),'']){assert.equal(recognition({...l,sourceHash:stale},'2','vi'),'');assert.equal(daily({...l,sourceHash:stale},'2','vi'),'');negative+=2;}
assert(!json('src/data/agriculture/exam-illustrations.json').illustrations.some(x=>x.figureId===f.id),'new teaching comparison is not a pre-submission exam plate');
console.log(`PASS fruit stages: ${recognitionRenders} actual primary reader recognition renders, ${dailyRenders} actual companion daily renders, ${negative} scope/source/duplicate rejection checks; source-condition captions retained.`);
