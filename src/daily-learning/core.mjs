/** Pure, server-clock policy. No UI or device clock is an authority for rewards. */
export const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
export const originalExam = id => /^n[1-5]-\d{4}-\d{2}-exam-\d+$/.test(id);
export const dayAt = now => new Date(now + 9 * 60 * 60 * 1000).toISOString().slice(0, 10); // Fixed JST, never device timezone.
export function createState(level, catalog) {
    if (!LEVELS.includes(level)) throw Error('Choose a JLPT level first');
    const first = catalog.find(e => e.level === level && originalExam(e.id));
    if (!first) throw Error('No original exam at initial level');
    return { version: 1, initialLevel: level, level, freeExamId: first.id, completedDays: [], learned: [], mistakes: {}, keys: 0, tickets: 0, grants: {}, runs: {}, receipts: {}, challenge: null };
}
const normalized = text => text.normalize('NFKC').trim().toLowerCase();
function hash(text) { let n = 2166136261; for (const ch of text) n = Math.imul(n ^ ch.charCodeAt(0), 16777619); return n >>> 0; }
export function shuffle(items, seed) { return [...items].map((x, i) => [hash(seed + ':' + i + ':' + x.id), x]).sort((a,b) => a[0]-b[0]).map(x => x[1]); }
export function selectWords(words, state, day, locale) {
    const learned = new Set(state.learned), seen = [new Set(), new Set(), new Set()];
    const candidates = shuffle(words.filter(w => w.level === state.level && w.word && w.reading && w.meaning && w.status !== 'Rejected'
        && [...w.word].length <= 12 && [...w.reading].length <= 14 && [...w.meaning].length <= 30), day + locale)
        .sort((a,b) => Number(learned.has(a.id))-Number(learned.has(b.id)) || (state.mistakes[b.id]??0)-(state.mistakes[a.id]??0));
    const result = [];
    for (const w of candidates) {
        const parts = [w.word, w.reading, w.meaning].map(normalized);
        if (parts.some((x,i) => seen[i].has(x))) continue;
        parts.forEach((x,i) => seen[i].add(x)); result.push(w);
        if (result.length === 10) return result;
    }
    throw Error('Not enough unambiguous localized words for this level');
}
export function ensureChallenge(state, words, now, locale) {
    const day = dayAt(now);
    if (state.challenge?.day === day) return state.challenge;
    state.challenge = { day, locale, level: state.level, words: selectWords(words, state, day, locale), matched: [], attempts: [] };
    return state.challenge;
}
export function checkMatch(challenge, tuple) {
    if (!Array.isArray(tuple) || tuple.length !== 3) return false;
    const [a,b,c] = tuple.map(id => challenge.words.find(w => w.id === id));
    return !!a && !!b && !!c && normalized(a.reading) === normalized(b.reading) && normalized(a.meaning) === normalized(c.meaning);
}
export function recordMatches(state, day, tuples, now) {
    const ch = state.challenge;
    if (!ch || ch.day !== day || dayAt(now) !== day) throw Error('Daily mission has expired');
    if (!Array.isArray(tuples) || tuples.length > 300) throw Error('Invalid matching evidence');
    // Evidence can be safely replayed after a disconnected client retries.
    for (const tuple of tuples) {
        if (checkMatch(ch, tuple)) {
            if (!ch.matched.includes(tuple[0])) ch.matched.push(tuple[0]);
        }
    }
    if (ch.matched.length !== 10 || state.completedDays.includes(day)) return { completed: ch.matched.length === 10, keyAwarded: false };
    state.completedDays.push(day);
    for (const w of ch.words) if (!state.learned.includes(w.id)) state.learned.push(w.id);
    // Each failed attempt counts once per challenge evidence position, not on every retry.
    tuples.slice(ch.attempts.length).filter(t => !checkMatch(ch,t)).forEach(t => {
        if (ch.words.some(w=>w.id===t?.[0])) state.mistakes[t[0]] = (state.mistakes[t[0]]??0)+1;
    });
    ch.attempts = tuples;
    const keyAwarded = state.completedDays.length % 7 === 0;
    if (keyAwarded) state.keys += 1;
    return { completed: true, keyAwarded };
}
export function accessTo(state, examId, now, premiumUntil = 0, runId) {
    const run = runId && state.runs[runId];
    if (run && run.examId !== examId) throw Error('Wrong exam session');
    if (run?.source === 'premium' && !run.submitted) return { allowed: true, source: 'premium-run', expiresAt: null };
    if (premiumUntil > now) return { allowed: true, source: 'premium', expiresAt: premiumUntil };
    if (examId === state.freeExamId) return { allowed: true, source: 'free', expiresAt: null };
    if (originalExam(examId) && state.grants[examId] > now) return { allowed: true, source: 'ticket', expiresAt: state.grants[examId] };
    return { allowed: false, source: originalExam(examId) ? 'ticket-required' : 'premium-required', expiresAt: state.grants[examId]??null };
}
export function exchangeKeys(state, operationId) {
    if (!operationId || operationId.length > 100) throw Error('Invalid transaction ID');
    if (state.receipts[operationId]) return { ...state.receipts[operationId], replayed: true };
    if (state.keys < 4) throw Error('Four keys required');
    state.keys -= 4; state.tickets += 1;
    return state.receipts[operationId] = { kind: 'exchange', ticketAwarded: true };
}
export function unlockExam(state, examId, now, premiumUntil, operationId, catalog) {
    if (!catalog.some(e=>e.id===examId) || !originalExam(examId)) throw Error('Tickets only open original exams');
    if (!operationId || operationId.length > 100) throw Error('Invalid transaction ID');
    if (state.receipts[operationId]) {
        if (state.receipts[operationId].examId !== examId) throw Error('Transaction ID already used');
        return { ...state.receipts[operationId], replayed: true };
    }
    if (accessTo(state,examId,now,premiumUntil).allowed) return { kind: 'already-open', examId, expiresAt: state.grants[examId]??null };
    if (state.tickets < 1) throw Error('A golden ticket is required');
    state.tickets -= 1; state.grants[examId] = now + WEEK_MS;
    return state.receipts[operationId] = { kind: 'unlock', examId, expiresAt: state.grants[examId] };
}
export function startRun(state, examId, runId, now, premiumUntil, catalog) {
    if (!runId || runId.length > 100 || !catalog.some(e=>e.id===examId)) throw Error('Invalid exam session');
    if (state.runs[runId]) return accessTo(state,examId,now,premiumUntil,runId);
    const access = accessTo(state,examId,now,premiumUntil);
    if (!access.allowed) throw Error('Exam is locked');
    state.runs[runId] = { examId, source: access.source, startedAt: now, submitted: false };
    return access;
}
export function submitRun(state, examId, runId, now, premiumUntil) {
    if (!state.runs[runId] || state.runs[runId].examId !== examId) throw Error('Unknown exam session');
    if (state.runs[runId].submitted) return { submitted: true };
    if (!accessTo(state,examId,now,premiumUntil,runId).allowed) throw Error('Exam access expired');
    state.runs[runId].submitted = true;
    return { submitted: true };
}
