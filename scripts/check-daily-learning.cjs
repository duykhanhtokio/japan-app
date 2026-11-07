const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const tool=process.env.LEARNING_TEST_MODULES;
const dependency=name=>require(tool?path.join(tool,name):name);
const ts=dependency('typescript'),React=dependency('react'),Renderer=dependency('react-test-renderer');
global.IS_REACT_ACT_ENVIRONMENT=true;
function load(file,imports={}) {const filename=path.resolve(file),m=new Module(filename,module);m.filename=filename;m.paths=module.paths;m.require=name=>Object.hasOwn(imports,name)?imports[name]:name==='react'?React:name==='react/jsx-runtime'?dependency('react/jsx-runtime'):require(name.startsWith('.')?path.resolve(path.dirname(filename),name):name);m._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{fileName:filename,compilerOptions:{target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS}}).outputText,filename);return m.exports;}
(async()=>{
 const core=await import(path.resolve('src/daily-learning/core.mjs'));
 let width=390,height=844;
 const rn={View:'View',Text:'Text',Pressable:'Pressable',StyleSheet:{create:x=>x},useWindowDimensions:()=>({width,height})};
 const Board=load('src/daily-learning/DailyWordMatch.tsx',{'react-native':rn,'./core.mjs':core}).default;
 const words=Array.from({length:10},(_,i)=>({id:'w'+i,word:'語'+i,reading:'ご'+i,meaning:'meaning '+i,level:'N5'}));
 const challenge={day:'2026-11-07',locale:'en',level:'N5',words,matched:[],attempts:[]};
 let tree,latest=[],complete=false;
 await Renderer.act(async()=>{tree=Renderer.create(React.createElement(Board,{challenge,onChange:(a,c)=>{latest=a;complete=c;}}));});
 assert.equal(tree.root.findAllByType('Pressable').length,30);
 const tap=async(field,id)=>{await Renderer.act(async()=>tree.root.findByProps({testID:`match-${field}-${id}`}).props.onPress());};
 for(let i=0;i<205;i++){await tap('word','w0');await tap('reading','w1');await tap('meaning','w0');}
 assert(!complete);assert(latest.length<=200,'Wrong retries stay unlimited without unbounded payload');
 for(const w of words){for(const field of ['word','reading','meaning'])await tap(field,w.id);}
 assert(complete);assert.equal(new Set(latest.filter(t=>core.checkMatch(challenge,t)).map(t=>t[0])).size,10);
 assert(tree.root.findAllByType('Pressable').every(p=>p.props.disabled));
 width=844;height=390;await Renderer.act(async()=>tree.update(React.createElement(Board,{challenge,onChange:()=>{}})));assert.equal(tree.root.findAllByType('Pressable').length,30);
 await Renderer.act(async()=>tree.unmount());
 const memory=new Map(),storage={getItem:async k=>memory.get(k)??null,setItem:async(k,v)=>{memory.set(k,v)},removeItem:async k=>{memory.delete(k)}};
 const archive=load('src/services/jlpt-submitted-archive.ts',{'@react-native-async-storage/async-storage':{default:storage}});
 const sessions=load('src/services/jlpt-trial-session-storage.ts',{'@react-native-async-storage/async-storage':{default:storage},'./jlpt-submitted-archive':archive,'@/data/jlpt-official/n1-2012-07-trial':{N1_2012_07_SESSION_KEY:'protected-session'}});
 const submitted={answers:{q:'2'},mode:'exam',status:'submitted',started:true,submitted:true,currentQuestion:'q',scrollY:0,playedAudioSegments:[],submittedAt:'2026-11-07T00:00:00Z',result:{correct:1,wrong:0,unanswered:0,total:1},accessRunId:'run-1'};
 await sessions.saveJlptTrialSession('exam',submitted);await sessions.clearJlptTrialSession('exam');assert.equal((await archive.loadSubmittedArchive('exam')).length,1);
 await sessions.saveJlptTrialSession('exam',{...submitted,submitted:false,status:'in_progress',result:null,submittedAt:null});assert.equal((await sessions.loadJlptTrialSession('exam')).accessRunId,'run-1');assert.equal((await archive.loadSubmittedArchive('exam'))[0].answers.q,'2');
 const client=load('src/services/daily-learning-client.ts',{'@react-native-async-storage/async-storage':{default:storage}});
 process.env.EXPO_PUBLIC_ECONOMY_API_URL='https://test.invalid';await assert.rejects(()=>client.learningAction('account'),/đăng nhập/);
 client.configureLearningIdentityProvider(async()=>({userId:'alice',token:'test-token'}));
 await storage.setItem('@japan_app_user_profile',JSON.stringify({level:'N3',initialLevel:'N5'}));
 let requests=[];global.fetch=async(url,options)=>{requests.push(JSON.parse(options.body));return{ok:true,json:async()=>({serverNow:Date.now(),premiumUntil:0,state:{freeExamId:'n5-2011-12-exam-01'},result:{kind:'exchange',ticketAwarded:true}})}};
 const first=client.learningTransaction('exchange'),second=client.learningTransaction('exchange');assert.equal(first,second);await first;assert.equal(requests.length,1);assert.equal(requests[0].initialLevel,'N5');
 global.fetch=async()=>{throw Error('network lost')};await assert.rejects(()=>client.learningTransaction('unlock',{examId:'n3-2012-07-exam-01'}));const retained=[...memory.entries()].find(([k])=>k.includes('@learning-operation:'));assert(retained);
 let retried;global.fetch=async(url,options)=>{retried=JSON.parse(options.body);return{ok:true,json:async()=>({serverNow:Date.now(),state:{freeExamId:'n5-2011-12-exam-01'},result:{replayed:true}})}};await client.learningTransaction('unlock',{examId:'n3-2012-07-exam-01'});assert.equal(retried.operationId,retained[1]);assert(!memory.has(retained[0]));
 console.log('DAILY LEARNING CLIENT/UI PASS: 30 rendered cards; 205 wrong retries; all 10 correct groups; landscape still 30 cards; archival preservation; immutable initial level; no local auth bypass; shared transaction; persistent retry ID. Layout/device visual acceptance remains unverified.');
})().catch(e=>{console.error(e);process.exitCode=1});
