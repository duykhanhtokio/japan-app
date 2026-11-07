// Importing an illustration module must not resolve every unrelated image.
// Asset paths are static Metro literals; the test intercepts requires without decoding image bytes.
const fs=require('fs'),path=require('path'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../..');
const modules=[['Week02CompanionFigure.tsx','sources'],['Week03CompanionFigure.tsx','sources'],['SupplementalManufacturingDiagrams.tsx','sources'],['CompletionManufacturingDiagrams.tsx','sources'],['manufacturing-daily-figure-sources.ts','manufacturingDailyFigureSources'],['ManufacturingDiagram.tsx','figures'],['recognition38-assets.ts','recognitionSources']];
function inspect(name,symbol,source=fs.readFileSync(path.join(root,'src/components/manufacturing',name),'utf8')){
 const calls=[],module={exports:{}},code=ts.transpileModule(source+'\n;module.exports.__assetMap='+symbol+';', {compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},reportDiagnostics:true});
 const errors=code.diagnostics.filter(x=>x.category===ts.DiagnosticCategory.Error);assert.equal(errors.length,0,'TypeScript syntax '+name);
 const req=id=>{if(/\.(png|webp)$/.test(id)){calls.push(id);return {uri:id}};return {};};
 vm.runInNewContext('(function(require,module,exports){'+code.outputText+'\n})',{console},{filename:name})(req,module,module.exports);
 return {map:module.exports.__assetMap,calls,pick:key=>name==='ManufacturingDiagram.tsx'?module.exports.__assetMap[key].source:module.exports.__assetMap[key]};
}
let imports=0,selections=0;const counts={};
for(const [name,symbol] of modules){
 const loaded=inspect(name,symbol);assert.equal(loaded.calls.length,0,'eager asset resolution at import '+name);imports++;
 const keys=Object.keys(loaded.map);assert(keys.length>0,'nonempty source map '+name);assert.equal(loaded.calls.length,0,'enumeration must not resolve assets '+name);
 const values=[];
 for(const key of keys){loaded.calls.length=0;const value=loaded.pick(key);assert(value&&typeof value.uri==='string','selected source '+name+' '+key);assert.equal(loaded.calls.length,1,'exactly selected require '+name+' '+key);assert.equal(value.uri,loaded.calls[0],'selected URI '+name+' '+key);assert(value.uri.startsWith('../../../assets/manufacturing/'),'curated manufacturing asset path');values.push([key,value.uri]);selections++;}
 loaded.calls.length=0;assert(!Object.prototype.hasOwnProperty.call(loaded.map,'__missing__'));assert.equal(loaded.calls.length,0,'unknown lookup must not resolve assets');
 counts[name]={entries:keys.length};
}
console.log(JSON.stringify({modulesWithZeroImportAssetResolution:imports,selectedAssetResolutionChecks:selections,unrelatedAssetResolutions:0,counts,scope:'JavaScript/Metro asset-module resolution only; no network-byte, image-decode, startup-time or physical-device performance claim'}));
module.exports={inspect,modules};
