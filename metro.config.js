const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('wasm');

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
