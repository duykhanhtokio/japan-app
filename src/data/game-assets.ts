import type {
    ImageSourcePropType,
} from 'react-native';

export type CharacterSpriteSet = {
    normal?: ImageSourcePropType;
    happy?: ImageSourcePropType;
    sad?: ImageSourcePropType;
    angry?: ImageSourcePropType;
    surprised?: ImageSourcePropType;
};

export const gameBackgrounds: Record<
    string,
    ImageSourcePropType
> = {
    TOKYO_CAFE_01: require(
        '../../assets/game/backgrounds/tokyo/cafe/tokyo_cafe_01.jpg'
    ),
};

export const gameCharacterSprites: Record<
    string,
    CharacterSpriteSet
> = {
    CAFE_STAFF_01: {
        normal: require(
            '../../assets/game/characters/cafe_staff_01/normal.png'
        ),
    },
};