#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),rt=require('./actual-figure-test-runtime.cjs')(root),{React,renderToStaticMarkup,lessons}=rt;
const registry=rt.read('src/data/agriculture/recognition-images.json'),locale=rt.read('src/data/agriculture/recognition-image-locales.json'),reading=rt.read('src/data/agriculture/image-readings.json');
const {RecognitionImages,recognitionImageTranslation}=rt.component('RecognitionImages'),{agricultureImageReading}=rt.component('AgricultureImageRuby');
const suffixes=["agr-recognition-tractors-appearance-v1"];
const all=registry.images,langs=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','km','th','tl'],colors={text:'#111',translation:'#fff',translationText:'#111',border:'#777'};let contexts=0,renders=0,negative=0,fields=0;
for(const suffix of suffixes){const f=all.find(x=>x.id===suffix);assert(f);registry.images=[f];
 for(const id of f.lessonIds){const l=lessons.find(l=>l.id===id);assert.equal(l.sourceHash,f.lessonSourceHashes[id]);for(const level of f.scopeLevels.filter(x=>l.levels.includes(x))){contexts++;
 const props={lessonId:id,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,level,colors};
 for(const language of langs){const html=renderToStaticMarkup(React.createElement(RecognitionImages,{...props,language,showTranslation:language!=='ja'}));for(const field of ['title','observation','limit'])assert(html.includes('agri-image-ruby-'+f.id+'-'+field));if(language!=='ja')assert(html.includes(f.id+'-localized-title'));renders++;}
 for(const field of ['title','alt','observation','limit']){const p={imageId:f.id,assetSha256:f.assetSha256,lessonId:id,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,field,text:f[field+'Ja']};assert(agricultureImageReading(p));fields++;for(const delta of [{assetSha256:'0'.repeat(64)},{lessonSourceHash:'0'.repeat(64)},{lessonRevision:'stale'},{text:p.text+' stale'}]){assert.equal(agricultureImageReading({...p,...delta}),null);negative++;}}
 for(const language of langs.slice(1)){assert(recognitionImageTranslation(f,id,l.sourceHash,l.revision,language));for(const [sha,rev] of [['0'.repeat(64),l.revision],[l.sourceHash,'stale'],[l.sourceHash,undefined]]){assert.equal(recognitionImageTranslation(f,id,sha,rev,language),null);negative++;}}
 assert.equal(recognitionImageTranslation(f,id,l.sourceHash,l.revision,'unknown'),null);negative++;
 const old=locale.entries[f.id].assetSha256;locale.entries[f.id].assetSha256='0'.repeat(64);assert.equal(recognitionImageTranslation(f,id,l.sourceHash,l.revision,'vi'),null);locale.entries[f.id].assetSha256=old;negative++;
 const title=locale.entries[f.id].sourceJapanese.title;locale.entries[f.id].sourceJapanese.title+=' changed';assert.equal(recognitionImageTranslation(f,id,l.sourceHash,l.revision,'vi'),null);locale.entries[f.id].sourceJapanese.title=title;negative++;
 const html=renderToStaticMarkup(React.createElement(RecognitionImages,{...props,level:'invalid'}));assert(!html.includes(f.id));negative++;
 }}
 assert.equal(Object.keys(reading.entries[f.id].fields).length,4);
}
registry.images=all;console.log(JSON.stringify({pass:true,figures:1,contexts,renders,fields,negative,nativeInternalClosure:false}));
