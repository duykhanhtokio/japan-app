import { Text } from '@/components/app/LocalizedText';
import {
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

export default function RestaurantWorld() {
    return (
        <View style={styles.world}>
            <View style={styles.glow} />
            <View style={styles.building}>
                <Text style={styles.sign}>FARM RESTAURANT</Text>
                <Text style={styles.icon}>🍽️</Text>
                <Text style={styles.title}>ファームレストラン</Text>
                <Text style={styles.description}>農場で収穫した食材から料理を作るエリア</Text>
                <View style={styles.orders}>
                    {['🥗 サラダ', '🥚 オムレツ', '🥛 ミルクセット'].map((label, index) => (
                        <Pressable key={label} style={styles.order}>
                            <Text style={styles.orderName}>{label}</Text>
                            <Text style={styles.orderState}>{index === 0 ? 'テスト可能' : '準備中'}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    world: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22, backgroundColor: '#729E4D' },
    glow: { position: 'absolute', width: 420, height: 420, borderRadius: 210, backgroundColor: 'rgba(255,220,124,0.24)' },
    building: { width: '100%', maxWidth: 520, padding: 22, borderRadius: 28, borderWidth: 3, borderColor: '#E7BF6C', backgroundColor: 'rgba(82,47,23,0.94)', shadowColor: '#211006', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 10 },
    sign: { alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, color: '#5B3519', backgroundColor: '#FFE8AC', fontSize: 10, fontWeight: '900', letterSpacing: 1.3 },
    icon: { marginTop: 8, fontSize: 64, textAlign: 'center' },
    title: { color: '#FFF1C8', fontSize: 23, fontWeight: '900', textAlign: 'center' },
    description: { marginTop: 5, color: '#E9CFA4', fontSize: 11, fontWeight: '700', textAlign: 'center' },
    orders: { marginTop: 18, gap: 8 },
    order: { minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, borderRadius: 15, borderWidth: 1, borderColor: '#D3AB68', backgroundColor: '#FFF7E2' },
    orderName: { flex: 1, color: '#4E321A', fontSize: 13, fontWeight: '900' },
    orderState: { color: '#8B6B43', fontSize: 9, fontWeight: '800' },
});
