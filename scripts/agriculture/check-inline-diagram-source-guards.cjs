#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const {transformSync}=require('@babel/core');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..');
const componentPath=path.join(root,'src/components/agriculture/AgricultureCourse.tsx');
const source=fs.readFileSync(componentPath,'utf8');
const bindings=require(path.join(root,'src/data/agriculture/inline-diagram-source-bindings.json'));
const lessons=new Map(require(path.join(root,'src/data/agriculture/lessons.ja.json')).lessons.map(l=>[l.id,l]));
const code=transformSync(source,{
 filename:componentPath,babelrc:false,configFile:false,
 plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']
}).code+'\nexports.inlineFigureTest={OrgansDiagram,SowingDiagram};';
const loaded=new Module(componentPath,module);loaded.filename=componentPath;loaded.paths=Module._nodeModulePaths(path.dirname(componentPath));
const actualRequire=loaded.require.bind(loaded);
const isolated=new Set();
loaded.require=id=>{
 if(id==='react-native')return require('react-native-web');
 if(id==='@/data/agriculture/inline-diagram-source-bindings.json')return bindings;
 if(id==='react'||id.startsWith('react/'))return actualRequire(id);
 // Other course modules are not invoked by these two leaf figures.
 isolated.add(id);return {};
};
loaded._compile(code,componentPath);
const {OrgansDiagram,SowingDiagram}=loaded.exports.inlineFigureTest;
const render=(Component,lesson,level)=>renderToStaticMarkup(React.createElement(Component,{lesson,level}));
let positives=0,negatives=0;
for(const [key,Component,labels] of [['organs',OrgansDiagram,['栄養器官','生殖器官']],['sowing',SowingDiagram,['ばらまき','すじまき','点まき']]]){
 const binding=bindings[key],lesson=lessons.get(binding.lessonId);assert(lesson);
 assert.equal(binding.lessonSourceHash,lesson.sourceHash);
 assert.deepEqual(binding.levels,lesson.levels);
 for(const level of binding.levels){
  const html=render(Component,lesson,level);for(const label of labels)assert(html.includes(label));positives++;
  for(const sourceHash of ['0'.repeat(64),'',undefined]){assert.equal(render(Component,{...lesson,sourceHash},level),'');negatives++;}
  assert.equal(render(Component,{...lesson,id:'wrong-lesson'},level),'');negatives++;
  for(const badLevel of ['',undefined,'3']){assert.equal(render(Component,lesson,badLevel),'');negatives++;}
 }
 for(const level of ['1','2'].filter(l=>!binding.levels.includes(l))){assert.equal(render(Component,lesson,level),'');negatives++;}
 assert(source.includes(`<${key==='organs'?'OrgansDiagram':'SowingDiagram'} lesson={lesson} level={level}/>`),'reader must forward actual lesson+course');
}
assert(source.includes("lesson.id==='agr-sowing-design'&&!hasRecognitionImage(lesson.id,lesson.sourceHash,'sowing-patterns',level)&&<SowingDiagram lesson={lesson} level={level}/>"),'fallback must remain conditional on recognition availability');
console.log(`PASS inline-source-guards: ${positives} current renders, ${negatives} fail-closed cases. Actual inline figure functions/RNW rendered; ${isolated.size} unrelated course imports isolated.`);
