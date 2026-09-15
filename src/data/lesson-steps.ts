import type { LessonStep } from '@/types/lesson-step';

export const lessonSteps: LessonStep[] = [
    {
        id: 'FOOD_ORDER_001_INTRO',
        lessonId: 'FOOD_ORDER_001',
        type: 'intro',
        order: 1,
        titleJa: '今日のレッスン',
        titleVi: 'Bài học hôm nay',
        instructionJa:
            '今日は、お客様に注文を聞く表現を学びます。',
        instructionVi:
            'Hôm nay chúng ta sẽ học cách hỏi khách gọi món.',
    },

    {
        id: 'FOOD_ORDER_001_VOCABULARY',
        lessonId: 'FOOD_ORDER_001',
        type: 'vocabulary',
        order: 2,
        titleJa: '単語を覚えよう',
        titleVi: 'Học từ vựng',
        instructionJa:
            '会話で使う単語を確認しましょう。',
        instructionVi:
            'Hãy xem những từ sẽ được sử dụng trong hội thoại.',
    },

    {
        id: 'FOOD_ORDER_001_EXPRESSION',
        lessonId: 'FOOD_ORDER_001',
        type: 'expression',
        order: 3,
        titleJa: '表現を覚えよう',
        titleVi: 'Học mẫu câu',
        instructionJa:
            '注文を聞くときの表現を確認しましょう。',
        instructionVi:
            'Hãy học những mẫu câu dùng khi hỏi khách gọi món.',
    },

    {
        id: 'FOOD_ORDER_001_DIALOGUE',
        lessonId: 'FOOD_ORDER_001',
        type: 'dialogue',
        order: 4,
        titleJa: '会話を聞こう',
        titleVi: 'Hội thoại',
        instructionJa:
            '店員とお客様の会話を確認しましょう。',
        instructionVi:
            'Hãy xem hội thoại giữa nhân viên và khách hàng.',
    },

    {
        id: 'FOOD_ORDER_001_QUIZ',
        lessonId: 'FOOD_ORDER_001',
        type: 'quiz',
        order: 5,
        titleJa: '理解チェック',
        titleVi: 'Kiểm tra hiểu bài',
        instructionJa:
            '正しい答えを選んでください。',
        instructionVi:
            'Hãy chọn đáp án đúng.',
    },

    {
        id: 'FOOD_ORDER_001_SPEAKING',
        lessonId: 'FOOD_ORDER_001',
        type: 'speaking',
        order: 6,
        titleJa: '言ってみよう',
        titleVi: 'Hãy thử nói',
        instructionJa:
            '店員になって、声に出して言ってみましょう。',
        instructionVi:
            'Hãy đóng vai nhân viên và thử nói thành tiếng.',
    },

    {
        id: 'FOOD_ORDER_001_COMPLETE',
        lessonId: 'FOOD_ORDER_001',
        type: 'complete',
        order: 7,
        titleJa: 'レッスン完了！',
        titleVi: 'Hoàn thành bài học!',
        instructionJa:
            'よくできました。次のレッスンにも挑戦しましょう。',
        instructionVi:
            'Làm tốt lắm. Hãy tiếp tục với bài học tiếp theo.',
    },
];