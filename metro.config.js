require('./scripts/metro/bounded-io.cjs').installBoundedIO();
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('wasm');
// Large authored datasets do not need Babel/Terser to parse every data field.
config.transformerPath = require.resolve('./scripts/metro/runtime-data-transformer.cjs');
// Expo's supervising worker keeps its own getCacheKey. Include our build
// projection version in transform options so changing it invalidates caches.
config.transformer.runtimeDataVersion=require('node:crypto').createHash('sha256')
  .update(require('node:fs').readFileSync(config.transformerPath))
  .update(require('node:fs').readFileSync(require.resolve('./scripts/metro/prepare-dialogue-contexts.cjs'))).digest('hex');
// Bound parallel transform memory on developer machines as well as CI.
config.maxWorkers = 2;
const runtimeData = require('./scripts/metro/prepare-runtime-data.cjs').prepareRuntimeData(__dirname);
const dialogueContexts = require('./scripts/metro/prepare-dialogue-contexts.cjs').prepareDialogueContexts(__dirname,runtimeData);
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if(moduleName.startsWith('@runtime-data/')) {
    const name=moduleName.slice('@runtime-data/'.length);
    const packed=dialogueContexts.get(name);
    if(!packed)throw new Error('Unknown generated dialogue context: '+name);
    return {type:'sourceFile',filePath:packed.filePath};
  }
  const resolved = originalResolveRequest
    ? originalResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
  const packed = resolved.type === 'sourceFile' && runtimeData.get(resolved.filePath);
  return packed ? {type:'sourceFile', filePath:packed} : resolved;
};

module.exports = config;
