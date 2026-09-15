import type {
    AppLanguageCode,
} from '@/i18n/languages';

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export type UnexpectedConversationIntent =
    | 'quit_job'
    | 'health_problem'
    | 'workplace_problem'
    | 'leave_request'
    | 'emergency';

export type ConversationBranch = {
    intent:
    UnexpectedConversationIntent;

    priority:
    number;

    npcResponseJa:
    string;

    npcResponseReadingJa?:
    string;

    npcResponseTranslations?: Partial<
        Record<
            AppLanguageCode,
            string
        >
    >;

    /*
     * Hướng dẫn cho lượt player tiếp theo.
     *
     * Hiện tại branch V1 sẽ dùng
     * để người chơi biết NPC đang hỏi gì.
     */
    followUpInstruction?: Partial<
        Record<
            AppLanguageCode,
            string
        >
    >;
};

type ConversationBranchRule = {
    intent:
    UnexpectedConversationIntent;

    priority:
    number;

    patterns:
    RegExp[];

    negativePatterns?:
    RegExp[];

    npcResponseJa:
    string;

    npcResponseReadingJa?:
    string;

    npcResponseTranslations?: Partial<
        Record<
            AppLanguageCode,
            string
        >
    >;

    followUpInstruction?: Partial<
        Record<
            AppLanguageCode,
            string
        >
    >;
};

/*
 * =========================================================
 * NORMALIZATION
 * =========================================================
 */

function normalizeJapanese(
    value: string
): string {
    return value
        .replace(
            /[\s。、，,.!?！？「」『』（）()]/g,
            ''
        )
        .toLowerCase()
        .trim();
}

function testPattern(
    pattern: RegExp,
    value: string
): boolean {
    pattern.lastIndex =
        0;

    return pattern.test(
        value
    );
}

/*
 * =========================================================
 * GLOBAL BRANCH RULES
 *
 * Những intent này có độ ưu tiên cao hơn
 * nhiệm vụ hội thoại hiện tại.
 * =========================================================
 */

const BRANCH_RULES:
    ConversationBranchRule[] = [
        /*
         * -----------------------------------------------------
         * QUIT JOB
         * -----------------------------------------------------
         */

        {
            intent:
                'quit_job',

            priority:
                100,

            patterns: [
                /仕事.*辞めたい/,
                /会社.*辞めたい/,
                /辞めたいです/,
                /辞めます/,
                /退職したい/,
                /退職します/,
                /もう.*会社.*嫌/,
                /会社.*嫌です/,
                /仕事.*嫌です/,
                /会社.*行きたくない/,
                /仕事.*続けたくない/,
            ],

            /*
             * Ví dụ:
             *
             * 辞めたくない
             *
             * không được detect thành quit.
             */

            negativePatterns: [
                /辞めたくない/,
                /辞めません/,
                /退職したくない/,
            ],

            npcResponseJa:
                'えっ、どうしたんですか？何か問題がありましたか？',

            npcResponseReadingJa:
                'えっ、どうしたんですか？なにかもんだいがありましたか？',

            npcResponseTranslations: {
                vi:
                    'Ơ, có chuyện gì vậy? Bạn đang gặp vấn đề gì sao?',

                en:
                    'What happened? Is there some kind of problem?',

                id:
                    'Ada apa? Apakah ada masalah?',

                'zh-CN':
                    '怎么了？是遇到什么问题了吗？',

                'zh-TW':
                    '怎麼了？是遇到什麼問題了嗎？',

                hi:
                    'क्या हुआ? क्या कोई समस्या है?',
            },

            followUpInstruction: {
                vi:
                    'Hãy giải thích lý do bạn muốn nghỉ việc hoặc vấn đề bạn đang gặp phải.',

                en:
                    'Explain why you want to quit or what problem you are having.',

                id:
                    'Jelaskan mengapa Anda ingin berhenti atau masalah apa yang Anda alami.',

                'zh-CN':
                    '请说明你为什么想辞职，或者遇到了什么问题。',

                'zh-TW':
                    '請說明你為什麼想辭職，或者遇到了什麼問題。',

                hi:
                    'बताएँ कि आप नौकरी क्यों छोड़ना चाहते हैं या आपको क्या समस्या हो रही है।',
            },
        },

        /*
         * -----------------------------------------------------
         * HEALTH
         * -----------------------------------------------------
         */

        {
            intent:
                'health_problem',

            priority:
                95,

            patterns: [
                /具合.*悪/,
                /気分.*悪/,
                /体調.*悪/,
                /熱.*ある/,
                /熱.*あります/,
                /頭.*痛/,
                /腰.*痛/,
                /お腹.*痛/,
                /足.*痛/,
                /手.*痛/,
                /病院.*行きたい/,
                /病院.*行きます/,
                /怪我/,
                /けが/,
                /吐きそう/,
                /めまい/,
            ],

            npcResponseJa:
                '大丈夫ですか？どこが痛いですか？無理をしないでください。',

            npcResponseReadingJa:
                'だいじょうぶですか？どこがいたいですか？むりをしないでください。',

            npcResponseTranslations: {
                vi:
                    'Bạn có ổn không? Bạn đau ở đâu? Đừng cố quá sức.',

                en:
                    'Are you okay? Where does it hurt? Please do not push yourself.',

                id:
                    'Apakah Anda baik-baik saja? Bagian mana yang sakit? Jangan memaksakan diri.',

                'zh-CN':
                    '你没事吧？哪里痛？不要勉强自己。',

                'zh-TW':
                    '你沒事吧？哪裡痛？不要勉強自己。',

                hi:
                    'क्या आप ठीक हैं? कहाँ दर्द हो रहा है? ज़बरदस्ती काम मत करें।',
            },

            followUpInstruction: {
                vi:
                    'Hãy nói rõ bạn đang đau ở đâu hoặc tình trạng sức khỏe hiện tại.',

                en:
                    'Explain where you are hurting or how you currently feel.',

                id:
                    'Jelaskan bagian mana yang sakit atau kondisi kesehatan Anda saat ini.',

                'zh-CN':
                    '请说明哪里不舒服或现在的身体状况。',

                'zh-TW':
                    '請說明哪裡不舒服或現在的身體狀況。',

                hi:
                    'बताएँ कि आपको कहाँ दर्द है या आपकी वर्तमान तबीयत कैसी है।',
            },
        },

        /*
         * -----------------------------------------------------
         * WORKPLACE PROBLEM
         * -----------------------------------------------------
         */

        {
            intent:
                'workplace_problem',

            priority:
                90,

            patterns: [
                /いじめ/,
                /嫌がらせ/,
                /怒鳴ら/,
                /殴ら/,
                /叩か/,
                /怖い/,
                /班長.*怖/,
                /上司.*怖/,
                /困っています/,
                /問題があります/,
                /給料.*もらえ/,
                /給料.*払/,
                /残業.*多/,
                /休み.*ない/,
            ],

            npcResponseJa:
                'そうですか。何があったのか、詳しく教えてください。',

            npcResponseReadingJa:
                'そうですか。なにがあったのか、くわしくおしえてください。',

            npcResponseTranslations: {
                vi:
                    'Vậy sao. Hãy nói rõ cho tôi biết đã xảy ra chuyện gì.',

                en:
                    'I see. Please tell me in detail what happened.',

                id:
                    'Begitu ya. Tolong ceritakan secara rinci apa yang terjadi.',

                'zh-CN':
                    '这样啊。请详细告诉我发生了什么。',

                'zh-TW':
                    '這樣啊。請詳細告訴我發生了什麼。',

                hi:
                    'समझ गया। कृपया विस्तार से बताइए कि क्या हुआ।',
            },

            followUpInstruction: {
                vi:
                    'Hãy giải thích vấn đề bạn đang gặp tại nơi làm việc.',

                en:
                    'Explain the problem you are experiencing at work.',

                id:
                    'Jelaskan masalah yang Anda alami di tempat kerja.',

                'zh-CN':
                    '请说明你在工作场所遇到的问题。',

                'zh-TW':
                    '請說明你在工作場所遇到的問題。',

                hi:
                    'कार्यस्थल पर आपको जो समस्या हो रही है उसे समझाएँ।',
            },
        },

        /*
         * -----------------------------------------------------
         * LEAVE / GO HOME
         * -----------------------------------------------------
         */

        {
            intent:
                'leave_request',

            priority:
                80,

            patterns: [
                /今日.*休みたい/,
                /休ませてください/,
                /休みたいです/,
                /帰りたいです/,
                /帰ってもいいですか/,
                /早退したい/,
                /早く帰りたい/,
            ],

            npcResponseJa:
                'わかりました。どうしましたか？何か理由がありますか？',

            npcResponseReadingJa:
                'わかりました。どうしましたか？なにかりゆうがありますか？',

            npcResponseTranslations: {
                vi:
                    'Tôi hiểu rồi. Có chuyện gì vậy? Có lý do gì không?',

                en:
                    'I understand. What happened? Is there a reason?',

                id:
                    'Baik. Ada apa? Apakah ada alasannya?',

                'zh-CN':
                    '明白了。怎么了？有什么原因吗？',

                'zh-TW':
                    '明白了。怎麼了？有什麼原因嗎？',

                hi:
                    'ठीक है। क्या हुआ? कोई कारण है?',
            },

            followUpInstruction: {
                vi:
                    'Hãy giải thích lý do bạn muốn nghỉ hoặc về sớm.',

                en:
                    'Explain why you want to take the day off or leave early.',

                id:
                    'Jelaskan alasan Anda ingin libur atau pulang lebih awal.',

                'zh-CN':
                    '请说明你为什么想请假或早退。',

                'zh-TW':
                    '請說明你為什麼想請假或早退。',

                hi:
                    'बताएँ कि आप छुट्टी क्यों लेना चाहते हैं या जल्दी क्यों जाना चाहते हैं।',
            },
        },

        /*
         * -----------------------------------------------------
         * EMERGENCY
         * -----------------------------------------------------
         */

        {
            intent:
                'emergency',

            priority:
                110,

            patterns: [
                /危ない/,
                /危険/,
                /火事/,
                /火が出/,
                /救急車/,
                /事故/,
                /倒れた/,
                /意識がない/,
                /助けて/,
            ],

            npcResponseJa:
                'わかりました。すぐに作業を止めます。安全な場所に移動してください。',

            npcResponseReadingJa:
                'わかりました。すぐにさぎょうをとめます。あんぜんなばしょにいどうしてください。',

            npcResponseTranslations: {
                vi:
                    'Tôi hiểu rồi. Hãy dừng công việc ngay và di chuyển đến nơi an toàn.',

                en:
                    'Understood. Stop work immediately and move to a safe place.',

                id:
                    'Baik. Hentikan pekerjaan segera dan pindah ke tempat yang aman.',

                'zh-CN':
                    '明白了。请立即停止作业并移动到安全地点。',

                'zh-TW':
                    '明白了。請立即停止作業並移動到安全地點。',

                hi:
                    'समझ गया। तुरंत काम रोकें और सुरक्षित स्थान पर जाएँ।',
            },
        },
    ];

/*
 * =========================================================
 * DETECTOR
 * =========================================================
 */

export function detectUnexpectedConversationIntent(
    transcript: string
): ConversationBranch | null {
    const clean =
        transcript.trim();

    if (!clean) {
        return null;
    }

    const normalized =
        normalizeJapanese(
            clean
        );

    const matches =
        BRANCH_RULES.filter(
            (rule) => {
                const blocked =
                    rule
                        .negativePatterns
                        ?.some(
                            (
                                pattern
                            ) =>
                                testPattern(
                                    pattern,
                                    normalized
                                )
                        ) ??
                    false;

                if (blocked) {
                    return false;
                }

                return rule.patterns.some(
                    (
                        pattern
                    ) =>
                        testPattern(
                            pattern,
                            normalized
                        )
                );
            }
        ).sort(
            (
                a,
                b
            ) =>
                b.priority -
                a.priority
        );

    const matched =
        matches[0];

    if (!matched) {
        return null;
    }

    return {
        intent:
            matched.intent,

        priority:
            matched.priority,

        npcResponseJa:
            matched.npcResponseJa,

        npcResponseReadingJa:
            matched
                .npcResponseReadingJa,

        npcResponseTranslations:
            matched
                .npcResponseTranslations,

        followUpInstruction:
            matched
                .followUpInstruction,
    };
}

/*
 * =========================================================
 * LOCALIZATION
 * =========================================================
 */

export function getConversationBranchTranslation(
    branch:
        ConversationBranch,

    language:
        AppLanguageCode
): string {
    if (
        language ===
        'ja'
    ) {
        return '';
    }

    return (
        branch
            .npcResponseTranslations?.[
        language
        ] ??
        branch
            .npcResponseTranslations
            ?.en ??
        ''
    );
}

export function getConversationBranchInstruction(
    branch:
        ConversationBranch,

    language:
        AppLanguageCode
): string {
    return (
        branch
            .followUpInstruction?.[
        language
        ] ??
        branch
            .followUpInstruction
            ?.en ??
        ''
    );
}