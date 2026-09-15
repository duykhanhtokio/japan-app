export type LessonType =
    | 'vocabulary'
    | 'grammar'
    | 'listening'
    | 'dialogue'
    | 'quiz'
    | 'simulation';

export type DialogueLine = {
    id: string;
    speakerJa: string;
    speakerVi?: string;

    textJa: string;
    reading?: string;
    textVi: string;
    textEn?: string;
    textTranslations?: Partial<Record<string, string>>;

    audioUrl?: string;
};

export type LessonExpression = {
    id: string;

    expression: string;
    meaningVi: string;
    meaningEn?: string;
    meaningTranslations?: Partial<Record<string, string>>;

    exampleJa?: string;
    exampleVi?: string;
    exampleEn?: string;
    exampleTranslations?: Partial<Record<string, string>>;
};

export type Lesson = {
    id: string;

    moduleId: string;

    titleJa: string;
    titleVi: string;
    titleEn?: string;
    titleTranslations?: Partial<Record<string, string>>;

    descriptionJa?: string;
    descriptionVi?: string;
    descriptionEn?: string;
    descriptionTranslations?: Partial<Record<string, string>>;

    type: LessonType;

    order: number;

    estimatedMinutes?: number;

    objectiveJa?: string;
    objectiveVi?: string;
    objectiveEn?: string;
    objectiveTranslations?: Partial<Record<string, string>>;

    vocabularyIds?: number[];

    expressions?: LessonExpression[];

    dialogue?: DialogueLine[];
};
