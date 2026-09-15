export type DialogueEvaluationStatus =
    | 'PASS'
    | 'RETRY'
    | 'AI_FALLBACK';

export type SemanticRule = {
    key: string;

    anyOf?: string[];

    allOf?: string[];

    optional?: boolean;
};

export type DialogueEvaluationInput = {
    recognizedText: string;

    recommendedAnswerJa?: string;

    acceptableExamples?: string[];

    communicativeIntent?: string;

    requiredVocabulary?: {
        id: string;
        word: string;
    }[];

    semanticRules?: SemanticRule[];

    maxLocalLength?: number;
};

export type DialogueEvaluationResult = {
    status: DialogueEvaluationStatus;

    confidence: number;

    normalizedText: string;

    exactMatch: boolean;

    acceptableExampleMatch: boolean;

    japaneseDetected: boolean;

    matchedVocabularyIds: string[];

    missingVocabularyIds: string[];

    matchedSemanticComponents: string[];

    missingSemanticComponents: string[];

    semanticMatch: boolean;

    reason: string;
};

/*
 * =========================================================
 * NORMALIZE
 * =========================================================
 */

function normalizeJapanese(
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

/*
 * =========================================================
 * JAPANESE CHECK
 * =========================================================
 */

function containsJapanese(
    value: string
) {
    return /[\u3040-\u30ff\u3400-\u9fff]/.test(
        value
    );
}

/*
 * =========================================================
 * CHARACTER SIMILARITY
 * =========================================================
 */

function characterSimilarity(
    a: string,
    b: string
) {
    if (
        !a ||
        !b
    ) {
        return 0;
    }

    if (
        a === b
    ) {
        return 1;
    }

    const setA =
        new Set(
            [...a]
        );

    const setB =
        new Set(
            [...b]
        );

    let intersection =
        0;

    for (
        const char
        of setA
    ) {
        if (
            setB.has(
                char
            )
        ) {
            intersection += 1;
        }
    }

    const union =
        new Set([
            ...setA,
            ...setB,
        ]).size;

    if (
        union ===
        0
    ) {
        return 0;
    }

    return (
        intersection /
        union
    );
}

/*
 * =========================================================
 * VOCABULARY INFLECTION MATCH
 * =========================================================
 */

function matchesVocabularyWord(
    recognizedText: string,
    rawWord: string
) {
    const normalized =
        normalizeJapanese(
            recognizedText
        );

    const word =
        normalizeJapanese(
            rawWord
        );

    if (
        !word
    ) {
        return false;
    }

    if (
        normalized.includes(
            word
        )
    ) {
        return true;
    }

    if (
        word.length <
        2
    ) {
        return false;
    }

    const last =
        word.slice(
            -1
        );

    const base =
        word.slice(
            0,
            -1
        );

    const stems:
        string[] =
        [];

    switch (
    last
    ) {
        case 'う':
            stems.push(
                base + 'い',
                base + 'って',
                base + 'った',
                base + 'わ',
                base + 'え'
            );
            break;

        case 'く':
            stems.push(
                base + 'き',
                base + 'いて',
                base + 'いた',
                base + 'か',
                base + 'け'
            );
            break;

        case 'ぐ':
            stems.push(
                base + 'ぎ',
                base + 'いで',
                base + 'いだ',
                base + 'が',
                base + 'げ'
            );
            break;

        case 'す':
            stems.push(
                base + 'し',
                base + 'して',
                base + 'した',
                base + 'さ',
                base + 'せ'
            );
            break;

        case 'つ':
            stems.push(
                base + 'ち',
                base + 'って',
                base + 'った',
                base + 'た',
                base + 'て'
            );
            break;

        case 'ぬ':
            stems.push(
                base + 'に',
                base + 'んで',
                base + 'んだ',
                base + 'な'
            );
            break;

        case 'ぶ':
            stems.push(
                base + 'び',
                base + 'んで',
                base + 'んだ',
                base + 'ば'
            );
            break;

        case 'む':
            stems.push(
                base + 'み',
                base + 'んで',
                base + 'んだ',
                base + 'ま'
            );
            break;

        case 'る':
            stems.push(
                base + 'り',
                base + 'って',
                base + 'った',
                base + 'ら',
                base + 'れ',

                base,
                base + 'ます',
                base + 'たい',
                base + 'ない',
                base + 'て',
                base + 'た'
            );
            break;
    }

    const endings = [
        '',
        'ます',
        'ました',
        'ません',
        'ませんでした',
        'たい',
        'たいです',
        'たくない',
        'て',
        'ても',
        'た',
        'ない',
    ];

    for (
        const stem
        of stems
    ) {
        if (
            !stem ||
            stem.length <
            2
        ) {
            continue;
        }

        for (
            const ending
            of endings
        ) {
            if (
                normalized.includes(
                    stem +
                    ending
                )
            ) {
                return true;
            }
        }
    }

    return false;
}

function matchVocabulary(
    recognizedText: string,
    requiredVocabulary:
        DialogueEvaluationInput[
        'requiredVocabulary'
        ]
) {
    const matched:
        string[] =
        [];

    const missing:
        string[] =
        [];

    for (
        const item
        of requiredVocabulary ??
        []
    ) {
        if (
            matchesVocabularyWord(
                recognizedText,
                item.word
            )
        ) {
            matched.push(
                item.id
            );
        } else {
            missing.push(
                item.id
            );
        }
    }

    return {
        matched,
        missing,
    };
}

/*
 * =========================================================
 * SEMANTIC RULE MATCH
 * =========================================================
 */

function matchSemanticRules(
    recognizedText: string,
    rules:
        SemanticRule[] |
        undefined
) {
    const normalized =
        normalizeJapanese(
            recognizedText
        );

    const matched:
        string[] =
        [];

    const missing:
        string[] =
        [];

    for (
        const rule
        of rules ??
        []
    ) {
        const anyOf =
            (
                rule.anyOf ??
                []
            )
                .map(
                    normalizeJapanese
                )
                .filter(
                    Boolean
                );

        const allOf =
            (
                rule.allOf ??
                []
            )
                .map(
                    normalizeJapanese
                )
                .filter(
                    Boolean
                );

        const anyOfMatched =
            anyOf.length ===
            0 ||
            anyOf.some(
                phrase =>
                    normalized.includes(
                        phrase
                    )
            );

        const allOfMatched =
            allOf.every(
                phrase =>
                    normalized.includes(
                        phrase
                    )
            );

        const matchedRule =
            anyOfMatched &&
            allOfMatched;

        if (
            matchedRule
        ) {
            matched.push(
                rule.key
            );
        } else if (
            !rule.optional
        ) {
            missing.push(
                rule.key
            );
        }
    }

    return {
        matched,
        missing,

        semanticMatch:
            missing.length ===
            0,
    };
}

/*
 * =========================================================
 * INTENT HEURISTICS
 *
 * Đây chưa phải NLP engine.
 * Chỉ là local rules cho intent phổ biến.
 * =========================================================
 */

function intentLooksSatisfied(
    intent: string |
        undefined,
    recognizedText: string
) {
    if (
        !intent
    ) {
        return null;
    }

    const text =
        normalizeJapanese(
            recognizedText
        );

    switch (
    intent
    ) {
        case 'order_drink':
        case 'order_food':
        case 'buy_item':
            return (
                /ください|お願いします|ほしい|買いたい/.test(
                    text
                )
            );

        case 'state_destination':
            return (
                /まで|へ|に/.test(
                    text
                )
            );

        case 'ask_price':
            return (
                /いくら|値段|料金/.test(
                    text
                )
            );

        case 'state_symptom':
            return (
                /痛い|いたい|熱|せき|咳|頭|おなか|腹|気分/.test(
                    text
                )
            );

        case 'confirm_task':
            return (
                /はい|わかりました|します|やります/.test(
                    text
                )
            );

        case 'ask_permission':
            return (
                /てもいいですか|でもいいですか/.test(
                    text
                )
            );

        case 'provide_address':
            return (
                /住所|丁目|番地|です/.test(
                    text
                )
            );

        case 'provide_reservation_number':
            return (
                /予約番号|[0-9０-９]{2,}/.test(
                    text
                )
            );

        default:
            return null;
    }
}

/*
 * =========================================================
 * MAIN EVALUATOR
 * =========================================================
 */

export function evaluateDialogueLocally(
    input:
        DialogueEvaluationInput
): DialogueEvaluationResult {
    const normalizedText =
        normalizeJapanese(
            input.recognizedText
        );

    const requiredVocabulary =
        input.requiredVocabulary ??
        [];

    const semanticRules =
        input.semanticRules ??
        [];

    /*
     * Empty
     */

    if (
        !normalizedText
    ) {
        return {
            status:
                'RETRY',

            confidence:
                1,

            normalizedText,

            exactMatch:
                false,

            acceptableExampleMatch:
                false,

            japaneseDetected:
                false,

            matchedVocabularyIds:
                [],

            missingVocabularyIds:
                requiredVocabulary.map(
                    item =>
                        item.id
                ),

            matchedSemanticComponents:
                [],

            missingSemanticComponents:
                semanticRules
                    .filter(
                        rule =>
                            !rule.optional
                    )
                    .map(
                        rule =>
                            rule.key
                    ),

            semanticMatch:
                false,

            reason:
                'EMPTY_INPUT',
        };
    }

    /*
     * Language
     */

    const japaneseDetected =
        containsJapanese(
            normalizedText
        );

    if (
        !japaneseDetected
    ) {
        return {
            status:
                'RETRY',

            confidence:
                0.99,

            normalizedText,

            exactMatch:
                false,

            acceptableExampleMatch:
                false,

            japaneseDetected:
                false,

            matchedVocabularyIds:
                [],

            missingVocabularyIds:
                requiredVocabulary.map(
                    item =>
                        item.id
                ),

            matchedSemanticComponents:
                [],

            missingSemanticComponents:
                semanticRules
                    .filter(
                        rule =>
                            !rule.optional
                    )
                    .map(
                        rule =>
                            rule.key
                    ),

            semanticMatch:
                false,

            reason:
                'NON_JAPANESE_INPUT',
        };
    }

    /*
     * Long input
     */

    const maxLocalLength =
        input.maxLocalLength ??
        45;

    if (
        normalizedText.length >
        maxLocalLength
    ) {
        const vocab =
            matchVocabulary(
                normalizedText,
                requiredVocabulary
            );

        const semantics =
            matchSemanticRules(
                normalizedText,
                semanticRules
            );

        return {
            status:
                'AI_FALLBACK',

            confidence:
                0.5,

            normalizedText,

            exactMatch:
                false,

            acceptableExampleMatch:
                false,

            japaneseDetected:
                true,

            matchedVocabularyIds:
                vocab.matched,

            missingVocabularyIds:
                vocab.missing,

            matchedSemanticComponents:
                semantics.matched,

            missingSemanticComponents:
                semantics.missing,

            semanticMatch:
                semantics.semanticMatch,

            reason:
                'INPUT_TOO_COMPLEX_FOR_LOCAL_EVALUATION',
        };
    }

    const recommended =
        normalizeJapanese(
            input
                .recommendedAnswerJa ??
            ''
        );

    /*
     * Exact recommended
     */

    if (
        recommended &&
        normalizedText ===
        recommended
    ) {
        const vocab =
            matchVocabulary(
                normalizedText,
                requiredVocabulary
            );

        const semantics =
            matchSemanticRules(
                normalizedText,
                semanticRules
            );

        return {
            status:
                'PASS',

            confidence:
                1,

            normalizedText,

            exactMatch:
                true,

            acceptableExampleMatch:
                false,

            japaneseDetected:
                true,

            matchedVocabularyIds:
                vocab.matched,

            missingVocabularyIds:
                vocab.missing,

            matchedSemanticComponents:
                semantics.matched,

            missingSemanticComponents:
                semantics.missing,

            semanticMatch:
                semantics.semanticMatch,

            reason:
                'EXACT_RECOMMENDED_ANSWER',
        };
    }

    /*
     * Acceptable examples
     */

    const acceptableExamples =
        input
            .acceptableExamples ??
        [];

    for (
        const example
        of acceptableExamples
    ) {
        if (
            normalizedText ===
            normalizeJapanese(
                example
            )
        ) {
            const vocab =
                matchVocabulary(
                    normalizedText,
                    requiredVocabulary
                );

            const semantics =
                matchSemanticRules(
                    normalizedText,
                    semanticRules
                );

            return {
                status:
                    'PASS',

                confidence:
                    0.98,

                normalizedText,

                exactMatch:
                    false,

                acceptableExampleMatch:
                    true,

                japaneseDetected:
                    true,

                matchedVocabularyIds:
                    vocab.matched,

                missingVocabularyIds:
                    vocab.missing,

                matchedSemanticComponents:
                    semantics.matched,

                missingSemanticComponents:
                    semantics.missing,

                semanticMatch:
                    semantics.semanticMatch,

                reason:
                    'ACCEPTABLE_EXAMPLE_MATCH',
            };
        }
    }

    const vocab =
        matchVocabulary(
            normalizedText,
            requiredVocabulary
        );

    const semantics =
        matchSemanticRules(
            normalizedText,
            semanticRules
        );

    const intentMatch =
        intentLooksSatisfied(
            input.communicativeIntent,
            normalizedText
        );

    const vocabularyRequired =
        requiredVocabulary.length >
        0;

    const vocabularyMatch =
        vocab.missing.length ===
        0;

    const semanticRequired =
        semanticRules.some(
            rule =>
                !rule.optional
        );

    /*
     * Clear local PASS
     */

    if (
        (
            !vocabularyRequired ||
            vocabularyMatch
        ) &&
        (
            !semanticRequired ||
            semantics.semanticMatch
        ) &&
        (
            intentMatch !==
            false
        )
    ) {
        const references = [
            input
                .recommendedAnswerJa ??
            '',
            ...acceptableExamples,
        ]
            .map(
                normalizeJapanese
            )
            .filter(
                Boolean
            );

        let bestSimilarity =
            0;

        for (
            const reference
            of references
        ) {
            bestSimilarity =
                Math.max(
                    bestSimilarity,
                    characterSimilarity(
                        normalizedText,
                        reference
                    )
                );
        }

        /*
         * Có semantic/intents rõ:
         * không cần similarity quá cao.
         */

        if (
            semanticRequired ||
            intentMatch === true
        ) {
            return {
                status:
                    'PASS',

                confidence:
                    Math.max(
                        0.82,
                        Math.min(
                            0.96,
                            0.82 +
                            bestSimilarity *
                            0.12
                        )
                    ),

                normalizedText,

                exactMatch:
                    false,

                acceptableExampleMatch:
                    false,

                japaneseDetected:
                    true,

                matchedVocabularyIds:
                    vocab.matched,

                missingVocabularyIds:
                    vocab.missing,

                matchedSemanticComponents:
                    semantics.matched,

                missingSemanticComponents:
                    semantics.missing,

                semanticMatch:
                    semantics.semanticMatch,

                reason:
                    'LOCAL_SEMANTIC_INTENT_MATCH',
            };
        }

        /*
         * Không có semantic rules:
         * vẫn dùng similarity như v2.
         */

        if (
            vocabularyRequired &&
            bestSimilarity >=
            0.45
        ) {
            return {
                status:
                    'PASS',

                confidence:
                    Math.min(
                        0.95,
                        0.7 +
                        bestSimilarity *
                        0.2
                    ),

                normalizedText,

                exactMatch:
                    false,

                acceptableExampleMatch:
                    false,

                japaneseDetected:
                    true,

                matchedVocabularyIds:
                    vocab.matched,

                missingVocabularyIds:
                    [],

                matchedSemanticComponents:
                    semantics.matched,

                missingSemanticComponents:
                    semantics.missing,

                semanticMatch:
                    semantics.semanticMatch,

                reason:
                    'VOCABULARY_AND_LOCAL_SIMILARITY_MATCH',
            };
        }
    }

    /*
     * Clear vocabulary failure
     */

    if (
        vocabularyRequired &&
        vocab.missing.length >
        0
    ) {
        return {
            status:
                'RETRY',

            confidence:
                0.92,

            normalizedText,

            exactMatch:
                false,

            acceptableExampleMatch:
                false,

            japaneseDetected:
                true,

            matchedVocabularyIds:
                vocab.matched,

            missingVocabularyIds:
                vocab.missing,

            matchedSemanticComponents:
                semantics.matched,

            missingSemanticComponents:
                semantics.missing,

            semanticMatch:
                semantics.semanticMatch,

            reason:
                'REQUIRED_VOCABULARY_MISSING',
        };
    }

    /*
     * Clear semantic failure
     */

    if (
        semanticRequired &&
        semantics.missing.length >
        0
    ) {
        return {
            status:
                'RETRY',

            confidence:
                0.88,

            normalizedText,

            exactMatch:
                false,

            acceptableExampleMatch:
                false,

            japaneseDetected:
                true,

            matchedVocabularyIds:
                vocab.matched,

            missingVocabularyIds:
                vocab.missing,

            matchedSemanticComponents:
                semantics.matched,

            missingSemanticComponents:
                semantics.missing,

            semanticMatch:
                false,

            reason:
                'REQUIRED_SEMANTIC_COMPONENT_MISSING',
        };
    }

    /*
     * Intent explicitly looks wrong/unsupported
     * nhưng câu vẫn là Japanese:
     * chưa reject cứng → fallback.
     */

    if (
        intentMatch ===
        false
    ) {
        return {
            status:
                'AI_FALLBACK',

            confidence:
                0.5,

            normalizedText,

            exactMatch:
                false,

            acceptableExampleMatch:
                false,

            japaneseDetected:
                true,

            matchedVocabularyIds:
                vocab.matched,

            missingVocabularyIds:
                vocab.missing,

            matchedSemanticComponents:
                semantics.matched,

            missingSemanticComponents:
                semantics.missing,

            semanticMatch:
                semantics.semanticMatch,

            reason:
                'INTENT_UNCERTAIN',
        };
    }

    return {
        status:
            'AI_FALLBACK',

        confidence:
            0.4,

        normalizedText,

        exactMatch:
            false,

        acceptableExampleMatch:
            false,

        japaneseDetected:
            true,

        matchedVocabularyIds:
            vocab.matched,

        missingVocabularyIds:
            vocab.missing,

        matchedSemanticComponents:
            semantics.matched,

        missingSemanticComponents:
            semantics.missing,

        semanticMatch:
            semantics.semanticMatch,

        reason:
            'LOCAL_RULES_INCONCLUSIVE',
    };
}