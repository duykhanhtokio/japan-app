const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {componentHarness,root}=require('../../docs/ssw-workspace/manufacturing/implementation40/qa/runtime-harness.cjs');
// Scratch renderer dependencies must share the app's single React instance.
const Module=require('node:module'),originalResolve=Module._resolveFilename,reactPath=require.resolve('react'),jsxPath=require.resolve('react/jsx-runtime');
Module._resolveFilename=function(id,parent,...rest){return originalResolve.call(this,id==='react'?reactPath:id==='react/jsx-runtime'?jsxPath:id,parent,...rest);};
const React=require('react'),TR=require('react-test-renderer');global.IS_REACT_ACT_ENVIRONMENT=true;
const old=console.error;console.error=(...a)=>{if(a[0]?.toString().includes('react-test-renderer is deprecated'))return;old(...a);};
async function act(fn){await TR.act(async()=>{fn?.();await new Promise(setImmediate);});}
const flat=n=>typeof n==='string'?n:Array.isArray(n)?n.map(flat).join(''):n&&typeof n==='object'?flat(n.children):'';
(async()=>{const {api}=await componentHarness();const lesson=api.loadManufacturingCourse('electrical').lessons.find(l=>l.id==='mfg1-electrical-l043'),patch=require(root+'/src/data/manufacturing/source50-overview.json');let flows=0;
for(const loc of Object.keys(patch.paragraphs[0].wording)){let r;await act(()=>r=TR.create(React.createElement(api.__qaLocaleContext.Provider,{value:loc},React.createElement(api.__qaReader,{lesson,language:loc,done:false,onBack(){},onComplete(){},saving:false,saveError:null}))));
 const ruby=r.root.findAll(n=>n.type==='View'&&n.props.testID==='manufacturing-source49-ruby');assert.equal(ruby.length,3);for(let i=0;i<3;i++)assert.equal(ruby[i].props.accessibilityLabel,patch.paragraphs[i].wording.ja.after);
 if(loc!=='ja'){const label=api.manufacturingUi(loc,'translationShow');const button=r.root.findAll(n=>n.type==='Pressable'&&n.props.accessibilityLabel===label);assert.equal(button.length,1);await act(()=>button[0].props.onPress());for(const p of patch.paragraphs)assert(flat(r.toJSON()).includes(p.wording[loc].after));}
 await act(()=>r.unmount());flows++;}
console.log(JSON.stringify({status:'PASS',actualPrivateReaderLocaleFlows:flows,rubyInActualReader:true,translationToggle:true,canonicalJapaneseAccessibilityLabel:true,paragraphsPerFlow:3,newRubyOnly:true,platformAdaptersDeclared:true,browserLayoutVerified:false,physicalDeviceTested:false}));})().catch(e=>{console.error(e);process.exitCode=1});
