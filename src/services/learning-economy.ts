import AsyncStorage from '@react-native-async-storage/async-storage';

export type JlptRank = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export const RANKS: readonly JlptRank[] = ['N5', 'N4', 'N3', 'N2', 'N1'];
export const RANK_COLORS: Record<JlptRank, string> = {
  N5: '#50745c', N4: '#63b9df', N3: '#bf936c', N2: '#71513b', N1: '#c34545',
};
export const CREDIT_CAPACITY = 100;
export const EXAM_COST = 10;
export const DIALOGUE_COST = 5;
const STORAGE_KEY = '@japan_app_learning_economy_v1';

type Charge = { amount: number; refunded: boolean; kind: 'exam' | 'dialogue' };
export type LearningEconomy = {
  credits: number;
  charges: Record<string, Charge>;
  passed: Record<JlptRank, Record<string, true>>;
  officialRank: JlptRank | null;
};
const empty = (): LearningEconomy => ({ credits: CREDIT_CAPACITY, charges: {}, passed: { N5: {}, N4: {}, N3: {}, N2: {}, N1: {} }, officialRank: null });
let queue: Promise<unknown> = Promise.resolve();
function serial<T>(action: () => Promise<T>): Promise<T> {
  const next = queue.then(action, action);
  queue = next.catch(() => undefined);
  return next;
}
async function read(): Promise<LearningEconomy> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return empty();
  try {
    const parsed = JSON.parse(raw) as Partial<LearningEconomy>;
    if (!Number.isFinite(parsed.credits)) return empty();
    return { ...empty(), ...parsed, credits: Math.max(0, Math.min(CREDIT_CAPACITY, parsed.credits!)), passed: { ...empty().passed, ...parsed.passed } };
  } catch { return empty(); }
}
export const loadLearningEconomy = () => serial(read);
export function chargeLearningSession(id: string, kind: Charge['kind']) {
  return serial(async () => {
    const state = await read();
    if (state.charges[id]) return { allowed: true, charged: false, state };
    const amount = kind === 'exam' ? EXAM_COST : DIALOGUE_COST;
    if (state.credits < amount) return { allowed: false, charged: false, state };
    const next = { ...state, credits: state.credits - amount, charges: { ...state.charges, [id]: { amount, refunded: false, kind } } };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return { allowed: true, charged: true, state: next };
  });
}
/** Call only after the reward-ad provider confirms a completed viewing. */
export function refundCompletedAd(id: string) {
  return serial(async () => {
    const state = await read();
    const charge = state.charges[id];
    if (!charge || charge.refunded) return { refunded: false, state };
    const next = { ...state, credits: Math.min(CREDIT_CAPACITY, state.credits + charge.amount), charges: { ...state.charges, [id]: { ...charge, refunded: true } } };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return { refunded: true, state: next };
  });
}
export function earnCredits(amount: number) {
  return serial(async () => {
    if (!Number.isInteger(amount) || amount <= 0) throw new Error('Invalid credit amount');
    const state = await read();
    const next = { ...state, credits: Math.min(CREDIT_CAPACITY, state.credits + amount) };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  });
}
export function recordQualifiedExam(examId: string, level: JlptRank, correct: number, total: number) {
  return serial(async () => {
    const state = await read();
    if (!total || correct / total < 0.8 || !examId) return state;
    const passed = { ...state.passed, [level]: { ...state.passed[level], [examId]: true as const } };
    const achieved = RANKS.filter(rank => Object.keys(passed[rank]).length >= 6).at(-1) ?? null;
    const officialRank = achieved && (!state.officialRank || RANKS.indexOf(achieved) > RANKS.indexOf(state.officialRank)) ? achieved : state.officialRank;
    const next = { ...state, passed, officialRank };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  });
}
