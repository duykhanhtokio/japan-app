import type { JlptLevel } from '@/data/jlpt-learning';

export const JLPT_TESTS_PER_LEVEL = 10;
export const JLPT_MAXIMUM_SCORE = 180;

export type JlptExamKind = 'vocabulary' | 'grammar' | 'reading' | 'listening';

type ScoreSection = {
    id: 'languageKnowledge' | 'reading' | 'languageKnowledgeAndReading' | 'listening';
    label: string;
    maximum: number;
    passMark: number;
    kinds: JlptExamKind[];
};

export type JlptExamConfig = {
    /** Only the written sections are timed in the app. Listening has no countdown. */
    writtenMinutes: number;
    listeningMinutes: number;
    overallPassMark: number;
    sections: readonly ScoreSection[];
};

const languageAndReading: ScoreSection = {
    id: 'languageKnowledgeAndReading',
    label: '言語知識・読解',
    maximum: 120,
    passMark: 38,
    kinds: ['vocabulary', 'grammar', 'reading'],
};

const listening: ScoreSection = {
    id: 'listening',
    label: '聴解',
    maximum: 60,
    passMark: 19,
    kinds: ['listening'],
};

const threeSections = (): readonly ScoreSection[] => [
    { id: 'languageKnowledge', label: '言語知識（語彙・文法）', maximum: 60, passMark: 19, kinds: ['vocabulary', 'grammar'] },
    { id: 'reading', label: '読解', maximum: 60, passMark: 19, kinds: ['reading'] },
    listening,
];

/** Official JLPT pass marks and section structure. */
export const JLPT_EXAM_CONFIG: Record<JlptLevel, JlptExamConfig> = {
    N1: { writtenMinutes: 110, listeningMinutes: 60, overallPassMark: 100, sections: threeSections() },
    N2: { writtenMinutes: 105, listeningMinutes: 50, overallPassMark: 90, sections: threeSections() },
    N3: { writtenMinutes: 100, listeningMinutes: 40, overallPassMark: 95, sections: threeSections() },
    // The mock-test timing follows the supplied scoring reference sheet.
    N4: { writtenMinutes: 80, listeningMinutes: 35, overallPassMark: 90, sections: [languageAndReading, listening] },
    N5: { writtenMinutes: 60, listeningMinutes: 30, overallPassMark: 80, sections: [languageAndReading, listening] },
};

export type SectionAnswerSummary = Record<JlptExamKind, { correct: number; total: number }>;

export type JlptMockResult = {
    total: number;
    maximum: number;
    passed: boolean;
    sections: Array<ScoreSection & { score: number; passed: boolean }>;
};

/**
 * The official JLPT converts raw responses into scaled scores using undisclosed
 * item-calibration data. A mock test cannot reproduce that conversion. This
 * function proportionally estimates each official scoring section, then applies
 * the official total and sectional pass marks.
 */
export function scoreJlptMock(level: JlptLevel, answers: SectionAnswerSummary): JlptMockResult {
    const config = JLPT_EXAM_CONFIG[level];
    const sections = config.sections.map((section) => {
        const subtotal = section.kinds.reduce((sum, kind) => sum + answers[kind].correct, 0);
        const total = section.kinds.reduce((sum, kind) => sum + answers[kind].total, 0);
        const score = total === 0 ? 0 : Math.round((subtotal / total) * section.maximum);
        return { ...section, score, passed: score >= section.passMark };
    });
    const total = sections.reduce((sum, section) => sum + section.score, 0);
    const maximum = sections.reduce((sum, section) => sum + section.maximum, 0);
    if (maximum !== JLPT_MAXIMUM_SCORE) throw new Error(`${level}: scoring sections must total ${JLPT_MAXIMUM_SCORE}`);
    return {
        total,
        maximum: JLPT_MAXIMUM_SCORE,
        passed: total >= config.overallPassMark && sections.every((section) => section.passed),
        sections,
    };
}
