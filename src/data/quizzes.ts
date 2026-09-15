import type { QuizQuestion } from '@/types/quiz';

export const quizzes: QuizQuestion[] = [
    {
        id: 'QUIZ_FOOD_ORDER_001_01',

        lessonId: 'FOOD_ORDER_001',

        questionJa:
            '「ご注文はお決まりですか。」の意味はどれですか。',

        questionVi:
            '「ご注文はお決まりですか。」 có nghĩa là gì?',

        options: [
            {
                id: 'A',
                text: 'Quý khách muốn thanh toán không?',
            },
            {
                id: 'B',
                text: 'Quý khách đã chọn món xong chưa?',
            },
            {
                id: 'C',
                text: 'Quý khách muốn ngồi ở đâu?',
            },
            {
                id: 'D',
                text: 'Xin hãy đợi một chút.',
            },
        ],

        correctOptionId: 'B',

        explanationJa:
            '「ご注文はお決まりですか。」は、お客様が注文するものを決めたか確認する表現です。',

        explanationVi:
            'Đây là cách hỏi lịch sự để xác nhận khách đã quyết định món muốn gọi hay chưa.',

        order: 1,
    },

    {
        id: 'QUIZ_FOOD_ORDER_001_02',

        lessonId: 'FOOD_ORDER_001',

        questionJa:
            'コーヒーを注文するとき、自然な表現はどれですか。',

        questionVi:
            'Khi gọi cà phê, cách nói nào tự nhiên nhất?',

        options: [
            {
                id: 'A',
                text: 'コーヒーをお願いします。',
            },
            {
                id: 'B',
                text: 'コーヒーが行きます。',
            },
            {
                id: 'C',
                text: 'コーヒーを働きます。',
            },
            {
                id: 'D',
                text: 'コーヒーに帰ります。',
            },
        ],

        correctOptionId: 'A',

        explanationJa:
            '注文するときは「〜をお願いします」がよく使われます。',

        explanationVi:
            'Khi gọi món, mẫu 「〜をお願いします」 được sử dụng rất phổ biến.',

        order: 2,
    },
];