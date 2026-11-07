#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),json=p=>JSON.parse(read(p));
const illustrations=json('src/data/agriculture/exam-illustrations.json'),lessonData=json('src/data/agriculture/lessons.ja.json');
const data=json('src/data/agriculture/recognition-images.json'),registry=json('src/data/agriculture/recognition-image-locales.json'),support=json('src/data/agriculture/daily-learning-support.json');
const lessons=new Map(json('src/data/agriculture/lessons.ja.json').lessons.map(l=>[l.id,l]));
const f=data.images.find(f=>f.id==='agr-f40-peach-grape-bag-appearance'),bytes=fs.readFileSync(path.join(root,f.assetPath));
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.assetSha256);assert.equal(bytes.subarray(8,12).toString(),'WEBP');

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
  if(id==='@/data/agriculture/exam-illustrations.json')return illustrations;
  if(id==='@/data/agriculture/lessons.ja.json')return lessonData;
  if(id==='@/data/agriculture')return {agricultureLesson:(id,level)=>{const l=lessons.get(id);return l?.levels.includes(level)?l:null;},agricultureTranslation:()=>null};
  if(['./AgricultureExamIllustration','./RecognitionImages','./ZoomableFigure'].includes(id))return load(id.slice(2));
  if(id==='./FertilizerNativeFigure')return {isFertilizerNativeContext:()=>false};
  if(id==='./NativeProcessDiagram')return {isNativeProcessContext:()=>false};
  if(['./SprayerPartSupport','./PestFoundationSupport','./MulchColorSupport','./FruitManagementSupport','./DrainageMethodComparison','./DailyInstructionDiagram','./Statistics2019Figure','./WinterClimateFigure','./WinterSpatialReference','./CropCalendarFigure','./SoilGroupComparison','./CropClassificationFigure','./PlantResponseFigure','./FlowerLegendFigure','@/components/tokutei/StudyAppearance'].includes(id))return {};
  if(/\.(png|webp)$/.test(id))return path.basename(id)===path.basename(f.assetPath)?asset:{uri:'asset://'+id};
  return original(id);
 };m._compile(code,filename);return m.exports;
}
const {AgricultureExamIllustration,hasAgricultureExamIllustration}=load('AgricultureExamIllustration'),colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
const entry=illustrations.illustrations.find(e=>e.id==='agr-2-m09-figure-q38'),qId='agr-2-m09-q38';let q;
function visit(o){if(Array.isArray(o))return o.forEach(visit);if(o&&typeof o==='object'){if(o.id===qId)q=o;Object.values(o).forEach(visit);}}visit(json('src/data/agriculture/mock-exams.ja.json'));assert(q);assert.equal(q.correctIndex,3);assert.equal(q.illustrationRevision,entry.revision);
const qs={lessonId:q.lessonId,lessonSourceHash:q.lessonSourceHash};assert(hasAgricultureExamIllustration(entry.id,entry.revision,'2',qs));
const render=(props={})=>renderToStaticMarkup(React.createElement(AgricultureExamIllustration,{id:entry.id,revision:entry.revision,level:'2',questionSource:qs,colors,...props}));
const html=render();assert(html.includes('data:image/webp;base64,'));assert(html.includes('exam-figure-'+entry.id));assert(!html.includes('モモ用'));assert(!html.includes('ブドウ用'));
assert.deepEqual(entry.masks,[{x:0.025,y:0.035,width:0.94,height:0.17},{x:0.045,y:0.27,width:0.91,height:0.075},{x:0.045,y:0.82,width:0.91,height:0.09}]);
assert.equal((html.match(/background-color:rgba\(255,250,240,1.00\)/g)||[]).length,3,'three neutral actual ZoomableFigure mask overlays');
let guards=0;for(const props of [{revision:'stale'},{level:'1'},{questionSource:{...qs,lessonSourceHash:'stale'}},{id:'unknown'}]){assert(render(props).includes('参考図を読み込めません'));guards++;}
const correct=entry.sourceAssetSha256;entry.sourceAssetSha256='b7fb69d58761493b7e879147c03feb6f6f82fbd89f43bf7b1661fb15eeed5218';assert(!hasAgricultureExamIllustration(entry.id,entry.revision,'2',qs));assert(render().includes('参考図を読み込めません'));entry.sourceAssetSha256=correct;guards++;
console.log(`PASS bag quiz: actual exam/RecognitionImages/ZoomableFigure render with current WebP and3 unchanged neutral masks; ${guards} stale/revision/level/source guards; canonical question/options/answer unchanged.`);
