import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import FarmAreaIcon, { type FarmAreaIconName } from './FarmAreaIcon';

import {
    getAnimal,
} from '@/game/data/animals';

import {
    FARM_COLORS,
} from './farm-theme';

const LOCK_ICON = require('../../../../assets/app/ui/royal-af/lock-grape-v2.png');

export type FarmAreaId =
    | 'vegetable'
    | 'orchard'
    | 'chicken'
    | 'cow'
    | 'restaurant';

type FarmArea = {
    id:
        FarmAreaId;

    icon:
        FarmAreaIconName;

    label:
        string;

    locked:
        boolean;
};

const AREAS:
    readonly FarmArea[] = [
        {
            id:
                'vegetable',

            icon:
                'rice',

            label:
                'お米を育てる',

            locked:
                false,
        },

        {
            id:
                'orchard',

            icon:
                'orchard',

            label:
                '果物を育てる',

            locked:
                false,
        },

        {
            id:
                'chicken',

            icon:
                'chicken',

            label:
                '鶏を育てる',

            locked:
                false,
        },

        {
            id:
                'cow',

            icon:
                'cow',

            label:
                '牛を育てる',

            locked:
                false,
        },
    ];

export default function FarmAreaBar({
    selected,
    farmLevel,
    onSelect,
}: {
    selected:
        FarmAreaId;

    farmLevel:
        number;

    onSelect:
        (
            area:
                FarmAreaId
        ) => void;
}) {
    return (
        <View
            style={
                styles.wrapper
            }
        >
            {AREAS.map(
                area => {
                    const active =
                        selected ===
                        area.id;

                    const animalDefinition =
                        area.id ===
                            'chicken' ||
                        area.id ===
                            'cow'
                            ? getAnimal(
                                area.id
                            )
                            : undefined;

                    const locked =
                        animalDefinition
                            ? farmLevel <
                              animalDefinition
                                  .unlockFarmLevel
                            : area.locked;

                    return (
                        <Pressable
                            key={
                                area.id
                            }
                            disabled={
                                locked
                            }
                            onPress={() =>
                                onSelect(
                                    area.id
                                )
                            }
                            style={({
                                pressed,
                            }) => [
                                styles.item,

                                active &&
                                    styles.activeItem,

                                locked &&
                                    styles.lockedItem,

                                pressed &&
                                    styles.pressed,
                            ]}
                        >
                            <FarmAreaIcon name={area.icon} size={30} />

                            <Text
                                numberOfLines={
                                    1
                                }
                                style={
                                    styles.label
                                }
                            >
                                {area.label}
                            </Text>

                            {locked && (
                                <Image fadeDuration={0} source={LOCK_ICON} resizeMode="contain" style={styles.lock} />
                            )}
                        </Pressable>
                    );
                }
            )}
        </View>
    );
}

const styles =
    StyleSheet.create({
        wrapper: {
            flexDirection:
                'row',

            marginHorizontal:
                7,

            borderRadius:
                17,

            overflow:
                'hidden',

            borderWidth:
                2,

            borderColor:
                FARM_COLORS
                    .creamBorder,

            backgroundColor:
                FARM_COLORS
                    .creamLight,
        },

        item: {
            flex:
                1,

            minHeight:
                68,

            alignItems:
                'center',

            justifyContent:
                'center',

            borderRightWidth:
                1,

            borderRightColor:
                '#DFC99B',

            position:
                'relative',

            paddingHorizontal:
                3,
        },

        activeItem: {
            backgroundColor:
                FARM_COLORS.gold,
        },

        lockedItem: {
            opacity:
                0.56,
        },

        pressed: {
            opacity:
                0.7,
        },

        label: {
            color:
                FARM_COLORS.text,

            fontSize:
                9,

            fontWeight:
                '900',

            marginTop:
                2,
        },

        lock: {
            position:
                'absolute',

            right:
                7,

            bottom:
                5,

            width: 14,
            height: 14,
        },
    });
