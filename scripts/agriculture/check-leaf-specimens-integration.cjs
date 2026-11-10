#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const illustrations=json('src/data/agriculture/exam-illustrations.json'),lessonData=json('src/data/agriculture/lessons.ja.json');
const data=json('src/data/agriculture/recognition-images.json'),registry=json('src/data/agriculture/recognition-image-locales.json'),support=json('src/data/agriculture/daily-learning-support.json');
const lessons=new Map(json('src/data/agriculture/lessons.ja.json').lessons.map(l=>[l.id,l]));
const selected=data.images.filter(f=>f.id==='agr-f40-fruit-nursery-species-leaf-examples');assert.equal(selected.length,1);
const assets=new Map();for(const f of selected){const bytes=fs.readFileSync(path.join(root,f.assetPath));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.assetSha256);if(f.assetPath.endsWith('.png')){assert.equal(bytes.readUInt32BE(16),f.width);assert.equal(bytes.readUInt32BE(20),f.height);}else{assert.equal(bytes.subarray(12,16).toString(),'VP8 ');assert.equal(bytes.readUInt16LE(26)&0x3fff,f.width);assert.equal(bytes.readUInt16LE(28)&0x3fff,f.height);}assets.set(path.basename(f.assetPath),{uri:'data:'+(f.assetPath.endsWith('.png')?'image/png':'image/webp')+';base64,'+bytes.toString('base64')});}
const cache=new Map();
function load(name){
 if(cache.has(name))return cache.get(name).exports;
 const filename=path.join(root,'src/components/agriculture',name+(fs.existsSync(path.join(root,'src/components/agriculture',name+'.tsx'))?'.tsx':'.ts'));
 const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(name,m);const original=m.require.bind(m);
 m.require=id=>{
  if(id==='react-native')return require('react-native-web');
  if(id==='@/data/agriculture/recognition-images.json')return data;
  if(id==='@/data/agriculture/recognition-image-locales.json')return registry;
  if(id==='@/data/agriculture/image-readings.json')return JSON.parse(read('src/data/agriculture/image-readings.json'));
  if(id==='./AgricultureImageRuby')return load('AgricultureImageRuby');
  if(id==='./FigureSourceMarks')return load('FigureSourceMarks');
  if(id==='@/data/agriculture/daily-learning-support.json')return support;
  if(id==='@/data/agriculture/exam-illustrations.json')return illustrations;
  if(id==='@/data/agriculture/lessons.ja.json')return lessonData;
  if(id==='@/data/agriculture')return {agricultureLesson:(id,level)=>{const l=lessons.get(id);return l?.levels.includes(level)?l:null;},agricultureTranslation:()=>null};
  if(['./DailyLearningSupport','./AgricultureExamIllustration','./RecognitionImages','./ZoomableFigure'].includes(id))return load(id.slice(2));
  if(id==='./FertilizerNativeFigure')return {isFertilizerNativeContext:()=>false};
  if(id==='./NativeProcessDiagram')return {isNativeProcessContext:()=>false};
  if(['./SprayerPartSupport','./PestFoundationSupport','./MulchColorSupport','./FruitManagementSupport','./DrainageMethodComparison','./DailyInstructionDiagram','./Statistics2019Figure','./WinterClimateFigure','./WinterSpatialReference','./CropCalendarFigure','./SoilGroupComparison','./CropClassificationFigure','./PlantResponseFigure','./FlowerLegendFigure','@/components/tokutei/StudyAppearance'].includes(id))return {};
  if(/\.(png|webp)$/.test(id))return assets.get(path.basename(id))||{uri:'asset://'+id};
  if(id.startsWith('./'))return {};// Unused native support branches for these selected contexts.
  return original(id);
 };m._compile(code,filename);return m.exports;
}
const {RecognitionImages}=load('RecognitionImages'),{DailyLearningFigure}=load('DailyLearningSupport'),colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'},f=selected[0],asset=assets.get(path.basename(f.assetPath)),langs=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','km','th','tl'];
const primary=lessons.get(f.lessonIds[0]),context=lessons.get('agr-s27-fruit-components'),rootLesson=lessons.get('agr-f40-facility-level1-supplement');let direct=0,daily=0,guards=0;
assert.equal(f.sourcePhotoObjectiveComplete,false);assert.equal(support.figureBindings[context.id].assetSha256,f.assetSha256);assert(support.figureBindings[context.id].reuseReasonJa.includes('カキとブドウ'));assert(support.figureBindings[context.id].reuseReasonJa.includes('根の発達'));assert(!support.figureBindings[rootLesson.id]);
const recognition=(l,level,language)=>renderToStaticMarkup(React.createElement(RecognitionImages,{lessonId:l.id,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,level,language,showTranslation:language!=='ja',colors}));
const renderDaily=(l,level,language)=>renderToStaticMarkup(React.createElement(DailyLearningFigure,{lesson:l,level,language,showTranslation:language!=='ja',includeExisting:true,colors}));
for(const language of langs){for(const level of ['1','2']){const html=recognition(primary,level,language);assert(html.includes(asset.uri));assert(html.includes(f.observationJa));direct++;}const html=renderDaily(context,'2',language);assert(html.includes(asset.uri));assert(html.includes(support.figureBindings[context.id].reuseReasonJa));daily++;assert(!renderDaily(rootLesson,'1',language).includes(asset.uri));guards++;}
for(const stale of ['stale','']){assert(!recognition({...primary,sourceHash:stale},'2','vi').includes(asset.uri));assert(!renderDaily({...context,sourceHash:stale},'2','vi').includes(asset.uri));guards+=2;}
assert(!renderDaily(context,'1','vi').includes(asset.uri));guards++;
console.log(`PASS leaf integration: ${direct} real primary renders, ${daily} bounded species-name daily renders, ${guards} root-objective/source/level guards; fine-root gap remains explicit and no full source-photo acceptance.`);
