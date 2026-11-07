#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=JSON.parse(read('src/data/agriculture/fertilizer-native-figures.json')),content=JSON.parse(read('src/data/agriculture/lessons.ja.json')),support=JSON.parse(read('src/data/agriculture/daily-learning-support.json'));
const filename=path.join(root,'src/components/agriculture/FertilizerNativeFigure.tsx'),m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));const original=m.require.bind(m);
m.require=id=>id==='react-native'?require('react-native-web'):id==='@/data/agriculture/fertilizer-native-figures.json'?data:id==='@/data/agriculture/lessons.ja.json'?content:id==='@/data/agriculture/daily-learning-support.json'?support:original(id);
m._compile(transformSync(read('src/components/agriculture/FertilizerNativeFigure.tsx'),{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code,filename);
const {fertilizerNativeLabels:labels,FertilizerNativeFigure:Figure}=m.exports,colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'},languages=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','km','th','tl'];
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
let renders=0,negative=0;
for(const [id,e] of Object.entries(data.entries)){
 const render=(level='1',language='vi',showTranslation=true)=>renderToStaticMarkup(React.createElement(Figure,{lessonId:id,lessonSourceHash:e.sourceHash,lessonRevision:e.revision,level,language,showTranslation,colors}));
 for(const level of e.levels)for(const language of languages){assert(labels(id,e.sourceHash,e.revision,level,language));const html=render(level,language);assert(html.includes('agri-native-fertilizer-'+e.kind));assert(html.includes(escape(e.locales[language].title)));assert(html.includes(escape(e.sourceJapanese.title)));renders++;}
 const reject=()=>{assert.equal(labels(id,e.sourceHash,e.revision,'1','vi'),null);const html=render();assert(!html.includes('agri-fertilizer-localized-title'));assert(html.includes(escape(e.sourceJapanese.title)));for(const pid of e.paragraphIds)assert(html.includes(escape(e.sourceJapanese.paragraphs[pid])));negative++;};
 const t=e.locales.vi;
 for(const [key,bad] of [['title',undefined],['title',null],['title',17],['title',''],['alt',undefined],['alt',{}],['paragraphTitles',undefined],['paragraphTitles',null],['paragraphs',undefined],['paragraphs',null]]){const old=t[key];t[key]=bad;reject();t[key]=old;}
 for(const map of ['paragraphTitles','paragraphs']){const pid=e.paragraphIds[0],old=t[map][pid];for(const bad of [undefined,null,42,'']){t[map][pid]=bad;reject();}t[map][pid]=old;}
 const old=e.locales.vi;delete e.locales.vi;reject();e.locales.vi=old;
 assert(!render('1','vi',false).includes('agri-fertilizer-localized-title'));negative++;
}
console.log(`PASS fertilizer-native-fallback: ${renders} current production renders across4existing blocks/2levels/12locales; ${negative} missing/malformed/hidden target cases retain exact valid Japanese without throwing. Existing source snapshots/quantitative geometry untouched.`);
const ts=require('typescript'),os=require('node:os'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'agri-fertilizer-fallback-types-'));
try{const stubs=path.join(tmp,'rn.d.ts');fs.writeFileSync(stubs,"declare module 'react-native' {export const Text:any;export const View:any;}\ndeclare namespace JSX {type Element=any;interface IntrinsicElements {[key:string]:any}}\n");const options={strict:true,noEmit:true,skipLibCheck:true,jsx:ts.JsxEmit.Preserve,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,resolveJsonModule:true,esModuleInterop:true,baseUrl:root,paths:{'@/*':['src/*']}};const diagnostics=ts.getPreEmitDiagnostics(ts.createProgram([filename,stubs],options));assert.equal(diagnostics.length,0,ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:f=>f,getCurrentDirectory:()=>root,getNewLine:()=>"\n"}));console.log('PASS fertilizer-native-fallback-types: actual existing production component plus all3actualJSONdependencies compile under strictTypeScript; minimalRNambient, notwholeapp.');}finally{fs.rmSync(tmp,{recursive:true,force:true});}
