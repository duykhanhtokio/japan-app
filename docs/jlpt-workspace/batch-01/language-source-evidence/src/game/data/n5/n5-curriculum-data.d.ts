import type { N5MinnaLesson, N5StudyDay, N5Week } from './n5-curriculum-types';

declare const curriculum: {
    readonly id: string;
    readonly version: number;
    readonly reviewScope: string;
    readonly targetFullCourseDays: number;
    readonly weeklyStudySessions: number;
    readonly dailyTargetMinutes: number;
    readonly localePolicy: readonly string[];
    readonly sourcePolicy: string;
    readonly stats: {
        readonly weeks: number;
        readonly sessions: number;
        readonly minnaLessons: number;
        readonly vocabularyEntries: number;
        readonly uniqueVocabularyEntries: number;
        readonly grammarPoints: number;
    };
    readonly lessons: readonly N5MinnaLesson[];
    readonly weeks: readonly N5Week[];
    readonly days: readonly N5StudyDay[];
};

export default curriculum;
