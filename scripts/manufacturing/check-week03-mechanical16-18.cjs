// Regression: numbered test views retain all native labels and reject stale teaching revisions.
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const React=require('react'),ssr=require('react-dom/server'),ts=require('typescript');
const root=path.resolve(__dirname,'../..'),cache=new Map();let viewport=390;
const el=(tag)=>(props)=>React.createElement(tag,{'data-testid':props.testID,'aria-label':props.accessibilityLabel,'data-asset':props.source?.uri},props.children);
const rn={Text:el('p'),View:el('div'),Image:el('img'),Pressable:el('button'),ScrollView:el('div'),Modal:({visible,children})=>visible?React.createElement('div',null,children):null,useWindowDimensions:()=>({width:viewport,height:844})};
const colors={text:'#123',muted:'#456',border:'#abc',translationText:'#234',translation:'#def',background:'#fff'};
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;if(/\.(png|webp)$/.test(file))return {uri:file};if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));if(!fs.existsSync(file)||fs.statSync(file).isDirectory()){for(const e of ['.ts','.tsx','.json'])if(fs.existsSync(file+e))return load(file+e);}const module={exports:{}};cache.set(file,module);const src=fs.readFileSync(file,'utf8'),js=ts.transpileModule(src,{compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}}).outputText;const req=(id)=>{if(id==='react')return React;if(id==='react/jsx-runtime')return require('react/jsx-runtime');if(id==='react-native')return rn;if(id==='react-native-safe-area-context')return {useSafeAreaInsets:()=>({top:0,bottom:0,left:0,right:0})};if(id==='@/components/tokutei/StudyAppearance')return {useStudyAppearance:()=>({colors})};if(id==='@/data/manufacturing/ui')return {manufacturingUi:(_,k)=>k};if(id==='@/data/manufacturing/supplemental-diagrams')return {manufacturingSupplementalCaption:()=>{throw Error('unexpected caption fallback')},manufacturingSupplementalDiagrams:()=>[]};if(id==='./ManufacturingDailyFigure')return {ManufacturingDailyFigure:()=>{throw Error('unexpected image fallback')}};return load(id.startsWith('@/')?path.join(root,'src',id.slice(2)):path.resolve(path.dirname(file),id));};vm.runInNewContext('(function(require,module,exports){'+js+'\n})',{console}, {filename:file})(req,module,module.exports);return module.exports;}
const Main=load(root+'/src/components/manufacturing/DailyManufacturingFigure.tsx').DailyManufacturingFigure,selector=load(root+'/src/data/manufacturing/daily40.ts');
const canonical=JSON.parse(fs.readFileSync(root+'/src/data/manufacturing/mechanical.json')).lessons;
const esc=s=>ssr.renderToStaticMarkup(React.createElement('span',null,s)).replace(/^<span>|<\/span>$/g,'');let renders=0,captions=0,guards=0;
for(const id of ['mfg1-mechanical-lesson-016','mfg1-mechanical-lesson-017','mfg1-mechanical-lesson-018']){
 const lesson=canonical.find(x=>x.id===id),row=selector.dailyFigure40(lesson);if(!row)throw Error('current row '+id);
 const b=fs.readFileSync(root+'/'+row.assetFile);if(b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||b.readUInt32BE(16)!==1536||b.readUInt32BE(20)!==1152||crypto.createHash('sha256').update(b).digest('hex')!==row.sha256||b.length!==row.bytes)throw Error('PNG geometry/hash '+id);
 const svg=fs.readFileSync(root+'/'+row.svgFile);if(crypto.createHash('sha256').update(svg).digest('hex')!==row.svgSha256)throw Error('SVG hash '+id);
 for(viewport of [320,390,844,1024,1440])for(const lang of ['ja','vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){
  const html=ssr.renderToStaticMarkup(React.createElement(Main,{lesson,language:lang,showTranslation:lang!=='ja'}));if((html.match(/data-asset=/g)||[]).length!==1||!html.includes(row.assetFile))throw Error('main reader asset '+id+' '+lang);
  if(lang!=='ja'){const cap=selector.dailyCaption40(lesson,lang);if(!cap||!html.includes(esc(cap.caption)))throw Error('current selected caption '+id+' '+lang);captions++;}
  renders++;
 }
 for(const bad of [{...lesson,sourceHash:'stale'},{...lesson,titleJa:'changed'},{...lesson,summaryJa:'changed'}]){if(selector.dailyFigure40(bad))throw Error('stale guard '+id);guards++;}
}
// Recompute physical vernier positions: 20 divisions span19mm, least count0.05mm.
const start=350+(.2)*45,marks=Array.from({length:21},(_,i)=>start+i*.95*45),main=Array.from({length:23},(_,i)=>350+i*45);let matches=[];
for(let i=0;i<marks.length;i++)if(main.some(x=>Math.abs(x-marks[i])<1e-9))matches.push(i);
if(matches.join(',')!=='4'||Math.abs(18+4*.05-18.2)>1e-10)throw Error('vernier alignment');
const vernier=fs.readFileSync(root+'/assets/manufacturing/royal-weekly-20261107/week03/mechanical-day18-vernier-005.svg','utf8');if(!vernier.includes('M530 295L530 478')||!vernier.includes('18.20 mm'))throw Error('rendered vernier match position');
console.log(JSON.stringify({actualProductionReaderRenders:renders,revisionBoundSelectedCaptions:captions,staleTitleSummarySourceGuards:guards,encodedPngSvgHashAndDimensions:3,vernierCoincidenceIndex:matches[0],viewportWidths:[320,390,844,1024,1440],adapters:'Actual components/selectors/data + RN/imageURI/appearance/safearea/UI adapters; SSR only, not browser/native/device acceptance'}));
