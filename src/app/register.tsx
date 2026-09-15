import { router } from 'expo-router';

import { useState } from 'react';

import {
    Alert,
    ImageBackground,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { SakuraPetalField } from '@/components/ui/SakuraPetalField';
import { RoyalBackButton, RoyalButton, RoyalChevron, RoyalField, RoyalOptionRow, RoyalSelectionMark, RoyalSelectionPanel, RoyalTitlePanel, ROYAL, ROYAL_CONTENT_GROUP, ROYAL_FONT, ROYAL_LAYOUT, ROYAL_PLACEMENT, ROYAL_TYPE, useRoyalPositioning } from '@/components/ui/RoyalSurface';

import {
    appLanguages,
    type AppLanguageCode,
} from '@/i18n/languages';

const JAPANESE_LEVELS = [
    'N5',
    'N4',
    'N3',
    'N2',
    'N1',
    '未受験',
];

export default function RegisterScreen() {
    const royalPosition = useRoyalPositioning();
    const [name, setName] =
        useState('');

    const [level, setLevel] =
        useState('');

    const [country, setCountry] =
        useState('');

    const [email, setEmail] =
        useState('');

    const [
        selectedLanguageCode,
        setSelectedLanguageCode,
    ] =
        useState<
            AppLanguageCode | ''
        >('');

    const [
        levelModalVisible,
        setLevelModalVisible,
    ] =
        useState(false);

    const [
        languageModalVisible,
        setLanguageModalVisible,
    ] =
        useState(false);

    const selectedLanguage =
        selectedLanguageCode
            ? appLanguages.find(
                (item) =>
                    item.code ===
                    selectedLanguageCode
            )
            : undefined;

    const canContinue =
        name.trim().length > 0 &&
        level.length > 0 &&
        country.trim().length > 0 &&
        /^\S+@\S+\.\S+$/.test(email.trim()) &&
        selectedLanguageCode !== '';

    async function handleNext() {
        if (!canContinue) {
            Alert.alert(
                '入力エラー',
                'すべての必須項目を入力してください。'
            );

            return;
        }

        router.push({
            pathname:
                '/register/work',

            params: {
                name:
                    name.trim(),

                level,

                country:
                    country.trim(),

                email:
                    email.trim(),

                language:
                    selectedLanguageCode,
            },
        });
    }

    return (
        <ImageBackground
            source={require(
                '../../assets/app/registration/registration-bg.jpg'
            )}
            style={styles.background}
            resizeMode="cover"
        >
            <View
                pointerEvents="none"
                style={styles.overlay}
            />

            <SakuraPetalField />

            <SafeAreaView
                style={styles.container}
            >
                <ScrollView
                contentContainerStyle={[styles.content,royalPosition.contentStyle]}
                    showsVerticalScrollIndicator={
                        false
                    }
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.headerTop}>
                        <RoyalBackButton onPress={() => router.back()} />
                    </View>
                    <RoyalTitlePanel sizingGroup={ROYAL_CONTENT_GROUP.registrationHeader} style={[styles.titlePanel,royalPosition.fullWidthStyle]}>
                        <View style={styles.titleCopy}>
                            <Text maxFontSizeMultiplier={1} style={styles.title}>学習者登録</Text>
                            <Text maxFontSizeMultiplier={1} style={styles.titleDescription}>あなたに合った学習内容を作成します{`\n`}基本情報を入力してください</Text>
                        </View>
                    </RoyalTitlePanel>
                    <View style={styles.progressRow}>
                        <View style={styles.progressBlock}>
                            <Text style={styles.step}>1 / 2</Text>
                        </View>
                    </View>
                    <View style={styles.flexSpacer} />
                    <View style={styles.fieldsArea}>
                        {/* NAME */}

                        <RoyalField compact sizingGroup={ROYAL_CONTENT_GROUP.registrationField} label="氏名 *" style={styles.field}>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={
                                setName
                            }
                            placeholder="氏名を入力"
                            placeholderTextColor="#9ca7b4"
                            keyboardType="ascii-capable"
                            autoCapitalize="words"
                            autoCorrect={false}
                            spellCheck={false}
                        />
                        </RoyalField>

                        {/* LEVEL */}

                        <RoyalField compact sizingGroup={ROYAL_CONTENT_GROUP.registrationField} label="日本語レベル *" style={styles.field}>
                        <Pressable
                            style={
                                styles.selector
                            }
                            onPress={() =>
                                setLevelModalVisible(
                                    true
                                )
                            }
                        >
                            <Text
                                style={[
                                    styles.selectorText,

                                    !level &&
                                    styles.placeholder,
                                ]}
                            >
                                {level ||
                                    '日本語レベルを選択'}
                            </Text>

                            <RoyalChevron direction="down" variant="selector" />
                        </Pressable>
                        </RoyalField>

                        {/* COUNTRY */}

                        <RoyalField compact sizingGroup={ROYAL_CONTENT_GROUP.registrationField} label="国籍 *" style={styles.field}>
                        <TextInput
                            style={styles.input}
                            value={country}
                            onChangeText={
                                setCountry
                            }
                            placeholder="例：ベトナム"
                            placeholderTextColor="#9ca7b4"
                            keyboardType="ascii-capable"
                            autoCapitalize="words"
                            autoCorrect={false}
                            spellCheck={false}
                        />
                        </RoyalField>

                        {/* EMAIL */}

                        <RoyalField compact sizingGroup={ROYAL_CONTENT_GROUP.registrationField} label="メールアドレス *" style={styles.field}>
                        <View style={styles.emailRow}><TextInput
                            style={[styles.input, styles.emailInput]}
                            value={email}
                            onChangeText={(value) => setEmail(value.replace(/[＠﹫]/g, '@'))}
                            placeholder="name@example.com"
                            placeholderTextColor="#9ca7b4"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            spellCheck={false}
                            autoComplete="email"
                            importantForAutofill="yes"
                            textContentType="emailAddress"
                        /><Pressable accessibilityRole="button" accessibilityLabel="アットマークを入力" onPress={() => setEmail((value) => `${value}@`)} style={styles.atButton}><Text style={styles.atButtonText}>@</Text></Pressable></View>
                        </RoyalField>

                        {/* LANGUAGE */}

                        <RoyalField compact sizingGroup={ROYAL_CONTENT_GROUP.registrationField} label="表示言語 *" style={styles.field}>
                        <Pressable
                            style={
                                styles.selector
                            }
                            onPress={() =>
                                setLanguageModalVisible(
                                    true
                                )
                            }
                        >
                            <Text
                                style={[
                                    styles.selectorText,

                                    !selectedLanguage &&
                                    styles.placeholder,
                                ]}
                            >
                                {selectedLanguage
                                    ? `${selectedLanguage.flag}  ${selectedLanguage.japaneseName}`
                                    : '表示言語を選択'}
                            </Text>

                            <RoyalChevron direction="down" variant="selector" />
                        </Pressable>
                        </RoyalField>

                        <Text
                            style={
                                styles.languageHelp
                            }
                        >
                            選択した言語は、登録完了後の画面から使用されます。
                        </Text>

                        {/* NEXT */}

                        <RoyalButton sizingGroup={ROYAL_CONTENT_GROUP.registrationAction} disabled={!canContinue} style={styles.nextButton} onPress={handleNext}>
                            <Text
                                style={
                                    styles.nextButtonText
                                }
                            >
                                次へ
                            </Text>

                        </RoyalButton>
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* LEVEL MODAL */}

            <SelectionModal
                visible={
                    levelModalVisible
                }
                title="日本語レベル"
                onClose={() =>
                    setLevelModalVisible(
                        false
                    )
                }
            >
                {JAPANESE_LEVELS.map(
                    (item) => (
                        <RoyalOptionRow
                            sizingGroup={ROYAL_CONTENT_GROUP.registrationChoiceOption}
                            key={item}
                            style={styles.modalRow}
                            onPress={() => {
                                setLevel(
                                    item
                                );

                                setLevelModalVisible(
                                    false
                                );
                            }}
                        >
                            <Text
                                style={
                                    styles.modalRowText
                                }
                            >
                                {item}
                            </Text>

                            {level ===
                                item && <RoyalSelectionMark />}
                        </RoyalOptionRow>
                    )
                )}
            </SelectionModal>

            {/* LANGUAGE MODAL */}

            <SelectionModal
                visible={
                    languageModalVisible
                }
                title="言語を選択"
                helper="上にスワイプすると、下の言語も表示できます。"
                onClose={() =>
                    setLanguageModalVisible(
                        false
                    )
                }
            >
                {appLanguages.map(
                    (item) => (
                        <RoyalOptionRow
                            sizingGroup={ROYAL_CONTENT_GROUP.registrationChoiceOption}
                            key={
                                item.code
                            }
                            style={styles.languageRow}
                            onPress={() => {
                                setSelectedLanguageCode(
                                    item.code
                                );

                                setLanguageModalVisible(
                                    false
                                );
                            }}
                        >
                            <Text
                                style={
                                    styles.flag
                                }
                            >
                                {item.flag}
                            </Text>

                            <View
                                style={
                                    styles.languageInfo
                                }
                            >
                                <Text
                                    style={
                                        styles.languageNative
                                    }
                                >
                                    {
                                        item.japaneseName
                                    }
                                </Text>

                            </View>

                            {selectedLanguageCode ===
                                item.code && <RoyalSelectionMark />}
                        </RoyalOptionRow>
                    )
                )}
            </SelectionModal>
        </ImageBackground>
    );
}

function SelectionModal({
    visible,
    title,
    helper,
    onClose,
    children,
}: {
    visible: boolean;

    title: string;

    helper?: string;

    onClose: () => void;

    children:
    React.ReactNode;
}) {
    const royalPosition = useRoyalPositioning();
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={
                onClose
            }
        >
            <View
                style={
                    styles.modalBackdrop
                }
            >
                <RoyalSelectionPanel style={[styles.modalCard,royalPosition.modalStyle]}>
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
                            {title}
                        </Text>

                    </View>

                    {!!helper && (
                        <Text maxFontSizeMultiplier={1} style={styles.modalHelper}>
                            {helper}
                        </Text>
                    )}

                    <ScrollView
                        style={styles.modalList}
                        showsVerticalScrollIndicator={
                            false
                        }
                    >
                        {children}
                    </ScrollView>
                </RoyalSelectionPanel>
            </View>
        </Modal>
    );
}

const styles =
    StyleSheet.create({
        background: {
            flex: 1,
        },

        overlay: {
            position:
                'absolute',

            top: 0,
            right: 0,
            bottom: 0,
            left: 0,

            backgroundColor:
                'rgba(5,20,35,0.09)',
        },

        container: {
            flex: 1,
        },

        content: {
            flexGrow: 1,
            alignSelf:'center',
            paddingTop: ROYAL_PLACEMENT.headerTop,
            paddingBottom: 4,
        },
        headerTop:{height:ROYAL_LAYOUT.backTouch,alignItems:'flex-start',justifyContent:'center'},
        titlePanel:{width:'100%',minHeight:ROYAL_LAYOUT.registrationHeaderHeight,paddingTop:18,paddingBottom:18},
        progressRow:{alignItems:'center',marginTop:0},
        progressBlock:{width:78,alignItems:'center'},
        flexSpacer:{flexGrow:1,minHeight:0},fieldsArea:{width:'100%'},

        step: {
            color:
                ROYAL.paleGold,

            fontSize: 15,

            fontFamily: ROYAL_FONT.body,

            fontWeight:
                '900',

            letterSpacing:
                .5,
        },

        title: {
            width:'100%',
            color:
                ROYAL.paleGold,

            fontSize: ROYAL_TYPE.pageTitle,

            fontFamily: ROYAL_FONT.heading,

            fontWeight:
                '900',

            textShadowColor:'#503716',textShadowOffset:{width:0,height:2},textShadowRadius:4,
            lineHeight:36,textAlign:'center',textAlignVertical:'center',includeFontPadding:false,
        },

        titleCopy:{width:'100%',alignItems:'center',justifyContent:'center',paddingVertical:10,paddingHorizontal:40},
        titleDescription:{width:'100%',marginTop:3,color:'#fff7e5',fontSize:10.5,lineHeight:15,fontFamily:ROYAL_FONT.body,textAlign:'center',textAlignVertical:'center',includeFontPadding:false,textShadowColor:'rgba(0,0,0,.55)',textShadowOffset:{width:0,height:1},textShadowRadius:3},

        subtitle: {
            color:
                '#fff7e5',

            fontSize: 13,fontFamily:ROYAL_FONT.body,marginTop:3,textShadowColor:'rgba(0,0,0,.55)',textShadowOffset:{width:0,height:1},textShadowRadius:3,
        },

        field:{marginBottom:ROYAL_PLACEMENT.fieldGap,minHeight:ROYAL_LAYOUT.registrationFieldHeight},

        label: {
            color:
                '#214e60',

            fontSize: 16,

            fontWeight:
                '800',

            marginTop: 15,

            marginBottom: 6,
        },

        input: {
            height: ROYAL_LAYOUT.registrationContentHeight,

            borderRadius:
                12,

            backgroundColor:'transparent',

            color:
                '#214e60',

            paddingHorizontal:
                13,

            fontSize: ROYAL_TYPE.fieldValue,
            fontFamily: ROYAL_FONT.body,
        },

        emailRow: { flexDirection: 'row', alignItems: 'center', minHeight: ROYAL_LAYOUT.registrationContentHeight },
        emailInput: { flex: 1, minWidth: 0 },
        atButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
        atButtonText: { color: ROYAL.paleGold, fontFamily: ROYAL_FONT.body, fontSize: 20, lineHeight: 24 },

        selector: {
            minHeight: ROYAL_LAYOUT.registrationContentHeight,

            borderRadius:
                12,

            backgroundColor:'transparent',

            paddingHorizontal:
                13,

            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'space-between',
        },

        selectorText: {
            flex: 1,

            color:
                '#214e60',

            fontSize: ROYAL_TYPE.fieldValue,

            fontFamily: ROYAL_FONT.body,

            fontWeight:
                '700',
            lineHeight: 25,
            textAlignVertical: 'center',
            includeFontPadding: false,
        },

        placeholder: {
            color:
                '#9ca7b4',

            fontWeight:
                '400',
        },

        languageHelp: {
            color:'#fff7df',

            fontSize: 11,fontFamily:ROYAL_FONT.body,marginTop:0,lineHeight:15,textAlign:'center',textShadowColor:'rgba(0,0,0,.7)',textShadowOffset:{width:0,height:1},textShadowRadius:3,
        },

        nextButton: {
            marginTop: ROYAL_PLACEMENT.actionTopGap,
            minHeight: ROYAL_LAYOUT.actionHeight,
        },

        nextButtonDisabled: {
            backgroundColor:
                '#3b4350',

            opacity: 0.50,
        },

        nextButtonText: {
            color:
                ROYAL.paleGold,

            fontSize: 22,

            lineHeight: 33,

            width: '100%',

            textAlign: 'center',

            textAlignVertical: 'center',

            includeFontPadding: false,

            fontFamily: ROYAL_FONT.heading,

            fontWeight:
                '900',
        },

        nextArrow: {
            width: 30,
            height: 38,
            marginLeft: 5,
        },

        pressed: {
            opacity: 0.60,
        },

        modalBackdrop: {
            flex: 1,

            justifyContent:
                'flex-end',

            backgroundColor:
                'rgba(8,31,47,0.42)',
            paddingBottom: ROYAL_PLACEMENT.modalBottom,
        },

        modalCard: { alignSelf:'center' },

        modalHeader: {
            width:'100%',height:ROYAL_LAYOUT.selectorHeaderHeight,alignItems:'center',justifyContent:'center',marginBottom:ROYAL_PLACEMENT.modalHeaderGap,
        },

        modalList:{width:'100%',flexShrink:1,overflow:'hidden'},

        modalHelper:{width:'100%',minHeight:34,flexShrink:0,marginTop:-7,marginBottom:7,paddingHorizontal:16,color:'#725d3b',fontSize:10,lineHeight:14,fontFamily:ROYAL_FONT.body,textAlign:'center',textAlignVertical:'center',includeFontPadding:false},

        modalTitle: {
            width:'100%',
            color:
                ROYAL.lacquer,

            fontSize: 20,

            fontFamily: ROYAL_FONT.heading,

            fontWeight:
                '900',
            lineHeight:28,textAlign:'center',textAlignVertical:'center',includeFontPadding:false,
        },

        modalRow: {
            minHeight: ROYAL_LAYOUT.selectorRowHeight,
            marginBottom: 1,
        },

        modalRowSelected: { opacity:.82 },

        modalRowText: {
            color:
                '#254e60',

            fontSize: ROYAL_TYPE.option,

            fontFamily: ROYAL_FONT.body,

            fontWeight:
                '800',
        },

        languageRow: {
            minHeight: ROYAL_LAYOUT.selectorRowHeight,
            marginBottom: 1,
        },

        flag: {
            width: 43,

            fontSize: 25,
        },

        languageInfo: {
            flex: 1,
        },

        languageNative: {
            color:
                '#254e60',

            fontSize: ROYAL_TYPE.option,

            fontFamily: ROYAL_FONT.body,

            fontWeight:
                '800',
        },

        languageJapanese: {
            color:
                '#6e8792',

            fontSize: ROYAL_TYPE.optionSecondary,

            fontFamily: ROYAL_FONT.body,

            marginTop: 2,
        },

    });
