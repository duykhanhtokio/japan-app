// Run the production selectors with canonical pack fixtures; no native renderer is required.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {stripTypeScriptTypes}=require('node:module');
const root=require('node:path').resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(`${root}/${p}`,'utf8'));
const helper=fs.readFileSync(`${root}/src/components/restaurant/RestaurantFigureIdentity.ts`,'utf8').replace(/^import .*;\n/m,'').replace('export function','function');
const same=vm.runInNewContext(stripTypeScriptTypes(helper)+';sameRestaurantFigureIdentity');
const packs={'1':read('src/data/restaurant/source31/1.json'),'2':read('src/data/restaurant/source31/2.json')};
const configs=[...['03','04','05','06'].map(w=>({file:`RestaurantWeek${w}TechnicalFigures.tsx`,fn:`restaurantWeek${w}TechnicalKind`,data:`royal-week${w}-technical.json`})),{file:'RoyalRestaurantSourceFigures.ts',fn:'royalRestaurantSourceFigure',data:'royal-source-figure-overrides.json'}];
let accepted=0,rejected=0;
for(const config of configs){
 const code=fs.readFileSync(`${root}/src/components/restaurant/${config.file}`,'utf8');
 const start=code.indexOf(`export function ${config.fn}`),bodyStart=code.indexOf('{',code.indexOf('null{',start));
 // Return object types contain braces, so locate the opening after the return union.
 assert(start>=0&&bodyStart>=0,config.file);
 let end=bodyStart+1,depth=1;for(;depth;end++){if(code[end]==='{')depth++;if(code[end]==='}')depth--;}
 const selectorCode=code.slice(start,end).replace('export function','function');
 const data=read(`src/data/restaurant/${config.data}`);
 const context={sameRestaurantFigureIdentity:same,data,assetLoaders:new Proxy({},{get:()=>()=>1}),require:path=>path.includes('/1.json')?packs['1']:packs['2']};
 const selector=vm.runInNewContext(stripTypeScriptTypes(selectorCode)+`;${config.fn}`,context);
 for(const binding of data.bindings??data.overrides){
  const level=binding.level,row=packs[level].lessons[binding.lessonId],figure=row.figures.find(f=>f.id===binding.figureId);
  assert(figure,`${config.file}:${binding.figureId}`);
  const input=structuredClone(figure),result=selector(input);
  assert(result!==null,`unchanged current figure must retain art: ${binding.figureId}`);accepted++;
  const mutate={captionJa:'changed caption',altJa:'changed alt',assetFile:'changed.webp',sha256:'0'.repeat(64),width:figure.width+1,height:figure.height+1,quizSafe:true,cropBox:{x:1,y:1,width:2,height:2}};
  for(const [key,value] of Object.entries(mutate)){
   const had=Object.hasOwn(figure,key),original=figure[key];figure[key]=value;
   assert.equal(selector(input),null,`${binding.figureId}: canonical ${key} changed with old sourceHash`);rejected++;
   if(had)figure[key]=original;else delete figure[key];
  }
 }
}
console.log(`PASS current figure identity: ${accepted} current bindings retained; ${rejected} stale canonical metadata variants rejected across ${configs.length} production selectors`);
