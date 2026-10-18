const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),locales=['en','vi','id','tl','zh-CN','zh-TW','hi','bn','ne','my','th','km'];
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
function originalTurns(id){
 let file=`src/data/generated/dialogues/${id}.json`,direct=fs.existsSync(path.join(root,file));
 if(!direct){const m=/^SC-LOC-JP-\d{5}-(\d{2})-001$/.exec(id);assert(m,'Missing source '+id);file=`src/data/generated/dialogues/GENERIC-CITY-${m[1]}.json`;}
 const d=read(file),turns=Array.isArray(d)?d:d.shared??d.N5;assert.equal(turns.length,11,id);
 return direct?turns:turns.map(t=>({...t,id:t.id.replace(/GENERIC-CITY-\d{2}/g,id),scenarioId:id,nextDialogueId:t.nextDialogueId?.replace(/GENERIC-CITY-\d{2}/g,id)??null}));
}
function validateBatch(batch,{requireAll=true}={}){
 assert(/^\d{3,}$/.test(batch),'Invalid batch '+batch);const sourcePath=`docs/localization-workspace/sources/dialogue-batch-${batch}.ja.json`,source=read(sourcePath);
 assert.equal(source.batch,batch);const scenarioIds=Object.keys(source.scenarios),seen=new Set();let turns=0,hints=0;
 for(const id of scenarioIds){const original=originalTurns(id),items=source.scenarios[id].turns;assert.deepEqual(Object.keys(items),original.map(t=>t.id));for(let i=0;i<original.length;i++){const t=original[i],s=items[t.id];assert(!seen.has(t.id));seen.add(t.id);assert.equal(s.speaker,i%2?'PLAYER':'NPC');assert.equal(t.speaker,s.speaker);assert.equal(s.sourceJa,t.speaker==='NPC'?t.npc.textJa:t.player.recommendedAnswerJa);assert(s.sourceJa.trim());turns++;if(t.speaker==='PLAYER'){assert.equal(s.hintJa,t.player.hint);assert(s.hintJa?.trim());hints++;}}}
 const files=[],missing=[];
 for(const language of locales){const file=`src/data/dialogue-content/locale-batches/${language}/${batch}.json`;if(!fs.existsSync(path.join(root,file))){missing.push(language);continue;}const pack=read(file);assert.equal(pack.language,language);assert.equal(pack.status,'translated_ai_unreviewed');assert.equal(pack.nativeReviewed,false);assert.deepEqual(Object.keys(pack.scenarios).sort(),scenarioIds.slice().sort());
  for(const sid of scenarioIds){const expected=source.scenarios[sid].turns,actual=pack.scenarios[sid].turns;assert.deepEqual(Object.keys(actual).sort(),Object.keys(expected).sort());for(const [tid,s]of Object.entries(expected)){const e=actual[tid];assert.equal(e.speaker,s.speaker);assert.equal(e.sourceJa,s.sourceJa);assert(typeof e.translation==='string'&&e.translation.trim(),file+':'+tid);assert(!/^(TODO|TBD|pending|translation unavailable)$/i.test(e.translation.trim()),file+':placeholder');if(s.hintJa){assert.equal(e.hintJa,s.hintJa);assert(typeof e.hintTranslation==='string'&&e.hintTranslation.trim(),file+':hint:'+tid);assert(!/^(TODO|TBD|pending|translation unavailable)$/i.test(e.hintTranslation.trim()));}else assert(!e.hintTranslation,'NPC must not receive player task');
    if(batch==='000'){const previous=read('src/data/dialogue-content/translations/'+sid+'.json');assert.equal(e.translation,previous.turns[tid].translations[language],'Preserve already translated sentence');}
   }}files.push({language,path:file,sha256:hash(file)});
 }
 if(requireAll)assert.equal(missing.length,0,'Missing locales: '+batch+' '+missing.join(','));
 return {batch,ready:!missing.length,sourcePath,sourceSha256:hash(sourcePath),scenarioIds,scenarios:scenarioIds.length,turns,hints,locales:files.length,turnTranslationChecks:turns*files.length,hintTranslationChecks:hints*files.length,files,missing};
}
module.exports={root,locales,read,hash,originalTurns,validateBatch};
