import type { AppLanguageCode } from '@/i18n/languages';

type LocalizedValues = Partial<Record<AppLanguageCode, string>> & {
    ja?: string;
    en?: string;
    vi?: string;
};

/**
 * Chooses content without ever leaking Vietnamese to a non-Vietnamese user.
 * Japanese and English are the only permitted fallbacks.
 */
export function getLocalizedContent(
    language: AppLanguageCode,
    values: LocalizedValues,
): string | undefined {
    if (language === 'vi') {
        return values.vi ?? values.en ?? values.ja;
    }
    if (language === 'ja') {
        return values.ja ?? values.en;
    }
    return values[language] ?? values.en ?? values.ja;
}

export function getLocalizedContentOrEmpty(
    language: AppLanguageCode,
    values: LocalizedValues,
) {
    return getLocalizedContent(language, values) ?? '';
}

export function getLocalizedRecordContent(
    language: AppLanguageCode,
    translations: Partial<Record<string, string>> | undefined,
    values: { ja?: string; en?: string; vi?: string },
) {
    return getLocalizedContent(language, {
        ...values,
        ...(translations ?? {}),
    } as LocalizedValues);
}
