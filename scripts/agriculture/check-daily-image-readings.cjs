#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),runtime=require('./actual-figure-test-runtime.cjs')(root);
const {React,renderToStaticMarkup,lessons}=runtime,{DailyLearningFigure}=runtime.component('DailyLearningSupport');
const support=runtime.read('src/data/agriculture/daily-learning-support.json'),readings=runtime.read('src/data/agriculture/image-readings.json');
const census=runtime.read('docs/ssw-workspace/agriculture/royal-weekly-20261107/active-global-caption-reading-route-census.json');
const figureIds=['agr-recognition-strawberry-gray-mold-v1','agr-equip-speed-sprayer-v1','agr-f40-safety-media-mulch-materials','agr-f40-safety-media-pheromone-dispenser','agr-f40-safety-media-nozzle-source-examples'];
const languages=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','km','th','tl'];
const colors={text:'#111',translation:'#fff',translationText:'#111',border:'#777'};
const render=(lesson,level,includeExisting,language='vi')=>renderToStaticMarkup(React.createElement(DailyLearningFigure,{lesson,level,includeExisting,language,showTranslation:language!=='ja',colors}));
let contexts=0,renders=0,negatives=0;
for(const figureId of figureIds){
 const record=census.records.find(x=>x.figureId===figureId);assert(record);
 const routes=record.routes.filter(x=>x.route==='DailyLearningFigure'||x.route==='DailyCompanionReadings');assert(routes.length);
 for(const route of routes){
  const lesson=lessons.find(x=>x.id===route.lessonId),includeExisting=route.route==='DailyCompanionReadings';assert(lesson);contexts++;
  for(const language of languages){const html=render(lesson,route.level,includeExisting,language);for(const field of ['title','observation','limit'])assert(html.includes(`agri-image-ruby-${figureId}-${field}`),`missing actual daily reading ${figureId}/${lesson.id}/${field}/${language}`);renders++;}
  const staleHash=render({...lesson,sourceHash:'0'.repeat(64)},route.level,includeExisting);assert(!staleHash.includes(`agri-image-ruby-${figureId}`));negatives++;
  const staleRevision=render({...lesson,revision:'stale-revision'},route.level,includeExisting);assert(!staleRevision.includes(`agri-image-ruby-${figureId}`));assert(!staleRevision.includes('-localized-title'));negatives++;
  for(const level of ['1','2','3',''].filter(x=>!lesson.levels.includes(x))){assert.equal(render(lesson,level,includeExisting),'');negatives++;}
  const e=readings.entries[figureId],sha=e.assetSha256;e.assetSha256='0'.repeat(64);assert(!render(lesson,route.level,includeExisting).includes(`agri-image-ruby-${figureId}`));e.assetSha256=sha;negatives++;
 }
}
const lesson=lessons.find(x=>x.id==='agr-par22-weeds'),binding=support.figureBindings[lesson.id],caption=binding.reuseCaption;assert(caption&&Object.keys(caption.locales).length===12);
for(const language of languages){const html=render(lesson,'2',false,language);assert(!html.includes('殺菌剤用'));assert(html.includes(`agri-image-ruby-${binding.figureId}-reuse:${lesson.id}`));for(let i=0;i<4;i++)assert(html.includes(`agri-image-ruby-${binding.figureId}-label:${i}`));if(language!=='ja')assert(html.includes(`agri-daily-support-${lesson.id}-localized-reuse-reason`));renders++;}
for(const [key,value]of Object.entries({sourceJapanese:'old fungicide wording',figureId:'unknown',assetSha256:'0'.repeat(64),lessonSourceHash:'0'.repeat(64),lessonRevision:'stale-revision'})){const saved=caption[key];caption[key]=value;assert(!render(lesson,'2',false).includes(`agri-daily-support-${lesson.id}-localized-reuse-reason`));caption[key]=saved;negatives++;}
assert(!render(lesson,'2',false,'unknown-language').includes(`agri-daily-support-${lesson.id}-localized-reuse-reason`));negatives++;
const ipm=lessons.find(x=>x.id==='agr-pest-ipm');assert(render(ipm,'2',false).includes('agri-image-ruby-agr-f40-safety-media-pheromone-dispenser-title'),'existing explicit level2 daily override must remain');
console.log(`PASS actual daily image readings: ${contexts} source-bound routes; ${renders} Japanese+12locale renders; ${negatives} stale/context/unknown-caption rejections; exact nozzle reuse reading+12target translations and existing level2 pheromone override retained.`);
