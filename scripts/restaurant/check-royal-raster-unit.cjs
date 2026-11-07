const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const root=path.resolve(__dirname,'../..'),React=require('react'),server=require('react-dom/server'),ts=require('typescript');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const daily=read('src/data/restaurant/daily-learning.json'),lessons=[1,2].flatMap(n=>read(`src/data/restaurant/lessons.${n}.ja.json`).lessons);
const id=process.argv[2];assert(id,'Pass one current lesson ID');const lesson=lessons.find(l=>l.id===id),entry=daily.royalRasterOverrides.find(o=>o.lessonId===id);assert(lesson&&entry);
assert.equal(entry.sourceHash,lesson.sourceHash);assert.equal(hash(fs.readFileSync(path.join(root,entry.asset))),entry.sha256);
const caption=entry.teachingCaption;assert(caption,'Unit requires a rendered revision-bound teaching caption');assert.equal(hash(caption.textJa),caption.sourceHash);assert.equal(caption.furigana.map(s=>s.text).join(''),caption.textJa);
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];for(const locale of locales){assert.equal(caption.translations[locale].sourceHash,caption.sourceHash);assert(caption.translations[locale].text.length>0);}
let viewport=390;
const flat=s=>Array.isArray(s)?Object.assign({},...s.filter(Boolean).map(flat)):s,node=tag=>props=>React.createElement(tag,{'data-testid':props.testID,style:flat(props.style)},props.children);
const native={View:node('div'),Text:node('span'),Image:props=>React.createElement('img',{src:props.source,'data-testid':props.testID,alt:props.accessibilityLabel,style:flat(props.style)}),StyleSheet:{create:x=>x},useWindowDimensions:()=>({width:viewport,height:844})};
const cache={};
function load(file){if(cache[file])return cache[file];const source=fs.readFileSync(path.join(root,file),'utf8'),compiled=ts.transpileModule(source,{reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}});assert(!(compiled.diagnostics||[]).some(d=>d.category===ts.DiagnosticCategory.Error));const exports={};cache[file]=exports;
 const req=name=>name==='react'?React:name==='react-native'?native:name.endsWith('StudyAppearance')?{TranslationText:node('span'),useStudyAppearance:()=>({colors:{border:'#bb9f62',background:'#fffaf0',translation:'#f4e8cf'}})}:name.endsWith('RoyalPanels')?{RoyalContentPanel:node('div')}:name==='./RestaurantReading'?{RestaurantReading:props=>React.createElement('span',null,props.text)}:name==='@/data/restaurant'?{restaurantLesson:(id,level)=>lessons.find(l=>l.id===id&&l.level===level),restaurantLessonTranslation:()=>null}:name==='@/data/restaurant/daily-learning.json'?{default:daily}:name.startsWith('@/data/restaurant/')?{default:read('src/data/restaurant/'+name.split('/').pop())}:name.startsWith('./Restaurant')?load('src/components/restaurant/'+name.slice(2)+'.tsx'):name.startsWith('../../../assets/')?name:(()=>{throw Error(name);})();vm.runInNewContext(compiled.outputText,{exports,require:req,React,console});return exports;}
const renderer=load('src/components/restaurant/RestaurantDailyLearning.tsx');
assert.equal(hash(fs.readFileSync(path.join(root,'src/components/restaurant/RestaurantDailyLearning.tsx'))),daily.renderSourceSha256);
const render=(l,locale='ja',translated=false)=>server.renderToStaticMarkup(React.createElement(renderer.RestaurantDailyFigure,{lesson:l,language:locale,showTranslation:translated}));
for(const width of [320,390,844,1024,1440]){viewport=width;const html=render(lesson);assert(html.includes(entry.asset));assert(html.includes(caption.textJa));assert(html.includes(lesson.objectiveJa));assert.equal((html.match(/<img/g)||[]).length,1);assert(!html.includes('NaN'));}
for(const locale of locales){const html=render(lesson,locale,true);assert(html.includes(caption.translations[locale].text));}
assert.equal(render({...lesson,sourceHash:'stale-unit'}),'');
const binding=daily.bindings.find(b=>b.lessonId===id),prior=binding.sourceHash;binding.sourceHash='future-unit';assert(!render({...lesson,sourceHash:'future-unit'}).includes(entry.asset));binding.sourceHash=prior;
const old=entry.sourceHash;entry.sourceHash='stale-raster';assert(!render(lesson).includes(entry.asset));entry.sourceHash=old;
const target=caption.translations.en,oldCaptionHash=target.sourceHash;target.sourceHash='stale-caption';assert(!render(lesson,'en',true).includes(target.text));target.sourceHash=oldCaptionHash;
console.log(`PASS ${id}: actual raster/caption rendering JA+12 locales, 5 viewport widths, current/stale/future art and stale-caption guards, asset/renderer/source hashes. No physical-device/domain acceptance.`);
