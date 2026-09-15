import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    router,
} from 'expo-router';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

import BottomNav from '@/components/app/BottomNav';

const sectors = [
    ['🌱', '農業', 'Nông nghiệp'],

    ['🏗️', '建設', 'Xây dựng'],

    ['🍽️', '外食業', 'Nhà hàng'],

    [
        '🏭',
        '飲食料品製造業',
        'Sản xuất thực phẩm',
    ],

    ['🩺', '介護', 'Điều dưỡng'],

    ['🏨', '宿泊', 'Khách sạn'],
];

export default function SpecifiedSkillsScreen() {
    return (
        <SafeAreaView
            style={
                styles.container
            }
        >
            <View
                style={
                    styles.header
                }
            >
                <RoyalBackButton onPress={() => router.back()} />

                <View>
                    <Text
                        style={
                            styles.title
                        }
                    >
                        特定技能学習
                    </Text>

                    <Text
                        style={
                            styles.subtitle
                        }
                    >
                        Specified Skilled Worker
                    </Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={
                    styles.list
                }
            >
                {sectors.map(
                    (
                        [
                            icon,
                            ja,
                            vi,
                        ]
                    ) => (
                        <Pressable
                            key={ja}
                            style={
                                styles.card
                            }
                        >
                            <Text
                                style={
                                    styles.icon
                                }
                            >
                                {icon}
                            </Text>

                            <View>
                                <Text
                                    style={
                                        styles.cardTitle
                                    }
                                >
                                    {ja}
                                </Text>

                                <Text
                                    style={
                                        styles.cardVi
                                    }
                                >
                                    {vi}
                                </Text>
                            </View>
                        </Pressable>
                    )
                )}
            </ScrollView>

            <BottomNav
                active="home"
            />
        </SafeAreaView>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,

            backgroundColor:
                '#111827',
        },

        header: {
            flexDirection: 'row',

            alignItems: 'center',

            paddingHorizontal: 18,

            paddingTop: 12,

            paddingBottom: 12,
        },

        back: {
            color: '#ffffff',

            fontSize: 27,

            marginRight: 14,
        },

        title: {
            color: '#ffffff',

            fontSize: 25,

            fontWeight: '900',
        },

        subtitle: {
            color: '#9ea8b7',

            fontSize: 16,
        },

        list: {
            padding: 18,

            gap: 12,
        },

        card: {
            flexDirection: 'row',

            alignItems: 'center',

            padding: 17,

            borderRadius: 18,

            backgroundColor:
                '#202a40',
        },

        icon: {
            fontSize: 32,

            width: 54,
        },

        cardTitle: {
            color: '#ffffff',

            fontSize: 17,

            fontWeight: '900',
        },

        cardVi: {
            color: '#9ea8b7',

            fontSize: 16,

            marginTop: 3,
        },
    });
