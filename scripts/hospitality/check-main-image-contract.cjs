/* Actual registry/Reader boundaries with isolated native primitives; no device claim. */
const fs=require('fs'),path=require('path'),vm=require('vm'),cp=require('child_process'),assert=require('assert');
const ts=require('typescript'),React=require('react'),jsxRuntime=require('react/jsx-runtime'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),cache=new Map(),assetLoads=[];
function load(relative){
 const file=path.resolve(root,relative);if(cache.has(file))return cache.get(file);
 const e={};cache.set(file,e);const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020},reportDiagnostics:true});assert.equal(compiled.diagnostics.length,0);
 vm.runInNewContext(compiled.outputText,{exports:e,require:name=>{
  if(/\.(webp|png)$/.test(name)){const target=path.relative(root,path.resolve(path.dirname(file),name));assetLoads.push(target);return target;}
  if(name.startsWith('.'))return load(path.relative(root,path.resolve(path.dirname(file),name+'.ts')));
  return require(name);
 }});return e;
}
const guards=load('src/data/hospitality/illustration-source-guards.ts'),figures=load('src/data/hospitality/illustrations.ts');
assert.equal(assetLoads.length,0,'registry import must not load any image');
const lessons=['front','planning','service','restaurant','safety'].flatMap(group=>JSON.parse(fs.readFileSync(path.join(root,`src/data/hospitality/${group}.json`))).lessons);
assert.equal(lessons.length,38);assert.deepEqual(Object.keys(guards.HOTEL_ILLUSTRATION_SOURCE_REVISIONS).sort(),lessons.map(l=>l.id).sort());
const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/hospitality/image-manifest.json'))).images;
for(const lesson of lessons){
 assert.equal(guards.HOTEL_ILLUSTRATION_SOURCE_REVISIONS[lesson.id],lesson.revision);
 assert(figures.hasHotelIllustration(lesson.id));
 const image=figures.hotelIllustration(lesson.id,lesson.revision),row=manifest.find(r=>r.lessonId===lesson.id);assert(row);assert.equal(image,row.path);
 assert(cp.execFileSync('git',['ls-tree','HEAD',row.path],{cwd:root,encoding:'utf8'}).trim(),`image absent in actual HEAD tree: ${row.path}`);
 const before=assetLoads.length;for(const revision of ['stale',undefined,null])assert.equal(figures.hotelIllustration(lesson.id,revision),null);
 assert.equal(assetLoads.length,before,'rejected revisions must not require image assets');
}
for(const id of ['unknown','__proto__','constructor']){assert.equal(figures.hotelIllustration(id,'unknown'),null);assert.equal(figures.hasHotelIllustration(id),false);}
const source=fs.readFileSync(path.join(root,'src/components/hospitality/HospitalityCourse.tsx'),'utf8'),ast=ts.createSourceFile('HospitalityCourse.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let readerFunction;for(const statement of ast.statements)if(ts.isFunctionDeclaration(statement)&&statement.name?.text==='Reader')readerFunction=statement;
assert(readerFunction);const hooks=[];let resolverCall;
function inspect(node){
 if(ts.isVariableDeclaration(node)&&ts.isArrayBindingPattern(node.name)&&node.initializer&&ts.isCallExpression(node.initializer)&&node.initializer.expression.getText(ast)==='useState')hooks.push(node.name.elements[0].name.getText(ast));
 if(ts.isCallExpression(node)&&node.expression.getText(ast)==='hotelIllustration')resolverCall=node;
 ts.forEachChild(node,inspect);
}
inspect(readerFunction);assert(resolverCall);assert.equal(resolverCall.arguments.length,2);assert.equal(resolverCall.arguments[1].getText(ast),'lesson.revision');
let overrides={},states={},writes=[],hookIndex=0,images=[],buttons=[],keys=[],recordWrites=0;
const componentReact={...React,useState:initial=>{const name=hooks[hookIndex++];assert(name);const value=Object.prototype.hasOwnProperty.call(overrides,name)?overrides[name]:initial;states[name]=value;return [value,next=>{states[name]=typeof next==='function'?next(states[name]):next;writes.push({name,value:states[name]});}];}};
const node=tag=>props=>React.createElement(tag,{'data-testid':props.testID},props.children),empty=()=>null;
const native={View:node('div'),Text:node('span'),ScrollView:node('div'),Pressable:props=>{buttons.push(props);return React.createElement('button',{'aria-label':props.accessibilityLabel},props.children);},Image:props=>{images.push(props);return React.createElement('img',{src:props.source,alt:props.accessibilityLabel});},Modal:p=>p.visible?React.createElement('div',null,p.children):null,StyleSheet:{create:v=>v}};
const jsxProxy={...jsxRuntime,jsx:(type,props,key)=>{if(type===native.Image)keys.push(key);return jsxRuntime.jsx(type,props,key);},jsxs:(type,props,key)=>{if(type===native.Image)keys.push(key);return jsxRuntime.jsxs(type,props,key);}};
const requireReader=name=>{
 if(name==='react')return componentReact;if(name==='react/jsx-runtime')return jsxProxy;if(name==='react-native')return native;
 if(name==='@/data/hospitality/illustrations')return figures;if(name==='@/data/hospitality')return {loadHotelTranslation:()=>null};
 if(name.includes('HotelJapaneseText'))return {HotelJapaneseText:p=>React.createElement('span',null,p.text)};
 if(name.includes('StudyAppearance'))return {useStudyAppearance:()=>({colors:{text:'#222',background:'#fff',border:'#aaa'}}),ReadingAppearanceControl:empty,TranslationText:node('span')};
 if(name==='@/data/hospitality/ui')return {hospitalityUi:(l,k)=>k,hospitalityLabel:()=>''};
 if(name.includes('safe-area-context'))return {useSafeAreaInsets:()=>({top:0,bottom:0,left:0,right:0})};
 return new Proxy({__esModule:true,default:empty},{get:(object,key)=>object[key]||empty});
};
const exp={};vm.runInNewContext(ts.transpileModule(source+'\nexport {Reader};',{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}}).outputText,{exports:exp,require:requireReader});
function render(lesson,language,next={}){overrides=next;states={};writes=[];hookIndex=0;images=[];buttons=[];keys=[];recordWrites=0;const html=renderToStaticMarkup(React.createElement(exp.Reader,{lesson,language,record:{answers:{},submitted:false,completed:false},disabled:false,onChange(){recordWrites++;}}));return {html,images:[...images],buttons:[...buttons],keys:[...keys]};}
let current=0,mismatches=0,errors=0,retries=0,zoomChecks=0;
for(const lesson of lessons)for(const language of ['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){
 const ready=render(lesson,language);assert.equal(ready.images.length,1);assert.equal(typeof ready.images[0].onError,'function');assert(!ready.html.includes(`hotel-figure-unavailable-${lesson.id}`));current++;
 const stale=render({...lesson,revision:'stale'},language);assert.equal(stale.images.length,0);assert(stale.html.includes(`hotel-figure-unavailable-${lesson.id}`));assert(stale.html.includes(guards.hotelIllustrationUnavailableText(language)));assert(!stale.buttons.some(b=>b.accessibilityLabel===guards.hotelIllustrationRetryText(language)));mismatches++;
 ready.images[0].onError({nativeEvent:{error:'unavailable'}});assert(writes.some(w=>w.name==='figureFailed'&&w.value===true));assert(writes.some(w=>w.name==='zoom'&&w.value===false));assert.equal(recordWrites,0);
 const failed=render(lesson,language,{figureFailed:true});assert.equal(failed.images.length,0);assert(failed.html.includes(guards.hotelIllustrationUnavailableText(language)));const retry=failed.buttons.find(b=>b.accessibilityLabel===guards.hotelIllustrationRetryText(language));assert(retry);errors++;
 retry.onPress();assert.equal(states.figureFailed,false);assert.equal(states.figureAttempt,1);assert.equal(recordWrites,0);
 const recovered=render(lesson,language,{figureFailed:false,figureAttempt:1});assert.equal(recovered.images.length,1);assert.notDeepEqual(recovered.keys,ready.keys);assert.equal(recordWrites,0);retries++;
}
for(const lesson of lessons){const zoom=render(lesson,'ja',{zoom:true});assert.equal(zoom.images.length,3);assert(zoom.images.every(image=>typeof image.onError==='function'));zoomChecks++;}
const unknown=render({...lessons[0],id:'unknown'},'ja');assert.equal(unknown.images.length,0);assert(!unknown.html.includes('hotel-figure-unavailable-unknown'));
assert(source.includes('key={`${lesson.id}:${lesson.revision}:${language}`}'),'Reader state must be separated by source revision');
assert.equal(guards.hotelIllustrationUnavailableText('unknown'),guards.hotelIllustrationUnavailableText('en'));
const probe=path.join(root,'__hotel_image_resolver_probe__.ts'),probeSource=["import {hotelIllustration} from './src/data/hospitality/illustrations';","import type {HotelLesson} from './src/data/hospitality/types';",'declare const lesson:HotelLesson;',resolverCall.getText(ast)+';','// @ts-expect-error revision is mandatory',"hotelIllustration('hotel-front-01');",'// @ts-expect-error revision must be a string',"hotelIllustration('hotel-front-01',123);"].join('\n');
const options={noEmit:true,skipLibCheck:true,strict:true,module:ts.ModuleKind.CommonJS,moduleResolution:ts.ModuleResolutionKind.Node10,target:ts.ScriptTarget.ES2020},host=ts.createCompilerHost(options),read=host.readFile.bind(host),exists=host.fileExists.bind(host),getSource=host.getSourceFile.bind(host);
host.readFile=f=>f===probe?probeSource:read(f);host.fileExists=f=>f===probe||exists(f);host.getSourceFile=(f,v,...rest)=>f===probe?ts.createSourceFile(f,probeSource,v,true):getSource(f,v,...rest);
const program=ts.createProgram([probe],options,host),diagnostics=ts.getPreEmitDiagnostics(program).filter(d=>d.file&&path.resolve(d.file.fileName)===probe);assert.equal(diagnostics.length,0,ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:f=>f,getCurrentDirectory:()=>root,getNewLine:()=> '\n'}));
console.log(`PASS main image contract: ${lessons.length} source/registry/manifest/tree bindings; ${current} ready, ${mismatches} mismatched-source, ${errors} failed-load and ${retries} retry locale cases; ${zoomChecks} three-image zoom boundaries; learner records untouched.`);
console.log('PASS actual resolver caller type probe + 2 invalid API cases; unknown IDs/fallback locale preserved; no device or image-semantic approval claimed.');
