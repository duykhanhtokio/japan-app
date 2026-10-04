import { cancelPreparedNavigation, prepareSceneRoute } from '@/components/ui/prepareSceneRoute';
import { prepareArtwork } from '@/components/ui/prepareArtwork';
import { PAPER_FRAME_SLICES, OPEN_FRAME_SLICES, HUD_FRAME_SLICES } from '@/components/ui/RoyalPaperPanel';
import { NAVY_FRAME_ART } from '@/components/ui/RoyalSurface';
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { Stack, usePathname, useNavigationContainerRef } from 'expo-router';
import { DefaultTheme, ThemeProvider, type NavigationState, type PartialState } from '@react-navigation/native';
import { ArtworkVisibility } from '@/components/ui/ArtworkVisibility';
import { AppBackdrop } from '@/components/ui/AppBackdrop';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import { OnboardingMusic } from '@/components/audio/OnboardingMusic';
import { LanguageProvider } from '@/context/LanguageContext';

void SplashScreen.preventAutoHideAsync();
const officialBackdropTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent' } };

export default function RootLayout() {
  const pathname = usePathname();
  const navigation = useNavigationContainerRef();
  const subscribe = useCallback((listener: () => void) => navigation.addListener('state', () => {
    cancelPreparedNavigation();
    listener();
  }), [navigation]);
  const getActiveRoutes = useCallback(() => {
    if (!navigation.isReady()) return null;
    const keys: string[] = [];
    let branch: NavigationState | PartialState<NavigationState> | undefined = navigation.getRootState();
    while (branch) {
      const route: { key?: string; state?: NavigationState | PartialState<NavigationState> } | undefined = branch.routes[branch.index ?? 0];
      if (!route) break;
      if (route.key) keys.push(route.key);
      branch = route.state;
    }
    return keys.join('\n');
  }, [navigation]);
  // A primitive snapshot stays stable when navigation returns a fresh state object.
  const routeSnapshot = useSyncExternalStore(subscribe, getActiveRoutes, () => null);
  const activeRouteKeys = useMemo(() => routeSnapshot ? routeSnapshot.split('\n') : null, [routeSnapshot]);
  const [artworkReady,setArtworkReady]=useState(false);
  useEffect(()=>{let active=true;void Promise.all([prepareSceneRoute(pathname),prepareArtwork([
    ...PAPER_FRAME_SLICES,...OPEN_FRAME_SLICES,...HUD_FRAME_SLICES,NAVY_FRAME_ART,
    require('../../assets/app/ui/royal-af/button-wide-v2.png'),
    require('../../assets/app/ui/royal-af/button-back-curved-a-v1.png'),
    require('../../assets/app/ui/royal-af/hint-gold-grape-v1.png'),
    require('../../assets/app/ui/royal-af/hint-red-lantern-v2.png'),
    require('../../assets/app/ui/royal-af/microphone-v2.png'),
    require('../../assets/app/ui/royal-af/dialogue-frame-v1.png'),
    require('../../assets/app/ui/royal-af/farm-hud-plaque-v1.png'),
    require('../../assets/app/ui/royal-af/hud-top-composite-midnight-v3.png'),
    require('../../assets/app/ui/royal-af/hud-coin-v1.png'),
    require('../../assets/app/ui/royal-af/nav-composite-navy-v1.png'),
    require('../../assets/app/ui/royal-af/rank-n5-v1.png'),
    require('../../assets/app/ui/royal-af/rank-n4-v1.png'),
    require('../../assets/app/ui/royal-af/rank-n3-v1.png'),
    require('../../assets/app/ui/royal-af/rank-n2-v1.png'),
    require('../../assets/app/ui/royal-af/rank-n1-v1.png'),
    require('../../assets/app/backgrounds/study-light.png'),
    require('../../assets/app/backgrounds/profile-details.png'),
    require('../../assets/app/welcome/welcome-japan-landscape-v2.png'),
    require('../../assets/app/home-cards/study-man.png'),
    require('../../assets/app/home-cards/conversation-three.png'),
    require('../../assets/app/home-cards/tokutei-engine-safety.png'),
  ])]).catch(error=>console.log('Common artwork preload:',error)).finally(()=>{if(active)setArtworkReady(true)});return()=>{active=false};},[]);
  const [fontsLoaded, fontError] = useFonts({
    'RoyalSerifJP-SemiBold': require('../../assets/app/fonts/NotoSerifJP-SemiBold.ttf'),
    'RoyalSansJP-Medium': require('../../assets/app/fonts/NotoSansJP-Medium.ttf'),
  });

  useEffect(()=>{if((fontsLoaded||fontError)&&artworkReady)void SplashScreen.hideAsync();},[fontsLoaded,fontError,artworkReady]);

  if ((!fontsLoaded && !fontError)||!artworkReady) return null;

  return (
    <LanguageProvider>
      <OnboardingMusic />
      <ThemeProvider value={officialBackdropTheme}><ArtworkVisibility routeKeys={activeRouteKeys}><AppBackdrop pathname={pathname}><Stack screenOptions={{ headerShown: false, animation: 'none', freezeOnBlur: false, contentStyle: { backgroundColor: 'transparent' } }} /></AppBackdrop></ArtworkVisibility></ThemeProvider>
    </LanguageProvider>
  );
}
