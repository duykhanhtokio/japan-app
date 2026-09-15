import {
    evaluateDialogueLocally,
    type DialogueEvaluationResult,
    type SemanticRule,
} from './dialogue-local-evaluator';

export type DialogueVocabularyRecord = {
    id: string;
    word: string;
};

export type DialoguePlayerPayload = {
    communicativeIntent?: string;

    requiredSemanticComponents?:
    Record<string, string>;

    recommendedAnswerJa?: string;

    acceptableExamples?: string[];

    targetVocabularyIds?: string[];
};

export type DialoguePlayerTurn = {
    speaker: 'PLAYER';

    player: DialoguePlayerPayload;
};

export type DialogueEvaluationAdapterInput = {
    turn: DialoguePlayerTurn;

    recognizedText: string;

    vocabularyById:
    ReadonlyMap<
        string,
        DialogueVocabularyRecord
    >;

    maxLocalLength?: number;
};

/*
 * =========================================================
 * SEMANTIC COMPONENTS → LOCAL RULES
 * =========================================================
 *
 * Hiện schema content của bạn đang lưu:
 *
 * {
 *   action: "order",
 *   item: "coffee"
 * }
 *
 * Nhưng evaluator cần Japanese surface forms
 * để match local.
 *
 * Vì vậy v1 adapter chỉ tự tạo rule
 * khi value đã là Japanese hoặc có nhiều
 * lựa chọn phân tách bằng "|".
 *
 * Ví dụ:
 *
 * {
 *   item: "コーヒー|アイスコーヒー"
 * }
 *
 * → anyOf:
 *   ["コーヒー", "アイスコーヒー"]
 *
 * Những semantic value kiểu:
 *
 * action: "order"
 *
 * chưa đủ dữ liệu để local-match Japanese,
 * nên không ép thành rule.
 * =========================================================
 */

function containsJapanese(
    value: string
) {
    return /[\u3040-\u30ff\u3400-\u9fff]/.test(
        value
    );
}

function buildSemanticRules(
    components:
        Record<string, string> |
        undefined
): SemanticRule[] {
    if (
        !components
    ) {
        return [];
    }

    const rules:
        SemanticRule[] =
        [];

    for (
        const [
            key,
            rawValue,
        ]
        of Object.entries(
            components
        )
    ) {
        const value =
            String(
                rawValue ??
                ''
            ).trim();

        if (
            !value
        ) {
            continue;
        }

        const candidates =
            value
                .split('|')
                .map(
                    item =>
                        item.trim()
                )
                .filter(
                    Boolean
                );

        const japaneseCandidates =
            candidates.filter(
                containsJapanese
            );

        /*
         * English semantic labels như:
         *
         * order
         * coffee
         * destination
         *
         * chưa đủ để rule-engine match Japanese.
         * Không tạo rule giả.
         */
        if (
            japaneseCandidates.length ===
            0
        ) {
            continue;
        }

        rules.push({
            key,

            anyOf:
                japaneseCandidates,
        });
    }

    return rules;
}

/*
 * =========================================================
 * VOCAB LOOKUP
 * =========================================================
 */

function resolveVocabulary(
    ids: string[] |
        undefined,
    vocabularyById:
        DialogueEvaluationAdapterInput[
        'vocabularyById'
        ]
) {
    const resolved:
        DialogueVocabularyRecord[] =
        [];

    for (
        const id
        of ids ??
        []
    ) {
        const item =
            vocabularyById.get(
                id
            );

        /*
         * Content validator chịu trách nhiệm
         * bắt invalid ID.
         *
         * Runtime adapter không crash game
         * chỉ vì một target ID lỗi.
         */
        if (
            !item
        ) {
            continue;
        }

        resolved.push({
            id:
                item.id,

            word:
                item.word,
        });
    }

    return resolved;
}

/*
 * =========================================================
 * MAIN ADAPTER
 * =========================================================
 */

export function evaluatePlayerTurnLocally(
    input:
        DialogueEvaluationAdapterInput
): DialogueEvaluationResult {
    const player =
        input.turn.player;

    const requiredVocabulary =
        resolveVocabulary(
            player
                .targetVocabularyIds,
            input.vocabularyById
        );

    const semanticRules =
        buildSemanticRules(
            player
                .requiredSemanticComponents
        );

    return evaluateDialogueLocally({
        recognizedText:
            input.recognizedText,

        recommendedAnswerJa:
            player
                .recommendedAnswerJa,

        acceptableExamples:
            player
                .acceptableExamples,

        communicativeIntent:
            player
                .communicativeIntent,

        requiredVocabulary,

        semanticRules,

        maxLocalLength:
            input.maxLocalLength,
    });
}