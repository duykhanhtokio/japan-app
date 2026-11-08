import {releaseOwnedPlayer} from '@/components/audio/owned-player';
import { createAudioPlayer } from 'expo-audio';
import { usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';
import { registerPressFeedback } from './EffectPressable';
import { useEffects } from './EffectsProvider';
import { PRESS_SOUND_URI } from './press-sound-data';

export function PressSound() {
  const pathname = usePathname();
  const { preferences, ready, active } = useEffects();
  const last = useRef(0);
  // Keep speech, recording and listening routes free of competing UI sounds.
  const quiet = /^\/(?:n[1-5]|jlpt-listening-review|lesson|world\/dialogue|game\/(?:mission|work))(?:\/|$)/i.test(pathname);
  useEffect(() => {
    if (!ready || !active || !preferences.sound || quiet) return;
    const player = createAudioPlayer({ uri: PRESS_SOUND_URI });
    player.volume = .22;
    let mounted = true;
    let seeking = false;
    const unregister = registerPressFeedback(() => {
      if (seeking || !player.isLoaded || Date.now() - last.current < 80) return;
      last.current = Date.now();
      seeking = true;
      void player.seekTo(0).then(() => { if (mounted) player.play(); })
        .catch(() => {}).finally(() => { seeking = false; });
    });
    return () => { mounted = false; unregister(); releaseOwnedPlayer(player); };
  }, [active, preferences.sound, quiet, ready]);
  return null;
}
