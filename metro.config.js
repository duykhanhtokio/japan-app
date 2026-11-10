require('./scripts/metro/bounded-io.cjs').installBoundedIO();
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('wasm');
// Large authored datasets do not need Babel/Terser to parse every data field.
config.transformerPath = require.resolve('./scripts/metro/runtime-data-transformer.cjs');
// Bound parallel transform memory on developer machines as well as CI.
config.maxWorkers = 2;
const runtimeData = require('./scripts/metro/prepare-runtime-data.cjs').prepareRuntimeData(__dirname);
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolved = originalResolveRequest
    ? originalResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
  const packed = resolved.type === 'sourceFile' && runtimeData.get(resolved.filePath);
  return packed ? {type:'sourceFile', filePath:packed} : resolved;
};

// Keep large authored-data JSON out of Metro's object-literal/minifier heap.
// Files remain offline and unchanged on disk; each module decodes only on use.
config.transformerPath = require.resolve('./scripts/tokutei-release/compressed-json-transformer.cjs');

// Defer module evaluation until its first use, including native release builds.
const originalTransformOptions = config.transformer.getTransformOptions;
config.transformer.getTransformOptions = async (...args) => {
  const options = originalTransformOptions ? await originalTransformOptions(...args) : {};
  return { ...options, transform: { ...options.transform, inlineRequires: true } };
};

module.exports = config;
