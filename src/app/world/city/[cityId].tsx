import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RoyalBackButton, RoyalCapsule, RoyalChevron, RoyalLocationCard, RoyalLockCrest, RoyalTitlePanel, ROYAL, ROYAL_FONT, ROYAL_LAYOUT, ROYAL_PLACEMENT, ROYAL_TEXT_FIT, resolveRoyalGrid, useRoyalPositioning } from '@/components/ui/RoyalSurface';
import { cityImageById } from '@/components/world/city-images.generated';
import { sceneForCategory } from '@/components/world/life-assets';
import { categoryLabelJa } from '@/components/world/world-ja';
import { DepthPressable } from '@/components/world/WorldSurface';
import { WorldTitleHeader } from '@/components/world/WorldTitleHeader';
import { normalizeNpcCategory, type NpcCategoryId } from '@/data/npc-progression';
import { getLifeCityById, getLifeLocationsByCity, getLifeScenariosByLocation, hasLifeDialogue } from '@/services/life-content-repository';
import { loadNpcCollection } from '@/services/npc-progression-storage';

export default function CityScreen() {
  const raw = useLocalSearchParams<{ cityId: string }>().cityId;
  const id = Array.isArray(raw) ? raw[0] : raw;
  const city = id ? getLifeCityById(id) : null;
  const locations = city ? getLifeLocationsByCity(city.id) : [];
  const royalPosition = useRoyalPositioning();
  const { width, height } = royalPosition;
  const [unlocked, setUnlocked] = useState<NpcCategoryId[] | null>(null);

  useEffect(() => {
    loadNpcCollection().then((state) => {
      if (!state.starterCategoryId) router.replace('/npc-starter');
      else setUnlocked(state.unlockedCategoryIds);
    });
  }, []);

  if (!city) return <SafeAreaView style={s.empty}><Text>都市が見つかりません。</Text></SafeAreaView>;

  const grid = resolveRoyalGrid(width, {
    phoneColumns: 2,
    tabletColumns: 3,
    desktopColumns: 4,
    tabletAt: 720,
    desktopAt: 1100,
  });

  return <ImageBackground source={cityImageById[city.id]} resizeMode="cover" blurRadius={width > height ? 10 : 6} style={s.screen}>
    <View style={s.wash} />
    <SafeAreaView style={s.safe}>
      <WorldTitleHeader title={city.nameJa} subtitle={`市内会話・全${locations.length}か所`} onBack={() => router.back()}/>
      <Animated.FlatList
        entering={FadeInDown.duration(420)} data={locations} key={grid.columns} numColumns={grid.columns}
        columnWrapperStyle={s.row} keyExtractor={(item) => item.id}
        contentContainerStyle={[s.list, { paddingHorizontal: grid.horizontalInset }]} showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const count = getLifeScenariosByLocation(item.id).filter((scenario) => hasLifeDialogue(scenario.id)).length;
          const category = normalizeNpcCategory(item.category);
          const locked = !!category && !!unlocked && !unlocked.includes(category.id);
          return <DepthPressable accessibilityLabel={item.nameJa} onPress={() => { if (!locked) router.push(`/world/location/${item.id}`); }} style={[s.cardPress, { width: grid.cardWidth }]}>
            <RoyalLocationCard source={sceneForCategory(item.category)} style={s.locationCard}>
              {locked && <View style={s.lockedShade} />}
              <RoyalCapsule label={categoryLabelJa(item.category)} style={s.category} />
              {locked && <RoyalLockCrest style={s.lock} />}
              <View style={s.cardCopy}>
                <View style={s.cardText}><Text allowFontScaling={false} numberOfLines={1} style={[s.location,{fontSize:Math.max(13,Math.min(17,Math.floor((grid.cardWidth*.77-28)/Array.from(item.nameJa).length)))}]}>{item.nameJa}</Text><Text {...ROYAL_TEXT_FIT} minimumFontScale={0.8} numberOfLines={1} style={s.reading}>{item.name}</Text><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.meta}>{locked ? '未解放' : `${count}会話`}</Text></View>
                {!locked && <RoyalChevron variant="card"/>} 
              </View>
            </RoyalLocationCard>
          </DepthPressable>;
        }}
      />
    </SafeAreaView>
  </ImageBackground>;
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: ROYAL.ink }, wash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5,14,29,.34)' }, safe: { flex: 1 },
  header: { width:'100%',alignItems:'stretch' }, backRow:{height:52,paddingHorizontal:ROYAL_PLACEMENT.headerHorizontal,paddingTop:ROYAL_PLACEMENT.headerTop,alignItems:'flex-start'}, heading:{width:'100%',alignItems:'center'},
  titlePanel: { width:'100%', minHeight: 58 }, title: { width:'100%',color: ROYAL.white, fontFamily: ROYAL_FONT.heading, fontSize: 24, lineHeight: 29, textAlign: 'center',textAlignVertical:'center',includeFontPadding:false },
  subtitle: { width:'100%',color: ROYAL.paleGold, fontFamily: ROYAL_FONT.body, fontSize: 13, lineHeight: 18, textAlign: 'center',textAlignVertical:'center',includeFontPadding:false,marginTop:-3,textShadowColor:'#061020',textShadowOffset:{width:0,height:2},textShadowRadius:3 }, list: { paddingTop: 4, paddingBottom: 54 }, row: { gap: ROYAL_LAYOUT.cityGridGap, marginBottom: ROYAL_LAYOUT.cityGridGap },
  cardPress: { minWidth:0,maxWidth:'100%',borderRadius:18 },locationCard:{width:'100%'}, lockedShade: { position:'absolute',left:'8%',right:'8%',top:'8%',height:'61%',borderRadius:12,backgroundColor: 'rgba(3,8,18,.62)' }, category: { position:'absolute',top:'5%',left:'4%',minWidth: 92, height: 39 },
  lock: { position: 'absolute', alignSelf: 'center', top: '30%', width: 58, height: 58 }, cardCopy: { position:'absolute',left:'10%',right:'8%',top:'76%',height:'20%',paddingLeft: 5, flexDirection: 'row', alignItems: 'center' },
  cardText: { flex: 1, minWidth: 0,alignItems:'center',justifyContent:'center',paddingHorizontal:5 }, location: { width:'100%',color: ROYAL.lacquer, fontFamily: ROYAL_FONT.heading, fontSize: 17, lineHeight: 19,textAlign:'center',textAlignVertical:'center',includeFontPadding:false },reading:{width:'100%',color:'#725d3b',fontFamily:ROYAL_FONT.body,fontSize:9,lineHeight:11,textAlign:'center',textAlignVertical:'center',includeFontPadding:false}, meta: { width:'100%',color: '#725d3b', fontFamily: ROYAL_FONT.body, fontSize: 9, lineHeight: 11, marginTop: 1,textAlign:'center',textAlignVertical:'center',includeFontPadding:false }, empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
