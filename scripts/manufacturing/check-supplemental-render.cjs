// Actual supplemental component SSR, with explicit appearance/safe-area/image adapters.
// This verifies render bindings, not browser layout, image loading or native devices.
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),Module=require('node:module');
const root=path.resolve(__dirname,'../..');
(async()=>{
 const build=await require('esbuild').build({stdin:{contents:"export {SupplementalManufacturingDiagrams} from './src/components/manufacturing/SupplementalManufacturingDiagrams';export {BooleanPracticeJapanese,BooleanPracticeOption} from './src/components/manufacturing/BooleanPracticeJapanese';export {CompletionManufacturingDiagrams} from './src/components/manufacturing/CompletionManufacturingDiagrams';",resolveDir:root,loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime','react-dom','react-dom/client','react-dom/server'],define:{__DEV__:'false','process.env.NODE_ENV':'"production"'},tsconfigRaw:{compilerOptions:{baseUrl:root,paths:{'@/*':['src/*']}}},plugins:[{name:'declared-ssr-adapters',setup(b){
  b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
  b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'qa'}));
  b.onResolve({filter:/tokutei\/StudyAppearance$/},()=>({path:'appearance',namespace:'qa'}));
  b.onResolve({filter:/\.png$/},a=>({path:a.path,namespace:'image'}));
  b.onLoad({filter:/.*/,namespace:'qa'},a=>({contents:a.path==='safe'?'export const useSafeAreaInsets=()=>({top:0,left:0,right:0,bottom:0});':'import {createElement} from "react";import {Text} from "react-native";export const TranslationText=({children})=>createElement(Text,null,children);export const useStudyAppearance=()=>({colors:{text:"#111",muted:"#333",translationText:"#111",translation:"#eee",border:"#aaa",background:"#fff"}});',loader:'js'}));
  b.onLoad({filter:/.*/,namespace:'image'},a=>({contents:`export default {uri:${JSON.stringify(a.path)}};`,loader:'js'}));
 }}]});
 const file=path.join(root,'src/components/manufacturing/__supplemental_ssr_check.cjs'),m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));m._compile(build.outputFiles[0].text,file);
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
 const data=require(path.join(root,'src/data/manufacturing/supplemental-diagrams.json')),targets=require(path.join(root,'src/data/manufacturing/supplemental-diagram-translations.json')).locales;
 const lessons=['mechanical','electrical','surface'].flatMap(s=>require(path.join(root,`src/data/manufacturing/${s}.json`)).lessons);
 const render=(lesson,locale,show)=>renderToStaticMarkup(React.createElement(m.exports.SupplementalManufacturingDiagrams,{lesson,language:locale,showTranslation:show}));
 const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
 let cases=0;
 for(const id of new Set(data.items.map(x=>x.lessonId))){const lesson=lessons.find(x=>x.id===id),items=data.items.filter(x=>x.lessonId===id);
  for(const locale of ['ja',...Object.keys(targets)])for(const show of [false,true]){const html=render(lesson,locale,show);
   for(const item of items){assert(html.includes(escape(item.captionJa)));assert(html.includes('manufacturing-supplemental-'+item.id));
    if(locale!=='ja')assert.equal(html.includes(escape(targets[locale][item.id].text)),show);
   }cases++;
  }
  assert.equal(render({...lesson,sourceHash:'stale'},'vi',true),'');
 }
 assert.equal(render({...lessons[0],id:'unknown'},'en',true),'');
 let practiceCases=0;const practice=require(path.join(root,'src/data/manufacturing/boolean-practice.json'));
 for(const q of practice.questions){const stem=renderToStaticMarkup(React.createElement(m.exports.BooleanPracticeJapanese,{question:q,field:'stem'}));assert(stem.includes(escape(q.stemJa)),'Accessible stem text');
  for(const [locale,entries] of Object.entries(practice.locales))for(let index=0;index<4;index++){const html=renderToStaticMarkup(React.createElement(m.exports.BooleanPracticeOption,{question:q,index,translation:entries[q.id].options[index],selected:index===q.correctIndex,disabled:false,onPress:()=>{}}));assert(html.includes(escape(entries[q.id].options[index])));assert(html.includes(escape(q.optionsJa[index])));practiceCases++;}
 }
 const completionRegistry=require(path.join(root,'src/data/manufacturing/completion37/diagrams.json'));
 const completionLessons=['mechanical','electrical','surface'].flatMap(s=>require(path.join(root,'src/data/manufacturing/completion37/'+s+'.json')).lessons);
 let completionDiagramCases=0;
 for(const id of new Set(completionRegistry.items.map(i=>i.lessonId))){const lesson=completionLessons.find(l=>l.id===id);assert(lesson);const items=completionRegistry.items.filter(i=>i.lessonId===id);
  for(const locale of ['ja',...Object.keys(targets)])for(const show of [false,true]){const html=renderToStaticMarkup(React.createElement(m.exports.CompletionManufacturingDiagrams,{lesson,language:locale,showTranslation:show}));
   for(const item of items){assert.equal(item.lessonSourceHash,lesson.sourceHash);assert.equal(item.captionJa,lesson.summaryJa);const png=fs.readFileSync(path.join(root,'assets/manufacturing/diagrams',item.assetFile));assert.equal(png.readUInt32BE(16),item.width);assert.equal(png.readUInt32BE(20),item.height);assert(html.includes(escape(item.captionJa)));assert(html.includes('manufacturing-supplemental-'+item.id));}
   if(locale!=='ja'){const entry=require(path.join(root,'src/data/manufacturing/completion37/translations/'+locale+'.json')).lessons[id];assert.equal(html.includes(escape(entry.summary)),show);}
   completionDiagramCases++;
  }
  assert.equal(renderToStaticMarkup(React.createElement(m.exports.CompletionManufacturingDiagrams,{lesson:{...lesson,sourceHash:'stale'},language:'vi',showTranslation:true})), '');
 }
 console.log(JSON.stringify({status:'PASS',renderCases:cases,practiceOptionCases:practiceCases,completionDiagramCases,translationVisibility:true,staleRevisionSuppressed:true,scope:'Actual supplemental ReactNativeWeb component SSR; appearance/safearea/image adapters explicit. Not browser layout, image-load, zoom interaction or native certification.'}));
})().catch(e=>{console.error(e);process.exitCode=1;});
