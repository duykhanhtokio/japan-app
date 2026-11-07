#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../..'),receiptPath=process.argv[2];assert(receiptPath,'Pass an owned batch receipt path');const plan=JSON.parse(fs.readFileSync(path.resolve(root,receiptPath),'utf8'));
const rt=require('./actual-figure-test-runtime.cjs')(root),{React,renderToStaticMarkup,lessons}=rt,{RecognitionImages}=rt.component('RecognitionImages'),{agricultureImageReading}=rt.component('AgricultureImageRuby');
const registry=rt.read('src/data/agriculture/recognition-images.json'),all=registry.images,readings=rt.read('src/data/agriculture/image-readings.json'),colors={text:'#111',translation:'#fff',translationText:'#111',border:'#777'},langs=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','km','th','tl'];
const han=s=>/[\p{Script=Han}々]/u.test(s);let renders=0,contexts=0,negatives=0,fieldContexts=0,fields=0;
for(const target of plan.figures){const f=all.find(x=>x.id===target.figureId),entry=readings.entries[f?.id];assert(f&&entry);assert.equal(entry.assetSha256,f.assetSha256);registry.images=[f];const texts={title:f.titleJa,observation:f.observationJa,limit:f.limitJa,...Object.fromEntries((f.labelsJa||[]).map((text,i)=>['label:'+i,text]))};
 const expected=Object.keys(texts).filter(k=>han(texts[k]));assert.deepEqual([...target.fields].sort(),expected.sort(),'Batch must cover all current visible Han fields for '+f.id);fields+=expected.length;
 const marker=field=>'agri-image-ruby-'+f.id+'-'+field;
 const render=(l,level,extra={})=>renderToStaticMarkup(React.createElement(RecognitionImages,{lessonId:l.id,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,level,colors,language:'ja',showTranslation:false,...extra}));
 let representative;for(const id of f.lessonIds){const l=lessons.find(x=>x.id===id);if(!l||l.sourceHash!==f.lessonSourceHashes[id])continue;for(const level of f.scopeLevels.filter(x=>l.levels.includes(x))){contexts++;representative||={l,level};const html=render(l,level);for(const field of expected){assert(html.includes(marker(field)),`${f.id}/${id}/${level}/${field}`);assert(agricultureImageReading({imageId:f.id,assetSha256:f.assetSha256,lessonId:id,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,field,text:texts[field]}));fieldContexts++;}renders++;}
 if(!f.scopeLevels.some(x=>l.levels.includes(x)))continue;
 const level=f.scopeLevels.find(x=>l.levels.includes(x));for(const delta of [{lessonSourceHash:'0'.repeat(64)},{lessonRevision:'stale-revision'}]){assert(!render(l,level,delta).includes('agri-image-ruby-'+f.id+'-'));negatives++;}
 }
 assert(representative);const {l,level}=representative;
 // Every locale once, alongside Japanese checks for every current source/course.
 for(const language of langs){const html=render(l,level,{language,showTranslation:true});for(const field of expected)assert(html.includes(marker(field)));assert(html.includes(f.id+'-localized-title'));renders++;}
 for(const extra of [{language:'vi',showTranslation:false},{language:'unknown-language',showTranslation:true}]){const html=render(l,level,extra);for(const field of expected)assert(html.includes(marker(field)));assert(!html.includes(f.id+'-localized-title'));renders++;}
 const foreign=lessons.find(x=>!f.lessonIds.includes(x.id)&&x.levels.includes(level));assert(foreign);assert(!render(foreign,level).includes(f.id));negatives++;
 for(const wrongLevel of ['1','2','3','unsupported'].filter(x=>!f.scopeLevels.includes(x))){assert(!render(l,wrongLevel).includes(f.id));negatives++;}
 const sha=entry.assetSha256;entry.assetSha256='0'.repeat(64);assert(!render(l,level).includes('agri-image-ruby-'+f.id+'-'));entry.assetSha256=sha;negatives++;
 for(const field of expected){const rec=entry.fields[field],text=rec.sourceJapanese;rec.sourceJapanese+=' stale';assert(!render(l,level).includes(marker(field)));rec.sourceJapanese=text;negatives++;
  assert.equal(rec.tokens.map(t=>t.text).join(''),texts[field]);const token=rec.tokens.find(t=>han(t.text));assert(token);const kana=token.readingKana;token.readingKana='invalid-latin';assert(!render(l,level).includes(marker(field)));token.readingKana=kana;negatives++;
 }
 for(const [field,text]of Object.entries(texts))if(!han(text)&&!entry.fields[field])assert(!render(l,level).includes(marker(field)),'Kana-only text stays plain');
 assert(!Object.hasOwn(entry.fields,'alt'),'This visible-Han batch does not add accessibility-alt Ruby');
}
registry.images=all;
for(const file of ['src/data/agriculture/lessons.ja.json','src/data/agriculture/recognition-images.json','src/data/agriculture/recognition-image-locales.json'])assert(fs.readFileSync(path.join(root,file)).equals(cp.execFileSync('git',['show','HEAD:'+file],{cwd:root,maxBuffer:50*1024*1024})),file+' must remain unchanged');
console.log(JSON.stringify({pass:true,records:plan.figures.length,visibleHanFields:fields,currentSourceCourseContexts:contexts,currentFieldContexts:fieldContexts,actualReaderRenders:renders,sourceAssetRevisionTextKanaForeignLevelNegatives:negatives,allTwelveLocaleModes:true,hiddenUnknownTranslationKeepsJapanese:true,accessibilityAndKanaOnlyTextRemainPlain:true,canonicalJAOuterLocalesArtUnchanged:true}));
