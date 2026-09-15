export type N5ActivityKind =
    | 'kana'
    | 'vocabulary'
    | 'grammar'
    | 'listening'
    | 'writing'
    | 'quiz'
    | 'dog_game'
    | 'review'
    | 'checkpoint'
    | 'break'
    | 'reading'
    | 'speaking';

export type N5VocabularyItem = {
    japanese: string;
    reading: string;
    romaji: string;
    meaningKey: string;
    /** Review-only copy. Production UI must resolve meaningKey by user locale. */
    reviewMeaningVi?: string;
};

export type N5GrammarItem = {
    pattern: string;
    explanationKey: string;
    /** Review-only copy. Production UI resolves explanationKey by locale. */
    reviewExplanationVi?: string;
    example: {
        japanese: string;
        reading: string;
        translationKey: string;
        /** Vietnamese review master; translated after content approval. */
        reviewTranslationVi?: string;
    };
};

export type N5Activity = {
    id: string;
    kind: N5ActivityKind;
    title: string;
    minutes: number;
    instruction: string;
    completionRule: string;
};

export type N5StudyDay = {
    day: number;
    calendarDay: number;
    week: number;
    phase:
        | 'kana'
        | 'minna'
        | 'weekly-event'
        | 'consolidation'
        | 'grammar-review'
        | 'skills'
        | 'mock'
        | 'final';
    lessonNumber: number | null;
    lessonHalf?: 'A' | 'B';
    title: string;
    subtitle: string;
    estimatedMinutes: number;
    isCheckpoint: boolean;
    focusItems: readonly string[];
    vocabulary: readonly N5VocabularyItem[];
    grammar: readonly N5GrammarItem[];
    activities: readonly N5Activity[];
    /** Vietnamese-first review content. */
    practiceVi: readonly string[];
    kaiwaVi: readonly string[];
    listeningVi: string;
    rewards: {
        xp: number;
        coins: number;
        key: number;
    };
};

export type N5MinnaLesson = {
    number: number;
    sourceAnchor: string;
    titleVi: string;
    objectiveVi: string;
    vocabulary: readonly {
        japanese: string;
        reading: string;
        romaji: string;
        meaningVi: string;
    }[];
    grammar: readonly {
        pattern: string;
        explanationVi: string;
        example: {
            japanese: string;
            reading: string;
            translationVi: string;
        };
    }[];
    practiceVi: readonly string[];
    kaiwaVi: readonly string[];
    listeningVi: string;
};

export type N5Week = {
    week: number;
    title: string;
    goal: string;
    days: readonly N5StudyDay[];
};
