import { StyleSheet, View } from 'react-native';
import RoyalPaperPanel from '@/components/ui/RoyalPaperPanel';

/** Artwork under a dynamic game badge; pointer handling stays with its parent. */
export default function FarmBadgeFrame({ dark = false }: { dark?: boolean }) {
    return <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <RoyalPaperPanel tone={dark ? 'hud' : 'paper'} style={{
            ...StyleSheet.absoluteFillObject, padding: 0, minHeight: 0,
        }} />
    </View>;
}
