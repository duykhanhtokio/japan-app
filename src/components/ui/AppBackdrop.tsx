import { createContext, useContext, useLayoutEffect, useRef, useState, type Dispatch, type SetStateAction, type PropsWithChildren } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import { preparedRouteBackdrop } from './prepareSceneRoute';

import { useIsFocused, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import HomeTokuteiBackdrop from './HomeTokuteiBackdrop';

const transparentTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent' } };

type SceneOverride = { owner: object; pathname: string; source: ImageSourcePropType; blurRadius: number };
const SceneBackdropWriter = createContext<Dispatch<SetStateAction<SceneOverride | undefined>> | undefined>(undefined);
export function usePreparedSceneBackdrop(pathname: string, source: ImageSourcePropType | undefined, blurRadius = 0, enabled = true) {
  const writer = useContext(SceneBackdropWriter);
  const focused = useIsFocused();
  const owner = useRef({});
  useLayoutEffect(() => {
    if (!writer || !focused || !source || !enabled) return;
    const identity = owner.current;
    writer({ owner: identity, pathname, source, blurRadius });
    return () => writer(previous => previous?.owner === identity ? undefined : previous);
  }, [writer, focused, pathname, source, blurRadius, enabled]);
}

const BackdropOccluders = createContext<Dispatch<SetStateAction<Set<object>>> | undefined>(undefined);
/** A focused opaque surface owns all pixels; release the hidden root bitmap. */
export function useBackdropOcclusion(opaque: boolean) {
  const writer = useContext(BackdropOccluders);
  const focused = useIsFocused();
  const owner = useRef({}).current;
  useLayoutEffect(() => {
    if (!writer || !focused || !opaque) return;
    writer(previous => new Set(previous).add(owner));
    return () => writer(previous => { const next = new Set(previous); next.delete(owner); return next; });
  }, [writer, focused, opaque, owner]);
}

const InheritedBackdrop = createContext(false);
const RootBackdropSource = createContext<ImageSourcePropType | undefined>(undefined);
export const useInheritedBackdrop = () => useContext(InheritedBackdrop);
export const useRootBackdropSource = () => useContext(RootBackdropSource);

// These routes own their approved scene artwork; every other route shares one
// persistent official backdrop, outside the native stack and safe-area insets.
export function ownsSceneBackdrop(pathname: string) {
  return pathname === '/' || /^\/game(?:\/|$)/.test(pathname);
}
export function AppBackdrop({ pathname, children }: PropsWithChildren<{ pathname: string }>) {
  const { width, height } = useWindowDimensions();
  const [sceneOverride, setSceneOverride] = useState<SceneOverride>();
  const [occluders, setOccluders] = useState<Set<object>>(() => new Set());
  const shared = !ownsSceneBackdrop(pathname);
  const dark = /^\/(?:world|settings|conversation-log|lesson|portal)(?:\/|$)/.test(pathname);
  const prepared = preparedRouteBackdrop(pathname);
  const scene = sceneOverride?.pathname === pathname ? sceneOverride : undefined;
  const source = scene?.source ?? prepared?.source ?? (dark ? require('../../../assets/app/backgrounds/profile-details.png') : require('../../../assets/app/backgrounds/study-light.png'));
  // expo-image halves blurRadius on iOS. Restore the city scene's
  // former RN Image blur without changing clear dialogue backgrounds.
  const blurRadius = scene?.blurRadius ?? (prepared?.city ? (width > height ? 10 : 6) * (Platform.OS === 'ios' ? 2 : 1) : prepared?.blurRadius ?? 40);
  const key = `${typeof source === 'number' ? source : JSON.stringify(source)}:${blurRadius}`;
  return <BackdropOccluders.Provider value={setOccluders}><SceneBackdropWriter.Provider value={setSceneOverride}><InheritedBackdrop.Provider value={shared}><RootBackdropSource.Provider value={shared ? source : undefined}><View style={s.root}>
    {shared && occluders.size === 0 && <HomeTokuteiBackdrop target={{ key, source, blurRadius }} />}
    <ThemeProvider value={transparentTheme}>{children}</ThemeProvider>
  </View></RootBackdropSource.Provider></InheritedBackdrop.Provider></SceneBackdropWriter.Provider></BackdropOccluders.Provider>;
}
const s = StyleSheet.create({ root: { flex: 1 } });
