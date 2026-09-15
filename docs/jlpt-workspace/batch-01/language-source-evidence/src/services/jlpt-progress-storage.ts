import AsyncStorage from '@react-native-async-storage/async-storage';
import type { JlptLevel, LearningSection } from '@/data/jlpt-learning';

const STORAGE_KEY = '@japan_app/jlpt_progress_v1';

export type JlptProgress = {
    learnedIds: string[];
    sectionScores: Partial<Record<`${JlptLevel}:${LearningSection}`, number>>;
    n5JourneyPosition?: {
        week: number;
        day: number;
    };
};

const EMPTY_PROGRESS: JlptProgress = { learnedIds: [], sectionScores: {} };

export async function getJlptProgress(): Promise<JlptProgress> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    try {
        const parsed = JSON.parse(raw) as Partial<JlptProgress>;
        return {
            learnedIds: Array.isArray(parsed.learnedIds) ? parsed.learnedIds : [],
            sectionScores: parsed.sectionScores ?? {},
            n5JourneyPosition: parsed.n5JourneyPosition,
        };
    } catch {
        return EMPTY_PROGRESS;
    }
}

export async function saveN5JourneyPosition(week: number, day: number) {
    const current = await getJlptProgress();
    const next: JlptProgress = {
        ...current,
        n5JourneyPosition: { week, day },
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
}

export async function toggleLearnedId(id: string): Promise<JlptProgress> {
    const current = await getJlptProgress();
    const learnedIds = current.learnedIds.includes(id)
        ? current.learnedIds.filter((item) => item !== id)
        : [...current.learnedIds, id];
    const next = { ...current, learnedIds };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
}

export async function saveSectionScore(level: JlptLevel, section: LearningSection, score: number) {
    const current = await getJlptProgress();
    const key: `${JlptLevel}:${LearningSection}` = `${level}:${section}`;
    const next = {
        ...current,
        sectionScores: { ...current.sectionScores, [key]: Math.max(current.sectionScores[key] ?? 0, score) },
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
}
