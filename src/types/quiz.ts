export type QuizOption = {
    id: string;
    text: string;
};

export type QuizQuestion = {
    id: string;

    lessonId: string;

    questionJa: string;
    questionVi?: string;

    options: QuizOption[];

    correctOptionId: string;

    explanationJa?: string;
    explanationVi?: string;

    order: number;
};