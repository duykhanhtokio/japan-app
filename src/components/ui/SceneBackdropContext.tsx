import { createContext, useContext, useLayoutEffect } from 'react';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { artworkKey, type ArtworkProps } from './DisplayedArtwork';

export type SceneArtwork = { pathname: string; artwork: ArtworkProps };
export const SceneBackdropContext = createContext<{ pathname: string; register: (scene: SceneArtwork) => void } | null>(null);

export function useScenePath() {
  const route = useRoute();
  const params = route.params as Record<string, string | string[] | undefined> | undefined;
  const name = route.name.split('/').filter(segment => !/^\(.+\)$/.test(segment))
    .map(segment => segment.replace(/\[\.\.\.([^\]]+)\]|\[([^\]]+)\]/g, (_, rest: string, key: string) => {
      const value = params?.[rest ?? key];
      return Array.isArray(value) ? value.join('/') : String(value ?? '');
    })).join('/').replace(/(?:^|\/)index$/, '');
  return '/' + name;
}

// Full-screen artwork is owned by the persistent app root. A blurred/decoded
// outgoing image survives screen detachment while the new screen registers.
export function useSceneBackdrop(artwork: ArtworkProps, enabled: boolean) {
  const coordinator = useContext(SceneBackdropContext);
  const register = coordinator?.register;
  const activePath = coordinator?.pathname;
  const focused = useIsFocused();
  const pathname = useScenePath();
  const key = artworkKey(artwork);
  useLayoutEffect(() => {
    if (enabled && focused && register && activePath === pathname) register({ pathname, artwork });
    // The key includes source, fit and blur. Root scenes cover the viewport;
    // fresh inline style objects must not create a registration/render loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, focused, register, pathname, activePath, key]);
  return enabled && register !== undefined;
}
