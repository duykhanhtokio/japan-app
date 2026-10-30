const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const assert=require('node:assert/strict'),vm=require('node:vm');
const {prepareRuntimeData}=require('./metro/prepare-runtime-data.cjs');
const decoder=require('../src/services/runtime-json.cjs');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'runtime-cache-check-'));
try {
  const dir=path.join(root,'src/data/generated/dialogues');fs.mkdirSync(dir,{recursive:true});
  const record={shared:[{text:'日本語・Việt・😀'.repeat(800)}],N4:['unused'],authoring:{reviewed:false}};
  const dialogue=path.join(dir,'one.json'),other=path.join(root,'src/data/other.json');
  fs.writeFileSync(dialogue,JSON.stringify(record));fs.writeFileSync(other,JSON.stringify(record));
  const duplicate=path.join(root,'src/data/duplicate.json');fs.writeFileSync(duplicate,JSON.stringify(record));
  const read=file=>{const module={exports:{}};vm.runInNewContext(fs.readFileSync(file,'utf8'),{module,require:()=>decoder});return JSON.stringify(module.exports);};
  let map=prepareRuntimeData(root);
  assert.notEqual(map.get(dialogue),map.get(other),'Different projections must not collide');
  assert.notEqual(map.get(other),map.get(duplicate),'Distinct JSON modules must retain separate object identities');
  assert.equal(read(map.get(dialogue)),JSON.stringify({shared:record.shared}));
  assert.equal(read(map.get(other)),JSON.stringify(record));
  const old=map.get(dialogue),time=fs.statSync(old).mtimeMs;
  map=prepareRuntimeData(root);assert.equal(map.get(dialogue),old);assert.equal(fs.statSync(old).mtimeMs,time);
  record.shared[0].text+=' changed';fs.writeFileSync(dialogue,JSON.stringify(record));
  map=prepareRuntimeData(root);assert.notEqual(map.get(dialogue),old);assert(!fs.existsSync(old));
  assert.equal(read(map.get(dialogue)),JSON.stringify({shared:record.shared}));
  fs.writeFileSync(other,'{bad');assert.throws(()=>prepareRuntimeData(root));
  assert.equal(fs.readFileSync(other,'utf8'),'{bad','Source must never be deleted or overwritten');
  console.log('PASS: cache isolation, exact projection, reuse, source invalidation, orphan cleanup, corrupt-source rejection');
}finally{fs.rmSync(root,{recursive:true,force:true});}
