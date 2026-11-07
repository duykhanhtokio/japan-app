/* All active native Reader bindings, with isolated native primitives/translation delivery.
 * This is integration evidence, not native-prose, source-semantic or device acceptance. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),cp=require('child_process');
const ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..'),reader=fs.readFileSync(path.join(root,'src/components/hospitality/HospitalityCourse.tsx'),'utf8');
const bindings=[];
for(const line of reader.split('\n')){
 const name=line.match(/<(Hotel\w+) lesson=\{lesson\}/)?.[1];if(!name)continue;
 const ids=[...new Set(line.match(/hotel-[a-z]+-\d+/g))];assert(ids.length,`unbound native caller ${name}`);
 for(const id of ids)bindings.push({component:name,lessonId:id});
}
assert.equal(new Set(bindings.map(x=>x.component)).size,11);assert.equal(bindings.length,16);
const lessons=['front','planning','service','restaurant','safety'].flatMap(g=>JSON.parse(fs.readFileSync(path.join(root,`src/data/hospitality/${g}.json`))).lessons);
const languages=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
let translatedMaterial=null;const cache=new Map(),loads=[];
const element=tag=>p=>React.createElement(tag,{'data-testid':p.testID,'aria-label':p.accessibilityLabel},p.children);
const native={View:element('div'),Text:element('span'),Image:p=>React.createElement('img',{src:p.source,alt:p.accessibilityLabel}),StyleSheet:{create:v=>v},useWindowDimensions:()=>({width:375,height:812,fontScale:1})};
function load(relative){
 const file=path.resolve(root,relative);if(cache.has(file))return cache.get(file);const e={};cache.set(file,e);
 const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX},reportDiagnostics:true});assert.equal(compiled.diagnostics.length,0);
 vm.runInNewContext(compiled.outputText,{exports:e,require:name=>{
  if(name==='react')return React;if(name==='react/jsx-runtime')return require(name);if(name==='react-native')return native;
  if(name==='./HotelGuideText')return {HotelGuideText:element('span')};
  if(name.endsWith('/translation-loaders'))return {loadHotelTranslation:()=>translatedMaterial};
  if(/\.webp$/.test(name)){loads.push(name);return name;}
  if(name.startsWith('.')){const target=path.resolve(path.dirname(file),name);return load(path.relative(root,fs.existsSync(target+'.tsx')?target+'.tsx':target+'.ts'));}
  return require(name);
 }},{filename:file});return e;
}
let positives=0,negatives=0;
for(const row of bindings){
 const lesson=lessons.find(l=>l.id===row.lessonId);assert(lesson);const Component=load(`src/components/hospitality/${row.component}.tsx`)[row.component];assert(Component);
 row.currentRenders=0;row.rejectedRenders=0;
 for(const language of languages){
  translatedMaterial=lesson;const render=l=>renderToStaticMarkup(React.createElement(Component,{lesson:l,language}));
  const html=render(lesson);assert(html.includes('data-testid='),`${row.component}/${row.lessonId}/${language}: current absent`);assert(!html.includes('undefined'));positives++;row.currentRenders++;
  for(const invalid of [{...lesson,revision:'stale'},{...lesson,revision:undefined},{...lesson,id:'unknown'}]){const before=loads.length;assert.equal(render(invalid),'');assert.equal(loads.length,before);negatives++;row.rejectedRenders++;}
  if(language!=='ja'&&!['HotelPracticeFloorplan','HotelRevenueExample'].includes(row.component)){translatedMaterial=null;assert.equal(render(lesson),'');negatives++;row.rejectedRenders++;}
 }
}
const callerAst=ts.createSourceFile('HospitalityCourse.tsx',reader,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const names=[...new Set(bindings.map(row=>row.component))],calls=[];
function collect(node){
 if(ts.isJsxSelfClosingElement(node)&&names.includes(node.tagName.getText(callerAst))){
  const fields=node.attributes.properties.map(attribute=>{assert(ts.isJsxAttribute(attribute)&&attribute.initializer&&ts.isJsxExpression(attribute.initializer));return `${attribute.name.getText(callerAst)}:${attribute.initializer.expression.getText(callerAst)}`;});
  calls.push(`${node.tagName.getText(callerAst)}({${fields.join(',')}});`);
 }
 ts.forEachChild(node,collect);
}
collect(callerAst);assert.equal(calls.length,11,'all known native caller sites must be checked');
const probe=path.join(root,'__active_reader_caller_probe__.tsx'),probeSource=[
 ...names.map(name=>`import {${name}} from './src/components/hospitality/${name}';`),
 "import type {HotelLesson} from './src/data/hospitality/types';",
 'declare const lesson:HotelLesson;declare const language:string;declare const show:boolean;',
 ...calls,
 ...names.flatMap(name=>[`// @ts-expect-error a source-bound native guide requires lesson`,`${name}({language});`,`// @ts-expect-error an invalid lesson type must be rejected`,`${name}({lesson:123,language});`]),
].join('\n');
const options={noEmit:true,skipLibCheck:true,strict:true,jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,moduleResolution:ts.ModuleResolutionKind.Node10,target:ts.ScriptTarget.ES2020};
const host=ts.createCompilerHost(options),originalRead=host.readFile.bind(host),originalExists=host.fileExists.bind(host),originalSource=host.getSourceFile.bind(host);
host.readFile=file=>file===probe?probeSource:originalRead(file);host.fileExists=file=>file===probe||originalExists(file);host.getSourceFile=(file,version,...rest)=>file===probe?ts.createSourceFile(file,probeSource,version,true,ts.ScriptKind.TSX):originalSource(file,version,...rest);
const program=ts.createProgram([probe],options,host),focused=ts.getPreEmitDiagnostics(program).filter(d=>d.file&&path.resolve(d.file.fileName)===probe);
assert.equal(focused.length,0,ts.formatDiagnosticsWithColorAndContext(focused,{getCanonicalFileName:x=>x,getCurrentDirectory:()=>root,getNewLine:()=> '\n'}));

const allImages=[...reader.matchAll(/<Image\b/g)].length;assert.equal(allImages,3);assert.equal([...reader.matchAll(/onError=\{onFigureError\}/g)].length,3);
const quizFields=lessons.flatMap(l=>l.questions.map(q=>({lessonId:l.id,questionId:q.id,keys:Object.keys(q)})));assert(quizFields.every(q=>!q.keys.some(k=>/image|figure|diagram|illustration|asset/i.test(k))));
const matrix={scope:'Current active Reader visual integration; no whole-source/native/device approval',baseCommit:process.env.HOTEL_SCOPE_BASE||cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),mainLessons:lessons.length,nativeComponents:11,actualCallerTypeProbes:11,invalidCallerTypeRejections:22,nativeLessonBindings:bindings.length,nativeLocaleRenders:positives,rejectedNativeRenders:negatives,bindings,quizQuestionCount:quizFields.length,quizImageFields:0,mainImageElements:allImages,controlledRasterComponents:['HotelSafetyDecisionGuide'],limitations:['Native primitives, guide text renderer and translation delivery isolated.','Locale positives verify boundary routing with canonical test material, not actual translated-prose correctness.','No physical-device/browser rendering or source-domain certification.']};
if(process.env.HOTEL_SCOPE_OUTPUT)fs.writeFileSync(process.env.HOTEL_SCOPE_OUTPUT,JSON.stringify(matrix,null,2)+'\n');
console.log(`PASS active Reader: ${bindings.length} native lesson bindings / 11 components; ${positives} locale renders and ${negatives} source/material rejections; ${quizFields.length} quiz questions have no active image fields; all 3 main Image elements retain failure boundary.`);
