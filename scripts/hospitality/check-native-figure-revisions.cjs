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
const native={View:element('div'),Text:element('span'),StyleSheet:{create:value=>value},useWindowDimensions:()=>({width:375,height:812,fontScale})};
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
  if(name.startsWith('.'))return load(path.relative(root,path.resolve(path.dirname(file),name+'.ts')));
  return require(name);
 };
 vm.runInNewContext(compiled.outputText,{exports,require:requireIsolated},{filename:file});return exports;
}
const lessons={};for(const group of ['front','planning','service'])for(const lesson of JSON.parse(fs.readFileSync(path.join(root,`src/data/hospitality/${group}.json`))).lessons)lessons[lesson.id]=lesson;
const cases=[
 ['HotelPracticeFloorplan','hotel-front-03','hotel-front-03-practice-map'],
 ['HotelRevenueExample','hotel-planning-02','hotel-planning-02-revenue-example'],
 ['HotelServiceVisualGuide','hotel-service-01','hotel-service-01-native-guide'],
 ['HotelServiceVisualGuide','hotel-service-02','hotel-service-02-native-guide'],
 ['HotelServiceVisualGuide','hotel-service-03','hotel-service-03-native-guide'],
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
 if(name==='HotelServiceVisualGuide'){
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
console.log(`PASS native figure revisions: ${positive} current locale renders, ${rejected} stale/missing/wrong-ID or missing-translation rejections; exact revenue outputs preserved.`);
console.log(`PASS exit label anchors: ${exitAnchors} actual component layouts across 13 locales, 4 widths and 3 font scales.`);
