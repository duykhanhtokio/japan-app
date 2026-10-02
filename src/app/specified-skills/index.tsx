import RoyalPaperPanel from '@/components/ui/RoyalPaperPanel';
import {
    Image,
    ImageBackground,
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
    {icon:require('../../../assets/game/farm/background/vegetable_map_background_v2.png'),ja:'農業',vi:'Nông nghiệp'},
    {icon:require('../../../assets/app/life/rewards/cards/construction-site.png'),ja:'建設',vi:'Xây dựng'},
    {icon:require('../../../assets/app/life/rewards/cards/restaurant.png'),ja:'外食業',vi:'Nhà hàng'},
    {icon:require('../../../assets/app/life/rewards/cards/supermarket.png'),ja:'飲食料品製造業',vi:'Sản xuất thực phẩm'},
    {icon:require('../../../assets/app/life/rewards/cards/hospital.png'),ja:'介護',vi:'Điều dưỡng'},
    {icon:require('../../../assets/app/life/rewards/cards/hotel.png'),ja:'宿泊',vi:'Khách sạn'},
];

export default function SpecifiedSkillsScreen() {
    return (
        <ImageBackground source={require('../../../assets/app/home-cards/tokutei-engine-safety.png')} blurRadius={40} resizeMode="cover" style={{flex:1}}><SafeAreaView
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
                    ({ icon, ja, vi }) => (
                        <View
                            key={ja}
                            style={
                                styles.card
                            }
                        >
                            <RoyalPaperPanel style={styles.cardArtwork}>
                            <Image
                                source={icon}
                                resizeMode="cover"
                                style={
                                    styles.icon
                                }
                            />

                            <View style={{flex:1,minWidth:0}}>
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
                            </RoyalPaperPanel>
                        </View>
                    )
                )}
            </ScrollView>

            <BottomNav
                active="home"
            />
        </SafeAreaView></ImageBackground>
    );
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,

            backgroundColor:
                'rgba(11,24,48,.16)',
        },

        header: {
            flexDirection: 'row',

            alignItems: 'center',

            paddingHorizontal: 18,

            paddingTop: 12,

            paddingBottom: 12,
        },

        back: {
            color: '#142335',

            fontSize: 27,

            marginRight: 14,
        },

        title: {
            color: '#0b1830',

            fontSize: 25,

            fontWeight: '900',
        },

        subtitle: {
            color: '#72501f',

            fontSize: 16,
        },

        list: {
            padding: 18,

            gap: 12,
        },

        card: {
            minHeight: 90,
        },
        cardArtwork:{flexDirection:'row',alignItems:'center',paddingHorizontal:28,paddingVertical:24,gap:12},

        icon: {
            width:54,height:54,borderRadius:12,
        },

        cardTitle: {
            color: '#142335',

            fontSize: 17,

            fontWeight: '900',
        },

        cardVi: {
            color: '#34425a',

            fontSize: 16,

            marginTop: 3,
        },
    });
