import { EffectsProvider, useEffects } from '@/components/effects/EffectsProvider';
import { PressSound } from '@/components/effects/PressSound';
import { prepareArtwork } from '@/components/ui/prepareArtwork';
import { prepareSceneRoute, cancelPreparedNavigation, registerNavigationStateReader, backPrepared } from '@/components/ui/prepareSceneRoute';
import { OPEN_FRAME_SLICES } from '@/components/ui/RoyalPaperPanel';
import { NAVY_FRAME_ART } from '@/components/ui/RoyalSurface';
import { DEVELOPMENT_FEATURES } from '@/config/development-features';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Stack, usePathname, useNavigationContainerRef } from 'expo-router';
import { Animated, BackHandler, Platform } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { AppBackdrop } from '@/components/ui/AppBackdrop';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import { OnboardingMusic } from '@/components/audio/OnboardingMusic';
import { LanguageProvider } from '@/context/LanguageContext';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const pathname = usePathname();
  const navigation = useNavigationContainerRef();
  useEffect(() => navigation.addListener('state', cancelPreparedNavigation), [navigation]);
  useEffect(() => registerNavigationStateReader(() => navigation.getRootState()), [navigation]);
  // Registered while the splash is still active. Screen-level Back handlers
  // (including the JLPT exit/save guard) register later and retain precedence.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const state = navigation.getRootState();
      if (!state || !navigation.canGoBack()) return false;
      void backPrepared();
      return true;
    });
    return () => subscription.remove();
  }, [navigation]);
  const [artworkReady, setArtworkReady] = useState(false);
  const initialPathname = useRef(pathname).current;
  useEffect(() => {
    let active = true;
    const finish = () => { if (active) setArtworkReady(true); };
    // Asset/network/cache failures must never hold the native splash forever.
    const timeout = setTimeout(() => {
      console.warn('Initial artwork preparation timed out; continuing startup.');
      finish();
    }, 10000);
    // Only prepare the first visible screen. Other screens retain their
    // existing destination preparation when the learner navigates to them.
    const preparation = initialPathname === '/' ? prepareArtwork(
      DEVELOPMENT_FEATURES.skipRegistration ? [
        ...OPEN_FRAME_SLICES, NAVY_FRAME_ART,
        require('../../assets/app/ui/royal-af/hud-top-composite-midnight-v3.png'),
        require('../../assets/app/ui/royal-af/hud-player-medallion-v1.png'),
        require('../../assets/app/ui/royal-af/hud-coin-v1.png'),
        require('../../assets/app/ui/royal-af/nav-composite-navy-v1.png'),
        require('../../assets/app/welcome/welcome-japan-landscape-v2.png'),
        require('../../assets/app/home-cards/study-man.png'),
        require('../../assets/app/home-cards/conversation-three.png'),
        require('../../assets/app/home-cards/tokutei-engine-safety.png'),
      ] : [
        require('../../assets/app/welcome/welcome-japan-portrait-v2.png'),
        require('../../assets/app/welcome/welcome-japan-landscape-v2.png'),
        require('../../assets/app/welcome/sakura-petal-welcome-v2.png'),
        require('../../assets/app/ui/royal-af/button-wide-v2.png'),
      ],
    ) : prepareSceneRoute(initialPathname);
    void preparation.catch(error => {
      console.warn('Initial artwork preparation failed:', error);
    }).finally(() => {
      clearTimeout(timeout);
      finish();
    });
    return () => { active = false; clearTimeout(timeout); };
  }, [initialPathname]);
  const [fontsLoaded, fontError] = useFonts({
    'RoyalSerifJP-SemiBold': require('../../assets/app/fonts/NotoSerifJP-SemiBold.ttf'),
    'RoyalSansJP-Medium': require('../../assets/app/fonts/NotoSansJP-Medium.ttf'),
  });

  useEffect(()=>{if((fontsLoaded||fontError)&&artworkReady)void SplashScreen.hideAsync();},[fontsLoaded,fontError,artworkReady]);

  if ((!fontsLoaded && !fontError)||!artworkReady) return null;

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}><LanguageProvider><EffectsProvider>
      <OnboardingMusic />
      <PressSound />
      <AppBackdrop pathname={pathname}><MotionStack /></AppBackdrop>
    </EffectsProvider></LanguageProvider></SafeAreaProvider>
  );
}

function MotionStack() {
  const pathname = usePathname();
  const { reduceMotion, active } = useEffects();
  const entrance = useRef(new Animated.Value(1)).current;
  const previous = useRef(pathname);
  const exam = /^\/(?:n[1-5]|jlpt-listening-review)(?:\/|$)/i.test(pathname);
  useLayoutEffect(() => {
    const changed = previous.current !== pathname;
    const wasExam = /^\/(?:n[1-5]|jlpt-listening-review)(?:\/|$)/i.test(previous.current);
    previous.current = pathname;
    entrance.stopAnimation();
    entrance.setValue(1);
    if (Platform.OS !== 'web' || !changed || reduceMotion || !active || exam || wasExam) return;
    entrance.setValue(0);
    const animation = Animated.timing(entrance, { toValue: 1, duration: 220, useNativeDriver: true, isInteraction: false });
    animation.start();
    return () => animation.stop();
  }, [pathname, reduceMotion, active, exam, entrance]);
  const stack = <Stack screenOptions={({ route }) => ({
    headerShown: false,
    // Native stack blends scenes over the persistent prepared backdrop.
    animation: reduceMotion || /^(?:\[level\]|jlpt-listening-review)/.test(route.name) ? 'none' : 'fade',
    animationDuration: 220,
    gestureEnabled: false,
    freezeOnBlur: false,
    contentStyle: { backgroundColor: 'transparent' },
  })} />;
  // Native stack has no web transition; retain its mounted navigator and
  // reveal the destination over the already-prepared persistent backdrop.
  return Platform.OS === 'web' ? <Animated.View style={{ flex: 1, opacity: entrance,
    transform: [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) }] }}>{stack}</Animated.View> : stack;
}
