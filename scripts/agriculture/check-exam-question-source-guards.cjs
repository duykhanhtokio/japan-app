#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const figures=JSON.parse(read('src/data/agriculture/recognition-images.json'));
const illustrations=JSON.parse(read('src/data/agriculture/exam-illustrations.json'));
const lessons=JSON.parse(read('src/data/agriculture/lessons.ja.json'));
const exams=JSON.parse(read('src/data/agriculture/mock-exams.ja.json'));
const refs=exams.exams.flatMap(e=>e.questions.filter(q=>q.illustrationId).map(q=>({q,level:e.level})));
const localeData=JSON.parse(read('src/data/agriculture/recognition-image-locales.json'));
const actualPixels=new Map(['agr-f40-general-seeder','agr-f40-general-transplanter'].map(id=>{const f=figures.images.find(x=>x.id===id),bytes=fs.readFileSync(path.join(root,f.assetPath));assert.equal(require('node:crypto').createHash('sha256').update(bytes).digest('hex'),f.assetSha256);return [path.resolve(root,f.assetPath),{uri:'data:image/png;base64,'+bytes.toString('base64')}];}));
const cache=new Map();
function load(name){if(cache.has(name))return cache.get(name).exports;
 const filename=path.join(root,'src/components/agriculture',name+'.tsx');
 const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));cache.set(name,m);const original=m.require.bind(m);
 m.require=id=>id==='react-native'?require('react-native-web'):id==='@/data/agriculture/recognition-images.json'?figures:id==='@/data/agriculture/exam-illustrations.json'?illustrations:id==='@/data/agriculture/lessons.ja.json'?lessons:id==='./RecognitionImages'?load('RecognitionImages'):id==='@/data/agriculture/recognition-image-locales.json'?localeData:id==='./FlowerLegendFigure'?{}:id==='./ZoomableFigure'?load('ZoomableFigure'):/\.(png|webp)$/.test(id)?actualPixels.get(path.resolve(path.dirname(filename),id))||{uri:'asset://'+id}:original(id);m._compile(code,filename);return m.exports;
}
const {hasAgricultureExamIllustration:ready,AgricultureExamIllustration:Figure}=load('AgricultureExamIllustration');
const course=read('src/components/agriculture/AgricultureCourse.tsx');
const readyExpression=course.match(/const figureReady=([^;]+);/)[1];
const questionReady=new Function('q','level','hasAgricultureExamIllustration',`return ${readyExpression};`);
const disabledExpressions=[...course.matchAll(/disabled=\{([^{}]*!figureReady[^{}]*)\}/g)].map(x=>x[1]);
assert.equal(disabledExpressions.length,2,'actual answer and submit controls');
const disabled=disabledExpressions.map(e=>new Function('figureReady','attempt','saving','error',`return ${e}`));
const colors={text:'#172733',translation:'#fff8e9',translationText:'#172733',border:'#b99d62'};
const props=({q,level})=>({id:q.illustrationId,revision:q.illustrationRevision,level,questionSource:{lessonId:q.lessonId,lessonSourceHash:q.lessonSourceHash},colors});
const render=ref=>renderToStaticMarkup(React.createElement(Figure,props(ref)));
let compatible=0;for(const ref of refs){assert(questionReady(ref.q,ref.level,ready),ref.q.id);compatible++;}
const week2=refs.filter(r=>['agr-exam-a-20261031-figure-067','agr-exam-a-20261031-figure-069'].includes(r.q.illustrationId));assert.equal(week2.length,2);
let negative=0;
for(const ref of week2){
 const q=ref.q,item=illustrations.illustrations.find(i=>i.id===q.illustrationId),figure=figures.images.find(f=>f.id===item.figureId),lesson=lessons.lessons.find(l=>l.id===q.lessonId);
 assert(render(ref).includes(`data-testid="exam-figure-${q.illustrationId}"`));
 for(const fn of disabled)assert.equal(!!fn(questionReady(q,ref.level,ready),{submitted:false},false,null),false);
 const reject=()=>{const ok=questionReady(q,ref.level,ready);assert.equal(ok,false);assert(render(ref).includes('参考図を読み込めません。'));for(const fn of disabled)assert.equal(!!fn(ok,{submitted:false},false,null),true);negative++;};
 const mutate=(obj,key,bad)=>{const old=obj[key];obj[key]=bad;reject();obj[key]=old;};
 mutate(q,'lessonSourceHash','0'.repeat(64));mutate(q,'lessonSourceHash',undefined);mutate(q,'lessonId','missing-lesson');
 mutate(lesson,'sourceHash','1'.repeat(64));mutate(lesson,'levels',[]);
 mutate(figure.lessonSourceHashes,q.lessonId,'2'.repeat(64));mutate(figure.lessonSourceHashes,q.lessonId,undefined);
 mutate(figure,'lessonSourceHashes',undefined);mutate(figure,'lessonIds',undefined);mutate(figure,'lessonIds',['missing-source-lesson']);mutate(figure,'scopeLevels',[]);mutate(figure,'assetKey','missing-asset-key');
 mutate(item,'sourceAssetSha256','3'.repeat(64));mutate(item,'figureId','missing-figure');mutate(item,'scopeLevels',[]);
 mutate(q,'illustrationRevision','stale-revision');
 assert.equal(ready(q.illustrationId,q.illustrationRevision,ref.level,undefined),false);negative++;
}
assert.equal(questionReady(null,'1',ready),true,'text-only questions unchanged');
console.log(`PASS exam-question-source-guards: ${compatible} existing actual quiz references compatible (mechanical only); ${week2.length} week02 actual render/answer/submission paths; ${negative} stale/missing/mismatched question/lesson/figure/revision/course rejects.`);
const ts=require('typescript'),os=require('node:os');
const inventory=['src/components/agriculture','src/components/tokutei'].flatMap(dir=>fs.readdirSync(path.join(root,dir)).filter(n=>n.endsWith('.tsx')).map(n=>path.join(dir,n)));
const calls=inventory.flatMap(p=>[...read(p).matchAll(/<AgricultureExamIllustration\b[^>]*\/>/g)].map(m=>({path:p,jsx:m[0]})));
assert.equal(calls.length,1);assert.equal(calls[0].path,'src/components/agriculture/AgricultureCourse.tsx');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'agri-exam-types-'));
try{
 const stubs=path.join(temp,'runtime-stubs.d.ts');fs.writeFileSync(stubs,`declare function require(path:string):any;
declare module 'react' {export const Fragment:any;export function useState<T>(initial:T):[T,(next:T|((before:T)=>T))=>void];}
declare module 'react-native' {export const Text:any;export const View:any;export const Image:any;export const Pressable:any;export const ScrollView:any;export const StyleSheet:{create<T>(styles:T):T;absoluteFill:any};export type ImageSourcePropType=any;export type LayoutChangeEvent={nativeEvent:{layout:{width:number;height:number;x:number;y:number}}};export function useWindowDimensions():{width:number;height:number};}
declare namespace JSX {type Element=any;interface IntrinsicElements {[key:string]:any}}
`);
 const actual=path.join(root,'src/components/agriculture/AgricultureExamIllustration');
 const fixture=path.join(temp,'actual-caller.tsx');
 fs.writeFileSync(fixture,`import {AgricultureExamIllustration,hasAgricultureExamIllustration} from ${JSON.stringify(actual)};\ntype Q=(typeof import(${JSON.stringify(path.join(root,'src/data/agriculture/weekly-checks.ja.json'))}))['exams'][number]['questions'][number]&{illustrationId:string;illustrationRevision?:string};\ndeclare const q:Q;declare const level:string;declare const colors:{text:string;translation:string;translationText:string;border:string};\nconst ready=${readyExpression};\nconst image=${calls[0].jsx};\n`);
 const options={strict:true,noEmit:true,skipLibCheck:true,jsx:ts.JsxEmit.Preserve,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,resolveJsonModule:true,esModuleInterop:true,baseUrl:root,paths:{'@/*':['src/*']}};
 const diagnostics=ts.getPreEmitDiagnostics(ts.createProgram([fixture,stubs],options));assert.equal(diagnostics.length,0,ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:f=>f,getCurrentDirectory:()=>root,getNewLine:()=>"\n"}));
 fs.appendFileSync(fixture,`\nhasAgricultureExamIllustration(q.illustrationId,q.illustrationRevision,level);\nconst omitted=<AgricultureExamIllustration id={q.illustrationId} level={level} colors={colors}/>;\n`);
 const invalid=ts.getPreEmitDiagnostics(ts.createProgram([fixture,stubs],options)).filter(d=>d.file?.fileName===fixture);assert.equal(invalid.length,2,'both missing-source API usages must fail strict types');
 console.log(`PASS exam-source-callsite-types: ${inventory.length} actual sector/shared component files audited; only caller passes actual question context to readiness and renderer; strict actual component + actual caller expressions + canonical weekly question type;2 missing-context fixtures rejected.`);
}finally{fs.rmSync(temp,{recursive:true,force:true});}
