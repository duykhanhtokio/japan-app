import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import type {
    AppLanguageCode,
} from '@/i18n/languages';

import {
    translations,
    type TranslationKey,
} from '@/i18n/translations';
import { setCurrentAppLanguage } from '@/i18n/localization-runtime';

const LANGUAGE_STORAGE_KEY =
    '@japan_app_language';

type LanguageContextValue = {
    language:
    AppLanguageCode;

    loading: boolean;

    setLanguage:
    (
        language:
            AppLanguageCode
    ) => Promise<void>;

    t:
    (
        key:
            TranslationKey
    ) => string;
};

const LanguageContext =
    createContext<
        LanguageContextValue | undefined
    >(undefined);

export function LanguageProvider({
    children,
}: {
    children:
    ReactNode;
}) {
    const [
        language,
        setLanguageState,
    ] =
        useState<AppLanguageCode>(
            'ja'
        );

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    useEffect(() => {
        async function loadLanguage() {
            try {
                const stored =
                    await AsyncStorage.getItem(
                        LANGUAGE_STORAGE_KEY
                    );

                if (stored) {
                    setLanguageState(
                        stored as AppLanguageCode
                    );
                    setCurrentAppLanguage(stored as AppLanguageCode);
                }
            } catch (error) {
                console.log(
                    'Load language error:',
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        loadLanguage();
    }, []);

    const setLanguage =
        useCallback(
            async (
                nextLanguage:
                    AppLanguageCode
            ) => {
                try {
                    await AsyncStorage.setItem(
                        LANGUAGE_STORAGE_KEY,
                        nextLanguage
                    );

                    setLanguageState(
                        nextLanguage
                    );
                    setCurrentAppLanguage(nextLanguage);
                } catch (error) {
                    console.log(
                        'Save language error:',
                        error
                    );
                }
            },
            []
        );

    const t =
        useCallback(
            (
                key:
                    TranslationKey
            ) => {
                return (
                    translations[
                    language
                    ]?.[key] ??
                    translations.en[
                    key
                    ] ??
                    key
                );
            },
            [
                language,
            ]
        );

    const value =
        useMemo(
            () => ({
                language,
                loading,
                setLanguage,
                t,
            }),
            [
                language,
                loading,
                setLanguage,
                t,
            ]
        );

    return (
        <LanguageContext.Provider
            value={value}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useAppLanguage() {
    const context =
        useContext(
            LanguageContext
        );

    if (!context) {
        throw new Error(
            'useAppLanguage must be used inside LanguageProvider'
        );
    }

    return context;
}
