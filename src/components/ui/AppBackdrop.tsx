import { createContext, useContext, type PropsWithChildren } from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import HomeTokuteiBackdrop from './HomeTokuteiBackdrop';

const transparentTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent' } };

const InheritedBackdrop = createContext(false);
export const useInheritedBackdrop = () => useContext(InheritedBackdrop);

// These routes own their approved scene artwork; every other route shares one
// persistent official backdrop, outside the native stack and safe-area insets.
export function ownsSceneBackdrop(pathname: string) {
  return pathname === '/' || /^\/(home|profile|register|npc-starter)(\/|$)/.test(pathname)
    || pathname === '/portal' || pathname === '/specified-skills'
    || /^\/game(?:$|\/(?:work|mission)(?:\/|$))/.test(pathname)
    || /^\/world\/(?:city|prefecture|location|dialogue)(?:\/|$)/.test(pathname);
}
export function AppBackdrop({ pathname, children }: PropsWithChildren<{ pathname: string }>) {
  const shared = !ownsSceneBackdrop(pathname);
  const handoff = pathname === '/home' || pathname === '/specified-skills';
  const dark = /^\/(?:world|settings|conversation-log|lesson|portal)(?:\/|$)/.test(pathname);
  return <InheritedBackdrop.Provider value={shared || handoff}><View style={s.root}>
    {handoff && <HomeTokuteiBackdrop pathname={pathname} />}
    {shared && <Image testID="app-official-backdrop" pointerEvents="none" source={dark
      ? require('../../../assets/app/backgrounds/profile-details.png')
      : require('../../../assets/app/backgrounds/study-light.png')}
      contentFit="cover" blurRadius={40} transition={0} cachePolicy="memory-disk" style={StyleSheet.absoluteFill} />}
    <ThemeProvider value={handoff ? transparentTheme : DefaultTheme}>{children}</ThemeProvider>
  </View></InheritedBackdrop.Provider>;
}
const s = StyleSheet.create({ root: { flex: 1 } });
