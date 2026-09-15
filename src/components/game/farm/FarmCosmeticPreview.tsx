import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    EquippedFarmCosmetics,
    FarmCosmeticTarget,
} from '@/game/core/farm-progression-types';

import {
    getFarmCosmeticAsset,
} from '@/game/data/farm-cosmetic-assets';

import {
    FARM_COSMETICS,
} from '@/game/data/farm-cosmetics';

type Props = {
    target:
        FarmCosmeticTarget;

    equipped:
        EquippedFarmCosmetics;
};

const CHICKEN_BASE =
    require(
        '../../../../assets/game/farm/animals/chicken/chicken_idle.png'
    );

const COW_BASE =
    require(
        '../../../../assets/game/farm/animals/cow/cow_idle.png'
    );

function getAssetById(
    cosmeticId:
        string | undefined
) {
    if (!cosmeticId) {
        return null;
    }

    const definition =
        FARM_COSMETICS.find(
            item =>
                item.id ===
                cosmeticId
        );

    if (!definition) {
        return null;
    }

    return getFarmCosmeticAsset(
        definition.assetKey
    );
}

function getColorTint(
    cosmeticId:
        string | undefined
) {
    if (
        cosmeticId ===
        'chicken_color_red'
    ) {
        return '#E85A4F';
    }

    if (
        cosmeticId ===
        'chicken_color_blue'
    ) {
        return '#4E8FE8';
    }

    if (
        cosmeticId ===
        'chicken_color_gold'
    ) {
        return '#F1B934';
    }

    return undefined;
}

export default function FarmCosmeticPreview({
    target,
    equipped,
}: Props) {
    const targetEquipment =
        equipped[
            target
        ] ??
        {};

    const avatarAsset =
        getAssetById(
            targetEquipment.avatar
        );

    const faceAsset =
        getAssetById(
            targetEquipment.face
        );

    const headAsset =
        getAssetById(
            targetEquipment.head
        );

    const effectAsset =
        getAssetById(
            targetEquipment.effect
        );

    const centerpieceAsset =
        getAssetById(
            targetEquipment.centerpiece
        );

    const environmentAsset =
        getAssetById(
            targetEquipment.environment
        );

    const barnLightAsset =
        getAssetById(
            targetEquipment.barn_light
        );

    const tintColor =
        getColorTint(
            targetEquipment.color
        );

    const isChicken =
        target ===
        'chicken';

    const isCow =
        target ===
        'cow';

    const isAnimal =
        isChicken ||
        isCow;

    const buildingAsset =
        target ===
            'chicken_barn' ||
        target ===
            'cow_barn'
            ? barnLightAsset
            : null;

    const decorationAsset =
        target ===
        'farm'
            ? environmentAsset
            : centerpieceAsset;

    return (
        <View
            style={
                styles.container
            }
        >
            <Text
                style={
                    styles.title
                }
            >
                コーディネートプレビュー
            </Text>

            <View
                style={
                    styles.stage
                }
            >
                {effectAsset && (
                    <Image
                        source={
                            effectAsset
                        }
                        resizeMode="contain"
                        style={
                            styles.effect
                        }
                    />
                )}

                {isAnimal && (
                    <Image
                        source={
                            avatarAsset ??
                            (
                                isChicken
                                    ? CHICKEN_BASE
                                    : COW_BASE
                            )
                        }
                        resizeMode="contain"
                        style={[
                            styles.animal,

                            tintColor &&
                            !avatarAsset
                                ? {
                                      tintColor,
                                  }
                                : null,
                        ]}
                    />
                )}

                {isAnimal &&
                    faceAsset && (
                    <Image
                        source={
                            faceAsset
                        }
                        resizeMode="contain"
                        style={[
                            styles.accessory,
                            styles.face,
                        ]}
                    />
                )}

                {isAnimal &&
                    headAsset && (
                    <Image
                        source={
                            headAsset
                        }
                        resizeMode="contain"
                        style={[
                            styles.accessory,
                            styles.head,
                        ]}
                    />
                )}

                {buildingAsset && (
                    <Image
                        source={
                            buildingAsset
                        }
                        resizeMode="contain"
                        style={
                            styles.largeDecoration
                        }
                    />
                )}

                {decorationAsset && (
                    <Image
                        source={
                            decorationAsset
                        }
                        resizeMode="contain"
                        style={
                            styles.largeDecoration
                        }
                    />
                )}

                {!isAnimal &&
                    !buildingAsset &&
                    !decorationAsset && (
                    <Text
                        style={
                            styles.emptyIcon
                        }
                    >
                        {target ===
                        'farm'
                            ? '🌳'
                            : '🏠'}
                    </Text>
                )}
            </View>

            <Text
                style={
                    styles.hint
                }
            >
                装備を変更するとすぐに反映されます
            </Text>
        </View>
    );
}

const styles =
    StyleSheet.create({
        container: {
            marginHorizontal:
                10,

            marginTop:
                10,

            padding:
                9,

            borderRadius:
                16,

            borderWidth:
                2,

            borderColor:
                '#D7B77B',

            backgroundColor:
                '#F9EDCF',
        },

        title: {
            color:
                '#5A3E22',

            fontSize:
                12,

            fontWeight:
                '900',

            textAlign:
                'center',
        },

        stage: {
            height:
                150,

            alignItems:
                'center',

            justifyContent:
                'center',

            overflow:
                'hidden',

            marginTop:
                6,

            borderRadius:
                13,

            backgroundColor:
                '#A9DEF0',
        },

        animal: {
            width:
                135,

            height:
                135,
        },

        effect: {
            position:
                'absolute',

            width:
                175,

            height:
                145,
        },

        accessory: {
            position:
                'absolute',
        },

        face: {
            width:
                76,

            height:
                55,

            top:
                62,
        },

        head: {
            width:
                92,

            height:
                76,

            top:
                13,
        },

        largeDecoration: {
            width:
                '92%',

            height:
                '92%',
        },

        emptyIcon: {
            fontSize:
                70,
        },

        hint: {
            marginTop:
                5,

            color:
                '#7B6040',

            fontSize:
                10,

            fontWeight:
                '700',

            textAlign:
                'center',
        },
    });
