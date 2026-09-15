export type LessonProgressStatus =
    | 'not_started'
    | 'in_progress'
    | 'completed';

export type LessonProgress = {
    lessonId: string;

    status: LessonProgressStatus;

    quizScore: number;

    quizTotal: number;

    quizPercent: number;

    completedAt?: string;
};

export type CityProgress = {
    cityId: string;

    visitedLocationIds: string[];

    requiredLocationCount: number;

    unlocked: boolean;

    completed: boolean;
};

export type PrefectureProgress = {
    prefectureId: string;

    completedCityIds: string[];

    requiredCityCount: number;

    weeklyMissionCompleted: boolean;

    monthlyMissionCompleted: boolean;

    workMissionCompleted: boolean;

    goldenKeyReceived: boolean;

    unlocked: boolean;

    completed: boolean;
};

export type MissionProgress = {
    dailyCompleted: number;

    dailyRequired: number;

    weeklyCompleted: number;

    weeklyRequired: number;

    monthlyCompleted: number;

    monthlyRequired: number;
};

export type PlayerStats = {
    xp: number;

    coins: number;

    diamonds: number;

    conversationCredits: number;

    vocabularyLearned: number;

    kanjiLearned: number;

    dialogueCompleted: number;

    lifeDialogueCompleted: number;

    workDialogueCompleted: number;

    speakingAccuracy: number;

    speakingFluency: number;

    pronunciation: number;

    listening: number;

    speakingMinutes: number;
};

export type GameProgress = {
    cities: CityProgress[];

    prefectures: PrefectureProgress[];

    missions: MissionProgress;

    stats: PlayerStats;

    /*
     * ID các lần hoàn thành WORK MISSION
     * đã được cộng thưởng.
     *
     * Dùng để tránh:
     *
     * effect chạy lại
     * → EXP cộng 2 lần
     * → coin cộng 2 lần.
     */
    rewardedWorkMissionIds: string[];
};
