// In-memory test visibility exports; production sources are never written by this helper.
// Native, decoration, storage, appearance and asset adapters are explicit below.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const root=path.resolve(__dirname,'../../../../..');
const depPaths=(process.env.NODE_PATH||'').split(path.delimiter).filter(Boolean);
const colors={text:'#111',muted:'#333',translationText:'#112',translation:'#eee',border:'#999',background:'#fff'};
async function componentHarness(){
 const stores=new Map();const failures={read:false,write:false};
 global.__mfg40Storage={getItem:async k=>{if(failures.read)throw Error('read QA');return stores.get(k)??null},setItem:async(k,v)=>{if(failures.write)throw Error('write QA');stores.set(k,v)}};
 const adapters={
  native:`import React from 'react';const host=n=>({children,...p})=>React.createElement(n,p,children);export const View=host('View'),Text=host('Text'),Image=host('Image'),Pressable=host('Pressable'),ScrollView=host('ScrollView');export const Modal=({visible,children,...p})=>visible?React.createElement('Modal',p,children):null;export const StyleSheet={create:x=>x};export const useWindowDimensions=()=>({width:390,height:844});export const Platform={OS:'web'};export const BackHandler={addEventListener:()=>({remove(){}})};export const AppState={addEventListener:()=>({remove(){}})};`,
  safe:'export const useSafeAreaInsets=()=>({top:0,left:0,right:0,bottom:0});',
  appearance:`import React from 'react';export const useStudyAppearance=()=>({colors:${JSON.stringify(colors)}});export const StudyAppearanceProvider=({children})=>children;export const ReadingAppearanceControl=()=>null;export const TranslationText=({children})=>React.createElement('TranslationText',null,children);`,
  header:`import React from 'react';export const TokuteiHeader=({title,onBack})=>React.createElement('Header',{title},React.createElement('Pressable',{accessibilityLabel:'QA_BACK',onPress:onBack},'Back'));export const TokuteiDayCard=({day,title,done,onPress,...p})=>React.createElement('Pressable',{...p,accessibilityLabel:'QA_DAY_'+day,onPress},title);`,
  backdrop:'export const useBackdropOcclusion=()=>{};',
  royal:`export const RoyalContentPanel=({children})=>children;export const RoyalExplanationPanel=RoyalContentPanel;export default RoyalContentPanel;`,
  storage:'export default globalThis.__mfg40Storage;',
 };
 const entry=`export{__qaReader,__qaAttempt,__qaLocaleContext}from'./src/components/manufacturing/ManufacturingCourse';export{__qaMockAttempt}from'./src/components/manufacturing/ManufacturingMocks';export*from'./src/services/manufacturing-study-state';export*from'./src/services/manufacturing-mock-state';export*from'./src/data/manufacturing/mocks';export*from'./src/data/manufacturing/translations';export*from'./src/data/manufacturing/implementation40';export*from'./src/data/manufacturing/daily40';export{manufacturingDailySupport}from'./src/data/manufacturing/daily-support';export{manufacturingLessonParagraph}from'./src/data/manufacturing/lesson-editorial';export{manufacturingSourceGuideTranslation}from'./src/data/manufacturing/source-guides';export{manufacturingCompletionLessonTranslation}from'./src/data/manufacturing/completion37';export{loadManufacturingCourse,manufacturingSpecialties}from'./src/data/manufacturing';export{manufacturingUi}from'./src/data/manufacturing/ui';export{manufacturingMockUi}from'./src/data/manufacturing/mock-ui';export{DailyManufacturingFigure}from'./src/components/manufacturing/DailyManufacturingFigure';export{manufacturingRecognitionChecks}from'./src/data/manufacturing/recognition38';export{manufacturingSupplementExams}from'./src/data/manufacturing/supplement-practice';`;
 const build=await require('esbuild').build({stdin:{contents:entry,resolveDir:root,loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',nodePaths:depPaths,external:['react','react/jsx-runtime'],logLevel:'silent',tsconfigRaw:{compilerOptions:{baseUrl:root,paths:{'@/*':['src/*']}}},plugins:[{name:'declared-component-harness-adapters',setup(b){
  b.onResolve({filter:/^react-native$/},()=>({path:'native',namespace:'qa'}));
  b.onResolve({filter:/^react-native-safe-area-context$/},()=>({path:'safe',namespace:'qa'}));
  b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'qa'}));
  b.onResolve({filter:/tokutei\/StudyAppearance$/},()=>({path:'appearance',namespace:'qa'}));
  b.onResolve({filter:/tokutei\/TokuteiChrome$/},()=>({path:'header',namespace:'qa'}));
  b.onResolve({filter:/RoyalPageBackground|RoyalPanels|RoyalSurface/},()=>({path:'royal',namespace:'qa'}));
  b.onResolve({filter:/AppBackdrop$/},()=>({path:'backdrop',namespace:'qa'}));
  b.onLoad({filter:/.*/,namespace:'qa'},a=>({contents:adapters[a.path],loader:'jsx',resolveDir:root}));
  b.onLoad({filter:/[\\/]ManufacturingCourse\.tsx$/},a=>({contents:fs.readFileSync(a.path,'utf8')+'\nexport{Reader as __qaReader,Attempt as __qaAttempt,LocaleContext as __qaLocaleContext};',loader:'tsx',resolveDir:path.dirname(a.path)}));
  b.onLoad({filter:/[\\/]ManufacturingMocks\.tsx$/},a=>({contents:fs.readFileSync(a.path,'utf8')+'\nexport{MockAttempt as __qaMockAttempt};',loader:'tsx',resolveDir:path.dirname(a.path)}));
  b.onResolve({filter:/\.(png|webp|jpg)$/},a=>({path:path.resolve(a.resolveDir,a.path),namespace:'asset'}));
  b.onLoad({filter:/.*/,namespace:'asset'},a=>({contents:'module.exports={uri:'+JSON.stringify(a.path)+'};',loader:'js'}));
 }}]});
 const file=path.join(root,'src/components/manufacturing/__qa40_memory_only.cjs');const m=new Module(file,module);m.filename=file;m.paths=[...Module._nodeModulePaths(path.dirname(file)),...depPaths];m._compile(build.outputFiles[0].text,file);
 return{api:m.exports,stores,failures,scope:'Actual private Reader/Attempt/MockAttempt exposed only in memory; React test renderer with RN primitives, storage, appearance, safearea, header, Royal/decorative-image adapters. Not browser layout/image loading or physical-device certification.'};
}
module.exports={root,componentHarness};
