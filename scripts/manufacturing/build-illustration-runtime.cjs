// Authoring-only projection builder. No dictionary or tokenizer runs in the app.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../..');
const corpusPath='docs/ssw-workspace/manufacturing/illustration-reading-authoring-corpus-20261107.json';
const royalPath='src/data/manufacturing/royal-week01-technical-locales.json';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const corpus=require('./load-illustration-reading-authoring.cjs')(root),royal=read(royalPath),entries=corpus.nativeEntries;
const hash=text=>{let h=0x811c9dc5;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,0x01000193);}return(h>>>0).toString(16).padStart(8,'0');};
const shardOf=row=>{for(const id of row.lessonIds??[]){const m=id.match(/^mfg1-(?:mechanical-lesson-|electrical-l|surface-lesson-)(\d+)$/);if(m){const week=Math.ceil(Number(m[1])/7);if(week>=1&&week<=14)return'week'+String(week).padStart(2,'0');}}return'other';};
const shards=Object.fromEntries([...Array.from({length:14},(_,i)=>'week'+String(i+1).padStart(2,'0')),'other'].map(k=>[k,{}])),index={};let approved=0;
for(const [text,row]of Object.entries(entries)){if(row.contextReview!=='ai_whole_field_compared')continue;assert.equal(row.sourceJa,text);assert.ok(Array.isArray(row.tokens)&&row.tokens.length);assert.equal(row.tokens.map(t=>t.text).join(''),text);assert.ok(row.tokens.every(t=>typeof t.text==='string'&&t.text&&(!t.readingKana||/^[ぁ-ゖー]+$/.test(t.readingKana))&&(!/[一-龯々]/.test(t.text)||t.readingKana)));const shard=shardOf(row);shards[shard][text]={sourceJa:text,tokens:row.tokens,contextReview:row.contextReview};const key=hash(text);if(!index[key])index[key]=[];if(!index[key].includes(shard))index[key].push(shard);approved++;}
const outputs={};const emit=(p,data)=>outputs[p]=JSON.stringify(data)+'\n';
emit('src/data/manufacturing/illustration-caption-readings.json',{schemaVersion:2,sourceLocale:corpus.sourceLocale,nativeReviewed:false,domainReviewed:false,status:'Reviewed caption records; native readings are exact-text indexed lazy projections. Full automatic candidate corpus is authoring-only.',entries:corpus.entries});
emit('src/data/manufacturing/illustration-reading-index.json',index);
for(const [name,data]of Object.entries(shards))emit('src/data/manufacturing/illustration-reading-shards/'+name+'.json',data);
for(const [lang,data]of Object.entries(royal.locales))emit('src/data/manufacturing/royal-native-locales/'+lang+'.json',data);
for(const [p,content]of Object.entries(outputs)){const file=path.join(root,p);if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8'),content,p);else{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content);}}
console.log(JSON.stringify({authoringRecords:Object.keys(entries).length,reviewedRuntimeRecords:approved,pendingAuthoringRecords:Object.keys(entries).length-approved,captionRecords:corpus.entries.length,readingIndexBytes:Buffer.byteLength(outputs['src/data/manufacturing/illustration-reading-index.json']),captionManifestBytes:Buffer.byteLength(outputs['src/data/manufacturing/illustration-caption-readings.json']),reviewedShardBytes:Object.fromEntries(Object.keys(shards).map(k=>[k,Buffer.byteLength(outputs['src/data/manufacturing/illustration-reading-shards/'+k+'.json'])])),localeBytes:Object.fromEntries(Object.keys(royal.locales).map(k=>[k,Buffer.byteLength(outputs['src/data/manufacturing/royal-native-locales/'+k+'.json'])])),check:process.argv.includes('--check')}));
