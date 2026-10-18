import { appLanguages, type AppLanguageCode } from '@/i18n/languages';
import { translations, type TranslationKey } from '@/i18n/translations';
import { translatedUiSource } from './ui-text';

// An interval from À to ỹ also contains Greek, Devanagari, Thai, Burmese
// and Khmer. Enumerate Vietnamese letters instead of swallowing those scripts.
const VIETNAMESE = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/iu;
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
    if (!trimmed || NATIVE_LANGUAGE_NAMES.has(trimmed)) return value;
    const authored = translatedUiSource(value, language);
    if (authored !== undefined) return preserveWhitespace(value, authored);
    if (!VIETNAMESE.test(trimmed)) return value;
    if (language === 'vi') return value;
    const key = VIETNAMESE_KEY_BY_TEXT.get(trimmed);
    if (key) {
        return preserveWhitespace(value, translations[language]?.[key] ?? translations.en[key]);
    }
    // Arbitrary names, dictionary glosses and already-localized content are not
    // Vietnamese UI sources. Never replace them by guessing their language.
    // Legacy Vietnamese content fields use selectedContentTranslation instead.
    return value;
}
