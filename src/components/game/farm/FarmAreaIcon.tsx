import { Image, type ImageStyle, type StyleProp } from 'react-native';

export type FarmAreaIconName = 'rice' | 'orchard' | 'chicken' | 'cow' | 'restaurant';

const ICONS = {
    rice: require('../../../../assets/app/ui/royal-af/game-rice-v1.png'),
    orchard: require('../../../../assets/app/ui/royal-af/game-orchard-v1.png'),
    chicken: require('../../../../assets/app/ui/royal-af/game-chicken-v1.png'),
    cow: require('../../../../assets/app/ui/royal-af/game-cow-v1.png'),
    restaurant: require('../../../../assets/app/ui/royal-af/game-restaurant-v1.png'),
};

export default function FarmAreaIcon({ name, size = 36, style }: { name: FarmAreaIconName; size?: number; style?: StyleProp<ImageStyle> }) {
    return <Image fadeDuration={0} source={ICONS[name]} resizeMode="contain" style={[{ width: size, height: size }, style]} />;
}
