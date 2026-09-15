export type LessonStepType =
    | 'intro'
    | 'vocabulary'
    | 'expression'
    | 'dialogue'
    | 'speaking'
    | 'quiz'
    | 'ai-roleplay'
    | 'complete';

export type LessonStep = {
    id: string;

    lessonId: string;

    type: LessonStepType;

    order: number;

    titleJa: string;
    titleVi?: string;
    titleEn?: string;
    titleTranslations?: Partial<Record<string, string>>;

    instructionJa?: string;
    instructionVi?: string;
    instructionEn?: string;
    instructionTranslations?: Partial<Record<string, string>>;
};
