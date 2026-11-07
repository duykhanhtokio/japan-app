#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const runtime=require('./actual-figure-test-runtime.cjs')(root);
const {lessons,React,renderToStaticMarkup}=runtime;
const support=runtime.read('src/data/agriculture/daily-learning-support.json');
const figures=runtime.read('src/data/agriculture/recognition-images.json');
const {DailyLearningFigure}=runtime.component('DailyLearningSupport');
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
