import type {
    ConversationLog,
} from '@/types/conversation-log';

export const conversationLogs: ConversationLog[] = [
    {
        id: 'LOG_001',

        completedAt:
            '2026-08-20T10:00:00.000Z',

        category: 'life',

        prefectureId: 'TOKYO',

        prefectureJa: '東京都',

        cityId: 'SHIBUYA',

        cityJa: '渋谷',

        locationId:
            'SHIBUYA_CAFE',

        locationJa: 'カフェ',

        missionId:
            'CAFE_ORDER_001',

        titleJa:
            'カフェで注文する',

        titleVi:
            'Gọi món tại quán café',

        score: 82,

        accuracy: 85,

        fluency: 76,

        pronunciation: 80,

        listening: 87,

        mastery: 'review',

        favorite: false,

        lines: [
            {
                id: 'L1',

                speaker: 'npc',

                speakerNameJa:
                    '佐藤',

                textJa:
                    'いらっしゃいませ。ご注文はお決まりですか？',

                textVi:
                    'Chào mừng quý khách. Quý khách đã chọn món chưa?',
            },

            {
                id: 'L2',

                speaker: 'player',

                speakerNameJa:
                    'あなた',

                textJa:
                    'コーヒーください。',

                userTranscript:
                    'コーヒーください。',

                recommendedAnswer:
                    'コーヒーを一つお願いします。',

                score: 72,
            },
        ],
    },

    {
        id: 'LOG_002',

        completedAt:
            '2026-08-19T11:30:00.000Z',

        category: 'life',

        prefectureId: 'TOKYO',

        prefectureJa: '東京都',

        cityId: 'SHIBUYA',

        cityJa: '渋谷',

        locationId:
            'SHIBUYA_RESTAURANT',

        locationJa:
            'レストラン',

        missionId:
            'RESTAURANT_001',

        titleJa:
            '席をお願いする',

        titleVi:
            'Xin chỗ ngồi trong nhà hàng',

        score: 91,

        accuracy: 93,

        fluency: 88,

        pronunciation: 90,

        listening: 94,

        mastery:
            'mastered',

        favorite: true,

        lines: [],
    },

    {
        id: 'LOG_003',

        completedAt:
            '2026-08-18T08:15:00.000Z',

        category: 'work',

        prefectureId: 'TOKYO',

        prefectureJa: '東京都',

        missionId:
            'WORK_AGRI_001',

        titleJa:
            '今日の作業を確認する',

        titleVi:
            'Xác nhận công việc hôm nay',

        score: 68,

        accuracy: 70,

        fluency: 62,

        pronunciation: 69,

        listening: 71,

        mastery: 'review',

        favorite: false,

        lines: [],
    },
];