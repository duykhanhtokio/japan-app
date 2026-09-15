import type { VocabularyItem } from '@/types/vocabulary';
export const vocabulary: VocabularyItem[] = [
    {
        id: 1,
        word: '食べる',
        reading: 'たべる',
        romaji: 'taberu',

        meaningVi: 'ăn',
        meaningEn: 'to eat',

        jlptLevel: 'N5',

        partOfSpeech: 'verb',
        verbGroup: 2,

        example: '毎日ご飯を食べます。',
        exampleReading: 'まいにち ごはんを たべます。',
        exampleVi: 'Mỗi ngày tôi ăn cơm.',

        categoryIds: [
            'FOOD',
            'DAILY_LIFE',
        ],

        tagIds: [
            'MEAL',
        ],
        industryIds: [
            'FOOD_SERVICE',
        ],
    },

    {
        id: 2,
        word: '飲む',
        reading: 'のむ',
        romaji: 'nomu',

        meaningVi: 'uống',
        meaningEn: 'to drink',

        jlptLevel: 'N5',

        partOfSpeech: 'verb',
        verbGroup: 1,

        example: '水を飲みます。',
        exampleReading: 'みずを のみます。',
        exampleVi: 'Tôi uống nước.',

        categoryIds: [
            'DRINK',
            'DAILY_LIFE',
        ],

        tagIds: [
            'BEVERAGE',
        ],
        industryIds: [
            'FOOD_SERVICE',
        ],
    },

    {
        id: 3,
        word: 'コーヒー',
        reading: 'コーヒー',
        romaji: 'koohii',

        meaningVi: 'cà phê',
        meaningEn: 'coffee',

        jlptLevel: 'N5',

        partOfSpeech: 'noun',

        example: 'コーヒーをください。',
        exampleVi: 'Cho tôi cà phê.',

        categoryIds: [
            'DRINK',
            'CAFE',
        ],

        tagIds: [
            'ORDER',
            'FOOD_SERVICE',
        ],
        industryIds: [
            'FOOD_SERVICE',
        ],
    },

    {
        id: 4,
        word: '行く',
        reading: 'いく',
        romaji: 'iku',

        meaningVi: 'đi',
        meaningEn: 'to go',

        jlptLevel: 'N5',

        partOfSpeech: 'verb',
        verbGroup: 1,

        example: '学校へ行きます。',
        exampleReading: 'がっこうへ いきます。',
        exampleVi: 'Tôi đi đến trường.',

        categoryIds: [
            'DAILY_LIFE',
            'MOVEMENT',
        ],

        tagIds: [
            'DAILY_LIFE',
            'MOVEMENT',
        ],
        industryIds: [
            'DAILY_LIFE',
        ],
    },

    {
        id: 5,
        word: '続ける',
        reading: 'つづける',
        romaji: 'tsuzukeru',

        meaningVi: 'tiếp tục',
        meaningEn: 'to continue',

        jlptLevel: 'N4',

        partOfSpeech: 'verb',
        verbGroup: 2,

        example: '日本語の勉強を続けます。',
        exampleReading: 'にほんごの べんきょうを つづけます。',
        exampleVi: 'Tôi tiếp tục học tiếng Nhật.',

        categoryIds: [
            'STUDY',
        ],

        tagIds: [
            'DAILY_LIFE',
            'STUDY',
        ],
        industryIds: [
            'STUDY',
        ],
    },
];