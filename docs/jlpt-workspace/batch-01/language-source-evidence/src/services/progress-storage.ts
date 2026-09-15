import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    calculateWorkMissionSpeakingMetrics,
} from '@/services/progress-engine';
import type {
    GameProgress,
    LessonProgress,
    PlayerStats,
} from '@/types/progress';

/*
 * =========================================================
 * STORAGE KEYS
 * =========================================================
 */

const LESSON_STORAGE_KEY =
    'lesson_progress';

const GAME_PROGRESS_STORAGE_KEY =
    'game_progress';

/*
 * =========================================================
 * LESSON PROGRESS
 * =========================================================
 */

export async function getAllLessonProgress(): Promise<
    LessonProgress[]
> {
    try {
        const value =
            await AsyncStorage.getItem(
                LESSON_STORAGE_KEY
            );

        if (!value) {
            return [];
        }

        const parsed =
            JSON.parse(value);

        if (
            !Array.isArray(
                parsed
            )
        ) {
            return [];
        }

        return parsed as LessonProgress[];
    } catch (error) {
        console.log(
            'Get lesson progress error:',
            error
        );

        return [];
    }
}

export async function getLessonProgress(
    lessonId: string
): Promise<LessonProgress | null> {
    try {
        const allProgress =
            await getAllLessonProgress();

        return (
            allProgress.find(
                (item) =>
                    item.lessonId ===
                    lessonId
            ) ??
            null
        );
    } catch (error) {
        console.log(
            'Get single lesson progress error:',
            error
        );

        return null;
    }
}

export async function saveLessonProgress(
    progress: LessonProgress
): Promise<void> {
    try {
        const allProgress =
            await getAllLessonProgress();

        const index =
            allProgress.findIndex(
                (item) =>
                    item.lessonId ===
                    progress.lessonId
            );

        if (
            index >=
            0
        ) {
            allProgress[index] = {
                ...allProgress[
                index
                ],

                ...progress,
            };
        } else {
            allProgress.push(
                progress
            );
        }

        await AsyncStorage.setItem(
            LESSON_STORAGE_KEY,
            JSON.stringify(
                allProgress
            )
        );

        console.log(
            'Lesson progress saved:',
            progress
        );
    } catch (error) {
        console.log(
            'Save lesson progress error:',
            error
        );

        throw error;
    }
}

export async function clearLessonProgress(): Promise<void> {
    try {
        await AsyncStorage.removeItem(
            LESSON_STORAGE_KEY
        );
    } catch (error) {
        console.log(
            'Clear lesson progress error:',
            error
        );

        throw error;
    }
}

/*
 * =========================================================
 * DEFAULT PLAYER STATS
 * =========================================================
 */

export const DEFAULT_PLAYER_STATS:
    PlayerStats = {
    xp:
        0,

    coins:
        0,

    diamonds:
        0,

    conversationCredits:
        0,

    vocabularyLearned:
        0,

    kanjiLearned:
        0,

    dialogueCompleted:
        0,

    lifeDialogueCompleted:
        0,

    workDialogueCompleted:
        0,

    speakingAccuracy:
        0,

    speakingFluency:
        0,

    pronunciation:
        0,

    listening:
        0,

    speakingMinutes:
        0,
};

/*
 * =========================================================
 * DEFAULT GAME PROGRESS
 * =========================================================
 */

export const DEFAULT_GAME_PROGRESS:
    GameProgress = {
    cities:
        [],

    prefectures:
        [],

    missions: {
        dailyCompleted:
            0,

        dailyRequired:
            0,

        weeklyCompleted:
            0,

        weeklyRequired:
            0,

        monthlyCompleted:
            0,

        monthlyRequired:
            0,
    },

    stats: {
        ...DEFAULT_PLAYER_STATS,
    },

    rewardedWorkMissionIds:
        [],
};

/*
 * =========================================================
 * GET GAME PROGRESS
 * =========================================================
 */

export async function getGameProgress(): Promise<GameProgress> {
    try {
        const value =
            await AsyncStorage.getItem(
                GAME_PROGRESS_STORAGE_KEY
            );

        if (
            !value
        ) {
            return {
                ...DEFAULT_GAME_PROGRESS,

                stats: {
                    ...DEFAULT_PLAYER_STATS,
                },
            };
        }

        const parsed =
            JSON.parse(
                value
            ) as Partial<GameProgress>;

        /*
         * Merge default giúp app không crash
         * nếu storage cũ thiếu field mới.
         */

        return {
            cities:
                Array.isArray(
                    parsed.cities
                )
                    ? parsed.cities
                    : [],

            prefectures:
                Array.isArray(
                    parsed.prefectures
                )
                    ? parsed.prefectures
                    : [],

            missions: {
                ...DEFAULT_GAME_PROGRESS
                    .missions,

                ...parsed.missions,
            },

            stats: {
                ...DEFAULT_PLAYER_STATS,

                ...parsed.stats,
            },

            rewardedWorkMissionIds:
                Array.isArray(
                    parsed
                        .rewardedWorkMissionIds
                )
                    ? parsed
                        .rewardedWorkMissionIds
                    : [],
        };
    } catch (error) {
        console.log(
            'Get game progress error:',
            error
        );

        return {
            ...DEFAULT_GAME_PROGRESS,

            stats: {
                ...DEFAULT_PLAYER_STATS,
            },
        };
    }
}

/*
 * =========================================================
 * SAVE GAME PROGRESS
 * =========================================================
 */

export async function saveGameProgress(
    progress: GameProgress
): Promise<void> {
    try {
        await AsyncStorage.setItem(
            GAME_PROGRESS_STORAGE_KEY,
            JSON.stringify(
                progress
            )
        );

        console.log(
            'Game progress saved:',
            progress
        );
    } catch (error) {
        console.log(
            'Save game progress error:',
            error
        );

        throw error;
    }
}

/*
 * =========================================================
 * WORK MISSION REWARD
 * =========================================================
 */

export type WorkMissionRewardInput = {
    missionRunId: string;

    xp: number;

    coins: number;

    completedSuccessfully:
    boolean;

    correctCount:
    number;

    understandableCount:
    number;

    retryCount:
    number;

    totalPlayerTurns:
    number;
};

export type WorkMissionRewardResult = {
    rewarded: boolean;

    progress:
    GameProgress;
};

export async function rewardWorkMission(
    input:
        WorkMissionRewardInput
): Promise<WorkMissionRewardResult> {
    const current =
        await getGameProgress();


    /*
     * =====================================================
     * DUPLICATE GUARD
     * =====================================================
     */

    if (
        current
            .rewardedWorkMissionIds
            .includes(
                input.missionRunId
            )
    ) {
        console.log(
            'Work mission reward already applied:',
            input.missionRunId
        );

        return {
            rewarded:
                false,

            progress:
                current,
        };
    }
    const missionSpeaking =
        calculateWorkMissionSpeakingMetrics(
            {
                correctCount:
                    input.correctCount,

                understandableCount:
                    input
                        .understandableCount,

                retryCount:
                    input.retryCount,

                totalPlayerTurns:
                    input
                        .totalPlayerTurns,
            }
        );

    const nextAccuracy =
        missionSpeaking.accuracy;

    const nextFluency =
        missionSpeaking.fluency;

    /*
     * Nếu mission fail do xem đáp án:
     *
     * EXP = 0
     * Coins = 0
     *
     * Nhưng vẫn đánh dấu ID đã xử lý
     * để effect không chạy thưởng lại.
     */

    const rewardXp =
        input
            .completedSuccessfully
            ? Math.max(
                0,
                input.xp
            )
            : 0;

    const rewardCoins =
        input
            .completedSuccessfully
            ? Math.max(
                0,
                input.coins
            )
            : 0;

    const next:
        GameProgress = {
        ...current,

        stats: {
            ...current.stats,

            xp:
                current
                    .stats
                    .xp +
                rewardXp,

            coins:
                current
                    .stats
                    .coins +
                rewardCoins,

            dialogueCompleted:
                current
                    .stats
                    .dialogueCompleted +
                1,

            workDialogueCompleted:
                current
                    .stats
                    .workDialogueCompleted +
                1,
            speakingAccuracy:
                nextAccuracy,

            speakingFluency:
                nextFluency,
        },

        rewardedWorkMissionIds: [
            ...current
                .rewardedWorkMissionIds,

            input
                .missionRunId,
        ],
    };

    await saveGameProgress(
        next
    );

    console.log(
        'Work mission reward applied:',
        {
            missionRunId:
                input
                    .missionRunId,

            xp:
                rewardXp,

            coins:
                rewardCoins,

            totalXp:
                next.stats.xp,

            totalCoins:
                next.stats.coins,

            workDialogueCompleted:
                next
                    .stats
                    .workDialogueCompleted,
        }
    );

    return {
        rewarded:
            true,

        progress:
            next,
    };
}

/*
 * =========================================================
 * CLEAR GAME PROGRESS
 *
 * Chỉ dùng cho debug/reset.
 * =========================================================
 */

export async function clearGameProgress(): Promise<void> {
    try {
        await AsyncStorage.removeItem(
            GAME_PROGRESS_STORAGE_KEY
        );
    } catch (error) {
        console.log(
            'Clear game progress error:',
            error
        );

        throw error;
    }
}
