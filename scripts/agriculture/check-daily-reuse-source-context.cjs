'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),Module=require('node:module'),assert=require('node:assert/strict'),{transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),jc=new Map(),cache=new Map();
function read(p){const f=path.join(root,p);return fs.existsSync(f)?fs.readFileSync(f,'utf8'):cp.execFileSync('git',['show','HEAD:'+p],{cwd:root}).toString();}
function json(p){if(!jc.has(p))jc.set(p,JSON.parse(read(p)));return jc.get(p);}
const lessonData=json('src/data/agriculture/lessons.ja.json'),lessons=lessonData.lessons,support=json('src/data/agriculture/daily-learning-support.json'),figures=json('src/data/agriculture/recognition-images.json'),readings=json('src/data/agriculture/image-readings.json');
function load(name){if(cache.has(name))return cache.get(name).exports;let rel='src/components/agriculture/'+name+'.tsx';if(!fs.existsSync(path.join(root,rel))&&fs.existsSync(path.join(root,'src/components/agriculture/'+name+'.ts')))rel='src/components/agriculture/'+name+'.ts';const filename=path.join(root,rel);let source=read(rel);
 const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(name,m);const original=m.require.bind(m);
 m.require=id=>{
  if(id==='react-native')return require('react-native-web');
  if(id==='@/data/agriculture')return {agricultureLesson:(id,level)=>lessons.find(l=>l.id===id&&l.levels.includes(level)),agricultureTranslation:()=>null};
  if(id.startsWith('@/data/agriculture/')&&id.endsWith('.json'))return json(id.replace('@/','src/'));
  if(id==='@/data/agriculture/translations')return load('../../data/agriculture/translations');
  if(id.startsWith('./')&&id.endsWith('.json'))return json(path.relative(root,path.resolve(path.dirname(filename),id)));
  if(/\.(png|webp)$/.test(id))return {uri:'fixture://'+id};
  if(id.startsWith('./')){const n=id.slice(2);return ['DailyLearningSupport','AgricultureImageRuby','AgricultureNativeFigureRuby','CropCalendarFigure','RecognitionImages','ZoomableFigure','FigureSourceMarks','DilutionExampleFigure','SprayerPartSupport','FertilizerNativeFigure','NativeProcessDiagram','FoodFlowerClassificationSupport','FoodDailyObjectiveGapSupport'].includes(n)?load(n):{};}
  if(id==='@/components/tokutei/StudyAppearance')return{};
  return original(id);
 };
 m._compile(transformSync(source,{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code,filename);return m.exports;
}
const {DailyLearningFigure}=load('DailyLearningSupport'),colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'},langs=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','km','th','tl'];
const get=id=>lessons.find(l=>l.id===id),render=(lesson,level,props={})=>renderToStaticMarkup(React.createElement(DailyLearningFigure,{lesson,level,colors,includeExisting:true,language:'ja',showTranslation:false,...props}));let positives=0,guards=0;
for(const id of ['agr-par12-management-power-fuel-information','agr-water-decision']){const l=get(id),b=support.figureBindings[id],f=figures.images.find(f=>f.id===b.figureId);assert(!f.lessonIds.includes(id),'fixture must exercise actual alias');for(const level of l.levels.filter(level=>b.scopeLevels.includes(level))){for(const language of langs){const html=render(l,level,{language,showTranslation:language!=='ja'});for(const field of ['observation','limit'])assert(html.includes(`agri-image-ruby-${f.id}-${field}`),id+'/'+language+'/'+field);positives++;}const p=l.paragraphs.find(p=>p.knowledgeIds.includes(b.keyObjectiveId));assert(p);assert(render(l,level,{paragraphIds:[p.id]}).includes(`agri-image-ruby-${f.id}-observation`));positives++;const other=l.paragraphs.find(q=>q.id!==p.id);assert.equal(render(l,level,{paragraphIds:[other.id]}),'');guards++;for(const bad of [{sourceHash:'stale'},{revision:'stale'}]){assert.equal(render({...l,...bad},level),'');guards++;}const e=readings.entries[f.id],old=e.assetSha256;e.assetSha256='stale';assert(!render(l,level).includes(`agri-image-ruby-${f.id}-observation`));e.assetSha256=old;guards++;}}
const id='agr-workterms-cropping-labels',l=get(id),b=support.figureBindings[id];for(const level of l.levels.filter(level=>b.scopeLevels.includes(level))){for(const language of langs){assert(render(l,level,{language,showTranslation:language!=='ja'}).includes('agri-native-crop-calendar'));positives++;}for(const bad of [{sourceHash:'stale'},{revision:'stale'}]){assert.equal(render({...l,...bad},level),'');guards++;}}

for(const id of Object.keys(json('src/data/agriculture/crop-calendar-native.json').lessonBindings)){const l=get(id);for(const level of l.levels){for(const language of langs){assert(render(l,level,{language,showTranslation:language!=='ja'}).includes('agri-native-crop-calendar'));positives++;}}}
console.log(`PASS daily actual source-context route PRODUCTION: ${positives} alias/kana/native/paragraph positive renders; ${guards} target/source/asset/paragraph guards. Actual components/data; asset leaf URI fixture only, no pixel/browser acceptance.`);
