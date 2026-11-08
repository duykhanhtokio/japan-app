const assert=require('node:assert/strict');
const path=require('node:path');
const Module=require('node:module');
const esbuild=require('esbuild');
const root=path.resolve(__dirname,'../..');
const React=require('react'),Renderer=require('react-test-renderer');
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
globalThis.__studyStorage=new Map();
const mocks={
 'react-native':`import React from 'react';export const View='View',Text='Text',Pressable='Pressable',ScrollView='ScrollView',TextInput='TextInput';export function Modal(p){return p.visible?React.createElement('Modal',p,p.children):null;}export const Image=Object.assign(p=>React.createElement('Image',p),{resolveAssetSource:()=>({width:1536,height:1024})});export const useWindowDimensions=()=>({width:390,height:844,fontScale:1});export const StyleSheet={create:s=>s,flatten:s=>Array.isArray(s)?Object.assign({},...s):s};export const AppState={addEventListener:()=>({remove(){}})};`,
 'react-native-safe-area-context':`export const useSafeAreaInsets=()=>({top:44,bottom:34,left:0,right:0});`,
 '@react-native-async-storage/async-storage':`export default {getItem:async k=>globalThis.__studyStorage.get(k)??null,setItem:async(k,v)=>{globalThis.__studyStorage.set(k,v)},removeItem:async k=>{globalThis.__studyStorage.delete(k)}};`,
 '@/components/ui/RoyalPanels':`import React from 'react';export const RoyalContentPanel=p=>React.createElement('Panel',p,p.children);export const RoyalExplanationPanel=RoyalContentPanel;`,
 '@/components/ui/RoyalSurface':`import React from 'react';export const RoyalBackButton=p=>React.createElement('Back',p);export const RoyalButton=p=>React.createElement('Pressable',{...p,accessibilityRole:'button',accessibilityLabel:p.accessibilityLabel??p.label},p.children??React.createElement('Text',null,p.label));export const ROYAL_FONT={heading:'serif',body:'sans'};export const ROYAL_LAYOUT={screenGutter:16,backSafeTop:0};`,
};
async function main(){
 const result=await esbuild.build({stdin:{contents:`export {TokuteiHeader} from './src/components/tokutei/TokuteiChrome';export {StudyCalendar} from './src/components/tokutei/StudyCalendar';export {StudyFigure} from './src/components/tokutei/StudyFigure';export {StudyAppearanceProvider} from './src/components/tokutei/StudyAppearance';`,resolveDir:root,loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime'],plugins:[{name:'native-test-host',setup(build){build.onResolve({filter:/.*/},args=>Object.hasOwn(mocks,args.path)?{path:args.path,namespace:'mock'}:undefined);build.onLoad({filter:/.*/,namespace:'mock'},args=>({contents:mocks[args.path],loader:'jsx'}));build.onResolve({filter:/\.webp$/},()=>({path:'calendar',namespace:'asset'}));build.onLoad({filter:/.*/,namespace:'asset'},()=>({contents:'export default 1;'}));}}]});
 const mod=new Module(path.join(root,'scripts/tokutei/runtime-bundle.cjs'),module);mod.filename=path.join(root,'scripts/tokutei/runtime-bundle.cjs');mod.paths=Module._nodeModulePaths(root);mod._compile(result.outputFiles[0].text,mod.filename);
 const {TokuteiHeader,StudyCalendar,StudyFigure,StudyAppearanceProvider}=mod.exports;
 const lessons=Array.from({length:8},(_,i)=>({id:'l'+i,title:'Lesson '+i,revision:'v1',summary:'Source summary '+i}));
 let opened=null,tree,questionLoads=0;
 const element=()=>React.createElement(StudyAppearanceProvider,null,React.createElement(TokuteiHeader,{title:'Test course',onBack:()=>{}}),React.createElement(StudyCalendar,{lessons,loadQuestions:()=>{questionLoads++;return [{id:'q1',prompt:'Question 1',options:['A','B'],correctIndex:1,explanation:'B is correct',lessonIds:['l0']}];},storageKey:'learner-test',isDone:()=>false,onOpenLesson:id=>{opened=id;}}));
 const click=async title=>{const p=tree.root.findAllByType('Pressable').find(p=>p.props.accessibilityLabel?.includes(title)||p.findAllByType('Text').some(t=>typeof t.props.children==='string'&&t.props.children.includes(title)));assert.ok(p,'Missing action '+title);await Renderer.act(async()=>p.props.onPress());};
 await Renderer.act(async()=>{tree=Renderer.create(element());});
 assert.equal(tree.root.findAllByProps({testID:'tokutei-reading-appearance'}).length,0,'Appearance switching was removed');
 assert.equal(questionLoads,0,'Catalog must not construct/load test banks');
 await click('第1週 · 7日');
 assert.equal(tree.root.findAllByType('Pressable').filter(p=>/^study-calendar-day-/.test(p.props.testID??'')).length,7);
 await Renderer.act(async()=>tree.root.findAllByType('Pressable').find(p=>p.props.testID==='study-calendar-day-1').props.onPress());assert.equal(opened,'l0');
 await click('週末テスト');assert.ok(questionLoads>0,'Review must load its real questions');const modal=tree.root.findByType('Modal');assert.equal(modal.findAllByType('Back').length,1,'Weekly test needs a Royal Back');assert.equal(modal.findAllByProps({testID:'tokutei-reading-appearance'}).length,0,'Weekly test must not expose removed appearance switching');assert.ok(!JSON.stringify(tree.toJSON()).includes('B is correct'),'Answer leaked before submission');
 await click('○ B');await click('回答を提出する');assert.ok(JSON.stringify(tree.toJSON()).includes('B is correct'));assert.ok(JSON.parse(globalThis.__studyStorage.get('learner-test')).done);
 await click('完了して戻る');await click('週の一覧に戻る');await click('第2週 · 7日');
 assert.equal(tree.root.findAllByType('Pressable').filter(p=>/^study-calendar-day-/.test(p.props.testID??'')).length,7);
 await Renderer.act(async()=>tree.root.findAllByType('Pressable').find(p=>p.props.testID==='study-calendar-day-2').props.onPress());
 assert.equal(tree.root.findAllByType('TextInput').length,1,'Final-week review must refer to a real lesson');
 await Renderer.act(async()=>tree.unmount());
 await Renderer.act(async()=>{tree=Renderer.create(React.createElement(StudyAppearanceProvider,null,React.createElement(StudyFigure,{source:1,width:1536,height:1024,alt:'Test figure',testID:'figure'})));});
 await Renderer.act(async()=>tree.root.findAllByType('Pressable').find(p=>p.props.accessibilityLabel?.includes('タップ')).props.onPress());
 const viewport=tree.root.findByProps({testID:'figure-viewport'});
 await Renderer.act(async()=>viewport.props.onLayout({nativeEvent:{layout:{width:360,height:600}}}));
 let images=tree.root.findAllByType('Image');assert.ok(images.some(p=>p.props.style.width===360&&p.props.style.height===240),'Zoom must initially fit the viewport');
 await click('拡大 ＋');images=tree.root.findAllByType('Image');assert.ok(images.some(p=>p.props.style.width===720),'Explicit magnification must enlarge proportionally');
 await click('閉じる');assert.equal(tree.root.findAllByType('Modal').length,0);
 await Renderer.act(async()=>tree.unmount());
 console.log('PASS shared study interactions: seven days, stable lesson IDs, no pre-submit answers, saved result, final-week review, viewport fit, explicit zoom, close.');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
