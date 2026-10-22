// Exercise the real Metro-style loader for every active scenario, not fixtures.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
(async()=>{
 const esbuild=require(require.resolve('esbuild',{paths:[process.env.TOKUTEI_QA_MODULES||root]}));
 const built=await esbuild.build({stdin:{contents:"export * from './src/services/dialogue-content-loader';export * from './src/services/dialogue-indexed-furigana';",resolveDir:root},bundle:true,write:false,platform:'node',format:'cjs',logLevel:'error',plugins:[{name:'aliases',setup(b){b.onResolve({filter:/^@\//},a=>{const p=path.join(root,'src',a.path.slice(2));for(const ext of ['','.ts','.json'])if(fs.existsSync(p+ext)&&fs.statSync(p+ext).isFile())return{path:p+ext};});}}]});
 const requireData=Object.assign(name=>require(name),{context(dir,recursive){const base=path.resolve(root,'src/services',dir),files={},cache=new Map();function scan(dir,prefix='.'){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.isDirectory()){if(recursive)scan(path.join(dir,e.name),prefix+'/'+e.name);}else if(e.name.endsWith('.json'))files[prefix+'/'+e.name]=path.join(dir,e.name);}}scan(base);return Object.assign(key=>{assert(files[key],key);if(!cache.has(key)){cache.set(key,JSON.parse(fs.readFileSync(files[key],'utf8')));if(cache.size>32)cache.delete(cache.keys().next().value);}return cache.get(key);},{keys:()=>Object.keys(files)});}});
 const m={exports:{}};new Function('module','exports','require',built.outputFiles[0].text)(m,m.exports,requireData);
 const ids=new Set(['src/data/generated/scenarios.json','src/data/dialogue-content/scenario-overrides.json','src/data/dialogue-content/independent-city-overrides.json'].flatMap(read).map(s=>s.id));
 const counts={NPC:0,PLAYER:0};let withKanji=0;
 for(const sid of ids){const turns=m.exports.loadDialogueTurns(sid);assert.equal(turns.length,11,sid);for(const t of turns){const text=t.speaker==='NPC'?t.npc.textJa:t.player.recommendedAnswerJa,ruby=t.speaker==='NPC'?t.npc.textRuby:t.player.recommendedAnswerRuby;assert(Array.isArray(ruby),t.id);assert.equal(ruby.map(p=>p.text).join(''),text,t.id);for(const p of ruby){if(/[\p{Script=Han}々〆ヵヶ]/u.test(p.text)){assert(/^[\p{Script=Hiragana}ー\s]+$/u.test(p.reading||''),t.id+':'+p.text);withKanji++;}}counts[t.speaker]++;}}
 const turn=m.exports.loadDialogueTurns('SC-LOC-001-01-001')[0],shard=read('src/data/dialogue-content/furigana-indexed/'+m.exports.furiganaShardKey(turn.scenarioId).slice(2));
 const stale={...turn,npc:{...turn.npc,textJa:turn.npc.textJa+'変更'}};assert.equal(m.exports.applyIndexedFurigana(stale,shard),stale);
 const wrong={...turn,speaker:'PLAYER'};assert.equal(m.exports.applyIndexedFurigana(wrong,shard),wrong);
 const unknown={...turn,id:turn.id+'-other'};assert.equal(m.exports.applyIndexedFurigana(unknown,shard),unknown);
 const lex=read('src/data/dialogue-content/furigana-lexicon.json');for(const [text,reading]of [['一人','ひとり'],['二人','ふたり'],['一分','いっぷん'],['六分','ろっぷん'],['三本','さんぼん'],['四時','よじ'],['〇','ぜろ']])assert(lex.some(p=>p[0]===text&&p[1]===reading),text);
 const report={status:'PASS_STRUCTURAL_COVERAGE',actualLoader:true,canonicalScenarios:ids.size,counts,kanjiSegments:withKanji,missingKanjiReadings:0,staleSourceRejected:true,wrongSpeakerRejected:true,unknownTurnRejected:true,numericCounterRegressions:true,nativeReviewed:false};
 fs.writeFileSync(path.join(root,'docs/localization-workspace/dialogue-furigana-coverage-qa.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1)});
