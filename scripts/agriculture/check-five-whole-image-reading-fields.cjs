#!/usr/bin/env node
'use strict';
// Current active caption coverage only; this is not semantic, pixel or occupational acceptance.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const figures=JSON.parse(read('src/data/agriculture/recognition-images.json')).images;
const lessons=new Map(JSON.parse(read('src/data/agriculture/lessons.ja.json')).lessons.map(x=>[x.id,x]));
const readings=JSON.parse(read('src/data/agriculture/image-readings.json'));
const modules=new Map(),lazyModules=new Map();
function lazy(name){if(!lazyModules.has(name))lazyModules.set(name,new Proxy({},{get(_,key){return load(name)[key];}}));return lazyModules.get(name);}
function load(name){if(modules.has(name))return modules.get(name).exports;let filename=path.join(root,'src/components/agriculture',name+'.tsx');if(!fs.existsSync(filename))filename=filename.slice(0,-1);const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));modules.set(name,m);const original=m.require.bind(m);m.require=id=>{if(id==='react-native')return require('react-native-web');if(id.startsWith('@/data/agriculture/')&&id.endsWith('.json'))return id.endsWith('/image-readings.json')?readings:JSON.parse(read('src/'+id.slice(2)));if(/\.(png|webp)$/.test(id))return{uri:'inventory-only://'+id};if(id.startsWith('./'))return lazy(id.slice(2));return original(id);};m._compile(code,filename);return m.exports;}

const {RecognitionImages,hasRecognitionImage,recognitionImageTranslation}=load('RecognitionImages');
const {agricultureImageReading,AgricultureImageRuby}=load('AgricultureImageRuby');
const targets={'agr-fig-rotation-two-year-examples-v1':['limit','label:10','label:14'],'agr-fig-f40-crop-leaves-atlas-v1':['observation'],'agr-f40-pf-source-range-comparison':['limit']};
const colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
let fields=0,rubyRenders=0,readerRenders=0,rejections=0;
for(const [id,names] of Object.entries(targets)){const f=figures.find(f=>f.id===id);assert(f);const entry=readings.entries[id];
 for(const field of names){const text=field.startsWith('label:')?f.labelsJa[Number(field.split(':')[1])]:f[field+'Ja'];const expected=entry.fields[field];assert.equal(expected.sourceJapanese,text);assert.equal(expected.tokens.map(t=>t.text).join(''),text);fields++;
  for(const lid of f.lessonIds){const l=lessons.get(lid);for(const level of f.scopeLevels.filter(x=>l.levels.includes(x))){assert(hasRecognitionImage(lid,l.sourceHash,f.assetKey,level));const p={imageId:id,assetSha256:f.assetSha256,lessonId:lid,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,field,text};const tokens=agricultureImageReading(p);assert(tokens);
   const html=renderToStaticMarkup(React.createElement(AgricultureImageRuby,{...p,color:'#172733'}));assert(html.includes(`data-testid="agri-image-ruby-${id}-${field}"`));for(const t of tokens)if(t.readingKana)assert(html.includes(t.readingKana));rubyRenders++;
   for(const change of [{assetSha256:'0'.repeat(64)},{lessonSourceHash:'0'.repeat(64)},{lessonRevision:'stale'},{lessonRevision:undefined},{text:text+'変更'}]){assert.equal(agricultureImageReading({...p,...change}),null);rejections++;}
   for(const language of ['ja','vi','zh-CN']){const rendered=renderToStaticMarkup(React.createElement(RecognitionImages,{lessonId:lid,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,level,language,showTranslation:language!=='ja',colors}));assert(rendered.includes(`data-testid="agri-image-ruby-${id}-${field}"`));if(language!=='ja'){assert(recognitionImageTranslation(f,lid,l.sourceHash,l.revision,language));assert(rendered.includes(`data-testid="${id}-localized-title"`));}readerRenders++;}
  }}
 }
}
const rotation=figures.find(f=>f.id==='agr-fig-rotation-two-year-examples-v1'),leaf=figures.find(f=>f.id==='agr-fig-f40-crop-leaves-atlas-v1');
assert(rotation.limitJa.includes('月を示す横軸'));assert.equal(rotation.labelsJa[10],'月を示す横軸の読み方');assert(rotation.labelsJa[14].includes('播種や収穫の月'));assert(leaf.observationJa.includes('切れ込みのある葉'));
const pf=readings.entries['agr-f40-pf-source-range-comparison'].fields.limit.tokens;assert.equal(pf.find(t=>t.text==='灌水閾値').readingKana,'かんすいいきち');
console.log(`PASS five whole image reading fields: ${fields} exact full fields, ${rubyRenders} actual Ruby renders, ${readerRenders} actual JA/VI/ZH reader routes, ${rejections} source/asset/revision/text rejection checks; clear month/leaf wording and dictionary-supported threshold kana.`);
