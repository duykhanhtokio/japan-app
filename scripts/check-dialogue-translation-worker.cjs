const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const w=require('./dialogue-translation-worker.cjs');
const source=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/localization-workspace/sources/dialogue-batch-100.ja.json')));
const ownership=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/localization-workspace/DIALOGUE_TRANSLATION_OWNERSHIP.json')));
const rows=w.units(source),values=rows.map((x,i)=>'Validation fixture '+i);assert.equal(rows.length,160);
const pack=w.buildPack(source,'en',values);let at=0;
for(const [sid,s]of Object.entries(source.scenarios))for(const [tid,t]of Object.entries(s.turns)){
 const actual=pack.scenarios[sid].turns[tid];assert.equal(actual.speaker,t.speaker);assert.equal(actual.sourceJa,t.sourceJa);assert.equal(actual.translation,values[at++]);
 if(t.hintJa){assert.equal(actual.hintJa,t.hintJa);assert.equal(actual.hintTranslation,values[at++]);}else assert(!actual.hintTranslation);
}
assert.throws(()=>w.buildPack(source,'en',values.slice(1)));assert.throws(()=>w.buildPack(source,'en',values.map((x,i)=>i?x:'')));assert.throws(()=>w.buildPack(source,'en',values.map((x,i)=>i?x:'TODO')));assert.throws(()=>w.buildPack(source,'invalid',values));
assert.equal(w.ownerFor('100','en',ownership),'dialogue_ne_my');assert.equal(w.ownerFor('101','en',ownership),'dialogue_th_km');assert.equal(w.ownerFor('094','km',ownership),'dialogue_zh');
assert.throws(()=>w.publish('100','en','/absent','/tmp/ready',false));
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dialogue-worker-check-')),file=path.join(dir,'pack.json');
try{assert(w.atomicImmutable(file,'original'));assert.equal(w.atomicImmutable(file,'original'),false);assert.throws(()=>w.atomicImmutable(file,'replacement'));assert.equal(fs.readFileSync(file,'utf8'),'original');}finally{fs.rmSync(dir,{recursive:true,force:true});}
const before=Buffer.byteLength(JSON.stringify(source,null,2)),after=Buffer.byteLength(JSON.stringify(w.compactSource(source)));
console.log(JSON.stringify({status:'PASS',orderedSourceTurnAndHintBindings:160,invalidInputRejected:true,explicitAuthorFidelityRequired:true,exclusiveOwnerAndTransferResolved:true,immutablePublication:true,sourceBytesBefore:before,sourceBytesAfter:after,reductionPercent:Math.round((1-after/before)*100),translationFixturesPublished:false}));
