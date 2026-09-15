import {
    router,
} from 'expo-router';

import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

import {
    useState,
} from 'react';

import {
    useAppLanguage,
} from '@/context/LanguageContext';

import {
    appLanguages,
    getLanguage,
    type AppLanguageCode,
} from '@/i18n/languages';

export default function SettingsScreen() {
    const {
        language,
        setLanguage,
        t,
    } =
        useAppLanguage();

    const [
        modalVisible,
        setModalVisible,
    ] =
        useState(false);

    const currentLanguage =
        getLanguage(
            language
        );

    async function selectLanguage(
        nextLanguage:
            AppLanguageCode
    ) {
        await setLanguage(
            nextLanguage
        );

        setModalVisible(
            false
        );

        Alert.alert(
            t(
                'settings.title'
            ),

            t(
                'settings.saved'
            )
        );
    }

    return (
        <SafeAreaView
            style={
                styles.container
            }
        >
            <View
                style={
                    styles.header
                }
            >
                <RoyalBackButton onPress={() => router.back()} />

                <Text
                    style={
                        styles.title
                    }
                >
                    {t(
                        'settings.title'
                    )}
                </Text>
            </View>

            <View
                style={
                    styles.content
                }
            >
                <Text
                    style={
                        styles.sectionTitle
                    }
                >
                    {t(
                        'settings.language'
                    )}
                </Text>

                <Pressable
                    style={
                        styles.languageCard
                    }
                    onPress={() =>
                        setModalVisible(
                            true
                        )
                    }
                >
                    <View
                        style={
                            styles.languageLeft
                        }
                    >
                        <Text
                            style={
                                styles.flag
                            }
                        >
                            {
                                currentLanguage?.flag
                            }
                        </Text>

                        <View>
                            <Text
                                style={
                                    styles.languageName
                                }
                            >
                                {
                                    currentLanguage?.nativeName
                                }
                            </Text>

                            <Text
                                style={
                                    styles.description
                                }
                            >
                                {t(
                                    'settings.languageDescription'
                                )}
                            </Text>
                        </View>
                    </View>

                    <Text
                        style={
                            styles.arrow
                        }
                    >
                        ›
                    </Text>
                </Pressable>
            </View>

            <Modal
                visible={
                    modalVisible
                }
                transparent
                animationType="slide"
                onRequestClose={() =>
                    setModalVisible(
                        false
                    )
                }
            >
                <View
                    style={
                        styles.modalBackdrop
                    }
                >
                    <View
                        style={
                            styles.modal
                        }
                    >
                        <View
                            style={
                                styles.modalHeader
                            }
                        >
                            <Text
                                style={
                                    styles.modalTitle
                                }
                            >
                                {t(
                                    'common.language'
                                )}
                            </Text>

                            <Pressable
                                onPress={() =>
                                    setModalVisible(
                                        false
                                    )
                                }
                            >
                                <Text
                                    style={
                                        styles.close
                                    }
                                >
                                    ✕
                                </Text>
                            </Pressable>
                        </View>

                        <ScrollView>
                            {appLanguages.map(
                                (
                                    item
                                ) => (
                                    <Pressable
                                        key={
                                            item.code
                                        }
                                        style={[
                                            styles.row,

                                            language ===
                                            item.code &&
                                            styles.selectedRow,
                                        ]}
                                        onPress={() =>
                                            selectLanguage(
                                                item.code
                                            )
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.rowFlag
                                            }
                                        >
                                            {
                                                item.flag
                                            }
                                        </Text>

                                        <View
                                            style={{
                                                flex: 1,
                                            }}
                                        >
                                            <Text
                                                style={
                                                    styles.rowName
                                                }
                                            >
                                                {
                                                    item.nativeName
                                                }
                                            </Text>

                                            <Text
                                                style={
                                                    styles.rowJapanese
                                                }
                                            >
                                                {
                                                    item.japaneseName
                                                }
                                            </Text>
                                        </View>

                                        {language ===
                                            item.code && (
                                                <Text
                                                    style={
                                                        styles.check
                                                    }
                                                >
                                                    ✓
                                                </Text>
                                            )}
                                    </Pressable>
                                )
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,

            backgroundColor:
                '#101827',
        },

        header: {
            height: 60,

            flexDirection: 'row',

            alignItems: 'center',

            paddingHorizontal: 18,
        },

        backButton: {
            width: 40,

            marginRight: 10,
        },

        back: {
            color: '#ffffff',

            fontSize: 25,
        },

        title: {
            color: '#ffffff',

            fontSize: 23,

            fontWeight: '900',
        },

        content: {
            padding: 18,
        },

        sectionTitle: {
            color: '#aab4c4',

            fontSize: 16,

            fontWeight: '800',

            marginBottom: 8,
        },

        languageCard: {
            minHeight: 75,

            borderRadius: 17,

            backgroundColor:
                '#202a40',

            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',

            padding: 14,
        },

        languageLeft: {
            flex: 1,

            flexDirection: 'row',

            alignItems: 'center',
        },

        flag: {
            fontSize: 29,

            width: 45,
        },

        languageName: {
            color: '#ffffff',

            fontSize: 16,

            fontWeight: '900',
        },

        description: {
            color: '#8994a5',

            fontSize: 15,

            marginTop: 4,
        },

        arrow: {
            color: '#ffffff',

            fontSize: 26,
        },

        modalBackdrop: {
            flex: 1,

            justifyContent:
                'flex-end',

            backgroundColor:
                'rgba(0,0,0,0.58)',
        },

        modal: {
            maxHeight: '78%',

            borderTopLeftRadius:
                26,

            borderTopRightRadius:
                26,

            backgroundColor:
                '#151d2b',

            padding: 18,

            paddingBottom: 30,
        },

        modalHeader: {
            flexDirection: 'row',

            justifyContent:
                'space-between',

            alignItems: 'center',

            marginBottom: 12,
        },

        modalTitle: {
            color: '#ffffff',

            fontSize: 20,

            fontWeight: '900',
        },

        close: {
            color: '#ffffff',

            fontSize: 20,
        },

        row: {
            minHeight: 60,

            borderRadius: 14,

            paddingHorizontal: 12,

            flexDirection: 'row',

            alignItems: 'center',

            marginBottom: 7,

            backgroundColor:
                '#202a40',

            borderWidth: 1,

            borderColor:
                'transparent',
        },

        selectedRow: {
            backgroundColor:
                '#2b2945',

            borderColor:
                '#ff659e',
        },

        rowFlag: {
            width: 42,

            fontSize: 24,
        },

        rowName: {
            color: '#ffffff',

            fontSize: 16,

            fontWeight: '800',
        },

        rowJapanese: {
            color: '#8994a5',

            fontSize: 15,

            marginTop: 2,
        },

        check: {
            color: '#ff659e',

            fontSize: 18,

            fontWeight: '900',
        },
    });
