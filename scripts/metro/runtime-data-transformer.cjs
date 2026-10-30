const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const {deflateSync} = require('node:zlib');
const root = path.resolve(__dirname, '../..');
const upstreamPath = require('expo/metro-config').getDefaultConfig(root).transformerPath;
const upstream = require(upstreamPath);
const {groups:contextGroups}=require('./prepare-dialogue-contexts.cjs');

function projectContextImports(filename,source) {
  const file=filename.replaceAll('\\','/');
  const loader=file.endsWith('/src/services/dialogue-content-loader.ts')||file==='src/services/dialogue-content-loader.ts';
  const audio=file.endsWith('/src/services/dialogue-audio-packs.ts')||file==='src/services/dialogue-audio-packs.ts';
  if(!loader&&!audio)return source;
  // This is a build-only projection. Authoring tools keep their existing
  // require.context mocks and the application keeps identical context keys.
  source=source.replace('(require as NodeRequire & {context(path:string,recursive:boolean,pattern:RegExp):Context})','(require as RequireWithContext)');
  let replaced=0;
  source=source.replace(/\(require as RequireWithContext\)\.context\(\s*['"]([^'"]+)['"],\s*(true|false),\s*\/\\\.json\$\/\s*\)/g,(match,directory,recursive)=>{
    const relative='src/'+directory.replace(/^\.\.\//,'');
    const group=Object.entries(contextGroups).find(([,value])=>value[0]===relative&&value[1]===(recursive==='true'));
    if(!group)throw Error('Unregistered dialogue context '+directory);
    replaced++;return `require('@runtime-data/${group[0]}')`;
  });
  if(replaced!==(loader?5:1))throw Error('Dialogue context projection no longer matches '+filename);
  return source;
}

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
  if(file.includes('.metro-runtime-data/')&&file.endsWith('.cjs')) {
    const literals=[];
    const source=data.toString('utf8');
    const skeleton=source.replace(/(JSON\.parse|decodeRuntimeJson)\(("[^\n]*")\)/g,(match,callee,literal)=>{
      const marker='__JAPAN_DATA_'+crypto.createHash('sha256').update(literal).digest('hex')+'_'+literals.length;
      if(source.includes(marker))throw Error('Generated payload marker collision');
      literals.push({marker,literal:literal.replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')});return `${callee}(${JSON.stringify(marker)})`;
    });
    if(literals.length) {
      // Let Expo collect/wrap dependencies from a tiny skeleton. The opaque
      // payload must never become a multi-megabyte Babel/Hermes AST string.
      const result=await upstream.transform(config,projectRoot,filename,Buffer.from(skeleton),{...options,minify:false,customTransformOptions:{...options.customTransformOptions,optimize:false}});
      for(const output of result.output)if(output.type.startsWith('js/')) {
        let code=output.data.code;
        for(const {marker,literal}of literals) {
          const token=JSON.stringify(marker);
          if(!code.includes(token))throw Error('Generated payload marker was lost during transform');
          code=code.replace(token,()=>literal);
        }
        output.data={...output.data,code,lineCount:1+(code.match(/\r\n|\r|\n|\u2028|\u2029/g)||[]).length,map:[],functionMap:null};
      }
      return result;
    }
  }
  if(file.endsWith('dialogue-content-loader.ts')||file.endsWith('dialogue-audio-packs.ts')) {
    data=Buffer.from(projectContextImports(filename,data.toString('utf8')));
  }
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
    .update(fs.readFileSync(__filename)).update(fs.readFileSync(require.resolve('./prepare-dialogue-contexts.cjs'))).digest('hex');
}

module.exports = {...upstream, transform, getCacheKey, projectRuntimeData,projectContextImports};
