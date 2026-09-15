import { appLanguages, type AppLanguageCode } from '@/i18n/languages';
import { translations, type TranslationKey } from '@/i18n/translations';

const VIETNAMESE = /[À-ỹĐđ]/;
const NATIVE_LANGUAGE_NAMES = new Set(appLanguages.map((item) => item.nativeName));
const VIETNAMESE_KEY_BY_TEXT = new Map<string, TranslationKey>(
    Object.entries(translations.vi).map(([key, value]) => [value, key as TranslationKey]),
);

let currentLanguage: AppLanguageCode = 'ja';

export function setCurrentAppLanguage(language: AppLanguageCode) {
    currentLanguage = language;
}

export function getCurrentAppLanguage() {
    return currentLanguage;
}

function preserveWhitespace(original: string, translated: string) {
    const leading = original.match(/^\s*/)?.[0] ?? '';
    const trailing = original.match(/\s*$/)?.[0] ?? '';
    return `${leading}${translated}${trailing}`;
}

export function localizeRuntimeText(value: string, language = currentLanguage) {
    const trimmed = value.trim();
    if (!trimmed || !VIETNAMESE.test(trimmed) || NATIVE_LANGUAGE_NAMES.has(trimmed)) return value;
    if (language === 'vi') return value;
    const key = VIETNAMESE_KEY_BY_TEXT.get(trimmed);
    if (key) {
        return preserveWhitespace(value, translations[language]?.[key] ?? translations.en[key]);
    }
    return preserveWhitespace(value, language === 'ja' ? '日本語の案内を準備中' : 'Translation pending');
}
