import AsyncStorage from '@react-native-async-storage/async-storage';
import { N1_2012_07_SESSION_KEY } from '@/data/jlpt-official/n1-2012-07-trial';

const STORAGE_KEY = N1_2012_07_SESSION_KEY;

export type N1TrialSession = {
  version: 4;
  answers: Record<string, string>;
  mode: 'exam' | 'practice';
  status: 'not_started' | 'in_progress' | 'submitted' | 'reviewing';
  started: boolean;
  submitted: boolean;
  currentQuestion: string;
  scrollY: number;
  playedAudioSegments: string[];
  submittedAt: string | null;
  result: { correct: number; wrong: number; unanswered: number; total: number } | null;
  updatedAt: string;
};

export async function loadN1TrialSession(): Promise<N1TrialSession | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<Omit<N1TrialSession, 'version'>> & { version?: number };
    if (![1, 2, 3, 4].includes(value.version ?? 0) || !value.answers || (value.mode !== 'exam' && value.mode !== 'practice')) {
      if (__DEV__) console.warn('[JLPT] Ignored an incompatible N1 trial session.');
      return null;
    }
    return {
      version: 4,
      answers: value.answers,
      mode: value.mode,
      started: !!value.started,
      submitted: !!value.submitted,
      status: value.status === 'reviewing' || value.status === 'submitted' || value.status === 'in_progress' || value.status === 'not_started'
        ? value.status
        : value.submitted ? 'submitted' : value.started ? 'in_progress' : 'not_started',
      currentQuestion: value.currentQuestion ?? '',
      scrollY: Number.isFinite(value.scrollY) ? Math.max(0, value.scrollY ?? 0) : 0,
      playedAudioSegments: Array.isArray(value.playedAudioSegments)
        ? value.playedAudioSegments.filter((id): id is string => typeof id === 'string')
        : [],
      submittedAt: typeof value.submittedAt === 'string' ? value.submittedAt : null,
      result: value.result && Number.isFinite(value.result.correct) && Number.isFinite(value.result.total)
        ? value.result
        : null,
      updatedAt: value.updatedAt ?? new Date(0).toISOString(),
    };
  } catch {
    return null;
  }
}

export async function saveN1TrialSession(session: Omit<N1TrialSession, 'version' | 'updatedAt'>) {
  const value: N1TrialSession = { ...session, version: 4, updatedAt: new Date().toISOString() };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export async function clearN1TrialSession() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
