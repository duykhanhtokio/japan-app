const path=require('node:path');
require('./metro/bounded-io.cjs').installBoundedIO();
const expoRoot=path.dirname(require.resolve('expo/package.json'));
const expoVersion=require(path.join(expoRoot,'package.json')).version;
if(!expoVersion.startsWith('54.'))throw new Error('The low-memory exporter requires Expo SDK 54; revalidate it before upgrading.');
const {getConfig}=require(require.resolve('@expo/config',{paths:[expoRoot]}));
if((getConfig(process.cwd()).exp.web?.output??'single')!=='single')throw new Error('This command supports single-page web output only.');
if(process.argv.some(arg=>arg==='--platform'||arg.startsWith('--platform=')))throw new Error('This command already selects the web platform.');
const cliRoot=path.dirname(require.resolve('@expo/cli/package.json',{paths:[expoRoot]}));
const assetsPath=path.join(cliRoot,'build/src/export/persistMetroAssets.js');
const exportsObject=require(assetsPath),original=exportsObject.persistMetroAssetsAsync;
const {streamHostedAssets}=require('./metro/stream-web-assets.cjs');
require.cache[assetsPath].exports=new Proxy(exportsObject,{get(target,key){
  return key==='persistMetroAssetsAsync'
    ? (root,assets,options)=>streamHostedAssets(original,root,assets,options)
    : Reflect.get(target,key);
}});
const cli=path.join(expoRoot,'bin/cli');
process.argv.splice(2,0,'export','--platform','web','--max-workers','2');
process.argv[1]=cli;
require(cli);
