import { useAudioPlayer } from 'expo-audio';
import { usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';
import { registerPressFeedback } from './EffectPressable';
import { useEffects } from './EffectsProvider';
import { PRESS_SOUND_URI } from './press-sound-data';

export function PressSound() {
  const player = useAudioPlayer({ uri: PRESS_SOUND_URI });
  const pathname = usePathname();
  const { preferences, ready, active } = useEffects();
  const last = useRef(0);
  const seeking = useRef(false);
  // Keep speech, recording and listening routes free of competing UI sounds.
  const quiet = /^\/(?:n[1-5]|jlpt-listening-review|lesson|world\/dialogue|game\/(?:mission|work))(?:\/|$)/i.test(pathname);
  useEffect(() => {
    player.volume = .22;
    if (!ready || !active || !preferences.sound || quiet) {
      player.pause();
      return;
    }
    let mounted = true;
    const unregister = registerPressFeedback(() => {
      if (seeking.current || !player.isLoaded || Date.now() - last.current < 80) return;
      last.current = Date.now();
      seeking.current = true;
      void player.seekTo(0).then(() => { if (mounted) player.play(); })
        .catch(() => {}).finally(() => { seeking.current = false; });
    });
    return () => { mounted = false; unregister(); player.pause(); };
  }, [active, player, preferences.sound, quiet, ready]);
  return null;
}
