import type { AppLanguageCode } from './languages';
import { translatedUiSource, uiText } from './ui-text';

/** Supporting translation only. Japanese source content is rendered separately. */
export function selectedContentTranslation(language: AppLanguageCode, vietnamese?: string | null,
    translations?: Partial<Record<AppLanguageCode, string>>) {
    if (language === 'ja') return '';
    const exact = translations?.[language];
    if (exact?.trim()) return exact;
    if (language === 'vi') return vietnamese ?? uiText('pending', language);
    // Some legacy data contains UI names for which reviewed copy already exists.
    return (vietnamese ? translatedUiSource(vietnamese, language) : undefined) ?? uiText('pending', language);
}

/** Resolve the locale fields already present in older lesson/module schemas. */
export function legacyFieldTranslation(language: AppLanguageCode, record: object, field: string) {
    const values = record as Record<string, unknown>;
    const pack = values[field + 'Translations'];
    const translations: Partial<Record<AppLanguageCode, string>> = {};
    if (pack && typeof pack === 'object') {
        const value = (pack as Record<string, unknown>)[language];
        if (typeof value === 'string') translations[language] = value;
    }
    const english = values[field + 'En'];
    if (language === 'en' && !translations.en?.trim() && typeof english === 'string') translations.en = english;
    const vietnamese = values[field + 'Vi'];
    return selectedContentTranslation(language, typeof vietnamese === 'string' ? vietnamese : undefined, translations);
}
