/* Checks actual component boundaries; native primitives and translations are isolated.
 * This is revision/integration evidence, not device or translated-prose approval. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=path.resolve(__dirname,'../..');
let translatedMaterial=null;
let controlledWidth=null,fontScale=1,exitLabel=null,mapHeight=null;
const flatten=style=>Object.assign({},...(Array.isArray(style)?style:[style]).filter(Boolean));
const element=tag=>props=>{
 if(props.testID==='hotel-practice-exit-label')exitLabel={...flatten(props.style),text:props.children};
 if(props.accessibilityRole==='image'&&flatten(props.style).height)mapHeight=flatten(props.style).height;
 return React.createElement(tag,{'data-testid':props.testID,'aria-label':props.accessibilityLabel},props.children);
};
const componentReact={...React,useState:initial=>controlledWidth===null?React.useState(initial):[controlledWidth,()=>{}]};
const native={View:element('div'),Text:element('span'),Image:props=>React.createElement('img',{src:props.source,alt:props.accessibilityLabel}),StyleSheet:{create:value=>value},useWindowDimensions:()=>({width:375,height:812,fontScale})};
const cache=new Map();
function load(relative){
 const file=path.resolve(root,relative);if(cache.has(file))return cache.get(file);
 const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX},reportDiagnostics:true});
 assert.equal(compiled.diagnostics.length,0,`transpile ${relative}`);
 const exports={};cache.set(file,exports);
 const requireIsolated=name=>{
  if(name==='react')return componentReact;
  if(name==='react/jsx-runtime')return require(name);
  if(name==='react-native')return native;
  // Return supplied material even for a stale revision: each diagram must guard itself.
  if(name.endsWith('/translation-loaders'))return {loadHotelTranslation:()=>translatedMaterial};
  if(name.endsWith('.webp'))return name;
  if(name.startsWith('.'))return load(path.relative(root,path.resolve(path.dirname(file),name+'.ts')));
  return require(name);
 };
 vm.runInNewContext(compiled.outputText,{exports,require:requireIsolated},{filename:file});return exports;
}
const lessons={};for(const group of ['front','planning','service','safety'])for(const lesson of JSON.parse(fs.readFileSync(path.join(root,`src/data/hospitality/${group}.json`))).lessons)lessons[lesson.id]=lesson;
const cases=[
 ['HotelPracticeFloorplan','hotel-front-03','hotel-front-03-practice-map'],
 ['HotelRevenueExample','hotel-planning-02','hotel-planning-02-revenue-example'],
 ['HotelServiceVisualGuide','hotel-service-01','hotel-service-01-native-guide'],
 ['HotelServiceVisualGuide','hotel-service-02','hotel-service-02-native-guide'],
 ['HotelServiceVisualGuide','hotel-service-03','hotel-service-03-native-guide'],
 ['HotelSafetyDecisionGuide','hotel-safety-02','hotel-safety-02-native-decision-guide'],
 ['HotelMarketSelectionGuide','hotel-planning-07','hotel-planning-07-native-market-guide'],
];
const languages=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
let positive=0,rejected=0;
for(const [name,id,testId] of cases){
 const Component=load(`src/components/hospitality/${name}.tsx`)[name],lesson=lessons[id];assert(lesson);
 for(const language of languages){
  translatedMaterial=lesson;
  const render=candidate=>renderToStaticMarkup(React.createElement(Component,{lesson:candidate,language}));
  const html=render(lesson);assert(html.includes(testId),`${id}/${language} current figure absent`);assert(!html.includes('undefined'));positive++;
  for(const candidate of [{...lesson,revision:'stale',terms:[]},{...lesson,revision:undefined,terms:[]},{...lesson,id:'unrelated-lesson',terms:[]}]){
   assert.equal(render(candidate),'',`${id}/${language} accepted mismatched diagram content`);rejected++;
  }
  if(name==='HotelRevenueExample')for(const expected of ['30 ÷ 40 × 100 = 75%','360,000 ÷ 30 = 12,000','360,000 ÷ 40 = 9,000','12,000 × 0.75 = 9,000'])assert(html.includes(expected),expected);
 }
 if(name==='HotelServiceVisualGuide'||name==='HotelSafetyDecisionGuide'||name==='HotelMarketSelectionGuide'){
  translatedMaterial=null;assert.equal(renderToStaticMarkup(React.createElement(Component,{lesson,language:'vi'})),'',`${id} missing translation must not render`);rejected++;
 }
}
const reader=fs.readFileSync(path.join(root,'src/components/hospitality/HospitalityCourse.tsx'),'utf8');
assert(reader.includes('<HotelPracticeFloorplan lesson={lesson} language={language}/>'));
assert(reader.includes('<HotelRevenueExample lesson={lesson} language={language}/>'));
const revenueValues=load('src/data/hospitality/revenue-example-labels.ts').HOTEL_REVENUE_EXAMPLE;
const Revenue=load('src/components/hospitality/HotelRevenueExample.tsx').HotelRevenueExample;
for(const field of ['availableRooms','soldRooms']){
 const previous=revenueValues[field];revenueValues[field]=0;
 assert.equal(renderToStaticMarkup(React.createElement(Revenue,{lesson:lessons['hotel-planning-02'],language:'ja'})),'',`zero ${field} must not divide`);
 revenueValues[field]=previous;rejected++;
}
const mapModule=load('src/components/hospitality/HotelPracticeFloorplan.tsx');
const mapLabels=load('src/data/hospitality/practice-floorplan-labels.ts');
let exitAnchors=0;
for(const language of languages)for(const width of [320,375,768,1280])for(const scale of [1,1.3,2]){
 controlledWidth=width-56;fontScale=scale;exitLabel=null;mapHeight=null;
 renderToStaticMarkup(React.createElement(mapModule.HotelPracticeFloorplan,{lesson:lessons['hotel-front-03'],language}));
 const actual=mapModule.hotelPracticeExitGeometry(controlledWidth,scale);
 assert(exitLabel&&mapHeight);assert.equal(exitLabel.text,mapLabels.hotelPracticeMapLabels(language).exit);
 assert.equal(exitLabel.top,undefined,'wrapped exit label must anchor by bottom');
 assert(Math.abs(actual.doorY-(mapHeight-exitLabel.bottom)-12*scale)<0.00001,'label must remain immediately above real exit');
 assert(exitLabel.left>=0&&exitLabel.left+exitLabel.width<=controlledWidth,'localized label stays in map horizontally');
 assert.equal(exitLabel.height,undefined,'localized label must wrap without fixed-height clipping');
 exitAnchors++;
}
controlledWidth=null;fontScale=1;
const fireModule=load('src/components/hospitality/HotelSafetyDecisionGuide.tsx'),geometry=fireModule.HOTEL_FIRE_BOUNDARY_GEOMETRY;
assert(geometry.belowFireTop>geometry.ceilingY);assert.equal(geometry.ceilingFireTop,geometry.ceilingY);
for(const key of ['below','ceiling']){
 const base=path.join(root,`assets/app/hospitality/royal-weekly-20261107/week04/safety02-fire-${key}-controlled`),svg=fs.readFileSync(base+'.svg','utf8');
 assert.equal(Number(svg.match(/data-ceiling-y="([\d.]+)"/)[1]),geometry.ceilingY);
 assert.equal(Number(svg.match(/data-flame-top="([\d.]+)"/)[1]),key==='below'?geometry.belowFireTop:geometry.ceilingFireTop);
 assert(fs.statSync(base+'.webp').size>1000);
}
const safetyLabels=load('src/data/hospitality/safety-visual-guide-labels.ts');
for(const language of languages){
 translatedMaterial=lessons['hotel-safety-02'];const t=safetyLabels.hotelSafetyGuideLabels(language);
 const html=renderToStaticMarkup(React.createElement(fireModule.HotelSafetyDecisionGuide,{lesson:lessons['hotel-safety-02'],language}));
 for(const key of ['conditional','trainedScope','evacuate','stopConditions','caveat'])assert(html.includes(t[key]),`${language}/${key} condition absent`);
}
assert(reader.includes("<HotelSafetyDecisionGuide lesson={lesson} language={show?language:'ja'}/>"));
// Type-check actual JSX caller arguments against the actual component signatures.
// Sparse-checkout dependency diagnostics outside this focused probe are not a build claim.
const callerAst=ts.createSourceFile('HospitalityCourse.tsx',reader,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const names=['HotelPracticeFloorplan','HotelRevenueExample','HotelServiceVisualGuide','HotelSafetyDecisionGuide','HotelMarketSelectionGuide'],calls=[];
function collect(node){
 if(ts.isJsxSelfClosingElement(node)&&names.includes(node.tagName.getText(callerAst))){
  const fields=node.attributes.properties.map(attribute=>{assert(ts.isJsxAttribute(attribute)&&attribute.initializer&&ts.isJsxExpression(attribute.initializer));return `${attribute.name.getText(callerAst)}:${attribute.initializer.expression.getText(callerAst)}`;});
  calls.push(`${node.tagName.getText(callerAst)}({${fields.join(',')}});`);
 }
 ts.forEachChild(node,collect);
}
collect(callerAst);assert.equal(calls.length,5,'all known native caller sites must be checked');
const probe=path.join(root,'__native_figure_caller_probe__.tsx'),probeSource=[
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
let toggleCases=0;
for(const language of languages)for(const shown of [false,true]){
 let stateIndex=0;const observed=[],empty=()=>null,colors={text:'#222',background:'#fff',border:'#aaa'};
 const readerReact={...React,useState:initial=>[stateIndex++===0?shown:initial,()=>{}]};
 const requireReader=name=>{
  if(name==='react')return readerReact;if(name==='react/jsx-runtime')return require(name);
  if(name==='react-native')return {...native,Pressable:element('button'),ScrollView:element('div'),Modal:p=>p.visible?React.createElement('div',null,p.children):null};
  if(name==='./HotelSafetyDecisionGuide')return {HotelSafetyDecisionGuide:props=>{observed.push(props.language);return null;}};
  if(name.includes('HotelJapaneseText'))return {HotelJapaneseText:p=>React.createElement('span',null,p.text)};
  if(name.includes('StudyAppearance'))return {useStudyAppearance:()=>({colors}),ReadingAppearanceControl:empty,TranslationText:element('span')};
  if(name==='@/data/hospitality')return {loadHotelTranslation:()=>lessons['hotel-safety-02']};
  if(name==='@/data/hospitality/ui')return {hospitalityUi:(l,k)=>k,hospitalityLabel:()=>''};
  if(name==='@/data/hospitality/illustrations')return {hotelIllustration:()=>null};
  if(name.includes('RoyalPanels'))return {RoyalContentPanel:element('div'),RoyalExplanationPanel:element('div')};
  return new Proxy({__esModule:true,default:empty},{get:(object,key)=>object[key]||empty});
 };
 const compiledReader=ts.transpileModule(reader+'\nexport {Reader};',{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}}),exports={};
 vm.runInNewContext(compiledReader.outputText,{exports,require:requireReader});
 renderToStaticMarkup(React.createElement(exports.Reader,{lesson:lessons['hotel-safety-02'],language,record:{answers:{},submitted:false,completed:false},disabled:false,onChange(){}}));
 assert.deepEqual(observed,[shown?language:'ja']);toggleCases++;
}
console.log(`PASS native figure revisions: ${positive} current locale renders, ${rejected} stale/missing/wrong-ID or missing-translation rejections; exact revenue outputs preserved.`);
console.log(`PASS exit label anchors: ${exitAnchors} actual component layouts across 13 locales, 4 widths and 3 font scales.`);
console.log('PASS controlled fire boundary/13-locale condition labels; safe-scope caveat and translation-toggle binding preserved.');
console.log('PASS actual native caller type probe: 5 current JSX calls and 10 expected invalid-prop rejections; not a whole-project type-check.');
console.log(`PASS actual Reader translation toggle: ${toggleCases} locale/toggle cases route Japanese or translated conditions correctly.`);
