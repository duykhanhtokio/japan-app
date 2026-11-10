// Verify the union of immutable contextual receipts against current source/target text.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');process.chdir(root);
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const locales=['en','vi','id','tl','zh-CN','zh-TW','hi','bn','ne','my','th','km'];
const index=read('src/data/dialogue-content/locale-batch-index.json');
const cache=new Map();const pack=p=>{if(!cache.has(p)){if(cache.size>40)cache.delete(cache.keys().next().value);cache.set(p,read(p));}return cache.get(p)};
const files=[];function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const q=p+'/'+e.name;if(e.isDirectory())walk(q);else if(e.name.endsWith('.json')&&!/assignment|baseline|input|progress|manifest|qa|plan|intent/.test(e.name))files.push(q)}}
for(const p of ['docs/localization-workspace/region-review','docs/localization-workspace/hokkaido-context-2026-11-03','docs/localization-workspace/naturalness-review-2026-10-25','docs/localization-workspace/naturalness-review-2026-11-03','docs/localization-workspace/release-audit-2026-11-03',...fs.readdirSync('docs/localization-workspace').filter(p=>p.startsWith('context-parallel-')).map(p=>'docs/localization-workspace/'+p)])if(fs.existsSync(p))walk(p);
const amendments=require('./lib/dialogue-review-amendments.cjs').loadReviewAmendments({read,hash:p=>hash(fs.readFileSync(p)),digest:hash,exists:fs.existsSync,reviewFiles:files});
const resolved=new Map();
const valid=new Map(), evidence=new Map();let historical=0;
const exp=require('./lib/dialogue-context-receipts.cjs').expandContextReceipt;
function expected(sid,locale,f,file){const key=[file,sid,locale,f.turnId,f.field].join('|');if(!resolved.has(key))resolved.set(key,amendments.resolve({reviewReceiptPath:file,scenarioId:sid,locale,turnId:f.turnId,field:f.field,sourceSha256:f.sourceSha256,previousTargetSha256:f.targetSha256}));return resolved.get(key)}
function accept(sid,locale,fields,file){
 if(!index[sid]||!locales.includes(locale)||fields.length!==16)return;
 const batch=index[sid],src=pack(`docs/localization-workspace/sources/dialogue-batch-${batch}.ja.json`).scenarios[sid].turns;
 const tgt=pack(`src/data/dialogue-content/locale-batches/${locale}/${batch}.json`).scenarios[sid].turns;
 const seen=new Set();
 for(let f of fields){if(Array.isArray(f))f=Object.fromEntries(['turnId','field','sourceSha256','targetSha256'].map((k,n)=>[k,f[n]]));const sk=f.field==='translation'?'sourceJa':f.field==='hintTranslation'?'hintJa':null;if(!sk||!src[f.turnId]||!tgt[f.turnId]||hash(src[f.turnId][sk]||'')!==f.sourceSha256||(hash(tgt[f.turnId][f.field]||'')!==f.targetSha256 && hash(tgt[f.turnId][f.field]||'')!==expected(sid,locale,f,file))){historical++;return}seen.add(f.turnId+':'+f.field)}
 if(seen.size!==16)return;if(!valid.has(sid))valid.set(sid,new Set());valid.get(sid).add(locale);if(!evidence.has(sid))evidence.set(sid,{});evidence.get(sid)[locale]=file;
}
for(const file of [...new Set(files)].sort()){
 let r;try{r=read(file);if(r.schemaVersion==='context-review-archive-v1'){const raw=fs.readFileSync(r.archivePath);assert.equal(hash(raw),r.archiveSha256);const buf=require('node:zlib').gunzipSync(raw);assert.equal(hash(buf),r.uncompressedSha256);r=JSON.parse(buf)}}catch(e){throw Error(file+': '+e.message)}
 if(r.nativeReviewed!==false)continue;
 if(r.schemaVersion==='context-review-compact-v1'){
  for(const entry of r.entries){try{const one={...r,entries:[entry],reviewedScenarios:1,reviewedFields:192};const out=exp(one);for(const row of out.reviews)accept(row.scenarioId,row.locale,row.fields,file)}catch(e){historical++}}
 }else if(Array.isArray(r.reviews))for(const row of r.reviews)if(row.fields)accept(row.scenarioId,row.locale,row.fields,file);
}
const queue=read('docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json');
const ids=queue.prefectures.flatMap(p=>p.cities.flatMap(c=>[...c.sentenceTaskReviewedScenarioIds,...c.pendingSentenceTaskScenarioIds]));
assert.equal(new Set(ids).size,7128);
const missing=ids.filter(s=>valid.get(s)?.size!==12);
const report={status:missing.length?'INCOMPLETE':'PASS',scenarios:7128,verifiedAll12:7128-missing.length,remaining:missing.length,fields:(7128-missing.length)*192,historicalNonCurrentRows:historical,nativeReviewed:false,deviceVerified:false,revisionAmendedFields:amendments.count,scope:'Mechanical source/target receipt union; no new semantic review or certification.',missingScenarioIds:missing,evidence:Object.fromEntries([...evidence].filter(([s])=>!missing.includes(s)).map(([sid,m])=>[sid,new Set(Object.values(m)).size===1?Object.values(m)[0]:m]))};
fs.writeFileSync('docs/localization-workspace/region-review/union-validation-20261103.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,evidence:undefined,missingScenarioIds:missing.slice(0,30)}));process.exitCode=missing.length?1:0;
