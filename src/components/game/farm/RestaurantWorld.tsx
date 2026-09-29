import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const RESTAURANT_ICON = require('../../../../assets/app/ui/royal-af/game-restaurant-v1.png');
const CHECK_ICON = require('../../../../assets/app/ui/royal-af/checkmark-v2.png');

const STEPS = [
    { title: '食材を育てる', detail: '畑・果樹園・牧場で食材を育てます。' },
    { title: '収穫する', detail: '育った作物や畜産物を収穫します。' },
    { title: '料理と注文', detail: '料理を作って注文に応える機能は準備中です。' },
] as const;

export default function RestaurantWorld() {
    return (
        <ScrollView style={styles.world} contentContainerStyle={styles.content}>
            <View style={styles.panel}>
                <Image source={RESTAURANT_ICON} resizeMode="contain" style={styles.heroIcon} />
                <Text style={styles.title}>ファームレストラン</Text>
                <Text style={styles.intro}>このエリアの遊び方</Text>
                {STEPS.map((step, index) => (
                    <View key={step.title} style={styles.step}>
                        <Image source={CHECK_ICON} resizeMode="contain" style={styles.stepIcon} />
                        <View style={styles.stepCopy}>
                            <Text style={styles.stepTitle}>{index + 1}. {step.title}</Text>
                            <Text style={styles.stepDetail}>{step.detail}</Text>
                        </View>
                    </View>
                ))}
                <Text style={styles.notice}>現在は案内のみ表示しています。料理・注文の操作は利用できません。</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    world: { flex: 1, backgroundColor: '#e8e2d6' },
    content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingTop: 100, paddingBottom: 32 },
    panel: { width: '100%', maxWidth: 520, alignSelf: 'center', padding: 22, borderRadius: 24, borderWidth: 2, borderColor: '#c39a47', backgroundColor: '#fff9e9' },
    heroIcon: { width: 110, height: 110, alignSelf: 'center' },
    title: { marginTop: 5, color: '#24334b', fontSize: 23, fontWeight: '900', textAlign: 'center' },
    intro: { marginTop: 8, marginBottom: 14, color: '#735b31', fontSize: 15, fontWeight: '700', textAlign: 'center' },
    step: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#d9c9a9' },
    stepIcon: { width: 30, height: 30, marginRight: 12 },
    stepCopy: { flex: 1 },
    stepTitle: { color: '#24334b', fontSize: 16, fontWeight: '800' },
    stepDetail: { marginTop: 3, color: '#665944', fontSize: 13, lineHeight: 20 },
    notice: { marginTop: 12, color: '#705935', fontSize: 12, lineHeight: 18, textAlign: 'center' },
});
