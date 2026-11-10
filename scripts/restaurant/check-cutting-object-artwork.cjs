const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),esbuild=require('esbuild');
(async()=>{
 const root=path.resolve(__dirname,'../..'),data=require('../../src/data/restaurant/royal-cutting-artwork.json'),code=fs.readFileSync(path.join(root,'src/components/restaurant/RestaurantCuttingGuide.tsx'),'utf8');
 const previous=cp.execFileSync('git',['show','HEAD:src/components/restaurant/RestaurantCuttingGuide.tsx'],{cwd:root,encoding:'utf8'});
 const cuts=s=>s.slice(s.indexOf('const cuts='),s.indexOf('as const;')+9),flow=s=>s.slice(s.indexOf('export function RestaurantCuttingGuide('),s.indexOf('\nconst s='));assert.equal(cuts(code),cuts(previous),'Existing16names/readings must stay exact');assert.equal(flow(code),flow(previous),'Learner flow/labels/captions must stay exact');
 assert(!code.includes('borderLeftWidth:kind==='));assert.equal(data.cuts.length,16);assert.equal(data.cuts[12].nameJa,'かつらむき');
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,data.asset))).digest('hex'),data.sha256);
 const meta=JSON.parse(cp.execFileSync('python',['-c',`from PIL import Image;import json;im=Image.open(${JSON.stringify(path.join(root,data.asset))});print(json.dumps({'width':im.width,'height':im.height,'format':im.format}))`],{encoding:'utf8'}));assert.equal(meta.width,data.width);assert.equal(meta.height,data.height);assert.equal(meta.format,'WEBP');
 for(let i=0;i<16;i++){const c=data.cuts[i].crop;assert.equal(c.x,i%4*data.width/4);assert.equal(c.y,Math.floor(i/4)*data.height/4);assert.equal(c.width,data.width/4);assert.equal(c.height,data.height/4);assert(c.x+c.width<=data.width&&c.y+c.height<=data.height);}
 const lesson=require('../../src/data/restaurant/lessons.1.ja.json').lessons.find(l=>l.id===data.lessonId);global.__cuttingLesson=lesson;
 const out=await esbuild.build({entryPoints:[path.join(root,'src/components/restaurant/RestaurantCuttingGuide.tsx')],bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime','react-native'],plugins:[{name:'image-route-fixture',setup(b){
 b.onResolve({filter:/StudyAppearance$/},()=>({path:'appearance',namespace:'fixture'}));b.onResolve({filter:/^@\/data\/restaurant$/},()=>({path:'data',namespace:'fixture'}));
 b.onLoad({filter:/.*/,namespace:'fixture'},a=>a.path==='data'?{contents:'export const restaurantLesson=()=>globalThis.__cuttingLesson;export const restaurantUi=text=>text;',loader:'js'}:{contents:`import React from 'react';export const useStudyAppearance=()=>({colors:{text:'#123',muted:'#456',border:'#789'}});export const TranslationText=({children})=><p>{children}</p>;`,loader:'jsx',resolveDir:root});
 b.onResolve({filter:/\.webp$/},a=>({path:a.path,namespace:'asset'}));b.onLoad({filter:/.*/,namespace:'asset'},()=>({contents:'module.exports=1;'}));
 }}]});
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),mod={exports:{}};let images=[];
 new Function('module','exports','require',out.outputFiles[0].text)(mod,mod.exports,n=>n==='react-native'?{
 View:({children,testID,accessibilityLabel})=>React.createElement('div',{'data-testid':testID,'aria-label':accessibilityLabel},children),Text:({children})=>React.createElement('span',null,children),Image:({style})=>{images.push(style);return React.createElement('img');},StyleSheet:{create:x=>x}
 }:require(n));
 assert(mod.exports.restaurantHasCuttingArtwork());let renders=0;
 for(const language of ['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){images=[];const html=renderToStaticMarkup(React.createElement(mod.exports.RestaurantCuttingGuide,{lessonId:data.lessonId,language,showTranslation:true}));assert.equal(images.length,16);for(let i=0;i<16;i++){assert(html.includes(`restaurant-cut-object-${i}`));assert.equal(images[i].width,'400%');assert.equal(images[i].height,'400%');assert.equal(images[i].left,`${-(i%4)*100}%`);assert.equal(images[i].top,`${-Math.floor(i/4)*100}%`);}renders++;}
 global.__cuttingLesson={...lesson,sourceHash:'stale'};assert.equal(mod.exports.restaurantHasCuttingArtwork(),false);images=[];renderToStaticMarkup(React.createElement(mod.exports.RestaurantCuttingGuide,{lessonId:data.lessonId,language:'ja',showTranslation:false}));assert.equal(images.length,0,'Stale lesson must not get old name-bound objects');
 console.log(`PASS cutting image replacement:16exact source-named crop cells; ${renders} actual route SSR renders with16bitmap images each; source-hash stale reject; assetSHA/dimensions; old labels/captions/learner route byte-identical. Actual16crop pixels self-inspected separately; not browser/native/domain certification.`);
})().catch(e=>{console.error(e);process.exitCode=1});
