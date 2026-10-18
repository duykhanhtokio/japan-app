const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),modules=process.env.TOKUTEI_QA_MODULES||root;
const dep=name=>require(require.resolve(name,{paths:[modules]}));
(async()=>{
 const result=await dep('esbuild').build({stdin:{contents:['src/services/dialogue-content-loader.ts','src/services/dialogue-translations.ts','src/components/world/player-answer-guidance.ts'].map(p=>`export * from ${JSON.stringify(path.join(root,p))}`).join('\n'),resolveDir:root},bundle:true,write:false,format:'cjs',platform:'node',logLevel:'error',alias:{'@':path.join(root,'src')}});
 const hostRequire=Object.assign(name=>dep(name),{context(dir,recursive,pattern){const full=path.resolve(root,'src/services',dir);const files=fs.readdirSync(full).filter(f=>pattern.test(f));const context=key=>JSON.parse(fs.readFileSync(path.join(full,key)));context.keys=()=>files.map(f=>'./'+f);return context;}});
 const box={exports:{}};new Function('module','exports','require',result.outputFiles[0].text)(box,box.exports,hostRequire);const m=box.exports;
 const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let scenarios=0,translations=0;
 const dir=path.join(root,'src/data/dialogue-content/translations');
 for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){
  const b=JSON.parse(fs.readFileSync(path.join(dir,file))),raw=JSON.parse(fs.readFileSync(path.join(root,'src/data/generated/dialogues',file))).shared,actual=m.loadDialogueTurns(b.scenarioId);
  assert.equal(b.status,'translated_ai_unreviewed');assert.equal(b.reviewedByNativeSpeaker,false);assert.equal(actual.length,11);assert.equal(Object.keys(b.turns).length,11);
  for(let i=0;i<11;i++){
   const original=raw[i],turn=actual[i],entry=b.turns[turn.id],key=turn.speaker==='NPC'?'npc':'player',ja=key==='npc'?'textJa':'recommendedAnswerJa';
   assert.equal(turn[key][ja],original[key][ja]);assert.equal(entry.sourceJa,original[key][ja]);assert.equal(turn.id,original.id);assert.equal(turn.nextDialogueId,original.nextDialogueId);
   for(const locale of locales){assert(entry.translations[locale]?.trim());assert.equal(turn[key].translations[locale],entry.translations[locale]);translations++;if(key==='player')assert.equal(m.getPlayerNativeHint(turn.player,locale),turn.player.hintTranslations?.[locale]??entry.translations[locale]);}
   if(key==='npc')assert.equal(turn.npc.translationVi,entry.translations.vi);
   const stale=structuredClone(original);stale[key][ja]+='変更';assert.strictEqual(m.applyDialogueTranslations(stale,b),stale);
   assert.strictEqual(m.applyDialogueTranslations(original,{...b,scenarioId:'other'}),original);
   const wrong=structuredClone(b);wrong.turns[turn.id].speaker=key==='npc'?'PLAYER':'NPC';assert.strictEqual(m.applyDialogueTranslations(original,wrong),original);
  }
  scenarios++;
 }
 const report={status:'PASS',translatedScenarios:scenarios,canonicalScenarios:7128,remainingScenarios:7128-scenarios,locales,turnTranslations:translations,loaderTested:true,staleSourceRejected:true,wrongSpeakerRejected:true,japaneseIdsAndLinksPreserved:true,nativeReview:false,browserVerified:false};
 fs.writeFileSync(path.join(root,'docs/checkpoints/DIALOGUE_TRANSLATION_PROGRESS_2026-10-17.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1});
