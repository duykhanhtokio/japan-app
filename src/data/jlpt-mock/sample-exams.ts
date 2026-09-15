import type { JlptLevel } from '@/data/jlpt-learning';
import type { JlptMockExam } from '@/data/jlpt-mock/types';
import { N5_TEST_01 } from '@/data/jlpt-mock/n5-test-01';
import { buildSampleExam } from '@/data/jlpt-mock/sample-exam-factory';
import { validateMockExam } from '@/data/jlpt-mock/types';
import { answerKeyFor } from '@/data/jlpt-mock/answer-key';
import { replaceSentenceComposition } from '@/data/jlpt-mock/sentence-composition';
import { applyN3AuthoredContent } from '@/data/jlpt-mock/n3-authored-content';
import { applyOtherLevelAuthoredContent } from '@/data/jlpt-mock/other-level-authored-content';

/**
 * Places the correct answer at positions 1, 2, 3, 4 in a strict cycle.
 * Only option order changes; answer content and stable option IDs are retained.
 * The maximum difference between any two positions is one question.
 */
function balanceCorrectPositions(exam: JlptMockExam): JlptMockExam {
    exam = applyN3AuthoredContent(exam);
    exam = applyOtherLevelAuthoredContent(exam);
    exam = { ...exam, questions: replaceSentenceComposition(exam.questions, exam.level) };
    const answerKey = answerKeyFor(exam.level, exam.questions.length);
    return {
        ...exam,
        questions: exam.questions.map((question, questionIndex) => {
            const correct = question.options.find((option) => option.id === question.correctOptionId)!;
            const distractors = question.options.filter((option) => option.id !== question.correctOptionId);
            const targetIndex = answerKey[questionIndex] - 1;
            const orderedOptions = [...distractors];
            orderedOptions.splice(targetIndex, 0, correct);
            const options = orderedOptions.map((option, optionIndex) => ({
                ...option,
                id: String(optionIndex + 1),
            }));
            return { ...question, options, correctOptionId: String(targetIndex + 1) };
        }),
    };
}

export const JLPT_SAMPLE_EXAMS = {
    N1: balanceCorrectPositions(buildSampleExam('N1')),
    N2: balanceCorrectPositions(buildSampleExam('N2')),
    N3: balanceCorrectPositions(buildSampleExam('N3')),
    N4: balanceCorrectPositions(buildSampleExam('N4')),
    N5: balanceCorrectPositions(N5_TEST_01),
} as const;

Object.values(JLPT_SAMPLE_EXAMS).forEach(validateMockExam);

export const sampleExamFor = (level: JlptLevel) => JLPT_SAMPLE_EXAMS[level];
