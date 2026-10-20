const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
(async()=>{
 const esbuild=require(require.resolve('esbuild',{paths:[process.env.TOKUTEI_QA_MODULES||root]}));
 const built=await esbuild.build({stdin:{contents:`export * from './src/services/dialogue-furigana';export * from './src/components/world/japanese-ruby-data';`,resolveDir:root},bundle:true,write:false,platform:'node',format:'cjs',logLevel:'error',plugins:[{name:'aliases',setup(b){b.onResolve({filter:/^@\//},a=>({path:path.join(root,'src',a.path.slice(2))+'.ts'}));}}]});
 const m={exports:{}};new Function('module','exports','require',built.outputFiles[0].text)(m,m.exports,require);
 const {applyDialogueFurigana,hasAlignedRuby,visibleRuby}=m.exports;
 const bundle=JSON.parse(fs.readFileSync(path.join(root,'src/data/dialogue-content/furigana/SC-LOC-001-01-001.json'),'utf8'));
 assert.equal(Object.keys(bundle.turns).length,6);let checked=0;
 for(const [id,entry]of Object.entries(bundle.turns)){
  const t={id,scenarioId:bundle.scenarioId,speaker:entry.speaker,npc:{textJa:entry.sourceJa}};
  const result=applyDialogueFurigana(t,bundle);assert.equal(result.npc.textJa,t.npc.textJa);assert.deepEqual(result.npc.textRuby,entry.ruby);
  for(const p of entry.ruby)assert(!/[\p{Script=Han}々]/u.test(p.text)||p.reading,'Every kanji segment has authored hiragana');
  const stale={...t,npc:{textJa:entry.sourceJa+'変更'}};assert.equal(applyDialogueFurigana(stale,bundle),stale);
  const other={...t,scenarioId:'other'};assert.equal(applyDialogueFurigana(other,bundle),other);
  const wrong={...bundle,turns:{[id]:{...entry,speaker:'PLAYER'}}};assert.equal(applyDialogueFurigana(t,wrong),t);
  const broken={...bundle,turns:{[id]:{...entry,ruby:[{text:'変更',reading:'へんこう'}]}}};assert.equal(applyDialogueFurigana(t,broken),t);checked++;
 }
 assert(!hasAlignedRuby('列車',[{text:'列車',reading:'train'}]));assert(!hasAlignedRuby('列車',[null]));
 const segments=[{text:'列車',reading:'れっしゃ'},{text:'です。'}];
 assert.deepEqual(visibleRuby(segments,1),[{text:'列'}]);assert.deepEqual(visibleRuby(segments,2),[segments[0]]);assert.deepEqual(visibleRuby(segments,0),[]);assert.deepEqual(visibleRuby(segments,99),segments);
 console.log(JSON.stringify({status:'PASS',authoredNpcLines:checked,sourceSpeakerScenarioGuards:true,invalidReadingsRejected:true,partialWordReadingHidden:true,nativeReviewed:false}));
})().catch(e=>{console.error(e);process.exit(1)});
