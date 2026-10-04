import FarmAreaIcon from './FarmAreaIcon';
import { ROYAL_FONT } from '@/components/ui/RoyalSurface';
import { RoyalContentPanel } from '@/components/ui/RoyalPanels';
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

    const CarePanel = careType === 'feed' ? View : RoyalContentPanel;

    return (
        <Modal
            visible={
                visible
            }
            transparent
            animationType="none"
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

                <CarePanel
                    style={
                        [styles.panel,careType==='feed'&&{backgroundColor:'#fff7e7'}]
                    }
                >
                    <View
                        style={
                            styles.iconCircle
                        }
                    >
                        {careType === 'feed'
                            ? <FarmAreaIcon name="rice" size={40} />
                             : null}
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
                    ><View pointerEvents="none" style={StyleSheet.absoluteFillObject}><RoyalContentPanel style={{...StyleSheet.absoluteFillObject,padding:0,minHeight:0}}/></View>
                        <View style={{width: careType === 'feed' ? 42 : 0, alignItems: 'center'}}>
                            {careType === 'feed'
                                ? <FarmAreaIcon name="rice" size={27} />
                                : null}
                        </View>

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
                    ><View pointerEvents="none" style={StyleSheet.absoluteFillObject}><RoyalContentPanel style={{...StyleSheet.absoluteFillObject,padding:0,minHeight:0}}/></View>


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
                    ><View pointerEvents="none" style={StyleSheet.absoluteFillObject}><RoyalContentPanel style={{...StyleSheet.absoluteFillObject,padding:0,minHeight:0}}/></View>


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
                    ><View pointerEvents="none" style={StyleSheet.absoluteFillObject}><RoyalContentPanel style={{...StyleSheet.absoluteFillObject,padding:0,minHeight:0}}/></View>
                        <Text
                            style={
                                styles.closeText
                            }
                        >
                            閉じる
                        </Text>
                    </Pressable>
                </CarePanel>
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
                'transparent',
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

        },

        icon: {
            fontFamily: ROYAL_FONT.body,
            fontSize:
                34,
        },

        title: {
            fontFamily: ROYAL_FONT.body,
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
            fontFamily: ROYAL_FONT.body,
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






        },

        boostButton: {



        },

        adButton: {



        },

        actionIcon: {
            fontFamily: ROYAL_FONT.body,
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
            fontFamily: ROYAL_FONT.body,
            fontSize:
                15,

            fontWeight:
                '900',

            color:'#142847',
        },

        adTitle: {
            fontFamily: ROYAL_FONT.body,
            fontSize:
                15,

            fontWeight:
                '900',

            color:'#142847',
        },

        actionDescription: {
            fontFamily: ROYAL_FONT.body,
            marginTop:
                2,

            fontSize:
                10,

            fontWeight:
                '700',

            color:'#142847',
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
            fontFamily: ROYAL_FONT.body,
            fontSize:
                13,

            fontWeight:
                '900',

            color:'#142847',
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
