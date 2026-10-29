const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),os=require('node:os');
const esbuild=require('esbuild');
const root=path.resolve(__dirname,'../..'),out=fs.mkdtempSync(path.join(os.tmpdir(),'food-ruby-render-'));
(async()=>{
const entry=`import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {FoodQuestionRuby} from './src/components/food-manufacturing/FoodQuestionRuby';import {foodManufacturingChecks} from './src/data/food-manufacturing';import {Attempt} from './src/components/food-manufacturing/FoodManufacturingCourse';import {freshTestAttempt} from './src/services/food-manufacturing-study-state';export {renderToStaticMarkup,React,FoodQuestionRuby,foodManufacturingChecks,Attempt,freshTestAttempt};`;
await esbuild.build({stdin:{contents:entry,resolveDir:root,loader:'tsx'},outfile:path.join(out,'entry.cjs'),bundle:true,platform:'node',format:'cjs',jsx:'automatic',nodePaths:(process.env.NODE_PATH||'').split(path.delimiter),define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'food-render-adapters',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^@react-native-async-storage\/async-storage$|^react-native-safe-area-context$/},a=>({path:a.path,namespace:'adapter'}));
 b.onResolve({filter:/^@\//},a=>{const name=a.path.slice(2);if(['components/ui/RoyalPageBackground','components/ui/AppBackdrop','components/ui/RoyalPanels','components/tokutei/TokuteiChrome','components/tokutei/StudyAppearance','components/world/JapaneseRuby'].includes(name))return {path:name,namespace:'adapter'};const file=path.join(root,'src',name);for(const ext of ['','.ts','.tsx','.json','/index.ts'])if(fs.existsSync(file+ext)&&fs.statSync(file+ext).isFile())return {path:file+ext};throw Error(file);});
 b.onLoad({filter:/.*/,namespace:'adapter'},a=>({loader:'tsx',resolveDir:root,contents:a.path.includes('async-storage')?`export default {getItem:async()=>null,setItem:async()=>{}};`:a.path.includes('safe-area')?`export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});`:a.path.includes('AppBackdrop')?`export const useBackdropOcclusion=()=>{};`:`import React from 'react';export default ({children,text})=><div>{children??text}</div>;export const RoyalContentPanel=({children})=><div>{children}</div>,RoyalExplanationPanel=RoyalContentPanel,TokuteiHeader=({title})=><h1>{title}</h1>,TokuteiDayCard=RoyalContentPanel,StudyAppearanceProvider=RoyalContentPanel,ReadingAppearanceControl=()=>null,TranslationText=({children})=><div>{children}</div>,useStudyAppearance=()=>({colors:{text:'#302c26',muted:'#586c7e',background:'#faf6ee',border:'#ccc',translation:'#ffe'}});`}));
 b.onLoad({filter:/FoodManufacturingCourse\.tsx$/},a=>{
  let source=fs.readFileSync(a.path,'utf8');const needle='useState<TestAttempt|null>(null)';assert(source.includes(needle));
  // Test-only initial-state injection. Conditional rendering and production JSX remain unchanged.
  source=source.replace(needle,'useState<TestAttempt|null>(globalThis.__foodTestAttempt??null)')+'\nexport {Attempt};\n';
  return {contents:source,loader:'tsx',resolveDir:path.dirname(a.path)};
 });
}}]});
const api=require(path.join(out,'entry.cjs'));let fields=0,attemptCases=0;
for(const level of ['1','2'])for(const exam of api.foodManufacturingChecks(level)){
 if(exam.kind!=='weekly')continue;
 for(let i=0;i<exam.questions.length;i++){
  const q=exam.questions[i],expected={stemJa:q.stemJa,...Object.fromEntries(q.optionsJa.map((s,i)=>[`optionsJa.${i}`,s])),explanationJa:q.explanationJa,...Object.fromEntries(q.optionReasonsJa.map((s,i)=>[`optionReasonsJa.${i}`,s]))};
  for(const [field,text] of Object.entries(expected)){
   const html=api.renderToStaticMarkup(api.React.createElement(api.FoodQuestionRuby,{question:q,field,text,color:'#222',readingColor:'#666'}));
   assert(html.includes(`data-testid="food-question-ruby-${q.id}-${field}"`));fields++;
  }
  for(const submitted of [false,true]){
   global.__foodTestAttempt={...api.freshTestAttempt(exam),currentQuestion:i,submitted};
   const html=api.renderToStaticMarkup(api.React.createElement(api.Attempt,{learner:'qa',level,exam,language:'ja',onBack:()=>{}}));
   assert(html.includes(`data-testid="food-question-ruby-${q.id}-stemJa"`));
   for(let k=0;k<4;k++)assert(html.includes(`data-testid="food-question-ruby-${q.id}-optionsJa.${k}"`));
   assert.equal(html.includes(`data-testid="food-question-ruby-${q.id}-explanationJa"`),submitted);
   for(let k=0;k<4;k++)assert.equal(html.includes(`data-testid="food-question-ruby-${q.id}-optionReasonsJa.${k}"`),submitted);
   attemptCases++;
  }
 }
}
assert.equal(fields,390);assert.equal(attemptCases,78);
console.log(JSON.stringify({status:'PASS',renderedFields:fields,submittedAndUnsubmittedCases:attemptCases,answerExplanationVisibility:true,scope:'React SSR of actual components with test-only initial attempt injection and explicit app adapters; no browser geometry or native/device claims'}));
})().catch(e=>{console.error(e);process.exitCode=1;});
