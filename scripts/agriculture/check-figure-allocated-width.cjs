#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),Module=require('node:module');
const {transformSync}=require('@babel/core');
const filename=path.resolve(__dirname,'../../src/components/agriculture/ZoomableFigure.tsx');
const source=fs.readFileSync(filename,'utf8');
const code=transformSync(source,{filename,babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true,allExtensions:true}],['@babel/plugin-transform-react-jsx',{runtime:'automatic'}],'@babel/plugin-transform-modules-commonjs']}).code+'\nexports.figureGeometryTest=figureGeometry;';
const loaded=new Module(filename,module);loaded.filename=filename;loaded.paths=Module._nodeModulePaths(path.dirname(filename));const actualRequire=loaded.require.bind(loaded);loaded.require=id=>id==='react-native'?{}:actualRequire(id);loaded._compile(code,filename);
const geometry=loaded.exports.figureGeometryTest;
let count=0;
for(const [width,height] of [[320,568],[568,320],[393,852],[852,393],[768,1024],[1024,768],[1440,900]]){
 for(const allocated of [96,144,220,300,560,900]){
  for(const [sw,sh] of [[1536,1024],[1000,1250],[1160,660]]){
   const g=geometry(width,height,allocated,sw,sh);
   assert(g.normalWidth>0&&g.normalWidth<=allocated,`figure overflows allocated panel ${width}/${allocated}`);
   assert(g.normalWidth<=g.available&&g.normalWidth<=688);
   assert(g.normalWidth*sh/sw<=g.maxHeight+1e-9,'normal height exceeds viewport allowance');
   count++;
  }
 }
}
assert(source.includes('onLayout={onLayout}'),'actual allocated root must be measured');
assert(source.includes('figureGeometry(width,height,containerWidth,sourceWidth,sourceHeight)'),'actual render must consume measured width');
assert(source.includes('Number.isFinite(next)&&next>0'),'ignore transient invalid layouts');
assert(source.includes('height:renderedWidth*sourceHeight/sourceWidth'),'preserve aspect ratio');
assert(source.includes('<ScrollView horizontal'),'expanded teaching details remain scrollable');
console.log(`PASS allocated-figure-width: ${count} normal-layout combinations; real geometry covers phone/tablet/desktop portrait-landscape + narrow panels. No browser/device pixel acceptance.`);
