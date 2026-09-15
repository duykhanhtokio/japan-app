import { router, useLocalSearchParams } from 'expo-router';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RoyalBackButton, RoyalCapsule, RoyalChevron, RoyalPlaceRow, RoyalTitlePanel, ROYAL, ROYAL_FONT, ROYAL_PLACEMENT, ROYAL_TEXT_FIT, resolveRoyalGrid, useRoyalPositioning } from '@/components/ui/RoyalSurface';
import { cityImageById } from '@/components/world/city-images.generated';
import { DepthPressable } from '@/components/world/WorldSurface';
import { prefectureById } from '@/data/prefectures';
import { getLifeCitiesByPrefecture, getLifeDialogueCountByCity, getLifeLocationsByCity } from '@/services/life-content-repository';

export default function PrefectureScreen() {
  const raw = useLocalSearchParams<{ prefectureId: string }>().prefectureId;
  const id = Array.isArray(raw) ? raw[0] : raw;
  const prefecture = id ? prefectureById.get(id) : undefined;
  const cities = id ? getLifeCitiesByPrefecture(id) : [];
  const royalPosition = useRoyalPositioning();
  const grid = resolveRoyalGrid(royalPosition.width, {
    phoneColumns: 1,
    tabletColumns: 2,
    desktopColumns: 4,
    phoneInset: 8,
    wideInset: 8,
  });

  if (!prefecture) return <SafeAreaView style={s.empty}><Text>都道府県が見つかりません。</Text></SafeAreaView>;
  const totalLocations = cities.reduce((total, city) => total + getLifeLocationsByCity(city.id).length, 0);

  return <ImageBackground source={cities[0] ? cityImageById[cities[0].id] : undefined} resizeMode="cover" blurRadius={10} style={s.screen}>
    <View style={s.wash} />
    <SafeAreaView style={s.safe}>
      <View style={s.backRow}><RoyalBackButton onPress={() => router.back()} /></View>
      <View style={s.heading}><RoyalTitlePanel style={s.titlePanel}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.title}>{prefecture.nameJa}</Text></RoyalTitlePanel><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.subtitle}>{cities.length}都市・全{totalLocations}か所</Text></View>
      <ScrollView contentContainerStyle={[s.content,{paddingHorizontal:grid.horizontalInset}]} showsVerticalScrollIndicator={false}>
        <RoyalCapsule label="市区町村" style={s.sectionPill} />
        <View style={[s.grid, { gap:grid.gap }]}>
          {cities.map((city) => {
            const locationCount = getLifeLocationsByCity(city.id).length;
            const dialogueCount = getLifeDialogueCountByCity(city.id);
            return <DepthPressable key={city.id} accessibilityLabel={city.nameJa} onPress={() => router.push(`/world/city/${city.id}`)} style={{ width:grid.cardWidth,height:grid.cardWidth/3,maxWidth:'100%',minWidth:0,alignSelf:'center' }}>
              <RoyalPlaceRow source={cityImageById[city.id]} style={s.card}>
                <View style={s.copy}>
                  <View style={s.textColumn}>
                    <Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.cityName}>{city.nameJa}</Text>
                    <Text {...ROYAL_TEXT_FIT} minimumFontScale={0.7} numberOfLines={1} style={s.cityReading}>{city.name}</Text>
                    <Text {...ROYAL_TEXT_FIT} minimumFontScale={0.68} numberOfLines={1} style={s.meta}>{locationCount}か所・{dialogueCount}会話</Text>
                  </View>
                  <RoyalChevron variant="card" />
                </View>
              </RoyalPlaceRow>
            </DepthPressable>;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  </ImageBackground>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: ROYAL.ink }, wash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5,14,29,.48)' }, safe: { flex: 1 }, empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backRow:{height:52,paddingHorizontal:ROYAL_PLACEMENT.headerHorizontal,paddingTop:ROYAL_PLACEMENT.headerTop,alignItems:'flex-start'},heading:{width:'100%',alignItems:'center'}, titlePanel: { width:'100%', minHeight:58 },
  title: { width:'100%',color: ROYAL.white, fontFamily: ROYAL_FONT.heading, fontSize: 24, lineHeight: 29, textAlign: 'center',textAlignVertical:'center',includeFontPadding:false }, subtitle: { width:'100%',color: ROYAL.paleGold, fontFamily: ROYAL_FONT.body, fontSize: 13, lineHeight: 18, textAlign: 'center',textAlignVertical:'center',includeFontPadding:false,marginTop:-3,textShadowColor:'#061020',textShadowOffset:{width:0,height:2},textShadowRadius:3 },
  content: { width:'100%',alignItems:'center',paddingTop:8,paddingBottom:64 }, sectionPill: { alignSelf:'flex-start',minWidth:136,marginBottom:6 }, grid: { width:'100%',alignItems:'center',flexDirection:'row',flexWrap:'wrap',justifyContent:'center' },
  card: { width: '100%' },
  copy: { position:'absolute',left:'42%',right:'5%',top:'11%',bottom:'11%',flexDirection: 'row', alignItems: 'center' }, textColumn: { flex: 1, minWidth: 0,alignItems:'center',justifyContent:'center',paddingHorizontal:8 },cityName:{width:'100%',color:ROYAL.lacquer,fontFamily:ROYAL_FONT.heading,fontSize:22,lineHeight:27,textAlign:'center',textAlignVertical:'center',includeFontPadding:false},
  cityReading:{width:'100%',color:'#725d3b',fontFamily:ROYAL_FONT.body,fontSize:11,lineHeight:15,textAlign:'center',textAlignVertical:'center',includeFontPadding:false,marginTop:1},
  meta: { width:'100%',color: '#725d3b', fontFamily: ROYAL_FONT.body, fontSize: 11, lineHeight: 15, marginTop: 2,textAlign:'center',textAlignVertical:'center',includeFontPadding:false },
});
