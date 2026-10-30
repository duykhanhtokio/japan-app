const fs=require('node:fs'),path=require('node:path');
const expoRoot=path.dirname(require.resolve('expo/package.json'));
const cliRoot=path.dirname(require.resolve('@expo/cli/package.json',{paths:[expoRoot]}));
const {getAssetLocalPath}=require(path.join(cliRoot,'build/src/export/metroAssetLocalPath.js'));
const {filterPlatformAssetScales}=require(path.join(cliRoot,'build/src/export/persistMetroAssets.js'));
// Reuse Expo's paths/scales, but copy bytes through the OS rather than keeping
// every image/audio Buffer in the deferred files Map until bundle output.
async function streamHostedAssets(original,projectRoot,assets,options) {
  if(options.platform==='web'&&options.files) {
    let copied=0;
    for(const asset of assets) {
      const valid=new Set(filterPlatformAssetScales('web',asset.scales));
      for(let i=0;i<asset.scales.length;i++) {
        const scale=asset.scales[i];if(!valid.has(scale))continue;
        const relative=getAssetLocalPath(asset,{platform:'web',scale,baseUrl:options.baseUrl});
        const destination=path.join(options.outputDirectory,relative);
        await fs.promises.mkdir(path.dirname(destination),{recursive:true});
        await fs.promises.copyFile(asset.files[i],destination);copied++;
      }
    }
    console.log(`Copied ${copied} web assets without retaining their bytes in memory.`);
    return;
  }
  return original(projectRoot,assets,options);
}
module.exports={streamHostedAssets};
