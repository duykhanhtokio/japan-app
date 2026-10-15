const assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..'),modules=process.env.TOKUTEI_QA_MODULES||root;
const dep=n=>require(require.resolve(n,{paths:[modules]})),React=dep('react'),renderer=dep('react-test-renderer');
global.IS_REACT_ACT_ENVIRONMENT=true;global.__tokuteiStorage=new Map();global.__tokuteiFailSave=false;global.requestAnimationFrame=fn=>setTimeout(fn,0);global.cancelAnimationFrame=clearTimeout;
const {act}=renderer;
const text=n=>typeof n==='string'?n:Array.isArray(n)?n.map(text).join(' '):n&&typeof n==='object'?text(n.children):'';
async function click(t,id){await act(async()=>{t.root.findAll(n=>typeof n.type==='string'&&n.props.testID===id)[0].props.onPress();await new Promise(setImmediate);});}
(async()=>{
 const m=await require('./tokutei-ui-qa/compile.cjs')(root,modules),id='kaigo-foundation-01-summary';
 const languages=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
 for(const language of languages){
  global.__tokuteiLanguage=language;let t;await act(async()=>{t=renderer.create(React.createElement(m.KaigoCourse,{active:false,onBack(){}}));await new Promise(setImmediate);});
  await click(t,'kaigo-week-1');await click(t,'kaigo-calendar-day-1');
  const tr=m.translationForMaster(id,language);assert(tr);assert(!text(t.toJSON()).includes(tr.paragraphs[0]));
  await click(t,'kaigo-translation');for(const p of tr.paragraphs)assert(text(t.toJSON()).includes(p),language);
  if(language!=='vi')assert(!text(t.toJSON()).includes(m.translationForMaster(id,'vi').paragraphs[0]),'No Vietnamese fallback');
  await act(async()=>t.unmount());
 }
 const source=m.japaneseMasterSections[id],prior=[...source.paragraphsJa];source.paragraphsJa.push('変更');assert.equal(m.translationForMaster(id,'en'),undefined);source.paragraphsJa=prior;
 delete global.__tokuteiLanguage;
 console.log('KAIGO MASTER TRANSLATIONS PASS: 12 selected languages render only after explicit action; no Vietnamese fallback; source edit invalidates translations. Vietnamese week 1 is also checked separately; human review pending.');
})().catch(e=>{console.error(e);process.exitCode=1;});
