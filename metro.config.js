'use strict';

require('./scripts/metro/bounded-io.cjs').installBoundedIO();

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');

// Limit concurrent Metro workers to reduce peak memory usage.
config.maxWorkers = 2;

// Prepare compact runtime modules without changing authored source JSON.
const runtimeData =
  require('./scripts/metro/prepare-runtime-data.cjs')
    .prepareRuntimeData(__dirname);

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolved = originalResolveRequest
    ? originalResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);

  const packed =
    resolved.type === 'sourceFile' &&
    runtimeData.get(resolved.filePath);

  return packed
    ? { type: 'sourceFile', filePath: packed }
    : resolved;
};

// One active transformer for authored JSON not redirected above.
config.transformerPath = require.resolve(
  './scripts/tokutei-release/compressed-json-transformer.cjs'
);

// Defer module evaluation until first use.
const originalTransformOptions = config.transformer.getTransformOptions;

config.transformer.getTransformOptions = async (...args) => {
  const options = originalTransformOptions
    ? await originalTransformOptions(...args)
    : {};

  return {
    ...options,
    transform: {
      ...options.transform,
      inlineRequires: true,
    },
  };
};

module.exports = config;
