
import type {
    AppLanguageCode,
} from '@/i18n/languages';

import {
    getWorkDialogueRoute,
} from '@/data/work-dialogue-routing';

/*
 * =========================================================
 * LEVEL
 * =========================================================
 */

export type JapaneseLevel =
    | 'N5'
    | 'N4'
    | 'N3'
    | 'N2'
    | 'N1';

/*
 * =========================================================
 * SPEAKER
 * =========================================================
 */

export type WorkDialogueSpeaker =
    | 'npc'
    | 'player';

/*
 * =========================================================
 * LOCALIZATION
 * =========================================================
 */

export type LocalizedDialogueText =
    Partial<
        Record<
            AppLanguageCode,
            string
        >
    >;

/*
 * =========================================================
 * ANSWER EVALUATION
 * =========================================================
 */

export type AnswerEvaluationResult =
    | 'correct'
    | 'understandable'
    | 'incorrect';

export type WorkDialogueEvaluation = {
    /*
     * ID của mục đích giao tiếp.
     *
     * Ví dụ:
     * ask_today_work
     * ask_starting_point
     */
    intentId: string;

    /*
     * Các concept cần truyền đạt.
     *
     * Mỗi array con là một concept group.
     *
     * Chỉ cần match một thành phần
     * trong mỗi group.
     */
    requiredConceptGroups:
    string[][];

    /*
     * Cách nói thể hiện intent rõ ràng.
     *
     * Match strong pattern:
     * → correct
     */
    strongPatterns?:
    RegExp[];

    /*
     * Cách nói hơi sai hoặc chưa tự nhiên
     * nhưng người nghe vẫn hiểu được.
     *
     * → understandable
     */
    understandablePatterns?:
    RegExp[];

    /*
     * Những biểu hiện phủ định hoặc
     * trái hoàn toàn với intent.
     *
     * Match một cái:
     * → incorrect ngay.
     */
    contradictionPatterns?:
    RegExp[];

    /*
     * Tỷ lệ concept tối thiểu.
     *
     * 1 = phải đủ 100%
     * 0.5 = đủ một nửa.
     */
    minimumConceptRatio?:
    number;
};

/*
 * =========================================================
 * NODE
 * =========================================================
 */

export type WorkDialogueNode = {
    id: string;

    speaker:
    WorkDialogueSpeaker;

    /*
     * NPC:
     * câu thực sự nói.
     *
     * PLAYER:
     * câu mẫu chuẩn.
     *
     * Câu player KHÔNG dùng để
     * exact-match khi chấm.
     */
    textJa: string;

    /*
     * Chuẩn bị cho Furigana.
     *
     * Phần UI chúng ta sẽ nối sau.
     */
    readingJa?: string;

    /*
     * Dịch câu NPC.
     */
    translations?:
    LocalizedDialogueText;

    /*
     * Yêu cầu bằng ngôn ngữ
     * của người học.
     */
    instruction?:
    LocalizedDialogueText;

    /*
     * Hint chỉ để hỗ trợ.
     *
     * QUAN TRỌNG:
     * hint KHÔNG tham gia chấm điểm.
     */
    hintsByLevel?: Partial<
        Record<
            JapaneseLevel,
            string[]
        >
    >;

    /*
     * Câu mẫu khi người học
     * chọn 答えを見る.
     */
    recommendedAnswerJa?:
    string;

    /*
     * Engine đánh giá intent.
     */
    evaluation?:
    WorkDialogueEvaluation;
};

/*
 * =========================================================
 * SCENARIO
 * =========================================================
 */

export type WorkDialogueScenario = {
    id: string;

    routeId: string;

    operationCodes?:
    string[];

    titleJa: string;

    titleTranslations?:
    LocalizedDialogueText;

    descriptionJa: string;

    descriptionTranslations?:
    LocalizedDialogueText;

    npcNameJa: string;

    nodes:
    WorkDialogueNode[];

    rewardXp: number;

    rewardCoins: number;
};

/*
 * =========================================================
 * SCENARIOS
 * =========================================================
 */

export const workDialogueScenarios:
    WorkDialogueScenario[] = [
        /*
         * =====================================================
         * 鉄筋施工
         * 3-7-1 鉄筋組立て
         * =====================================================
         */

        {
            id:
                'WORK_REBAR_DAILY_001',

            routeId:
                'CONSTRUCTION_REBAR',

            operationCodes: [
                '3-7-1',
            ],

            titleJa:
                '今日の鉄筋作業を確認する',

            titleTranslations: {
                vi:
                    'Xác nhận công việc cốt thép hôm nay',

                en:
                    'Confirm today’s reinforcing-bar work',

                id:
                    'Konfirmasi pekerjaan tulangan hari ini',

                'zh-CN':
                    '确认今天的钢筋作业',

                'zh-TW':
                    '確認今天的鋼筋作業',

                hi:
                    'आज के रीबार कार्य की पुष्टि करें',
            },

            descriptionJa:
                '現場で今日の作業場所と作業内容を確認します。',

            descriptionTranslations: {
                vi:
                    'Xác nhận vị trí và nội dung công việc hôm nay tại công trường.',

                en:
                    'Confirm today’s work location and tasks at the construction site.',

                id:
                    'Konfirmasi lokasi dan isi pekerjaan hari ini di lokasi konstruksi.',

                'zh-CN':
                    '在施工现场确认今天的作业地点和工作内容。',

                'zh-TW':
                    '在施工現場確認今天的作業地點和工作內容。',

                hi:
                    'निर्माण स्थल पर आज के कार्य स्थान और कार्य की पुष्टि करें।',
            },

            npcNameJa:
                '田中班長',

            rewardXp:
                100,

            rewardCoins:
                30,

            nodes: [
                /*
                 * =================================================
                 * NPC 1
                 * =================================================
                 */

                {
                    id:
                        'REBAR_001_01',

                    speaker:
                        'npc',

                    textJa:
                        'おはようございます。今日もよろしくお願いします。',

                    readingJa:
                        'おはようございます。きょうもよろしくおねがいします。',

                    translations: {
                        vi:
                            'Chào buổi sáng. Hôm nay cũng mong bạn giúp đỡ.',

                        en:
                            'Good morning. Let’s have a good day today.',

                        id:
                            'Selamat pagi. Mari bekerja dengan baik hari ini.',

                        'zh-CN':
                            '早上好，今天也请多关照。',

                        'zh-TW':
                            '早安，今天也請多多關照。',

                        hi:
                            'सुप्रभात। आज भीよろしくお願いします。',
                    },
                },

                /*
                 * =================================================
                 * PLAYER 1
                 *
                 * INTENT:
                 * hỏi công việc hôm nay
                 * =================================================
                 */

                {
                    id:
                        'REBAR_001_02',

                    speaker:
                        'player',

                    textJa:
                        'おはようございます。今日の作業は何ですか？',

                    instruction: {
                        vi:
                            'Hãy chào lại trưởng nhóm và xác nhận công việc hôm nay.',

                        en:
                            'Greet the team leader and confirm today’s work.',

                        id:
                            'Sapa kepala tim dan konfirmasikan pekerjaan hari ini.',

                        'zh-CN':
                            '向班长问候并确认今天的工作内容。',

                        'zh-TW':
                            '向班長問候並確認今天的工作內容。',

                        hi:
                            'टीम लीडर का अभिवादन करें और आज के काम की पुष्टि करें。',
                    },

                    /*
                     * HINT KHÔNG DÙNG ĐỂ CHẤM.
                     */

                    hintsByLevel: {
                        N5: [
                            '今日',
                            '作業',
                        ],

                        N4: [
                            '今日の作業',
                        ],

                        N3: [
                            '作業',
                        ],

                        N2: [],

                        N1: [],
                    },

                    recommendedAnswerJa:
                        'おはようございます。今日の作業は何ですか？',

                    evaluation: {
                        intentId:
                            'ask_today_work',

                        /*
                         * Cần thể hiện:
                         *
                         * - hôm nay
                         * - hỏi về công việc
                         */

                        requiredConceptGroups: [
                            [
                                '今日',
                                '本日',
                            ],

                            [
                                '作業',
                                '仕事',
                                '何をします',
                                '何します',
                                '何をやります',
                                '何やります',
                                '何ですか',
                            ],
                        ],

                        /*
                         * Cách nói tự nhiên / rõ intent.
                         */

                        strongPatterns: [
                            /今日.*作業.*何/,
                            /今日.*仕事.*何/,
                            /今日は.*何をします/,
                            /今日は.*何します/,
                            /今日は.*何をやります/,
                            /今日は.*何やります/,
                            /本日.*作業.*何/,
                        ],

                        /*
                         * Cách nói vẫn hiểu được
                         * nhưng có thể thiếu tự nhiên.
                         */

                        understandablePatterns: [
                            /今日.*何/,
                            /作業.*何/,
                            /仕事.*何/,
                            /今日は.*作業/,
                        ],

                        /*
                         * Có 今日 + 作業 nhưng
                         * nghĩa lại hoàn toàn ngược
                         * → fail.
                         */

                        contradictionPatterns: [
                            /したくない/,
                            /やりたくない/,
                            /働きたくない/,
                            /仕事したくない/,
                            /作業したくない/,
                            /サボ/,
                            /さぼ/,
                            /休みたい/,
                            /帰りたい/,
                            /やりません/,
                            /しません/,
                        ],

                        minimumConceptRatio:
                            1,
                    },
                },

                /*
                 * =================================================
                 * NPC 2
                 * =================================================
                 */

                {
                    id:
                        'REBAR_001_03',

                    speaker:
                        'npc',

                    textJa:
                        '今日は二階の梁の鉄筋を組み立てます。',

                    readingJa:
                        'きょうはにかいのはりのてっきんをくみたてます。',

                    translations: {
                        vi:
                            'Hôm nay chúng ta sẽ lắp cốt thép dầm ở tầng hai.',

                        en:
                            'Today we will assemble reinforcing bars for the beams on the second floor.',

                        id:
                            'Hari ini kita akan merakit tulangan balok di lantai dua.',

                        'zh-CN':
                            '今天组装二楼梁的钢筋。',

                        'zh-TW':
                            '今天要組裝二樓樑的鋼筋。',
                    },
                },

                /*
                 * =================================================
                 * PLAYER 2
                 *
                 * INTENT:
                 * hỏi bắt đầu ở đâu
                 * =================================================
                 */

                {
                    id:
                        'REBAR_001_04',

                    speaker:
                        'player',

                    textJa:
                        '二階ですね。どこから始めますか？',

                    instruction: {
                        vi:
                            'Hãy xác nhận lại tầng làm việc và hỏi sẽ bắt đầu từ đâu.',

                        en:
                            'Confirm the floor and ask where to start.',

                        id:
                            'Konfirmasi lantai kerja dan tanyakan mulai dari mana.',

                        'zh-CN':
                            '确认工作楼层，并询问从哪里开始。',

                        'zh-TW':
                            '確認工作樓層，並詢問從哪裡開始。',

                        hi:
                            'काम की मंजिल की पुष्टि करें और पूछें कि कहाँ से शुरू करना है。',
                    },

                    hintsByLevel: {
                        N5: [
                            'どこ',
                            '始めます',
                        ],

                        N4: [
                            'どこから',
                        ],

                        N3: [
                            '始める',
                        ],

                        N2: [],

                        N1: [],
                    },

                    recommendedAnswerJa:
                        '二階ですね。どこから始めますか？',

                    evaluation: {
                        intentId:
                            'ask_starting_point',

                        /*
                         * Concept:
                         * WHERE + START
                         */

                        requiredConceptGroups: [
                            [
                                'どこ',
                                'どこから',
                                'どちら',
                                '最初',
                                'はじめ',
                            ],

                            [
                                '始め',
                                '始まり',
                                'やり',
                                'いいですか',
                                'ですか',
                            ],
                        ],

                        /*
                         * Hoàn toàn tự nhiên.
                         */

                        strongPatterns: [
                            /どこから.*始め/,
                            /どこから.*やり/,
                            /どこから.*始まり/,
                            /最初.*どこ/,
                            /最初は.*どこ/,
                            /どちらから.*始め/,
                        ],

                        /*
                         * Không hoàn hảo về grammar,
                         * nhưng người Nhật vẫn hiểu intent.
                         */

                        understandablePatterns: [
                            /どこから.*いいですか/,
                            /どこ.*始まります/,
                            /どこ.*始めます/,
                            /どこ.*始める/,
                            /どこからですか/,
                            /最初.*どこですか/,
                            /どこ.*やります/,
                            /どこから.*やれば/,
                        ],

                        contradictionPatterns: [
                            /始めたくない/,
                            /やりたくない/,
                            /やめたい/,
                            /帰りたい/,
                            /やりません/,
                            /始めません/,
                        ],

                        minimumConceptRatio:
                            0.5,
                    },
                },

                /*
                 * =================================================
                 * NPC 3
                 * =================================================
                 */

                {
                    id:
                        'REBAR_001_05',

                    speaker:
                        'npc',

                    textJa:
                        '東側から始めます。まず図面を確認してください。',

                    readingJa:
                        'ひがしがわからはじめます。まずずめんをかくにんしてください。',

                    translations: {
                        vi:
                            'Chúng ta bắt đầu từ phía đông. Trước tiên hãy kiểm tra bản vẽ.',

                        en:
                            'We’ll start from the east side. Please check the drawing first.',

                        id:
                            'Kita mulai dari sisi timur. Periksa gambar terlebih dahulu.',

                        'zh-CN':
                            '从东侧开始。请先确认图纸。',

                        'zh-TW':
                            '從東側開始。請先確認圖面。',
                    },
                },

                /*
                 * =================================================
                 * PLAYER 3
                 *
                 * INTENT:
                 * xác nhận hiểu + sẽ kiểm tra bản vẽ
                 * =================================================
                 */

                {
                    id:
                        'REBAR_001_06',

                    speaker:
                        'player',

                    textJa:
                        'わかりました。図面を確認します。',

                    instruction: {
                        vi:
                            'Hãy xác nhận rằng bạn đã hiểu và sẽ kiểm tra bản vẽ.',

                        en:
                            'Confirm that you understand and will check the drawing.',

                        id:
                            'Konfirmasikan bahwa Anda mengerti dan akan memeriksa gambar.',

                        'zh-CN':
                            '表示已经明白，并说明会确认图纸。',

                        'zh-TW':
                            '表示已經了解，並說明會確認圖面。',

                        hi:
                            'बताएँ कि आप समझ गए हैं और ड्रॉइंग की जाँच करेंगे。',
                    },

                    hintsByLevel: {
                        N5: [
                            'わかりました',
                            '図面',
                        ],

                        N4: [
                            '図面',
                            '確認',
                        ],

                        N3: [
                            '確認',
                        ],

                        N2: [],

                        N1: [],
                    },

                    recommendedAnswerJa:
                        'わかりました。図面を確認します。',

                    evaluation: {
                        intentId:
                            'confirm_check_drawing',

                        requiredConceptGroups: [
                            [
                                'わかりました',
                                'わかり',
                                '了解',
                                'はい',
                            ],

                            [
                                '図面',
                                '図',
                            ],

                            [
                                '確認',
                                '見ます',
                                '見て',
                                'チェック',
                            ],
                        ],

                        strongPatterns: [
                            /わかりました.*図面.*確認/,
                            /はい.*図面.*確認/,
                            /図面.*確認します/,
                            /図面.*見ます/,
                            /了解.*図面/,
                        ],

                        understandablePatterns: [
                            /図面.*確認/,
                            /図面.*見/,
                            /はい.*確認/,
                            /わかりました.*確認/,
                        ],

                        contradictionPatterns: [
                            /確認しません/,
                            /見ません/,
                            /見たくない/,
                            /わかりません/,
                            /わからない/,
                            /やりません/,
                        ],

                        minimumConceptRatio:
                            0.66,
                    },
                },

                /*
                 * =================================================
                 * NPC 4
                 * =================================================
                 */

                {
                    id:
                        'REBAR_001_07',

                    speaker:
                        'npc',

                    textJa:
                        'わからないところがあったら、すぐに聞いてください。',

                    readingJa:
                        'わからないところがあったら、すぐにきいてください。',

                    translations: {
                        vi:
                            'Nếu có chỗ nào không hiểu thì hãy hỏi ngay nhé.',

                        en:
                            'If there is anything you don’t understand, ask immediately.',

                        id:
                            'Kalau ada yang tidak dimengerti, segera tanyakan.',

                        'zh-CN':
                            '如果有不明白的地方，请马上问。',

                        'zh-TW':
                            '如果有不懂的地方，請馬上詢問。',
                    },
                },

                /*
                 * =================================================
                 * PLAYER 4
                 *
                 * INTENT:
                 * hiểu + kết thúc lịch sự
                 * =================================================
                 */

                {
                    id:
                        'REBAR_001_08',

                    speaker:
                        'player',

                    textJa:
                        'はい、わかりました。よろしくお願いします。',

                    instruction: {
                        vi:
                            'Hãy trả lời rằng bạn đã hiểu và kết thúc trao đổi một cách lịch sự.',

                        en:
                            'Say that you understand and finish the exchange politely.',

                        id:
                            'Katakan bahwa Anda mengerti dan akhiri percakapan dengan sopan.',

                        'zh-CN':
                            '表示已经明白，并礼貌地结束对话。',

                        'zh-TW':
                            '表示已經了解，並有禮貌地結束對話。',

                        hi:
                            'बताएँ कि आप समझ गए हैं और बातचीत को विनम्रता से समाप्त करें。',
                    },

                    hintsByLevel: {
                        N5: [
                            'わかりました',
                            'よろしくお願いします',
                        ],

                        N4: [
                            'わかりました',
                            'よろしく',
                        ],

                        N3: [
                            'よろしく',
                        ],

                        N2: [],

                        N1: [],
                    },

                    recommendedAnswerJa:
                        'はい、わかりました。よろしくお願いします。',

                    evaluation: {
                        intentId:
                            'acknowledge_and_close',

                        requiredConceptGroups: [
                            [
                                'わかりました',
                                '了解',
                                'はい',
                                '承知',
                            ],

                            [
                                'よろしく',
                                'お願いします',
                            ],
                        ],

                        strongPatterns: [
                            /わかりました.*よろしく/,
                            /はい.*よろしく/,
                            /了解.*よろしく/,
                            /承知.*よろしく/,
                        ],

                        understandablePatterns: [
                            /わかりました/,
                            /よろしくお願いします/,
                            /了解しました/,
                        ],

                        contradictionPatterns: [
                            /わかりません/,
                            /わからない/,
                            /嫌です/,
                            /やりません/,
                            /帰ります/,
                        ],

                        minimumConceptRatio:
                            0.5,
                    },
                },
            ],
        },

        /*
         * =====================================================
         * AGRICULTURE SAMPLE
         * =====================================================
         */

        {
            id:
                'WORK_AGRI_CROP_001',

            routeId:
                'AGRI_CROP',

            operationCodes: [
                '1-1-1',
                '1-1-2',
                '1-1-3',
            ],

            titleJa:
                '今日の収穫作業を確認する',

            titleTranslations: {
                vi:
                    'Xác nhận công việc thu hoạch hôm nay',

                en:
                    'Confirm today’s harvesting work',

                id:
                    'Konfirmasi pekerjaan panen hari ini',
            },

            descriptionJa:
                '収穫する作物と作業場所を確認します。',

            descriptionTranslations: {
                vi:
                    'Xác nhận loại cây và khu vực cần thu hoạch.',

                en:
                    'Confirm which crops and area need to be harvested.',

                id:
                    'Konfirmasi tanaman dan area yang akan dipanen.',
            },

            npcNameJa:
                '佐藤さん',

            rewardXp:
                100,

            rewardCoins:
                30,

            nodes: [
                /*
                 * NPC 1
                 */

                {
                    id:
                        'AGRI_001_01',

                    speaker:
                        'npc',

                    textJa:
                        'おはようございます。今日は収穫をお願いします。',

                    readingJa:
                        'おはようございます。きょうはしゅうかくをおねがいします。',

                    translations: {
                        vi:
                            'Chào buổi sáng. Hôm nay nhờ bạn thu hoạch nhé.',

                        en:
                            'Good morning. Please do the harvesting today.',
                    },
                },

                /*
                 * PLAYER 1
                 *
                 * hỏi thu hoạch gì
                 */

                {
                    id:
                        'AGRI_001_02',

                    speaker:
                        'player',

                    textJa:
                        '今日は何を収穫しますか？',

                    instruction: {
                        vi:
                            'Hãy hỏi hôm nay cần thu hoạch loại nông sản nào.',

                        en:
                            'Ask what crop you need to harvest today.',

                        id:
                            'Tanyakan tanaman apa yang harus dipanen hari ini.',
                    },

                    hintsByLevel: {
                        N5: [
                            '何',
                            '収穫',
                        ],

                        N4: [
                            '何を収穫',
                        ],

                        N3: [
                            '収穫',
                        ],

                        N2: [],

                        N1: [],
                    },

                    recommendedAnswerJa:
                        '今日は何を収穫しますか？',

                    evaluation: {
                        intentId:
                            'ask_crop_to_harvest',

                        requiredConceptGroups: [
                            [
                                '何',
                                'なに',
                            ],

                            [
                                '収穫',
                                '取ります',
                                '採ります',
                                'とります',
                            ],
                        ],

                        strongPatterns: [
                            /何.*収穫/,
                            /何を.*取ります/,
                            /何を.*採ります/,
                            /今日は.*何.*取/,
                        ],

                        understandablePatterns: [
                            /収穫.*何/,
                            /何.*取/,
                            /今日は.*何/,
                        ],

                        contradictionPatterns: [
                            /収穫したくない/,
                            /取りたくない/,
                            /やりたくない/,
                            /休みたい/,
                            /サボ/,
                        ],

                        minimumConceptRatio:
                            1,
                    },
                },

                /*
                 * NPC 2
                 */

                {
                    id:
                        'AGRI_001_03',

                    speaker:
                        'npc',

                    textJa:
                        '今日はトマトを収穫します。',

                    readingJa:
                        'きょうはトマトをしゅうかくします。',

                    translations: {
                        vi:
                            'Hôm nay chúng ta thu hoạch cà chua.',

                        en:
                            'Today we will harvest tomatoes.',
                    },
                },

                /*
                 * PLAYER 2
                 *
                 * hỏi nhà kính nào
                 */

                {
                    id:
                        'AGRI_001_04',

                    speaker:
                        'player',

                    textJa:
                        'どのハウスですか？',

                    instruction: {
                        vi:
                            'Hãy hỏi cần làm ở nhà kính nào.',

                        en:
                            'Ask which greenhouse you should work in.',

                        id:
                            'Tanyakan di rumah kaca mana Anda harus bekerja.',
                    },

                    hintsByLevel: {
                        N5: [
                            'どの',
                            'ハウス',
                        ],

                        N4: [
                            'どのハウス',
                        ],

                        N3: [
                            'ハウス',
                        ],

                        N2: [],

                        N1: [],
                    },

                    recommendedAnswerJa:
                        'どのハウスですか？',

                    evaluation: {
                        intentId:
                            'ask_greenhouse',

                        requiredConceptGroups: [
                            [
                                'どの',
                                'どこ',
                                '何番',
                                'どちら',
                            ],

                            [
                                'ハウス',
                                '温室',
                                '場所',
                            ],
                        ],

                        strongPatterns: [
                            /どの.*ハウス/,
                            /何番.*ハウス/,
                            /ハウス.*どこ/,
                            /どこの.*ハウス/,
                        ],

                        understandablePatterns: [
                            /どこですか/,
                            /何番ですか/,
                            /どちらですか/,
                        ],

                        contradictionPatterns: [
                            /行きたくない/,
                            /やりたくない/,
                            /ハウスに行きません/,
                        ],

                        minimumConceptRatio:
                            0.5,
                    },
                },

                /*
                 * NPC 3
                 */

                {
                    id:
                        'AGRI_001_05',

                    speaker:
                        'npc',

                    textJa:
                        '三番のハウスです。赤いトマトだけ取ってください。',

                    readingJa:
                        'さんばんのハウスです。あかいトマトだけとってください。',

                    translations: {
                        vi:
                            'Nhà kính số 3. Chỉ hái những quả cà chua màu đỏ.',

                        en:
                            'Greenhouse number three. Please pick only the red tomatoes.',
                    },
                },

                /*
                 * PLAYER 3
                 *
                 * xác nhận chỉ lấy cà chua đỏ
                 */

                {
                    id:
                        'AGRI_001_06',

                    speaker:
                        'player',

                    textJa:
                        '赤いトマトだけですね。',

                    instruction: {
                        vi:
                            'Hãy xác nhận lại rằng chỉ hái cà chua màu đỏ.',

                        en:
                            'Confirm that you should pick only the red tomatoes.',
                    },

                    hintsByLevel: {
                        N5: [
                            '赤いトマト',
                            'だけ',
                        ],

                        N4: [
                            '赤い',
                            'だけ',
                        ],

                        N3: [
                            'だけ',
                        ],

                        N2: [],

                        N1: [],
                    },

                    recommendedAnswerJa:
                        '赤いトマトだけですね。',

                    evaluation: {
                        intentId:
                            'confirm_red_tomatoes_only',

                        requiredConceptGroups: [
                            [
                                '赤い',
                                '赤',
                            ],

                            [
                                'トマト',
                            ],

                            [
                                'だけ',
                                'のみ',
                            ],
                        ],

                        strongPatterns: [
                            /赤い.*トマト.*だけ/,
                            /赤.*トマト.*だけ/,
                            /トマト.*赤い.*だけ/,
                            /赤い.*もの.*だけ/,
                        ],

                        understandablePatterns: [
                            /赤い.*だけ/,
                            /赤.*だけ/,
                            /トマト.*だけ/,
                        ],

                        contradictionPatterns: [
                            /全部/,
                            /緑/,
                            /青い/,
                            /何でも/,
                            /全部取/,
                            /赤くない/,
                        ],

                        minimumConceptRatio:
                            0.66,
                    },
                },

                /*
                 * NPC 4
                 */

                {
                    id:
                        'AGRI_001_07',

                    speaker:
                        'npc',

                    textJa:
                        'はい。わからないことがあったら聞いてください。',

                    readingJa:
                        'はい。わからないことがあったらきいてください。',

                    translations: {
                        vi:
                            'Đúng rồi. Nếu có điều gì không hiểu thì hãy hỏi nhé.',

                        en:
                            'Yes. If there is anything you do not understand, please ask.',
                    },
                },

                /*
                 * PLAYER 4
                 */

                {
                    id:
                        'AGRI_001_08',

                    speaker:
                        'player',

                    textJa:
                        'はい、わかりました。よろしくお願いします。',

                    instruction: {
                        vi:
                            'Hãy xác nhận rằng bạn đã hiểu và kết thúc trao đổi lịch sự.',

                        en:
                            'Confirm that you understand and finish the exchange politely.',
                    },

                    hintsByLevel: {
                        N5: [
                            'わかりました',
                            'よろしくお願いします',
                        ],

                        N4: [
                            'わかりました',
                            'よろしく',
                        ],

                        N3: [
                            'よろしく',
                        ],

                        N2: [],

                        N1: [],
                    },

                    recommendedAnswerJa:
                        'はい、わかりました。よろしくお願いします。',

                    evaluation: {
                        intentId:
                            'acknowledge_and_close',

                        requiredConceptGroups: [
                            [
                                'わかりました',
                                '了解',
                                'はい',
                                '承知',
                            ],

                            [
                                'よろしく',
                                'お願いします',
                            ],
                        ],

                        strongPatterns: [
                            /わかりました.*よろしく/,
                            /はい.*よろしく/,
                            /了解.*よろしく/,
                            /承知.*よろしく/,
                        ],

                        understandablePatterns: [
                            /わかりました/,
                            /よろしくお願いします/,
                            /了解しました/,
                        ],

                        contradictionPatterns: [
                            /わかりません/,
                            /わからない/,
                            /嫌です/,
                            /やりません/,
                            /帰ります/,
                        ],

                        minimumConceptRatio:
                            0.5,
                    },
                },
            ],
        },
    ];

/*
 * =========================================================
 * LOCALIZATION
 * =========================================================
 */

function localized(
    japanese: string,

    translations:
        LocalizedDialogueText |
        undefined,

    language:
        AppLanguageCode
): string {
    if (
        language ===
        'ja'
    ) {
        return japanese;
    }

    return (
        translations?.[
        language
        ] ??
        translations?.en ??
        japanese
    );
}

export function getWorkScenarioTitle(
    scenario:
        WorkDialogueScenario,

    language:
        AppLanguageCode
): string {
    return localized(
        scenario.titleJa,
        scenario.titleTranslations,
        language
    );
}

export function getWorkScenarioDescription(
    scenario:
        WorkDialogueScenario,

    language:
        AppLanguageCode
): string {
    return localized(
        scenario.descriptionJa,
        scenario.descriptionTranslations,
        language
    );
}

export function getWorkDialogueTranslation(
    node:
        WorkDialogueNode,

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
        node.translations?.[
        language
        ] ??
        node.translations?.en ??
        ''
    );
}

export function getWorkDialogueInstruction(
    node:
        WorkDialogueNode,

    language:
        AppLanguageCode
): string {
    if (
        !node.instruction
    ) {
        return '';
    }

    return (
        node.instruction[
        language
        ] ??
        node.instruction.en ??
        node.textJa
    );
}

/*
 * =========================================================
 * HINT
 *
 * Hint hoàn toàn độc lập với evaluation.
 * =========================================================
 */

export function getHintsForLevel(
    node:
        WorkDialogueNode,

    level:
        JapaneseLevel
): string[] {
    return (
        node.hintsByLevel?.[
        level
        ] ??
        []
    );
}

/*
 * =========================================================
 * ANSWER NORMALIZATION
 * =========================================================
 */

function normalizeWorkAnswer(
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

/*
 * =========================================================
 * CONCEPT MATCH
 * =========================================================
 */

function matchConceptGroup(
    normalizedAnswer:
        string,

    group:
        string[]
): boolean {
    return group.some(
        (
            concept
        ) => {
            const normalizedConcept =
                normalizeWorkAnswer(
                    concept
                );

            return normalizedAnswer.includes(
                normalizedConcept
            );
        }
    );
}

/*
 * =========================================================
 * SAFE REGEXP TEST
 *
 * Reset lastIndex để sau này nếu dùng regex có flag g
 * cũng không phát sinh state ngầm.
 * =========================================================
 */

function testPattern(
    pattern:
        RegExp,

    value:
        string
): boolean {
    pattern.lastIndex =
        0;

    return pattern.test(
        value
    );
}

/*
 * =========================================================
 * EVALUATE WORK ANSWER
 *
 * Kết quả:
 *
 * correct
 * understandable
 * incorrect
 *
 * Hint KHÔNG được truy cập tại đây.
 * =========================================================
 */

export function evaluateWorkAnswer(
    node:
        WorkDialogueNode,

    transcript:
        string
): AnswerEvaluationResult {
    const evaluation =
        node.evaluation;

    if (
        !evaluation
    ) {
        return 'incorrect';
    }

    const cleanTranscript =
        transcript.trim();

    if (
        !cleanTranscript
    ) {
        return 'incorrect';
    }

    const normalizedAnswer =
        normalizeWorkAnswer(
            cleanTranscript
        );

    /*
     * =====================================================
     * 1. CONTRADICTION
     *
     * Luôn kiểm tra trước strong pattern.
     *
     * Ví dụ:
     *
     * 今日の作業はしたくない
     *
     * có 今日 + 作業
     * nhưng intent hoàn toàn sai.
     * =====================================================
     */

    const contradictionMatched =
        evaluation
            .contradictionPatterns
            ?.some(
                (
                    pattern
                ) =>
                    testPattern(
                        pattern,
                        cleanTranscript
                    )
            ) ??
        false;

    if (
        contradictionMatched
    ) {
        return 'incorrect';
    }

    /*
     * =====================================================
     * 2. CONCEPT SCORE
     * =====================================================
     */

    const conceptGroups =
        evaluation
            .requiredConceptGroups;

    const matchedConceptCount =
        conceptGroups.filter(
            (
                group
            ) =>
                matchConceptGroup(
                    normalizedAnswer,
                    group
                )
        ).length;

    const conceptRatio =
        conceptGroups.length >
            0
            ? matchedConceptCount /
            conceptGroups.length
            : 0;

    const minimumRatio =
        evaluation
            .minimumConceptRatio ??
        0.7;

    /*
     * =====================================================
     * 3. STRONG PATTERN
     *
     * Strong pattern không được tự động PASS
     * nếu concept hoàn toàn thiếu.
     *
     * Vẫn yêu cầu đạt minimum concept ratio.
     * =====================================================
     */

    const strongMatched =
        evaluation
            .strongPatterns
            ?.some(
                (
                    pattern
                ) =>
                    testPattern(
                        pattern,
                        cleanTranscript
                    )
            ) ??
        false;

    if (
        strongMatched &&
        conceptRatio >=
        minimumRatio
    ) {
        return 'correct';
    }

    /*
     * =====================================================
     * 4. UNDERSTANDABLE
     *
     * Ví dụ:
     *
     * どこからいいですか？
     *
     * không tự nhiên hoàn toàn
     * nhưng intent vẫn hiểu được.
     * =====================================================
     */

    const understandableMatched =
        evaluation
            .understandablePatterns
            ?.some(
                (
                    pattern
                ) =>
                    testPattern(
                        pattern,
                        cleanTranscript
                    )
            ) ??
        false;

    if (
        understandableMatched &&
        conceptRatio >=
        minimumRatio
    ) {
        return 'understandable';
    }

    /*
     * =====================================================
     * 5. ĐỦ CONCEPT NHƯNG KHÔNG MATCH PATTERN
     *
     * Người học có thể tạo ra câu mới
     * mà chúng ta chưa liệt kê.
     *
     * Nếu truyền đạt đủ concept
     * và không contradiction:
     *
     * → understandable
     *
     * Không cho correct để tránh
     * đánh giá quá dễ.
     * =====================================================
     */

    if (
        conceptRatio >=
        minimumRatio
    ) {
        return 'understandable';
    }

    return 'incorrect';
}
/*
 * =========================================================
 * DETAILED LOCAL EVALUATION
 *
 * Dùng cho pipeline local-first:
 *
 * correct
 * understandable
 * incorrect
 * uncertain → chỉ trạng thái này mới được phép
 *             chuyển sang AI fallback.
 * =========================================================
 */

export type WorkAnswerDetailedResult =
    | 'correct'
    | 'understandable'
    | 'incorrect'
    | 'uncertain';

export function evaluateWorkAnswerDetailed(
    node: WorkDialogueNode,
    transcript: string
): WorkAnswerDetailedResult {
    const evaluation =
        node.evaluation;

    /*
     * Không có evaluation data:
     * local engine không đủ thông tin.
     */
    if (
        !evaluation
    ) {
        return 'uncertain';
    }

    const cleanTranscript =
        transcript.trim();

    if (
        !cleanTranscript
    ) {
        return 'incorrect';
    }

    const normalizedAnswer =
        normalizeWorkAnswer(
            cleanTranscript
        );

    /*
     * =====================================================
     * 1. CONTRADICTION
     * =====================================================
     */

    const contradictionMatched =
        evaluation
            .contradictionPatterns
            ?.some(
                pattern =>
                    testPattern(
                        pattern,
                        cleanTranscript
                    )
            ) ??
        false;

    if (
        contradictionMatched
    ) {
        return 'incorrect';
    }

    /*
     * =====================================================
     * 2. CONCEPT SCORE
     * =====================================================
     */

    const conceptGroups =
        evaluation
            .requiredConceptGroups;

    const matchedConceptCount =
        conceptGroups.filter(
            group =>
                matchConceptGroup(
                    normalizedAnswer,
                    group
                )
        ).length;

    const conceptRatio =
        conceptGroups.length >
            0
            ? matchedConceptCount /
            conceptGroups.length
            : 0;

    const minimumRatio =
        evaluation
            .minimumConceptRatio ??
        0.7;

    /*
     * =====================================================
     * 3. STRONG PATTERN
     * =====================================================
     */

    const strongMatched =
        evaluation
            .strongPatterns
            ?.some(
                pattern =>
                    testPattern(
                        pattern,
                        cleanTranscript
                    )
            ) ??
        false;

    if (
        strongMatched &&
        conceptRatio >=
        minimumRatio
    ) {
        return 'correct';
    }

    /*
     * =====================================================
     * 4. UNDERSTANDABLE PATTERN
     * =====================================================
     */

    const understandableMatched =
        evaluation
            .understandablePatterns
            ?.some(
                pattern =>
                    testPattern(
                        pattern,
                        cleanTranscript
                    )
            ) ??
        false;

    if (
        understandableMatched &&
        conceptRatio >=
        minimumRatio
    ) {
        return 'understandable';
    }

    /*
     * =====================================================
     * 5. ĐỦ CONCEPT
     *
     * Câu mới nhưng truyền đạt đủ ý.
     * =====================================================
     */

    if (
        conceptRatio >=
        minimumRatio
    ) {
        return 'understandable';
    }

    /*
     * =====================================================
     * 6. PARTIAL CONCEPT
     *
     * Có dấu hiệu đúng nhưng local engine
     * chưa đủ chắc để PASS hay RETRY.
     *
     * Đây là ứng viên AI fallback.
     * =====================================================
     */

    if (
        matchedConceptCount >
        0
    ) {
        return 'uncertain';
    }

    /*
     * =====================================================
     * 7. COMPLEX UNKNOWN ANSWER
     *
     * Không match concept nhưng câu Japanese tương đối dài.
     * Không vội kết luận sai vì có thể người chơi diễn đạt
     * bằng cách database chưa biết.
     * =====================================================
     */

    if (
        normalizedAnswer.length >=
        12
    ) {
        return 'uncertain';
    }

    /*
     * Câu ngắn + không concept + không pattern
     * → đủ chắc để RETRY local.
     */

    return 'incorrect';
}
/*
 * =========================================================
 * SCENARIO ROUTING
 * =========================================================
 */

export function getWorkDialogueScenarios(
    operationCode:
        string
) {
    const route =
        getWorkDialogueRoute(
            operationCode
        );

    return workDialogueScenarios.filter(
        (
            scenario
        ) => {
            if (
                scenario
                    .operationCodes
                    ?.includes(
                        operationCode
                    )
            ) {
                return true;
            }

            return (
                scenario.routeId ===
                route.id
            );
        }
    );
}

export function getWorkDialogueScenario(
    operationCode:
        string
):
    WorkDialogueScenario |
    null {
    const scenarios =
        getWorkDialogueScenarios(
            operationCode
        );

    if (
        scenarios.length ===
        0
    ) {
        return null;
    }

    /*
     * Hiện lấy scenario đầu.
     *
     * Sau này:
     *
     * scenario 1 → 5
     * rồi repeatable dialogue pool.
     */

    return scenarios[0];
}

