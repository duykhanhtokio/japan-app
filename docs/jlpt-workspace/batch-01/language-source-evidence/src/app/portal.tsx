import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SakuraPetalField } from '@/components/ui/SakuraPetalField';

import { RoyalBackButton, RoyalButton, RoyalTitlePanel, ROYAL, ROYAL_FONT, ROYAL_LAYOUT, ROYAL_PLACEMENT, ROYAL_TEXT_FIT, useRoyalPositioning } from '@/components/ui/RoyalSurface';

type Portal = {
  titleJa: string;
  titleEn: string;
  learner?: boolean;
  route?: '/portal/education' | '/portal/company' | '/portal/support';
};

const PORTALS: Portal[] = [
  { titleJa: '日本語教育機関', titleEn: 'Japanese Language Education Institutions', route: '/portal/education' },
  { titleJa: '受け入れ企業', titleEn: 'Accepting Companies', route: '/portal/company' },
  { titleJa: '監理団体・登録支援機関', titleEn: 'Supervising / Registered Support Organizations', route: '/portal/support' },
  { titleJa: '学習者', titleEn: 'Learners', learner: true },
];

function PortalCard({ portal, index, wide }: { portal: Portal; index: number; wide: boolean }) {
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(entrance, {
      toValue: 1,
      duration: 430,
      delay: 70 + index * 65,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [entrance, index]);

  const openPortal = () => {
    if (portal.learner) {
      router.push('/register');
      return;
    }
    if (portal.route) router.push(portal.route);
  };

  return (
    <Animated.View
      style={[
        styles.cardShell,
        wide && styles.cardShellWide,
        { opacity: entrance, transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] },
      ]}
    >
      <RoyalButton accessibilityLabel={`${portal.titleJa} ${portal.titleEn}`} onPress={openPortal} style={styles.card}>
        <View style={styles.cardCopy}>
          <Text {...ROYAL_TEXT_FIT} minimumFontScale={0.62} numberOfLines={1} style={styles.cardTitleJa}>{portal.titleJa}</Text>
          <Text {...ROYAL_TEXT_FIT} minimumFontScale={0.58} numberOfLines={2} style={styles.cardTitleEn}>{portal.titleEn}</Text>
        </View>
      </RoyalButton>
    </Animated.View>
  );
}

export default function PortalSelectionScreen() {
  const royalPosition = useRoyalPositioning();
  const { width } = royalPosition;
  const wide = width >= 720;
  const frameWidth = wide
    ? royalPosition.wideContentWidth
    : royalPosition.contentWidth;

  return (
    <ImageBackground source={require('../../assets/app/registration/registration-bg.jpg')} resizeMode="cover" style={styles.background}>
      <SakuraPetalField />
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, { width: frameWidth }]}>
          <View style={styles.topRow}><RoyalBackButton onPress={() => router.back()} /></View>
          <RoyalTitlePanel style={[styles.heading,royalPosition.fullWidthStyle]}>
            <Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={styles.title}>利用目的を選択</Text>
            <Text maxFontSizeMultiplier={1} numberOfLines={2} style={styles.titleEn}>Choose how you will use the app</Text>
          </RoyalTitlePanel>
          <View style={[styles.grid, wide && styles.gridWide]}>
            {PORTALS.map((portal, index) => <PortalCard key={portal.titleJa} portal={portal} index={index} wide={wide} />)}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 }, safeArea: { flex: 1 },
  content: { flex: 1, alignSelf:'center', paddingTop: ROYAL_PLACEMENT.headerTop, paddingBottom: 10 },
  topRow: { height: ROYAL_LAYOUT.backTouch, alignItems: 'flex-start', justifyContent: 'center' },
  heading: { width: '100%', minHeight: ROYAL_LAYOUT.topPanelHeight, alignItems: 'center', justifyContent: 'center' },
  title: { width: '100%', color: ROYAL.paleGold, fontFamily: ROYAL_FONT.heading, fontSize: 25, lineHeight: 34, textAlign: 'center', includeFontPadding: false, textShadowColor: '#281a08', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 3 },
  titleEn: { width: '100%', marginTop: 2, color: '#fff8e8', fontFamily: ROYAL_FONT.body, fontSize: 12, lineHeight: 17, textAlign: 'center', includeFontPadding: false, textShadowColor: '#281a08', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  grid: { flex: 1, justifyContent: 'center', gap: 5, paddingVertical: 6 },
  gridWide: { flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', columnGap: 14, rowGap: 8 },
  cardShell: { width: '100%' }, cardShellWide: { width: '48%', minWidth: 310, maxWidth: 480 },
  card: { width: '100%', height: 103 }, cardCopy: { width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  cardTitleJa: { width: '100%', color: ROYAL.paleGold, fontFamily: ROYAL_FONT.heading, fontSize: 19, lineHeight: 26, textAlign: 'center', includeFontPadding: false, textShadowColor: '#241604', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 3 },
  cardTitleEn: { width: '100%', marginTop: 1, color: '#fff8e8', fontFamily: ROYAL_FONT.body, fontSize: 12, lineHeight: 17, textAlign: 'center', includeFontPadding: false },
});
