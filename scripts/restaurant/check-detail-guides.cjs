/** Data arithmetic and real React/RNW server rendering, not browser or native certification. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),out=process.env.RESTAURANT_DETAIL_QA_DIR||'/tmp/restaurant30-detail-ssr';
const data=JSON.parse(fs.readFileSync(path.join(root,'src/data/restaurant/detail-guides.json'))),locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
fs.mkdirSync(out,{recursive:true});
for(const [key,label] of Object.entries(data.labels)){
 assert.equal(label.segments.map(x=>x.text).join(''),label.ja,key);
 for(const token of label.segments)if(/[一-龯々〆ヵヶ]/.test(token.text))assert(/^[ぁ-ゖー]+$/.test(token.reading||''),key+'/'+token.text);
 assert.deepEqual(Object.keys(label.translations).sort(),[...locales].sort());
 for(const locale of locales)assert(typeof label.translations[locale]==='string'&&label.translations[locale].trim(),key+'/'+locale);
}
assert.equal(data.figures.sales-data.figures.cost,data.figures.gross);
assert.equal(data.figures.labor/data.figures.gross*100,40);
assert.equal(data.figures.labor/data.figures.sales*100,26);
for(const [key,expected] of Object.entries({sales:5000,cost:1750,gross:3250,labor:1300}))assert.equal(data.figures[key]/data.figures.hours,expected);
assert.equal(data.guides.find(x=>x.id==='complaint').steps.length,5);
assert.equal(data.guides.find(x=>x.id==='timeline').steps.length,4);
(async()=>{await require('esbuild').build({stdin:{contents:`import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {RestaurantDetailGuides} from './src/components/restaurant/RestaurantDetailGuides';import {RestaurantQscGuide} from './src/components/restaurant/RestaurantQscGuide';import {RestaurantToolGallery} from './src/components/restaurant/RestaurantToolGallery';import {RestaurantHygieneRecords} from './src/components/restaurant/RestaurantHygieneRecords';export const renderQsc=(props)=>renderToStaticMarkup(<RestaurantQscGuide {...props}/>);export const renderTools=(props)=>renderToStaticMarkup(<RestaurantToolGallery {...props}/>);export const renderRecords=(props)=>renderToStaticMarkup(<RestaurantHygieneRecords {...props}/>);export const render=(props)=>renderToStaticMarkup(<RestaurantDetailGuides {...props}/>);`,resolveDir:root,loader:'tsx'},outfile:path.join(out,'entry.cjs'),bundle:true,platform:'node',format:'cjs',nodePaths:(process.env.NODE_PATH||'').split(path.delimiter),jsx:'automatic',tsconfigRaw:{compilerOptions:{jsx:'react-jsx'}},external:['react','react-dom','react-dom/server'],define:{'process.env.NODE_ENV':'"development"','__DEV__':'true'},plugins:[{name:'detail-component-only',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^@react-native-async-storage\/async-storage$/},()=>({path:'storage',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},()=>({contents:'export default {getItem:async()=>null,setItem:async()=>{}}',loader:'js'}));
 b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2));for(const ext of ['','.tsx','.ts','.json','/index.ts'])if(fs.existsSync(p+ext)&&fs.statSync(p+ext).isFile())return{path:p+ext};throw Error(p)});
 }}]});
const {render,renderQsc,renderTools,renderRecords}=require(path.join(out,'entry.cjs'));let cases=0;
for(const guide of data.guides)for(const language of ['ja',...locales])for(const showTranslation of [false,true]){
 const html=render({lessonId:guide.lessonIds[0],language,showTranslation});assert(html.includes(`restaurant-detail-${guide.id}`));
 if(showTranslation&&language!=='ja')assert(html.includes(data.labels[guide.title].translations[language]));
 if(guide.kind==='ratio'){assert(html.includes('?%'));assert(html.includes('aria-expanded="false"'));}
 if(language==='vi'&&showTranslation)fs.writeFileSync(path.join(out,guide.id+'-vi.html'),html);cases++;
}
assert.equal(render({lessonId:'rst-2-ops-01',language:'vi',showTranslation:true}),'');
let additionalCases=0;
for(const [fn,lesson,id] of [[renderQsc,'rst-2-ops-01','restaurant-qsc-guide'],[renderTools,'rst-1-cook-14','restaurant-tool-gallery'],[renderTools,'rst-1-cook-15','restaurant-tool-gallery'],[renderTools,'rst-2-cook-06','restaurant-tool-gallery'],[renderRecords,'rst-1-hyg-16','restaurant-hygiene-records']]){
 for(const language of ['ja',...locales])for(const showTranslation of [false,true]){const html=fn({lessonId:lesson,language,showTranslation});assert(html.includes(id),id+'/'+lesson);assert(!html.includes('undefined')&&!html.includes('NaN'));additionalCases++;}
 assert.equal(fn({lessonId:'rst-unrelated',language:'vi',showTranslation:true}),'');
}
const hash=name=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex');
const result={status:'DETAIL_GUIDES_DATA_AND_SSR_PASS',labels:Object.keys(data.labels).length,locales:12,arithmeticChecks:7,serverRenderCases:cases,additionalComponentCases:additionalCases,unrelatedLessonExcluded:true,defaultAnswersHidden:true,dataSha256:hash('src/data/restaurant/detail-guides.json'),componentSha256:hash('src/components/restaurant/RestaurantDetailGuides.tsx'),scope:'Real React/RNW static server-rendering; AsyncStorage adapted. No click, layout, browser, Expo or native execution certification.',browserTested:false,nativeDeviceTested:false,sourceFigureCoverageCertified:false};
fs.writeFileSync(path.join(root,'docs/ssw-workspace/restaurant/completion30-detail-guide-qa.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));

})().catch(e=>{console.error(e);process.exitCode=1});
