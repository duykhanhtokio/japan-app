import type { CourseModule } from '@/types/module';

export const modules: CourseModule[] = [
    {
        id: 'FOOD_BASIC',
        industryId: 'FOOD_SERVICE',

        titleJa: '基礎',
        titleVi: 'Cơ bản',

        descriptionJa:
            '外食業で働くための基本的な日本語を学びます。',

        descriptionVi:
            'Học tiếng Nhật cơ bản cần thiết khi làm việc trong ngành dịch vụ ăn uống.',

        order: 1,

        icon: '📘',
    },

    {
        id: 'FOOD_CUSTOMER_SERVICE',
        industryId: 'FOOD_SERVICE',

        titleJa: '接客',
        titleVi: 'Phục vụ khách hàng',

        descriptionJa:
            'お客様への基本的な接客表現を学びます。',

        descriptionVi:
            'Học những cách nói cơ bản khi phục vụ khách hàng.',

        order: 2,

        icon: '🙇',
    },

    {
        id: 'FOOD_ORDER',
        industryId: 'FOOD_SERVICE',

        titleJa: '注文',
        titleVi: 'Nhận và gọi món',

        descriptionJa:
            '注文を聞いたり確認したりする日本語を学びます。',

        descriptionVi:
            'Học tiếng Nhật dùng khi nhận và xác nhận món.',

        order: 3,

        icon: '📝',
    },

    {
        id: 'FOOD_KITCHEN',
        industryId: 'FOOD_SERVICE',

        titleJa: '厨房',
        titleVi: 'Nhà bếp',

        descriptionJa:
            '厨房で使う日本語を学びます。',

        descriptionVi:
            'Học tiếng Nhật sử dụng trong khu vực bếp.',

        order: 4,

        icon: '🍳',
    },

    {
        id: 'FOOD_HYGIENE',
        industryId: 'FOOD_SERVICE',

        titleJa: '衛生',
        titleVi: 'Vệ sinh',

        descriptionJa:
            '食品衛生に関する日本語を学びます。',

        descriptionVi:
            'Học tiếng Nhật liên quan đến vệ sinh thực phẩm.',

        order: 5,

        icon: '🧼',
    },

    {
        id: 'FOOD_SAFETY',
        industryId: 'FOOD_SERVICE',

        titleJa: '安全',
        titleVi: 'An toàn',

        descriptionJa:
            '職場の安全に関する日本語を学びます。',

        descriptionVi:
            'Học tiếng Nhật liên quan đến an toàn tại nơi làm việc.',

        order: 6,

        icon: '⚠️',
    },
];