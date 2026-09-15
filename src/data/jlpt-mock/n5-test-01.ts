import type { JlptMockExam } from '@/data/jlpt-mock/types';
import { N5_MOCK_BLUEPRINT } from '@/data/jlpt-mock/n5-blueprint';
import { N5_TEST_01_VOCABULARY } from '@/data/jlpt-mock/n5-test-01-vocabulary';
import { N5_TEST_01_GRAMMAR, N5_TEST_01_LISTENING, N5_TEST_01_READING } from '@/data/jlpt-mock/n5-test-01-rest';

export const N5_TEST_01: JlptMockExam = {
    id: 'n5-mock-01',
    level: 'N5',
    number: 1,
    title: 'N5 JLPT模擬試験 第1回',
    parts: N5_MOCK_BLUEPRINT,
    questions: [
        ...N5_TEST_01_VOCABULARY,
        ...N5_TEST_01_GRAMMAR,
        ...N5_TEST_01_READING,
        ...N5_TEST_01_LISTENING,
    ],
};
