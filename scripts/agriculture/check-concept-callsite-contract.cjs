#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const assert=require('node:assert/strict');
const ts=require('typescript');
const root=path.resolve(__dirname,'../..');
const inventory=[];
function collect(dir){for(const name of fs.readdirSync(dir)){const p=path.join(dir,name);if(fs.statSync(p).isDirectory())collect(p);else if(p.endsWith('.tsx'))inventory.push(p);}}
collect(path.join(root,'src/components/agriculture'));
collect(path.join(root,'src/components/tokutei'));
inventory.push(path.join(root,'src/app/specified-skills/agriculture.tsx'));
const sites=[];
for(const file of inventory){
 const source=fs.readFileSync(file,'utf8');const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const aliases=new Set();
 for(const statement of ast.statements)if(ts.isImportDeclaration(statement)&&ts.isStringLiteral(statement.moduleSpecifier)&&/(^|\/)ConceptDiagrams$/.test(statement.moduleSpecifier.text)){
  const named=statement.importClause?.namedBindings;
  if(named&&ts.isNamedImports(named))for(const item of named.elements)if((item.propertyName||item.name).text==='ConceptDiagrams')aliases.add(item.name.text);
 }
 function visit(node){
  if((ts.isJsxSelfClosingElement(node)||ts.isJsxOpeningElement(node))&&ts.isIdentifier(node.tagName)&&aliases.has(node.tagName.text)){
   const attrs=new Map(node.attributes.properties.filter(ts.isJsxAttribute).map(a=>[a.name.getText(ast),a]));
   for(const required of ['lessonId','lessonSourceHash','level','colors'])assert(attrs.has(required),`${path.relative(root,file)} missing ${required}`);
   const args=[];
   for(const [name,attr]of attrs){assert(attr.initializer&&ts.isJsxExpression(attr.initializer)&&attr.initializer.expression,`unsupported contract expression ${name}`);args.push(name+':'+attr.initializer.expression.getText(ast));}
   sites.push({file:path.relative(root,file),line:ast.getLineAndCharacterOfPosition(node.getStart(ast)).line+1,args:args.join(',')});
  }
  ts.forEachChild(node,visit);
 }
 visit(ast);
}
assert(sites.length>0,'no actual concept caller found');
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'agri-callsite-'));
try{
 const stubs=path.join(scratch,'runtime-stubs.d.ts');
 fs.writeFileSync(stubs,"declare module 'react' {export const Fragment:any;}\ndeclare module 'react-native' {export const Text:any;export const View:any;export const StyleSheet:{create<T>(styles:T):T};}\ndeclare namespace JSX {type Element=any;interface IntrinsicElements {[key:string]:any}}\n");
 const filename=path.join(scratch,'actual-calls.tsx');
 const header=`import {ConceptDiagrams} from ${JSON.stringify(path.join(root,'src/components/agriculture/ConceptDiagrams'))};\ndeclare const lesson:{id:string;sourceHash:string};\ndeclare const level:'1'|'2';\ndeclare const colors:{text:string;translation:string;translationText:string;border:string};\n`;
 function check(calls){fs.writeFileSync(filename,header+calls);const program=ts.createProgram([filename,stubs],{strict:true,noEmit:true,skipLibCheck:true,jsx:ts.JsxEmit.Preserve,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,resolveJsonModule:true,esModuleInterop:true,baseUrl:root,paths:{'@/*':['src/*']}});return ts.getPreEmitDiagnostics(program);}
 const calls=sites.map(s=>'ConceptDiagrams({'+s.args+'});').join('\n');
 const diagnostics=check(calls);
 assert.equal(diagnostics.length,0,ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:f=>f,getCurrentDirectory:()=>root,getNewLine:()=>"\n"}));
 for(const missing of ['lessonSourceHash','level']){
  const negative=sites.map(s=>'ConceptDiagrams({'+s.args.split(',').filter(a=>!a.startsWith(missing+':')).join(',')+'});').join('\n');
  const failures=check(negative);assert(failures.some(d=>ts.flattenDiagnosticMessageText(d.messageText,' ').includes(missing)),`missing ${missing} must fail actual prop interface`);
 }
 console.log(`PASS concept-callsite-contract: ${inventory.length} current sector/shared/route TSX files; ${sites.length} actual caller; actual ConceptDiagrams prop-interface typecheck PASS; missing hash and level fixtures rejected.`);
 console.log(sites.map(s=>`${s.file}:${s.line}`).join('\n'));
}finally{fs.rmSync(scratch,{recursive:true,force:true});}
