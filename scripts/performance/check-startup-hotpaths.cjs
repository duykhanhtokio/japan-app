'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const clock = require('node:perf_hooks').performance;
const {runtime} = require('./module-runtime.cjs');
const baseline = process.argv[2] || '022966903c5c3d074645cc3523a852f56d64baed';
const digest = value => crypto.createHash('sha256').update(JSON.stringify(value) ?? 'undefined').digest('hex');
const levels = ['N5','N4','N3','N2','N1'];
const old = runtime(baseline).load('src/data/jlpt-study-data.ts');
const fresh = runtime(), current = fresh.load('src/data/jlpt-study-data.ts');
assert.equal(fresh.jsonLoads.length,0,'Route discovery must evaluate zero curriculum JSON');
assert(Array.isArray(current.generatedVocabulary));
assert.equal(fresh.jsonLoads.length,0,'Array.isArray must not trigger loading');
assert.equal(current.getKanaRomaji('きゃ'), old.getKanaRomaji('きゃ'));
assert.equal(digest(current.generatedGrammar),digest(old.generatedGrammar));
assert(!fresh.jsonLoads.some(row=>row.path.includes('vocabulary')),'Grammar must not initialize vocabulary');
for (const level of levels) {
    const rows = current.getVocabularyForLevel(level);
    assert.equal(digest(rows),digest(old.generatedVocabulary.filter(row=>row.jlpt===level)));
    assert.strictEqual(current.getVocabularyForLevel(level),rows,'Returning to a level uses the cache');
}
assert.equal(digest(current.generatedVocabulary),digest(old.generatedVocabulary),'All 8350 localized words preserve fields/order');
assert.deepEqual(Object.keys(current.generatedVocabulary),Object.keys(old.generatedVocabulary));
assert.equal(digest([...current.generatedVocabulary]),digest(old.generatedVocabulary));
for (const word of current.generatedVocabulary) assert.strictEqual(current.getStudyVocabularyById(word.id),word);
assert.equal(current.getStudyVocabularyById('missing-vocabulary-id'),undefined);
const minimal=runtime();minimal.load('src/data/jlpt-study-data.ts').getVocabularyCopy('vi');
assert.deepEqual(minimal.jsonLoads.map(row=>row.path),['src/data/generated/vocabulary-ui-localizations.json']);
// Public legacy lookup APIs retain source-bound meanings, repairs and alias order.
const a=runtime(baseline).load('src/data/vocabulary-localization.ts');
const b=runtime().load('src/data/vocabulary-localization.ts');
for (const word of old.generatedVocabulary) {
    assert.equal(digest(b.findVocabularyByJapanese(word.word,word.reading)),digest(a.findVocabularyByJapanese(word.word,word.reading)));
    assert.equal(digest(b.getPlannedVocabularyItem(word.word,word.reading)),digest(a.getPlannedVocabularyItem(word.word,word.reading)));
}
const planned=JSON.parse(fs.readFileSync('src/data/generated/vocabulary-planned-source.json','utf8'));
for (const word of planned) for(const locale of ['ja','vi','en','km'])
    assert.equal(b.getPlannedVocabularyMeaning(word.word,word.reading,locale),a.getPlannedVocabularyMeaning(word.word,word.reading,locale));
const {lazyArray}=runtime().load('src/services/lazy-array.ts');
let loads=0;const array=lazyArray(()=>{loads++;return [{id:1},{id:2}];});
assert(Array.isArray(array));assert.equal(loads,0);assert.equal(array.length,2);assert.equal(loads,1);
assert.equal(Object.getOwnPropertyDescriptor(array,'length').value,2);
array.push({id:3});array[0]={id:4};delete array[1];assert.equal(array.length,3);assert(!(1 in array));
Object.freeze(array);assert(Object.isFrozen(array));assert.throws(()=>array.push({id:5}));
let attempts=0;const retry=lazyArray(()=>{if(++attempts===1)throw Error('expected');return [9];});
assert.throws(()=>retry.length);assert.equal(retry[0],9);assert.equal(attempts,2);
const beforeUi=runtime(baseline).load('src/i18n/ui-text.ts'), afterUi=runtime().load('src/i18n/ui-text.ts');
const copy=JSON.parse(fs.readFileSync('src/i18n/ui-copy.json','utf8'));
const cases=['','日本語のみ','missing source','__proto__','constructor'];
for (const row of Object.values(copy)) cases.push(row.vi,` \n${row.vi}\t `,row.vi.replace(/\{\w+\}/g,'12'),row.vi.replace(/\{\w+\}/g,'日本語 🌱 [x]'));
for (const text of cases) for (const locale of Object.keys(Object.values(copy)[0]))
    assert.equal(afterUi.translatedUiSource(text,locale),beforeUi.translatedUiSource(text,locale));
const sums = rows => ({files:rows.length,rawJsonBytes:rows.reduce((n,row)=>n+row.bytes,0)});
function scenario(ref, action) {
    const r=runtime(ref),start=clock.now();
    const data=r.load('src/data/jlpt-study-data.ts');action(data);
    const ms=clock.now()-start;
    return {ms,...sums(r.jsonLoads)};
}
const scenarios = {
    moduleEvaluation: [()=>{},()=>{}],
    grammarFirst:[d=>d.generatedGrammar.filter(x=>x.jlpt==='N5'),d=>d.generatedGrammar.filter(x=>x.jlpt==='N5')],
    n5VocabularyFirst:[d=>d.generatedVocabulary.filter(x=>x.jlpt==='N5'),d=>d.getVocabularyForLevel('N5')],
    oneWordFirst:[d=>d.generatedVocabulary.find(x=>x.id==='VOC1402'),d=>d.getStudyVocabularyById('VOC1402')],
};
const timings={};
for(const [name,actions]of Object.entries(scenarios)){
    const results=[];
    for(let variant=0;variant<2;variant++){
        const ref=variant===0?baseline:undefined, action=actions[variant];
        scenario(ref,action); // warm transpilation and OS file caches, not module/data caches
        const runs=[];
        for(let i=0;i<3;i++){global.gc?.();runs.push(scenario(ref,action));}
        const median=[...runs].sort((a,b)=>a.ms-b.ms)[1];
        results.push({medianMs:median.ms,files:median.files,rawJsonBytes:median.rawJsonBytes,runsMs:runs.map(x=>x.ms)});
    }
    timings[name]={before:results[0],after:results[1]};
}
function uiRun(api){const start=clock.now();let count=0;for(let i=0;i<30;i++)for(const text of cases)if(api.translatedUiSource(text,'ja')!==undefined)count++;return {ms:clock.now()-start,count};}
uiRun(beforeUi);uiRun(afterUi);
const uiBefore=Array.from({length:3},()=>uiRun(beforeUi)),uiAfter=Array.from({length:3},()=>uiRun(afterUi));
assert.equal(uiBefore[0].count,uiAfter[0].count);
const repeated=runtime().load('src/data/jlpt-study-data.ts');repeated.getVocabularyForLevel('N5');
const repeatRuns=Array.from({length:3},()=>{const start=clock.now();repeated.getVocabularyForLevel('N5');return clock.now()-start;});
const report={status:'PASS',baseline,environment:{node:process.version,platform:process.platform,mode:'isolated JS module evaluation with production JSON packing; no Metro, Hermes or native I/O',samples:3,compilerAndOsFileCaches:'warm',moduleAndJsonCaches:'fresh per first-use sample'},preserved:{vocabulary:current.generatedVocabulary.length,grammar:current.generatedGrammar.length,levelOrderingAndAllFields:true,aliasesAndPlannedMeanings:true,uiCases:cases.length,arraySemantics:true},timings,uiTranslation:{callsPerRun:cases.length*30,beforeMs:uiBefore.map(x=>x.ms),afterMs:uiAfter.map(x=>x.ms)},n5VocabularyRepeatMs:repeatRuns,deviceStartupMeasured:false,bundleSizeMeasured:false,nativePeakMemoryMeasured:false};
if(process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
