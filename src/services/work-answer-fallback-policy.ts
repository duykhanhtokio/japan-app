export type WorkAnswerFallbackPolicyInput = {
    answer: string;

    turnId: string;

    /*
     * Số lần AI fallback đã gọi
     * cho turn hiện tại.
     */
    aiCallsForTurn: number;

    /*
     * Cache key của câu đã chấm trước đó.
     */
    cachedAnswers?: ReadonlySet<string>;

    /*
     * Có thể chỉnh sau.
     */
    maxAiCallsPerTurn?: number;

    minJapaneseLength?: number;
};

export type WorkAnswerFallbackPolicyResult = {
    allowAi: boolean;

    reason:
    | 'ALLOW'
    | 'EMPTY_INPUT'
    | 'NON_JAPANESE_INPUT'
    | 'TOO_SHORT'
    | 'TURN_AI_LIMIT_REACHED'
    | 'ANSWER_ALREADY_CACHED';

    normalizedAnswer: string;

    cacheKey: string;
};

function normalizeAnswer(
    value: string
) {
    return String(
        value ?? ''
    )
        .normalize(
            'NFKC'
        )
        .trim()
        .replace(
            /\s+/g,
            ''
        )
        .replace(
            /[。、！？!?「」『』（）()]/g,
            ''
        )
        .toLowerCase();
}

function containsJapanese(
    value: string
) {
    return /[\u3040-\u30ff\u3400-\u9fff]/.test(
        value
    );
}

export function evaluateWorkAnswerFallbackPolicy(
    input:
        WorkAnswerFallbackPolicyInput
): WorkAnswerFallbackPolicyResult {
    const normalizedAnswer =
        normalizeAnswer(
            input.answer
        );

    const cacheKey =
        [
            input.turnId,
            normalizedAnswer,
        ].join(
            '::'
        );

    if (
        !normalizedAnswer
    ) {
        return {
            allowAi:
                false,

            reason:
                'EMPTY_INPUT',

            normalizedAnswer,

            cacheKey,
        };
    }

    if (
        !containsJapanese(
            normalizedAnswer
        )
    ) {
        return {
            allowAi:
                false,

            reason:
                'NON_JAPANESE_INPUT',

            normalizedAnswer,

            cacheKey,
        };
    }

    const minJapaneseLength =
        input.minJapaneseLength ??
        4;

    if (
        normalizedAnswer.length <
        minJapaneseLength
    ) {
        return {
            allowAi:
                false,

            reason:
                'TOO_SHORT',

            normalizedAnswer,

            cacheKey,
        };
    }

    const maxAiCallsPerTurn =
        input.maxAiCallsPerTurn ??
        1;

    if (
        input.aiCallsForTurn >=
        maxAiCallsPerTurn
    ) {
        return {
            allowAi:
                false,

            reason:
                'TURN_AI_LIMIT_REACHED',

            normalizedAnswer,

            cacheKey,
        };
    }

    if (
        input.cachedAnswers?.has(
            cacheKey
        )
    ) {
        return {
            allowAi:
                false,

            reason:
                'ANSWER_ALREADY_CACHED',

            normalizedAnswer,

            cacheKey,
        };
    }

    return {
        allowAi:
            true,

        reason:
            'ALLOW',

        normalizedAnswer,

        cacheKey,
    };
}