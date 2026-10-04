// Source reachability is an audit index, not runtime evidence of a mounted layer.
const fs = require('node:fs'), path = require('node:path'), parser = require('@babel/parser');
const root = path.resolve(__dirname, '..');
function files(dir) { return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? files(path.join(dir,e.name)) : [path.join(dir,e.name)]); }
const sourceFiles = files(path.join(root,'src')).filter(f => /\.(?:tsx?|jsx?)$/.test(f));
const routes = sourceFiles.filter(f => f.startsWith(path.join(root,'src/app/')) && /\.tsx$/.test(f) && !f.endsWith('/_layout.tsx'));
const modules = new Map();
function resolve(from, spec) {
  if (!spec.startsWith('.') && !spec.startsWith('@/')) return;
  const base = spec.startsWith('@/') ? path.join(root,'src',spec.slice(2)) : path.resolve(path.dirname(from),spec);
  return [base,...['.tsx','.ts','.jsx','.js','/index.tsx','/index.ts'].map(ext=>base+ext)].find(f=>sourceFiles.includes(f));
}
for (const file of sourceFiles) {
  const source = fs.readFileSync(file,'utf8'), dependencies = new Set(), images = [], fills = [], layouts = [];
  const ast = parser.parse(source,{sourceType:'unambiguous',plugins:['typescript','jsx']});
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    let spec;
    if (node.type === 'ImportDeclaration' && node.importKind !== 'type') spec=node.source.value;
    if (node.type === 'CallExpression' && (node.callee.type === 'Import' || node.callee.name === 'require') && node.arguments[0]?.type === 'StringLiteral') spec=node.arguments[0].value;
    if (spec) { const target=resolve(file,spec); if(target)dependencies.add(target); }
    if (node.type === 'JSXOpeningElement') {
      const name=node.name.name ?? `${node.name.object?.name}.${node.name.property?.name}`;
      if (/Image|Artwork|Backdrop|Background/.test(name)) images.push({line:node.loc.start.line,name,source:node.attributes.find(a=>a.name?.name==='source') ? source.slice(node.attributes.find(a=>a.name?.name==='source').start,node.attributes.find(a=>a.name?.name==='source').end) : null});
      if(node.attributes.some(a=>a.name?.name==='onLayout')) layouts.push({line:node.loc.start.line,name});
    }
    if (node.type === 'ObjectProperty' && (node.key.name ?? node.key.value) === 'backgroundColor') fills.push({line:node.loc.start.line,value:source.slice(node.value.start,node.value.end)});
    for(const [key,value]of Object.entries(node)) {if(['loc','start','end','comments','tokens'].includes(key))continue;if(Array.isArray(value))value.forEach(visit);else if(value&&typeof value==='object')visit(value);}
  }
  visit(ast); modules.set(file,{dependencies:[...dependencies],images,fills,layouts});
}
function closure(file, visited=new Set()) {if(visited.has(file))return visited;visited.add(file);for(const next of modules.get(file)?.dependencies??[])closure(next,visited);return visited;}
const relative=f=>path.relative(root,f);
const live=new Set([path.join(root,'src/app/_layout.tsx'),...routes].flatMap(f=>[...closure(f)]));
const historical=files(path.join(root,'src')).filter(f=>/\.before-|\.backup$/.test(f)).map(relative);
const report={kind:'source-audit-not-visual-certification',routeCount:routes.length,reachableModuleCount:live.size,routes:routes.map(file=>({file:relative(file),dependencies:[...closure(file)].map(relative)})),artworkModules:[...live].filter(f=>modules.get(f)?.images.length).map(f=>({file:relative(f),...modules.get(f),dependencies:modules.get(f).dependencies.map(relative)})),unreachableArtworkModules:sourceFiles.filter(f=>!live.has(f)&&modules.get(f)?.images.length).map(relative),historicalFilesNotRoutes:historical};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2));
console.log(JSON.stringify({routes:report.routeCount,reachableModules:report.reachableModuleCount,artworkModules:report.artworkModules.length,unreachableArtworkModules:report.unreachableArtworkModules,historicalFiles:historical.length},null,2));
