'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const {transformSync}=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=process.env.AGRI_REPO_ROOT||path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=JSON.parse(read('src/data/agriculture/image-readings.json'));
const figures=JSON.parse(read('src/data/agriculture/recognition-images.json')).images;
const lessons=new Map(JSON.parse(read('src/data/agriculture/lessons.ja.json')).lessons.map(x=>[x.id,x]));
const id='agr-f40-facility-support-greenhouse-insect-light-appearance',f=figures.find(x=>x.id===id);
const filename=path.join(root,'src/components/agriculture/AgricultureImageRuby.tsx');
const code=transformSync(fs.readFileSync(filename,'utf8'),{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code;
const mod=new Module(filename,module);mod.filename=filename;mod.paths=Module._nodeModulePaths(path.dirname(filename));const original=mod.require.bind(mod);mod.require=x=>x==='react-native'?require('react-native-web'):x==='@/data/agriculture/image-readings.json'?data:original(x);mod._compile(code,filename);
const {agricultureImageReading,AgricultureImageRuby}=mod.exports;
const expected={'黄色灯':'きいろとう','青色灯':'あおいろとう'};let renders=0,rejections=0;
for(const lessonId of f.lessonIds){const l=lessons.get(lessonId),props={imageId:id,assetSha256:f.assetSha256,lessonId,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,field:'observation',text:f.observationJa};
 const tokens=agricultureImageReading(props);assert(tokens);assert.equal(tokens.map(x=>x.text).join(''),f.observationJa);
 for(const [text,kana] of Object.entries(expected)){const matches=tokens.filter(x=>x.text===text);assert.equal(matches.length,1);assert.equal(matches[0].readingKana,kana);}
 const html=renderToStaticMarkup(React.createElement(AgricultureImageRuby,{...props,color:'#172733'}));assert(html.includes(`data-testid="agri-image-ruby-${id}-observation"`));for(const k of Object.values(expected))assert(html.includes(k));for(const stale of ['おうしょくとう','せいしょくとう'])assert(!html.includes(stale));renders++;
 for(const change of [{assetSha256:'0'.repeat(64)},{lessonSourceHash:'0'.repeat(64)},{lessonRevision:'stale'},{lessonRevision:undefined},{field:'missing'},{text:f.observationJa+'変更'}]){assert.equal(agricultureImageReading({...props,...change}),null);const fallback=renderToStaticMarkup(React.createElement(AgricultureImageRuby,{...props,...change,color:'#172733'}));assert(!fallback.includes(`data-testid="agri-image-ruby-${id}-`));assert(!fallback.includes('きいろとう'));rejections++;}
}
console.log(`PASS facility-light source reading: two official source kana, ${renders} actual Ruby renders, ${rejections} stale/missing/changed fallback checks; Japanese and all other reading tokens preserved by unit diff.`);
