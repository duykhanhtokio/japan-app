#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),json=p=>JSON.parse(fs.existsSync(path.join(root,p))?fs.readFileSync(path.join(root,p),'utf8'):require('node:child_process').execFileSync('git',['show','HEAD:'+p],{cwd:root}).toString());
const lessons=json('src/data/agriculture/lessons.ja.json'),support=json('src/data/agriculture/daily-learning-support.json'),data=json('src/data/agriculture/grape-cluster-stage-comparison.json'),cache=new Map();
function load(name){return loadFile('src/components/agriculture/'+name+'.tsx');}
function loadFile(rel){if(cache.has(rel))return cache.get(rel).exports;if(!fs.existsSync(path.join(root,rel))&&rel.endsWith('.tsx')&&fs.existsSync(path.join(root,rel.slice(0,-4)+'.ts')))rel=rel.slice(0,-4)+'.ts';const filename=path.join(root,rel),m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(rel,m);const original=m.require.bind(m);m.require=id=>{
 if(id==='react-native')return require('react-native-web');
 if(id==='@/data/agriculture/lessons.ja.json')return lessons;
 if(id==='@/data/agriculture/daily-learning-support.json')return support;
 if(id==='@/data/agriculture/grape-cluster-stage-comparison.json')return data;
 if(id==='@/data/agriculture')return {agricultureLesson:(id,level)=>lessons.lessons.find(l=>l.id===id&&l.levels.includes(level)),agricultureTranslation:()=>null};
 if(id==='@/components/tokutei/StudyAppearance')return {TranslationText:p=>React.createElement('div',null,p.children)};
 if(id.startsWith('@/data/agriculture/')){const p=id.replace('@/','src/');return p.endsWith('.json')?json(p):loadFile(p.endsWith('.ts')?p:p+'.ts');}
 if(id.startsWith('./')||id.startsWith('../')){const p=path.posix.normalize(path.posix.join(path.posix.dirname(rel),id));if(p.endsWith('.json'))return json(p);if(/\.(png|webp)$/.test(p))return {uri:'fixture://'+p};return loadFile(/\.(tsx?|cjs)$/.test(p)?p:p+'.tsx');}
 return original(id);
 };const text=fs.existsSync(filename)?fs.readFileSync(filename,'utf8'):require('node:child_process').execFileSync('git',['show','HEAD:'+rel],{cwd:root}).toString();const code=rel.endsWith('.cjs')?text:transformSync(text,{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;m._compile(code,filename);return m.exports;}
const {DailyLearningFigure}=load('DailyLearningSupport'),{GrapeClusterStageComparison}=load('GrapeClusterStageComparison'),l=lessons.lessons.find(l=>l.id===data.lessonId),colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
const daily=(lesson,language='ja',extra={})=>renderToStaticMarkup(React.createElement(DailyLearningFigure,{lesson,level:'2',language,showTranslation:language!=='ja',includeExisting:true,colors,...extra}));
let renders=0,guards=0;
for(const language of Object.keys(data.locales)){
 const html=daily(l,language);for(const id of ['agri-grape-cluster-before-flowering','agri-grape-cluster-after-fruit-set','agri-grape-cluster-shared-condition'])assert(html.includes(id));
 for(const label of data.labels.ja)assert(html.includes(label));
 if(language!=='ja')for(let i=0;i<8;i++)assert(html.includes('agri-grape-cluster-label-'+i));
 assert(!html.includes('液への浸漬')); renders++;
 assert.equal(daily(l,language,{paragraphIds:[l.paragraphs[0].id]}),'');guards++;
}
for(const override of [{sourceHash:'stale'},{revision:'stale'}]){assert.equal(daily({...l,...override}),'');guards++;}
const condition=data.labels.ja[2];data.labels.ja[2]='果粒を全て除く';assert.equal(daily(l),'');data.labels.ja[2]=condition;guards++;
const original=l.paragraphs[0].textJa;l.paragraphs[0].textJa+='changed';assert.equal(daily(l),'');l.paragraphs[0].textJa=original;guards++;
assert.equal(daily(l,'vi',{level:'1'}),'');guards++;
assert(!support.figureBindings[l.id]);
const figure=json('src/data/agriculture/recognition-images.json').images.find(f=>f.id==='agr-f40-flower-cluster-dip-v1');assert(figure.lessonIds.length);assert.equal(support.figureBindings['agr-f40-flower-gibberellin-source-scope'].figureId,figure.id);
console.log(`PASS grape cluster source comparison: ${renders} actual daily locale renders,8JA/kana+12locales,${guards} canonical/source/revision/level/partial guards; correct dip primary/source-scope retained.`);

if(process.env.AGR_GRAPE_STAGE_PREVIEW){const css=require('react-native-web').StyleSheet.getSheet().textContent;fs.writeFileSync(process.env.AGR_GRAPE_STAGE_PREVIEW,'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'body{margin:0;background:#fff8e9}main{max-width:720px;margin:auto;padding:12px}</style><main>'+daily(l,'vi')+'</main>');}
