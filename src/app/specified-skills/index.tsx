import ImageBackground from '@/components/ui/FocusedImageBackground';
import RoyalPaperPanel from '@/components/ui/RoyalPaperPanel';
import {
    Image,

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
import { RoyalBackButton, ROYAL_FONT, ROYAL_PLACEMENT } from '@/components/ui/RoyalSurface';

import BottomNav from '@/components/app/BottomNav';

const sectors = [
    {icon:require('../../../assets/app/industries/agriculture-v1.png'),ja:'農業',vi:'Nông nghiệp'},
    {icon:require('../../../assets/app/industries/construction-v1.png'),ja:'建設',vi:'Xây dựng'},
    {icon:require('../../../assets/app/industries/food-service-v1.png'),ja:'外食業',vi:'Nhà hàng'},
    {icon:require('../../../assets/app/industries/food-manufacturing-v1.png'),ja:'飲食料品製造業',vi:'Sản xuất thực phẩm'},
    {icon:require('../../../assets/app/industries/caregiving-v1.png'),ja:'介護',vi:'Điều dưỡng'},
    {icon:require('../../../assets/app/industries/hospitality-v1.png'),ja:'宿泊',vi:'Khách sạn'},
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
        },

        header: {
            flexDirection: 'row',

            alignItems: 'flex-start',

            gap: ROYAL_PLACEMENT.headerGap,

            paddingHorizontal: ROYAL_PLACEMENT.headerHorizontal,

            paddingTop: ROYAL_PLACEMENT.headerTop,

            paddingBottom: 12,
        },

        back: {
            color: '#142335',

            fontSize: 27,

            marginRight: 14,
        },

        title: {
            fontFamily:ROYAL_FONT.heading,
            color: '#fff3cf',
            textShadowColor:'#07101f',textShadowOffset:{width:0,height:2},textShadowRadius:4,

            fontSize: 25,

            fontWeight: '900',
        },

        subtitle: {
            fontFamily:ROYAL_FONT.body,
            color: '#fffdf7',
            textShadowColor:'#07101f',textShadowOffset:{width:0,height:1},textShadowRadius:3,

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
            fontFamily:ROYAL_FONT.heading,

            fontSize: 17,

            fontWeight: '900',
        },

        cardVi: {
            color: '#34425a',
            fontFamily:ROYAL_FONT.body,

            fontSize: 16,

            marginTop: 3,
        },
    });
