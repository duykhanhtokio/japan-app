#!/usr/bin/env node
'use strict';
// Run from an installed app checkout; a separate QA dependency directory may use NODE_PATH.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const {transformSync}=require('@babel/core');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=JSON.parse(read('src/data/agriculture/diagrams.json'));
const lessons=new Map(JSON.parse(read('src/data/agriculture/lessons.ja.json')).lessons.map(l=>[l.id,l]));
const componentPath=path.join(root,'src/components/agriculture/ConceptDiagrams.tsx');
const code=transformSync(fs.readFileSync(componentPath,'utf8'),{
 filename:componentPath,babelrc:false,configFile:false,
 plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']
}).code;
const loaded=new Module(componentPath,module);
loaded.filename=componentPath;
loaded.paths=Module._nodeModulePaths(path.dirname(componentPath));
const nodeRequire=loaded.require.bind(loaded);
loaded.require=id=>id==='react-native'?require('react-native-web'):id==='@/data/agriculture/diagrams.json'?data:nodeRequire(id);
loaded._compile(code,componentPath);
const {ConceptDiagrams}=loaded.exports;
const colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
const render=props=>renderToStaticMarkup(React.createElement(ConceptDiagrams,{colors,...props}));
let positive=0,negative=0;
for(const diagram of data.diagrams){
 assert.deepEqual(Object.keys(diagram.lessonSourceHashes).sort(),[...diagram.lessonIds].sort());
 for(const lessonId of diagram.lessonIds){
  const lesson=lessons.get(lessonId);assert(lesson,`missing lesson ${lessonId}`);
  assert.equal(diagram.lessonSourceHashes[lessonId],lesson.sourceHash,`stale diagram binding ${lessonId}`);
  for(const level of diagram.scopeLevels){
   assert(lesson.levels.includes(level),`${lessonId} is unavailable in level ${level}`);
   const props={lessonId,lessonSourceHash:lesson.sourceHash,level};
   const html=render(props);
   assert(html.includes(`data-testid="${diagram.id}"`),`current diagram hidden ${diagram.id}/${lessonId}/${level}`);
   for(const panel of diagram.panels)assert(html.includes(panel.titleJa),`missing panel ${panel.titleJa}`);
   positive++;
   for(const replacement of ['0'.repeat(64),'',undefined]){
    assert.equal(render({...props,lessonSourceHash:replacement}),'',`unverified hash rendered ${lessonId}`);negative++;
   }
   for(const replacement of ['',undefined,'3']){
    assert.equal(render({...props,level:replacement}),'',`unverified level rendered ${lessonId}`);negative++;
   }
   const original=diagram.lessonSourceHashes[lessonId];
   delete diagram.lessonSourceHashes[lessonId];
   assert.equal(render(props),'',`missing metadata binding rendered ${lessonId}`);negative++;
   diagram.lessonSourceHashes[lessonId]='f'.repeat(64);
   assert.equal(render(props),'',`stale metadata binding rendered ${lessonId}`);negative++;
   diagram.lessonSourceHashes[lessonId]=original;
  }
  for(const level of ['1','2'].filter(l=>!diagram.scopeLevels.includes(l))){
   assert.equal(render({lessonId,lessonSourceHash:lesson.sourceHash,level}),'',`wrong course rendered ${lessonId}`);negative++;
  }
 }
}
assert.equal(render({lessonId:'unknown-lesson',lessonSourceHash:'f'.repeat(64),level:'1'}),'');negative++;
const course=read('src/components/agriculture/AgricultureCourse.tsx');
assert.equal((course.match(/<ConceptDiagrams\b/g)||[]).length,1);
assert(course.includes('<ConceptDiagrams lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} colors={colors} level={level}/>'),'reader must forward canonical source hash');
console.log(`PASS concept-source-guards: ${data.diagrams.length} actual diagrams, ${positive} current lesson/level renders, ${negative} fail-closed cases; canonical reader hash forwarded.`);
