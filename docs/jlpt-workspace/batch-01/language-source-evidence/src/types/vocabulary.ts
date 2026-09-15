export type JLPTLevel =
    | 'N5'
    | 'N4'
    | 'N3'
    | 'N2'
    | 'N1';

export type PartOfSpeech =
    | 'noun'
    | 'verb'
    | 'i-adjective'
    | 'na-adjective'
    | 'adverb'
    | 'expression'
    | 'other';

export type VerbGroup =
    | 1
    | 2
    | 3;

export type VocabularyItem = {
    id: number;

    word: string;
    reading: string;
    romaji?: string;

    meaningVi: string;
    meaningEn?: string;
    meaningTranslations?: Partial<Record<string, string>>;

    jlptLevel: JLPTLevel;

    partOfSpeech: PartOfSpeech;

    verbGroup?: VerbGroup;

    example: string;
    exampleReading?: string;
    exampleVi: string;
    exampleTranslations?: Partial<Record<string, string>>;

    audioUrl?: string;
    imageUrl?: string;

    categoryIds: string[];
    tagIds: string[];
    industryIds: string[];
};
