const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('wasm');

// Defer module evaluation until its first use, including native release builds.
const originalTransformOptions = config.transformer.getTransformOptions;
config.transformer.getTransformOptions = async (...args) => {
  const options = originalTransformOptions ? await originalTransformOptions(...args) : {};
  return { ...options, transform: { ...options.transform, inlineRequires: true } };
};

module.exports = config;
