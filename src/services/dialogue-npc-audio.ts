import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as DeviceSpeech from 'expo-speech';
import { npcAudioClips, npcAudioEntries } from '../data/dialogue-content/npc-audio.generated';
import casting from '../data/dialogue-content/npc-voice-casting.json';
import voices from '../data/jlpt-original/voice-casting.json';

export const voiceCredits = Object.values(voices.roles).map(v => `${v.credit}\n${v.termsUrl}`).join('\n\n');

type Options = { scenarioId: string; turnId: string; category?: string | null; language?: string; rate?: number; onBoundary?: (event: {charIndex: number; charLength: number}) => void; onDone?: () => void; onStopped?: () => void; onError?: () => void };
let current: AudioPlayer | null = null;
let subscription: { remove(): void } | null = null;
let watchdog: ReturnType<typeof setTimeout> | null = null;
let generation = 0;
function release() {
 subscription?.remove(); subscription = null;
 if (watchdog) clearTimeout(watchdog); watchdog = null;
 const player = current; current = null;
 if (player) { try { player.pause(); } finally { player.remove(); } }
}
export async function stop() {
 generation++;
 release();
 await DeviceSpeech.stop();
}
/** Select recordings by exact source AND visual character voice, never just turn position. */
export function recordingFor(text: string, options: Pick<Options, 'scenarioId' | 'turnId' | 'category'>) {
 const entry = npcAudioEntries[options.scenarioId]?.[options.turnId];
 const category = (options.category ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
 const role = (casting.categories as Record<string, string>)[category] ?? casting.fallbackRole;
 const approved = voices.roles[role as keyof typeof voices.roles];
 return entry && entry.sourceJa === text && entry.role === role && entry.speakerId === approved.speakerId && npcAudioClips[entry.clip] !== undefined
  ? { ...entry, source: npcAudioClips[entry.clip] } : null;
}
export function speak(text: string, options: Options) {
 const token = ++generation;
 release();
 const { scenarioId, turnId, category, ...speechOptions } = options;
 const recording = recordingFor(text, { scenarioId, turnId, category });
 const fallback = () => {
  if (token !== generation) return;
  release();
  DeviceSpeech.speak(text, speechOptions);
 };
 // Preserve existing speech for lines not recorded yet; coverage is tracked explicitly.
 if (!recording) { fallback(); return; }
 try {
  const player = createAudioPlayer(recording.source, { updateInterval: 75 });
  current = player;
  let started = false;
  subscription = player.addListener('playbackStatusUpdate', status => {
   if (token !== generation) return;
   if (status.playbackState === 'error') { fallback(); return; }
   if (status.playing) {
    started = true;
    if (watchdog) clearTimeout(watchdog); watchdog = null;
    // Time-proportional reveal, not word alignment; completion follows the actual decoder event.
    const length = Math.min(text.length, Math.floor(status.currentTime / (status.duration || recording.durationMs / 1000) * text.length));
    options.onBoundary?.({ charIndex: length, charLength: 0 });
   }
   if (status.didJustFinish) {
    generation++;
    release();
    options.onDone?.();
   }
  });
  watchdog = setTimeout(() => { if (!started) fallback(); }, 15000);
  player.play();
 } catch { fallback(); }
}
