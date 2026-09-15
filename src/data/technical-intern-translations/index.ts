import type {
    AppLanguageCode,
} from '@/i18n/languages';

import {
    viTechnicalInternTranslations,
} from './vi';

export type TechnicalInternTranslationDictionary =
    Record<string, string>;

export const technicalInternJobTranslations:
    Partial<
        Record<
            AppLanguageCode,
            TechnicalInternTranslationDictionary
        >
    > = {
    vi:
        viTechnicalInternTranslations,
};