import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    useRef,
} from 'react';

import type {
    AppLanguageCode,
} from '@/i18n/languages';

import {
    translations,
    type TranslationKey,
} from '@/i18n/translations';
import { setCurrentAppLanguage } from '@/i18n/localization-runtime';
import { isAppLanguageCode } from '@/i18n/languages';

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
    const selectionVersion = useRef(0);
    const storageWrite = useRef(Promise.resolve());
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
            const version = selectionVersion.current;
            try {
                const stored =
                    await AsyncStorage.getItem(
                        LANGUAGE_STORAGE_KEY
                    );

                if (selectionVersion.current === version) {
                    const restored = isAppLanguageCode(stored) ? stored : 'ja';
                    setLanguageState(restored);
                    setCurrentAppLanguage(restored);
                }
            } catch (error) {
                if (selectionVersion.current === version) {
                    setLanguageState('ja');
                    setCurrentAppLanguage('ja');
                }
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
                if (!isAppLanguageCode(nextLanguage)) return;
                selectionVersion.current += 1;
                setCurrentAppLanguage(nextLanguage);
                setLanguageState(nextLanguage);
                // Selection is immediate even if persistence fails. Serialize writes
                // so rapid switches cannot restore an older locale on next launch.
                storageWrite.current = storageWrite.current.catch(() => {}).then(() =>
                    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
                ).catch(error => console.log('Save language error:', error));
                await storageWrite.current;
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
