// Read the same locale shards as the runtime. Used only by authoring/browser QA.
const fs=require('node:fs'),path=require('node:path');
module.exports=function agricultureTranslationFixture(){
 const dir=path.resolve(__dirname,'../../src/data/agriculture'),manifest=JSON.parse(fs.readFileSync(path.join(dir,'translations.json'),'utf8'));
 if(manifest.schemaVersion===1)return manifest;
 if(manifest.schemaVersion!==2||!Array.isArray(manifest.locales))throw Error('Unsupported agriculture translation manifest');
 const locales={};
 for(const locale of manifest.locales){const expected=`translations/${locale}.json`;if(manifest.shards[locale]!==expected)throw Error('Unsafe translation shard');locales[locale]=JSON.parse(fs.readFileSync(path.join(dir,expected),'utf8'));}
 return {...manifest,locales};
};
