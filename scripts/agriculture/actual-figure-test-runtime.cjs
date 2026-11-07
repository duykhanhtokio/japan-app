'use strict';
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
module.exports=function createRuntime(root){
 const cache=new Map(),json=new Map();
 const read=p=>{const file=path.resolve(root,p);if(!json.has(file))json.set(file,JSON.parse(fs.readFileSync(file,'utf8')));return json.get(file);};
 const lessons=read('src/data/agriculture/lessons.ja.json').lessons;
 function load(file){
  file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
  const m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));cache.set(file,m);const original=m.require.bind(m);
  m.require=id=>{
   if(id==='react-native')return require('react-native-web');
   // Same current id+course lookup as agriculture/index.ts; translations are not
   // needed by the selected raster branch or the native course rejection checks.
   if(id==='@/data/agriculture')return {agricultureLesson:(id,level)=>lessons.find(l=>l.id===id&&l.levels.includes(level)),agricultureTranslation:()=>null};
   if(id==='@/components/tokutei/StudyAppearance')return {TranslationText:()=>null};
   if(/\.(png|webp)$/.test(id))return {uri:'asset://'+path.relative(root,path.resolve(path.dirname(file),id))};
   if(id.startsWith('@/')||id.startsWith('./')||id.startsWith('../')){
    const candidate=id.startsWith('@/')?path.join(root,'src',id.slice(2)):path.resolve(path.dirname(file),id);
    if(candidate.endsWith('.json'))return read(candidate);
    for(const ext of ['.tsx','.ts'])if(fs.existsSync(candidate+ext))return load(candidate+ext);
   }
   return original(id);
  };
  const code=transformSync(fs.readFileSync(file,'utf8'),{filename:file,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
  m._compile(code,file);return m.exports;
 }
 return {read,lessons,React,renderToStaticMarkup,component:name=>load(path.join(root,'src/components/agriculture',name+'.tsx'))};
};
