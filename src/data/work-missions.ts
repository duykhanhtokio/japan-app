import type {
    AppLanguageCode,
} from '@/i18n/languages';

import {
    getWorkDialogueRoute,
    type WorkDialogueRouteId,
} from '@/data/work-dialogue-routing';

export type WorkMission = {
    id: string;

    routeId:
    WorkDialogueRouteId;

    titleJa: string;

    localizedTitle: string;

    descriptionJa: string;

    localizedDescription: string;

    rewardXp: number;

    rewardCoins: number;

    target: number;

    progress: number;

    completed: boolean;

    dialoguePoolId: string;
};

type WorkMissionTemplate = {
    titleJa: string;

    descriptionJa: string;

    translations: {
        vi?: {
            title: string;

            description:
            string;
        };

        en?: {
            title: string;

            description:
            string;
        };

        id?: {
            title: string;

            description:
            string;
        };

        'zh-CN'?: {
            title: string;

            description:
            string;
        };

        'zh-TW'?: {
            title: string;

            description:
            string;
        };

        hi?: {
            title: string;

            description:
            string;
        };
    };
};

const templates:
    Partial<
        Record<
            WorkDialogueRouteId,
            WorkMissionTemplate
        >
    > = {
    AGRI_CROP: {
        titleJa:
            '今日収穫する作物を確認する',

        descriptionJa:
            '担当者に今日収穫する作物と作業場所を確認しましょう。',

        translations: {
            vi: {
                title:
                    'Xác nhận cây trồng cần thu hoạch hôm nay',

                description:
                    'Hỏi người phụ trách loại cây cần thu hoạch và khu vực làm việc hôm nay.',
            },

            en: {
                title:
                    'Confirm today’s crops to harvest',

                description:
                    'Ask the supervisor which crops and area you will work on today.',
            },

            id: {
                title:
                    'Konfirmasi tanaman yang dipanen hari ini',

                description:
                    'Tanyakan kepada penanggung jawab tanaman dan area kerja hari ini.',
            },

            'zh-CN': {
                title:
                    '确认今天要收获的作物',

                description:
                    '向负责人确认今天要收获的作物和工作区域。',
            },

            'zh-TW': {
                title:
                    '確認今天要收穫的作物',

                description:
                    '向負責人確認今天要收穫的作物及工作區域。',
            },

            hi: {
                title:
                    'आज काटी जाने वाली फसल की पुष्टि करें',

                description:
                    'प्रभारी से आज की फसल और कार्य क्षेत्र की पुष्टि करें।',
            },
        },
    },

    AGRI_LIVESTOCK: {
        titleJa:
            '今日の飼育作業を確認する',

        descriptionJa:
            '餌やり、清掃、健康確認など今日の担当作業を確認しましょう。',

        translations: {
            vi: {
                title:
                    'Xác nhận công việc chăn nuôi hôm nay',

                description:
                    'Xác nhận việc cho ăn, vệ sinh và kiểm tra tình trạng vật nuôi.',
            },
        },
    },

    CONSTRUCTION_REBAR: {
        titleJa:
            '今日の鉄筋作業を確認する',

        descriptionJa:
            '現場で組み立てる鉄筋の位置と作業手順を確認しましょう。',

        translations: {
            vi: {
                title:
                    'Xác nhận công việc cốt thép hôm nay',

                description:
                    'Hỏi vị trí cần lắp cốt thép và trình tự công việc tại công trường.',
            },

            en: {
                title:
                    'Confirm today’s reinforcing-bar work',

                description:
                    'Confirm the location and procedure for today’s rebar assembly.',
            },

            id: {
                title:
                    'Konfirmasi pekerjaan tulangan hari ini',

                description:
                    'Konfirmasi lokasi dan urutan pekerjaan perakitan tulangan.',
            },

            'zh-CN': {
                title:
                    '确认今天的钢筋作业',

                description:
                    '确认钢筋组装的位置和作业步骤。',
            },
        },
    },

    CONSTRUCTION_FORMWORK: {
        titleJa:
            '型枠の作業範囲を確認する',

        descriptionJa:
            '今日施工する型枠の場所と作業内容を確認しましょう。',

        translations: {
            vi: {
                title:
                    'Xác nhận phạm vi thi công cốp pha',

                description:
                    'Hỏi vị trí và nội dung thi công cốp pha trong ngày.',
            },
        },
    },

    CONSTRUCTION_SCAFFOLD: {
        titleJa:
            '足場作業の安全確認をする',

        descriptionJa:
            '作業場所、必要な保護具、安全手順を確認しましょう。',

        translations: {
            vi: {
                title:
                    'Xác nhận an toàn khi làm giàn giáo',

                description:
                    'Xác nhận vị trí làm việc, đồ bảo hộ và quy trình an toàn.',
            },
        },
    },

    CARE: {
        titleJa:
            '利用者の今日の状態を確認する',

        descriptionJa:
            '申し送りを聞き、利用者の体調と必要な介助を確認しましょう。',

        translations: {
            vi: {
                title:
                    'Xác nhận tình trạng của người được chăm sóc',

                description:
                    'Nghe bàn giao và xác nhận tình trạng sức khỏe cùng nội dung hỗ trợ cần thiết.',
            },
        },
    },

    HOTEL: {
        titleJa:
            '今日の担当業務を確認する',

        descriptionJa:
            'チェックイン、客室、清掃など今日の担当を確認しましょう。',

        translations: {
            vi: {
                title:
                    'Xác nhận nhiệm vụ tại khách sạn hôm nay',

                description:
                    'Xác nhận công việc check-in, phòng khách hoặc vệ sinh được giao.',
            },
        },
    },

    FOOD_PROCESSING: {
        titleJa:
            '今日の製造ラインを確認する',

        descriptionJa:
            '担当する製品、工程、衛生ルールを確認しましょう。',

        translations: {
            vi: {
                title:
                    'Xác nhận dây chuyền sản xuất hôm nay',

                description:
                    'Xác nhận sản phẩm, công đoạn và quy định vệ sinh cần thực hiện.',
            },
        },
    },

    MACHINERY: {
        titleJa:
            '今日使用する機械を確認する',

        descriptionJa:
            '担当機械、加工内容、安全確認事項を確認しましょう。',

        translations: {
            vi: {
                title:
                    'Xác nhận máy móc sử dụng hôm nay',

                description:
                    'Xác nhận máy phụ trách, nội dung gia công và các điểm an toàn.',
            },
        },
    },

    AIRPORT: {
        titleJa:
            '今日のフライト担当を確認する',

        descriptionJa:
            '担当便、作業内容、安全確認事項を確認しましょう。',

        translations: {
            vi: {
                title:
                    'Xác nhận chuyến bay phụ trách hôm nay',

                description:
                    'Xác nhận chuyến bay, nội dung công việc và các yêu cầu an toàn.',
            },
        },
    },
};

const generic:
    WorkMissionTemplate = {
    titleJa:
        '今日の作業内容を確認する',

    descriptionJa:
        '上司や担当者に今日の仕事内容を確認しましょう。',

    translations: {
        vi: {
            title:
                'Xác nhận công việc hôm nay',

            description:
                'Hỏi cấp trên hoặc người phụ trách về nội dung công việc hôm nay.',
        },

        en: {
            title:
                'Confirm today’s work',

            description:
                'Ask your supervisor about your duties for today.',
        },

        id: {
            title:
                'Konfirmasi pekerjaan hari ini',

            description:
                'Tanyakan kepada atasan mengenai pekerjaan Anda hari ini.',
        },

        'zh-CN': {
            title:
                '确认今天的工作内容',

            description:
                '向上司或负责人确认今天的工作内容。',
        },

        'zh-TW': {
            title:
                '確認今天的工作內容',

            description:
                '向主管或負責人確認今天的工作內容。',
        },

        hi: {
            title:
                'आज के काम की पुष्टि करें',

            description:
                'अपने पर्यवेक्षक से आज के काम की पुष्टि करें।',
        },
    },
};

function getLocalizedTemplate(
    template:
        WorkMissionTemplate,

    language:
        AppLanguageCode
) {
    if (
        language ===
        'ja'
    ) {
        return {
            title:
                template.titleJa,

            description:
                template.descriptionJa,
        };
    }

    const translation =
        template.translations[
        language as keyof typeof template.translations
        ];

    const english =
        template.translations.en;

    return {
        title:
            translation?.title ??
            english?.title ??
            template.titleJa,

        description:
            translation?.description ??
            english?.description ??
            template.descriptionJa,
    };
}

export function getDailyWorkMission(
    operationCode:
        string,

    language:
        AppLanguageCode
): WorkMission {
    const route =
        getWorkDialogueRoute(
            operationCode
        );

    const template =
        templates[
        route.id
        ] ??
        generic;

    const localized =
        getLocalizedTemplate(
            template,
            language
        );

    return {
        id:
            `DAILY_${operationCode}`,

        routeId:
            route.id,

        titleJa:
            template.titleJa,

        localizedTitle:
            localized.title,

        descriptionJa:
            template.descriptionJa,

        localizedDescription:
            localized.description,

        rewardXp:
            50,

        rewardCoins:
            30,

        target:
            1,

        progress:
            0,

        completed:
            false,

        dialoguePoolId:
            route.poolId,
    };
}