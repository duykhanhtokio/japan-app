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
const {hasRecognitionImage}=load('RecognitionImages'),{agricultureImageReading,AgricultureImageRuby}=load('AgricultureImageRuby');
const han=s=>/[\p{Script=Han}々]/u.test(s),missing=[],inactive=[],covered=[],kanaOnly=[];let contexts=0,fieldContexts=0;
for(const f of figures){const active=[];for(const lid of f.lessonIds){const l=lessons.get(lid);assert(l,`missing actual lesson ${lid}`);for(const level of f.scopeLevels.filter(x=>l.levels.includes(x))){if(hasRecognitionImage(lid,l.sourceHash,f.assetKey,level))active.push(l);}}
 if(!active.length){inactive.push(f.id);continue;}contexts+=active.length;
 const fields=[['title',f.titleJa],['observation',f.observationJa],['limit',f.limitJa],...(f.labelsJa||[]).map((x,i)=>['label:'+i,x])];
 for(const [field,text] of fields){if(!han(text)){kanaOnly.push({id:f.id,field});continue;}let valid=true;for(const l of active){fieldContexts++;const p={imageId:f.id,assetSha256:f.assetSha256,lessonId:l.id,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,field,text};if(!agricultureImageReading(p))valid=false;}
  if(valid)covered.push({id:f.id,field});else{const l=active[0],p={imageId:f.id,assetSha256:f.assetSha256,lessonId:l.id,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,field,text};const html=renderToStaticMarkup(React.createElement(AgricultureImageRuby,{...p,color:'#172733'}));assert(!html.includes(`data-testid="agri-image-ruby-${f.id}-${field}"`));missing.push({id:f.id,field,sourceJapanese:text});}
 }
}
const native=JSON.parse(read('src/data/agriculture/native-figure-field-readings.json')),{agricultureNativeFigureReading}=load('AgricultureNativeFigureRuby');const nativeCoverage=[];
for(const [provider,e] of Object.entries(native.providers)){let checked=0;for(const [lid,b] of Object.entries(e.lessonBindings)){const l=lessons.get(lid);assert(l);for(const level of b.scopeLevels.filter(x=>l.levels.includes(x)))for(const [field,v] of Object.entries(e.fields)){assert(agricultureNativeFigureReading({provider,lessonId:lid,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,level,language:'ja',field,text:v.sourceJapanese}),`native current guard ${provider}/${lid}/${field}`);checked++;}}nativeCoverage.push({provider,fields:Object.keys(e.fields).length,currentGuardedFieldContexts:checked});}
const result={registeredImages:figures.length,activeImages:figures.length-inactive.length,inactiveImageIds:inactive,activeImageLessonCourseContexts:contexts,hanFieldContexts:fieldContexts,coveredHanFields:covered.length,kanaOnlyFields:kanaOnly.length,missingHanFields:missing,nativeProviders:nativeCoverage,limits:'Current resolver coverage only; accepted semantic/source evidence remains separately pinned. No media recertification, quiz rerun, physical-device or occupational acceptance.'};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');
if(process.env.AGRI_REQUIRE_READING_CLOSED==='1')assert.equal(missing.length,0,'actual current Han fields remain plain');
console.log(JSON.stringify(result,null,2));
