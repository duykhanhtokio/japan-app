const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { stripTypeScriptTypes } = require('node:module');
const metadata = JSON.parse(fs.readFileSync('src/data/jlpt-qualification-metadata.json', 'utf8'));
const ranks = ['N5', 'N4', 'N3', 'N2', 'N1'];
const registry = fs.readFileSync('src/data/jlpt-official/approved-n1-exams.ts', 'utf8');
const registered = [...registry.matchAll(/id:\s*'([^']+)'\s*,\s*level:\s*'(N[1-5])'/g)].map(m => [m[1], m[2]]);
assert.deepEqual(metadata.map(e => [e.id, e.level]), registered, 'Lightweight index must match the actual exam catalog');
const source = fs.readFileSync('src/services/jlpt-exam-progress.ts', 'utf8');
assert(!source.includes('approved-n1-exams'), 'Landing page must not load question/audio registry');
const code = stripTypeScriptTypes(source).replace(/^import[^;]+;\s*/gm, '').replace(/export /g, '');
const keys = [], histories = new Map(), calls = [];
const context = {
    qualificationMetadata: metadata, RANKS: ranks,
    AsyncStorage: { getAllKeys: async () => keys },
    loadJlptAttemptSummary: async key => { calls.push(key); return histories.get(key) ?? { attempts: 0 }; },
};
vm.createContext(context);
vm.runInContext(code + '\nglobalThis.getProgress = getJlptExamProgress;', context);
(async () => {
    let progress = await context.getProgress();
    assert.equal(calls.length, 0, 'Fresh install skips all empty sessions');
    for (const level of ranks) {
        assert.equal(progress[level].total, metadata.filter(e => e.level === level).length);
        assert.equal(progress[level].completed, 0);
        const [submitted, inProgress] = metadata.filter(e => e.level === level);
        keys.push(submitted.storageKey, `${submitted.storageKey}:attempt-history:v1`, inProgress.storageKey);
        histories.set(submitted.storageKey, { attempts: 7, latestCorrect: 0, latestTotal: 10 });
    }
    progress = await context.getProgress();
    for (const level of ranks) assert.equal(progress[level].completed, 1, 'Retried or failed submissions count once; unfinished exams do not count');
    calls.length = 0;
    keys.splice(0, keys.length, ...metadata.map(e => `${e.storageKey}:attempt-history:v1`));
    for (const exam of metadata) histories.set(exam.storageKey, { attempts: 1 });
    progress = await context.getProgress();
    for (const level of ranks) assert.equal(progress[level].completed, progress[level].total, 'Reset sessions retain completed history');
    const screen = fs.readFileSync('src/screens/on-demand/learn.tsx', 'utf8');
    assert(screen.includes('useFocusEffect(useCallback('), 'Refresh after returning from an exam');
    assert(!screen.includes('learnedIds') && !screen.includes("progressText.split('/')"));
    console.log('JLPT EXAM PROGRESS PASS:', JSON.stringify(progress), '; fresh install, retries, failed submissions, unfinished sessions, retained histories, focus refresh');
})().catch(error => { console.error(error); process.exitCode = 1; });
