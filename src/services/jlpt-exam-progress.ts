import AsyncStorage from '@react-native-async-storage/async-storage';
import qualificationMetadata from '@/data/jlpt-qualification-metadata.json';
import { loadJlptAttemptSummary } from '@/services/jlpt-exam-attempt-history';
import { RANKS, type JlptRank } from '@/services/learning-economy';

// The lightweight index mirrors the playable catalog; do not load questions or audio here.
const exams = qualificationMetadata as { id: string; level: JlptRank; storageKey: string }[];
type ExamProgress = Record<JlptRank, { completed: number; total: number }>;
function emptyProgress(): ExamProgress {
    return Object.fromEntries(RANKS.map(level => [level, {
        completed: 0,
        total: new Set(exams.filter(exam => exam.level === level).map(exam => exam.id)).size,
    }])) as ExamProgress;
}

export const initialJlptExamProgress = emptyProgress();

/** Count distinct submitted exams, regardless of score; retries count only once. */
export async function getJlptExamProgress(): Promise<ExamProgress> {
    const progress = emptyProgress();
    const savedKeys = new Set(await AsyncStorage.getAllKeys());
    const completed = new Set<string>();
    await Promise.all(exams.map(async exam => {
        if (!savedKeys.has(exam.storageKey) && !savedKeys.has(`${exam.storageKey}:attempt-history:v1`)) return;
        const summary = await loadJlptAttemptSummary(exam.storageKey);
        if (summary.attempts > 0 && !completed.has(exam.id)) {
            completed.add(exam.id);
            progress[exam.level].completed += 1;
        }
    }));
    return progress;
}
