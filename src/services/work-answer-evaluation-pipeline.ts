import {
    incrementWorkAnswerAiMetric,
} from '@/services/work-answer-ai-metrics';

import {
    evaluateWorkAnswerDetailed,
    type WorkAnswerDetailedResult,
    type WorkDialogueNode,
} from '@/data/work-dialogues';

export type WorkAnswerPipelineResult = {
    status:
    | 'correct'
    | 'understandable'
    | 'incorrect'
    | 'ai_fallback';

    source:
    | 'local_detailed'
    | 'ai_fallback';

    reason: string;
};

/*
 * =========================================================
 * WORK ANSWER EVALUATION PIPELINE
 *
 * WorkDialogue legacy đã có:
 *
 * - requiredConceptGroups
 * - strongPatterns
 * - understandablePatterns
 * - contradictionPatterns
 * - minimumConceptRatio
 *
 * Vì vậy evaluateWorkAnswerDetailed()
 * là local engine chính cho loại content này.
 *
 * Generic dialogue-local-evaluator được giữ lại
 * cho dialogue database mới sau này.
 * =========================================================
 */

export function evaluateWorkAnswerPipeline(
    node: WorkDialogueNode,
    answer: string
): WorkAnswerPipelineResult {
    const detailed:
        WorkAnswerDetailedResult =
        evaluateWorkAnswerDetailed(
            node,
            answer
        );

    /*
     * =====================================================
     * CORRECT
     * =====================================================
     */

    if (
        detailed ===
        'correct'
    ) {
        incrementWorkAnswerAiMetric(
            'localCorrect'
        );
        return {
            status:
                'correct',

            source:
                'local_detailed',

            reason:
                'WORK_RULE_ENGINE_CORRECT',
        };
    }

    /*
     * =====================================================
     * UNDERSTANDABLE
     * =====================================================
     */

    if (
        detailed ===
        'understandable'
    ) {
        incrementWorkAnswerAiMetric(
            'localUnderstandable'
        );
        return {
            status:
                'understandable',

            source:
                'local_detailed',

            reason:
                'WORK_RULE_ENGINE_UNDERSTANDABLE',
        };
    }

    /*
     * =====================================================
     * INCORRECT
     *
     * Local engine đủ chắc là sai.
     * Không gọi AI.
     * =====================================================
     */

    if (
        detailed ===
        'incorrect'
    ) {
        incrementWorkAnswerAiMetric(
            'localIncorrect'
        );
        return {
            status:
                'incorrect',

            source:
                'local_detailed',

            reason:
                'WORK_RULE_ENGINE_INCORRECT',
        };
    }

    /*
     * =====================================================
     * UNCERTAIN
     *
     * Chỉ trường hợp này mới được phép
     * chuyển sang AI fallback.
     * =====================================================
     */
    incrementWorkAnswerAiMetric(
        'aiFallbackRequested'
    );
    return {
        status:
            'ai_fallback',

        source:
            'ai_fallback',

        reason:
            'LOCAL_RULES_UNCERTAIN',
    };
}