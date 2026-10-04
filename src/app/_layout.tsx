import { Image as CachedImage } from 'expo-image';
import { PAPER_FRAME_SLICES, OPEN_FRAME_SLICES, HUD_FRAME_SLICES } from '@/components/ui/RoyalPaperPanel';
import { NAVY_FRAME_ART } from '@/components/ui/RoyalSurface';
import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';
import { Stack, usePathname } from 'expo-router';
import { AppBackdrop } from '@/components/ui/AppBackdrop';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import { OnboardingMusic } from '@/components/audio/OnboardingMusic';
import { LanguageProvider } from '@/context/LanguageContext';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const pathname = usePathname();
  const [artworkReady,setArtworkReady]=useState(false);
  useEffect(()=>{let active=true;void Asset.loadAsync([
    ...PAPER_FRAME_SLICES,...OPEN_FRAME_SLICES,...HUD_FRAME_SLICES,NAVY_FRAME_ART,
    require('../../assets/app/ui/royal-af/button-wide-v2.png'),
    require('../../assets/app/ui/royal-af/button-back-curved-a-v1.png'),
    require('../../assets/app/ui/royal-af/hint-gold-grape-v1.png'),
    require('../../assets/app/ui/royal-af/hint-red-lantern-v2.png'),
    require('../../assets/app/ui/royal-af/microphone-v2.png'),
    require('../../assets/app/ui/royal-af/dialogue-frame-v1.png'),
    require('../../assets/app/ui/royal-af/farm-hud-plaque-v1.png'),
    require('../../assets/app/backgrounds/study-light.png'),
    require('../../assets/app/backgrounds/profile-details.png'),
    require('../../assets/app/welcome/welcome-japan-landscape-v2.png'),
    require('../../assets/app/home-cards/study-man.png'),
    require('../../assets/app/home-cards/conversation-three.png'),
    require('../../assets/app/home-cards/tokutei-engine-safety.png'),
  ]).then(async assets=>{await CachedImage.prefetch(assets.map(asset=>asset.localUri??asset.uri),{cachePolicy:'memory-disk'});}).catch(error=>console.log('Common artwork preload:',error)).finally(()=>{if(active)setArtworkReady(true)});return()=>{active=false};},[]);
  const [fontsLoaded, fontError] = useFonts({
    'RoyalSerifJP-SemiBold': require('../../assets/app/fonts/NotoSerifJP-SemiBold.ttf'),
    'RoyalSansJP-Medium': require('../../assets/app/fonts/NotoSansJP-Medium.ttf'),
  });

  useEffect(()=>{if((fontsLoaded||fontError)&&artworkReady)void SplashScreen.hideAsync();},[fontsLoaded,fontError,artworkReady]);

  if ((!fontsLoaded && !fontError)||!artworkReady) return null;

  return (
    <LanguageProvider>
      <OnboardingMusic />
      <AppBackdrop pathname={pathname}><Stack screenOptions={{ headerShown: false, animation: 'none', freezeOnBlur: false, contentStyle: { backgroundColor: 'transparent' } }} /></AppBackdrop>
    </LanguageProvider>
  );
}
