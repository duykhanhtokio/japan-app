import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { AccessibilityInfo, AppState } from 'react-native';

const KEY = 'japan-app:effects:v1';
export type EffectPreferences = { lighting: boolean; motion: boolean; sound: boolean; music: boolean };
const defaults: EffectPreferences = { lighting: false, motion: false, sound: true, music: true };
const EffectsContext = createContext({ preferences: defaults, active: true, reduceMotion: true, ready: false,
  update: (_key: keyof EffectPreferences, _value: boolean) => {} });
export const useEffects = () => useContext(EffectsContext);

export function EffectsProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState(defaults);
  const latest = useRef(defaults);
  const writes = useRef(Promise.resolve());
  const [ready, setReady] = useState(false);
  const [systemReduced, setSystemReduced] = useState(true);
  const [active, setActive] = useState(AppState.currentState === 'active');
  useEffect(() => {
    let mounted = true;
    void AsyncStorage.getItem(KEY).then(raw => {
      if (!mounted || !raw) return;
      const stored = JSON.parse(raw) as Partial<EffectPreferences>;
      const clean = { ...defaults };
      for (const key of Object.keys(defaults) as (keyof EffectPreferences)[]) {
        if (typeof stored?.[key] === 'boolean') clean[key] = stored[key];
      }
      clean.lighting = false;
      clean.motion = false;
      latest.current = clean;
      setPreferences(clean);
    }).catch(error => console.warn('Load effects preferences:', error))
      .finally(() => { if (mounted) setReady(true); });
    let accessibilityEventReceived = false;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (mounted && !accessibilityEventReceived) setSystemReduced(value);
    }).catch(() => {});
    const motion = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      accessibilityEventReceived = true;
      setSystemReduced(value);
    });
    const app = AppState.addEventListener('change', state => setActive(state === 'active'));
    return () => { mounted = false; motion.remove(); app.remove(); };
  }, []);
  function update(key: keyof EffectPreferences, value: boolean) {
    const next = { ...latest.current, [key]: value, lighting: false, motion: false };
    latest.current = next;
    setPreferences(next);
    // Serialize rapid toggles so an older disk write cannot win.
    writes.current = writes.current.then(() => AsyncStorage.setItem(KEY, JSON.stringify(next)))
      .catch(error => console.warn('Save effects preferences:', error));
  }
  return <EffectsContext.Provider value={{ preferences, ready, active,
    reduceMotion: !ready || systemReduced || !preferences.motion, update }}>{children}</EffectsContext.Provider>;
}
