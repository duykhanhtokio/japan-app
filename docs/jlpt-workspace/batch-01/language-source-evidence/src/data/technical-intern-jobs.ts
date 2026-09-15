import type {
    AppLanguageCode,
} from '@/i18n/languages';

import {
    technicalInternJobTranslations,
} from '@/data/technical-intern-translations';

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export type TechnicalInternOperation = {
    /*
     * ID nội bộ.
     * Dùng luôn code để đảm bảo ổn định.
     */
    id: string;

    /*
     * Code của 職種・作業.
     *
     * Ví dụ:
     * 1-1-1
     * 3-7-1
     * 99-1-1
     */
    code: string;

    /*
     * Tên tiếng Nhật chuẩn.
     *
     * Không dịch field này.
     * Translation nằm trong language pack.
     */
    nameJa: string;

    /*
     * Có thể chuyển sang 技能実習3号 hay không.
     */
    thirdStageEligible: boolean;
};

export type TechnicalInternOccupation = {
    id: string;

    /*
     * Ví dụ:
     * 3-7 = 鉄筋施工
     */
    code: string;

    nameJa: string;

    operations:
    TechnicalInternOperation[];
};

export type TechnicalInternJobGroup = {
    /*
     * Internal stable ID.
     *
     * Dùng cho translation,
     * analytics và routing.
     */
    id: string;

    nameJa: string;

    icon: string;

    occupations:
    TechnicalInternOccupation[];
};

/*
 * =========================================================
 * METADATA
 * =========================================================
 */

export const TECHNICAL_INTERN_JOB_DATA_VERSION =
    '2026-07-29';

export const TECHNICAL_INTERN_JOB_SOURCE =
    '外国人技能実習機構（OTIT）移行対象職種情報';

export const TECHNICAL_INTERN_JOB_OFFICIAL_COUNT = {
    occupations: 96,

    operations: 174,
};

/*
 * =========================================================
 * BUILD HELPERS
 * =========================================================
 */

type OperationInput = {
    code: string;

    nameJa: string;

    thirdStageEligible?: boolean;
};

function operation({
    code,
    nameJa,
    thirdStageEligible = true,
}: OperationInput): TechnicalInternOperation {
    return {
        id: code,

        code,

        nameJa,

        thirdStageEligible,
    };
}

function occupation(
    code: string,
    nameJa: string,
    operations:
        OperationInput[]
): TechnicalInternOccupation {
    return {
        id: code,

        code,

        nameJa,

        operations:
            operations.map(
                operation
            ),
    };
}

/*
 * =========================================================
 * DATA
 *
 * 96職種 / 174作業
 * 2026-07-29
 * =========================================================
 */

export const technicalInternJobGroups:
    TechnicalInternJobGroup[] = [
        /*
         * =====================================================
         * 1.
         * 農業・林業関係
         *
         * 3職種 / 7作業
         * =====================================================
         */

        {
            id:
                'AGRICULTURE_FORESTRY',

            nameJa:
                '農業・林業関係',

            icon:
                '🌱',

            occupations: [
                occupation(
                    '1-1',
                    '耕種農業',
                    [
                        {
                            code:
                                '1-1-1',

                            nameJa:
                                '施設園芸',
                        },

                        {
                            code:
                                '1-1-2',

                            nameJa:
                                '畑作・野菜',
                        },

                        {
                            code:
                                '1-1-3',

                            nameJa:
                                '果樹',
                        },
                    ]
                ),

                occupation(
                    '1-2',
                    '畜産農業',
                    [
                        {
                            code:
                                '1-2-1',

                            nameJa:
                                '養豚',
                        },

                        {
                            code:
                                '1-2-2',

                            nameJa:
                                '養鶏',
                        },

                        {
                            code:
                                '1-2-3',

                            nameJa:
                                '酪農',
                        },
                    ]
                ),

                occupation(
                    '1-3',
                    '林業',
                    [
                        {
                            code:
                                '1-3-1',

                            nameJa:
                                '育林・素材生産作業',
                        },
                    ]
                ),
            ],
        },

        /*
         * =====================================================
         * 2.
         * 漁業関係
         *
         * 2職種 / 10作業
         * =====================================================
         */

        {
            id:
                'FISHERY',

            nameJa:
                '漁業関係',

            icon:
                '🐟',

            occupations: [
                occupation(
                    '2-1',
                    '漁船漁業',
                    [
                        {
                            code:
                                '2-1-1',

                            nameJa:
                                'かつお一本釣り漁業',
                        },

                        {
                            code:
                                '2-1-2',

                            nameJa:
                                '延縄漁業',
                        },

                        {
                            code:
                                '2-1-3',

                            nameJa:
                                'いか釣り漁業',
                        },

                        {
                            code:
                                '2-1-4',

                            nameJa:
                                'まき網漁業',
                        },

                        {
                            code:
                                '2-1-5',

                            nameJa:
                                'ひき網漁業',
                        },

                        {
                            code:
                                '2-1-6',

                            nameJa:
                                '刺し網漁業',
                        },

                        {
                            code:
                                '2-1-7',

                            nameJa:
                                '定置網漁業',
                        },

                        {
                            code:
                                '2-1-8',

                            nameJa:
                                'かに・えびかご漁業',
                        },

                        {
                            code:
                                '2-1-9',

                            nameJa:
                                '棒受網漁業',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),

                occupation(
                    '2-2',
                    '養殖業',
                    [
                        {
                            code:
                                '2-2-1',

                            nameJa:
                                'ほたてがい・まがき養殖作業',
                        },
                    ]
                ),
            ],
        },

        /*
         * =====================================================
         * 3.
         * 建設関係
         *
         * 23職種 / 34作業
         * =====================================================
         */

        {
            id:
                'CONSTRUCTION',

            nameJa:
                '建設関係',

            icon:
                '🏗️',

            occupations: [
                occupation(
                    '3-1',
                    'さく井',
                    [
                        {
                            code:
                                '3-1-1',

                            nameJa:
                                'パーカッション式さく井工事',
                        },

                        {
                            code:
                                '3-1-2',

                            nameJa:
                                'ロータリー式さく井工事',
                        },
                    ]
                ),

                occupation(
                    '3-2',
                    '建築板金',
                    [
                        {
                            code:
                                '3-2-1',

                            nameJa:
                                'ダクト板金',
                        },

                        {
                            code:
                                '3-2-2',

                            nameJa:
                                '内外装板金',
                        },
                    ]
                ),

                occupation(
                    '3-3',
                    '冷凍空気調和機器施工',
                    [
                        {
                            code:
                                '3-3-1',

                            nameJa:
                                '冷凍空気調和機器施工',
                        },
                    ]
                ),

                occupation(
                    '3-4',
                    '建具製作',
                    [
                        {
                            code:
                                '3-4-1',

                            nameJa:
                                '木製建具手加工',
                        },
                    ]
                ),

                occupation(
                    '3-5',
                    '建築大工',
                    [
                        {
                            code:
                                '3-5-1',

                            nameJa:
                                '大工工事',
                        },
                    ]
                ),

                occupation(
                    '3-6',
                    '型枠施工',
                    [
                        {
                            code:
                                '3-6-1',

                            nameJa:
                                '型枠工事',
                        },
                    ]
                ),

                occupation(
                    '3-7',
                    '鉄筋施工',
                    [
                        {
                            code:
                                '3-7-1',

                            nameJa:
                                '鉄筋組立て',
                        },
                    ]
                ),

                occupation(
                    '3-8',
                    'とび',
                    [
                        {
                            code:
                                '3-8-1',

                            nameJa:
                                'とび',
                        },
                    ]
                ),

                occupation(
                    '3-9',
                    '石材施工',
                    [
                        {
                            code:
                                '3-9-1',

                            nameJa:
                                '石材加工',
                        },

                        {
                            code:
                                '3-9-2',

                            nameJa:
                                '石張り',
                        },
                    ]
                ),

                occupation(
                    '3-10',
                    'タイル張り',
                    [
                        {
                            code:
                                '3-10-1',

                            nameJa:
                                'タイル張り',
                        },
                    ]
                ),

                occupation(
                    '3-11',
                    'かわらぶき',
                    [
                        {
                            code:
                                '3-11-1',

                            nameJa:
                                'かわらぶき',
                        },
                    ]
                ),

                occupation(
                    '3-12',
                    '左官',
                    [
                        {
                            code:
                                '3-12-1',

                            nameJa:
                                '左官',
                        },
                    ]
                ),

                occupation(
                    '3-13',
                    '配管',
                    [
                        {
                            code:
                                '3-13-1',

                            nameJa:
                                '建築配管',
                        },

                        {
                            code:
                                '3-13-2',

                            nameJa:
                                'プラント配管',
                        },
                    ]
                ),

                occupation(
                    '3-14',
                    '熱絶縁施工',
                    [
                        {
                            code:
                                '3-14-1',

                            nameJa:
                                '保温保冷工事',
                        },
                    ]
                ),

                occupation(
                    '3-15',
                    '内装仕上げ施工',
                    [
                        {
                            code:
                                '3-15-1',

                            nameJa:
                                'プラスチック系床仕上げ工事',
                        },

                        {
                            code:
                                '3-15-2',

                            nameJa:
                                'カーペット系床仕上げ工事',
                        },

                        {
                            code:
                                '3-15-3',

                            nameJa:
                                '鋼製下地工事',
                        },

                        {
                            code:
                                '3-15-4',

                            nameJa:
                                'ボード仕上げ工事',
                        },

                        {
                            code:
                                '3-15-5',

                            nameJa:
                                'カーテン工事',
                        },
                    ]
                ),

                occupation(
                    '3-16',
                    'サッシ施工',
                    [
                        {
                            code:
                                '3-16-1',

                            nameJa:
                                'ビル用サッシ施工',
                        },
                    ]
                ),

                occupation(
                    '3-17',
                    '防水施工',
                    [
                        {
                            code:
                                '3-17-1',

                            nameJa:
                                'シーリング防水工事',
                        },
                    ]
                ),

                occupation(
                    '3-18',
                    'コンクリート圧送施工',
                    [
                        {
                            code:
                                '3-18-1',

                            nameJa:
                                'コンクリート圧送工事',
                        },
                    ]
                ),

                occupation(
                    '3-19',
                    'ウェルポイント施工',
                    [
                        {
                            code:
                                '3-19-1',

                            nameJa:
                                'ウェルポイント工事',
                        },
                    ]
                ),

                occupation(
                    '3-20',
                    '表装',
                    [
                        {
                            code:
                                '3-20-1',

                            nameJa:
                                '壁装',
                        },
                    ]
                ),

                occupation(
                    '3-21',
                    '建設機械施工',
                    [
                        {
                            code:
                                '3-21-1',

                            nameJa:
                                '押土・整地',
                        },

                        {
                            code:
                                '3-21-2',

                            nameJa:
                                '積込み',
                        },

                        {
                            code:
                                '3-21-3',

                            nameJa:
                                '掘削',
                        },

                        {
                            code:
                                '3-21-4',

                            nameJa:
                                '締固め',
                        },
                    ]
                ),

                occupation(
                    '3-22',
                    '築炉',
                    [
                        {
                            code:
                                '3-22-1',

                            nameJa:
                                '築炉',
                        },
                    ]
                ),

                occupation(
                    '3-23',
                    '管路更生',
                    [
                        {
                            code:
                                '3-23-1',

                            nameJa:
                                '管路更生工事作業',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),
            ],
        },

        /*
         * =====================================================
         * 4.
         * 食品製造関係
         *
         * 12職種 / 20作業
         * =====================================================
         */

        {
            id:
                'FOOD_MANUFACTURING',

            nameJa:
                '食品製造関係',

            icon:
                '🍱',

            occupations: [
                occupation(
                    '4-1',
                    '缶詰巻締',
                    [
                        {
                            code:
                                '4-1-1',

                            nameJa:
                                '缶詰巻締',
                        },
                    ]
                ),

                occupation(
                    '4-2',
                    '食鳥処理加工業',
                    [
                        {
                            code:
                                '4-2-1',

                            nameJa:
                                '食鳥処理加工',
                        },
                    ]
                ),

                occupation(
                    '4-3',
                    '加熱性水産加工食品製造業',
                    [
                        {
                            code:
                                '4-3-1',

                            nameJa:
                                '節類製造',
                        },

                        {
                            code:
                                '4-3-2',

                            nameJa:
                                '加熱乾製品製造',
                        },

                        {
                            code:
                                '4-3-3',

                            nameJa:
                                '調味加工品製造',
                        },

                        {
                            code:
                                '4-3-4',

                            nameJa:
                                'くん製品製造',
                        },
                    ]
                ),

                occupation(
                    '4-4',
                    '非加熱性水産加工食品製造業',
                    [
                        {
                            code:
                                '4-4-1',

                            nameJa:
                                '塩蔵品製造',
                        },

                        {
                            code:
                                '4-4-2',

                            nameJa:
                                '乾製品製造',
                        },

                        {
                            code:
                                '4-4-3',

                            nameJa:
                                '発酵食品製造',
                        },

                        {
                            code:
                                '4-4-4',

                            nameJa:
                                '調理加工品製造',
                        },

                        {
                            code:
                                '4-4-5',

                            nameJa:
                                '生食用加工品製造',
                        },
                    ]
                ),

                occupation(
                    '4-5',
                    '水産練り製品製造',
                    [
                        {
                            code:
                                '4-5-1',

                            nameJa:
                                'かまぼこ製品製造',
                        },
                    ]
                ),

                occupation(
                    '4-6',
                    '牛豚食肉処理加工業',
                    [
                        {
                            code:
                                '4-6-1',

                            nameJa:
                                '牛豚部分肉製造',
                        },

                        {
                            code:
                                '4-6-2',

                            nameJa:
                                '牛豚精肉商品製造',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),

                occupation(
                    '4-7',
                    'ハム・ソーセージ・ベーコン製造',
                    [
                        {
                            code:
                                '4-7-1',

                            nameJa:
                                'ハム・ソーセージ・ベーコン製造',
                        },
                    ]
                ),

                occupation(
                    '4-8',
                    'パン製造',
                    [
                        {
                            code:
                                '4-8-1',

                            nameJa:
                                'パン製造',
                        },
                    ]
                ),

                occupation(
                    '4-9',
                    'そう菜製造業',
                    [
                        {
                            code:
                                '4-9-1',

                            nameJa:
                                'そう菜加工',
                        },
                    ]
                ),

                occupation(
                    '4-10',
                    '農産物漬物製造業',
                    [
                        {
                            code:
                                '4-10-1',

                            nameJa:
                                '農産物漬物製造',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),

                occupation(
                    '4-11',
                    '医療・福祉施設給食製造',
                    [
                        {
                            code:
                                '4-11-1',

                            nameJa:
                                '医療・福祉施設給食製造',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),

                occupation(
                    '4-12',
                    '豆腐製造',
                    [
                        {
                            code:
                                '4-12-1',

                            nameJa:
                                '豆腐製造',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),
            ],
        },

        /*
         * =====================================================
         * 5.
         * 繊維・衣服関係
         *
         * 14職種 / 23作業
         * =====================================================
         */

        {
            id:
                'TEXTILES',

            nameJa:
                '繊維・衣服関係',

            icon:
                '🧵',

            occupations: [
                occupation(
                    '5-1',
                    '紡績運転',
                    [
                        {
                            code:
                                '5-1-1',

                            nameJa:
                                '前紡工程',
                        },

                        {
                            code:
                                '5-1-2',

                            nameJa:
                                '精紡工程',
                        },

                        {
                            code:
                                '5-1-3',

                            nameJa:
                                '巻糸工程',
                        },

                        {
                            code:
                                '5-1-4',

                            nameJa:
                                '合ねん糸工程',
                        },
                    ]
                ),

                occupation(
                    '5-2',
                    '織布運転',
                    [
                        {
                            code:
                                '5-2-1',

                            nameJa:
                                '準備工程',
                        },

                        {
                            code:
                                '5-2-2',

                            nameJa:
                                '製織工程',
                        },

                        {
                            code:
                                '5-2-3',

                            nameJa:
                                '仕上工程',
                        },
                    ]
                ),

                occupation(
                    '5-3',
                    '染色',
                    [
                        {
                            code:
                                '5-3-1',

                            nameJa:
                                '糸浸染',
                        },

                        {
                            code:
                                '5-3-2',

                            nameJa:
                                '織物・ニット浸染',
                        },
                    ]
                ),

                occupation(
                    '5-4',
                    'ニット製品製造',
                    [
                        {
                            code:
                                '5-4-1',

                            nameJa:
                                '靴下製造',
                        },

                        {
                            code:
                                '5-4-2',

                            nameJa:
                                '丸編みニット製造',
                        },
                    ]
                ),

                occupation(
                    '5-5',
                    'たて編ニット生地製造',
                    [
                        {
                            code:
                                '5-5-1',

                            nameJa:
                                'たて編ニット生地製造',
                        },
                    ]
                ),

                occupation(
                    '5-6',
                    '婦人子供服製造',
                    [
                        {
                            code:
                                '5-6-1',

                            nameJa:
                                '婦人子供既製服縫製',
                        },
                    ]
                ),

                occupation(
                    '5-7',
                    '紳士服製造',
                    [
                        {
                            code:
                                '5-7-1',

                            nameJa:
                                '紳士既製服製造',
                        },
                    ]
                ),

                occupation(
                    '5-8',
                    '下着類製造',
                    [
                        {
                            code:
                                '5-8-1',

                            nameJa:
                                '下着類製造',
                        },
                    ]
                ),

                occupation(
                    '5-9',
                    '寝具製作',
                    [
                        {
                            code:
                                '5-9-1',

                            nameJa:
                                '寝具製作',
                        },
                    ]
                ),

                occupation(
                    '5-10',
                    'カーペット製造',
                    [
                        {
                            code:
                                '5-10-1',

                            nameJa:
                                '織じゅうたん製造',

                            thirdStageEligible:
                                false,
                        },

                        {
                            code:
                                '5-10-2',

                            nameJa:
                                'タフテッドカーペット製造',

                            thirdStageEligible:
                                false,
                        },

                        {
                            code:
                                '5-10-3',

                            nameJa:
                                'ニードルパンチカーペット製造',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),

                occupation(
                    '5-11',
                    '帆布製品製造',
                    [
                        {
                            code:
                                '5-11-1',

                            nameJa:
                                '帆布製品製造',
                        },
                    ]
                ),

                occupation(
                    '5-12',
                    '布はく縫製',
                    [
                        {
                            code:
                                '5-12-1',

                            nameJa:
                                'ワイシャツ製造',
                        },
                    ]
                ),

                occupation(
                    '5-13',
                    '座席シート縫製',
                    [
                        {
                            code:
                                '5-13-1',

                            nameJa:
                                '自動車シート縫製',
                        },
                    ]
                ),

                occupation(
                    '5-14',
                    'タオル製造',
                    [
                        {
                            code:
                                '5-14-1',

                            nameJa:
                                'タオル縫製',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),
            ],
        },

        /*
         * =====================================================
         * 6.
         * 機械・金属関係
         *
         * 17職種 / 34作業
         * =====================================================
         */

        {
            id:
                'MACHINERY_METAL',

            nameJa:
                '機械・金属関係',

            icon:
                '⚙️',

            occupations: [
                occupation(
                    '6-1',
                    '鋳造',
                    [
                        {
                            code:
                                '6-1-1',

                            nameJa:
                                '鋳鉄鋳物鋳造',
                        },

                        {
                            code:
                                '6-1-2',

                            nameJa:
                                '非鉄金属鋳物鋳造',
                        },
                    ]
                ),

                occupation(
                    '6-2',
                    '鍛造',
                    [
                        {
                            code:
                                '6-2-1',

                            nameJa:
                                'ハンマ型鍛造',
                        },

                        {
                            code:
                                '6-2-2',

                            nameJa:
                                'プレス型鍛造',
                        },
                    ]
                ),

                occupation(
                    '6-3',
                    'ダイカスト',
                    [
                        {
                            code:
                                '6-3-1',

                            nameJa:
                                'ホットチャンバダイカスト',
                        },

                        {
                            code:
                                '6-3-2',

                            nameJa:
                                'コールドチャンバダイカスト',
                        },
                    ]
                ),

                occupation(
                    '6-4',
                    '機械加工',
                    [
                        {
                            code:
                                '6-4-1',

                            nameJa:
                                '普通旋盤',
                        },

                        {
                            code:
                                '6-4-2',

                            nameJa:
                                'フライス盤',
                        },

                        {
                            code:
                                '6-4-3',

                            nameJa:
                                '数値制御旋盤',
                        },

                        {
                            code:
                                '6-4-4',

                            nameJa:
                                'マシニングセンタ',
                        },
                    ]
                ),

                occupation(
                    '6-5',
                    '金属プレス加工',
                    [
                        {
                            code:
                                '6-5-1',

                            nameJa:
                                '金属プレス',
                        },
                    ]
                ),

                occupation(
                    '6-6',
                    '鉄工',
                    [
                        {
                            code:
                                '6-6-1',

                            nameJa:
                                '構造物鉄工',
                        },
                    ]
                ),

                occupation(
                    '6-7',
                    '工場板金',
                    [
                        {
                            code:
                                '6-7-1',

                            nameJa:
                                '機械板金',
                        },
                    ]
                ),

                occupation(
                    '6-8',
                    'めっき',
                    [
                        {
                            code:
                                '6-8-1',

                            nameJa:
                                '電気めっき',
                        },

                        {
                            code:
                                '6-8-2',

                            nameJa:
                                '溶融亜鉛めっき',
                        },
                    ]
                ),

                occupation(
                    '6-9',
                    'アルミニウム陽極酸化処理',
                    [
                        {
                            code:
                                '6-9-1',

                            nameJa:
                                '陽極酸化処理',
                        },
                    ]
                ),

                occupation(
                    '6-10',
                    '仕上げ',
                    [
                        {
                            code:
                                '6-10-1',

                            nameJa:
                                '治工具仕上げ',
                        },

                        {
                            code:
                                '6-10-2',

                            nameJa:
                                '金型仕上げ',
                        },

                        {
                            code:
                                '6-10-3',

                            nameJa:
                                '機械組立仕上げ',
                        },
                    ]
                ),

                occupation(
                    '6-11',
                    '機械検査',
                    [
                        {
                            code:
                                '6-11-1',

                            nameJa:
                                '機械検査',
                        },
                    ]
                ),

                occupation(
                    '6-12',
                    '機械保全',
                    [
                        {
                            code:
                                '6-12-1',

                            nameJa:
                                '機械系保全',
                        },
                    ]
                ),

                occupation(
                    '6-13',
                    '電子機器組立て',
                    [
                        {
                            code:
                                '6-13-1',

                            nameJa:
                                '電子機器組立て',
                        },
                    ]
                ),

                occupation(
                    '6-14',
                    '電気機器組立て',
                    [
                        {
                            code:
                                '6-14-1',

                            nameJa:
                                '回転電機組立て',
                        },

                        {
                            code:
                                '6-14-2',

                            nameJa:
                                '変圧器組立て',
                        },

                        {
                            code:
                                '6-14-3',

                            nameJa:
                                '配電盤・制御盤組立て',
                        },

                        {
                            code:
                                '6-14-4',

                            nameJa:
                                '開閉制御器具組立て',
                        },

                        {
                            code:
                                '6-14-5',

                            nameJa:
                                '回転電機巻線製作',
                        },
                    ]
                ),

                occupation(
                    '6-15',
                    'プリント配線板製造',
                    [
                        {
                            code:
                                '6-15-1',

                            nameJa:
                                'プリント配線板設計',
                        },

                        {
                            code:
                                '6-15-2',

                            nameJa:
                                'プリント配線板製造',
                        },
                    ]
                ),

                occupation(
                    '6-16',
                    'アルミニウム圧延・押出製品製造',
                    [
                        {
                            code:
                                '6-16-1',

                            nameJa:
                                '引抜加工',

                            thirdStageEligible:
                                false,
                        },

                        {
                            code:
                                '6-16-2',

                            nameJa:
                                '仕上げ',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),

                occupation(
                    '6-17',
                    '金属熱処理',
                    [
                        {
                            code:
                                '6-17-1',

                            nameJa:
                                '全体熱処理',
                        },

                        {
                            code:
                                '6-17-2',

                            nameJa:
                                '表面熱処理（浸炭・浸炭窒化・窒化）',
                        },

                        {
                            code:
                                '6-17-3',

                            nameJa:
                                '部分熱処理（高周波熱処理・炎熱処理）',
                        },
                    ]
                ),
            ],
        },

        /*
         * =====================================================
         * 7.
         * その他
         *
         * 23職種 / 42作業
         * =====================================================
         */

        {
            id:
                'OTHER',

            nameJa:
                'その他',

            icon:
                '🧰',

            occupations: [
                occupation(
                    '7-1',
                    '家具製作',
                    [
                        {
                            code:
                                '7-1-1',

                            nameJa:
                                '家具手加工',
                        },
                    ]
                ),

                occupation(
                    '7-2',
                    '印刷',
                    [
                        {
                            code:
                                '7-2-1',

                            nameJa:
                                'オフセット印刷',
                        },

                        {
                            code:
                                '7-2-2',

                            nameJa:
                                'グラビア印刷',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),

                occupation(
                    '7-3',
                    '製本',
                    [
                        {
                            code:
                                '7-3-1',

                            nameJa:
                                '製本',
                        },
                    ]
                ),

                occupation(
                    '7-4',
                    'プラスチック成形',
                    [
                        {
                            code:
                                '7-4-1',

                            nameJa:
                                '圧縮成形',
                        },

                        {
                            code:
                                '7-4-2',

                            nameJa:
                                '射出成形',
                        },

                        {
                            code:
                                '7-4-3',

                            nameJa:
                                'インフレーション成形',
                        },

                        {
                            code:
                                '7-4-4',

                            nameJa:
                                'ブロー成形',
                        },
                    ]
                ),

                occupation(
                    '7-5',
                    '強化プラスチック成形',
                    [
                        {
                            code:
                                '7-5-1',

                            nameJa:
                                '手積み積層成形',
                        },
                    ]
                ),

                occupation(
                    '7-6',
                    '塗装',
                    [
                        {
                            code:
                                '7-6-1',

                            nameJa:
                                '建築塗装',
                        },

                        {
                            code:
                                '7-6-2',

                            nameJa:
                                '金属塗装',
                        },

                        {
                            code:
                                '7-6-3',

                            nameJa:
                                '鋼橋塗装',
                        },

                        {
                            code:
                                '7-6-4',

                            nameJa:
                                '噴霧塗装',
                        },
                    ]
                ),

                occupation(
                    '7-7',
                    '溶接',
                    [
                        {
                            code:
                                '7-7-1',

                            nameJa:
                                '手溶接',
                        },

                        {
                            code:
                                '7-7-2',

                            nameJa:
                                '半自動溶接',
                        },
                    ]
                ),

                occupation(
                    '7-8',
                    '工業包装',
                    [
                        {
                            code:
                                '7-8-1',

                            nameJa:
                                '工業包装',
                        },
                    ]
                ),

                occupation(
                    '7-9',
                    '紙器・段ボール箱製造',
                    [
                        {
                            code:
                                '7-9-1',

                            nameJa:
                                '印刷箱打抜き',
                        },

                        {
                            code:
                                '7-9-2',

                            nameJa:
                                '印刷箱製箱',
                        },

                        {
                            code:
                                '7-9-3',

                            nameJa:
                                '貼箱製造',
                        },

                        {
                            code:
                                '7-9-4',

                            nameJa:
                                '段ボール箱製造',
                        },
                    ]
                ),

                occupation(
                    '7-10',
                    '陶磁器工業製品製造',
                    [
                        {
                            code:
                                '7-10-1',

                            nameJa:
                                '機械ろくろ成形',
                        },

                        {
                            code:
                                '7-10-2',

                            nameJa:
                                '圧力鋳込み成形',
                        },

                        {
                            code:
                                '7-10-3',

                            nameJa:
                                'パッド印刷',
                        },

                        {
                            code:
                                '7-10-4',

                            nameJa:
                                'タイル製造',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),

                occupation(
                    '7-11',
                    '自動車整備',
                    [
                        {
                            code:
                                '7-11-1',

                            nameJa:
                                '自動車整備',
                        },
                    ]
                ),

                occupation(
                    '7-12',
                    'ビルクリーニング',
                    [
                        {
                            code:
                                '7-12-1',

                            nameJa:
                                'ビルクリーニング',
                        },
                    ]
                ),

                occupation(
                    '7-13',
                    '介護',
                    [
                        {
                            code:
                                '7-13-1',

                            nameJa:
                                '介護',
                        },
                    ]
                ),

                occupation(
                    '7-14',
                    'クリーニング',
                    [
                        {
                            code:
                                '7-14-1',

                            nameJa:
                                'リネンサプライ仕上げ',

                            thirdStageEligible:
                                false,
                        },

                        {
                            code:
                                '7-14-2',

                            nameJa:
                                '一般家庭用クリーニング',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),

                occupation(
                    '7-15',
                    'コンクリート製品製造',
                    [
                        {
                            code:
                                '7-15-1',

                            nameJa:
                                'コンクリート製品製造',
                        },
                    ]
                ),

                occupation(
                    '7-16',
                    '宿泊',
                    [
                        {
                            code:
                                '7-16-1',

                            nameJa:
                                '接客・衛生管理',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),

                occupation(
                    '7-17',
                    'RPF製造',
                    [
                        {
                            code:
                                '7-17-1',

                            nameJa:
                                'RPF製造',
                        },
                    ]
                ),

                occupation(
                    '7-18',
                    '鉄道施設保守整備',
                    [
                        {
                            code:
                                '7-18-1',

                            nameJa:
                                '軌道保守整備',
                        },
                    ]
                ),

                occupation(
                    '7-19',
                    'ゴム製品製造',
                    [
                        {
                            code:
                                '7-19-1',

                            nameJa:
                                '成形加工',

                            thirdStageEligible:
                                false,
                        },

                        {
                            code:
                                '7-19-2',

                            nameJa:
                                '押出し加工',

                            thirdStageEligible:
                                false,
                        },

                        {
                            code:
                                '7-19-3',

                            nameJa:
                                '混練り圧延加工',

                            thirdStageEligible:
                                false,
                        },

                        {
                            code:
                                '7-19-4',

                            nameJa:
                                '複合積層加工',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),

                occupation(
                    '7-20',
                    '鉄道車両整備',
                    [
                        {
                            code:
                                '7-20-1',

                            nameJa:
                                '走行装置検修・解ぎ装',
                        },

                        {
                            code:
                                '7-20-2',

                            nameJa:
                                '空気装置検修・解ぎ装',
                        },
                    ]
                ),

                occupation(
                    '7-21',
                    '木材加工',
                    [
                        {
                            code:
                                '7-21-1',

                            nameJa:
                                '機械製材',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),

                occupation(
                    '7-22',
                    'かばん製造',
                    [
                        {
                            code:
                                '7-22-1',

                            nameJa:
                                'かばん製造',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),

                occupation(
                    '7-23',
                    '化粧品製造',
                    [
                        {
                            code:
                                '7-23-1',

                            nameJa:
                                '仕上工程管理',
                        },
                    ]
                ),
            ],
        },

        /*
         * =====================================================
         * 99.
         * 主務大臣が告示で定める職種及び作業
         *
         * 2職種 / 4作業
         * =====================================================
         */

        {
            id:
                'MINISTERIAL_DESIGNATED',

            nameJa:
                '主務大臣が告示で定める職種及び作業',

            icon:
                '🛫',

            occupations: [
                occupation(
                    '99-1',
                    '空港グランドハンドリング',
                    [
                        {
                            code:
                                '99-1-1',

                            nameJa:
                                '航空機地上支援',
                        },

                        {
                            code:
                                '99-1-2',

                            nameJa:
                                '航空貨物取扱',
                        },

                        {
                            code:
                                '99-1-3',

                            nameJa:
                                '客室清掃',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),

                occupation(
                    '99-2',
                    'ボイラーメンテナンス',
                    [
                        {
                            code:
                                '99-2-1',

                            nameJa:
                                'ボイラーメンテナンス',

                            thirdStageEligible:
                                false,
                        },
                    ]
                ),
            ],
        },
    ];

/*
 * =========================================================
 * TRANSLATION
 * =========================================================
 */

function translateByKey(
    key: string,
    language:
        AppLanguageCode,
    japaneseFallback:
        string
): string {
    /*
     * Japanese:
     * dùng trực tiếp official Japanese.
     */

    if (
        language ===
        'ja'
    ) {
        return japaneseFallback;
    }

    /*
     * Language của người dùng.
     */

    const selectedPack =
        technicalInternJobTranslations[
        language
        ];

    const translated =
        selectedPack?.[
        key
        ];

    if (
        translated
    ) {
        return translated;
    }

    /*
     * Nếu pack hiện tại thiếu key,
     * thử English.
     */

    const english =
        technicalInternJobTranslations
            .en?.[
        key
        ];

    if (
        english
    ) {
        return english;
    }

    /*
     * Cuối cùng fallback Japanese.
     *
     * UI không crash dù translation
     * chưa hoàn thành.
     */

    return japaneseFallback;
}

export function getLocalizedGroupName(
    group:
        TechnicalInternJobGroup,
    language:
        AppLanguageCode
): string {
    return translateByKey(
        group.id,
        language,
        group.nameJa
    );
}

export function getLocalizedOccupationName(
    occupation:
        TechnicalInternOccupation,
    language:
        AppLanguageCode
): string {
    return translateByKey(
        occupation.code,
        language,
        occupation.nameJa
    );
}

export function getLocalizedOperationName(
    operation:
        TechnicalInternOperation,
    language:
        AppLanguageCode
): string {
    return translateByKey(
        operation.code,
        language,
        operation.nameJa
    );
}

/*
 * =========================================================
 * FIND HELPERS
 * =========================================================
 */

export function findTechnicalInternGroup(
    groupId:
        string
):
    TechnicalInternJobGroup |
    undefined {
    return technicalInternJobGroups.find(
        (group) =>
            group.id ===
            groupId
    );
}

export function findTechnicalInternOccupation(
    occupationCode:
        string
):
    TechnicalInternOccupation |
    undefined {
    for (
        const group of
        technicalInternJobGroups
    ) {
        const found =
            group.occupations.find(
                (item) =>
                    item.code ===
                    occupationCode
            );

        if (
            found
        ) {
            return found;
        }
    }

    return undefined;
}

export function findTechnicalInternOperation(
    operationCode:
        string
):
    TechnicalInternOperation |
    undefined {
    for (
        const group of
        technicalInternJobGroups
    ) {
        for (
            const occupationItem of
            group.occupations
        ) {
            const found =
                occupationItem.operations.find(
                    (item) =>
                        item.code ===
                        operationCode
                );

            if (
                found
            ) {
                return found;
            }
        }
    }

    return undefined;
}

/*
 * =========================================================
 * GET PARENT STRUCTURE FROM OPERATION
 *
 * Sau này cực kỳ hữu ích khi chỉ lưu:
 *
 * jobOperationId = "3-7-1"
 *
 * nhưng cần truy ngược:
 *
 * 建設
 * → 鉄筋施工
 * → 鉄筋組立て
 * =========================================================
 */

export type TechnicalInternJobPath = {
    group:
    TechnicalInternJobGroup;

    occupation:
    TechnicalInternOccupation;

    operation:
    TechnicalInternOperation;
};

export function findTechnicalInternJobPath(
    operationCode:
        string
):
    TechnicalInternJobPath |
    undefined {
    for (
        const group of
        technicalInternJobGroups
    ) {
        for (
            const occupationItem of
            group.occupations
        ) {
            const operationItem =
                occupationItem.operations.find(
                    (item) =>
                        item.code ===
                        operationCode
                );

            if (
                operationItem
            ) {
                return {
                    group,

                    occupation:
                        occupationItem,

                    operation:
                        operationItem,
                };
            }
        }
    }

    return undefined;
}

/*
 * =========================================================
 * FLATTENED DATA
 *
 * Dùng cho:
 *
 * - Search
 * - Admin
 * - Analytics
 * - Work dialogue routing
 * - Mission generation
 * =========================================================
 */

export type TechnicalInternJobFlatItem = {
    groupId:
    string;

    groupJa:
    string;

    occupationCode:
    string;

    occupationJa:
    string;

    operationCode:
    string;

    operationJa:
    string;

    thirdStageEligible:
    boolean;
};

export function getTechnicalInternJobsFlat():
    TechnicalInternJobFlatItem[] {
    return technicalInternJobGroups.flatMap(
        (group) =>
            group.occupations.flatMap(
                (
                    occupationItem
                ) =>
                    occupationItem.operations.map(
                        (
                            operationItem
                        ) => ({
                            groupId:
                                group.id,

                            groupJa:
                                group.nameJa,

                            occupationCode:
                                occupationItem.code,

                            occupationJa:
                                occupationItem.nameJa,

                            operationCode:
                                operationItem.code,

                            operationJa:
                                operationItem.nameJa,

                            thirdStageEligible:
                                operationItem.thirdStageEligible,
                        })
                    )
            )
    );
}

/*
 * =========================================================
 * SEARCH
 *
 * Cho phép tìm bằng:
 *
 * - Japanese
 * - translated language
 * - code
 *
 * Ví dụ:
 * "cốt thép"
 * "鉄筋"
 * "3-7"
 * =========================================================
 */

export function searchTechnicalInternJobs(
    query:
        string,

    language:
        AppLanguageCode
):
    TechnicalInternJobFlatItem[] {
    const normalizedQuery =
        query
            .trim()
            .toLowerCase();

    if (
        !normalizedQuery
    ) {
        return [];
    }

    return getTechnicalInternJobsFlat().filter(
        (
            item
        ) => {
            const occupation =
                findTechnicalInternOccupation(
                    item.occupationCode
                );

            const operationItem =
                findTechnicalInternOperation(
                    item.operationCode
                );

            const occupationTranslated =
                occupation
                    ? getLocalizedOccupationName(
                        occupation,
                        language
                    )
                    : '';

            const operationTranslated =
                operationItem
                    ? getLocalizedOperationName(
                        operationItem,
                        language
                    )
                    : '';

            const searchText = [
                item.groupJa,

                item.occupationJa,

                item.operationJa,

                item.occupationCode,

                item.operationCode,

                occupationTranslated,

                operationTranslated,
            ]
                .join(
                    ' '
                )
                .toLowerCase();

            return searchText.includes(
                normalizedQuery
            );
        }
    );
}

/*
 * =========================================================
 * VALIDATION
 *
 * Phát hiện:
 *
 * - thiếu occupation
 * - thiếu operation
 * - duplicate code
 * - sai tổng 96 / 174
 * =========================================================
 */

export type TechnicalInternValidationResult = {
    valid:
    boolean;

    version:
    string;

    occupationCount:
    number;

    operationCount:
    number;

    duplicateOccupationCodes:
    string[];

    duplicateOperationCodes:
    string[];

    expected: {
        occupations:
        number;

        operations:
        number;
    };
};

export function validateTechnicalInternJobData():
    TechnicalInternValidationResult {
    let occupationCount =
        0;

    let operationCount =
        0;

    const occupationCodes:
        string[] = [];

    const operationCodes:
        string[] = [];

    for (
        const group of
        technicalInternJobGroups
    ) {
        occupationCount +=
            group.occupations.length;

        for (
            const occupationItem of
            group.occupations
        ) {
            occupationCodes.push(
                occupationItem.code
            );

            operationCount +=
                occupationItem.operations.length;

            for (
                const operationItem of
                occupationItem.operations
            ) {
                operationCodes.push(
                    operationItem.code
                );
            }
        }
    }

    const duplicateOccupationCodes =
        findDuplicates(
            occupationCodes
        );

    const duplicateOperationCodes =
        findDuplicates(
            operationCodes
        );

    const countValid =
        occupationCount ===
        TECHNICAL_INTERN_JOB_OFFICIAL_COUNT.occupations &&
        operationCount ===
        TECHNICAL_INTERN_JOB_OFFICIAL_COUNT.operations;

    const duplicateValid =
        duplicateOccupationCodes.length ===
        0 &&
        duplicateOperationCodes.length ===
        0;

    return {
        valid:
            countValid &&
            duplicateValid,

        version:
            TECHNICAL_INTERN_JOB_DATA_VERSION,

        occupationCount,

        operationCount,

        duplicateOccupationCodes,

        duplicateOperationCodes,

        expected:
            TECHNICAL_INTERN_JOB_OFFICIAL_COUNT,
    };
}

function findDuplicates(
    values:
        string[]
):
    string[] {
    const seen =
        new Set<string>();

    const duplicates =
        new Set<string>();

    for (
        const value of
        values
    ) {
        if (
            seen.has(
                value
            )
        ) {
            duplicates.add(
                value
            );
        } else {
            seen.add(
                value
            );
        }
    }

    return [
        ...duplicates,
    ];
}

/*
 * =========================================================
 * TRANSLATION VALIDATION
 *
 * Kiểm tra một language pack đã dịch đủ chưa.
 *
 * Ví dụ:
 *
 * validateTechnicalInternTranslations('vi')
 *
 * Nếu missingCount = 0:
 * tiếng Việt đã dịch đủ toàn bộ.
 * =========================================================
 */

export type TechnicalInternTranslationValidation = {
    language:
    AppLanguageCode;

    totalKeys:
    number;

    translatedCount:
    number;

    missingCount:
    number;

    missingKeys:
    string[];

    complete:
    boolean;
};

export function validateTechnicalInternTranslations(
    language:
        AppLanguageCode
):
    TechnicalInternTranslationValidation {
    /*
     * Japanese là source language,
     * mặc định luôn complete.
     */

    if (
        language ===
        'ja'
    ) {
        const total =
            getAllTechnicalInternTranslationKeys()
                .length;

        return {
            language,

            totalKeys:
                total,

            translatedCount:
                total,

            missingCount:
                0,

            missingKeys:
                [],

            complete:
                true,
        };
    }

    const pack =
        technicalInternJobTranslations[
        language
        ] ??
        {};

    const keys =
        getAllTechnicalInternTranslationKeys();

    const missingKeys =
        keys.filter(
            (key) =>
                !pack[
                key
                ]
        );

    return {
        language,

        totalKeys:
            keys.length,

        translatedCount:
            keys.length -
            missingKeys.length,

        missingCount:
            missingKeys.length,

        missingKeys,

        complete:
            missingKeys.length ===
            0,
    };
}

/*
 * =========================================================
 * ALL TRANSLATION KEYS
 *
 * Group + occupation + operation
 * =========================================================
 */

export function getAllTechnicalInternTranslationKeys():
    string[] {
    const keys:
        string[] = [];

    for (
        const group of
        technicalInternJobGroups
    ) {
        keys.push(
            group.id
        );

        for (
            const occupationItem of
            group.occupations
        ) {
            keys.push(
                occupationItem.code
            );

            for (
                const operationItem of
                occupationItem.operations
            ) {
                keys.push(
                    operationItem.code
                );
            }
        }
    }

    return keys;
}
if (__DEV__) {
    console.log(
        'JOB DATA:',
        validateTechnicalInternJobData()
    );

    console.log(
        'VI TRANSLATION:',
        validateTechnicalInternTranslations(
            'vi'
        )
    );
}