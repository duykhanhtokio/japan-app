#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const lessons=json('src/data/agriculture/lessons.ja.json'),support=json('src/data/agriculture/daily-learning-support.json'),data=json('src/data/agriculture/cooling-curing-comparison.json'),cache=new Map();
function load(name){if(cache.has(name))return cache.get(name).exports;const filename=path.join(root,'src/components/agriculture',name+'.tsx'),m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(name,m);const original=m.require.bind(m);m.require=id=>{
 if(id==='react-native')return require('react-native-web');
 if(id==='@/data/agriculture/lessons.ja.json')return lessons;
 if(id==='@/data/agriculture/daily-learning-support.json')return support;
 if(id==='@/data/agriculture/cooling-curing-comparison.json')return data;
 if(id==='@/data/agriculture/recognition-images.json')return json('src/data/agriculture/recognition-images.json');
 if(id==='@/data/agriculture')return {agricultureLesson:(id,level)=>lessons.lessons.find(l=>l.id===id&&l.levels.includes(level)),agricultureTranslation:()=>null};
 if(id==='./CoolingCuringComparison')return load('CoolingCuringComparison');
 if(id==='./FertilizerNativeFigure')return {isFertilizerNativeContext:()=>false};
 if(id==='./NativeProcessDiagram')return {isNativeProcessContext:()=>false};
 if(id==='./RecognitionImages')return {getAgricultureFigureAsset:()=>null,recognitionImageTranslation:()=>null};
 if(id.startsWith('./')||id==='@/components/tokutei/StudyAppearance')return {};// These branches are not reached by the four selected lessons.
 return original(id);
 };const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;m._compile(code,filename);return m.exports;}
const {DailyLearningFigure}=load('DailyLearningSupport'),{CoolingCuringComparison}=load('CoolingCuringComparison'),l=lessons.lessons.find(l=>l.id===data.lessonId),colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
const daily=(lesson,language='ja',extra={})=>renderToStaticMarkup(React.createElement(DailyLearningFigure,{lesson,level:'2',language,showTranslation:language!=='ja',includeExisting:true,colors,...extra}));
let renders=0,guards=0;
for(const language of Object.keys(data.locales)){
 const html=daily(l,language);for(const id of ['agri-cooling-room-circulation','agri-cooling-through-container','agri-cooling-vacuum-separate-storage','agri-curing-distinct-conditions','agri-curing-warm-humid','agri-curing-ambient-dry'])assert(html.includes(id));
 for(const label of data.labels.ja)assert(html.includes(label));
 if(language!=='ja')for(let i=0;i<11;i++)assert(html.includes('agri-cooling-label-'+i));
 assert(!html.includes('果実の収穫判断に使う三つの道具'));renders++;
 assert.equal(daily(l,language,{paragraphIds:[l.paragraphs[0].id]}),'');guards++;
}
for(const override of [{sourceHash:'stale'},{revision:'stale'}]){assert.equal(daily({...l,...override}),'');guards++;}
const condition=data.labels.ja[10];data.labels.ja[10]='カボチャ：高温多湿';assert.equal(daily(l),'');data.labels.ja[10]=condition;guards++;
const original=l.paragraphs[0].textJa;l.paragraphs[0].textJa+='changed';assert.equal(daily(l),'');l.paragraphs[0].textJa=original;guards++;
assert.equal(daily(l,'vi',{level:'1'}),'');guards++;
for(const id of ['agr-pesticide-formulation-reading-2','agr-s30-label-detail','agr-f40-flower-add-orchard-base']){assert(!support.figureBindings[id]);assert.equal(daily(lessons.lessons.find(l=>l.id===id)),'');guards++;}
const figures=json('src/data/agriculture/recognition-images.json').images;
for(const id of ['agr-f40-flower-harvest-v1','agr-f40-safety-media-pesticide-source-conditions','agr-f40-flower-materials-v1'])assert(figures.find(f=>f.id===id)?.lessonIds.length,'valid original primary asset usage preserved');
console.log(`PASS cooling-curing: ${renders} actual daily/component locale renders, six differentiated diagram panels and11 labels, ${guards} source/level/paragraph/wrong-objective guards; three original primary assets preserved.`);

if(process.env.AGR_COOLING_PREVIEW){const css=require('react-native-web').StyleSheet.getSheet().textContent;fs.writeFileSync(process.env.AGR_COOLING_PREVIEW,'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'body{margin:0;background:#fff8e9}main{max-width:720px;margin:auto;padding:12px}</style><main>'+daily(l,'vi')+'</main>');}
