import type { DimensionValue } from 'react-native';

export type AccessoryLayerFit = {
    left: DimensionValue;
    top: DimensionValue;
    width: DimensionValue;
    height: DimensionValue;
};

export type AnimalAccessoryFit = {
    face: AccessoryLayerFit;
    head: AccessoryLayerFit;
};

const fit = (
    left: `${number}%`,
    top: `${number}%`,
    width: `${number}%`,
    height: `${number}%`,
): AccessoryLayerFit => ({ left, top, width, height });

/**
 * Accessory PNGs use a 1024-square transparent canvas. The visible eyes and
 * crown are not at the same point for a round chick, a long dragon, a cow or
 * a dinosaur, so each silhouette family gets its own fitting window.
 */
export function getAnimalAccessoryFit(
    target: 'chicken' | 'cow',
    avatarId: string | undefined,
): AnimalAccessoryFit {
    const id = avatarId ?? '';

    if (target === 'chicken') {
        if (/(?:dragon|phoenix|flamingo|parrot|eagle)/.test(id)) {
            return {
                face: fit('5%', '7%', '55%', '55%'),
                head: fit('1%', '-1%', '72%', '72%'),
            };
        }
        if (/(?:robot|mecha|ufo|space|clockwork)/.test(id)) {
            return {
                face: fit('18%', '2%', '64%', '64%'),
                head: fit('8%', '-3%', '84%', '84%'),
            };
        }
        return {
            face: fit('20%', '5%', '60%', '60%'),
            head: fit('9%', '-4%', '82%', '82%'),
        };
    }

    if (/(?:saurus|dino|t_rex|mammoth|rhino|saber|buffalo|yak)/.test(id)) {
        return {
            face: fit('-1%', '13%', '53%', '53%'),
            head: fit('-3%', '5%', '70%', '70%'),
        };
    }
    if (/(?:giraffe|kirin|moose|deer|griffin)/.test(id)) {
        return {
            face: fit('12%', '1%', '50%', '50%'),
            head: fit('4%', '-5%', '68%', '68%'),
        };
    }
    return {
        face: fit('6%', '9%', '56%', '56%'),
        head: fit('0%', '1%', '72%', '72%'),
    };
}
