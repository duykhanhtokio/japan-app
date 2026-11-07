#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),rt=require('./actual-figure-test-runtime.cjs')(root),{recognitionImageTranslation}=rt.component('RecognitionImages');
const registry=rt.read('src/data/agriculture/recognition-images.json'),locales=rt.read('src/data/agriculture/recognition-image-locales.json'),census=rt.read('docs/ssw-workspace/agriculture/royal-weekly-20261107/active-global-caption-reading-route-census.json');
const languages=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','km','th','tl'];let active=0,contexts=0,selectorChecks=0,labelFields=0;const rejectedSourceAliases=[];
for(const f of registry.images){const row=census.records.find(x=>x.figureId===f.id);if(!row?.studyCaptionNeeded)continue;active++;let valid=0;assert(locales.entries[f.id],f.id);
 for(const id of f.lessonIds){const l=rt.lessons.find(l=>l.id===id);if(!l||l.sourceHash!==f.lessonSourceHashes[id]||!f.scopeLevels.some(x=>l.levels.includes(x))){rejectedSourceAliases.push({figureId:f.id,lessonId:id});continue;}valid++;contexts++;
  for(const language of languages){const t=recognitionImageTranslation(f,id,l.sourceHash,l.revision,language);assert(t,`${f.id}/${id}/${language}`);for(const k of ['title','alt','observation','limit'])assert(typeof t[k]==='string'&&t[k].trim());if(f.labelsJa?.length){assert.equal(t.labels.length,f.labelsJa.length);labelFields+=t.labels.length;}selectorChecks++;}
 }
 assert(valid>0,'no current canonical metadata context: '+f.id);
}
assert.equal(active,census.summary.studyActiveRecords);console.log(JSON.stringify({pass:true,activeRecords:active,currentCanonicalSourceContexts:contexts,languages:12,actualSelectorChecks:selectorChecks,localizedDeclaredLabelContexts:labelFields,rejectedSourceAliases,scope:'Current active outer metadata only; not native bodies, baked text, daily target captions or native/domain review'}));
