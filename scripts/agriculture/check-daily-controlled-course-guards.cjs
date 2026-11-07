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
for(const [lessonId,diagram] of Object.entries(support.controlledDiagrams)){
 const lesson=lessons.find(l=>l.id===lessonId);assert(lesson);
 if(diagram.lessonSourceHash!==lesson.sourceHash)continue;
 for(const level of lesson.levels){assert(render(lesson,level).length>0,'current selected native/controlled branch must render');positives++;}
 for(const level of ['1','2','3',''].filter(l=>!lesson.levels.includes(l))){assert.equal(render(lesson,level),'',`unsupported course rendered ${lessonId}/${level}`);negatives++;}
 const currentLevel=lesson.levels[0];
 assert.equal(render({...lesson,levels:[]},currentLevel),'','removed course metadata must fail closed');negatives++;
}
assert(positives>0);
console.log(`PASS daily-controlled-course-guards: ${positives} current controlled lesson/course renders, ${negatives} unsupported/removed-course cases. Actual DailyLearningFigure rendered; actual current native/controlled modules loaded; no pixel/device claim.`);
