/* Actual source64 + TranslationText renders; RN adapters expose style values, not device pixels. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=process.env.FOOD_QA_REPO_ROOT||path.resolve(__dirname,'../..'),cache=new Map();let mode='night',appearance;
const flatten=s=>Array.isArray(s)?Object.assign({},...s.map(flatten)):s||{};
const wrap=tag=>({children,style,testID,accessibilityLabel})=>{const s=flatten(style);return React.createElement(tag,{'data-testid':testID,'aria-label':accessibilityLabel,'data-color':s.color,'data-bg':s.backgroundColor},children)};
const rn={View:wrap('div'),Text:wrap('span'),ScrollView:wrap('div'),Pressable:wrap('button'),Image:({source,accessibilityLabel,testID})=>React.createElement('img',{src:source?.uri,alt:accessibilityLabel,'data-testid':testID}),Modal:({visible,children})=>visible?React.createElement('section',{'data-modal':'true'},children):null,StyleSheet:{create:s=>s}};
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const m={exports:{}};cache.set(file,m);
 if(file.endsWith('.json')){m.exports=JSON.parse(fs.readFileSync(file,'utf8'));return m.exports;}
 const code=babel.transformSync(fs.readFileSync(file,'utf8'),{filename:file,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:file.endsWith('.tsx')}],['@babel/plugin-transform-react-jsx',{runtime:'classic'}],'@babel/plugin-transform-modules-commonjs']}).code;
 function req(name){
  if(name==='react')return file.endsWith('/StudyAppearance.tsx')?{...React,useContext:()=>({colors:appearance.READING_PALETTES[mode]})}:file.endsWith('/FoodClosureSupplements.tsx')?{...React,useState:initial=>React.useState(initial===false?true:initial)}:React;
  if(name==='react-native')return rn;
  if(name==='@react-native-async-storage/async-storage')return {__esModule:true,default:{}};
  if(name==='@/theme/study-surface')return {STUDY_IVORY:'#f3f0e8'};
  if(name==='./FoodSourceAssessmentChecks')return {FoodSourceAssessmentChecks:()=>null};
  // Isolate the source64 figure; unrelated closure packs are outside this colour regression.
  if(/source-closure\d+\.json$/.test(name)&&!name.endsWith('source-closure64.json'))return {sections:[]};
  const target=name.startsWith('@/')?path.join(root,'src',name.slice(2)):path.resolve(path.dirname(file),name);
  if(target.endsWith('.webp'))return {uri:target};
  for(const p of [target,target+'.ts',target+'.tsx',target+'.json'])if(fs.existsSync(p))return load(p);
  throw Error('Missing actual dependency '+target);
 }
 vm.runInNewContext('(function(require,module,exports,React){'+code+'})',{console})(req,m,m.exports,React);return m.exports;
}
appearance=load(path.join(root,'src/components/tokutei/StudyAppearance.tsx'));
const {FoodClosureSupplements,foodRoyalClosure64FigureMatches}=load(path.join(root,'src/components/food-manufacturing/FoodClosureSupplements.tsx'));
const data=load(path.join(root,'src/data/food-manufacturing/source-closure64.json')),section=data.sections[0];
const lessons=JSON.parse(fs.readFileSync(path.join(root,'src/data/food-manufacturing/lessons.2.ja.json'),'utf8')).lessons,lesson=lessons.find(l=>l.id==='food-2-021');
const ui=load(path.join(root,'src/data/food-manufacturing/daily-ui-translations.json'));
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
const luminance=hex=>{const c=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const render=(language,current=lesson)=>{const p=appearance.READING_PALETTES[mode];return renderToStaticMarkup(React.createElement(FoodClosureSupplements,{lesson:current,language,showTranslation:true,textColor:p.text,readingColor:p.muted}))};
let contexts=0,minContrast=Infinity;
for(mode of ['night','day'])for(const language of ['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){
 const html=render(language),start=html.indexOf('<section data-modal="true">');assert(start>=0);const modal=html.slice(start,html.indexOf('</section>',start));
 assert(modal.includes('data-bg="#fffaf0"'));assert(modal.includes('food64-original-histogram-zoom'));assert(modal.includes(esc(section.textJa)));
 assert(html.slice(0,start).includes('data-color="'+appearance.READING_PALETTES[mode].text+'"'),'Inline text remains theme-aware');
 const spans=[...modal.matchAll(/<span\b([^>]*)>/g)];assert(spans.length>0);
 for(const [,attributes] of spans){const color=attributes.match(/data-color="(#[0-9a-f]+)"/i)?.[1],bg=attributes.match(/data-bg="(#[0-9a-f]+)"/i)?.[1]||'#fffaf0';assert(color,'Every source64 zoom text has explicit ink');const ratio=contrast(color,bg);assert(ratio>=4.5,mode+' '+language+' unreadable ink '+color+' on '+bg+' ratio '+ratio);minContrast=Math.min(minContrast,ratio);}
 if(language!=='ja'){assert(modal.includes(esc(section.translations[language].text)));assert(modal.includes(esc(ui.locales[language].close)));const p=appearance.READING_PALETTES[mode];assert(modal.includes('data-color="'+p.translationText+'" data-bg="'+p.translation+'"'),'Actual TranslationText retains matching theme surface and ink');}
 contexts++;
}
assert(foodRoyalClosure64FigureMatches(lesson,section));
assert(!foodRoyalClosure64FigureMatches({...lesson,sourceHash:'old'},section));assert(!foodRoyalClosure64FigureMatches(lesson,{...section,sourceHash:'old'}));assert(!foodRoyalClosure64FigureMatches(lesson,{...section,id:'missing'}));
assert(!render('vi',{...lesson,sourceHash:'old'}).includes('food64-original-histogram-zoom'));
const saved=section.sourceHash;section.sourceHash='old';assert(!render('vi').includes('food64-original-histogram-zoom'));section.sourceHash=saved;
console.log(JSON.stringify({result:'PASS',actualSource64DayNightLocaleContexts:contexts,actualTranslationText:true,minTextContrast:minContrast,revisionAndLocatorGuards:'PASS',deviceAcceptance:false},null,2));
