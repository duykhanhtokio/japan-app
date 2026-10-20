const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
(async()=>{
 const esbuild=require(require.resolve('esbuild',{paths:[process.env.TOKUTEI_QA_MODULES||root]}));
 const built=await esbuild.build({stdin:{contents:`export * from './src/services/dialogue-furigana';export * from './src/components/world/japanese-ruby-data';`,resolveDir:root},bundle:true,write:false,platform:'node',format:'cjs',logLevel:'error',plugins:[{name:'aliases',setup(b){b.onResolve({filter:/^@\//},a=>({path:path.join(root,'src',a.path.slice(2))+'.ts'}));}}]});
 const m={exports:{}};new Function('module','exports','require',built.outputFiles[0].text)(m,m.exports,require);
 const {applyDialogueFurigana,hasAlignedRuby,visibleRuby}=m.exports;
 const folder=path.join(root,'src/data/dialogue-content/furigana'),files=fs.readdirSync(folder).filter(f=>f.endsWith('.json'));let checked=0,npcLines=0,playerLines=0;
 for(const file of files){
  const bundle=JSON.parse(fs.readFileSync(path.join(folder,file),'utf8'));
  assert.equal(bundle.status,'authored_ai_unreviewed');assert.equal(bundle.nativeReviewed,false);
  const raw=JSON.parse(fs.readFileSync(path.join(root,'src/data/generated/dialogues',bundle.scenarioId+'.json'),'utf8'));
  const actual=Array.isArray(raw)?raw:raw.shared??raw.N5;
  for(const [id,entry]of Object.entries(bundle.turns)){
   const t=actual.find(t=>t.id===id);assert(t,'Real canonical turn exists: '+id);assert.equal(t.scenarioId,bundle.scenarioId);assert.equal(entry.speaker,t.speaker);
   const source=t.speaker==='NPC'?t.npc.textJa:t.player.recommendedAnswerJa;assert.equal(entry.sourceJa,source);
   const result=applyDialogueFurigana(t,bundle),ruby=t.speaker==='NPC'?result.npc.textRuby:result.player.recommendedAnswerRuby;assert.deepEqual(ruby,entry.ruby);assert(hasAlignedRuby(source,ruby));
   for(const p of entry.ruby)assert(!/[\p{Script=Han}々]/u.test(p.text)||p.reading,'Every kanji segment has authored hiragana');
   const stale=t.speaker==='NPC'?{...t,npc:{...t.npc,textJa:source+'変更'}}:{...t,player:{...t.player,recommendedAnswerJa:source+'変更'}};assert.equal(applyDialogueFurigana(stale,bundle),stale);
   const other={...t,scenarioId:'other'};assert.equal(applyDialogueFurigana(other,bundle),other);
   const wrong={...bundle,turns:{[id]:{...entry,speaker:t.speaker==='NPC'?'PLAYER':'NPC'}}};assert.equal(applyDialogueFurigana(t,wrong),t);
   const broken={...bundle,turns:{[id]:{...entry,ruby:[{text:'変更',reading:'へんこう'}]}}};assert.equal(applyDialogueFurigana(t,broken),t);
   checked++;if(t.speaker==='NPC')npcLines++;else playerLines++;
  }
 }
 assert(!hasAlignedRuby('列車',[{text:'列車',reading:'train'}]));assert(!hasAlignedRuby('列車',[null]));
 const segments=[{text:'列車',reading:'れっしゃ'},{text:'です。'}];
 assert.deepEqual(visibleRuby(segments,1),[{text:'列'}]);assert.deepEqual(visibleRuby(segments,2),[segments[0]]);assert.deepEqual(visibleRuby(segments,0),[]);assert.deepEqual(visibleRuby(segments,99),segments);
 console.log(JSON.stringify({status:'PASS',bundles:files.length,authoredLines:checked,authoredNpcLines:npcLines,authoredPlayerLines:playerLines,sourceSpeakerScenarioGuards:true,invalidReadingsRejected:true,partialWordReadingHidden:true,nativeReviewed:false}));
})().catch(e=>{console.error(e);process.exit(1)});
