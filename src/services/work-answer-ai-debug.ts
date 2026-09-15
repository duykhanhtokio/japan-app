import {
    getWorkAnswerAiMetrics,
} from '@/services/work-answer-ai-metrics';

import {
    getWorkAnswerAiCacheLimit,
    getWorkAnswerAiCacheSize,
} from '@/services/work-answer-ai-cache';

export function logWorkAnswerAiDebugStats() {
    if (
        !__DEV__
    ) {
        return;
    }

    const metrics =
        getWorkAnswerAiMetrics();

    const totalLocal =
        metrics.localCorrect +
        metrics.localUnderstandable +
        metrics.localIncorrect;

    const totalEvaluations =
        totalLocal +
        metrics.aiFallbackRequested;

    const fallbackRate =
        totalEvaluations > 0
            ? (
                metrics.aiFallbackRequested /
                totalEvaluations
            ) * 100
            : 0;

    console.log(
        '================================'
    );

    console.log(
        'WORK ANSWER AI STATS'
    );

    console.log(
        '================================'
    );

    console.log({
        ...metrics,

        totalLocal,

        totalEvaluations,

        fallbackRate:
            `${fallbackRate.toFixed(2)}%`,

        cacheSize:
            getWorkAnswerAiCacheSize(),

        cacheLimit:
            getWorkAnswerAiCacheLimit(),
    });
}