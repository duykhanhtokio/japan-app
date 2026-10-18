const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const dep = n => require(require.resolve(n, { paths: [process.env.TOKUTEI_QA_MODULES || root] }));
const languages = ['ja','en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const scripts = { ja:/[\u3040-\u30ff\u3400-\u9fff]/, 'zh-CN':/[\u3400-\u9fff]/, 'zh-TW':/[\u3400-\u9fff]/, hi:/[\u0900-\u097f]/, ne:/[\u0900-\u097f]/, bn:/[\u0980-\u09ff]/, my:/[\u1000-\u109f]/, th:/[\u0e00-\u0e7f]/, km:/[\u1780-\u17ff]/ };
async function load(mutatedSource = false) {
    const plugins = mutatedSource ? [{ name:'changed-source', setup(b) {
        b.onLoad({filter:/generated\/grammar\.json$/}, a => {
            const value = JSON.parse(fs.readFileSync(a.path,'utf8'));
            const item = value.find(x => x.id === 'GR0007');
            item.name += '（更新）'; item.exampleJa = 'これは翻訳未更新の新しい例文です。';
            return { contents:JSON.stringify(value), loader:'json' };
        });
    }}] : [];
    const b = await dep('esbuild').build({entryPoints:[path.join(root,'src/data/jlpt-study-data.ts'),path.join(root,'src/i18n/grammar-copy.ts')],outdir:'qa',write:false,bundle:true,platform:'node',format:'cjs',logLevel:'error',plugins});
    return b.outputFiles.map(f => { const m={exports:{}}; new Function('module','exports','require',f.text)(m,m.exports,require); return m.exports; });
}
(async () => {
    const modules = await load(), api = modules.find(m => m.generatedGrammar), copy = modules.find(m => m.getGrammarCopy);
    const items = api.generatedGrammar, bindings = read('src/data/generated/grammar-source-bindings.json');
    const meanings = read('src/data/generated/grammar-meaning-translations.json');
    const examples = read('src/data/generated/grammar-example-localizations.json');
    const expected = read('docs/grammar-workspace/expected-ids.json');
    assert.equal(items.length,540); assert.equal(new Set(items.map(x=>x.id)).size,540);
    assert.deepEqual(items.map(x=>x.id),expected,'stable IDs and display order');
    for(const bundle of [bindings,meanings,examples]) assert.deepEqual(Object.keys(bundle).sort(),[...expected].sort(),'exact ID set');
    const counts = {N5:86,N4:106,N3:94,N2:105,N1:149};
    for(const [level,n] of Object.entries(counts)) assert.equal(items.filter(x=>x.jlpt===level).length,n,level);
    for(const x of items) {
        assert.equal(x.status,'Approved',x.id+' unresolved draft');
        for(const field of ['name','pattern','meaningVi','exampleJa','exampleVi','exampleReading']) {
            assert(x[field]?.trim(),x.id+' missing '+field);
            assert(!/\\u[0-9a-fA-F]{4}|TODO|PLACEHOLDER|\?\s*→/.test(x[field]),x.id+' unfinished '+field);
        }
        assert(!/[A-Za-z\u3400-\u9fff]/.test(x.exampleReading),x.id+' non-kana reading');
        for(const field of ['name','meaningVi','pattern','exampleJa']) assert.equal(x[field],bindings[x.id][field],x.id+' source binding '+field);
        for(const language of languages) {
            const definition = api.getGrammarMeaning(x,language), ui = copy.getGrammarCopy(language);
            assert(definition?.trim() && definition !== ui.pending,x.id+' missing meaning '+language);
            if(scripts[language]) assert(scripts[language].test(definition),x.id+' meaning script '+language);
            assert.equal(definition,language==='vi'?x.meaningVi:meanings[x.id][language]);
            if(language==='ja') assert.equal(api.getGrammarExampleTranslation(x,language),undefined);
            else {
                const value = api.getGrammarExampleTranslation(x,language);
                assert(value?.trim() && value !== ui.pending,x.id+' missing example '+language);
                assert.equal(value,examples[x.id].translations[language],x.id+' example translation '+language);
                if(scripts[language]) assert(scripts[language].test(value),x.id+' example script '+language);
            }
        }
    }
    // Reproduces a future source edit without updated translations. Never show a
    // translation of a different sentence or silently fall back to English.
    const changed = (await load(true)).find(m=>m.generatedGrammar);
    const stale = changed.generatedGrammar.find(x=>x.id==='GR0007');
    assert.equal(stale.exampleReading,undefined);
    for(const l of languages.filter(l=>!['ja','vi'].includes(l))) {
        assert.equal(changed.getGrammarMeaning(stale,l),copy.getGrammarCopy(l).pending);
        assert.equal(changed.getGrammarExampleTranslation(stale,l),copy.getGrammarCopy(l).pending);
    }
    const errors = {GR0008:'かいかた',GR0047:'さわらない',GR0102:'にげろ',GR0212:'かえろう',GR0214:'はさむ',GR0244:'たのみ',GR0418:'かわきりに',GR0490:'のっとって'};
    for(const [id,term] of Object.entries(errors)) assert(items.find(x=>x.id===id).exampleReading.includes(term),id+' reading regression');
    const duplicates = new Map(); for(const x of items){const bucket=duplicates.get(x.exampleJa)||[];bucket.push(x.id);duplicates.set(x.exampleJa,bucket);}
    const intentionalSharedExamples=[...duplicates].filter(([,ids])=>ids.length>1).map(([sourceJa,ids])=>({sourceJa,ids}));
    const report = {status:'PASS',date:'2026-10-18',patterns:540,byLevel:counts,languages:13,meaningsPerLanguage:540,JapaneseExamples:540,exampleTranslationsPerLanguage:540,stableIdsAndOrder:true,sourceBindingAndStaleTranslationGuard:true,unresolvedDrafts:0,nativeReviewed:false,reviewScope:'AI source editorial review and all-locale structural QA; focused multilingual semantic repairs, not all-locale native certification',intentionalSharedExamples,sourceFiles:Object.fromEntries(['grammar.json','grammar-meaning-translations.json','grammar-example-localizations.json','grammar-source-bindings.json'].map(n=>[n,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'src/data/generated',n))).digest('hex')]))};
    fs.writeFileSync(path.join(root,'docs/grammar-workspace/quality-qa.json'),JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1);});
