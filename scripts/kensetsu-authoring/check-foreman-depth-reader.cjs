// Actual lesson reader with host adapters; not Expo/native/pixel acceptance.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),modules=process.env.TOKUTEI_QA_MODULES||root;
const dep=name=>require(require.resolve(name,{paths:[modules]}));
const React=dep('react'),{create,act}=dep('react-test-renderer'),esbuild=dep('esbuild');
global.IS_REACT_ACT_ENVIRONMENT=true;global.__tokuteiStorage=new Map();
const mocks={
 'react-native':`import React,{forwardRef,useImperativeHandle} from 'react';export const Text='Text',View='View',Pressable='Pressable',Image='Image';export const Modal=()=>null;export const ScrollView=forwardRef((p,r)=>{useImperativeHandle(r,()=>({scrollTo(){}}));return React.createElement('ScrollView',p,p.children)});export const StyleSheet={create:x=>x,absoluteFill:{},absoluteFillObject:{},flatten:x=>Object.assign({},...[x].flat(Infinity).filter(Boolean))};export const useWindowDimensions=()=>({width:430,height:932,fontScale:1});export const AppState={currentState:'active',addEventListener:()=>({remove(){}})};`,
 '@react-native-async-storage/async-storage':`export default {getItem:async k=>globalThis.__tokuteiStorage.get(k)??null,setItem:async(k,v)=>globalThis.__tokuteiStorage.set(k,v)};`,
 'react-native-safe-area-context':`export const useSafeAreaInsets=()=>({top:0,bottom:0,left:0,right:0});`,
 '@/components/ui/AppBackdrop':`export const useBackdropOcclusion=()=>{};`,
 '@/components/ui/RoyalSurface':`import React from 'react';export const ROYAL_FONT={body:'System',heading:'System'},ROYAL_LAYOUT={screenGutter:12};export const RoyalBackButton=()=>null;`,
 '@/components/ui/RoyalPanels':`import React from 'react';export const RoyalContentPanel=({children,style})=>React.createElement('View',{style},children);export const RoyalExplanationPanel=RoyalContentPanel;`,
 '@/components/ui/RoyalPageBackground':`import React from 'react';export default({children})=>React.createElement('View',{},children);`,
 '@/data/kensetsu':`export {foremanIllustrations as illustrations,foremanIllustrationAspectRatios as illustrationAspectRatios} from ${JSON.stringify(path.join(root,'src/data/kensetsu/foreman-illustrations'))};export const fields=[];export const completionId=s=>s.id,completionKey=()=>'',restoreProgress=()=>({});`,
 '@/data/kensetsu/scope':`export const subjectLabels={};export const weeksForScope=()=>[],sessionsForScope=()=>[],sessionForScope=()=>undefined,studyDayForScope=()=>undefined,studyDayIdForSession=id=>id,studyDayCompletionIds=()=>[];`,
 './KensetsuReviewTests':`export const KensetsuReviewTests=()=>null;`,
};
const resolve=p=>{for(const suffix of ['.ts','.tsx','.json','/index.ts'])if(fs.existsSync(p+suffix))return p+suffix;throw Error(p);};
const plugin={name:'foreman-reader-host',setup(build){
 build.onResolve({filter:/.*/},a=>{if(mocks[a.path])return{path:a.path,namespace:'host'};if(a.path==='react'||a.path.startsWith('react/'))return{path:a.path,external:true};if(a.path.startsWith('@/'))return{path:resolve(path.join(root,'src',a.path.slice(2)))};});
 build.onLoad({filter:/.*/,namespace:'host'},a=>({contents:mocks[a.path],loader:'tsx',resolveDir:root}));
 build.onResolve({filter:/\.(webp|png|jpe?g)$/},a=>({path:a.path,namespace:'art'}));build.onLoad({filter:/.*/,namespace:'art'},()=>({contents:'export default 1;',loader:'js'}));
}};
const text=n=>typeof n==='string'?n:Array.isArray(n)?n.map(text).join(''):n&&typeof n==='object'?text(n.children):'';
const find=(t,id)=>{const n=t.root.findAll(x=>typeof x.type==='string'&&x.props.testID===id);assert.equal(n.length,1,id);return n[0];};
(async()=>{
 const entries=['src/components/kensetsu/KensetsuCourse','src/data/kensetsu/foreman','src/components/tokutei/StudyAppearance','src/data/kensetsu/localization'];
 const result=await esbuild.build({stdin:{contents:entries.map(p=>`export * from ${JSON.stringify(path.join(root,p))};`).join('\n'),resolveDir:root},bundle:true,write:false,format:'cjs',platform:'node',jsx:'automatic',plugins:[plugin],logLevel:'error'});
 const box={exports:{}};new Function('module','exports','require',result.outputFiles[0].text)(box,box.exports,dep);const m=box.exports;
 const numbers=(process.env.FOREMAN_DEPTH_SESSIONS||'12').split(',').map(Number),locales=['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let cases=0;
 for(const number of numbers){const id=`kensetsu-foreman-session-${String(number).padStart(3,'0')}`,s=m.foremanSessions.find(s=>s.id===id);assert(s);const a=s.clusters.find(c=>c.learningActivity)?.learningActivity;assert(a&&a.graded===false);
  for(const locale of locales)for(const mode of ['day','night']){
   global.__tokuteiStorage.set('@japan_app_tokutei_reading_appearance_v1',mode);let t,completed=0;
   await act(async()=>{t=create(React.createElement(m.StudyAppearanceProvider,null,React.createElement(m.KensetsuDayReader,{session:s,done:false,ready:true,saving:false,language:locale,onComplete(){completed++;}})));await new Promise(setImmediate);});
   assert.equal(text(find(t,`kensetsu-source-${id}:learningActivity`).children),a.ja);
   if([17,18,19].includes(number)){assert.equal(t.root.findAll(x=>typeof x.type==='string'&&x.props.testID==='kensetsu-study-image').length,1,'New illustration must mount through actual registry');}
   assert.equal(t.root.findAll(n=>typeof n.type==='string'&&n.props.testID===`kensetsu-localized-${id}:learningActivity`).length,0);
   assert.equal(find(t,'kensetsu-complete').props.disabled,true);assert.equal(completed,0);
   await act(async()=>find(t,'kensetsu-translation').props.onPress());
   assert.equal(text(find(t,`kensetsu-localized-${id}:learningActivity`).children),a.translations[locale]);
   for(const c of s.clusters)for(const p of c.paragraphs)assert(text(t.toJSON()).includes(p.ja),'Existing teaching text remains visible');
   await act(async()=>{const r=find(t,'kensetsu-reader');r.props.onLayout({nativeEvent:{layout:{height:500}}});r.props.onContentSizeChange(430,1200);r.props.onScroll({nativeEvent:{layoutMeasurement:{height:500},contentSize:{height:1200},contentOffset:{y:700}}});});
   assert.equal(find(t,'kensetsu-complete').props.disabled,false);await act(async()=>find(t,'kensetsu-complete').props.onPress());assert.equal(completed,1);
   await act(async()=>t.unmount());cases++;
  }
  const stale=m.applyLessonTranslations(s,{sessionId:id,entries:{learningActivity:{sourceJa:a.ja+'変更',translations:{en:'stale'}}}});assert.equal(stale.clusters.find(c=>c.learningActivity).learningActivity.translations,undefined);
 }
 const report={date:'2026-11-02',status:'PASS_ACTUAL_FOREMAN_DAY_READER_HOST',sessions:numbers,localeModeCases:cases,translationHiddenInitially:true,selectedLocaleExact:true,priorTeachingRetained:true,explicitEndBeforeCompletion:true,staleActivityTranslationRejected:true,newIllustrationRegistryMounted:numbers.every(n=>[17,18,19].includes(n)),hostAdapters:['ReactNative','RoyalFrames','Backdrop','PNGImportHostValueWithActualAssetRegistry','unusedScopeAndReviewRoutes'],nativeDeviceTested:false,pixelsReviewed:false,releaseReady:false};
 if(process.env.FOREMAN_DEPTH_REPORT)fs.writeFileSync(path.resolve(root,process.env.FOREMAN_DEPTH_REPORT),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1)});
