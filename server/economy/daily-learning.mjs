import { readFileSync } from 'node:fs';
import { createState, ensureChallenge, recordMatches, exchangeKeys, unlockExam, accessTo, startRun, submitRun, LEVELS } from '../../src/daily-learning/core.mjs';
const root = new URL('../../', import.meta.url);
const read = path => JSON.parse(readFileSync(new URL(path,root),'utf8'));
let corpus, bindings, repairs, meanings;
const bundles = new Map();
export function loadDailyWords(locale) {
    if (!/^(ja|vi|en|id|zh-CN|zh-TW|hi|bn|ne|my|th|km|tl)$/.test(locale)) throw Error('Unsupported language');
    corpus ??= read('src/data/generated/vocabulary.json');
    bindings ??= read('src/data/generated/vocabulary-localization-source.json').canonical;
    repairs ??= read('src/data/generated/vocabulary-source-repairs.json');
    meanings ??= read('src/data/generated/vocabulary-meaning-localizations.json');
    if (locale !== 'ja' && !bundles.has(locale)) bundles.set(locale,read(`src/data/generated/vocabulary-localizations/${locale}.json`));
    return corpus.map(original => {
        const repair = repairs[original.id];
        const word = repair?.originalWord === original.word && repair.originalReading === original.reading ? { ...original, ...repair } : original;
        const binding = bindings[word.id];
        const aligned = binding?.word === word.word && binding.reading === word.reading;
        const old = meanings[word.id];
        const fallback = old?.word === original.word && old.reading === original.reading ? old.translations?.[locale] : undefined;
        const meaning = (aligned ? bundles.get(locale)?.meanings?.[word.id] : undefined)
            ?? word.meaningTranslations?.[locale] ?? fallback ?? (locale==='vi'?word.meaningVi:locale==='en'?word.meaningEn:locale==='ja'?word.word:undefined);
        return { id:word.id, level:word.jlpt, word:word.word, reading:word.reading, meaning, status:word.status };
    });
}
const catalog = read('src/data/jlpt-qualification-metadata.json');
export async function runLearningAction(db, userId, action, data, options = {}) {
    const now = options.now ?? Date.now();
    const words = options.words ?? loadDailyWords;
    if (!LEVELS.includes(data.level)) throw Object.assign(Error('Choose your JLPT level'),{status:400});
    // New account's immutable initial choice is committed atomically; changing levels cannot reassign its free exam.
    await db.query('INSERT INTO learning_accounts(user_id,state) VALUES($1,$2) ON CONFLICT DO NOTHING',[userId,JSON.stringify(createState(data.initialLevel??data.level,catalog))]);
    const row = await db.query('SELECT state FROM learning_accounts WHERE user_id=$1 FOR UPDATE',[userId]);
    const state = typeof row.rows[0].state === 'string' ? JSON.parse(row.rows[0].state) : row.rows[0].state;
    const entitlement = await db.query('SELECT expires_at FROM economy_entitlements WHERE user_id=$1 AND revoked_at IS NULL',[userId]);
    const premiumUntil = entitlement.rows[0] ? Date.parse(entitlement.rows[0].expires_at) : 0;
    const locale = data.locale ?? 'vi'; let result = {};
    state.level = data.level;
    if (action === 'daily') ensureChallenge(state,words(locale),now,locale);
    else if (action === 'complete') result = recordMatches(state,data.day,data.matches,now);
    else if (action === 'exchange') result = exchangeKeys(state,data.operationId);
    else if (action === 'unlock') result = unlockExam(state,data.examId,now,premiumUntil,data.operationId,catalog);
    else if (action === 'access') result = accessTo(state,data.examId,now,premiumUntil,data.runId);
    else if (action === 'start') result = startRun(state,data.examId,data.runId,now,premiumUntil,catalog);
    else if (action === 'submit') {
        const session=data.session;
        if(!session?.submitted || !session.result || !session.submittedAt || !session.answers) throw Error('Invalid submitted session');
        result = submitRun(state,data.examId,data.runId,now,premiumUntil);
        state.archives ??= {}; state.archives[data.examId] ??= {};
        state.archives[data.examId][data.runId] ??= session;
    }
    else if (action !== 'account') throw Object.assign(Error('Unknown learning action'),{status:404});
    await db.query('UPDATE learning_accounts SET state=$2,updated_at=now() WHERE user_id=$1',[userId,JSON.stringify(state)]);
    return { serverNow:now, premiumUntil:Number.isFinite(premiumUntil)?premiumUntil:0, state, result };
}
