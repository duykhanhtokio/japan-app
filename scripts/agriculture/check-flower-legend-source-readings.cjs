#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),runtime=require('./actual-figure-test-runtime.cjs')(root);
const {React,renderToStaticMarkup,lessons}=runtime,{RecognitionImages}=runtime.component('RecognitionImages'),{FlowerLegendFigure}=runtime.component('FlowerLegendFigure');
const native=runtime.read('src/data/agriculture/flower-legend-native.json'),figures=runtime.read('src/data/agriculture/recognition-images.json'),reading=runtime.read('src/data/agriculture/image-readings.json');
const f=figures.images.find(x=>x.id===native.figureId),entry=reading.entries[f.id];assert(entry);
const languages=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','km','th','tl'];
const colors={text:'#111',translation:'#fff',translationText:'#111',border:'#777'};
const props=l=>({lessonId:l.id,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,level:'2',colors,language:'vi',showTranslation:true});
const body=p=>renderToStaticMarkup(React.createElement(FlowerLegendFigure,p));
const whole=p=>renderToStaticMarkup(React.createElement(RecognitionImages,p));
const marker='agri-image-ruby-'+f.id+'-';
const nativeFields=['legend:period',...native.labels.ja.categories.map((_,i)=>'legend:category:'+i),'legend:limit','legend:source-reference'];
assert.equal(native.colors.length,7);assert.equal(Object.keys(native.labels).length,13);assert.equal(native.labels.ja.categories.length,7);
let contexts=0,renders=0,negative=0;
for(const lid of f.lessonIds){const l=lessons.find(x=>x.id===lid);assert(l&&l.levels.includes('2'));const p=props(l);contexts++;
 for(const language of languages){const html=whole({...p,language,showTranslation:language!=='ja'});for(const field of ['title','observation','limit',...nativeFields])assert(html.includes(marker+field),`missing actual native/outer reading ${field}/${language}`);for(let i=0;i<7;i++)assert(html.includes(`agri-flower-legend-row-${i}`));if(language!=='ja'){assert(html.includes(f.id+'-localized-title'));assert(html.includes('agri-flower-legend-localized-period'));assert(html.includes('agri-flower-legend-localized-limit'));}renders++;}
 assert.equal(body({...p,lessonSourceHash:'0'.repeat(64)}),'');negative++;
 for(const level of ['1','3','']){assert.equal(body({...p,level}),'');negative++;}
 for(const revision of ['stale-revision',undefined]){const html=body({...p,lessonRevision:revision});assert(!html.includes(marker));assert(!html.includes('agri-flower-legend-localized-'));negative++;}
 const hidden=whole({...p,showTranslation:false});assert(!hidden.includes(f.id+'-localized-title'));assert(!hidden.includes('agri-flower-legend-localized-'));negative++;
 const unknown=body({...p,language:'unknown-language'});assert(!unknown.includes('agri-flower-legend-localized-'));assert(unknown.includes(marker+'legend:period'));negative++;
}
const p=props(lessons.find(x=>x.id===f.lessonIds[0]));
const asset=native.referenceAssetSha256;native.referenceAssetSha256='0'.repeat(64);assert.equal(body(p),'');native.referenceAssetSha256=asset;negative++;
const sha=entry.assetSha256;entry.assetSha256='0'.repeat(64);assert(!body(p).includes(marker));entry.assetSha256=sha;negative++;
const category=native.labels.ja.categories[0];native.labels.ja.categories[0]+=' changed';const changed=body(p);assert(!changed.includes('agri-flower-legend-localized-'));assert(!changed.includes(marker+'legend:category:0'));native.labels.ja.categories[0]=category;negative++;
const translated=native.labels.vi.categories.pop();assert(!body(p).includes('agri-flower-legend-localized-'));native.labels.vi.categories.push(translated);negative++;
console.log(`PASS flower legend source/readings: ${contexts} actual source contexts; ${renders} Japanese+12locale reader renders; ${negative} stale source/asset/revision/text/level/locale rejections;7 colors/categories and13 native locale payloads retained.`);
