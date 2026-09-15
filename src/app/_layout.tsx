import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';

import { OnboardingMusic } from '@/components/audio/OnboardingMusic';
import { LanguageProvider } from '@/context/LanguageContext';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'RoyalSerifJP-SemiBold': require('../../assets/app/fonts/NotoSerifJP-SemiBold.ttf'),
    'RoyalSansJP-Medium': require('../../assets/app/fonts/NotoSansJP-Medium.ttf'),
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <LanguageProvider>
      <OnboardingMusic />
      <Stack screenOptions={{ headerShown: false }} />
    </LanguageProvider>
  );
}
