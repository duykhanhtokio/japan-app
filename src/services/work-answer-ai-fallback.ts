import type {
    WorkDialogueNode,
} from '@/data/work-dialogues';

import {
    getWorkAnswerAiCache,
    setWorkAnswerAiCache,
} from '@/services/work-answer-ai-cache';

import {
    incrementWorkAnswerAiMetric,
} from '@/services/work-answer-ai-metrics';

export type WorkAnswerAiFallbackStatus =
    | 'correct'
    | 'understandable'
    | 'incorrect';

export type WorkAnswerAiFallbackInput = {
    node:
    WorkDialogueNode;

    answer:
    string;

    /*
     * Sau này có thể truyền thêm:
     *
     * - previous NPC text
     * - player level
     * - location
     * - scenario goal
     */
};

export type WorkAnswerAiFallbackResult = {
    status:
    WorkAnswerAiFallbackStatus;

    confidence:
    number;

    reason:
    string;

    /*
     * Cho phép engine giải thích ngắn
     * nếu cần hiển thị feedback.
     */
    feedbackJa?:
    string;
};

/*
 * =========================================================
 * AI FALLBACK
 *
 * Flow:
 *
 * local pipeline
 * → fallback policy
 * → service này
 *
 * Service này:
 *
 * 1. kiểm tra cache
 * 2. cache HIT → trả kết quả cũ
 * 3. cache MISS → chạy AI engine
 *
 * Hiện tại bước 3 vẫn là MOCK.
 *
 * Chưa có network request.
 * Chưa phát sinh chi phí AI.
 * =========================================================
 */

export async function evaluateWorkAnswerWithAi(
    input:
        WorkAnswerAiFallbackInput
): Promise<
    WorkAnswerAiFallbackResult
> {
    /*
     * =====================================================
     * 1. CACHE
     * =====================================================
     */

    const cached =
        getWorkAnswerAiCache(
            input.node.id,
            input.answer
        );

    if (
        cached
    ) {
        incrementWorkAnswerAiMetric(
            'aiCacheHit'
        );

        return {
            ...cached,

            reason:
                `CACHE:${cached.reason}`,
        };
    }

    /*
     * =====================================================
     * 2. AI ENGINE
     *
     * CHƯA GỌI API THẬT.
     *
     * Khi nối engine sau này:
     *
     * increment actualAiCalls
     * → network request
     * → parse response
     * → validate result
     * → cache
     * → return
     *
     * =====================================================
     */

    const result:
        WorkAnswerAiFallbackResult = {
        /*
         * Placeholder an toàn.
         *
         * Khi chưa có AI thật,
         * tuyệt đối không tự động PASS.
         */

        status:
            'incorrect',

        confidence:
            0,

        reason:
            'AI_FALLBACK_NOT_CONFIGURED',

        feedbackJa:
            'もう一度話してみてください。',
    };

    /*
     * =====================================================
     * 3. CACHE RESULT
     * =====================================================
     */

    setWorkAnswerAiCache(
        input.node.id,
        input.answer,
        result
    );

    return result;
}