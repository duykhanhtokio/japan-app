import { useEffects } from '@/components/effects/EffectsProvider';
import { DEVELOPMENT_FEATURES } from '@/config/development-features';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

const MUSIC_ROUTES = new Set(['/', '/portal', '/register', '/register/work']);

// Keep the player unmounted outside onboarding. useAudioPlayer loads its source
// immediately, even when playback is paused; Home must not download this track.
export function OnboardingMusic() {
  const pathname = usePathname();
  const { preferences, ready, active } = useEffects();
  // Restore the speaker session after recording without allocating a music player.
  useEffect(() => {
    if (!/^\/(?:n[1-5]|jlpt-listening-review)(?:\/|$)/i.test(pathname)) return;
    void setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true,
      shouldPlayInBackground: false }).catch(error => console.warn('Exam audio route:', error));
  }, [pathname]);
  const onboarding = MUSIC_ROUTES.has(pathname) || pathname.startsWith('/portal/');
  if (!ready || !active || !preferences.music || !onboarding
    || (pathname === '/' && DEVELOPMENT_FEATURES.skipRegistration)) return null;
  return <OnboardingMusicPlayer />;
}

function OnboardingMusicPlayer() {
  const player = useAudioPlayer(require('../../../assets/app/audio/welcome-theme.mp3'));
  const [activated, setActivated] = useState(Platform.OS !== 'web');
  useEffect(() => {
    if (Platform.OS !== 'web' || activated) return;
    const activate = () => setActivated(true);
    window.addEventListener('pointerdown', activate, { once: true });
    window.addEventListener('keydown', activate, { once: true });
    return () => {
      window.removeEventListener('pointerdown', activate);
      window.removeEventListener('keydown', activate);
    };
  }, [activated]);
  useEffect(() => {
    let mounted = true;
    void setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false,
      interruptionMode: 'mixWithOthers' }).then(() => {
      if (!mounted || !activated) return;
      player.loop = true;
      player.volume = .38;
      player.play();
    }).catch(error => console.warn('Onboarding music:', error));
    return () => { mounted = false; player.pause(); };
  }, [activated, player]);
  return null;
}
