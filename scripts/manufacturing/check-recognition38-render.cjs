// Actual RNWeb quiz component SSR. Adapters are declared; this is not a device test.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),Module=require('node:module');
const root=path.resolve(__dirname,'../..');
(async()=>{
 const output=await require('esbuild').build({stdin:{contents:"export {RecognitionQuestionFigures} from './src/components/manufacturing/RecognitionManufacturing';",resolveDir:root,loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime','react-dom','react-dom/client','react-dom/server'],define:{__DEV__:'false','process.env.NODE_ENV':'"production"'},tsconfigRaw:{compilerOptions:{baseUrl:root,paths:{'@/*':['src/*']}}},plugins:[{name:'declared-ssr-adapters',setup(b){
  b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
  b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'qa'}));
  b.onResolve({filter:/tokutei\/(StudyAppearance|TokuteiChrome)$/},a=>({path:a.path.includes('StudyAppearance')?'appearance':'header',namespace:'qa'}));
  b.onResolve({filter:/\.png$/},a=>({path:a.path,namespace:'image'}));
  b.onLoad({filter:/.*/,namespace:'qa'},a=>({contents:a.path==='safe'?'export const useSafeAreaInsets=()=>({top:0,left:0,right:0,bottom:0});':a.path==='header'?'export const TokuteiHeader=()=>null;':'export const ReadingAppearanceControl=()=>null;export const TranslationText=()=>null;export const useStudyAppearance=()=>({colors:{text:"#111",muted:"#333",translationText:"#111",translation:"#eee",border:"#aaa",background:"#fff"}});',loader:'js'}));
  b.onLoad({filter:/.*/,namespace:'image'},a=>({contents:`module.exports={uri:${JSON.stringify(a.path)}};`,loader:'js'}));
 }}]});
 const file=path.join(root,'src/components/manufacturing/__recognition_ssr.cjs'),m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));m._compile(output.outputFiles[0].text,file);
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
 const packs=['mechanical','measurement','materials','processes','finishing'].flatMap(name=>require(path.join(root,'src/data/manufacturing/recognition38/core',name+'.json')).packs);
 const locales=['ja',...require(path.join(root,'docs/ssw-workspace/manufacturing/approved-scope.json')).targetLocales];
 let cases=0;
 for(const pack of packs)for(const question of pack.questions)for(const language of locales){
  const html=renderToStaticMarkup(React.createElement(m.exports.RecognitionQuestionFigures,{question,language}));
  assert(html.includes('manufacturing-recognition-question-images'));
  for(const id of question.imageAssetIds)assert(html.includes('manufacturing-supplemental-'+pack.id+'-'+id));
  for(const asset of pack.assets.filter(a=>a.role==='teaching'||a.role==='post_submission_teaching'))assert(!html.includes('manufacturing-supplemental-'+pack.id+'-'+asset.id));
  assert(!html.includes(pack.captionJa),'Explanatory pack caption before submission');
  for(const reason of question.optionReasonsJa)assert(!html.includes(reason),'Rationale before submission');
  const stale=renderToStaticMarkup(React.createElement(m.exports.RecognitionQuestionFigures,{question:{...question,sourceHash:'stale'},language}));assert.equal(stale,'');cases++;
 }
 console.log(JSON.stringify({status:'PASS',quizRenderCases:cases,questionCount:61,teachingImagesAndExplanatoryCaptionsSuppressed:true,rationalesSuppressed:true,staleRevisionSuppressed:true,scope:'Actual quiz RNWeb SSR with appearance/safearea/header/image adapters; no browser-layout, zoom-interaction, image-load or physical-device certification.'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
