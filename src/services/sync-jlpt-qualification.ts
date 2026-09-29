import { APPROVED_N1_EXAMS } from '@/data/jlpt-official/approved-n1-exams';
import { loadJlptTrialSession } from '@/services/jlpt-trial-session-storage';
import { loadJlptAttemptSummary } from '@/services/jlpt-exam-attempt-history';
import { loadLearningEconomy, recordQualifiedExam } from '@/services/learning-economy';

/** Read saved submitted sessions without changing the locked JLPT exam interface. */
export async function syncJlptQualification() {
  const state = await loadLearningEconomy();
  for (const exam of APPROVED_N1_EXAMS) {
    if (state.passed[exam.level][exam.id]) continue;
    const [session,summary] = await Promise.all([loadJlptTrialSession(exam.storageKey),loadJlptAttemptSummary(exam.storageKey)]);
    if (summary.bestTotal) await recordQualifiedExam(exam.id, exam.level, summary.bestCorrect??0, summary.bestTotal);
    else if (session?.submitted && session.result) await recordQualifiedExam(exam.id, exam.level, session.result.correct, session.result.total);
  }
  return loadLearningEconomy();
}
