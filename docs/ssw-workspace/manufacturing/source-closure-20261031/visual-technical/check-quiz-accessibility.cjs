// Actual SupplementalFigure component execution, DOM SSR with declared native adapters.
// NODE_PATH must resolve react/react-dom/esbuild. Does not mutate production source.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),Module=require('node:module');
const root=path.resolve(__dirname,'../../../../..');
(async()=>{
 const output=await require('esbuild').build({entryPoints:[path.join(root,'src/components/manufacturing/SupplementalManufacturingDiagrams.tsx')],bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime'],tsconfigRaw:{compilerOptions:{baseUrl:root,paths:{'@/*':['src/*']}}},plugins:[{name:'declared-isolated-native-adapters',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:'native',namespace:'qa'}));
 b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'qa'}));
 b.onResolve({filter:/tokutei\/StudyAppearance$/},()=>({path:'appearance',namespace:'qa'}));
 b.onResolve({filter:/manufacturing\/ui$/},()=>({path:'ui',namespace:'qa'}));
 b.onResolve({filter:/manufacturing\/supplemental-diagrams$/},()=>({path:'data',namespace:'qa'}));
 b.onResolve({filter:/\.png$/},a=>({path:a.path,namespace:'image'}));
 b.onLoad({filter:/.*/,namespace:'image'},a=>({contents:`module.exports={uri:${JSON.stringify(a.path)}};`,loader:'js'}));
 b.onLoad({filter:/.*/,namespace:'qa'},a=>({contents:a.path==='native'?`import React from 'react';export const View=({children})=>React.createElement('div',null,children);export const Text=({children})=>React.createElement('span',null,children);export const Image=({accessibilityLabel})=>React.createElement('img',{alt:accessibilityLabel});export const Pressable=({children,accessibilityLabel})=>React.createElement('button',{'aria-label':accessibilityLabel},children);export const Modal=({children,visible})=>visible?React.createElement('div',null,children):null;export const ScrollView=View;export const useWindowDimensions=()=>({width:390,height:844});`:a.path==='safe'?'export const useSafeAreaInsets=()=>({top:0,left:0,right:0,bottom:0});':a.path==='appearance'?'export const useStudyAppearance=()=>({colors:{text:"#111",muted:"#333",translationText:"#111",translation:"#eee",border:"#aaa",background:"#fff"}});':a.path==='ui'?'export const manufacturingUi=(_l,key)=>key;':'export const manufacturingSupplementalCaption=()=>null;export const manufacturingSupplementalDiagrams=()=>[];',loader:'js'}));
 }}]});
 const filename=path.join(root,'src/components/manufacturing/__owned-visual-audit.cjs');const m=new Module(filename,module);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));m._compile(output.outputFiles[0].text,filename);
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
 const marker='PRIVATE_ANSWER_EXPLANATION_SENTINEL';
 const item={id:'isolated-quiz',lessonId:'lesson',lessonSourceHash:'frozen',assetFile:'image.png',width:1400,height:1000,captionJa:marker+'。続く解説。',scopeLimits:[]};
 const quiz=renderToStaticMarkup(React.createElement(m.exports.SupplementalFigure,{item,language:'ja',showTranslation:false,imageSource:{uri:'qa.png'},hideCaption:true}));
 const teaching=renderToStaticMarkup(React.createElement(m.exports.SupplementalFigure,{item,language:'ja',showTranslation:false,imageSource:{uri:'qa.png'},hideCaption:false}));
 const result={component:'actual SupplementalFigure',renderScope:'DOM SSR with explicit RN/safearea/appearance/data/image adapters; not browser layout/image loading/device',quizContainsTeachingCaption:quiz.includes(marker),quizImageAltContainsTeachingCaption:/alt="[^"]*PRIVATE_ANSWER/.test(quiz),quizButtonAriaLabelContainsTeachingCaption:/aria-label="[^"]*PRIVATE_ANSWER/.test(quiz),teachingCaptionPreserved:teaching.includes(marker),quizHtml:quiz};
 console.log(JSON.stringify(result));
 assert.equal(result.quizContainsTeachingCaption,false,'hidden quiz teaching caption leaks through accessibility attributes');assert.equal(result.teachingCaptionPreserved,true);
})().catch(e=>{console.error(e.message);process.exitCode=1});
