#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const lessons=json('src/data/agriculture/lessons.ja.json'),support=json('src/data/agriculture/daily-learning-support.json'),data=json('src/data/agriculture/grain-purpose-comparison.json'),cache=new Map();
function load(name){if(cache.has(name))return cache.get(name).exports;const filename=path.join(root,'src/components/agriculture',name+'.tsx'),m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(name,m);const original=m.require.bind(m);m.require=id=>{
 if(id==='react-native')return require('react-native-web');
 if(id==='@/data/agriculture/lessons.ja.json')return lessons;
 if(id==='@/data/agriculture/daily-learning-support.json')return support;
 if(id==='@/data/agriculture/grain-purpose-comparison.json')return data;
 if(id==='@/data/agriculture/recognition-images.json')return json('src/data/agriculture/recognition-images.json');
 if(id==='@/data/agriculture')return {agricultureLesson:(id,level)=>lessons.lessons.find(l=>l.id===id&&l.levels.includes(level)),agricultureTranslation:()=>null};
 if(id==='./GrainPurposeComparison')return load('GrainPurposeComparison');
 if(id==='./FertilizerNativeFigure')return {isFertilizerNativeContext:()=>false};
 if(id==='./NativeProcessDiagram')return {isNativeProcessContext:()=>false};
 if(id==='./RecognitionImages')return {getAgricultureFigureAsset:()=>null,recognitionImageTranslation:()=>null};
 if(id.startsWith('./')||id==='@/components/tokutei/StudyAppearance')return {};// These branches are not reached by the four selected lessons.
 return original(id);
 };const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;m._compile(code,filename);return m.exports;}
const {DailyLearningFigure}=load('DailyLearningSupport'),{GrainPurposeComparison}=load('GrainPurposeComparison'),l=lessons.lessons.find(l=>l.id===data.lessonId),colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
const daily=(lesson,language='ja',extra={})=>renderToStaticMarkup(React.createElement(DailyLearningFigure,{lesson,level:'2',language,showTranslation:language!=='ja',includeExisting:true,colors,...extra}));
let renders=0,guards=0;
for(const language of Object.keys(data.locales)){
 const html=daily(l,language);assert(html.includes('agri-native-grain-purpose'));assert(!html.includes('飼料用米と稲WCSの利用範囲'));
 for(let group=0;group<6;group++)assert(html.includes('agri-grain-comparison-'+group));
 for(let label=0;label<19;label++){assert(html.includes('agri-grain-label-'+label));assert(html.includes(data.labels.ja[label]));if(language!=='ja')assert(html.includes('agri-grain-localized-'+label));}
 renders++;assert.equal(daily(l,language,{paragraphIds:[l.paragraphs[0].id]}),'');guards++;
}
for(const override of [{sourceHash:'stale'},{revision:'stale'}]){assert.equal(daily({...l,...override}),'');guards++;}
const qualifier=data.labels.ja[15];data.labels.ja[15]='全て';assert.equal(daily(l),'');data.labels.ja[15]=qualifier;guards++;
const original=l.paragraphs[0].textJa;l.paragraphs[0].textJa+='changed';assert.equal(daily(l),'');l.paragraphs[0].textJa=original;guards++;
assert.equal(daily(l,'vi',{level:'1'}),'');guards++;
assert(!support.figureBindings[l.id]);
const rice=json('src/data/agriculture/recognition-images.json').images.find(f=>f.id==='agr-fig-f40-rice-feed-parts-v1');assert(rice?.lessonIds.length,'original rice plate primary usage preserved');
console.log(`PASS grain purpose: ${renders} actual daily/component locale renders, six comparison contexts/19 labels, ${guards} source/revision/qualifier/canonical/level/paragraph guards; rice primary preserved.`);
