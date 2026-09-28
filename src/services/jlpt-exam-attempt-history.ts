import AsyncStorage from '@react-native-async-storage/async-storage';

import { loadJlptTrialSession } from '@/services/jlpt-trial-session-storage';

export type JlptAttemptSummary = { attempts: number; latestCorrect: number; latestTotal: number; latestSubmittedAt: string | null };

const keyFor = (storageKey: string) => `${storageKey}:attempt-history:v1`;
const empty = (): JlptAttemptSummary => ({ attempts: 0, latestCorrect: 0, latestTotal: 0, latestSubmittedAt: null });

async function readHistory(storageKey: string): Promise<JlptAttemptSummary> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(storageKey));
    if (!raw) return empty();
    const value = JSON.parse(raw) as JlptAttemptSummary;
    if (!Number.isInteger(value.attempts) || value.attempts < 0) return empty();
    return value;
  } catch { return empty(); }
}

export async function loadJlptAttemptSummary(storageKey: string): Promise<JlptAttemptSummary> {
  const history = await readHistory(storageKey);
  const session = await loadJlptTrialSession(storageKey);
  // Count a submitted session from older app versions once, without changing its saved answers.
  if (session?.submitted && session.result && session.submittedAt && session.submittedAt !== history.latestSubmittedAt) {
    const next = { attempts: history.attempts + 1, latestCorrect: session.result.correct, latestTotal: session.result.total, latestSubmittedAt: session.submittedAt };
    await AsyncStorage.setItem(keyFor(storageKey), JSON.stringify(next));
    return next;
  }
  return history;
}

export async function recordJlptAttempt(storageKey: string, result: { correct: number; total: number }, submittedAt: string) {
  const history = await readHistory(storageKey);
  if (history.latestSubmittedAt === submittedAt) return;
  const next = { attempts: history.attempts + 1, latestCorrect: result.correct, latestTotal: result.total, latestSubmittedAt: submittedAt };
  await AsyncStorage.setItem(keyFor(storageKey), JSON.stringify(next));
}
