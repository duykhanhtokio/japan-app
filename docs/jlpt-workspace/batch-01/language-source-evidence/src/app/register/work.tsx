import {
    router,
    useLocalSearchParams,
} from 'expo-router';

import { useState } from 'react';

import {
    Alert,
    ImageBackground,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { SakuraPetalField } from '@/components/ui/SakuraPetalField';
import { RoyalBackButton, RoyalButton, RoyalChevron, RoyalField, RoyalInfoPanel, RoyalOptionRow, RoyalSelectionPanel, RoyalTitlePanel, ROYAL, ROYAL_CONTENT_GROUP, ROYAL_FONT, ROYAL_LAYOUT, ROYAL_PLACEMENT, ROYAL_SAFE_AREA, ROYAL_TYPE, useRoyalPositioning } from '@/components/ui/RoyalSurface';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import {
    useAppLanguage,
} from '@/context/LanguageContext';
import { appLanguages, type AppLanguageCode } from '@/i18n/languages';

import {
    getLocalizedGroupName,
    getLocalizedOccupationName,
    getLocalizedOperationName,
    technicalInternJobGroups,
    type TechnicalInternJobGroup,
    type TechnicalInternOccupation,
    type TechnicalInternOperation,
} from '@/data/technical-intern-jobs';

import {
    getRegistrationWorkCopy,
} from '@/i18n/registration-work-copy';

import {
    useUserProfile,
} from '@/hooks/useUserProfile';

const GUIDE_LABEL: Record<AppLanguageCode, string> = {
    ja:'ご案内', en:'Guidance', vi:'Hướng dẫn', id:'Panduan', 'zh-CN':'说明', 'zh-TW':'說明',
    hi:'मार्गदर्शन', bn:'নির্দেশনা', ne:'मार्गदर्शन', my:'လမ်းညွှန်', th:'คำแนะนำ', km:'ការណែនាំ', tl:'Gabay',
};

export default function RegistrationWorkScreen() {
    const royalPosition = useRoyalPositioning();
    const params =
        useLocalSearchParams<{
            name?: string;

            level?: string;

            country?: string;

            email?: string;

            language?: string;
        }>();

    const {
        setLanguage,
    } =
        useAppLanguage();

    const selectedLanguage = appLanguages.some((item) => item.code === params.language)
        ? params.language as AppLanguageCode
        : 'ja';

    const language = selectedLanguage;

    const {
        saveProfile,
    } =
        useUserProfile();

    const copy = getRegistrationWorkCopy(language);
    const japaneseCopy = getRegistrationWorkCopy('ja');
    const bilingual = (japanese: string, localized: string) =>
        language === 'ja' || japanese === localized ? japanese : `${japanese}\n${localized}`;

    const [
        selectedGroup,
        setSelectedGroup,
    ] =
        useState<
            TechnicalInternJobGroup | undefined
        >();

    const [
        selectedOccupation,
        setSelectedOccupation,
    ] =
        useState<
            TechnicalInternOccupation | undefined
        >();

    const [
        selectedOperation,
        setSelectedOperation,
    ] =
        useState<
            TechnicalInternOperation | undefined
        >();

    const [
        groupModalVisible,
        setGroupModalVisible,
    ] =
        useState(false);

    const [
        occupationModalVisible,
        setOccupationModalVisible,
    ] =
        useState(false);

    const [
        operationModalVisible,
        setOperationModalVisible,
    ] =
        useState(false);

    const canComplete =
        !!selectedGroup &&
        !!selectedOccupation &&
        !!selectedOperation;

    const localizedGroupName =
        selectedGroup
            ? getLocalizedGroupName(
                selectedGroup,
                language
            )
            : '';

    const localizedOccupationName =
        selectedOccupation
            ? getLocalizedOccupationName(
                selectedOccupation,
                language
            )
            : '';

    const localizedOperationName =
        selectedOperation
            ? getLocalizedOperationName(
                selectedOperation,
                language
            )
            : '';

    function selectGroup(
        group:
            TechnicalInternJobGroup
    ) {
        setSelectedGroup(
            group
        );

        /*
         * Parent đổi thì child reset.
         */

        setSelectedOccupation(
            undefined
        );

        setSelectedOperation(
            undefined
        );

        setGroupModalVisible(
            false
        );
    }

    function selectOccupation(
        occupation:
            TechnicalInternOccupation
    ) {
        setSelectedOccupation(
            occupation
        );

        setSelectedOperation(
            undefined
        );

        setOccupationModalVisible(
            false
        );
    }

    function selectOperation(
        operation:
            TechnicalInternOperation
    ) {
        setSelectedOperation(
            operation
        );

        setOperationModalVisible(
            false
        );
    }

    async function completeRegistration() {
        if (
            !canComplete ||
            !selectedGroup ||
            !selectedOccupation ||
            !selectedOperation
        ) {
            Alert.alert(
                bilingual(japaneseCopy.title, copy.title),
                bilingual(japaneseCopy.required, copy.required)
            );

            return;
        }

        await setLanguage(selectedLanguage);

        await saveProfile({
            name:
                params.name ??
                '',

            level:
                params.level ??
                '',

            country:
                params.country ??
                '',

            /*
             * Legacy.
             * Sau này Profile sẽ đọc trực tiếp
             * jobOccupationId/jobOperationId.
             */
            occupationId:
                'OTHER',

            jobCategoryId:
                selectedGroup.id,

            jobCategoryJa:
                selectedGroup.nameJa,

            jobOccupationId:
                selectedOccupation.code,

            jobOccupationJa:
                selectedOccupation.nameJa,

            jobOperationId:
                selectedOperation.code,

            jobOperationJa:
                selectedOperation.nameJa,

            /*
             * V2 không hỏi description nữa.
             */

            jobDescription:
                '',

            email:
                params.email ?? '',

            createdAt:
                new Date().toISOString(),
        });

        router.replace(
            '/npc-starter'
        );
    }

    return (
        <ImageBackground
            source={require('../../../assets/app/registration/registration-bg.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
        <View pointerEvents="none" style={styles.overlay} />
        <SakuraPetalField />
        <SafeAreaView
            style={
                styles.container
            }
            edges={[
                'top',
                'bottom',
            ]}
        >
            <ScrollView
                contentContainerStyle={[styles.content,royalPosition.contentStyle]}
                showsVerticalScrollIndicator={
                    false
                }
            >
                <View style={styles.headerTop}>
                    <RoyalBackButton onPress={() => router.back()} />
                </View>
                <RoyalTitlePanel sizingGroup={ROYAL_CONTENT_GROUP.registrationHeader} style={[styles.titlePanel,royalPosition.fullWidthStyle]}>
                    <View style={styles.titleCopy}>
                        <Text maxFontSizeMultiplier={1} style={styles.title}>{japaneseCopy.title}</Text>
                        {language !== 'ja' && (
                            <Text maxFontSizeMultiplier={1} style={styles.titleLocalized}>{copy.title}</Text>
                        )}
                    </View>
                </RoyalTitlePanel>
                <View style={styles.progressRow}>
                    <View style={styles.progressBlock}>
                        <Text style={styles.step}>2 / 2</Text>
                    </View>
                </View>

                <RoyalInfoPanel sizingGroup={ROYAL_CONTENT_GROUP.registrationGuide} label={bilingual('ご案内', GUIDE_LABEL[language])} style={styles.infoPanel}>
                    <View style={styles.infoRow}>
                        <Text maxFontSizeMultiplier={1} style={styles.subtitle}>{bilingual(japaneseCopy.subtitle, copy.subtitle)}</Text>
                    </View>
                </RoyalInfoPanel>
                <View style={styles.flexSpacer} />
                <View style={styles.fieldsArea}>

                {/* ====================
                    CATEGORY
                ==================== */}

                <RoyalField compact sizingGroup={ROYAL_CONTENT_GROUP.registrationField} label={`${japaneseCopy.category} *`} style={styles.field}>
                <Pressable
                    style={
                        styles.selector
                    }
                    onPress={() =>
                        setGroupModalVisible(
                            true
                        )
                    }
                >
                    <View
                        style={
                            styles.selectorContent
                        }
                    >
                        {selectedGroup ? (
                            <>
                                <Text
                                    maxFontSizeMultiplier={1}
                                    style={
                                        styles.selectorPrimary
                                    }
                                >
                                    {
                                        localizedGroupName
                                    }
                                </Text>

                                {language !==
                                    'ja' && (
                                        <Text
                                            maxFontSizeMultiplier={1}
                                            style={
                                                styles.selectorJapanese
                                            }
                                        >
                                            {
                                                selectedGroup.nameJa
                                            }
                                        </Text>
                                    )}
                            </>
                        ) : (
                            <Text
                                maxFontSizeMultiplier={1}
                                style={
                                    styles.selectorPlaceholder
                                }
                            >
                                {
                                    bilingual(japaneseCopy.selectCategory, copy.selectCategory)
                                }
                            </Text>
                        )}
                    </View>

                    <RoyalChevron direction="down" variant="selector" />
                </Pressable>
                </RoyalField>

                {/* ====================
                    OCCUPATION
                ==================== */}

                <RoyalField compact sizingGroup={ROYAL_CONTENT_GROUP.registrationField} label={`${japaneseCopy.occupation} *`} style={styles.field}>
                <Pressable
                    disabled={
                        !selectedGroup
                    }
                    style={[
                        styles.selector,

                        !selectedGroup &&
                        styles.selectorDisabled,
                    ]}
                    onPress={() =>
                        setOccupationModalVisible(
                            true
                        )
                    }
                >
                    <View
                        style={
                            styles.selectorContent
                        }
                    >
                        {selectedOccupation ? (
                            <>
                                <Text
                                    maxFontSizeMultiplier={1}
                                    style={
                                        styles.selectorPrimary
                                    }
                                >
                                    {
                                        localizedOccupationName
                                    }
                                </Text>

                                {language !==
                                    'ja' && (
                                        <Text
                                            maxFontSizeMultiplier={1}
                                            style={
                                                styles.selectorJapanese
                                            }
                                        >
                                            {
                                                selectedOccupation.nameJa
                                            }
                                        </Text>
                                    )}
                            </>
                        ) : (
                            <Text
                                maxFontSizeMultiplier={1}
                                style={
                                    styles.selectorPlaceholder
                                }
                            >
                                {
                                    bilingual(japaneseCopy.selectOccupation, copy.selectOccupation)
                                }
                            </Text>
                        )}

                    </View>

                    <RoyalChevron direction="down" variant="selector" />
                </Pressable>
                </RoyalField>

                {/* ====================
                    OPERATION
                ==================== */}

                <RoyalField compact sizingGroup={ROYAL_CONTENT_GROUP.registrationField} label={`${japaneseCopy.operation} *`} style={styles.field}>
                <Pressable
                    disabled={
                        !selectedOccupation
                    }
                    style={[
                        styles.selector,

                        !selectedOccupation &&
                        styles.selectorDisabled,
                    ]}
                    onPress={() =>
                        setOperationModalVisible(
                            true
                        )
                    }
                >
                    <View
                        style={
                            styles.selectorContent
                        }
                    >
                        {selectedOperation ? (
                            <>
                                <Text
                                    maxFontSizeMultiplier={1}
                                    style={
                                        styles.selectorPrimary
                                    }
                                >
                                    {
                                        localizedOperationName
                                    }
                                </Text>

                                {language !==
                                    'ja' && (
                                        <Text
                                            maxFontSizeMultiplier={1}
                                            style={
                                                styles.selectorJapanese
                                            }
                                        >
                                            {
                                                selectedOperation.nameJa
                                            }
                                        </Text>
                                    )}

                                {selectedOperation.thirdStageEligible ===
                                    false && (
                                        <Text
                                            maxFontSizeMultiplier={1}
                                            style={
                                                styles.notStage3
                                            }
                                        >
                                            {
                                                bilingual(japaneseCopy.notStage3Eligible, copy.notStage3Eligible)
                                            }
                                        </Text>
                                    )}
                            </>
                        ) : (
                            <Text
                                maxFontSizeMultiplier={1}
                                style={
                                    styles.selectorPlaceholder
                                }
                            >
                                {
                                    bilingual(japaneseCopy.selectOperation, copy.selectOperation)
                                }
                            </Text>
                        )}

                    </View>

                    <RoyalChevron direction="down" variant="selector" />
                </Pressable>
                </RoyalField>

                {/* COMPLETE */}

                <RoyalButton sizingGroup={ROYAL_CONTENT_GROUP.registrationAction} disabled={!canComplete} style={styles.completeButton} onPress={completeRegistration}>
                    <Text maxFontSizeMultiplier={1} style={styles.completeButtonText}>
                        {bilingual(japaneseCopy.complete, copy.complete)}
                    </Text>
                </RoyalButton>
                </View>
            </ScrollView>

            {/* ====================
                GROUP MODAL
            ==================== */}

            <TreeModal
                visible={
                    groupModalVisible
                }
                title={
                    bilingual(japaneseCopy.category, copy.category)
                }
                onClose={() =>
                    setGroupModalVisible(
                        false
                    )
                }
            >
                {technicalInternJobGroups.map(
                    (group) => (
                        <RoyalOptionRow
                            sizingGroup={ROYAL_CONTENT_GROUP.workChoiceOption}
                            key={
                                group.id
                            }
                            style={styles.treeRow}
                            contentStyle={styles.treeRowContent}
                            onPress={() =>
                                selectGroup(
                                    group
                                )
                            }
                        >
                            <View
                                style={
                                    styles.treeContent
                                }
                            >
                                <Text
                                    maxFontSizeMultiplier={1}
                                    style={
                                        styles.treePrimary
                                    }
                                >
                                    {getLocalizedGroupName(
                                        group,
                                        language
                                    )}
                                </Text>

                                {language !==
                                    'ja' && (
                                        <Text
                                            maxFontSizeMultiplier={1}
                                            style={
                                                styles.treeJapanese
                                            }
                                        >
                                            {
                                                group.nameJa
                                            }
                                        </Text>
                                    )}

                            </View>

                            <RoyalChevron />
                        </RoyalOptionRow>
                    )
                )}
            </TreeModal>

            {/* ====================
                OCCUPATION MODAL
            ==================== */}

            <TreeModal
                visible={
                    occupationModalVisible
                }
                title={
                    bilingual(japaneseCopy.occupation, copy.occupation)
                }
                onClose={() =>
                    setOccupationModalVisible(
                        false
                    )
                }
            >
                {selectedGroup?.occupations.map(
                    (
                        occupation
                    ) => (
                        <RoyalOptionRow
                            sizingGroup={ROYAL_CONTENT_GROUP.workChoiceOption}
                            key={
                                occupation.id
                            }
                            style={styles.treeRow}
                            contentStyle={styles.treeRowContent}
                            onPress={() =>
                                selectOccupation(
                                    occupation
                                )
                            }
                        >
                            <View
                                style={
                                    styles.treeContent
                                }
                            >
                                <Text
                                    maxFontSizeMultiplier={1}
                                    style={
                                        styles.treePrimary
                                    }
                                >
                                    {getLocalizedOccupationName(
                                        occupation,
                                        language
                                    )}
                                </Text>

                                {language !==
                                    'ja' && (
                                        <Text
                                            maxFontSizeMultiplier={1}
                                            style={
                                                styles.treeJapanese
                                            }
                                        >
                                            {
                                                occupation.nameJa
                                            }
                                        </Text>
                                    )}

                            </View>

                            <RoyalChevron />
                        </RoyalOptionRow>
                    )
                )}
            </TreeModal>

            {/* ====================
                OPERATION MODAL
            ==================== */}

            <TreeModal
                visible={
                    operationModalVisible
                }
                title={
                    bilingual(japaneseCopy.operation, copy.operation)
                }
                onClose={() =>
                    setOperationModalVisible(
                        false
                    )
                }
            >
                {selectedOccupation?.operations.map(
                    (
                        operation
                    ) => (
                        <RoyalOptionRow
                            sizingGroup={ROYAL_CONTENT_GROUP.workChoiceOption}
                            key={
                                operation.id
                            }
                            style={styles.treeRow}
                            contentStyle={styles.treeRowContent}
                            onPress={() =>
                                selectOperation(
                                    operation
                                )
                            }
                        >
                            <View
                                style={
                                    styles.treeContent
                                }
                            >
                                <Text
                                    maxFontSizeMultiplier={1}
                                    style={
                                        styles.treePrimary
                                    }
                                >
                                    {getLocalizedOperationName(
                                        operation,
                                        language
                                    )}
                                </Text>

                                {language !==
                                    'ja' && (
                                        <Text
                                            maxFontSizeMultiplier={1}
                                            style={
                                                styles.treeJapanese
                                            }
                                        >
                                            {
                                                operation.nameJa
                                            }
                                        </Text>
                                    )}

                                {operation.thirdStageEligible ===
                                    false && (
                                        <Text
                                            maxFontSizeMultiplier={1}
                                            style={
                                                styles.notStage3
                                            }
                                        >
                                            {
                                                bilingual(japaneseCopy.notStage3Eligible, copy.notStage3Eligible)
                                            }
                                        </Text>
                                    )}
                            </View>

                            <RoyalChevron />
                        </RoyalOptionRow>
                    )
                )}
            </TreeModal>
        </SafeAreaView>
        </ImageBackground>
    );
}

function TreeModal({
    visible,
    title,
    onClose,
    children,
}: {
    visible: boolean;

    title: string;

    onClose: () => void;

    children:
    React.ReactNode;
}) {
    const royalPosition = useRoyalPositioning();
    return (
        <Modal
            visible={
                visible
            }
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
        background: { flex: 1 },

        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(225,246,253,0.42)',
        },

        container: {
            flex: 1,

            backgroundColor:
                'transparent',
        },

        content: {
            flexGrow:1,alignSelf:'center',paddingTop:ROYAL_PLACEMENT.headerTop,paddingBottom:4,
        },
        headerTop:{height:ROYAL_LAYOUT.backTouch,alignItems:'flex-start',justifyContent:'center'},titlePanel:{width:'100%',minHeight:ROYAL_LAYOUT.registrationHeaderHeight,paddingTop:18,paddingBottom:18},titleCopy:{width:'100%',alignItems:'center',justifyContent:'center',paddingVertical:10,paddingHorizontal:40},progressRow:{alignItems:'center',marginTop:0},progressBlock:{width:92,alignItems:'center'},infoPanel:{marginTop:2,minHeight:218},infoRow:{width:'100%',alignItems:'center',justifyContent:'center',paddingHorizontal:20,paddingVertical:8},flexSpacer:{flexGrow:1,minHeight:0},fieldsArea:{width:'100%'},

        step: {
            color:
                ROYAL.paleGold,

            fontSize: 16,

            fontFamily: ROYAL_FONT.body,

            fontWeight:
                '900',

            letterSpacing:
                1,
        },

        title: {
            width:'100%',
            color:ROYAL.paleGold,

            fontSize: ROYAL_TYPE.pageTitle,

            fontFamily: ROYAL_FONT.heading,

            fontWeight:
                '900',

            lineHeight:36,textAlign:'center',textAlignVertical:'center',includeFontPadding:false,

            textShadowColor:'#503716',textShadowOffset:{width:0,height:2},textShadowRadius:4,
        },

        titleLocalized:{width:'100%',marginTop:3,color:'#fff7e5',fontSize:10.5,lineHeight:15,fontFamily:ROYAL_FONT.body,textAlign:'center',textAlignVertical:'center',includeFontPadding:false,textShadowColor:'rgba(0,0,0,.55)',textShadowOffset:{width:0,height:1},textShadowRadius:3},

        subtitle: {
            color:
                ROYAL.lacquer,

            width:'100%',fontSize:10,lineHeight:15,fontFamily:ROYAL_FONT.body,textAlign:'center',textAlignVertical:'center',includeFontPadding:false,
        },

        selector: {
            minHeight: ROYAL_LAYOUT.registrationContentHeight,

            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'center',

            paddingHorizontal:0,

            paddingVertical:3,

            backgroundColor:'transparent',
        },

        field:{marginBottom:ROYAL_PLACEMENT.fieldGap,minHeight:ROYAL_LAYOUT.registrationFieldHeight},

        selectorDisabled: {
            opacity: 0.36,
        },

        selectorContent: {
            flex: 1,
            minWidth: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },

        selectorPrimary: {
            color:
                '#214e60',

            fontSize: 12,

            fontFamily: ROYAL_FONT.body,

            fontWeight:
                '800',
            width: '100%',
            lineHeight: 16,
            flexShrink: 1,
            textAlign: 'center',
            textAlignVertical: 'center',
            includeFontPadding: false,
        },

        selectorJapanese: {
            color:
                '#688591',

            fontSize: 10,

            fontFamily: ROYAL_FONT.body,

            width: '100%',
            marginTop: 1,
            lineHeight: 13,
            flexShrink: 1,
            textAlign: 'center',
            textAlignVertical: 'center',
            includeFontPadding: false,
        },

        selectorPlaceholder: {
            color:
                '#78909a',

            fontSize: 12,
            fontFamily: ROYAL_FONT.body,
            width: '100%',
            lineHeight: 16,
            flexShrink: 1,
            textAlign: 'center',
            textAlignVertical: 'center',
            includeFontPadding: false,
        },

        notStage3: {
            color:
                '#ffad5c',

            fontSize: 9,

            fontWeight:
                '900',

            lineHeight:11,
            marginTop: ROYAL_PLACEMENT.actionTopGap,
        },

        completeButton: {
            marginTop: 1,
            minHeight: ROYAL_LAYOUT.actionHeight,
        },

        completeButtonText: {
            color:
                ROYAL.paleGold,

            width:'100%',fontSize: 13,lineHeight:18,paddingHorizontal:28,paddingVertical:5,textAlign:'center',textAlignVertical:'center',includeFontPadding:false,

            fontFamily: ROYAL_FONT.heading,

            fontWeight:
                '900',
        },

        /*
         * MODAL
         */

        modalBackdrop: {
            flex: 1,

            justifyContent:
                'flex-end',

            backgroundColor:
                'rgba(0,0,0,0.65)',
            paddingBottom: ROYAL_PLACEMENT.modalBottom,
        },

        modalCard: { alignSelf:'center' },

        modalHeader: {
            width:'100%',height:ROYAL_LAYOUT.selectorHeaderHeight,alignItems:'center',justifyContent:'center',marginBottom:ROYAL_PLACEMENT.modalHeaderGap,
        },

        modalList:{width:'100%',flexShrink:1,overflow:'hidden'},

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

        treeRow: {
            minHeight: ROYAL_LAYOUT.selectorRowHeight,
            marginBottom: 1,
        },

        treeRowContent:{paddingHorizontal:ROYAL_SAFE_AREA.option.horizontal,paddingVertical:ROYAL_SAFE_AREA.option.vertical},

        treeContent: {
            flex: 1,
        },

        treePrimary: {
            color:
                '#244f61',

            fontSize: 13,

            fontFamily: ROYAL_FONT.body,

            fontWeight:
                '800',
            lineHeight:16,
        },

        treeJapanese: {
            color:
                '#6b858f',

            fontSize: 10,

            fontFamily: ROYAL_FONT.body,

            lineHeight:12,
            marginTop: 1,
        },

    });
