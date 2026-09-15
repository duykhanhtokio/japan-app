import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    CareActionLevel,
    CareType,
} from '@/game/care/care-types';

type CropCarePanelProps = {
    visible:
    boolean;

    careType:
    CareType | null;

    onClose:
    () => void;

    onCare:
    (
        level:
            CareActionLevel
    ) => void;
};

function getCareContent(
    careType:
        CareType | null
) {
    switch (careType) {
        case 'fertilizer':
            return {
                icon:
                    '🌱',

                title:
                    '肥料が必要です',

                description:
                    '肥料を与えて成長を助けましょう。',
            };

        case 'feed':
            return {
                icon:
                    '🌾',

                title:
                    'エサが必要です',

                description:
                    'エサを与えて育てましょう。',
            };

        case 'drink':
            return {
                icon:
                    '💧',

                title:
                    '水が必要です',

                description:
                    '水を飲ませて元気に育てましょう。',
            };

        case 'water':
        default:
            return {
                icon:
                    '💧',

                title:
                    '水やりが必要です',

                description:
                    '水を与えて作物の成長を助けましょう。',
            };
    }
}

export default function CropCarePanel({
    visible,
    careType,
    onClose,
    onCare,
}: CropCarePanelProps) {
    const content =
        getCareContent(
            careType
        );

    return (
        <Modal
            visible={
                visible
            }
            transparent
            animationType="fade"
            onRequestClose={
                onClose
            }
        >
            <View
                style={
                    styles.backdrop
                }
            >
                <Pressable
                    style={
                        StyleSheet
                            .absoluteFill
                    }
                    onPress={
                        onClose
                    }
                />

                <View
                    style={
                        styles.panel
                    }
                >
                    <View
                        style={
                            styles.iconCircle
                        }
                    >
                        <Text
                            style={
                                styles.icon
                            }
                        >
                            {
                                content.icon
                            }
                        </Text>
                    </View>

                    <Text
                        style={
                            styles.title
                        }
                    >
                        {
                            content.title
                        }
                    </Text>

                    <Text
                        style={
                            styles.description
                        }
                    >
                        {
                            content.description
                        }
                    </Text>

                    <Pressable
                        style={({
                            pressed,
                        }) => [
                                styles.actionButton,

                                pressed &&
                                styles.pressed,
                            ]}
                        onPress={() =>
                            onCare(
                                'normal'
                            )
                        }
                    >
                        <Text
                            style={
                                styles.actionIcon
                            }
                        >
                            💧
                        </Text>

                        <View
                            style={
                                styles.actionTextArea
                            }
                        >
                            <Text
                                style={
                                    styles.actionTitle
                                }
                            >
                                通常
                            </Text>

                            <Text
                                style={
                                    styles.actionDescription
                                }
                            >
                                普通にお世話する
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable
                        style={({
                            pressed,
                        }) => [
                                styles.actionButton,
                                styles.boostButton,

                                pressed &&
                                styles.pressed,
                            ]}
                        onPress={() =>
                            onCare(
                                'boost'
                            )
                        }
                    >
                        <Text
                            style={
                                styles.actionIcon
                            }
                        >
                            ⚡
                        </Text>

                        <View
                            style={
                                styles.actionTextArea
                            }
                        >
                            <Text
                                style={
                                    styles.actionTitle
                                }
                            >
                                多めにお世話する
                            </Text>

                            <Text
                                style={
                                    styles.actionDescription
                                }
                            >
                                成長時間を短縮
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable
                        style={({
                            pressed,
                        }) => [
                                styles.actionButton,
                                styles.adButton,

                                pressed &&
                                styles.pressed,
                            ]}
                        onPress={() =>
                            onCare(
                                'ad'
                            )
                        }
                    >
                        <Text
                            style={
                                styles.actionIcon
                            }
                        >
                            📺
                        </Text>

                        <View
                            style={
                                styles.actionTextArea
                            }
                        >
                            <Text
                                style={
                                    styles.adTitle
                                }
                            >
                                広告を見てすぐ完了
                            </Text>

                            <Text
                                style={
                                    styles.actionDescription
                                }
                            >
                                収穫できる状態まで進める
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable
                        style={({
                            pressed,
                        }) => [
                                styles.closeButton,

                                pressed &&
                                styles.pressed,
                            ]}
                        onPress={
                            onClose
                        }
                    >
                        <Text
                            style={
                                styles.closeText
                            }
                        >
                            閉じる
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles =
    StyleSheet.create({
        backdrop: {
            flex:
                1,

            alignItems:
                'center',

            justifyContent:
                'center',

            paddingHorizontal:
                24,

            backgroundColor:
                'rgba(30, 25, 18, 0.48)',
        },

        panel: {
            width:
                '100%',

            maxWidth:
                390,

            paddingHorizontal:
                20,

            paddingTop:
                22,

            paddingBottom:
                18,

            borderRadius:
                24,

            borderWidth:
                3,

            borderColor:
                '#B77A2C',

            backgroundColor:
                '#FFF8E8',

            shadowColor:
                '#000000',

            shadowOffset: {
                width:
                    0,

                height:
                    6,
            },

            shadowOpacity:
                0.25,

            shadowRadius:
                10,

            elevation:
                10,
        },

        iconCircle: {
            width:
                64,

            height:
                64,

            alignSelf:
                'center',

            alignItems:
                'center',

            justifyContent:
                'center',

            borderRadius:
                32,

            backgroundColor:
                '#EAF5D5',

            borderWidth:
                2,

            borderColor:
                '#9ABB63',
        },

        icon: {
            fontSize:
                34,
        },

        title: {
            marginTop:
                12,

            textAlign:
                'center',

            fontSize:
                20,

            fontWeight:
                '900',

            color:
                '#57361D',
        },

        description: {
            marginTop:
                5,

            marginBottom:
                16,

            textAlign:
                'center',

            fontSize:
                12,

            fontWeight:
                '700',

            color:
                '#7A624D',
        },

        actionButton: {
            minHeight:
                62,

            marginBottom:
                10,

            paddingHorizontal:
                14,

            flexDirection:
                'row',

            alignItems:
                'center',

            borderRadius:
                16,

            borderWidth:
                2,

            borderColor:
                '#9ABD67',

            backgroundColor:
                '#F3FBE8',
        },

        boostButton: {
            borderColor:
                '#E0AE45',

            backgroundColor:
                '#FFF5D6',
        },

        adButton: {
            borderColor:
                '#78A6D8',

            backgroundColor:
                '#EAF4FF',
        },

        actionIcon: {
            width:
                42,

            fontSize:
                27,

            textAlign:
                'center',
        },

        actionTextArea: {
            flex:
                1,

            paddingLeft:
                7,
        },

        actionTitle: {
            fontSize:
                15,

            fontWeight:
                '900',

            color:
                '#57361D',
        },

        adTitle: {
            fontSize:
                15,

            fontWeight:
                '900',

            color:
                '#315D8A',
        },

        actionDescription: {
            marginTop:
                2,

            fontSize:
                10,

            fontWeight:
                '700',

            color:
                '#806A55',
        },

        closeButton: {
            alignSelf:
                'center',

            marginTop:
                3,

            paddingHorizontal:
                30,

            paddingVertical:
                10,
        },

        closeText: {
            fontSize:
                13,

            fontWeight:
                '900',

            color:
                '#816A56',
        },

        pressed: {
            opacity:
                0.72,

            transform: [
                {
                    scale:
                        0.98,
                },
            ],
        },
    });