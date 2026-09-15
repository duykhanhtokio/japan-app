import type {
    CityProgress,
    PrefectureProgress,
} from '@/types/progress';

export function calculateCityCompleted(
    city: CityProgress
) {
    const uniqueLocations =
        new Set(
            city.visitedLocationIds
        );

    return (
        uniqueLocations.size >=
        city.requiredLocationCount
    );
}

export function canUnlockNextCity(
    city: CityProgress
) {
    return calculateCityCompleted(
        city
    );
}

export function calculatePrefectureCompleted(
    prefecture: PrefectureProgress
) {
    return (
        prefecture.completedCityIds
            .length >=
        prefecture.requiredCityCount
    );
}

export function canReceiveGoldenKey(
    prefecture: PrefectureProgress
) {
    const citiesCompleted =
        calculatePrefectureCompleted(
            prefecture
        );

    return (
        citiesCompleted &&
        prefecture.weeklyMissionCompleted &&
        prefecture.monthlyMissionCompleted &&
        prefecture.workMissionCompleted
    );
}

export function calculateCommunicationTitle(
    accuracy: number,
    fluency: number,
    pronunciation: number,
    listening: number,
    dialogues: number
) {
    const average =
        (
            accuracy +
            fluency +
            pronunciation +
            listening
        ) / 4;

    if (
        average >= 94 &&
        dialogues >= 500
    ) {
        return {
            titleJa:
                '通訳レベル',

            titleVi:
                'Cấp độ phiên dịch',

            level: 8,
        };
    }

    if (
        average >= 90 &&
        dialogues >= 350
    ) {
        return {
            titleJa:
                '高度コミュニケーション',

            titleVi:
                'Giao tiếp cao cấp',

            level: 7,
        };
    }

    if (
        average >= 85 &&
        dialogues >= 250
    ) {
        return {
            titleJa:
                'ビジネス会話',

            titleVi:
                'Giao tiếp công việc',

            level: 6,
        };
    }

    if (
        average >= 80 &&
        dialogues >= 150
    ) {
        return {
            titleJa: '流暢',

            titleVi:
                'Giao tiếp trôi chảy',

            level: 5,
        };
    }

    if (
        average >= 70 &&
        dialogues >= 80
    ) {
        return {
            titleJa:
                '実用会話',

            titleVi:
                'Giao tiếp thực tế',

            level: 4,
        };
    }

    if (
        average >= 60 &&
        dialogues >= 40
    ) {
        return {
            titleJa:
                '日常会話',

            titleVi:
                'Hội thoại đời sống',

            level: 3,
        };
    }

    if (
        average >= 45 &&
        dialogues >= 15
    ) {
        return {
            titleJa:
                '基礎会話',

            titleVi:
                'Giao tiếp cơ bản',

            level: 2,
        };
    }

    return {
        titleJa: '初心者',

        titleVi:
            'Người mới bắt đầu',

        level: 1,
    };
}
export type WorkMissionSpeakingMetricsInput = {
    correctCount: number;

    understandableCount: number;

    retryCount: number;

    totalPlayerTurns: number;
};

export type WorkMissionSpeakingMetrics = {
    accuracy: number;

    fluency: number;
};

function clampPercent(
    value: number
): number {
    return Math.max(
        0,
        Math.min(
            100,
            Math.round(
                value
            )
        )
    );
}

export function calculateWorkMissionSpeakingMetrics(
    input:
        WorkMissionSpeakingMetricsInput
): WorkMissionSpeakingMetrics {
    const totalTurns =
        Math.max(
            1,
            input.totalPlayerTurns
        );

    /*
     * CORRECT          = 100 điểm
     * UNDERSTANDABLE   = 75 điểm
     *
     * Incorrect không trực tiếp có mặt
     * vì cuối cùng player phải retry hoặc xem đáp án.
     */

    const accuracyScore =
        (
            input.correctCount *
            100 +
            input
                .understandableCount *
            75
        ) /
        totalTurns;

    /*
     * Fluency:
     *
     * bắt đầu 100
     * mỗi retry -12
     * mỗi understandable -5
     */

    const fluencyScore =
        100 -
        input.retryCount *
        12 -
        input
            .understandableCount *
        5;

    return {
        accuracy:
            clampPercent(
                accuracyScore
            ),

        fluency:
            clampPercent(
                fluencyScore
            ),
    };
}