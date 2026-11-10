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

const crypto=require('node:crypto');
const ledger=JSON.parse(read('docs/ssw-workspace/agriculture/royal-weekly-20261107/active-image-reading-semantic-ledger.json'));
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const sorted=x=>Array.isArray(x)?x.map(sorted):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sorted(x[k])])):x;
const tokenHash=x=>hash(sorted(x));
const active=new Map();
for(const f of figures)for(const [field,text] of [['title',f.titleJa],['observation',f.observationJa],['limit',f.limitJa],...(f.labelsJa||[]).map((t,i)=>['label:'+i,t])])if(/[\p{Script=Han}々]/u.test(text))active.set(f.id+'\0'+field,text);
assert.equal(ledger.covered.length,active.size);const seen=new Set();
for(const e of ledger.covered){const key=e.id+'\0'+e.field;assert(!seen.has(key));seen.add(key);assert.equal(e.sourceJapanese,active.get(key));const r=readings.entries[e.id].fields[e.field];assert.equal(r.sourceJapanese,e.sourceJapanese);assert.equal(tokenHash(r.tokens),e.literalTokensSha256);assert(e.proofs.length);}
const {hasRecognitionImage,RecognitionImages}=load('RecognitionImages');
const {agricultureImageReading,AgricultureImageRuby}=load('AgricultureImageRuby');
const colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};let ruby=0,routes=0,rejects=0;
for(const e of ledger.newContextReviewedFields){const f=figures.find(f=>f.id===e.id);for(const lid of f.lessonIds){const l=lessons.get(lid);for(const level of f.scopeLevels.filter(x=>l.levels.includes(x))){assert(hasRecognitionImage(lid,l.sourceHash,f.assetKey,level));const p={imageId:f.id,assetSha256:f.assetSha256,lessonId:lid,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,field:e.field,text:e.sourceJapanese};assert.deepEqual(agricultureImageReading(p),e.tokens);const html=renderToStaticMarkup(React.createElement(AgricultureImageRuby,{...p,color:'#172733'}));assert(html.includes(`data-testid="agri-image-ruby-${f.id}-${e.field}"`));ruby++;
 for(const language of ['ja','vi','zh-CN']){const reader=renderToStaticMarkup(React.createElement(RecognitionImages,{lessonId:lid,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,level,language,showTranslation:language!=='ja',colors}));assert(reader.includes(`data-testid="agri-image-ruby-${f.id}-${e.field}"`));routes++;}
 for(const change of [{assetSha256:'0'.repeat(64)},{lessonSourceHash:'0'.repeat(64)},{lessonRevision:'stale'},{lessonRevision:undefined},{text:e.sourceJapanese+'変更'}]){assert.equal(agricultureImageReading({...p,...change}),null);rejects++;}
}}}
const fine=readings.entries['agr-royal-fine-root-observation-v1'].fields.title.tokens;assert.equal(fine.find(t=>t.text==='細根').readingKana,'さいこん');
console.log(`PASS exact semantic evidence ledger: ${active.size} unique current Han fields match accepted literal tokens; ${ledger.acceptedExactWholeFieldUnionBeforeNewReview} retained historical proofs and ${ledger.newContextReviewedFields.length} new whole-context reviews; ${ruby} actual new-field Ruby renders, ${routes} JA/VI/ZH reader routes, ${rejects} rejection checks. Other native providers remain separate.`);
