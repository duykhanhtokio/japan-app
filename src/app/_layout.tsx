import { Asset } from 'expo-asset';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';

import { OnboardingMusic } from '@/components/audio/OnboardingMusic';
import { LanguageProvider } from '@/context/LanguageContext';

export default function RootLayout() {
  useEffect(()=>{void Asset.loadAsync([
    require('../../assets/app/ui/royal-af/dialogue-frame-v1.png'),
    require('../../assets/app/ui/royal-af/farm-hud-plaque-v1.png'),
    require('../../assets/app/life/location-backgrounds/cafe/01-clear-morning.jpg'),
    require('../../assets/app/welcome/welcome-japan-landscape-v2.png'),
    require('../../assets/app/home-cards/study-man.png'),
    require('../../assets/app/home-cards/conversation-three.png'),
    require('../../assets/app/home-cards/tokutei-engine-safety.png'),
  ]).catch(error=>console.log('Common artwork preload:',error));},[]);
  const [fontsLoaded, fontError] = useFonts({
    'RoyalSerifJP-SemiBold': require('../../assets/app/fonts/NotoSerifJP-SemiBold.ttf'),
    'RoyalSansJP-Medium': require('../../assets/app/fonts/NotoSansJP-Medium.ttf'),
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <LanguageProvider>
      <OnboardingMusic />
      <Stack screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: '#142847' } }} />
    </LanguageProvider>
  );
}
