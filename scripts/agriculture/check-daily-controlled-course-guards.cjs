#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..');
const support=JSON.parse(fs.readFileSync(path.join(root,'src/data/agriculture/daily-learning-support.json')));
const figures=JSON.parse(fs.readFileSync(path.join(root,'src/data/agriculture/recognition-images.json')));
const lessons=JSON.parse(fs.readFileSync(path.join(root,'src/data/agriculture/lessons.ja.json'))).lessons;
const filename=path.join(root,'src/components/agriculture/DailyLearningSupport.tsx');
const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
const loaded=new Module(filename,module);loaded.filename=filename;loaded.paths=Module._nodeModulePaths(path.dirname(filename));const actualRequire=loaded.require.bind(loaded);
loaded.require=id=>{
 if(id==='react-native')return require('react-native-web');
 if(id==='@/data/agriculture/daily-learning-support.json')return support;
 if(id==='@/data/agriculture/recognition-images.json')return figures;
 if(id==='./NativeProcessDiagram'){
  const nativePath=path.join(root,'src/components/agriculture/NativeProcessDiagram.tsx');
  const nativeCode=transformSync(fs.readFileSync(nativePath,'utf8'),{filename:nativePath,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
  const native=new Module(nativePath,module);native.filename=nativePath;native.paths=Module._nodeModulePaths(path.dirname(nativePath));const nativeRequire=native.require.bind(native);
  native.require=key=>key==='react-native'?require('react-native-web'):key==='@/data/agriculture/native-process-diagrams.json'?JSON.parse(fs.readFileSync(path.join(root,'src/data/agriculture/native-process-diagrams.json'))):key==='@/data/agriculture/daily-learning-support.json'?support:nativeRequire(key);
  native._compile(nativeCode,nativePath);return native.exports;
 }
 if(id==='./RecognitionImages')return {getAgricultureFigureAsset:key=>({uri:`https://example.invalid/${key}`})};
 if(id==='./DailyInstructionDiagram')return {DailyInstructionDiagram:props=>React.createElement('span',null,props.title)};
 if(id==='./Statistics2019Figure')return {Statistics2019Figure:()=>React.createElement('span',null,support.controlledDiagrams['agr-statistics'].titleJa)};
 if(id==='./WinterClimateFigure')return {WinterClimateFigure:()=>null};
 if(id==='./WinterSpatialReference')return {WinterSpatialReference:()=>React.createElement('span',null,support.controlledDiagrams['agr-climate'].titleJa)};
 if(id==='./ZoomableFigure')return {ZoomableFigure:props=>React.createElement('span',{'data-figure-alt':props.altJa})};
 if(id==='react'||id.startsWith('react/'))return actualRequire(id);
 return {};
};
loaded._compile(code,filename);
const {DailyLearningFigure}=loaded.exports;
const colors={text:'#123',translation:'#fff',translationText:'#123',border:'#abc'};
const render=(lesson,level,includeExisting=true)=>renderToStaticMarkup(React.createElement(DailyLearningFigure,{lesson,level,includeExisting,colors}));
let positives=0,negatives=0;
for(const [lessonId,diagram] of Object.entries(support.controlledDiagrams)){
 const lesson=lessons.find(l=>l.id===lessonId);assert(lesson);
 if(diagram.lessonSourceHash!==lesson.sourceHash)continue;
 for(const level of lesson.levels){assert(render(lesson,level).includes(diagram.titleJa));positives++;}
 for(const level of ['1','2','3',''].filter(l=>!lesson.levels.includes(l))){assert.equal(render(lesson,level),'',`unsupported course rendered ${lessonId}/${level}`);negatives++;}
 const currentLevel=lesson.levels[0];
 assert.equal(render({...lesson,levels:[]},currentLevel),'','removed course metadata must fail closed');negatives++;
}
assert(positives>0);
console.log(`PASS daily-controlled-course-guards: ${positives} current controlled lesson/course renders, ${negatives} unsupported/removed-course cases. Actual DailyLearningFigure rendered; leaf diagram imports isolated; no pixel/device claim.`);
