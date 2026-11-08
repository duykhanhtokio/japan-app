/* eslint-disable @typescript-eslint/no-require-imports -- Load authored packs only when their API is used. */
import type { AppLanguageCode } from '@/i18n/languages';
import { lazyRecord } from '@/services/lazy-record';
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
const meaningBundles = lazyRecord(() => require('./generated/vocabulary-meaning-localizations.json') as Record<string, { word: string; reading: string; translations: LocalizedText }>);
const exampleBundles = lazyRecord(() => require('./generated/vocabulary-example-localizations.json') as Record<string, { sourceJa: string; translations: LocalizedText }>);
const nonempty = (value?: string) => value?.trim() ? value : undefined;
type TranslationBundle = { locale: string; meanings: Record<string, string>; examples: Record<string, string>; plannedMeanings?: Record<string, string> };
const bundles = lazyRecord(() => ({
    'en': require('./generated/vocabulary-localizations/en.json'),
    'vi': require('./generated/vocabulary-localizations/vi.json'),
    'id': require('./generated/vocabulary-localizations/id.json'),
    'zh-CN': require('./generated/vocabulary-localizations/zh-CN.json'),
    'zh-TW': require('./generated/vocabulary-localizations/zh-TW.json'),
    'hi': require('./generated/vocabulary-localizations/hi.json'),
    'bn': require('./generated/vocabulary-localizations/bn.json'),
    'ne': require('./generated/vocabulary-localizations/ne.json'),
    'my': require('./generated/vocabulary-localizations/my.json'),
    'th': require('./generated/vocabulary-localizations/th.json'),
    'km': require('./generated/vocabulary-localizations/km.json'),
    'tl': require('./generated/vocabulary-localizations/tl.json'),
}) as Partial<Record<AppLanguageCode, TranslationBundle>>);
const source = lazyRecord(() => require('./generated/vocabulary-localization-source.json').canonical as Record<string, { word: string; reading: string; exampleJa?: string }>);
const repairs = lazyRecord(() => require('./generated/vocabulary-source-repairs.json') as Record<string, { originalWord: string; originalReading: string; originalExampleJa?: string; word: string; reading: string; meaningEn?: string; meaningVi?: string; meaningTranslations?: LocalizedText; exampleJa?: string; exampleVi?: string }>);
type PracticalExample = {
    word: string;
    reading: string;
    sourceJa: string;
    translations: Record<Exclude<AppLanguageCode, 'ja'>, string>;
};
const practicalExamples = lazyRecord(() => ({
    ...require('./generated/vocabulary-practical-examples.json').entries,
    ...require('./generated/vocabulary-practical-example-additions.json').entries,
}) as Record<string, PracticalExample>);

function withPracticalExample<T extends VocabularyText>(item: T): T {
    const repair = repairs[item.id];
    if (repair?.word === item.word && repair.reading === item.reading && repair.meaningTranslations) {
        const meaningTranslations = { ...item.meaningTranslations, ...repair.meaningTranslations };
        item = { ...item, meaningTranslations, meaningEn: meaningTranslations.en ?? item.meaningEn,
            meaningVi: meaningTranslations.vi ?? item.meaningVi };
    }
    const example = (require('./generated/vocabulary-practical-example-shards') as typeof import('./generated/vocabulary-practical-example-shards')).getPracticalExampleShardEntry(item.id) ?? practicalExamples[item.id];
    // A changed headword, reading or source sentence must never inherit an old translation.
    if (!example || example.word !== item.word || example.reading !== item.reading
        || (nonempty(item.exampleJa) && item.exampleJa !== example.sourceJa)) return item;
    return { ...item, exampleJa: example.sourceJa, exampleVi: example.translations.vi,
        exampleTranslations: { ...item.exampleTranslations, ...example.translations } };
}

export function getVocabularyCopy(language: AppLanguageCode) {
    return (require('./generated/vocabulary-ui-localizations.json') as typeof import('./generated/vocabulary-ui-localizations.json'))[language];
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
        return withPracticalExample({ ...corrected, meaningEn: meaningTranslations.en ?? corrected.meaningEn, meaningVi: meaningTranslations.vi ?? corrected.meaningVi, meaningTranslations, exampleTranslations });
    }
    const meaning = meaningBundles[item.id];
    const example = exampleBundles[item.id];
    const meaningTranslations = meaning?.word === item.word && meaning.reading === item.reading
        ? { ...item.meaningTranslations, ...meaning.translations }
        : item.meaningTranslations;
    return withPracticalExample({
        ...item,
        meaningVi: nonempty(meaningTranslations?.vi) ?? item.meaningVi,
        meaningTranslations,
        exampleTranslations: example?.sourceJa === item.exampleJa
            ? { ...item.exampleTranslations, ...example.translations }
            : item.exampleTranslations,
    });
}

// Explicitly reviewed word/reading aliases avoid treating homophones as the same word.
type CanonicalWord = (typeof import('./generated/vocabulary.json'))[number];
let canonicalIdIndex: Map<string, CanonicalWord> | undefined;
function canonicalById() {
    return canonicalIdIndex ?? (canonicalIdIndex = new Map(
        (require('./generated/vocabulary.json') as CanonicalWord[]).map(item => [item.id, item]),
    ));
}
const japaneseKey = (word: string, reading: string) => `${word.normalize('NFKC')}|${reading.normalize('NFKC').replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60))}`;
let japaneseIndex: Map<string, CanonicalWord> | undefined;
function canonicalByJapanese() {
    if (!japaneseIndex) {
        const index = new Map<string, CanonicalWord>();
        for (const item of canonicalById().values()) {
            const bound = source[item.id] ?? item;
            const key = japaneseKey(bound.word, bound.reading);
            if (!index.has(key)) index.set(key, item);
        }
        japaneseIndex = index;
    }
    return japaneseIndex;
}
export function findVocabularyByJapanese(word: string, reading: string) {
    const item = canonicalByJapanese().get(japaneseKey(word, reading));
    return item ? localizeVocabulary(item) : undefined;
}
type PlannedWord = (typeof import('./generated/vocabulary-planned-source.json'))[number];
let plannedIdIndex: Map<string, PlannedWord> | undefined;
function plannedById() {
    return plannedIdIndex ?? (plannedIdIndex = new Map(
        (require('./generated/vocabulary-planned-source.json') as PlannedWord[]).map(item => [item.id, item]),
    ));
}
const curriculumBindings = lazyRecord(() => require('./generated/vocabulary-planned-bindings.json') as Record<string, { canonicalId?: string; plannedId?: string }>);
export function getPlannedVocabularyItem(word: string, reading: string) {
    const id = curriculumBindings[`${word}|${reading}`]?.canonicalId;
    const item = id ? canonicalById().get(id) : undefined;
    return item ? localizeVocabulary(item) : undefined;
}
export function getPlannedVocabularyMeaning(word: string, reading: string, language: AppLanguageCode) {
    if (language === 'ja') return word;
    const binding = curriculumBindings[`${word}|${reading}`];
    if (binding?.plannedId) {
        const item = plannedById().get(binding.plannedId);
        if (item?.word === word && item.reading === reading) return nonempty(bundles[language]?.plannedMeanings?.[item.id]) ?? getVocabularyCopy(language).pending;
    }
    const item = binding?.canonicalId ? canonicalById().get(binding.canonicalId) : undefined;
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
