// Regression: numbered test views retain all native labels and reject stale teaching revisions.
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const React=require('react'),ssr=require('react-dom/server'),ts=require('typescript');
const root=path.resolve(__dirname,'../..'),cache=new Map();let viewport=390,forceShow=false,hookIndex=0;const reactFacade={...React,useState:initial=>[forceShow&&hookIndex++===0?true:initial,()=>{}]};
const el=(tag)=>(props)=>React.createElement(tag,{'data-testid':props.testID,'aria-label':props.accessibilityLabel,'data-asset':props.source?.uri},props.children);
const rn={Text:el('p'),View:el('div'),Image:el('img'),Pressable:el('button'),ScrollView:el('div'),Modal:({visible,children})=>visible?React.createElement('div',null,children):null,useWindowDimensions:()=>({width:viewport,height:844})};
const colors={text:'#123',muted:'#456',border:'#abc',translationText:'#234',translation:'#def',background:'#fff'};
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;if(/\.(png|webp)$/.test(file))return {uri:file};if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));if(fs.existsSync(file)&&fs.statSync(file).isDirectory())return load(path.join(file,'index.ts'));if(!fs.existsSync(file)){for(const e of ['.ts','.tsx','.json'])if(fs.existsSync(file+e))return load(file+e);}const module={exports:{}};cache.set(file,module);const src=fs.readFileSync(file,'utf8'),js=ts.transpileModule(src,{compilerOptions:{esModuleInterop:true,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}}).outputText;const req=(id)=>{if(id==='react')return reactFacade;if(id==='react/jsx-runtime')return require('react/jsx-runtime');if(id==='react-native')return rn;if(id==='react-native-safe-area-context')return {useSafeAreaInsets:()=>({top:0,bottom:0,left:0,right:0})};if(id==='@/components/tokutei/StudyAppearance')return {useStudyAppearance:()=>({colors}),ReadingAppearanceControl:()=>null,TranslationText:({children})=>React.createElement('aside',null,children)};if(id==='@/components/tokutei/TokuteiChrome')return {TokuteiHeader:()=>null};if(id==='@/data/manufacturing/supplemental-diagrams')return {manufacturingSupplementalCaption:()=>{throw Error('unexpected caption fallback')},manufacturingSupplementalDiagrams:()=>[]};if(id==='./ManufacturingDailyFigure')return {ManufacturingDailyFigure:()=>{throw Error('unexpected image fallback')}};return load(id.startsWith('@/')?path.join(root,'src',id.slice(2)):path.resolve(path.dirname(file),id));};vm.runInNewContext('(function(require,module,exports){'+js+'\n})',{console}, {filename:file})(req,module,module.exports);return module.exports;}
const ui=load(root+'/src/data/manufacturing/ui.ts').manufacturingUi,api=load(root+'/src/data/manufacturing/recognition38/index.ts');
const {RecognitionReader,RecognitionQuestionFigures}=load(root+'/src/components/manufacturing/RecognitionManufacturing.tsx'),Supplemental=load(root+'/src/components/manufacturing/SupplementalManufacturingDiagrams.tsx').SupplementalFigure;
const esc=s=>ssr.renderToStaticMarkup(React.createElement('span',null,s)).replace(/^<span>|<\/span>$/g,'');
const langs=['ja','vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const lessons=['mechanical','electrical','surface'].flatMap(s=>api.manufacturingRecognitionLessons(s));const packs=api.manufacturingRecognitionPacks();if(packs.length!==15)throw Error('recognition packs');let directCases=0,readerCases=0,quizCases=0,staleCases=0;
function render(C,props,show=false){forceShow=show;hookIndex=0;return ssr.renderToStaticMarkup(React.createElement(C,props));}
for(const language of langs){
 const imageLabel='CURRENT_NATIVE_IMAGE_'+language,sourceCaption='JP_SOURCE_CAPTION_SHOULD_NOT_NAME_TRANSLATED_CONTROL';
 const props={item:{id:'a11y',lessonId:'current',lessonSourceHash:'current',assetFile:'a11y',width:100,height:80,captionJa:sourceCaption,scopeLimits:[]},language,showTranslation:true,translatedCaption:'CURRENT_TRANSLATED_CAPTION_'+language,imageAlt:imageLabel,imageSource:{uri:'selected'}};
 const html=render(Supplemental,props);if(!html.includes(esc(ui(language,'imageZoom')+' · '+imageLabel))||html.includes(esc(ui(language,'imageZoom')+' · '+sourceCaption)))throw Error('translated zoom accessible name '+language);
 const quiz=render(Supplemental,{...props,hideCaption:true});if(!quiz.includes('aria-label="'+esc(ui(language,'questionFigure'))+'"')||quiz.includes(sourceCaption)||quiz.includes(imageLabel)||quiz.includes('CURRENT_TRANSLATED_CAPTION_'))throw Error('neutral quiz label/no hidden-caption leak '+language);directCases+=2;
}
for(const pack of packs){
 const lesson=lessons.find(l=>api.manufacturingRecognitionPackForLesson(l)?.id===pack.id);if(!lesson)throw Error('pack lesson '+pack.id);
 const teaching=pack.assets.filter(a=>a.role!=='quiz'&&a.role!=='quiz_only'),assets=teaching.length?teaching:pack.assets;
 for(const language of langs)for(const show of [false,true]){
  const html=render(RecognitionReader,{lesson,language,onBack:()=>{},onComplete:()=>{},saving:false,saveError:false},show),caption=show?api.manufacturingRecognitionCaption(pack,language):null;
  const labels=[...html.matchAll(/<img[^>]+aria-label="([^"]*)"/g)].map(x=>x[1]);if(labels.length!==assets.length)throw Error('teaching image count '+pack.id);
  for(let i=0;i<assets.length;i++)if(labels[i]!==esc(caption??assets[i].altJa))throw Error('selected teaching image caption '+pack.id+' '+language+' '+show);
  readerCases++;
 }
 for(const question of pack.questions)for(const language of langs){
  const html=render(RecognitionQuestionFigures,{question,language}),labels=[...html.matchAll(/<img[^>]+aria-label="([^"]*)"/g)].map(x=>x[1]);if(labels.length!==question.imageAssetIds.length||labels.some(x=>x!==esc(ui(language,'questionFigure'))))throw Error('quiz neutral selected images '+question.id+' '+language);
  const translated=api.manufacturingRecognitionCaption(pack,language);if(html.includes(esc(pack.captionJa))||(translated&&html.includes(esc(translated))))throw Error('quiz teaching caption leak '+question.id);quizCases++;
 }
 const bad={...pack.questions[0],sourceHash:'stale'};if(render(RecognitionQuestionFigures,{question:bad,language:'vi'}))throw Error('stale quiz asset');staleCases++;
}
console.log(JSON.stringify({neutralQuizAndNativeControlCases:directCases,actualTeachingReaderCases:readerCases,actualUnsubmittedQuizCases:quizCases,staleQuizCasesRejected:staleCases,recognitionPacks:packs.length,locales:langs.length,teachingCaptionsInQuiz:0,adapters:'Actual recognitionAPI/components/data +ReactSSR; controlledfirsttranslationhook, RN/imageURI/appearance/header adapters. No native/domain/browser/device acceptance.'}));
