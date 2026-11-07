const assert=require('node:assert/strict'),path=require('node:path'),esbuild=require('esbuild');
(async()=>{
 const root=path.resolve(__dirname,'../..'),rows=require('../../src/data/restaurant/diagrams.json').diagrams;
 const build=await esbuild.build({entryPoints:[path.join(root,'src/components/restaurant/RestaurantDiagramReadings.ts')],bundle:true,write:false,platform:'node',format:'cjs'}),m={exports:{}};new Function('module','exports',build.outputFiles[0].text)(m,m.exports);const select=m.exports.restaurantDiagramReadings;
 let fields=0,kanji=0,rejects=0;
 for(const row of rows){const r=select(row);assert(r,row.id);for(const [text,segments]of [[row.titleJa,r.title],[row.captionJa,r.caption],...row.nodes.map(n=>[n.labelJa,r.nodes[n.id]])]){assert.equal(segments.map(x=>x.text).join(''),text);for(const s of segments)if(/\p{Script=Han}/u.test(s.text)){assert(s.reading,s.text);assert(/^[\p{Script=Hiragana}ー]+$/u.test(s.reading));kanji++;}fields++;}
 for(const [key,value]of Object.entries({titleJa:'変更',captionJa:'変更',nodes:row.nodes.map((n,i)=>i? n:{...n,labelJa:'変更'}),links:[{from:'wrong',to:'wrong'}],lessonIds:['other'],translations:{en:{title:'stale'}}})){assert.equal(select({...row,[key]:value}),null,`${row.id}:${key}`);rejects++;}}
 const component=await esbuild.build({entryPoints:[path.join(root,'src/components/restaurant/RestaurantDiagrams.tsx')],bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime','react-native'],plugins:[{name:'render-fixture',setup(b){
 b.onResolve({filter:/^@\/data\/restaurant$/},()=>({path:'restaurant',namespace:'fixture'}));
 b.onResolve({filter:/StudyAppearance$/},()=>({path:'appearance',namespace:'fixture'}));
 b.onLoad({filter:/.*/,namespace:'fixture'},a=>a.path==='restaurant'?{contents:`export const restaurantDiagrams=${JSON.stringify(rows)};`,loader:'js'}:{contents:`import React from 'react';export const useStudyAppearance=()=>({colors:{text:'#123',muted:'#456',border:'#789'}});export const TranslationText=({children})=><p>{children}</p>;`,loader:'jsx',resolveDir:root});
 }}]});
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),mod={exports:{}};
 new Function('module','exports','require',component.outputFiles[0].text)(mod,mod.exports,n=>n==='react-native'?{View:({children,testID,accessibilityLabel})=>React.createElement('div',{'data-testid':testID,'aria-label':accessibilityLabel},children),Text:({children})=>React.createElement('span',null,children),StyleSheet:{create:x=>x}}:require(n));let rendered=0,edges=0;
 for(const row of rows)for(const lessonId of row.lessonIds)for(const language of ['ja',...Object.keys(row.translations)]){
 const html=renderToStaticMarkup(React.createElement(mod.exports.RestaurantDiagrams,{lessonId,language,showTranslation:true}));assert(html.includes(`restaurant-diagram-${row.id}`));assert(html.includes(select(row).title.find(s=>s.reading).reading));for(const link of row.links){assert(html.includes(`restaurant-diagram-edge-${row.id}-${link.from}-${link.to}`));edges++;}rendered++;
 }
 console.log(`PASS native diagram readings: ${rows.length} current diagrams, ${fields} exact fields, ${kanji} authored Kanji spans, ${rejects} stale variants rejected, ${rendered} actual component JA12 lesson SSR renders, ${edges} original directed edge renders. Not browser/native-device certification.`);
})().catch(e=>{console.error(e);process.exitCode=1});
