import type { Lesson } from '@/types/lesson';

export const lessons: Lesson[] = [
    {
        id: 'FOOD_BASIC_001',

        moduleId: 'FOOD_BASIC',

        titleJa: '職場のあいさつ',
        titleVi: 'Chào hỏi tại nơi làm việc',

        descriptionJa:
            '仕事を始めるときの基本的なあいさつを学びます。',

        descriptionVi:
            'Học các câu chào hỏi cơ bản khi bắt đầu làm việc.',

        type: 'dialogue',

        order: 1,

        estimatedMinutes: 10,
    },

    {
        id: 'FOOD_SERVICE_001',

        moduleId: 'FOOD_CUSTOMER_SERVICE',

        titleJa: 'いらっしゃいませ',
        titleVi: 'Chào đón khách',

        descriptionJa:
            'お客様を迎えるときの表現を学びます。',

        descriptionVi:
            'Học cách chào đón khách hàng.',

        type: 'dialogue',

        order: 1,

        estimatedMinutes: 10,
    },

    {
        id: 'FOOD_ORDER_001',

        moduleId: 'FOOD_ORDER',

        titleJa: '注文を聞く',
        titleVi: 'Hỏi khách gọi món',

        descriptionJa:
            'お客様の注文を聞く表現を学びます。',

        descriptionVi:
            'Học cách hỏi và nghe khách gọi món.',

        type: 'dialogue',

        order: 1,

        estimatedMinutes: 12,

        objectiveJa:
            'お客様に注文を聞き、簡単な注文内容を理解できるようになります。',

        objectiveVi:
            'Có thể hỏi khách gọi món và hiểu được nội dung gọi món cơ bản.',

        vocabularyIds: [
            3,
        ],

        expressions: [
            {
                id: 'EXP_ORDER_001',

                expression: 'ご注文はお決まりですか。',

                meaningVi:
                    'Quý khách đã chọn món xong chưa?',

                exampleJa:
                    'ご注文はお決まりですか。',

                exampleVi:
                    'Quý khách đã chọn món xong chưa?',
            },

            {
                id: 'EXP_ORDER_002',

                expression: '〜をお願いします。',

                meaningVi:
                    'Cho tôi / Tôi xin ~.',

                exampleJa:
                    'コーヒーをお願いします。',

                exampleVi:
                    'Cho tôi cà phê.',
            },
        ],

        dialogue: [
            {
                id: 'LINE_001',

                speakerJa: '店員',
                speakerVi: 'Nhân viên',

                textJa:
                    'ご注文はお決まりですか。',

                textVi:
                    'Quý khách đã chọn món xong chưa?',
            },

            {
                id: 'LINE_002',

                speakerJa: 'お客様',
                speakerVi: 'Khách hàng',

                textJa:
                    'はい、コーヒーをお願いします。',

                textVi:
                    'Vâng, cho tôi cà phê.',
            },

            {
                id: 'LINE_003',

                speakerJa: '店員',
                speakerVi: 'Nhân viên',

                textJa:
                    'かしこまりました。',

                textVi:
                    'Vâng, tôi đã rõ.',
            },
        ],
    },

    {
        id: 'FOOD_ORDER_002',

        moduleId: 'FOOD_ORDER',

        titleJa: '注文を確認する',
        titleVi: 'Xác nhận món',

        descriptionJa:
            '注文内容を確認する日本語を学びます。',

        descriptionVi:
            'Học cách xác nhận lại nội dung gọi món.',

        type: 'simulation',

        order: 2,

        estimatedMinutes: 15,
    },

    {
        id: 'FOOD_HYGIENE_001',

        moduleId: 'FOOD_HYGIENE',

        titleJa: '手を洗ってください',
        titleVi: 'Hãy rửa tay',

        descriptionJa:
            '衛生管理の基本表現を学びます。',

        descriptionVi:
            'Học những mẫu câu cơ bản về quản lý vệ sinh.',

        type: 'dialogue',

        order: 1,

        estimatedMinutes: 10,
    },
];