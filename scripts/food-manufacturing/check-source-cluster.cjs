const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),os=require('node:os');
const esbuild=require('esbuild'),root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const cluster=Number(process.argv[2]);assert([40,41,42].includes(cluster),'Pass a supported cluster number:40,41,42');
const pack=read(`src/data/food-manufacturing/source-closure${cluster}.json`),section=pack.sections[0],checks=pack.checks;
const digest=v=>crypto.createHash('sha256').update(JSON.stringify(v,Object.keys(v).sort())).digest('hex');
const lesson=read('src/data/food-manufacturing/lessons.2.ja.json').lessons.find(l=>l.id===section.lessonId);
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let rubyFields=0,numericTokenParityFieldsChecked=0;
function ruby(text,tokens){assert.equal(tokens.map(t=>t.text).join(''),text);for(const t of tokens)if(/\p{Script=Han}/u.test(t.text))assert(/^[ぁ-ゖー]+$/.test(t.reading));rubyFields++;}
const numbers=s=>(s.match(/\d+\.\d+|\d+%/g)||[]).sort();
for(const item of [section,...checks]){
 assert.equal(item.lessonSourceHash,lesson.sourceHash);assert.equal(item.humanReviewed,false);assert.equal(item.domainReviewed,false);
 assert.equal(item.sourceHash,digest(item.textJa?{titleJa:item.titleJa,textJa:item.textJa}:{titleJa:item.titleJa,promptJa:item.promptJa,expectedPointsJa:item.expectedPointsJa}));
 ruby(item.titleJa,item.titleRuby);if(item.textJa)ruby(item.textJa,item.ruby);else{ruby(item.promptJa,item.promptRuby);item.expectedPointsJa.forEach((p,i)=>ruby(p,item.expectedPointsRuby[i]));}
 assert.deepEqual(Object.keys(item.translations).sort(),[...locales].sort());
 for(const t of Object.values(item.translations)){assert.equal(t.sourceHash,item.sourceHash);assert(t.title.trim());
  if(item.textJa){assert(t.text.trim());assert.deepEqual(numbers(t.text),numbers(item.textJa));numericTokenParityFieldsChecked++;}
  else{assert(t.prompt.trim());assert.equal(t.expectedPoints.length,item.expectedPointsJa.length);t.expectedPoints.forEach((p,i)=>{assert(p.trim());assert.deepEqual(numbers(p),numbers(item.expectedPointsJa[i]));numericTokenParityFieldsChecked++;});}
 }
}
assert.equal(checks.length,2);assert.equal(checks.reduce((n,c)=>n+c.expectedPointsJa.length,0),4);
const atomic=read('docs/ssw-workspace/food-manufacturing/source-closure-20261102/atomic-extension40-42.json');
assert.equal(atomic.fullAtomicSourceDecompositionComplete,false);assert.equal(atomic.fullSourceCoverageCertified,false);
const atoms=atomic.records.filter(r=>r.cluster===cluster);assert.equal(atoms.length,2);
for(const atom of atoms){const c=checks.find(c=>c.id===atom.after.checkId);assert(c);assert.equal(atom.after.teachingSourceHash,section.sourceHash);assert.equal(atom.after.teachingTextSha256,crypto.createHash('sha256').update(section.textJa).digest('hex'));assert.equal(atom.after.checkSourceHash,c.sourceHash);assert.equal(atom.after.lessonSourceHash,lesson.sourceHash);assert.deepEqual(atom.sourceRefs,section.sourceRefs);assert.deepEqual(atom.after.expectedPointIndices,[0,1]);}
if(cluster===41){
 const {materialsByProduct,destinationsByProduct}=pack.caseLinks;
 const trace=lot=>{const products=Object.keys(materialsByProduct).filter(p=>materialsByProduct[p].includes(lot)).sort();return {products,destinations:[...new Set(products.flatMap(p=>destinationsByProduct[p]))].sort()};};
 assert.deepEqual(trace('A'),{products:['X'],destinations:['P','Q']});
 assert.deepEqual(trace('B'),{products:['X','Y'],destinations:['P','Q']});
 assert.deepEqual(materialsByProduct.X,['A','B']);
 for(const t of Object.values(section.translations))for(const id of ['A','B','C','X','Y','Z','P','Q','R'])assert(t.text.includes(id),'Missing traceability identifier '+id);
}
const output=fs.mkdtempSync(path.join(os.tmpdir(),`food${cluster}-`));
(async()=>{
 await esbuild.build({stdin:{contents:"export {FoodClosureSupplements} from './src/components/food-manufacturing/FoodClosureSupplements';",resolveDir:root},bundle:true,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime'],outfile:path.join(output,'entry.cjs'),nodePaths:(process.env.NODE_PATH||'').split(path.delimiter),plugins:[{name:'food-cluster-ssr',setup(b){
 b.onResolve({filter:/^react-native$/},()=>({path:require.resolve('react-native-web')}));
 b.onResolve({filter:/^@\/components\/tokutei\/StudyAppearance$/},()=>({path:'translation',namespace:'adapter'}));
 b.onLoad({filter:/.*/,namespace:'adapter'},()=>({contents:"import React from 'react';export const TranslationText=({children})=><div data-testid='translation'>{children}</div>;",loader:'tsx',resolveDir:root}));
 b.onResolve({filter:/^@\//},a=>({path:path.join(root,'src',a.path.slice(2))}));
 b.onLoad({filter:/FoodSourceAssessmentChecks\.tsx$/},a=>({contents:fs.readFileSync(a.path,'utf8').replace('useState(false)','useState(Boolean(globalThis.__foodClusterReveal))'),loader:'tsx',resolveDir:path.dirname(a.path)}));
 }}]});
 const {FoodClosureSupplements}=require(path.join(output,'entry.cjs')),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');let cases=0;
 for(const language of ['ja',...locales])for(const revealed of [false,true]){global.__foodClusterReveal=revealed;const html=renderToStaticMarkup(React.createElement(FoodClosureSupplements,{lesson,language,showTranslation:true,textColor:'#222',readingColor:'#666'}));assert(html.includes(`data-testid="${section.id}"`));
  if(language!=='ja')assert(html.includes(section.translations[language].title));
  for(const c of checks){assert(html.includes(`data-testid="${c.id}"`));assert.equal(html.includes(`data-testid="${c.id}-points"`),revealed);if(language!=='ja'){assert(html.includes(c.translations[language].prompt));if(revealed)for(const p of c.translations[language].expectedPoints)assert(html.includes(p));}}
  cases++;
 }
 for(const altered of [{...lesson,sourceHash:'stale'},{...lesson,id:'missing'}]){const html=renderToStaticMarkup(React.createElement(FoodClosureSupplements,{lesson:altered,language:'vi',showTranslation:true,textColor:'#222',readingColor:'#666'}));for(const item of [section,...checks])assert(!html.includes(item.id));}
 delete global.__foodClusterReveal;
 const result={status:'PASS',sourceTeachingSections:1,openResponseChecks:2,expectedPoints:4,translationPairs:36,numericTokenParityFieldsChecked,alignedRubyFields:rubyFields,actualComponentSsrViews:cases,checkRevealStatesVerified:cases*2,staleOrWrongLessonCasesRejected:2,answerPointsHiddenUntilReveal:true,testOnlyRevealInjection:true,browserTested:false,physicalDeviceTested:false,nativeReviewed:false,domainReviewed:false};
 fs.writeFileSync(path.join(root,`docs/ssw-workspace/food-manufacturing/source-closure-20261102/validation${cluster}.json`),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exitCode=1});
