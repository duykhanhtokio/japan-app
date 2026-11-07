// Real recognition, study-gallery and actual mock resolver contracts; neutral quiz labels in every UI locale.
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const React=require('react'),ssr=require('react-dom/server'),ts=require('typescript');
const root=path.resolve(__dirname,'../..'),cache=new Map();
const el=(tag)=>(props)=>React.createElement(tag,{'data-testid':props.testID,'aria-label':props.accessibilityLabel,'data-asset':props.source?.uri},props.children);
const rn={StyleSheet:{create:x=>x,flatten:x=>Array.isArray(x)?Object.assign({},...x):x},Text:el('p'),View:el('div'),Image:el('img'),Pressable:el('button'),ScrollView:el('div'),Modal:({visible,children})=>visible?React.createElement('div',null,children):null,useWindowDimensions:()=>({width:390,height:844})};
const colors={text:'#123',muted:'#456',border:'#abc',translationText:'#234',translation:'#def',background:'#fff'};
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;if(/\.(png|webp)$/.test(file))return {uri:file};if(file.endsWith('.json')){const exports=JSON.parse(fs.readFileSync(file,'utf8'));cache.set(file,{exports});return exports;}if(!fs.existsSync(file)||fs.statSync(file).isDirectory()){for(const e of ['.ts','.tsx','.json'])if(fs.existsSync(file+e))return load(file+e);if(fs.existsSync(file)&&fs.statSync(file).isDirectory())return load(path.join(file,'index.ts'));}const module={exports:{}};cache.set(file,module);const src=fs.readFileSync(file,'utf8'),js=ts.transpileModule(src,{compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}}).outputText;const req=(id)=>{if(id==='react')return {...React,useState:(initial)=>React.useState(forced.has(hook++)?true:initial)};if(id==='@/components/tokutei/TokuteiChrome')return {TokuteiHeader:({title})=>React.createElement('h1',null,title)};if(id==='react/jsx-runtime')return require('react/jsx-runtime');if(id==='react-native')return rn;if(id==='react-native-safe-area-context')return {useSafeAreaInsets:()=>({top:0,bottom:0,left:0,right:0})};if(id==='@/components/tokutei/StudyAppearance')return {useStudyAppearance:()=>({colors}),TranslationText:el('aside'),ReadingAppearanceControl:()=>null};return load(id.startsWith('@/')?path.join(root,'src',id.slice(2)):path.resolve(path.dirname(file),id));};vm.runInNewContext('(function(require,module,exports){'+js+'\n})',{console}, {filename:file})(req,module,module.exports);return module.exports;}

let hook=0,forced=new Set(); const assert=require('assert/strict');const render=(component,props,expanded=false)=>{hook=0;forced=new Set(expanded?[0]:[]);return ssr.renderToStaticMarkup(React.createElement(component,props));};



const canonical=['mechanical','electrical','surface'].flatMap(s=>load(root+'/src/data/manufacturing/'+s+'.json').lessons);
const royal=load(root+'/src/data/manufacturing/royal-week01-technical-locales.json').locales.ja;
const Reading=load(root+'/src/data/manufacturing/illustration-readings.ts');const registry=load(root+'/src/data/manufacturing/illustration-readings.json');
const Current=load(root+'/src/components/manufacturing/RoyalWeek01TechnicalDetails.tsx').RoyalWeek01TechnicalDetails;
const Field=load(root+'/src/components/manufacturing/ManufacturingSourceFieldText.tsx');
let allHtml="";let rows=0,fullFields=0,contextNegatives=0;const unique=new Set();
for(const [id,r] of Object.entries(royal.lessons)){
 if(Number(id.split('-').at(-1).replace(/^l/,''))>14)continue;
 const lesson=canonical.find(l=>l.id===id);assert.ok(lesson);const html=render(Current,{lesson,language:'ja'});allHtml+=html;
 for(const text of [royal.labels.practice+' · '+r.title,r.structureTitle,r.structureText,r.exampleTitle,r.exampleText].filter(Boolean)){
  if(!Reading.manufacturingIllustrationTokensFor(text))continue;
  const label='aria-label="'+text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')+'"';if(html.includes(label)){fullFields++;unique.add(text);}
 }
 const stale={...lesson,paragraphs:lesson.paragraphs.map((p,i)=>i? p:{...p,textJa:p.textJa+' stale'})};const bad=render(Current,{lesson:stale,language:'ja'});if(bad.includes('data-testid="manufacturing-illustration-ruby"'))console.log(bad.match(/.{0,70}data-testid="manufacturing-illustration-ruby".{0,100}/g));assert.ok(!bad.includes('data-testid="manufacturing-illustration-ruby"'),id);contextNegatives++;
 assert.equal(render(Current,{lesson:{...lesson,sourceHash:'stale'},language:'ja'}),'');contextNegatives++;rows++;
}
assert.equal(rows,18);const missing=[];for(const [text,entry]of Object.entries(registry.nativeEntries)){if(entry.contextReview!=='ai_whole_field_compared')continue;const label='aria-label="'+text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;')+'"';if(allHtml.includes(label))unique.add(text);else missing.push(text);}assert.deepEqual(missing,[]);assert.equal(unique.size,84);
let approved=0,blocked=0;for(const [text,r]of Object.entries(registry.nativeEntries)){if(r.contextReview==='ai_whole_field_compared'){assert.ok(Reading.manufacturingIllustrationTokensFor(text));approved++;}else{assert.equal(Reading.manufacturingIllustrationTokensFor(text),undefined);blocked++;}}
assert.equal(approved,84);assert.equal(blocked,1606);
const cases=fs.readFileSync(root+'/src/data/manufacturing/daily40-assets.ts','utf8');const keys=[...cases.matchAll(/case "([^"]+)"/g)].map(m=>m[1]);assert.equal(keys.length,new Set(keys).size);for(const day of ['94','95'])assert.ok(keys.some(k=>k.includes('electrical-day'+day+'-')));
console.log(JSON.stringify({actualCurrentNativeSourceRows:rows,acceptedPrimaryUniqueFullFieldsRendered:unique.size,metadataValueIntersections:fullFields,currentBodyAndHashNegatives:contextNegatives,allPrimaryNativeEntries:approved+blocked,unreviewedFailClosed:blocked,uniqueLazySwitchCases:keys.length,day94day95BindingsPreserved:true,scope:'narrow merged current-source delta, no pixel/native/domain/device approval'}));
