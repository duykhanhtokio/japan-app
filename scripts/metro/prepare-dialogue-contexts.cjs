const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const groups={
  dialogues:['src/data/generated/dialogues',false],
  'furigana-indexed':['src/data/dialogue-content/furigana-indexed',false],
  furigana:['src/data/dialogue-content/furigana',false],
  translations:['src/data/dialogue-content/translations',false],
  'locale-batches':['src/data/dialogue-content/locale-batches',true],
  'audio-packs':['src/data/dialogue-content/audio-packs',false],
};
function prepareDialogueContexts(root,runtimeData) {
  const directory=path.join(root,'.metro-runtime-data/contexts');fs.mkdirSync(directory,{recursive:true});
  const version=crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex');
  const decoder=JSON.stringify(path.join(root,'src/services/runtime-json.cjs'));
  const result=new Map();
  for(const [name,[relative,recursive]]of Object.entries(groups)) {
    const base=path.join(root,relative);
    const entries=[...runtimeData].filter(([file])=>file.startsWith(base+path.sep)&&(recursive||path.dirname(file)===base))
      .map(([source,packed])=>({source,packed,key:'./'+path.relative(base,source).replaceAll('\\','/')}))
      .sort((a,b)=>a.key.localeCompare(b.key));
    const chunks=[],lookup={};
    for(let start=0;start<entries.length;start+=64) {
      const batch=entries.slice(start,start+64);
      const signature=crypto.createHash('sha256').update(version).update(JSON.stringify(batch.map(e=>[e.key,path.basename(e.packed)]))).digest('hex');
      const filename=path.join(directory,'chunk-'+signature+'.cjs');
      if(!fs.existsSync(filename)) {
        const payloads={};
        for(const entry of batch) {
          const code=fs.readFileSync(entry.packed,'utf8');
          const encoded=/decodeRuntimeJson\((.+)\);\s*$/s.exec(code);
          const plain=encoded?null:/JSON\.parse\((.+)\);\s*$/s.exec(code);
          if(!encoded&&!plain)throw Error('Unknown generated data module format: '+entry.source);
          payloads[entry.key]=[encoded?1:0,JSON.parse((encoded||plain)[1])];
        }
        const code=`const payloads=JSON.parse(${JSON.stringify(JSON.stringify(payloads))});\nconst cache=Object.create(null);\nexports.read=key=>{if(Object.prototype.hasOwnProperty.call(cache,key))return cache[key];if(!Object.prototype.hasOwnProperty.call(payloads,key))throw Error('Unknown runtime data key: '+key);const entry=payloads[key];const value=entry[0]?require(${decoder}).decodeRuntimeJson(entry[1]):JSON.parse(entry[1]);cache[key]=value;delete payloads[key];return value;};\n`;
        fs.writeFileSync(filename,code);
      }
      const id=chunks.length;for(const entry of batch)lookup[entry.key]=id;
      chunks.push({filename,entries:batch});
    }
    const index=path.join(directory,name+'.cjs');
    const code=`const lookup=JSON.parse(${JSON.stringify(JSON.stringify(lookup))});\nconst shards=[${chunks.map(c=>`()=>require(${JSON.stringify('./'+path.basename(c.filename))})`).join(',')}];\nfunction context(key){if(!Object.prototype.hasOwnProperty.call(lookup,key)){const error=Error('Cannot find runtime data '+key);error.code='MODULE_NOT_FOUND';throw error;}return shards[lookup[key]]().read(key);}\ncontext.keys=()=>Object.keys(lookup);\nmodule.exports=context;\n`;
    if(!fs.existsSync(index)||fs.readFileSync(index,'utf8')!==code)fs.writeFileSync(index,code);
    result.set(name,{filePath:index,chunks,entries});
  }
  return result;
}
module.exports={prepareDialogueContexts,groups};
