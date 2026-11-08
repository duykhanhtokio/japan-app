'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),esbuild=require('esbuild');
const React=require('react'),TR=require('react-test-renderer');
function transpile(file){return esbuild.transformSync(fs.readFileSync(file,'utf8'),{loader:'tsx',format:'cjs',jsx:'automatic'}).code;}
function trace(enabled){const box={exports:{}},logs=[];let time=0;
 vm.runInNewContext(transpile('src/services/performance-trace.ts'),{module:box,exports:box.exports,process:{env:{EXPO_PUBLIC_PERF_TRACE:enabled?'1':'0'}},performance:{now:()=>time++},console:{info:text=>logs.push(JSON.parse(text.slice('YOKOSO_PERF '.length)))}});
 return {api:box.exports,logs};}
(async()=>{
 const off=trace(false);off.api.beginNavigationTrace('/home');off.api.commitNavigationTrace('/home');assert.equal(off.logs.length,0);
 const same=Promise.resolve(3);assert.strictEqual(off.api.traceAsync('disabled',()=>same),same);
 const on=trace(true);on.api.beginNavigationTrace('/learn');on.api.commitNavigationTrace('/learn');assert(on.logs.some(row=>row.stage==='route_committed'&&row.durationMs>=0));
 assert.equal(await on.api.traceAsync('content_module_loaded',async()=>7),7);
 await assert.rejects(on.api.traceAsync('content_module_loaded',async()=>{throw Error('expected');}),/expected/);
 assert(on.logs.some(row=>row.outcome==='rejected'));
 global.IS_REACT_ACT_ENVIRONMENT=true;
 let id=0;const frames=new Map();global.requestAnimationFrame=fn=>{frames.set(++id,fn);return id;};global.cancelAnimationFrame=key=>frames.delete(key);
 const box={exports:{}};const req=name=>{
  if(name==='react'||name.startsWith('react/'))return require(name);
  if(name==='react-native')return {ActivityIndicator:'ActivityIndicator',Pressable:'Pressable',Text:'Text',View:'View'};
  if(name==='react-native-safe-area-context')return {useSafeAreaInsets:()=>({top:0,bottom:0})};
  if(name==='@/services/performance-trace')return off.api;
  throw Error(name);
 };
 new vm.Script(`(function(module,exports,require){${transpile('src/components/tokutei/createDeferredCourse.tsx')}\n})`).runInThisContext()(box,box.exports,req);
 const {act}=TR,create=box.exports.createDeferredCourse;
 async function mount(C){let tree;await act(async()=>{tree=TR.create(React.createElement(C));});return tree;}
 async function settle(){await act(async()=>{for(let i=0;i<3;i++){const callbacks=[...frames.values()];frames.clear();callbacks.forEach(fn=>fn());await new Promise(resolve=>setTimeout(resolve,5));}});}
 async function unmount(tree){await act(async()=>tree.unmount());}
 let calls=0;const Screen=create(async()=>{calls++;return ()=>React.createElement('Text',null,'loaded');});
 let tree=await mount(Screen);assert.equal(calls,0);assert(tree.root.findByProps({testID:'course-loading'}));await settle();assert.equal(calls,1);assert(tree.root.findAllByType('Text').some(node=>node.children.includes('loaded')));await unmount(tree);
 tree=await mount(Screen);assert.equal(calls,1);await unmount(tree);
 let cancelled=0;const Cancel=create(async()=>{cancelled++;return ()=>null;});tree=await mount(Cancel);await unmount(tree);await settle();assert.equal(cancelled,0);
 let attempts=0;const Retry=create(async()=>{if(++attempts===1)throw Error('controlled retry');return ()=>null;});tree=await mount(Retry);await settle();const button=tree.root.findAllByType('Pressable').find(node=>node.findAllByType('Text').some(text=>text.children.includes('再試行')));assert(button);await act(async()=>button.props.onPress());await settle();assert.equal(attempts,2);await unmount(tree);
 assert.equal(off.logs.length,0);console.log('PASS: opt-in trace, async success/failure, deferred loading/cache/cancellation/retry; no native UI claim.');
})().catch(error=>{console.error(error);process.exitCode=1;});
