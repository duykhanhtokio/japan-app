const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const {deflateSync} = require('node:zlib');
const root = path.resolve(__dirname, '../..');
const upstreamPath = require('expo/metro-config').getDefaultConfig(root).transformerPath;
const upstream = require(upstreamPath);

function projectRuntimeData(filename, value) {
  const file = filename.replaceAll('\\', '/');
  if (file.includes('src/data/generated/dialogues/') && !Array.isArray(value)) {
    // The application loader uses exactly shared ?? N5, never the other levels.
    // Retain fallback semantics even for malformed/unavailable scenario records.
    return {shared: value.shared ?? value.N5};
  }
  return value;
}

async function transform(config, projectRoot, filename, data, options) {
  const file = filename.replaceAll('\\', '/');
  if (!file.endsWith('.json') || !/(?:^|\/)src\/data\//.test(file) || options.type === 'asset') {
    return upstream.transform(config, projectRoot, filename, data, options);
  }
  const parsed = JSON.parse(data.toString('utf8'));
  const compact = JSON.stringify(projectRuntimeData(filename, parsed));
  // An opaque string avoids a huge object-literal AST during JS minification
  // and engine compilation. JSON.parse runs only when Metro requires this module.
  if (Buffer.byteLength(compact) >= 4096) {
    const compressed = deflateSync(Buffer.from(compact), {level:9}).toString('base64');
    let decoder = path.relative(path.dirname(path.resolve(projectRoot, filename)),
      path.join(projectRoot, 'src/services/runtime-json.cjs')).replaceAll('\\', '/');
    if (!decoder.startsWith('.')) decoder = './' + decoder;
    const code = `module.exports = require(${JSON.stringify(decoder)}).decodeRuntimeJson(${JSON.stringify(compressed)});`;
    // Use Metro's normal JS dependency collector for the tiny decoder require.
    return upstream.transform(config, projectRoot, filename + '.js', Buffer.from(code), {...options,minify:false});
  }
  const expression = `JSON.parse(${JSON.stringify(compact).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')})`;
  // Metro's JSON worker wraps the expression without Babel. Do not run Terser
  // over data that has already been compacted and validated as JSON.
  return upstream.transform(config, projectRoot, filename, Buffer.from(expression), {...options, minify: false});
}

function getCacheKey(config) {
  return crypto.createHash('sha256').update(upstream.getCacheKey(config))
    .update(fs.readFileSync(__filename)).digest('hex');
}

module.exports = {...upstream, transform, getCacheKey, projectRuntimeData};
