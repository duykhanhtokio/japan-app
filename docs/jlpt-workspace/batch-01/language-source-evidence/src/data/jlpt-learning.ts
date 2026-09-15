import grammarJson from '@/data/generated/grammar.json';
import grammarExampleLocalizationsJson from '@/data/generated/grammar-example-localizations.json';
import grammarMeaningTranslationsJson from '@/data/generated/grammar-meaning-translations.json';
import scenariosJson from '@/data/generated/scenarios.json';
import vocabularyJson from '@/data/generated/vocabulary.json';
import { jlptGrammarSupplements, replacedGrammarIds } from '@/data/jlpt-grammar-supplements';
import type { AppLanguageCode } from '@/i18n/languages';

export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type LearningSection =
    | 'characters'
    | 'vocabulary'
    | 'grammar'
    | 'listening'
    | 'conversation'
    | 'test';

export type GeneratedVocabulary = {
    id: string;
    word: string;
    reading: string;
    meaningVi: string;
    meaningEn?: string;
    meaningTranslations?: Partial<Record<AppLanguageCode, string>>;
    jlpt: JlptLevel;
    exampleJa?: string;
    exampleReading?: string;
    exampleVi?: string;
    exampleTranslations?: Partial<Record<Exclude<AppLanguageCode, 'ja'>, string>>;
    status?: string;
};

export type GeneratedGrammar = {
    id: string;
    name: string;
    reading?: string;
    jlpt: JlptLevel;
    meaningVi: string;
    meaningJa?: string;
    meaningEn?: string;
    meaningTranslations?: Partial<Record<AppLanguageCode, string>>;
    pattern?: string;
    formation?: string;
    exampleJa?: string;
    exampleReading?: string;
    exampleVi?: string;
    exampleTranslations?: Partial<Record<Exclude<AppLanguageCode, 'ja'>, string>>;
    commonMistakes?: string[];
    status?: string;
};

export function getGrammarMeaning(
    item: GeneratedGrammar,
    language: AppLanguageCode,
) {
    if (language === 'vi') return item.meaningVi;
    const localizedMeaning = item.meaningTranslations?.[language];
    if (!localizedMeaning) {
        throw new Error(`Missing ${language} grammar explanation for ${item.id}`);
    }
    return localizedMeaning;
}

export function getGrammarExampleTranslation(
    item: GeneratedGrammar,
    language: AppLanguageCode,
) {
    if (language === 'ja') return undefined;
    if (language === 'vi') return item.exampleVi;
    return item.exampleTranslations?.[language];
}

export type GeneratedScenario = {
    id: string;
    name: string;
    difficulty: JlptLevel;
    situation?: string;
    learningObjective?: string;
    playerGoal?: string;
    npcGoal?: string;
    evaluationCriteria?: string | null;
    requiredGrammarIds?: string[];
    requiredVocabularyIds?: string[];
    startingExpression?: string | null;
    status?: string;
};

export const generatedVocabulary = vocabularyJson as GeneratedVocabulary[];

export function getVocabularyMeaning(
    item: GeneratedVocabulary,
    language: AppLanguageCode,
) {
    if (language === 'vi') return item.meaningVi;
    return item.meaningTranslations?.[language]
        ?? item.meaningTranslations?.ja
        ?? item.word;
}

export function getVocabularyExampleTranslation(
    item: GeneratedVocabulary,
    language: AppLanguageCode,
) {
    if (language === 'ja') return undefined;
    return item.exampleTranslations?.[language];
}
const grammarMeaningTranslations = grammarMeaningTranslationsJson as Record<
    string,
    Partial<Record<Exclude<AppLanguageCode, 'vi'>, string>>
>;

type GrammarExampleLocalization = {
    reading: string;
    translations: Record<Exclude<AppLanguageCode, 'ja'>, string>;
};

const grammarExampleLocalizations = grammarExampleLocalizationsJson as Record<
    string,
    GrammarExampleLocalization
>;

export const generatedGrammar = [
    ...(grammarJson as GeneratedGrammar[]).filter(item=>!replacedGrammarIds.has(item.id)),
    ...jlptGrammarSupplements,
].map((item) => ({
    ...item,
    meaningTranslations: grammarMeaningTranslations[item.id],
    exampleReading: grammarExampleLocalizations[item.id]?.reading,
    exampleTranslations: grammarExampleLocalizations[item.id]?.translations,
})) as GeneratedGrammar[];
export const generatedScenarios = scenariosJson as GeneratedScenario[];

export const hiraganaRows = [
    ['あ', 'い', 'う', 'え', 'お'], ['か', 'き', 'く', 'け', 'こ'],
    ['さ', 'し', 'す', 'せ', 'そ'], ['た', 'ち', 'つ', 'て', 'と'],
    ['な', 'に', 'ぬ', 'ね', 'の'], ['は', 'ひ', 'ふ', 'へ', 'ほ'],
    ['ま', 'み', 'む', 'め', 'も'], ['や', 'ゆ', 'よ'],
    ['ら', 'り', 'る', 'れ', 'ろ'], ['わ', 'を', 'ん'],
];

export const katakanaRows = [
    ['ア', 'イ', 'ウ', 'エ', 'オ'], ['カ', 'キ', 'ク', 'ケ', 'コ'],
    ['サ', 'シ', 'ス', 'セ', 'ソ'], ['タ', 'チ', 'ツ', 'テ', 'ト'],
    ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'], ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
    ['マ', 'ミ', 'ム', 'メ', 'モ'], ['ヤ', 'ユ', 'ヨ'],
    ['ラ', 'リ', 'ル', 'レ', 'ロ'], ['ワ', 'ヲ', 'ン'],
];

export const hiraganaVoicedRows = [
    ['が', 'ぎ', 'ぐ', 'げ', 'ご'], ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
    ['だ', 'ぢ', 'づ', 'で', 'ど'], ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
    ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
];

export const katakanaVoicedRows = [
    ['ガ', 'ギ', 'グ', 'ゲ', 'ゴ'], ['ザ', 'ジ', 'ズ', 'ゼ', 'ゾ'],
    ['ダ', 'ヂ', 'ヅ', 'デ', 'ド'], ['バ', 'ビ', 'ブ', 'ベ', 'ボ'],
    ['パ', 'ピ', 'プ', 'ペ', 'ポ'],
];

export const hiraganaCombinationRows = [
    ['きゃ', 'きゅ', 'きょ'], ['しゃ', 'しゅ', 'しょ'], ['ちゃ', 'ちゅ', 'ちょ'],
    ['にゃ', 'にゅ', 'にょ'], ['ひゃ', 'ひゅ', 'ひょ'], ['みゃ', 'みゅ', 'みょ'],
    ['りゃ', 'りゅ', 'りょ'], ['ぎゃ', 'ぎゅ', 'ぎょ'], ['じゃ', 'じゅ', 'じょ'],
    ['びゃ', 'びゅ', 'びょ'], ['ぴゃ', 'ぴゅ', 'ぴょ'],
];

export const katakanaCombinationRows = [
    ['キャ', 'キュ', 'キョ'], ['シャ', 'シュ', 'ショ'], ['チャ', 'チュ', 'チョ'],
    ['ニャ', 'ニュ', 'ニョ'], ['ヒャ', 'ヒュ', 'ヒョ'], ['ミャ', 'ミュ', 'ミョ'],
    ['リャ', 'リュ', 'リョ'], ['ギャ', 'ギュ', 'ギョ'], ['ジャ', 'ジュ', 'ジョ'],
    ['ビャ', 'ビュ', 'ビョ'], ['ピャ', 'ピュ', 'ピョ'],
];

const kanaRomaji = new Map<string, string>();

const singleKanaGroups: [string, string, string[]][] = [
    ['あいうえお', 'アイウエオ', ['a', 'i', 'u', 'e', 'o']],
    ['かきくけこ', 'カキクケコ', ['ka', 'ki', 'ku', 'ke', 'ko']],
    ['さしすせそ', 'サシスセソ', ['sa', 'shi', 'su', 'se', 'so']],
    ['たちつてと', 'タチツテト', ['ta', 'chi', 'tsu', 'te', 'to']],
    ['なにぬねの', 'ナニヌネノ', ['na', 'ni', 'nu', 'ne', 'no']],
    ['はひふへほ', 'ハヒフヘホ', ['ha', 'hi', 'fu', 'he', 'ho']],
    ['まみむめも', 'マミムメモ', ['ma', 'mi', 'mu', 'me', 'mo']],
    ['やゆよ', 'ヤユヨ', ['ya', 'yu', 'yo']],
    ['らりるれろ', 'ラリルレロ', ['ra', 'ri', 'ru', 're', 'ro']],
    ['わをん', 'ワヲン', ['wa', 'wo', 'n']],
    ['がぎぐげご', 'ガギグゲゴ', ['ga', 'gi', 'gu', 'ge', 'go']],
    ['ざじずぜぞ', 'ザジズゼゾ', ['za', 'ji', 'zu', 'ze', 'zo']],
    ['だぢづでど', 'ダヂヅデド', ['da', 'ji', 'zu', 'de', 'do']],
    ['ばびぶべぼ', 'バビブベボ', ['ba', 'bi', 'bu', 'be', 'bo']],
    ['ぱぴぷぺぽ', 'パピプペポ', ['pa', 'pi', 'pu', 'pe', 'po']],
];

for (const [hiragana, katakana, readings] of singleKanaGroups) {
    [...hiragana].forEach((kana, index) => kanaRomaji.set(kana, readings[index]));
    [...katakana].forEach((kana, index) => kanaRomaji.set(kana, readings[index]));
}

const combinationGroups: [string[], string[], string[]][] = [
    [['きゃ','きゅ','きょ'],['キャ','キュ','キョ'],['kya','kyu','kyo']],
    [['しゃ','しゅ','しょ'],['シャ','シュ','ショ'],['sha','shu','sho']],
    [['ちゃ','ちゅ','ちょ'],['チャ','チュ','チョ'],['cha','chu','cho']],
    [['にゃ','にゅ','にょ'],['ニャ','ニュ','ニョ'],['nya','nyu','nyo']],
    [['ひゃ','ひゅ','ひょ'],['ヒャ','ヒュ','ヒョ'],['hya','hyu','hyo']],
    [['みゃ','みゅ','みょ'],['ミャ','ミュ','ミョ'],['mya','myu','myo']],
    [['りゃ','りゅ','りょ'],['リャ','リュ','リョ'],['rya','ryu','ryo']],
    [['ぎゃ','ぎゅ','ぎょ'],['ギャ','ギュ','ギョ'],['gya','gyu','gyo']],
    [['じゃ','じゅ','じょ'],['ジャ','ジュ','ジョ'],['ja','ju','jo']],
    [['びゃ','びゅ','びょ'],['ビャ','ビュ','ビョ'],['bya','byu','byo']],
    [['ぴゃ','ぴゅ','ぴょ'],['ピャ','ピュ','ピョ'],['pya','pyu','pyo']],
];

for (const [hiragana, katakana, readings] of combinationGroups) {
    hiragana.forEach((kana, index) => kanaRomaji.set(kana, readings[index]));
    katakana.forEach((kana, index) => kanaRomaji.set(kana, readings[index]));
}

export function getKanaRomaji(kana: string) {
    return kanaRomaji.get(kana) ?? '';
}

export const SECTION_LABELS: Record<LearningSection, { icon: string; ja: string; vi: string }> = {
    characters: { icon: '🔤', ja: '文字', vi: 'Chữ Nhật' },
    vocabulary: { icon: '📝', ja: '単語', vi: 'Từ vựng' },
    grammar: { icon: '📖', ja: '文法', vi: 'Ngữ pháp' },
    listening: { icon: '🎧', ja: 'リスニング', vi: 'Luyện nghe' },
    conversation: { icon: '💬', ja: '会話', vi: 'Hội thoại' },
    test: { icon: '🎯', ja: 'テスト', vi: 'Kiểm tra' },
};

export function isJlptLevel(value: string | undefined): value is JlptLevel {
    return value === 'N5' || value === 'N4' || value === 'N3' || value === 'N2' || value === 'N1';
}
