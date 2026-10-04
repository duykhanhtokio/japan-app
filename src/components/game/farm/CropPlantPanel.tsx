import { ROYAL_FONT } from '@/components/ui/RoyalSurface';
import FarmAreaIcon from './FarmAreaIcon';
import { RoyalContentPanel } from '@/components/ui/RoyalPanels';
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    CropId,
} from '@/game/core/game-types';

import {
    CROPS,
} from '@/game/data/crops';

import {
    getGameItem,
} from '@/game/data/items';

/*
 * =========================================================
 * CROP PLANT PANEL
 * =========================================================
 *
 * UI chỉ:
 *
 * - hiển thị crop
 * - hiển thị level
 * - hiển thị thời gian
 * - hiển thị giá seed
 * - báo locked / thiếu Gold
 * - gửi cropId về screen
 *
 * Economy thật được xử lý bởi plantCrop().
 * =========================================================
 */

const COIN_ICON = require('../../../../assets/app/ui/royal-af/hud-coin-v1.png');
const LOCK_ICON = require('../../../../assets/app/ui/royal-af/lock-grape-v2.png');

type CropPlantPanelProps = {
    visible:
    boolean;

    farmLevel:
    number;

    gold:
    number;

    onClose:
    () => void;

    onPlant:
    (
        cropId:
            CropId
    ) => void;
};

/*
 * =========================================================
 * FARM CROPS
 * =========================================================
 *
 * Apple / grape hiện đã thuộc Orchard gameplay.
 *
 * Không hiển thị chúng trong normal Farm panel
 * dù CROPS legacy vẫn còn definition.
 * =========================================================
 */

const ORCHARD_CROP_IDS =
    new Set<CropId>([
        'apple',
        'grape',
    ]);

const FARM_CROPS =
    CROPS.filter(
        crop =>
            !ORCHARD_CROP_IDS.has(
                crop.id
            )
    );

/*
 * =========================================================
 * DISPLAY HELPERS
 * =========================================================
 */

function formatGrowTime(
    seconds:
        number
) {
    if (
        seconds <
        60
    ) {
        return `${seconds}秒`;
    }

    if (
        seconds <
        60 * 60
    ) {
        return `${Math.ceil(
            seconds / 60
        )}分`;
    }

    const hours =
        seconds /
        (60 * 60);

    if (
        Number.isInteger(
            hours
        )
    ) {
        return `${hours}時間`;
    }

    return `${hours.toFixed(
        1
    )}時間`;
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function CropPlantPanel({
    visible,
    farmLevel,
    gold,
    onClose,
    onPlant,
}: CropPlantPanelProps) {
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

                <RoyalContentPanel
                    style={
                        styles.panel
                    }
                >
                    {/*
                     * =========================================
                     * HEADER
                     * =========================================
                     */}

                    <View
                        style={
                            styles.header
                        }
                    >
                        <View>
                            <Text
                                style={
                                    styles.title
                                }
                            >
                                作物を植える
                            </Text>

                            <Text
                                style={
                                    styles.subtitle
                                }
                            >
                                植えたい作物を選んでください
                            </Text>
                        </View>

                        <RoyalContentPanel
                            style={
                                styles.goldBadge
                            }
                        >
                            <Image source={COIN_ICON} resizeMode="contain" style={styles.goldIcon} />
                            <Text
                                style={
                                    styles.goldText
                                }
                            >
                                {gold}
                            </Text>
                        </RoyalContentPanel>
                    </View>

                    {/*
                     * =========================================
                     * CROP LIST
                     * =========================================
                     */}

                    <ScrollView
                        style={
                            styles.scroll
                        }
                        contentContainerStyle={
                            styles.scrollContent
                        }
                        showsVerticalScrollIndicator={
                            false
                        }
                    >
                        {FARM_CROPS.map(
                            crop => {
                                const seed =
                                    getGameItem(
                                        crop.seedItemId
                                    );

                                const price =
                                    seed
                                        ?.shopPrice;

                                const locked =
                                    farmLevel <
                                    crop.unlockFarmLevel;

                                const unavailable =
                                    price ===
                                    undefined;

                                const notEnoughGold =
                                    price !==
                                    undefined &&
                                    gold <
                                    price;

                                const disabled =
                                    locked ||
                                    unavailable ||
                                    notEnoughGold;

                                return (
                                    <Pressable
                                        key={
                                            crop.id
                                        }
                                        disabled={
                                            disabled
                                        }
                                        onPress={() =>
                                            onPlant(
                                                crop.id
                                            )
                                        }
                                        style={({
                                            pressed,
                                        }) => [
                                                styles.cropCard,

                                                disabled &&
                                                styles.cropCardDisabled,

                                                pressed &&
                                                !disabled &&
                                                styles.cropCardPressed,
                                            ]}
                                    ><View pointerEvents="none" style={StyleSheet.absoluteFillObject}><RoyalContentPanel style={{...StyleSheet.absoluteFillObject,padding:0,minHeight:0}}/></View>
                                        {/*
                                         * ICON
                                         */}

                                        <View
                                            style={
                                                styles.cropIconBox
                                            }
                                        >
                                            {crop.id === "wheat" && <FarmAreaIcon name="rice" size={42}/>}
                                        </View>

                                        {/*
                                         * INFO
                                         */}

                                        <View
                                            style={
                                                styles.cropInfo
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.cropNameRow
                                                }
                                            >
                                                <Text
                                                    style={[
                                                        styles.cropName,

                                                        disabled &&
                                                        styles.disabledText,
                                                    ]}
                                                >
                                                    {
                                                        crop.name
                                                            .textJa
                                                    }
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.levelText
                                                    }
                                                >
                                                    Lv.
                                                    {
                                                        crop.unlockFarmLevel
                                                    }
                                                </Text>
                                            </View>

                                            <Text
                                                style={
                                                    styles.reading
                                                }
                                            >
                                                {
                                                    crop.name
                                                        .readingJa
                                                }
                                            </Text>

                                            <View
                                                style={
                                                    styles.statsRow
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.stat
                                                    }
                                                >
                                                    成長
                                                    {formatGrowTime(
                                                        crop.growTimeSeconds
                                                    )}
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.stat
                                                    }
                                                >
                                                    収穫 ×
                                                    {
                                                        crop.yieldAmount
                                                    }
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.stat
                                                    }
                                                >
                                                    経験値 +
                                                    {
                                                        crop.harvestXp
                                                    }
                                                </Text>
                                            </View>
                                        </View>

                                        {/*
                                         * PRICE / LOCK
                                         */}

                                        <View
                                            style={
                                                styles.rightArea
                                            }
                                        >
                                            {locked ? (
                                                <>
                                                    <Image source={LOCK_ICON} resizeMode="contain" style={{width:26,height:26}} />

                                                    <Text
                                                        style={
                                                            styles.lockText
                                                        }
                                                    >
                                                        Lv.
                                                        {
                                                            crop.unlockFarmLevel
                                                        }
                                                    </Text>
                                                </>
                                            ) : unavailable ? (
                                                <Text
                                                    style={
                                                        styles.unavailableText
                                                    }
                                                >
                                                    販売なし
                                                </Text>
                                            ) : (
                                                <>
                                                    <Image source={COIN_ICON} resizeMode="contain" style={{width:18,height:18}} />
                                                    <Text
                                                        style={[
                                                            styles.price,

                                                            notEnoughGold &&
                                                            styles.priceInsufficient,
                                                        ]}
                                                    >
                                                        {price}
                                                    </Text>

                                                    <Text
                                                        style={[
                                                            styles.buyLabel,

                                                            notEnoughGold &&
                                                            styles.priceInsufficient,
                                                        ]}
                                                    >
                                                        {notEnoughGold
                                                            ? 'ゴールド不足'
                                                            : '植える'}
                                                    </Text>
                                                </>
                                            )}
                                        </View>
                                    </Pressable>
                                );
                            }
                        )}
                    </ScrollView>

                    {/*
                     * =========================================
                     * CLOSE
                     * =========================================
                     */}

                    <Pressable
                        onPress={
                            onClose
                        }
                        style={({
                            pressed,
                        }) => [
                                styles.closeButton,

                                pressed &&
                                styles.closeButtonPressed,
                            ]}
                    ><View pointerEvents="none" style={StyleSheet.absoluteFillObject}><RoyalContentPanel style={{...StyleSheet.absoluteFillObject,padding:0,minHeight:0}}/></View>
                        <Text
                            style={
                                styles.closeText
                            }
                        >
                            閉じる
                        </Text>
                    </Pressable>
                </RoyalContentPanel>
            </View>
        </Modal>
    );
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles =
    StyleSheet.create({
        backdrop: {
            flex:
                1,

            justifyContent:
                'flex-end',

            backgroundColor:
                'transparent',
        },

        panel: {
            maxHeight: '78%',
            paddingTop: 18,
            paddingHorizontal: 16,
            paddingBottom: 12,
        },

        header: {
            flexDirection:
                'row',

            alignItems:
                'center',

            justifyContent:
                'space-between',

            marginBottom:
                14,
        },

        title: {
            fontFamily: ROYAL_FONT.body,
            color:
                '#57361D',

            fontSize:
                20,

            fontWeight:
                '900',
        },

        subtitle: {
            fontFamily: ROYAL_FONT.body,
            marginTop:
                3,

            color:
                '#806A55',

            fontSize:
                10,

            fontWeight:
                '700',
        },

        goldIcon: { width: 22, height: 22 },

        goldBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            minHeight: 0,
            paddingHorizontal: 11,
            paddingVertical: 7,
        },

        goldText: {
            fontFamily: ROYAL_FONT.body,
            color:
                '#6A4914',

            fontSize:
                13,

            fontWeight:
                '900',
        },

        scroll: {
            flexGrow:
                0,
        },

        scrollContent: {
            paddingBottom:
                6,
        },

        cropCard: {
            minHeight:
                82,

            marginBottom:
                9,

            paddingHorizontal:
                10,

            paddingVertical:
                9,

            flexDirection:
                'row',

            alignItems:
                'center',

            borderRadius:
                17,






        },

        cropCardDisabled: {
            opacity:
                0.53,




        },

        cropCardPressed: {
            opacity:
                0.8,

            transform: [
                {
                    scale:
                        0.985,
                },
            ],
        },

        cropIconBox: {
            width:
                58,

            height:
                58,

            alignItems:
                'center',

            justifyContent:
                'center',

            borderRadius:
                15,






        },

        cropIcon: {
            fontFamily: ROYAL_FONT.body,
            fontSize:
                34,
        },

        cropInfo: {
            flex:
                1,

            paddingHorizontal:
                10,
        },

        cropNameRow: {
            flexDirection:
                'row',

            alignItems:
                'center',

            gap:
                6,
        },

        cropName: {fontFamily: ROYAL_FONT.body,
            color:'#142847',

            fontSize:
                15,

            fontWeight:
                '900',
        },

        levelText: {
            fontFamily: ROYAL_FONT.body,
            paddingHorizontal:
                5,

            paddingVertical:
                1,

            borderRadius:
                6,

            overflow:
                'hidden',

            color:'#142847',

            backgroundColor:
                '#E5F0CB',

            fontSize:
                8,

            fontWeight:
                '900',
        },

        reading: {
            fontFamily: ROYAL_FONT.body,
            marginTop:
                1,

            color:'#142847',

            fontSize:
                9,

            fontWeight:
                '700',
        },

        statsRow: {
            marginTop:
                7,

            flexDirection:
                'row',

            flexWrap:
                'wrap',

            gap:
                8,
        },

        stat: {
            fontFamily: ROYAL_FONT.body,
            color:'#142847',

            fontSize:
                9,

            fontWeight:
                '800',
        },

        rightArea: {
            minWidth:
                68,

            alignItems:
                'center',

            justifyContent:
                'center',
        },

        price: {fontFamily: ROYAL_FONT.body,
            color:'#142847',

            fontSize:
                13,

            fontWeight:
                '900',
        },

        buyLabel: {fontFamily: ROYAL_FONT.body,
            marginTop:
                3,

            color:'#142847',

            fontSize:
                9,

            fontWeight:
                '900',
        },

        priceInsufficient: {
            color:'#142847',
        },

        lockIcon: {
            fontFamily: ROYAL_FONT.body,
            fontSize:
                19,
        },

        lockText: {
            fontFamily: ROYAL_FONT.body,
            marginTop:
                2,

            color:'#142847',

            fontSize:
                9,

            fontWeight:
                '900',
        },

        unavailableText: {
            fontFamily: ROYAL_FONT.body,
            color:'#142847',

            fontSize:
                9,

            fontWeight:
                '900',
        },

        disabledText: {
            color:'#142847',
        },

        closeButton: {
            alignSelf:
                'center',

            marginTop:
                4,

            paddingHorizontal:
                34,

            paddingVertical:
                10,
        },

        closeButtonPressed: {
            opacity:
                0.65,
        },

        closeText: {
            fontFamily: ROYAL_FONT.body,
            color:'#142847',

            fontSize:
                13,

            fontWeight:
                '900',
        },
    });
