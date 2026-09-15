import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';

const MUSIC_ROUTES = new Set([
  '/',
  '/portal',
  '/register',
  '/register/work',
]);

function isMusicRoute(pathname: string) {
  return MUSIC_ROUTES.has(pathname) || pathname.startsWith('/portal/');
}

export function OnboardingMusic() {
  const pathname = usePathname();
  const configured = useRef(false);
  const fadeToken = useRef(0);
  const musicFinished = useRef(false);
  const player = useAudioPlayer(
    require('../../../assets/app/audio/welcome-theme.mp3'),
  );

  useEffect(() => {
    let active = true;
    const token = ++fadeToken.current;

    async function fadeOutAndStop(resetToStart: boolean) {
      const steps = 28;
      const stepDuration = 55;
      const initialVolume = Math.min(Math.max(player.volume, 0), 0.38) || 0.38;

      for (let step = 1; step <= steps; step += 1) {
        await new Promise<void>((resolve) => setTimeout(resolve, stepDuration));
        if (!active || token !== fadeToken.current) return;

        const remaining = 1 - step / steps;
        player.volume = initialVolume * remaining * remaining;
      }

      if (!active || token !== fadeToken.current) return;
      player.pause();
      player.volume = 0.38;
      if (resetToStart) {
        await player.seekTo(0);
        musicFinished.current = true;
      }
    }

    async function syncMusic() {
      try {
        if (!configured.current) {
          await setAudioModeAsync({
            playsInSilentMode: true,
            shouldPlayInBackground: false,
            interruptionMode: 'mixWithOthers',
          });
          configured.current = true;
        }
        if (!active) return;

        player.loop = true;
        player.volume = 0.38;

        if (isMusicRoute(pathname)) {
          if (musicFinished.current) return;
          fadeToken.current = token;
          player.volume = 0.38;
          if (!player.playing) player.play();
          return;
        }

        await fadeOutAndStop(pathname === '/home');
      } catch (error) {
        console.warn('[OnboardingMusic] Không thể đồng bộ nhạc nền:', error);
      }
    }

    void syncMusic();
    return () => {
      active = false;
      if (fadeToken.current === token) fadeToken.current += 1;
    };
  }, [pathname, player]);

  return null;
}
