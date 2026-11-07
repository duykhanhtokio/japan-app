#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),json=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const content=json('src/data/agriculture/lessons.ja.json'),readings=json('src/data/agriculture/native-support-headings-readings.json'),support={MulchColorSupport:json('src/data/agriculture/mulch-color-support.json'),PestFoundationSupport:json('src/data/agriculture/pest-foundation-support.json')},cache=new Map();
function load(name){
 if(cache.has(name))return cache.get(name).exports;
 const filename=path.join(root,'src/components/agriculture',name+'.tsx');
 const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(name,m);const original=m.require.bind(m);
 m.require=id=>{
  if(id==='react-native')return require('react-native-web');
  if(id==='react'||id.startsWith('react/'))return original(id);
  if(id==='@/data/agriculture/lessons.ja.json')return content;
  if(id==='@/data/agriculture/native-support-headings-readings.json')return readings;
  if(id==='@/data/agriculture/mulch-color-support.json')return support.MulchColorSupport;
  if(id==='@/data/agriculture/pest-foundation-support.json')return support.PestFoundationSupport;
  if(id==='./AgricultureNativeSupportRuby')return load('AgricultureNativeSupportRuby');
  return original(id);
 };
 m._compile(code,filename);return m.exports;
}
const {agricultureNativeSupportReading, AgricultureNativeSupportRuby}=load('AgricultureNativeSupportRuby'),colors={text:'#123',translation:'#fff',translationText:'#123',border:'#abc'},escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
let renders=0,fields=0,negative=0;
for(const [component,data]of Object.entries(support)){
 const Component=load(component)[component],l=content.lessons.find(l=>l.id===data.lessonId),e=readings.entries[l.id];
 for(const level of l.levels){
  const context={lessonId:l.id,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,level};
  for(const language of Object.keys(data.locales))for(const showTranslation of [false,true]){
   const html=renderToStaticMarkup(React.createElement(Component,{...context,language,showTranslation,colors}));
   for(const [field,f]of Object.entries(e.fields)){assert(html.includes(`data-testid="agri-native-support-ruby-${l.id}-${field}"`));assert(html.includes(escape(f.sourceJapanese)));fields++;}
   for(const id of data.paragraphIds){assert(html.includes(escape(data.sourceJapanese.paragraphs[id])),'canonical full paragraph must remain');if(showTranslation&&language!=='ja'){assert(html.includes(escape(data.locales[language].paragraphs[id])));}}
   renders++;
  }
  for(const [field,f]of Object.entries(e.fields)){
   const props={...context,field,text:f.sourceJapanese};assert(agricultureNativeSupportReading(props));
   for(const bad of [{lessonSourceHash:'0'.repeat(64)},{lessonRevision:'stale'},{level:'3'},{field:'unknown'},{text:props.text+'差'}]){assert.equal(agricultureNativeSupportReading({...props,...bad}),null);negative++;}
   const saved=e.sourceHash;e.sourceHash='0'.repeat(64);assert.equal(agricultureNativeSupportReading(props),null);e.sourceHash=saved;negative++;
   const token=f.tokens.find(t=>t.readingKana),kana=token.readingKana;token.readingKana='invalid';assert.equal(agricultureNativeSupportReading(props),null);token.readingKana=kana;negative++;
   const stale=renderToStaticMarkup(React.createElement(AgricultureNativeSupportRuby,{...props,lessonRevision:'stale',color:'#123'}));assert(stale.includes(escape(props.text)));assert(!stale.includes('data-testid="agri-native-support-ruby-'));negative++;
  }
 }
}
assert.equal(readings.nativeReviewed,false);assert.equal(readings.domainReviewed,false);
console.log(`PASS protection-native-heading-readings: ${renders} actual support/RNW renders across JA+12 locales, both levels and translation visibility; ${fields} heading fields; ${negative} stale/unknown/invalid-kana canonical-fallback cases. Full source paragraphs/locales retained; no body-reading, browser-pixel or physical-device claim.`);
