const assert=require('node:assert/strict'),path=require('node:path'),esbuild=require('esbuild');
(async()=>{
 const root=path.resolve(__dirname,'../..'),data=require('../../src/data/restaurant/prior-technical-visual-readings.json'),labels03=require('../../src/data/restaurant/royal-week03-technical-labels.json').ja,labels07=require('../../src/data/restaurant/royal-week07-technical.json').labels.ja;
 const figures=['03','07'].flatMap(w=>require(`../../src/data/restaurant/royal-week${w}-technical.json`).bindings.map(b=>b.figure));
 const expected=[...labels03,...labels07,...figures.map(f=>f.captionJa)];assert.equal(expected.length,20);assert.equal(new Set(data.fields.map(f=>f.text)).size,20);
 const entry=`export {SourcePicture31} from './src/components/restaurant/RestaurantSourcePictures';export {restaurantTechnicalVisualReading} from './src/components/restaurant/RestaurantTechnicalVisualReadings';`;
 const out=await esbuild.build({stdin:{contents:entry,resolveDir:root,loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime','react-native'],plugins:[{name:'render-fixture',setup(b){
 b.onResolve({filter:/RoyalPanels$/},()=>({path:'panel',namespace:'fixture'}));
 b.onResolve({filter:/StudyAppearance$/},()=>({path:'appearance',namespace:'fixture'}));
 b.onResolve({filter:/^@\/data\/restaurant$/},()=>({path:'ui',namespace:'fixture'}));
 b.onLoad({filter:/.*/,namespace:'fixture'},a=>a.path==='panel'?{contents:`import React from 'react';export const RoyalContentPanel=({children})=><div>{children}</div>;`,loader:'jsx',resolveDir:root}:a.path==='ui'?{contents:`export const restaurantUi=text=>text;`,loader:'js'}:{contents:`import React from 'react';export const useStudyAppearance=()=>({colors:{text:'#123',muted:'#456',border:'#789'}});export const TranslationText=({children})=><p>{children}</p>;`,loader:'jsx',resolveDir:root});
 b.onResolve({filter:/\.(png|webp|jpe?g)$/},a=>({path:a.path,namespace:'asset'}));b.onLoad({filter:/.*/,namespace:'asset'},()=>({contents:'module.exports=1;'}));
 }}]});
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),mod={exports:{}};
 new Function('module','exports','require',out.outputFiles[0].text)(mod,mod.exports,n=>n==='react-native'?{View:({children,testID,accessibilityLabel})=>React.createElement('div',{'data-testid':testID,'aria-label':accessibilityLabel},children),Text:({children})=>React.createElement('span',null,children),Image:({testID,accessibilityLabel})=>React.createElement('img',{'data-testid':testID,alt:accessibilityLabel}),ScrollView:({children})=>React.createElement('div',null,children),Pressable:({children})=>React.createElement('button',null,children),StyleSheet:{create:x=>x},useWindowDimensions:()=>({width:390,height:844})}:require(n));
 let kanji=0;
 for(const text of expected){const seg=mod.exports.restaurantTechnicalVisualReading(text);assert(seg,text);assert.equal(seg.map(x=>x.text).join(''),text);for(const s of seg)if(/\p{Script=Han}/u.test(s.text)){assert(s.reading,s.text);assert(/^[\p{Script=Hiragana}ー]+$/u.test(s.reading));kanji++;}assert.equal(mod.exports.restaurantTechnicalVisualReading(text+'変更'),undefined);}
 let renders=0;const locales=['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
 for(const figure of figures)for(const language of locales)for(const width of [280,390,768]){
  const html=renderToStaticMarkup(React.createElement(mod.exports.SourcePicture31,{figure,label:'QA',width,language,showTranslation:language!=='ja'}));assert(html.includes(`source31-native-caption-${figure.id}`));assert(html.includes(mod.exports.restaurantTechnicalVisualReading(figure.captionJa).find(s=>s.reading).reading));renders++;
 }
 console.log(`PASS prior technical exact readings: ${expected.length} fields, ${kanji} authored Kanji spans, 20 changed-text rejects, ${renders} actual SourcePicture JA12 x3-width SSR renders. Existing geometry/official/source wording unchanged; no browser/device acceptance.`);
})().catch(e=>{console.error(e);process.exitCode=1});
