import type { JlptLevel } from '@/data/jlpt-learning';

export type JlptSectionId = 'vocabulary' | 'grammar' | 'reading' | 'listening';

/**
 * Question families follow the headings used in the official N5 sample papers.
 * Keeping the family in data prevents the UI from presenting every item as the
 * same generic multiple-choice question.
 */
export type JlptQuestionFamily =
    | 'kanjiReading'
    | 'orthography'
    | 'wordFormation'
    | 'contextualVocabulary'
    | 'paraphrase'
    | 'usage'
    | 'grammarForm'
    | 'sentenceComposition'
    | 'textGrammar'
    | 'shortReading'
    | 'noticeReading'
    | 'informationRetrieval'
    | 'mediumReading'
    | 'longReading'
    | 'integratedReading'
    | 'assertionReading'
    | 'listeningTask'
    | 'listeningKeyPoint'
    | 'listeningOutline'
    | 'listeningExpression'
    | 'listeningQuickResponse'
    | 'listeningIntegrated';

export type JlptOption = { id: string; text: string };

export type JlptMockQuestion = {
    /** Stable across every paper: duplicate IDs are rejected before release. */
    id: string;
    level: JlptLevel;
    section: JlptSectionId;
    family: JlptQuestionFamily;
    prompt: string;
    options: readonly JlptOption[];
    correctOptionId: string;
    /** Japanese script is kept separate from the visible question for listening. */
    audioScript?: string;
    /** Shown after submission so the learner can replay and read along. */
    audioTranscript?: string;
    passage?: string;
    /** A future illustration is referenced by key, never embedded in question text. */
    visualKey?: string;
    sourceVocabularyIds: readonly string[];
    sourceGrammarIds: readonly string[];
    explanation: string;
};

export type JlptMockPart = {
    id: string;
    title: string;
    instructions: string;
    section: JlptSectionId;
    family: JlptQuestionFamily;
    questionCount: number;
};

export type JlptMockExam = {
    id: string;
    level: JlptLevel;
    number: number;
    title: string;
    parts: readonly JlptMockPart[];
    questions: readonly JlptMockQuestion[];
};

export function validateMockExam(exam: JlptMockExam) {
    const ids = new Set<string>();
    for (const question of exam.questions) {
        if (question.level !== exam.level) throw new Error(`${question.id}: incorrect JLPT level`);
        if (ids.has(question.id)) throw new Error(`${question.id}: duplicate question ID`);
        if (!question.options.some((option) => option.id === question.correctOptionId)) {
            throw new Error(`${question.id}: correct option is missing`);
        }
        ids.add(question.id);
    }
    for (const part of exam.parts) {
        const actual = exam.questions.filter((question) => question.family === part.family).length;
        if (actual !== part.questionCount) throw new Error(`${exam.id}/${part.id}: expected ${part.questionCount}, received ${actual}`);
    }
}

/** Rejects any reused question before publishing a 10-paper level set. */
export function validateNoQuestionReuse(exams: readonly JlptMockExam[]) {
    const used = new Set<string>();
    for (const exam of exams) {
        validateMockExam(exam);
        for (const question of exam.questions) {
            if (used.has(question.id)) throw new Error(`Question is reused across papers: ${question.id}`);
            used.add(question.id);
        }
    }
}
