import type { JlptMockPart } from '@/data/jlpt-mock/types';

/** Exact N5 paper structure observed in the uploaded N5 sample PDFs. */
export const N5_MOCK_BLUEPRINT: readonly JlptMockPart[] = [
    { id: 'v-1', title: '問題 1', instructions: '＿＿＿の ことばは ひらがなで どう かきますか。', section: 'vocabulary', family: 'kanjiReading', questionCount: 12 },
    { id: 'v-2', title: '問題 2', instructions: '＿＿＿の ことばは どう かきますか。', section: 'vocabulary', family: 'orthography', questionCount: 8 },
    { id: 'v-3', title: '問題 3', instructions: '（　）に なにを いれますか。', section: 'vocabulary', family: 'contextualVocabulary', questionCount: 10 },
    { id: 'v-4', title: '問題 4', instructions: '＿＿＿の ぶんと だいたい おなじ いみの ぶんが あります。', section: 'vocabulary', family: 'paraphrase', questionCount: 5 },
    { id: 'g-1', title: '問題 1', instructions: '（　）に 何を 入れますか。', section: 'grammar', family: 'grammarForm', questionCount: 16 },
    { id: 'g-2', title: '問題 2', instructions: '★に 入る ものは どれですか。', section: 'grammar', family: 'sentenceComposition', questionCount: 5 },
    { id: 'g-3', title: '問題 3', instructions: '文の 意味を 考えて、＿＿＿に 何を 入れますか。', section: 'grammar', family: 'textGrammar', questionCount: 5 },
    { id: 'r-1', title: '問題 4', instructions: 'つぎの ぶんを 読んで、しつもんに こたえて ください。', section: 'reading', family: 'shortReading', questionCount: 3 },
    { id: 'r-2', title: '問題 5', instructions: 'つぎの ぶんしょうを 読んで、しつもんに こたえて ください。', section: 'reading', family: 'mediumReading', questionCount: 2 },
    { id: 'r-3', title: '問題 6', instructions: '右の ページを 見て、下の しつもんに こたえて ください。', section: 'reading', family: 'informationRetrieval', questionCount: 1 },
    { id: 'l-1', title: '問題 1', instructions: 'はじめに しつもんを きいて ください。それから はなしを きいて、えらんで ください。', section: 'listening', family: 'listeningTask', questionCount: 7 },
    { id: 'l-2', title: '問題 2', instructions: 'はじめに しつもんを きいて ください。それから はなしを きいて、えらんで ください。', section: 'listening', family: 'listeningKeyPoint', questionCount: 6 },
    { id: 'l-3', title: '問題 3', instructions: 'えを みながら しつもんを きいて ください。', section: 'listening', family: 'listeningExpression', questionCount: 5 },
    { id: 'l-4', title: '問題 4', instructions: 'ぶんを きいて、いちばん いい ものを えらんで ください。', section: 'listening', family: 'listeningQuickResponse', questionCount: 6 },
];

export const N5_QUESTION_COUNT = N5_MOCK_BLUEPRINT.reduce((total, part) => total + part.questionCount, 0);
