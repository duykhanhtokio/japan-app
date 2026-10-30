const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {deflateSync}=require('node:zlib');
const {projectRuntimeData}=require('./runtime-data-transformer.cjs');

// Build-only cache. Source JSON remains the authoritative, editable data.
function prepareRuntimeData(root) {
  const dir=path.join(root,'.metro-runtime-data');
  fs.mkdirSync(dir,{recursive:true});
  const version=crypto.createHash('sha256').update(fs.readFileSync(__filename))
    .update(fs.readFileSync(require.resolve('./runtime-data-transformer.cjs'))).digest('hex');
  const manifestPath=path.join(dir,'manifest.json');
  let prior;
  try{prior=JSON.parse(fs.readFileSync(manifestPath,'utf8'));}catch{}
  const previous=prior?.version===version?prior.files:{};
  const entries={},redirects=new Map();
  function walk(base) {
    for(const entry of fs.readdirSync(base,{withFileTypes:true})) {
      const file=path.join(base,entry.name);
      if(entry.isDirectory()){walk(file);continue;}
      if(!entry.name.endsWith('.json'))continue;
      const relative=path.relative(root,file),stat=fs.statSync(file);
      let record=previous[relative];
      if(!record||record.size!==stat.size||record.mtimeMs!==stat.mtimeMs||!fs.existsSync(path.join(dir,record.packed))) {
        const raw=fs.readFileSync(file);
        const compact=JSON.stringify(projectRuntimeData(file,JSON.parse(raw)));
        // Separate source modules must retain independent object identities,
        // even when their current JSON contents happen to be identical.
        const digest=crypto.createHash('sha256').update(version).update(relative).update('\0').update(compact).digest('hex');
        const packed=digest+'.cjs';
        const code=Buffer.byteLength(compact)>=4096
          ? `module.exports = require(${JSON.stringify(path.join(root,'src/services/runtime-json.cjs'))}).decodeRuntimeJson(${JSON.stringify(deflateSync(Buffer.from(compact),{level:9}).toString('base64'))});\n`
          : `module.exports = JSON.parse(${JSON.stringify(compact)});\n`;
        fs.writeFileSync(path.join(dir,packed),code);
        record={size:stat.size,mtimeMs:stat.mtimeMs,packed};
      }
      entries[relative]=record;
      redirects.set(file,path.join(dir,record.packed));
    }
  }
  walk(path.join(root,'src/data'));
  fs.writeFileSync(manifestPath,JSON.stringify({version,files:entries}));
  // Remove only obsolete products from this owned build-cache directory.
  const used=new Set(Object.values(entries).map(r=>r.packed));
  for(const file of fs.readdirSync(dir))if(/^[a-f0-9]{64}\.cjs$/.test(file)&&!used.has(file))fs.unlinkSync(path.join(dir,file));
  return redirects;
}
module.exports={prepareRuntimeData};
