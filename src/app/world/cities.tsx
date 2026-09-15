import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { RoyalBackButton, RoyalChevron, RoyalField, RoyalPlaceRow, RoyalTitlePanel, ROYAL, ROYAL_FONT, ROYAL_LAYOUT, ROYAL_PLACEMENT, ROYAL_TEXT_FIT } from '@/components/ui/RoyalSurface';
import { cityImageById } from '@/components/world/city-images.generated';
import { DepthPressable } from '@/components/world/WorldSurface';
import { getAllLifeCities, getLifeDialogueCountByCity, getLifeLocationsByCity } from '@/services/life-content-repository';

export default function CitiesScreen() {
  const [query, setQuery] = useState('');
  const cities = useMemo(() => {
    const value = query.trim().toLowerCase();
    return getAllLifeCities().filter((city) => !value || `${city.name} ${city.nameJa}`.toLowerCase().includes(value));
  }, [query]);

  return <SafeAreaView style={s.screen}>
    <View style={s.header}>
      <RoyalBackButton onPress={() => router.back()} />
      <View style={s.heading}><RoyalTitlePanel style={s.titlePanel}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.title}>全国の都市</Text></RoyalTitlePanel><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.subtitle}>{cities.length}都市</Text></View>
    </View>
    <RoyalField label="検索" style={s.searchFrame}><TextInput value={query} onChangeText={setQuery} placeholder="市区町村を検索" placeholderTextColor="#8290a3" style={s.search} /></RoyalField>
    <FlatList data={cities} keyExtractor={(item) => item.id} initialNumToRender={16} windowSize={7} contentContainerStyle={s.list} renderItem={({ item }) =>
      <DepthPressable accessibilityLabel={item.nameJa} onPress={() => router.push(`/world/city/${item.id}`)} style={s.cardPress}>
        <RoyalPlaceRow source={cityImageById[item.id]} style={s.card}>
          <View style={s.copy}>
            <View style={s.copyText}>
              <Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.cityName}>{item.nameJa}</Text>
              <Text {...ROYAL_TEXT_FIT} minimumFontScale={0.7} numberOfLines={1} style={s.cityReading}>{item.name}</Text>
              <Text {...ROYAL_TEXT_FIT} minimumFontScale={0.68} numberOfLines={1} style={s.meta}>{getLifeLocationsByCity(item.id).length}か所・{getLifeDialogueCountByCity(item.id)}会話</Text>
            </View>
            <RoyalChevron variant="card" />
          </View>
        </RoyalPlaceRow>
      </DepthPressable>} />
  </SafeAreaView>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: ROYAL.ink }, header: { flexDirection:'row',alignItems:'flex-start',gap:ROYAL_PLACEMENT.headerGap,paddingHorizontal:ROYAL_PLACEMENT.headerHorizontal,paddingTop:ROYAL_PLACEMENT.headerTop },heading:{flex:1,alignItems:'center'},
  titlePanel: { width:'100%', minHeight: 58 }, title: { width:'100%',color: ROYAL.white, fontFamily: ROYAL_FONT.heading, fontSize: 24, lineHeight: 29, textAlign: 'center',textAlignVertical:'center',includeFontPadding:false }, subtitle: { width:'100%',color: ROYAL.paleGold, fontFamily: ROYAL_FONT.body, fontSize: 13, lineHeight: 18, textAlign: 'center',textAlignVertical:'center',includeFontPadding:false,marginTop:-3 },
  searchFrame:{marginHorizontal:16,marginTop:6,marginBottom:2},search: { minHeight: 48, color: ROYAL.lacquer, paddingHorizontal: 8, fontFamily: ROYAL_FONT.body, fontSize: 16 },
  list: { width:'100%',alignItems:'center',paddingHorizontal:8,paddingTop:6, paddingBottom: 52, gap: ROYAL_LAYOUT.cityGridGap }, cardPress:{width:'100%',maxWidth:'100%',minWidth:0},card: { width: '100%' },
  copy: { position:'absolute',left:'42%',right:'5%',top:'12%',bottom:'12%',flexDirection: 'row', alignItems: 'center' }, copyText: { flex: 1, minWidth: 0,alignItems:'center',justifyContent:'center',paddingHorizontal:8 },cityName:{width:'100%',color:ROYAL.lacquer,fontFamily:ROYAL_FONT.heading,fontSize:22,lineHeight:27,textAlign:'center',textAlignVertical:'center',includeFontPadding:false},
  cityReading:{width:'100%',color:'#725d3b',fontFamily:ROYAL_FONT.body,fontSize:11,lineHeight:15,textAlign:'center',textAlignVertical:'center',includeFontPadding:false,marginTop:1},
  meta: { width:'100%',color: '#725d3b', fontFamily: ROYAL_FONT.body, fontSize: 11, lineHeight: 15, marginTop: 2,textAlign:'center',textAlignVertical:'center',includeFontPadding:false },
});
