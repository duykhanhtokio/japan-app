export type WorkAnswerAiMetrics = {
    localCorrect:
    number;

    localUnderstandable:
    number;

    localIncorrect:
    number;

    aiFallbackRequested:
    number;

    aiFallbackBlocked:
    number;

    aiCacheHit:
    number;

    actualAiCalls:
    number;
};

const metrics:
    WorkAnswerAiMetrics = {
    localCorrect:
        0,

    localUnderstandable:
        0,

    localIncorrect:
        0,

    aiFallbackRequested:
        0,

    aiFallbackBlocked:
        0,

    aiCacheHit:
        0,

    actualAiCalls:
        0,
};

export type WorkAnswerAiMetricName =
    keyof WorkAnswerAiMetrics;

export function incrementWorkAnswerAiMetric(
    name:
        WorkAnswerAiMetricName
) {
    metrics[name] +=
        1;
}

export function getWorkAnswerAiMetrics():
    WorkAnswerAiMetrics {
    return {
        ...metrics,
    };
}

export function resetWorkAnswerAiMetrics() {
    for (
        const key
        of Object.keys(
            metrics
        ) as WorkAnswerAiMetricName[]
    ) {
        metrics[key] =
            0;
    }
}