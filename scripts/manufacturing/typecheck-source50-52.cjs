// Strict helper check with the actual exported types, without loading megabytes
// of unrelated JSON/import implementations into the compiler. Runtime JSON and
// integration paths are covered by the separate guards/component tests.
const ts=require('typescript'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),base=path.join(root,'__mfg50_52_typecheck_virtual');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function exportedTypes(p){const source=ts.createSourceFile(p,read(p),ts.ScriptTarget.ES2020,true);return source.statements.filter(n=>ts.isTypeAliasDeclaration(n)&&n.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)).map(n=>n.getText(source)).join('\n');}
const files={
 [path.join(base,'index.ts')]:exportedTypes('src/data/manufacturing/index.ts'),
 [path.join(base,'translations.ts')]:exportedTypes('src/data/manufacturing/translations.ts'),
 [path.join(base,'source49-readings.ts')]:read('src/data/manufacturing/source49-readings.ts'),
 [path.join(base,'source50-overview.ts')]:read('src/data/manufacturing/source50-overview.ts'),
 [path.join(base,'source52-thermal.ts')]:read('src/data/manufacturing/source52-thermal.ts'),
 [path.join(base,'globals.d.ts')]:'declare function require(path: string): any;'
};
const options={strict:true,noEmit:true,skipLibCheck:true,target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,types:[]};
const host=ts.createCompilerHost(options),exists=host.fileExists,originalRead=host.readFile;
host.fileExists=p=>Object.hasOwn(files,p)||exists(p);host.readFile=p=>Object.hasOwn(files,p)?files[p]:originalRead(p);
host.getSourceFile=(file,languageVersion)=>{const source=host.readFile(file);return source===undefined?undefined:ts.createSourceFile(file,source,languageVersion,true);};
host.resolveModuleNames=(names,containingFile)=>names.map(n=>{
 const candidate=path.resolve(path.dirname(containingFile),n+'.ts');return Object.hasOwn(files,candidate)?{resolvedFileName:candidate,extension:ts.Extension.Ts}:ts.resolveModuleName(n,containingFile,options,host).resolvedModule;
});
const program=ts.createProgram(Object.keys(files),options,host),diagnostics=ts.getPreEmitDiagnostics(program);
if(diagnostics.length){console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCurrentDirectory:()=>root,getCanonicalFileName:x=>x,getNewLine:()=> '\n'}));process.exitCode=1;}
else{
 const result={status:'PASS',strict:true,diagnostics:0,helpers:['src/data/manufacturing/source49-readings.ts','src/data/manufacturing/source50-overview.ts','src/data/manufacturing/source52-thermal.ts'],sourceSha256:crypto.createHash('sha256').update(files[path.join(base,'source49-readings.ts')]).digest('hex'),
  typeSources:['src/data/manufacturing/index.ts','src/data/manufacturing/translations.ts'],
  scope:'Full new helper, exact exported type declarations extracted by TypeScript AST, Node-compatible require signature; JSON schemas and full dependency implementations excluded and checked separately at runtime.',
  fullAppTypecheck:false};
 fs.writeFileSync(path.join(root,'docs/ssw-workspace/source-coverage-v2/manufacturing-source50-52-typecheck.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}
