const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const ts=require('typescript'),parser=require('@babel/parser');
const collect=require(path.join(path.dirname(require.resolve('metro/package.json')),'src/ModuleGraph/worker/collectDependencies')).default;
const root=path.resolve(__dirname,'../..');
const options={asyncRequireModulePath:'metro-runtime/src/modules/asyncRequire',dynamicRequires:'reject',inlineableCalls:[],keepRequireNames:true,allowOptionalDependencies:false,unstable_allowRequireContext:false};
function check(text,file){const js=ts.transpileModule(text,{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;return collect(parser.parse(js,{sourceType:'unambiguous'}),options);}
// The original source62 call passed Node tests but Metro rejects conditional require arguments.
assert.throws(()=>check("require(row.specialty==='electrical'?'./electrical.json':'./surface.json')",'regression.ts'),/Invalid call/);
let files=0;
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(/\.tsx?$/.test(entry.name)){check(fs.readFileSync(file,'utf8'),file);files++;}}}
walk(path.join(root,'src/components/manufacturing'));walk(path.join(root,'src/data/manufacturing'));
check(fs.readFileSync(path.join(root,'src/app/specified-skills/manufacturing.tsx'),'utf8'),'manufacturing-route.tsx');
console.log('PASS Manufacturing Metro dependency collection:',files+1,'modules; old conditional require reproduced and rejected.');
