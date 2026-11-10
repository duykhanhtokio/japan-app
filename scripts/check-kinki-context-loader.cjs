// Bounded validation of the actual dialogue loader for every Kinki scenario.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const locales = ['en','vi','id','tl','zh-CN','zh-TW','hi','bn','ne','my','th','km'];
function cached(cache, file) {
  if (!cache.has(file)) {
    cache.set(file, read(file));
    if (cache.size > 32) cache.delete(cache.keys().next().value);
  }
  return cache.get(file);
}
async function main() {
  const built = await require('esbuild').build({
    stdin: {contents: ['src/services/dialogue-content-loader.ts',
      'src/services/life-content-repository.ts', 'src/services/dialogue-audio-packs.ts']
      .map(p => `export * from ${JSON.stringify(path.join(root,p))}`).join('\n'), resolveDir:root},
    bundle:true,write:false,platform:'node',format:'cjs',logLevel:'error',alias:{'@':path.join(root,'src')},
    plugins:[{name:'json-data-external',setup(build){
      build.onResolve({filter:/\.json$/},args=>({
        path:args.path.startsWith('@/')?path.join(root,'src',args.path.slice(2)):
          path.isAbsolute(args.path)?args.path:
          args.path.startsWith('.')?path.resolve(args.resolveDir,args.path):
          require.resolve(args.path,{paths:[args.resolveDir]}),
        external:true,
      }));
    }}],
  });
  const actualRequire = Object.assign(name => require(name), {context(directory, recursive, pattern) {
    const base=path.resolve(root,'src/services',directory), files={}, cache=new Map();
    function scan(dir,prefix='.') {
      for(const e of fs.readdirSync(dir,{withFileTypes:true})) {
        if(e.isDirectory()) {if(recursive)scan(path.join(dir,e.name),prefix+'/'+e.name);}
        else if(pattern.test(e.name)) files[prefix+'/'+e.name]=path.join(dir,e.name);
      }
    }
    scan(base);
    return Object.assign(key => {
      assert(files[key], 'Missing runtime file '+key);
      if(!cache.has(key)) {
        cache.set(key,JSON.parse(fs.readFileSync(files[key],'utf8')));
        if(cache.size>8)cache.delete(cache.keys().next().value);
      }
      return cache.get(key);
    }, {keys:()=>Object.keys(files)});
  }});
  const box={exports:{}};
  new Function('module','exports','require',built.outputFiles[0].text)(box,box.exports,actualRequire);
  const runtime=box.exports;
  const queue=read('docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json');
  const prefectures=queue.prefectures.filter(p=>Number(p.prefectureId.slice(-3))>=24&&Number(p.prefectureId.slice(-3))<=30);
  const members=prefectures.flatMap(p=>p.cities.flatMap(c=>[...c.sentenceTaskReviewedScenarioIds,...c.pendingSentenceTaskScenarioIds]));
  assert.equal(members.length,1115);assert.equal(new Set(members).size,1115);
  const index=read('src/data/dialogue-content/locale-batch-index.json');
  members.sort((a,b)=>index[a].localeCompare(index[b])||a.localeCompare(b));
  const cast=read('src/data/dialogue-content/npc-voice-casting.json');
  const voices=read('src/data/jlpt-original/voice-casting.json');
  const sources=new Map(),packs=new Map();
  let sentenceFields=0,hintFields=0,rubyTurns=0,npcBindings=0;
  for(const sid of members) {
    const batch=index[sid];assert(batch,'Missing translation index '+sid);
    const source=cached(sources,`docs/localization-workspace/sources/dialogue-batch-${batch}.ja.json`).scenarios[sid];
    const turns=runtime.loadDialogueTurns(sid);assert.equal(turns.length,11,sid);
    assert.deepEqual(turns.map(t=>t.id),Object.keys(source.turns));
    const scenario=runtime.getLifeScenarioById(sid);
    const category=(runtime.getLifeLocationById(scenario.locationId)?.category??'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    assert(!cast.unverifiedCategories.includes(category));
    const role=cast.categories[category]??cast.fallbackRole;
    for(let i=0;i<turns.length;i++) {
      const t=turns[i],s=source.turns[t.id],npc=t.speaker==='NPC';
      assert.equal(t.speaker,i%2?'PLAYER':'NPC');assert.equal(t.speaker,s.speaker);
      const data=npc?t.npc:t.player,ja=npc?data.textJa:data.recommendedAnswerJa;
      assert.equal(ja,s.sourceJa);if(!npc)assert.equal(data.hint,s.hintJa);
      const ruby=npc?data.textRuby:data.recommendedAnswerRuby;
      assert(Array.isArray(ruby));assert.equal(ruby.map(p=>p.text).join(''),ja);
      for(const p of ruby)if(/[\p{Script=Han}々〆ヵヶ]/u.test(p.text))assert(/^[\p{Script=Hiragana}ー\s]+$/u.test(p.reading??''));
      rubyTurns++;
      for(const locale of locales) {
        const pack=cached(packs,`src/data/dialogue-content/locale-batches/${locale}/${batch}.json`);
        assert.equal(pack.nativeReviewed,false);assert.equal(pack.status,'translated_ai_unreviewed');
        const entry=pack.scenarios[sid].turns[t.id];
        assert.equal(entry.sourceJa,ja);assert.equal(entry.speaker,t.speaker);
        assert(entry.translation?.trim());assert.equal(data.translations[locale],entry.translation);sentenceFields++;
        if(!npc){assert.equal(entry.hintJa,s.hintJa);assert(entry.hintTranslation?.trim());assert.equal(data.hintTranslations[locale],entry.hintTranslation);hintFields++;}
      }
      if(npc){assert(runtime.packedRecordingFor(ja,sid,t.id,role,voices.roles[role].speakerId));assert.equal(runtime.packedRecordingFor(ja+'変更',sid,t.id,role,voices.roles[role].speakerId),null);npcBindings++;}
    }
  }
  const reviewed=prefectures.reduce((n,p)=>n+p.aiSentenceTaskReviewedScenarios,0);
  const result={status:'PASS_KINKI_DATA_RUNTIME_BINDINGS',region:'kinki',scenarios:members.length,
    targetLocales:locales.length,sentenceFields,hintFields,rubyTurns,npcBindings,
    aiContextReviewedScenarios:reviewed,remainingContextScenarios:1115-reviewed,
    actualLoaderTested:true,nativeReviewed:false,deviceVerified:false,audioPerceptuallyApproved:false,releaseAccepted:false};
  const out=process.argv.indexOf('--out');
  if(out>=0){assert(process.argv[out+1]);fs.writeFileSync(path.resolve(root,process.argv[out+1]),JSON.stringify(result,null,2)+'\n');}
  console.log(JSON.stringify(result));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
