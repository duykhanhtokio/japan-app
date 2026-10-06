import { createContext, useContext, useLayoutEffect, useRef, useState, type Dispatch, type SetStateAction, type PropsWithChildren } from 'react';
import { StyleSheet, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import { preparedRouteBackdrop } from './prepareSceneRoute';

import { useIsFocused, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import HomeTokuteiBackdrop from './HomeTokuteiBackdrop';

const transparentTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent' } };

type SceneOverride = { owner: object; pathname: string; source: ImageSourcePropType; blurRadius: number };
const SceneBackdropWriter = createContext<Dispatch<SetStateAction<SceneOverride | undefined>> | undefined>(undefined);
export function usePreparedSceneBackdrop(pathname: string, source: ImageSourcePropType, blurRadius = 0) {
  const writer = useContext(SceneBackdropWriter);
  const focused = useIsFocused();
  const owner = useRef({});
  useLayoutEffect(() => {
    if (!writer || !focused) return;
    const identity = owner.current;
    writer({ owner: identity, pathname, source, blurRadius });
    return () => writer(previous => previous?.owner === identity ? undefined : previous);
  }, [writer, focused, pathname, source, blurRadius]);
}

const InheritedBackdrop = createContext(false);
const RootBackdropSource = createContext<ImageSourcePropType | undefined>(undefined);
export const useInheritedBackdrop = () => useContext(InheritedBackdrop);
export const useRootBackdropSource = () => useContext(RootBackdropSource);

// These routes own their approved scene artwork; every other route shares one
// persistent official backdrop, outside the native stack and safe-area insets.
export function ownsSceneBackdrop(pathname: string) {
  return pathname === '/' || /^\/game\/(?:work|mission)(?:\/|$)/.test(pathname);
}
export function AppBackdrop({ pathname, children }: PropsWithChildren<{ pathname: string }>) {
  const { width, height } = useWindowDimensions();
  const [sceneOverride, setSceneOverride] = useState<SceneOverride>();
  const shared = !ownsSceneBackdrop(pathname);
  const dark = /^\/(?:world|settings|conversation-log|lesson|portal)(?:\/|$)/.test(pathname);
  const prepared = preparedRouteBackdrop(pathname);
  const scene = sceneOverride?.pathname === pathname ? sceneOverride : undefined;
  const source = scene?.source ?? prepared?.source ?? (dark ? require('../../../assets/app/backgrounds/profile-details.png') : require('../../../assets/app/backgrounds/study-light.png'));
  const blurRadius = scene?.blurRadius ?? (prepared?.city ? width > height ? 10 : 6 : prepared?.blurRadius ?? 40);
  const key = `${typeof source === 'number' ? source : JSON.stringify(source)}:${blurRadius}`;
  return <SceneBackdropWriter.Provider value={setSceneOverride}><InheritedBackdrop.Provider value={shared}><RootBackdropSource.Provider value={shared ? source : undefined}><View style={s.root}>
    {shared && <HomeTokuteiBackdrop target={{ key, source, blurRadius }} />}
    <ThemeProvider value={transparentTheme}>{children}</ThemeProvider>
  </View></RootBackdropSource.Provider></InheritedBackdrop.Provider></SceneBackdropWriter.Provider>;
}
const s = StyleSheet.create({ root: { flex: 1 } });
