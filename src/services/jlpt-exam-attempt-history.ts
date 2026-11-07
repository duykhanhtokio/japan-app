import { learningStorageKey } from './learning-storage-scope';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { loadJlptTrialSession } from '@/services/jlpt-trial-session-storage';

export type JlptAttemptSummary = { attempts: number; latestCorrect: number; latestTotal: number; latestSubmittedAt: string | null; bestCorrect?: number; bestTotal?: number };

const keyFor = (storageKey: string) => learningStorageKey(`${storageKey}:attempt-history:v1`);
const empty = (): JlptAttemptSummary => ({ attempts: 0, latestCorrect: 0, latestTotal: 0, latestSubmittedAt: null });

async function readHistory(storageKey: string, physicalKey?: string): Promise<JlptAttemptSummary> {
  try {
    const raw = await AsyncStorage.getItem(physicalKey ?? await keyFor(storageKey));
    if (!raw) return empty();
    const value = JSON.parse(raw) as JlptAttemptSummary;
    if (!Number.isInteger(value.attempts) || value.attempts < 0) return empty();
    return value;
  } catch { return empty(); }
}

export async function loadJlptAttemptSummary(storageKey: string): Promise<JlptAttemptSummary> {
  const physicalKey = await keyFor(storageKey);
  const history = await readHistory(storageKey, physicalKey);
  const session = await loadJlptTrialSession(storageKey,physicalKey.slice(0,-':attempt-history:v1'.length));
  // Count a submitted session from older app versions once, without changing its saved answers.
  if (session?.submitted && session.result && session.submittedAt && session.submittedAt !== history.latestSubmittedAt) {
    const priorBest = (history.bestCorrect ?? history.latestCorrect) / ((history.bestTotal ?? history.latestTotal) || 1);
    const next = { attempts: history.attempts + 1, latestCorrect: session.result.correct, latestTotal: session.result.total, latestSubmittedAt: session.submittedAt,
      bestCorrect: session.result.correct / session.result.total >= priorBest ? session.result.correct : history.bestCorrect ?? history.latestCorrect,
      bestTotal: session.result.correct / session.result.total >= priorBest ? session.result.total : history.bestTotal ?? history.latestTotal };
    await AsyncStorage.setItem(physicalKey, JSON.stringify(next));
    return next;
  }
  return history;
}

export async function recordJlptAttempt(storageKey: string, result: { correct: number; total: number }, submittedAt: string) {
  const physicalKey = await keyFor(storageKey);
  const history = await readHistory(storageKey, physicalKey);
  if (history.latestSubmittedAt === submittedAt) return;
  const priorBest = (history.bestCorrect ?? history.latestCorrect) / ((history.bestTotal ?? history.latestTotal) || 1);
  const next = { attempts: history.attempts + 1, latestCorrect: result.correct, latestTotal: result.total, latestSubmittedAt: submittedAt,
    bestCorrect: result.correct / result.total >= priorBest ? result.correct : history.bestCorrect ?? history.latestCorrect,
    bestTotal: result.correct / result.total >= priorBest ? result.total : history.bestTotal ?? history.latestTotal };
  await AsyncStorage.setItem(physicalKey, JSON.stringify(next));
}
