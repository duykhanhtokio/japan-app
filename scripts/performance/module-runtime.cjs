'use strict';
// Isolated JS evidence, not a native/Metro startup measurement. Transpilation is
// cached outside the measured evaluation; authored JSON follows the production
// compression policy and is decoded by the real app helper.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const esbuild = require('esbuild');
const {packedSource} = require('../tokutei-release/compressed-json-transformer.cjs');
const root = path.resolve(__dirname, '../..');
const compiled = new Map();
const changedByRef = new Map();
function runtime(ref) {
  const cache = new Map(), jsonLoads = [];
  if (ref && !changedByRef.has(ref)) changedByRef.set(ref, new Set(execFileSync(
    'git', ['diff', '--name-only', ref, '--', 'src'], {cwd:root, encoding:'utf8'},
  ).trim().split('\n')));
  function source(file) {
    const relative = path.relative(root, file).split(path.sep).join('/');
    return ref && changedByRef.get(ref).has(relative) ? execFileSync('git', ['show', `${ref}:${relative}`], {cwd:root, maxBuffer:64*1024*1024}) : fs.readFileSync(file);
  }
  function load(relative) {
    const file = path.resolve(root, relative);
    if (cache.has(file)) return cache.get(file).exports;
    const box = {exports:{}}; cache.set(file, box);
    try {
      const key = `${ref || 'working'}:${file}`;
      let entry = compiled.get(key);
      if (!entry) {
        const bytes = source(file);
        if (file.endsWith('.json')) {
          const packed = packedSource(root, file, bytes);
          entry = packed ? {code:packed.code, bytes:bytes.length} : {json:bytes.toString('utf8').replace(/^\uFEFF/, ''), bytes:bytes.length};
        } else {
          entry = {code:esbuild.transformSync(bytes.toString('utf8'), {loader:'ts',format:'cjs',target:'es2020'}).code};
        }
        compiled.set(key, entry);
      }
      if (file.endsWith('.json')) jsonLoads.push({path:path.relative(root,file),bytes:entry.bytes});
      if (entry.json !== undefined) box.exports = JSON.parse(entry.json);
      else {
        const req = id => {
          if (!id.startsWith('.') && !id.startsWith('@/')) return require(id);
          const base = id.startsWith('@/') ? path.join(root,'src',id.slice(2)) : path.resolve(path.dirname(file),id);
          const target = [base,base+'.ts',base+'.json',path.join(base,'index.ts')].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
          if (!target) throw Error(`Unresolved ${id} in ${relative}`);
          return load(target);
        };
        new vm.Script(`(function(module,exports,require){${entry.code}\n})`,{filename:file}).runInThisContext()(box,box.exports,req);
      }
      return box.exports;
    } catch (error) { cache.delete(file); throw error; }
  }
  return {load,jsonLoads};
}
module.exports = {runtime,root};
