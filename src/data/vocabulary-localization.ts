import type { AppLanguageCode } from '@/i18n/languages';
import meanings from './generated/vocabulary-meaning-localizations.json';
import examples from './generated/vocabulary-example-localizations.json';
import copyJson from './generated/vocabulary-ui-localizations.json';
import sourceJson from './generated/vocabulary-localization-source.json';
import repairsJson from './generated/vocabulary-source-repairs.json';
import canonicalJson from './generated/vocabulary.json';
import plannedSource from './generated/vocabulary-planned-source.json';
import plannedBindings from './generated/vocabulary-planned-bindings.json';
import en from './generated/vocabulary-localizations/en.json';
import vi from './generated/vocabulary-localizations/vi.json';
import id from './generated/vocabulary-localizations/id.json';
import zhCN from './generated/vocabulary-localizations/zh-CN.json';
import zhTW from './generated/vocabulary-localizations/zh-TW.json';
import hi from './generated/vocabulary-localizations/hi.json';
import bn from './generated/vocabulary-localizations/bn.json';
import ne from './generated/vocabulary-localizations/ne.json';
import my from './generated/vocabulary-localizations/my.json';
import th from './generated/vocabulary-localizations/th.json';
import km from './generated/vocabulary-localizations/km.json';
import tl from './generated/vocabulary-localizations/tl.json';

type LocalizedText = Partial<Record<AppLanguageCode, string>>;
type VocabularyText = {
    id: string;
    word: string;
    reading: string;
    meaningVi: string;
    meaningEn?: string;
    meaningTranslations?: LocalizedText;
    exampleJa?: string;
    exampleVi?: string;
    exampleTranslations?: LocalizedText;
};
const meaningBundles = meanings as Record<string, { word: string; reading: string; translations: LocalizedText }>;
const exampleBundles = examples as Record<string, { sourceJa: string; translations: LocalizedText }>;
const nonempty = (value?: string) => value?.trim() ? value : undefined;
type TranslationBundle = { locale: string; meanings: Record<string, string>; examples: Record<string, string>; plannedMeanings?: Record<string, string> };
const bundles: Partial<Record<AppLanguageCode, TranslationBundle>> = { en, vi, id, 'zh-CN': zhCN, 'zh-TW': zhTW, hi, bn, ne, my, th, km, tl };
const source = sourceJson.canonical as Record<string, { word: string; reading: string; exampleJa?: string }>;
const repairs = repairsJson as Record<string, { originalWord: string; originalReading: string; originalExampleJa?: string; word: string; reading: string; meaningEn?: string; meaningVi?: string; exampleJa?: string; exampleVi?: string }>;

export function getVocabularyCopy(language: AppLanguageCode) {
    return copyJson[language];
}

export function vocabularyCountText(pattern: string, count: number, language: AppLanguageCode) {
    return pattern.replace('{count}', new Intl.NumberFormat(language).format(count));
}

// Bind additions to the original Japanese spelling/reading, never list position.
export function localizeVocabulary<T extends VocabularyText>(item: T): T {
    const repair = repairs[item.id];
    const corrected = repair?.originalWord === item.word && repair.originalReading === item.reading
        ? { ...item, ...Object.fromEntries(Object.entries(repair).filter(([key]) => !key.startsWith('original') && (!key.startsWith('example') || !repair.originalExampleJa || item.exampleJa === repair.originalExampleJa))) } as T
        : item;
    const binding = source[item.id];
    if (binding?.word === corrected.word && binding.reading === corrected.reading) {
        const meaningTranslations = { ...corrected.meaningTranslations };
        const exampleTranslations = { ...corrected.exampleTranslations };
        for (const [locale, bundle] of Object.entries(bundles)) {
            const language = locale as AppLanguageCode;
            if (nonempty(bundle.meanings[item.id])) meaningTranslations[language] = bundle.meanings[item.id];
            if (binding.exampleJa === corrected.exampleJa && nonempty(bundle.examples[item.id])) exampleTranslations[language] = bundle.examples[item.id];
        }
        return { ...corrected, meaningEn: meaningTranslations.en ?? corrected.meaningEn, meaningVi: meaningTranslations.vi ?? corrected.meaningVi, meaningTranslations, exampleTranslations };
    }
    const meaning = meaningBundles[item.id];
    const example = exampleBundles[item.id];
    const meaningTranslations = meaning?.word === item.word && meaning.reading === item.reading
        ? { ...item.meaningTranslations, ...meaning.translations }
        : item.meaningTranslations;
    return {
        ...item,
        meaningVi: nonempty(meaningTranslations?.vi) ?? item.meaningVi,
        meaningTranslations,
        exampleTranslations: example?.sourceJa === item.exampleJa
            ? { ...item.exampleTranslations, ...example.translations }
            : item.exampleTranslations,
    };
}

// Explicitly reviewed word/reading aliases avoid treating homophones as the same word.
const canonicalById = new Map(canonicalJson.map(item => [item.id, item]));
const japaneseKey = (word: string, reading: string) => `${word.normalize('NFKC')}|${reading.normalize('NFKC').replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60))}`;
const canonicalByJapanese = new Map<string, (typeof canonicalJson)[number]>();
for (const item of canonicalJson) {
    const bound = source[item.id] ?? item;
    const key = japaneseKey(bound.word, bound.reading);
    if (!canonicalByJapanese.has(key)) canonicalByJapanese.set(key, item);
}
export function findVocabularyByJapanese(word: string, reading: string) {
    const item = canonicalByJapanese.get(japaneseKey(word, reading));
    return item ? localizeVocabulary(item) : undefined;
}
const plannedById = new Map(plannedSource.map(item => [item.id, item]));
const curriculumBindings = plannedBindings as Record<string, { canonicalId?: string; plannedId?: string }>;
export function getPlannedVocabularyItem(word: string, reading: string) {
    const id = curriculumBindings[`${word}|${reading}`]?.canonicalId;
    const item = id ? canonicalById.get(id) : undefined;
    return item ? localizeVocabulary(item) : undefined;
}
export function getPlannedVocabularyMeaning(word: string, reading: string, language: AppLanguageCode) {
    if (language === 'ja') return word;
    const binding = curriculumBindings[`${word}|${reading}`];
    if (binding?.plannedId) {
        const item = plannedById.get(binding.plannedId);
        if (item?.word === word && item.reading === reading) return nonempty(bundles[language]?.plannedMeanings?.[item.id]) ?? getVocabularyCopy(language).pending;
    }
    const item = binding?.canonicalId ? canonicalById.get(binding.canonicalId) : undefined;
    return item ? getVocabularyMeaning(localizeVocabulary(item), language) : getVocabularyCopy(language).pending;
}

export function getVocabularyMeaning(item: VocabularyText, language: AppLanguageCode) {
    if (language === 'ja') return nonempty(item.meaningTranslations?.ja) ?? item.word;
    return nonempty(item.meaningTranslations?.[language])
        ?? (language === 'vi' ? nonempty(item.meaningVi) : undefined)
        ?? (language === 'en' ? nonempty(item.meaningEn) : undefined)
        ?? getVocabularyCopy(language).pending;
}

export function getVocabularyExampleTranslation(item: VocabularyText, language: AppLanguageCode) {
    if (language === 'ja' || !nonempty(item.exampleJa)) return undefined;
    return nonempty(item.exampleTranslations?.[language])
        ?? (language === 'vi' ? nonempty(item.exampleVi) : undefined)
        ?? getVocabularyCopy(language).pending;
}
