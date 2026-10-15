import AsyncStorage from '@react-native-async-storage/async-storage';
import qualificationMetadata from '@/data/jlpt-qualification-metadata.json';
import { loadJlptTrialSession } from '@/services/jlpt-trial-session-storage';
import { loadJlptAttemptSummary } from '@/services/jlpt-exam-attempt-history';
import { loadLearningEconomy, recordQualifiedExam, type JlptRank, type LearningEconomy } from '@/services/learning-economy';

// Home needs IDs and saved-session keys, never the question/audio registry.
const qualificationExams = qualificationMetadata as { id: string; level: JlptRank; storageKey: string }[];
let pendingSync: Promise<LearningEconomy> | undefined;

/** Read saved submitted sessions without changing the locked JLPT exam interface. */
async function syncSavedQualifications() {
  const state = await loadLearningEconomy();
  const savedKeys = new Set(await AsyncStorage.getAllKeys());
  for (const exam of qualificationExams) {
    if (state.passed[exam.level][exam.id]) continue;
    if (!savedKeys.has(exam.storageKey) && !savedKeys.has(`${exam.storageKey}:attempt-history:v1`)) continue;
    const [session,summary] = await Promise.all([loadJlptTrialSession(exam.storageKey),loadJlptAttemptSummary(exam.storageKey)]);
    if (summary.bestTotal) await recordQualifiedExam(exam.id, exam.level, summary.bestCorrect??0, summary.bestTotal);
    else if (session?.submitted && session.result) await recordQualifiedExam(exam.id, exam.level, session.result.correct, session.result.total);
  }
  return loadLearningEconomy();
}

export function syncJlptQualification() {
  if (!pendingSync) pendingSync = syncSavedQualifications().finally(() => { pendingSync = undefined; });
  return pendingSync;
}
