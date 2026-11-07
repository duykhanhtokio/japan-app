#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../..'),rt=require('./actual-figure-test-runtime.cjs')(root),{React,renderToStaticMarkup,lessons}=rt;
const {DailyLearningFigure}=rt.component('DailyLearningSupport'),{RecognitionImages}=rt.component('RecognitionImages'),{agricultureImageReading}=rt.component('AgricultureImageRuby');
const registry=rt.read('src/data/agriculture/recognition-images.json'),all=registry.images,support=rt.read('src/data/agriculture/daily-learning-support.json'),readings=rt.read('src/data/agriculture/image-readings.json');
const target=lessons.find(x=>x.id==='agr-s30-plant-detail'),binding=support.figureBindings[target.id],figure=all.find(x=>x.id===binding.figureId),source=lessons.find(x=>x.id==='agr-f40-rice-source1-final');
const colors={text:'#111',translation:'#fff',translationText:'#111',border:'#777'},field='reuse:'+target.id,marker='agri-image-ruby-'+figure.id+'-'+field,languages=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','km','th','tl'];
registry.images=[figure];assert.deepEqual(figure.scopeLevels,['1']);assert.deepEqual(target.levels,['2']);assert.equal(figure.lessonSourceHashes[target.id],target.sourceHash);assert.equal(binding.assetSha256,figure.assetSha256);assert.deepEqual(binding.requiredParagraphIds,[target.id+'-p5',target.id+'-p6']);
const p={lesson:target,level:'2',colors,language:'vi',showTranslation:true},daily=x=>renderToStaticMarkup(React.createElement(DailyLearningFigure,{...p,...x})),direct=(l,level)=>renderToStaticMarkup(React.createElement(RecognitionImages,{lessonId:l.id,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,level,colors,language:'vi',showTranslation:true}));
assert(!direct(target,'2').includes(figure.id));assert(direct(source,'1').includes(figure.id));let renders=0,negative=0;
for(const language of languages){const html=daily({language,showTranslation:language!=='ja'});assert(html.includes(marker));assert(html.includes('agri-daily-support-'+target.id));if(language!=='ja')assert(html.includes('agri-daily-support-'+target.id+'-localized-reuse-reason'));renders++;}
assert(daily({paragraphIds:binding.requiredParagraphIds}).includes(marker));renders++;
for(const paragraphIds of [[],[target.id+'-p1'],[target.id+'-p5'],[target.id+'-p6']]){assert.equal(daily({paragraphIds}),'');negative++;}
for(const level of ['1','3','']){assert.equal(daily({level}),'');negative++;}
for(const delta of [{sourceHash:'0'.repeat(64)},{revision:'stale-revision'}]){const html=daily({lesson:{...target,...delta}});assert(!html.includes(marker));assert(!html.includes('-localized-reuse-reason'));negative++;}
assert(!daily({language:'unknown'}).includes('-localized-reuse-reason'));negative++;
const caption=binding.reuseCaption;for(const [key,value]of Object.entries({sourceJapanese:'old generic wording',figureId:'unknown',assetSha256:'0'.repeat(64),lessonSourceHash:'0'.repeat(64),lessonRevision:'stale-revision'})){const old=caption[key];caption[key]=value;assert(!daily().includes('-localized-reuse-reason'));caption[key]=old;negative++;}
const entry=readings.entries[figure.id],reading=entry.fields[field];for(const [obj,key,value]of [[entry,'assetSha256','0'.repeat(64)],[entry.lessonSourceHashes,target.id,'0'.repeat(64)],[entry.lessonRevisions,target.id,'stale'],[reading,'sourceJapanese','changed'],[reading,'targetLessonId',source.id]]){const old=obj[key];obj[key]=value;assert(!daily().includes(marker));obj[key]=old;negative++;}
// Future source-caption readings may add the source context to this same image entry.
entry.lessonSourceHashes[source.id]=source.sourceHash;entry.lessonRevisions[source.id]=source.revision;
assert.equal(agricultureImageReading({imageId:figure.id,assetSha256:figure.assetSha256,lessonId:source.id,lessonSourceHash:source.sourceHash,lessonRevision:source.revision,field,text:binding.reuseReasonJa}),null);negative++;
delete entry.lessonSourceHashes[source.id];delete entry.lessonRevisions[source.id];registry.images=all;
for(const file of ['src/data/agriculture/lessons.ja.json','src/data/agriculture/recognition-images.json','src/data/agriculture/recognition-image-locales.json'])assert(fs.readFileSync(path.join(root,file)).equals(cp.execFileSync('git',['show','HEAD:'+file],{cwd:root,maxBuffer:50*1024*1024})),file+' must remain unchanged');
console.log(JSON.stringify({pass:true,actualTargetReaderRenders:renders,currentLanguages:13,negativeSourceAssetRevisionTextParagraphLevelContextChecks:negative,directScope:['1'],dailyTargetScope:['2'],canonicalFigureAndOuterMetadataUnchanged:true}));
