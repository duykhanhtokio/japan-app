import { EffectsProvider } from '@/components/effects/EffectsProvider';
import { PressSound } from '@/components/effects/PressSound';
import { prepareArtwork } from '@/components/ui/prepareArtwork';
import { prepareSceneRoute, cancelPreparedNavigation, registerNavigationStateReader, backPrepared } from '@/components/ui/prepareSceneRoute';
import { DEVELOPMENT_FEATURES } from '@/config/development-features';
import { useEffect, useRef, useState } from 'react';
import { Stack, usePathname, useNavigationContainerRef } from 'expo-router';
import { BackHandler } from 'react-native';
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
    const firstRoute = initialPathname === '/' && DEVELOPMENT_FEATURES.skipRegistration ? '/home' : initialPathname;
    const preparation = firstRoute === '/' ? prepareArtwork([
      require('../../assets/app/welcome/welcome-japan-portrait-v2.png'),
      require('../../assets/app/welcome/welcome-japan-landscape-v2.png'),
      require('../../assets/app/welcome/sakura-petal-welcome-v2.png'),
      require('../../assets/app/ui/royal-af/button-wide-v2.png'),
    ]) : prepareSceneRoute(firstRoute);
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
      <AppBackdrop pathname={pathname}><Stack screenOptions={{ headerShown: false, animation: 'none', gestureEnabled: false, freezeOnBlur: false, contentStyle: { backgroundColor: 'transparent' } }} /></AppBackdrop>
    </EffectsProvider></LanguageProvider></SafeAreaProvider>
  );
}
