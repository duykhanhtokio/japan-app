import type { AppLanguageCode } from '@/i18n/languages';
import meanings from './generated/vocabulary-meaning-localizations.json';
import examples from './generated/vocabulary-example-localizations.json';
import copyJson from './generated/vocabulary-ui-localizations.json';

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

export function getVocabularyCopy(language: AppLanguageCode) {
    return copyJson[language];
}

export function vocabularyCountText(pattern: string, count: number, language: AppLanguageCode) {
    return pattern.replace('{count}', new Intl.NumberFormat(language).format(count));
}

// Bind additions to the original Japanese spelling/reading, never list position.
export function localizeVocabulary<T extends VocabularyText>(item: T): T {
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
