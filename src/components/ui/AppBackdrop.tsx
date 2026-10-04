import { createContext, useCallback, useContext, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import DisplayedArtwork, { artworkKey, fullSceneArtworkStyle, type ArtworkProps } from './DisplayedArtwork';
import { SceneBackdropContext, type SceneArtwork } from './SceneBackdropContext';

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
  const currentPath = useRef(pathname);
  currentPath.current = pathname;
  const [registered, setRegistered] = useState<SceneArtwork | null>(null);
  const register = useCallback((scene: SceneArtwork) => {
    if (scene.pathname !== currentPath.current) return;
    setRegistered(previous => previous?.pathname === scene.pathname && artworkKey(previous.artwork) === artworkKey(scene.artwork)
      ? previous : scene);
  }, []);
  const coordinator = useMemo(() => ({ pathname, register }), [pathname, register]);
  const shared = !ownsSceneBackdrop(pathname);
  const dark = /^\/(?:world|settings|conversation-log|lesson|portal)(?:\/|$)/.test(pathname);
  const preset: ArtworkProps | null = pathname === '/home'
    ? { source: require('../../../assets/app/welcome/welcome-japan-landscape-v2.png'), blurRadius: 40 }
    : pathname === '/specified-skills'
      ? { source: require('../../../assets/app/home-cards/tokutei-engine-safety.png'), blurRadius: 40 }
      : shared ? { source: dark ? require('../../../assets/app/backgrounds/profile-details.png')
        : require('../../../assets/app/backgrounds/study-light.png'), blurRadius: 40 } : null;
  const desired = registered?.pathname === pathname ? registered.artwork : preset;
  const retained = useRef<ArtworkProps | null>(desired);
  if (desired) retained.current = desired;
  const artwork = desired ?? retained.current;
  return <SceneBackdropContext.Provider value={coordinator}>
    <InheritedBackdrop.Provider value={shared || pathname === '/home' || pathname === '/specified-skills'}>
      <View style={s.root}>
        {artwork?.source && <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <DisplayedArtwork {...artwork} contentFit={artwork.contentFit ?? 'cover'}
            testID="app-scene-backdrop" onError={event => console.warn('Scene backdrop failed to display:', event.error)} style={artwork.style ?? fullSceneArtworkStyle} />
        </View>}
        <ThemeProvider value={transparentTheme}>{children}</ThemeProvider>
      </View>
    </InheritedBackdrop.Provider>
  </SceneBackdropContext.Provider>;
}

const s = StyleSheet.create({ root: { flex: 1 } });
