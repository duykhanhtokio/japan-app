import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { RoyalBackButton, RoyalChevron, RoyalPlaceRow, RoyalTitlePanel, ROYAL, ROYAL_FONT, ROYAL_PLACEMENT, ROYAL_TEXT_FIT, resolveRoyalGrid, useRoyalPositioning } from '@/components/ui/RoyalSurface';
import { DepthPressable } from '@/components/world/WorldSurface';
import { cityImageById } from '@/components/world/city-images.generated';
import { regionLabelJa } from '@/components/world/world-ja';
import { PREFECTURES } from '@/data/world-regions';
import { getLifeCitiesByPrefecture } from '@/services/life-content-repository';

export default function RegionScreen() {
  const { regionId } = useLocalSearchParams<{ regionId: string }>();
  const id = String(regionId || '').toLowerCase();
  const items = PREFECTURES.filter((item) => item[3] === id);
  const royalPosition = useRoyalPositioning();
  const grid = resolveRoyalGrid(royalPosition.width, {
    phoneColumns: 2,
    tabletColumns: 2,
    desktopColumns: 3,
    phoneInset: 8,
    wideInset: 12,
  });
  return <SafeAreaView style={s.screen}>
    <View style={s.header}>
      <RoyalBackButton onPress={() => router.back()} />
      <RoyalTitlePanel style={s.titlePanel}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.title}>{regionLabelJa(id)}地方</Text><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.subtitle}>{items.length}都道府県</Text></RoyalTitlePanel>
    </View>
    <FlatList data={items} key={grid.columns} numColumns={grid.columns} keyExtractor={(item) => item[0]} contentContainerStyle={[s.list,{paddingHorizontal:grid.horizontalInset}]} columnWrapperStyle={[s.row,{gap:grid.gap}]} renderItem={({ item }) =>
      <DepthPressable accessibilityLabel={item[1]} onPress={() => router.push(`/world/prefecture/${item[0]}`)} style={[s.press,{width:grid.cardWidth}]}>
        <RoyalPlaceRow source={cityImageById[getLifeCitiesByPrefecture(item[0])[0]?.id]} style={s.card}>
          <View style={s.copy}><View style={s.copyText}><Text {...ROYAL_TEXT_FIT} minimumFontScale={0.68} numberOfLines={1} style={s.prefecture}>{item[1]}</Text><Text {...ROYAL_TEXT_FIT} minimumFontScale={0.66} numberOfLines={1} style={s.prefectureReading}>{item[2]}</Text><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.open}>都市を見る</Text></View><RoyalChevron variant="card" /></View>
        </RoyalPlaceRow>
      </DepthPressable>} />
  </SafeAreaView>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: ROYAL.ink }, header: { flexDirection:'row',alignItems:'center',gap:ROYAL_PLACEMENT.headerGap,paddingHorizontal:ROYAL_PLACEMENT.headerHorizontal,paddingTop:ROYAL_PLACEMENT.headerTop },
  titlePanel: { flex: 1, minHeight: 58 }, title: { width:'100%',color: ROYAL.white, fontFamily: ROYAL_FONT.heading, fontSize: 24, lineHeight: 29, textAlign: 'center',textAlignVertical:'center',includeFontPadding:false }, subtitle: { width:'100%',color: ROYAL.paleGold, fontFamily: ROYAL_FONT.body, fontSize: 13, lineHeight: 18, textAlign: 'center',textAlignVertical:'center',includeFontPadding:false },
  list: { width:'100%',paddingTop:8, paddingBottom: 52, gap: 6 }, row: { width:'100%',gap: 6 }, press: { minWidth:0,maxWidth:'100%' }, card: { width: '100%' },
  copy:{position:'absolute',left:'42%',right:'5%',top:'11%',bottom:'11%',flexDirection:'row',alignItems:'center'},copyText:{flex:1,minWidth:0,alignItems:'center',justifyContent:'center',paddingHorizontal:5},prefecture:{width:'100%',color:ROYAL.lacquer,fontFamily:ROYAL_FONT.heading,fontSize:19,lineHeight:24,textAlign:'center',textAlignVertical:'center',includeFontPadding:false},prefectureReading:{width:'100%',color:'#725d3b',fontFamily:ROYAL_FONT.body,fontSize:10,lineHeight:13,textAlign:'center',textAlignVertical:'center',includeFontPadding:false},open: { width:'100%',color: '#725d3b', fontFamily: ROYAL_FONT.body, fontSize: 10, lineHeight: 13,marginTop:1,textAlign:'center',textAlignVertical:'center',includeFontPadding:false },
});
