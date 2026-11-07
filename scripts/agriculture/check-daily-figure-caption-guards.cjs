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
 if(id==='./RecognitionImages')return {getAgricultureFigureAsset:key=>({uri:`https://example.invalid/${key}`})};
 if(id==='./ZoomableFigure')return {ZoomableFigure:props=>React.createElement('span',{'data-figure-alt':props.altJa})};
 if(id==='react'||id.startsWith('react/'))return actualRequire(id);
 return {};
};
loaded._compile(code,filename);
const {DailyLearningFigure}=loaded.exports;
const colors={text:'#123',translation:'#fff',translationText:'#123',border:'#abc'};
const render=(lesson,level,includeExisting=true)=>renderToStaticMarkup(React.createElement(DailyLearningFigure,{lesson,level,includeExisting,colors}));
let positives=0,negatives=0;
// Real direct-recognition fallback candidates, not synthetic data standing in for production bindings.
for(const lesson of lessons){
 const binding=support.figureBindings[lesson.id];if(!binding||support.controlledDiagrams[lesson.id])continue;
 const figure=figures.images.find(f=>f.lessonIds.includes(lesson.id)&&f.lessonSourceHashes[lesson.id]===lesson.sourceHash);
 if(!figure)continue;
 for(const level of lesson.levels.filter(l=>binding.scopeLevels.includes(l)&&figure.scopeLevels.includes(l))){
  const saved={...binding,scopeLevels:[...binding.scopeLevels]};
  const marker=`STALE REUSE ${lesson.id}`;binding.reuseReasonJa=marker;
  assert(render(lesson,level).includes(marker),'current selected reuse caption must remain');positives++;
  binding.lessonSourceHash='0'.repeat(64);
  const stale=render(lesson,level);assert(stale.includes(figure.titleJa),'current canonical fallback must remain visible');assert(!stale.includes(marker),'stale daily caption leaked onto canonical fallback');negatives++;
  assert.equal(render(lesson,level,false),'','stale binding must not render without explicit fallback');negatives++;
  Object.assign(binding,saved,{reuseReasonJa:marker});binding.scopeLevels=[];
  const wrongLevel=render(lesson,level);assert(wrongLevel.includes(figure.titleJa));assert(!wrongLevel.includes(marker),'unsupported-course caption leaked onto canonical fallback');negatives++;
  Object.assign(binding,saved);
 }
}
assert(positives>0,'no production fallback case exercised');
console.log(`PASS daily-figure-caption-guards: ${positives} current real binding renders, ${negatives} stale/course negative cases. Actual DailyLearningFigure rendered; raster leaf/unused imports isolated; no pixel/device claim.`);
