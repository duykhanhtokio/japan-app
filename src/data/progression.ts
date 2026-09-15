import type {
    GameProgress,
} from '@/types/progress';

export const INITIAL_GAME_PROGRESS: GameProgress = {
    rewardedWorkMissionIds: [],
    cities: [
        {
            cityId: 'SHIBUYA',

            visitedLocationIds: [],

            requiredLocationCount: 5,

            unlocked: true,

            completed: false,
        },

        {
            cityId: 'SHINJUKU',

            visitedLocationIds: [],

            requiredLocationCount: 5,

            unlocked: false,

            completed: false,
        },

        {
            cityId: 'ASAKUSA',

            visitedLocationIds: [],

            requiredLocationCount: 5,

            unlocked: false,

            completed: false,
        },

        {
            cityId: 'ODAIBA',

            visitedLocationIds: [],

            requiredLocationCount: 5,

            unlocked: false,

            completed: false,
        },

        {
            cityId: 'IKEBUKURO',

            visitedLocationIds: [],

            requiredLocationCount: 5,

            unlocked: false,

            completed: false,
        },
    ],

    prefectures: [
        {
            prefectureId: 'TOKYO',

            completedCityIds: [],

            requiredCityCount: 5,

            weeklyMissionCompleted:
                false,

            monthlyMissionCompleted:
                false,

            workMissionCompleted:
                false,

            goldenKeyReceived:
                false,

            unlocked: true,

            completed: false,
        },

        {
            prefectureId:
                'KANAGAWA',

            completedCityIds: [],

            requiredCityCount: 5,

            weeklyMissionCompleted:
                false,

            monthlyMissionCompleted:
                false,

            workMissionCompleted:
                false,

            goldenKeyReceived:
                false,

            unlocked: false,

            completed: false,
        },
    ],

    missions: {
        dailyCompleted: 0,

        dailyRequired: 4,

        weeklyCompleted: 0,

        weeklyRequired: 5,

        monthlyCompleted: 0,

        monthlyRequired: 6,
    },

    stats: {
        xp: 1420,

        coins: 2450,

        diamonds: 85,

        conversationCredits: 0,

        vocabularyLearned:
            570,

        kanjiLearned: 40,

        dialogueCompleted:
            28,

        lifeDialogueCompleted:
            18,

        workDialogueCompleted:
            10,

        speakingAccuracy:
            82,

        speakingFluency:
            74,

        pronunciation: 79,

        listening: 76,

        speakingMinutes:
            275,
    },
};
