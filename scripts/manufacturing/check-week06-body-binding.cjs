const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert'),babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const plugins=[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],'@babel/plugin-transform-react-jsx','@babel/plugin-transform-modules-commonjs'];
const root=path.resolve(__dirname,'../..');
function run(file,req){const m={exports:{}};vm.runInNewContext(babel.transformSync(fs.readFileSync(path.join(root,file),'utf8'),{filename:file,plugins,babelrc:false,configFile:false}).code,{exports:m.exports,require:req,React});return m.exports;}
const api=run('src/data/manufacturing/daily40.ts',p=>p==='./daily40-assets'?{dailyAssetByFile40:()=>({uri:'test-current-art'})}:require(path.resolve(root,'src/data/manufacturing',p)));
const component=run('src/components/manufacturing/DailyManufacturingFigure.tsx',p=>p==='@/data/manufacturing/daily40'?api:Object.fromEntries(['RoyalWeek03MechanicalDetails','RoyalWeek01TechnicalDetails','SupplementalFigure','ManufacturingDailyFigure'].map(name=>[name,props=>React.createElement('div',{'data-marker':name},props.item?.captionJa??'')]))).DailyManufacturingFigure;
let actual=0,negative=0,renders=0;
for(const tr of ['mechanical','electrical','surface'])for(const lesson of require(path.join(root,'src/data/manufacturing/'+tr+'.json')).lessons){
 assert(api.dailyBodyCurrent40(lesson),lesson.id);actual++;
 if(!/0(?:3[6-9]|4[0-2])$/.test(lesson.id))continue;
 assert(api.dailyFigure40(lesson),lesson.id);
 const html=renderToStaticMarkup(React.createElement(component,{lesson,language:'ja',showTranslation:false}));
 assert(html.includes('data-marker'),lesson.id);renders++;
 for(const changed of [{objectiveJa:lesson.objectiveJa+'changed'},{paragraphs:lesson.paragraphs.map((p,i)=>i?p:{...p,textJa:p.textJa+'changed'})},{paragraphs:lesson.paragraphs.slice(1)},{sourceHash:'stale'}]){
  const bad={...lesson,...changed};assert.equal(api.dailyBodyCurrent40(bad),false);assert.equal(api.dailyFigure40(bad),null);
  assert.equal(renderToStaticMarkup(React.createElement(component,{lesson:bad,language:'ja',showTranslation:false})), '');negative++;
 }
}
assert(api.dailyBodyCurrent40({id:'mfg1-mechanical-source-note',specialty:'mechanical'}));
assert.equal(renders,21);assert.equal(negative,84);
console.log(JSON.stringify({result:'PASS',canonicalLessonsUnchanged:actual,week06CurrentReaderSSR:renders,week06MutatedReaderSSRRejected:negative,scope:'Actual data helper and wrapper executed; leaf components, RN and asset URI substituted. Full browser/device not performed.'}));
